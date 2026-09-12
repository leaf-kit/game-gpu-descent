# 03. 미시 구조 연구 (Micro Structure): SM 아래로 — 게이트, SRAM, DRAM, 트랜지스터, 배선, 실리콘 결정

> 게임 "GPU 속으로 내려가기"의 가장 깊은 레벨 설계를 위한 사실 조사 문서.
> 기준 칩: NVIDIA H100 (GH100, TSMC "4N" = N5 계열 커스텀 노드). 공정 수치는 공개된 TSMC N5 데이터로 대체하며, 4N 고유 수치는 비공개.
> 표기 원칙: 문헌으로 확인된 값은 출처 번호 [n]을 붙임. 계산·추정치는 **(추정)**, 확인 불가한 값은 **(미확인)**으로 표시.
> 최종 조사일: 2026-09-12

---

## 0. 한눈에 보는 핵심 수치 (Quick Facts)

| 항목 | 값 | 출처 |
|---|---|---|
| H100 트랜지스터 수 / 다이 면적 | 800억 개 / 814 mm² | [H1] |
| H100 SXM5 부스트 클럭 | 1,980 MHz → 1주기 ≈ 0.505 ns | [H1][H2] |
| 활성 SM 수 (SXM5) / 풀 다이 | 132 / 144 | [H1][H3] |
| L2 캐시 | 50 MB (풀 다이 60 MB) | [H3] |
| SM당 레지스터 파일 | 256 KB = 65,536 × 32-bit | [H4] |
| SM당 L1/공유메모리 | 256 KB | [H3] |
| HBM3 | 5 스택, 5,120-bit, ≈5.23 Gbps/pin, 3.35 TB/s | [M1] |
| TSMC N5 논리 밀도 (2-fin HD) | ≈138 MTr/mm² (실측 기반) | [P1][P2] |
| N5 접촉 게이트 피치 (CPP) | ≈51 nm (실측) / 48 nm (초기 추정) | [P1][P2] |
| N5 핀 피치 / M0 피치 | 28 nm / 28 nm | [P1][P3] |
| N5 표준셀 높이 | 210 nm (6-track, M2 피치 35 nm) | [P1][P3] |
| N5 HD SRAM 셀 | 0.021 μm² (ISSCC 2020 / IEDM 2019) | [S1][S2] |
| 실리콘 격자 상수 | 0.5431 nm (300 K) | [Si1][Si2] |
| 실리콘 밴드갭 | 1.12 eV (300 K) | [Si1] |

---

## 1. CUDA 코어에서 게이트까지 (From CUDA Core to Gates)

### 1.1 FP32 FMA 유닛은 무엇으로 만들어지나
"CUDA 코어" 하나의 실체는 **FP32 융합 곱셈-덧셈 유닛(Fused Multiply-Add, FMA)** 이다. `d = a × b + c`를 한 번의 반올림으로 계산한다. IEEE-754 단정도(32-bit)는 부호 1비트 + 지수 8비트 + 가수 23비트(숨은 1을 더해 24비트)로 이루어진다.

내부 블록 (문헌 공통 구조 [F1][F2]):
1. **가수 곱셈기 배열 (Mantissa multiplier array)**: 24 × 24비트 곱셈 → 48비트 중간값. Booth 인코딩 + Wallace/Dadda 트리 형태의 부분곱 압축기(3:2 CSA)로 구성. 가장 큰 블록.
2. **정렬 시프터 (Alignment shifter)**: 덧셈 피연산자 c의 가수를 지수 차이만큼 밀어 맞춤(≈76비트 폭 [F2]).
3. **캐리 전파 덧셈기 (Carry-propagate adder)**: 곱과 정렬된 c를 더함 (≈48–76비트).
4. **선행 0 예측기 / 정규화기 (Leading-zero anticipator, Normalizer)**: 결과의 맨 앞 1을 찾아 왼쪽으로 밀고 지수를 조정.
5. **반올림 (Rounding)**: guard/round/sticky 비트로 IEEE 반올림.
6. **지수 로직 (Exponent logic)**과 예외 처리(NaN, Inf, denormal).
7. **파이프라인 레지스터**: 여러 단계로 나뉘어 매 클럭 새 명령을 받아들임.

**규모 추정** (문헌에 단일 FP32 FMA의 정확한 게이트 수는 거의 공개되지 않음):
- 흔한 경험식: n비트 곱셈기 ≈ 7n² 게이트 → 24비트: ≈4,000 NAND2 등가 게이트 [F3].
- 시프터·덧셈기·정규화기·반올림·파이프라인 래치 포함 → **약 1만~2.5만 NAND2 등가 게이트 ≈ 4만~10만 트랜지스터 (추정)** [F1][F3].
- 참고: 나눗셈/제곱근 근사기까지 포함한 전체 FPU는 "1/3~1/2 백만 트랜지스터" 수준으로 언급됨 (0.13 μm 시대 포럼 추정, 미확인) [F4].
- H100 SM에는 FP32 유닛 128개 (4개 파티션 × 32) [H1] → SM당 FP32 데이터패스만 대략 **500만~1,300만 트랜지스터 (추정)**.

게임 표현 제안: FMA를 "곱셈 공장(부분곱 그리드) → 정렬 컨베이어 → 덧셈 합류 → 정규화 크레인 → 반올림 검사대"의 5구역 공장으로.

### 1.2 텐서 코어는 물리적으로 무엇을 하나
텐서 코어는 작은 행렬 곱셈-누산(MMA, Matrix Multiply-Accumulate)을 **한 명령으로** 수행하는 전용 MAC(곱셈-누산기) 배열이다. 각 요소는 저정밀(FP16/BF16/FP8/TF32/INT8) 곱셈기 + 더 넓은 정밀도(FP32) 누산기 트리로 이루어진 **내적(dot-product) 유닛**들의 집합이며, 시스톨릭 배열과 유사하게 피연산자를 공유해 레지스터 파일 대역폭을 절약한다 [T1][T2].

**세대별 SM당 밀집(dense) FP16 FMA/clk (검증)** [T1][T2]:
| 세대 | 텐서코어/SM | 텐서코어당 FP16 FMA/clk | SM당 FMA/clk | SM당 FLOP/clk |
|---|---|---|---|---|
| Volta V100 | 8 | 64 | 512 | 1,024 |
| Ampere A100 (3세대) | 4 | 256 | **1,024** | 2,048 |
| Hopper H100 (4세대) | 4 | 512 | **2,048** | 4,096 |

→ 과제에서 언급된 "SM당 1024 FMA/clk"는 **A100**의 수치이며, H100은 이를 2배로 늘린 **2,048 FMA/clk/SM** 이다 [T1][T2]. FP8은 다시 2배.

검산 (계산): 132 SM × 4,096 FLOP/clk × 1.83 GHz ≈ 989 TFLOPS — NVIDIA 공표 H100 SXM5 밀집 FP16 텐서 989.4 TFLOPS와 일치. 즉 텐서 피크는 약 1,830 MHz(텐서 부스트 클럭)에서, CUDA 코어 FP32 66.9 TFLOPS는 132 × 128 × 2 × 1.98 GHz에서 산출된다 [T2] (클럭 구분은 NVIDIA 포럼 분석 기반, 추정).

### 1.3 워프 스케줄러와 스코어보드
- SM은 4개의 **처리 파티션(processing block)** 으로 나뉘고, 각 파티션은 워프 스케줄러 1개 + 디스패치 유닛 + FP32 32개 + INT32 16개 + FP64 16개 + 텐서코어 1개 + LD/ST + SFU + 64 KB 레지스터 파일을 가진다 [H1][W1]. 워프는 `warp_id % 4` 로 파티션에 고정 배정된다 (Volta 마이크로벤치) [W1].
- 스케줄러는 매 클럭 준비된(ready) 워프 하나를 골라 명령 1개를 발행한다. Hopper SM은 최대 64개 워프를 상주시킨다 [H3].
- **의존성 추적**: NVIDIA GPU는 Volta 이후 128-bit 고정 길이 명령어에 **제어 코드(control code)** 를 실어 컴파일러가 스톨 카운트·의존성 배리어(6개의 스코어보드 SB0–SB5)·재사용 캐시 플래그를 지정한다 [W1][W2][W3]. 가변 지연 명령(메모리 접근 등)은 하드웨어 스코어보드로 완료를 추적한다.
- MICRO 2025 역공학 논문에 따르면 현대 NVIDIA GPU는 학계 시뮬레이터가 가정한 **오퍼랜드 컬렉터(operand collector)를 사용하지 않으며**, 고정 지연 명령은 Issue → Control → Allocate → (3사이클 오퍼랜드 읽기) → Execute 순으로 흐른다 [W3].

### 1.4 레지스터 파일 뱅크
- SM당 256 KB (65,536 × 32-bit) [H4]; 파티션당 64 KB = 16,384 엔트리 [W1].
- Volta/Turing 마이크로벤치: 파티션의 레지스터 파일은 **2개 뱅크**, 각 뱅크는 32-bit 듀얼 포트. 레지스터 번호 modulo-2로 뱅크 결정. FFMA처럼 3개 소스가 같은 뱅크에 몰리면 **뱅크 충돌(bank conflict)** 로 스톨 [W1]. 예: `FFMA R6, R97, R99, RX` 에서 RX가 홀수면 충돌, `R98, R99` 조합은 무충돌.
- 완화 기법: **레지스터 재사용 캐시(register reuse cache)** 슬롯 4개 (재사용 플래그 비트) [W1]; 컴파일러의 레지스터 할당.
- 물리적으로는 다중 포트 SRAM 매크로: 6T 셀에 읽기/쓰기 포트 트랜지스터를 추가한 8T~10T 셀이 흔히 쓰이나, NVIDIA의 실제 셀 구조는 **미확인**.
- 정보용 계산 (추정): SM 1개 레지스터 파일 2,097,152비트 × 6T ≈ **1,260만 트랜지스터**(셀만). 132 SM 합계 ≈ 2.77억 비트 ≈ 16.6억 트랜지스터.

---

## 2. 논리 게이트와 표준 셀 (Logic Gates & Standard Cells)

### 2.1 CMOS 기본 게이트의 트랜지스터 수 [G1][G2]
| 게이트 | 트랜지스터 수 | 구조 |
|---|---|---|
| 인버터 (NOT) | 2 | PMOS 1 (풀업) + NMOS 1 (풀다운) |
| NAND2 | 4 | PMOS 2 병렬 + NMOS 2 직렬 |
| NOR2 | 4 | PMOS 2 직렬 + NMOS 2 병렬 |
| AND2 / OR2 | 6 | NAND/NOR + 인버터 |
| NAND3 / NOR3 | 6 | n입력 → 2n |
| XOR2 | 8~12 | 전송 게이트 또는 복합 게이트 (구현별) |
| 전가산기 (Full adder) | ≈28 | 미러 가산기 (교과서 값) |
| D 플립플롭 (마스터-슬레이브) | ≈20~24 | 트라이스테이트 인버터 4개(16T) + 클럭 인버터 + 출력 버퍼 [G2] |
| 6T SRAM 셀 | 6 | 인버터 2 + 액세스 2 |

CMOS 원리: PMOS는 입력 0에서 켜져 출력을 VDD로, NMOS는 입력 1에서 켜져 출력을 GND로 끌어내린다. 정적 상태에서 둘 중 하나만 켜지므로 **정적 전류가 (이상적으로) 0** — 이것이 CMOS가 지배적인 이유. 실제로는 누설 전류가 존재 (7절).

### 2.2 표준 셀 라이브러리 (Standard Cell Library)
- 칩 설계는 수백 종의 미리 그린 "표준 셀"(인버터, NAND, 플립플롭, 멀티플렉서…)을 행(row)에 줄지어 놓고 배선으로 잇는다. 모든 셀은 **같은 높이**를 가져 VDD/GND 레일이 맞닿는다 [G3].
- 셀 높이는 M2 배선 트랙 수로 표현: N5 HD 라이브러리는 **6-track, 높이 210 nm** (M2 피치 35 nm × 6) [P1][P3]. NMOS 2핀 + PMOS 2핀 구성 [P3]. 7.5-track 고성능 셀도 병용된다 [G4].
- Apple A14(N5)의 CPU 영역은 6-track 라이브러리로 구현됨 (TechInsights) [P4].
- 셀 너비는 CPP(51 nm)의 정수배: 인버터 ≈ 2 CPP(≈102 nm), NAND2 ≈ 3 CPP, DFF ≈ 15~20 CPP (일반적 경험치, 추정).

### 2.3 트랜지스터 밀도 (Transistor Density)
- TSMC N5 2-fin HD 논리 밀도: **≈137.6 MTr/mm²** (Angstronomics, A15 SEM 실측 210 nm × 51 nm 기준) [P1]. WikiChip 초기 추정 171.3 MTr/mm²는 CPP 48 nm/MMP 30 nm 가정에 기반한 값 [P2].
- 실제 칩 혼합 밀도: Apple A14 118억 Tr / 88 mm² ≈ 134 MTr/mm² [P5]; **H100: 800억 / 814 mm² ≈ 98 MTr/mm²** (SRAM·I/O·HBM PHY 포함 평균, 계산).
- N4: N5 대비 **≈6% 밀도 향상**, N4P: 성능 +11%, 전력효율 +22%, 밀도 +6% (TSMC/WikiChip) [P6][P7]. NVIDIA "4N"은 N5 계열의 NVIDIA 전용 커스텀 변형이며 TSMC는 PPA를 공개하지 않음 [P8].

### 2.4 머리카락 단면에 트랜지스터 몇 개?
- 사람 머리카락 지름: 17~181 μm, 대표값 70~75 μm [X1].
- 지름 70 μm 원 단면적 = π × (35 μm)² ≈ 3,850 μm² = 3.85 × 10⁻³ mm².
- × 138 MTr/mm² (N5 HD 논리) ≈ **약 53만 개**; × 98 MTr/mm² (H100 평균) ≈ **약 38만 개** (계산).
- 즉 머리카락 한 올 단면 위에 1990년대 초 CPU(Intel 486: 120만 Tr)의 절반 가까운 트랜지스터가 들어간다.

---

## 3. SRAM: 레지스터, L1, L2 (Static RAM)

### 3.1 6T 셀 동작
- 구조: **교차 결합된 인버터 2개**(4T)가 래치를 이루어 0/1을 유지하고, **액세스 트랜지스터 2개**(NMOS)가 워드라인(WL)에 의해 열려 셀 내부 노드를 비트라인 쌍(BL, /BL)에 연결한다.
- **읽기**: BL/​/BL을 VDD로 프리차지 → WL 활성 → 0을 저장한 쪽 비트라인이 미세하게 방전 → 차동 **센스 앰프(sense amplifier)** 가 수십 mV 차이를 증폭. 읽는 동안 셀이 뒤집히지 않도록 풀다운 NMOS > 액세스 NMOS (β 비율, read stability).
- **쓰기**: 한쪽 비트라인을 GND로 강제 → 액세스 트랜지스터가 래치를 이겨 뒤집음 (액세스 > 풀업 PMOS, write-ability). 저전압에서 쓰기가 어려워 N5 SRAM은 **write-assist** 회로(음의 비트라인, WL 부스트 등)를 사용 [S1].
- 전원이 있는 한 데이터 유지 → 리프레시 불필요 (DRAM과의 차이).

### 3.2 N5 SRAM 셀 크기와 밀도
- HD(고밀도) 6T 셀 **0.021 μm²**, HC(고전류) 셀 0.025 μm² — 발표 당시 세계 최소 [S1][S2]. IEDM 2019 Yeap et al. "5nm CMOS Production Technology Platform…" 및 ISSCC 2020 135 Mib 테스트칩.
- 0.021 μm² ≈ 대략 0.1 μm × 0.21 μm (셀 높이는 셀 라이브러리 높이와 유사한 종횡비 약 2:1, 추정).
- 매크로(주변회로 포함) 밀도: 약 30 Mib/mm² 급 (N3E 31.8 Mib/mm²와 동일 셀) [S3].
- SRAM 셀은 4.1 GHz @ 0.85 V 동작 시연 [S1].

### 3.3 H100 L2 50 MB의 물리 규모 (계산, 추정)
- 50 MB = 50 × 2²⁰ × 8 = **419,430,400 비트 ≈ 4.2억 비트**.
- × 6 트랜지스터 = **약 25억 트랜지스터** (셀만; ECC 비트·디코더·센스앰프·태그 제외). 풀 다이 60 MB → 약 30억.
- 셀 면적: 4.2 × 10⁸ × 0.021 μm² ≈ **8.8 mm²** (셀만). 주변회로 포함 30 Mib/mm² 가정 시 ≈ 13~14 mm² — 다이의 약 2%.
- H100 L2는 2개 파티션으로 나뉘어 있고, 먼 파티션 접근은 가까운 쪽보다 약 2배 느리다. 근접 파티션 읽기 대역 >5.5 TB/s, 전체 3.8 TB/s (Chips and Cheese 측정) [H3].
- 800억 Tr 중 SRAM(L2 25억 + RF 16.6억 + L1/SMEM 16.6억 + L0/텍스처 등)이 최소 60억 이상 → **전체의 8~10% (추정)**.

### 3.4 SRAM 스케일링 정체 (N3에서의 멈춤)
- IEDM 2022: **N3E HD SRAM 셀 = 0.021 μm², N5와 동일** (0% 축소). N3B는 0.0199 μm²로 5%만 축소 [S3][S4]. 논리는 1.6~1.7배 밀도 향상인데 SRAM은 정체 → 칩에서 SRAM 면적 비중이 커짐 ("SRAM의 죽음?" — WikiChip).
- 원인: SRAM 셀은 이미 최소 피치의 핀 1개·최소 CPP로 그려져 있어 논리보다 먼저 리소그래피·변동성 한계에 부딪힘; 저전압 마진(Vmin) 확보가 어려움.
- N2(GAA 나노시트): HD 셀 ≈0.0175 μm², 38 Mb/mm² 로 다시 축소 (TSMC IEDM 2024 / ISSCC 2025; 일부 보도는 0.021 셀 + DTCO 1.1×로 기술해 상충) [S5][S6] (세부 미확인).

---

## 4. DRAM / HBM 셀 (Dynamic RAM & High Bandwidth Memory)

### 4.1 1T1C 셀
- 트랜지스터 1개 + 커패시터 1개. 커패시터 충전 = 1, 방전 = 0 [D1].
- 커패시터는 지름 수십 nm, 높이 ~1,000 nm의 극단적 종횡비(≈100:1) 기둥. 용량 **6~7 fF**, 갓 쓴 상태에서 약 **4만 개 전자** 저장 (SemiAnalysis) [D2]. 교과서 시대 값은 25~30 fF [D3].
- 읽기는 파괴적: 비트라인에 전하를 나누어 센스 앰프가 감지 → 판별 후 다시 써넣음(restore).
- 누설로 전하가 새므로 **리프레시** 필요: JEDEC 표준 **64 ms** 창(tREFW; DDR4), 8,192회 REF 명령 → **tREFI 7.8 μs**; DDR5는 32 ms/3.9 μs [D4]. 85 °C 초과 시 리프레시 주기 절반 (일반 JEDEC 관행, HBM3 구체 값 미확인). 리프레시가 대역폭 5~10%, DRAM 전력 10%+를 소모 [D1].

### 4.2 왜 DRAM은 별도 다이인가
- DRAM 커패시터 공정(깊은 트렌치/스택 커패시터, 고유전 재료)과 논리 공정(FinFET, 15층 구리 배선)은 열예산·재료·설계규칙이 완전히 다르다. 한 웨이퍼에서 둘 다 최적화하면 비용·수율이 나쁘다. 임베디드 DRAM(eDRAM)이 존재하지만 밀도·비용 면에서 상용 DRAM에 크게 뒤진다.
- 해법: 논리 다이 옆에 DRAM 다이를 **2.5D 실리콘 인터포저(CoWoS)** 로 붙이고 짧은 배선 수천 개로 연결 → HBM.

### 4.3 HBM3 스택 구조 [M2][M3][M4]
- **로직 베이스 다이** 1개 위에 DRAM 코어 다이 **8단(8-Hi)** 또는 12단을 쌓음. 각 다이 두께 30~50 μm, JEDEC 스택 총 높이 한계 720 μm (HBM3), 775 μm (HBM4) [M3].
- **TSV(Through-Silicon Via)**: 다이를 수직 관통하는 구리 기둥. 지름 **5~10 μm**, 피치 **40~50 μm**, 종횡비 10~20:1, 다이당 수천 개 (2차 자료 종합, 벤더 논문 수치는 미확인) [M4][M5]. HBM4는 2만 개 이상의 TSV [M5].
- **마이크로범프(micro-bump)**: 다이 사이 접합, 지름 ≈20 μm, 피치 30~55 μm [M3]. 하이브리드 본딩은 10 μm 미만 피치를 목표 [M3].
- 인터페이스: **1,024-bit** = **16 채널 × 64-bit** = **32 의사채널(pseudo channel) × 32-bit**, 버스트 길이 8 → 32바이트 접근 단위 [M2].
- 의사채널당 **16 뱅크 (4 뱅크그룹 × 4)**, 채널당 32 뱅크(2-SID 스택은 64) [M6]. 페이지(row) 크기 의사채널당 **1 KB** [M6].
- 주소 지정: 스택 → 채널 → 의사채널 → 뱅크그룹 → 뱅크 → 행(row) → 열(column). ACT 명령으로 행을 열어 **행 버퍼(row buffer, 센스앰프)** 에 복사 → RD/WR → PRE로 닫음. 같은 뱅크에서 다른 행을 열려면 PRE→ACT가 필요(row miss). tFAW: 롤링 창 내 최대 4개 뱅크 활성화 [M6].
- **속도**: HBM3 최대 **6.4 Gbps/pin → 819.2 GB/s/스택** (16 × 64 × 6.4 / 8) [M2]. **HBM3E 9.6 Gbps/pin → ≈1.2 TB/s/스택** (1,229 GB/s), 12-Hi 36 GB [M2]. HBM4: 2,048-bit, 32채널/64의사채널, 8 Gbps → 2 TB/s/스택 [M2].
- **H100 SXM5 실제**: 5 스택 활성(6 자리 중), 5,120-bit, 3.35 TB/s → **≈5.23 Gbps/pin** (계산; 스택당 ≈670 GB/s, HBM3 최대치 아래로 동작) [M1].
- HBM3는 **온다이 ECC**(16-bit 심볼 정정 Reed-Solomon, 12.5% 리던던시)와 시스템 ECC의 2계층 보호 [E1][E2]. 코어 전압 1.1 V [M2].

---

## 5. 트랜지스터: TSMC N5/N4 FinFET (Transistor)

### 5.1 구조
- **핀(fin)**: 실리콘 기판에서 세로로 깎아 올린 얇은 판. 전류가 흐르는 채널.
- **게이트(gate)**: 핀의 **3면(양 옆 + 위)** 을 감싸 채널을 제어. 유효 채널 폭 W_eff = 2 × H_fin + W_fin [P9].
- **게이트 스택**: 실리콘 표면의 얇은 SiO₂ 계면층(≈0.5~1 nm) → **high-k HfO₂ (≈1.5~2 nm)** → TiN/TaN 일함수 금속 (각 1~3 nm) → TiAl(NMOS 일함수) → W 또는 Co 충전 (TSMC 특허 두께 범위; N5 실제 값 미공개) [K1][K2]. 유효 산화막 두께(EOT)는 ≈0.5~1 nm 급으로 **SiO₂ 원자층 2~4개에 해당** (추정) [K1].
- **소스/드레인 에피택시**: PMOS는 SiGe(압축 응력 → 정공 이동도↑), NMOS는 SiP/SiC. N5는 **PMOS 채널 자체에 SiGe(High Mobility Channel, Ge ≈37% 추정)를 도입한 최초 양산 로직 공정** — 18% 성능 이득 [P2][P10].
- **접촉**: 소스/드레인 위 실리사이드(TiSi) + 금속 플러그(Co/W) → M0.
- **STI**: 핀 사이 얕은 트렌치 절연 산화막.
- 왜 FinFET인가: 평면 트랜지스터는 20 nm급 게이트에서 드레인 전계가 채널을 지배(단채널 효과, DIBL)해 껐는데 새는 문제 발생. 3면 게이트는 정전 제어를 회복시켜 서브스레숄드 스윙 ≈62~64 mV/dec (ASAP7 예측 모델) [V1].

### 5.2 치수 (N5 기준)
| 항목 | 값 | 비고 |
|---|---|---|
| 핀 피치 (fin pitch) | **28 nm** | A15 SEM 실측 [P1]; WikiChip 추정 25~26 nm [P2] |
| 핀 폭 (fin width) | ≈5~6 nm | TSMC 실측치 비공개; 5 nm급 TCAD 5~6 nm [V2], TSMC 특허 4~15 nm [V3] **(미확인)** |
| 핀 높이 (fin height) | ≈50~55 nm | 5 nm급 시뮬레이션 최적 50~60 nm [V2]; TSMC 특허 40~80 nm [V3] **(미확인)** |
| 접촉 게이트 피치 (CPP) | **51 nm** 실측 [P1] / 48 nm 추정 [P2] | N3B 45 nm [S4] |
| 물리 게이트 길이 (Lg) | ≈16~20 nm | CPP − 2×스페이서 − 콘택트 폭 (추정, 미공개) |
| 디바이스당 핀 수 | HD 셀 2핀 (N/P 각각) [P3]; 고성능 셀 3핀 | |
| M0 최소 피치 | **28 nm** [P1][P3] | N7 40 nm 대비 −30% |
| 공급 전압 | ≈0.7~1.0 V (SRAM 시연 0.85 V [S1]) | 4N 실제 VDD 미공개; 저전압 코너 0.5~0.6 V |
| 문턱 전압 (Vt) | ≈0.2~0.35 V (SVT/LVT/ULVT 다중 Vt, 일함수 금속으로 조정) | 정확 값 NDA **(미확인)** [V1][V4] |

**"4 nm"의 실제 의미**: 4 nm는 어떤 물리 치수도 아니다. N5/N4의 가장 작은 피치는 핀/M0 28 nm, CPP 51 nm, 핀 폭 ≈6 nm이다 [P1][P11]. 노드 이름은 약 28 nm 세대 이후 "동등한 밀도 향상을 냈다면 붙였을 이름"의 마케팅 관행이며, N4는 N5의 설계 규칙 호환 개량판(밀도 +6%), 4N은 NVIDIA 전용 조정판 [P6][P8].

### 5.3 스위칭과 전자
- 스위칭 시간: FO4 인버터 지연 ≈6~8 ps (ASAP7 예측 [V1]); 링 오실레이터 게이트 지연 수십 ps [I1]. 1.98 GHz 주기 505 ps 안에 논리 게이트 수십 단이 직렬로 동작한다.
- **스위칭당 전자 수 (추정)**: 핀 1개 게이트 용량 ≈50~80 aF (EOT ≈0.9 nm, W_eff ≈106 nm, Lg ≈18 nm 기준 계산; MIT 강의 모델 ≈1 aF/nm 게이트 길이 [Q1]). Q = C·V = 60 aF × 0.75 V ≈ 45 aC ≈ **전자 ≈280개/핀**. 2핀 디바이스 ≈500~600개; 팬아웃과 배선(0.2~0.5 fF)을 포함한 실제 게이트 1회 스위칭은 **약 1,000~3,000개 전자** (추정) [Q1][Q2]. 에너지 ≈ ½CV² ≈ 0.05~0.15 fJ.
- 전자 통과 시간: 포화 속도 ≈10⁷ cm/s = 100 km/s [Si1] → 20 nm 채널 통과 ≈0.2 ps (준탄도 수송 영역).
- 게이트 산화막 원자층: SiO₂ 1층 ≈0.3 nm. 1.2 nm 이하 SiO₂는 직접 터널링으로 누설이 폭증해 Intel이 45 nm(2007)부터 **HfO₂ high-k(k≈25, SiO₂의 6배)** 를 도입 — 같은 용량에 물리 두께 ~5배 확보로 NMOS 누설 25배, PMOS 1,000배 감소 [K3][K4].

### 5.4 비교: N2 GAA 나노시트
- N2(2025년 4분기 양산)는 핀 대신 **수평 실리콘 시트를 여러 장 쌓고 게이트가 4면을 완전히 감싸는(Gate-All-Around)** 나노시트 트랜지스터 [N1][N2]. 시트 두께 수 nm, 3장 적층이 일반적(IBM 시제품 3장) 이나 TSMC의 시트 폭·두께·장수는 **미공개** [N2].
- N3 대비 동일 전압에서 전력 −24~35% 또는 성능 +15%, 밀도 1.15× [N1]. **NanoFlex**: 시트 폭을 셀별로 바꿔 "1.5핀" 같은 중간 구동력 구현 [N2].

---

## 6. 배선 (BEOL, Back-End-Of-Line Interconnect)

### 6.1 층 구조
- TechInsights의 Apple C1(N4) 분석: **구리 15층 + 최상단 알루미늄 1층 = 총 16 금속층** [B1]. N5 동일 계열이므로 H100(4N)도 유사한 15±1층 구리로 추정 (**미확인**).
- 계층: M0/M1(최소 피치 28 nm급, EUV 단일 노광) → 중간층(수십~100 nm급) → 상위 굵은 층(수백 nm~μm, 전원·클럭·긴 신호) → 알루미늄 패드층 → 범프.
- N5는 EUV를 10층 이상(최대 14층 보도)에 사용해 액침 다중 패터닝 약 35층을 대체 [P2][B2]. N5 총 마스크 수 약 81장 [P2].
- 비아(via): 아래위 층을 잇는 수직 기둥. 최소층 비아 폭 ≈ 선폭(≈14~18 nm) (추정).

### 6.2 구리 다마신 (Copper Damascene)
1. 저유전율(low-k) 절연막 증착 → 2. 홈(트렌치)과 비아 구멍 식각 → 3. 확산 방지막 **TaN 배리어** + **Co 또는 Ru 라이너** 각 수 Å~2 nm (TSMC 특허: 라이너 5~25 Å) [B3] → 4. Cu 시드 + 전해도금 충전(N5는 Cu 리플로우로 미세 홈 충전) [P2] → 5. CMP로 평탄화 → 6. Co 캡 / 에치스톱 막. 층마다 반복.
- **저유전율 절연막**: SiO₂(k=3.9) 대신 다공성 SiCOH(k≈2.5~3.0)로 배선 간 정전용량 감소 [B4].

### 6.3 왜 배선이 트랜지스터보다 느려졌나
- 배선 지연 ≈ R·C·L²/2. 트랜지스터는 축소할수록 빨라지지만, 선폭을 줄이면 R↑, 간격을 줄이면 C↑ → **글로벌 배선 지연은 오히려 증가** [I1][I2]. 1980년대 중반엔 게이트 지연이 지배, 지금은 지연의 대부분이 배선 [I2].
- **구리 크기 효과**: 전자 평균자유행로 ≈40 nm. 선폭이 그보다 작아지면 표면·결정립계 산란으로 비저항 급증: 벌크 1.7 μΩ·cm → 18 nm 선폭 ≈9 μΩ·cm (5배) [B5][B6].
- 해법: 긴 배선에 **리피터(버퍼)** 삽입, 상위 굵은 층 사용, Co/Ru 등 짧은 평균자유행로 금속, 후면 전원 공급(BSPDN, N2 이후).
- **일렉트로마이그레이션(electromigration)**: 높은 전류밀도에서 전자가 구리 원자를 밀어내어 보이드/힐록 생성. 수명 MTTF = A·J⁻ⁿ·exp(Ea/kT) (Black 식); 접합온도 20 °C 상승이 수명을 2~5배 단축 → 105~125 °C 최악 조건으로 사인오프 [B7][B8]. 구리는 알루미늄보다 약 5배 전류밀도 허용 [B7].

### 6.4 전원망과 클럭 트리
- **전원 공급망(PDN)**: 범프 → 최상위 굵은 층 격자 → 아래층으로 내려오는 스트랩 → 표준셀 VDD/VSS 레일(M0/M1). H100 700 W ÷ ~0.8 V ≈ **수백 A** 급 전류 (계산) — IR 드롭과 di/dt 노이즈를 온칩 디커플링 커패시터로 억제.
- **클럭 트리**: 위상 고정 루프(PLL)에서 나온 클럭을 H-트리/메시로 수천만 플립플롭에 스큐 최소화하며 분배. GPU는 클럭 도메인을 나누고, 텐서 코어 등은 별도 부스트 클럭을 가짐 (1.3절).

### 6.5 배선 총길이
- Applied Materials: 최첨단 칩 1개에 **60마일(≈100 km) 이상**의 구리 배선, 금속 18층 [B9]. IEEE Spectrum: "수십 km, 약 15층" [B10]. 2012년 MIT TR: 약 100 km [B11].
- 오래된 경험치(90 nm, 2007): ≈1.76 m/mm² [B12] → 814 mm²에 ≈1.4 km. 최신 노드는 층수·밀도 증가로 수십 배 → **H100 급 대형 다이는 수백 km 이상 (추정, 미확인)**.

---

## 7. 실리콘 결정과 물리 (Silicon Crystal & Physics)

### 7.1 결정 구조
- **다이아몬드 입방 격자(diamond cubic)**: 각 Si 원자가 4개 이웃과 공유결합해 사면체 구성 [Si2]. 격자 상수 **a = 0.5431 nm (5.431 Å, 300 K)** [Si1][Si2].
- 단위정 안 원자 8개 → 원자 밀도 = 8 / (0.5431 nm)³ ≈ **4.99 × 10²² 개/cm³** (계산). 최근접 원자 간 거리 = a√3/4 ≈ 0.235 nm.
- 원자 반지름 ≈0.11 nm(공유) — "0.1 nm" 스케일.
- 게임 단위 환산: 핀 폭 6 nm ≈ 격자 11개 ≈ 원자 약 22~25층; 게이트 길이 18 nm ≈ 격자 33개.

### 7.2 도핑 (Doping)
- 순수 실리콘은 300 K에서 자유 전자 nᵢ ≈ 1 × 10¹⁰ /cm³ 로 거의 절연체 [Si1].
- **n형**: 인(P)·비소(As) — 5족, 전자 1개 여분. **p형**: 붕소(B) — 3족, 정공 1개.
- 농도: 기판/채널 ≈10¹⁵~10¹⁸ /cm³, 소스/드레인·에피 ≈10²⁰~10²¹ /cm³ [Si3][Si4]. 10²⁰ /cm³ = 실리콘 원자 500개당 불순물 1개. 10¹⁹ 이상에서 밴드갭 협착 발생 [Si3].
- 핀 폭 6 nm × 높이 50 nm × 길이 18 nm ≈ 5,400 nm³ = 5.4 × 10⁻¹⁸ cm³; 채널 도핑 10¹⁷ /cm³이면 채널 안 불순물 원자 ≈0.5개 → **채널이 사실상 무도핑**이고 도펀트 하나의 위치가 소자 특성을 바꾸는 **랜덤 도펀트 변동(RDF)** 이 문제가 된다 (계산·추정).

### 7.3 밴드갭과 전자 수송
- 밴드갭 **1.12 eV (300 K)**; Ge 0.67 eV [Si1]. 밴드갭이 적당히 커서 상온 누설이 작고, 산화막(SiO₂)이 안정적으로 자라서 실리콘이 채택됨.
- 전자 이동도 ≈1,400 cm²/V·s(저도핑 벌크), 정공 ≈450. 포화 드리프트 속도 **≈1 × 10⁷ cm/s** (±20%) [Si1][Si5]. 0.75 V/20 nm ≈ 3.75 × 10⁵ V/cm 로 채널 전계는 포화 영역.
- 열: 실리콘 열전도율 ≈150 W/m·K, 구리 ≈400, SiO₂ ≈1.4 — 절연막과 배선층이 열 병목.

### 7.4 열과 전력 밀도
- H100 SXM5 TDP 700 W ÷ 814 mm² ≈ **86 W/cm²** 평균 (계산). Pollack(Intel, 1999)의 유명 도표: 핫플레이트 ≈10 W/cm², **원자로 노심 ≈100 W/cm²**, 로켓 노즐 ≈1,000 W/cm² [Th1]. 즉 H100 평균이 이미 원자로 노심 수준에 근접하고, 텐서 코어·SM 핫스팟은 국소적으로 그 이상 (추정).
- **접합 온도 한계**: H100은 nvidia-smi가 "T.Limit" 방식으로 표시. GPU 목표 온도 **90 °C**, T.Limit 0 = 소프트웨어 스로틀 시작, 하드웨어 슬로다운 −2 °C(≈92 °C), 셧다운 −7 °C(≈97 °C) 오프셋 [Th2][Th3]. HBM 온도는 별도 센서. (구세대 카드 예: 목표 83, 최대 동작 88, 슬로다운 92, 셧다운 95 °C.)
- 온도가 오르면 누설 전류(지수적)·배선 저항·일렉트로마이그레이션이 동시에 악화 → 열폭주 방지를 위한 클럭/전압 스로틀.

### 7.5 누설과 양자 터널링
- **서브스레숄드 누설**: Vt 아래에서도 전류가 지수적으로 흐름(≈63 mV/dec [V1]). Vt를 0.1 V 낮추면 누설 ≈30배.
- **게이트 터널링**: SiO₂ 1.2 nm 이하에서 전자가 절연막을 양자역학적으로 통과 [K3]. high-k로 완화했지만 EOT 축소마다 재발.
- **소스-드레인 직접 터널링**: 게이트 길이 ~10 nm 이하에서 채널 자체를 건너뛰는 터널링이 스케일링의 근본 한계 → GAA·2D 재료·CFET 등 탐색.
- 스케일링 한계 요약: 원자 이산성(도펀트 몇 개), 터널링, 배선 저항, 열밀도, 그리고 리소그래피 비용.

### 7.6 우주선 소프트 에러와 ECC
- 대기 중성자(우주선 2차 입자)와 패키지 알파선이 실리콘에 전하 구름을 만들어 SRAM/DRAM 비트를 뒤집는 **소프트 에러**. 중성자는 콘크리트 1.5 m도 통과해 차폐 불가 [E3].
- 단위: FIT (10⁹ 시간당 고장). SRAM은 1,000 FIT/Mbit 이하가 바람직 [E3]; 비보호 SRAM 5만 FIT 사례 → ECC로 1,000배 감소 [E4].
- H100은 **HBM3, L2, L1, 레지스터 파일에 ECC** 적용, 페이지 리타이어먼트 지원 [E5]. Meta의 Llama-3 405B 학습(H100 16,384장, 54일)에서 정정 불가 HBM3 오류로 72회 중단 사례 [E2]. 이것이 게임에서 "우주선 이벤트"가 될 수 있는 물리적 근거.

---

## 8. 타이밍과 신호의 여정 (Timing & Signal Journey)

### 8.1 클럭 한 주기
- 1.98 GHz → **T = 1/1.98 × 10⁹ ≈ 0.505 ns = 505 ps**. 텐서 부스트 ≈1.83 GHz → 546 ps (1.3절 추정).
- 빛이 505 ps 동안 진공에서 가는 거리: 3 × 10⁸ × 0.505 × 10⁻⁹ ≈ **15.1 cm** (계산). 다이 한 변(≈28 mm)의 약 5배 — 빛이라면 한 주기에 칩을 5번 왕복.
- 그러나 온칩 신호는 빛이 아니다. 좁은 구리선은 **RC 확산선**처럼 동작해 지연이 길이의 제곱으로 늘고, 리피터를 넣어야 선형이 된다. 리피터가 있는 글로벌 배선은 대략 **50~150 ps/mm** 급 (추정, N5 실측 미확인) → 한 주기에 **약 3~10 mm**. 즉 신호 하나가 다이를 가로지르려면 **여러 클럭**이 필요하고, 그래서 GPU는 GPC/SM 단위로 지역화되고 L2는 두 파티션으로 나뉘어 먼 쪽이 2배 느리다 [H3]. Stanford 강의 예시: 게이트 지연 30~70 ps vs 칩 횡단 글로벌 배선 2~4 ns [I1].
- 절연막 속 전자기파 자체의 속도는 c/√k ≈ 0.6c(k≈2.7)이지만, 온칩 폭 수십 nm 선에서는 R이 커서 전송선 모드가 아닌 RC 모드가 지배한다 [I1][I3].

### 8.2 SM 파이프라인: 명령 하나의 여행 (역공학 모델) [W1][W2][W3]
1. **Fetch**: 파티션 전용 **L0 명령 캐시**(디코드된 명령 보관)에서 128-bit 명령 인출; 미스 시 SM 공용 L1 I-cache → L2.
2. **Decode**: 오피코드·오퍼랜드·**제어 코드(stall 카운트, 의존성 배리어 대기/설정 비트, yield, reuse)** 해석.
3. **Issue (워프 스케줄러)**: 준비된 워프 중 하나 선택. 제어 코드의 stall 카운트가 0이 될 때까지 대기; 가변 지연 명령은 스코어보드(SB0~SB5) 해제 확인 [W2]. 매 클럭 파티션당 1개 명령 발행, SM 전체 4개.
4. **Control → Allocate**: 의존성 카운터 증가, 레지스터 읽기 포트 예약. 포트 부족 시 여기서 버블 [W3].
5. **Operand read**: 3사이클에 걸쳐 레지스터 파일(2뱅크 × 듀얼 포트)에서 소스 읽기; 뱅크 충돌 시 추가 스톨 [W1][W3].
6. **Execute**: FP32 FMA 파이프라인(고정 지연 ≈4사이클 + 오퍼랜드 읽기 등, 실측 의존 체인 지연은 더 김) [W2][W3]; 텐서 명령은 타일 크기에 비례(Hopper) [W4]; 메모리 명령은 LSU → L1 → L2 → HBM (VRAM 지연 수백 ns [H3]).
7. **Writeback**: 결과를 레지스터 파일에 기록, 스코어보드/의존성 카운터 해제 → 다음 명령 발행 가능.

게임 레벨 힌트: "명령 하나 = 플레이어가 통과하는 7개의 관문", 뱅크 충돌 = 문 앞 병목, 스코어보드 = 신호등.

---

## 9. 스케일 사다리 (Scale Ladder) — 레벨 설계용

| 레벨 | 대상 | 대표 크기 | 이전 대비 축소 | 비유 (트랜지스터 게이트 피치 51 nm를 사람 키 1.7 m로 두면 ×3.3 × 10⁷) |
|---|---|---|---|---|
| L0 | 서버 보드 / SXM 모듈 | ≈1 m / ≈15 cm | — | 지구 규모 (33,000 km 이상) |
| L1 | GPU 패키지 (CoWoS 인터포저 + HBM 6기) | ≈5~7 cm | ×15 | 달까지 거리의 약 1/200 (≈2,000 km) |
| L2 | GH100 다이 | 814 mm² ≈ 28.5 × 28.5 mm | ×2 | **약 950 km × 950 km — 한반도 남북 길이(≈1,100 km)에 육박** (계산) |
| L3 | GPC (8개) | ≈5~8 mm 급 (추정) | ×4 | 서울–대전 거리급 (≈150~250 km) |
| L4 | SM (144개) | ≈1~3 mm² → 한 변 ≈1~1.5 mm (추정, 미확인) | ×5 | 도시 하나 (≈40 km) |
| L5 | 텐서 코어 / FP32 블록 | ≈100~300 μm (추정) | ×5~10 | 대학 캠퍼스 (≈5 km) |
| L6 | 머리카락 단면 (참조) | 70 μm | — | ≈2.3 km |
| L7 | SRAM 매크로 / 표준셀 행 | ≈10 μm | ×10~30 | 축구장 몇 개 (≈330 m) |
| L8 | 표준셀 (인버터 100 nm × 210 nm) | 0.1~0.2 μm | ×50 | 집 한 채 (≈3~7 m) |
| L9 | 트랜지스터 (CPP 51 nm, 핀 폭 6 nm, 핀 높이 ≈50 nm) | 50 nm | ×3 | **사람 1명 (1.7 m)**; 핀 폭 6 nm ≈ 20 cm, 핀 높이 ≈1.7 m |
| L10 | 게이트 산화막 (HfO₂ ≈1.5~2 nm, SiO₂ 계면 ≈0.5 nm) | 1~2 nm | ×30 | 5~7 cm — 손바닥 두께 |
| L11 | 실리콘 격자 (a = 0.543 nm) / 원자 (≈0.2 nm) | 0.1~0.5 nm | ×5 | 격자 1.8 cm — 구슬 한 알; 원자 ≈0.7 cm |
| L12 | 전자 (양자 파동, 고전 반경 2.8 fm) | — | — | "크기 없음"; 페르미 파장 수 nm |

- 보드(1 m) → 원자(0.1 nm)는 **10¹⁰배** (100억 배). 지구 지름(1.27 × 10⁷ m)에서 1.3 mm 좁쌀로 가는 비율과 같다 (계산).
- 트랜지스터가 사람이면 다이는 나라 크기, 칩 위 800억 "사람" = 지구 인구의 10배. 배선은 그 나라를 덮는 수백 km(실제)의 도로가 사람 스케일에선 **수십억 km** — 태양계 규모 (계산, 추정).
- 시간 스케일: 클럭 505 ps, FO4 게이트 ≈7 ps, 전자 채널 통과 ≈0.2 ps, DRAM 리프레시 64 ms(= 1.27억 클럭), 우주선 비트플립: 칩당 수시간~수일에 1회 (추정).

---

## 10. 용어집 (Glossary) — EN | KO | 쉬운 한국어 | Plain English

| EN | KO | 쉬운 한국어 설명 | Plain English |
|---|---|---|---|
| FMA (Fused Multiply-Add) | 융합 곱셈-덧셈 | a×b+c를 한 번에, 반올림 한 번 | multiply then add in one step, one rounding |
| Mantissa / Significand | 가수 | 소수점 숫자 부분(24비트) | the digits part of a float |
| Exponent | 지수 | 소수점 위치(크기 자릿수) | where the decimal point sits |
| Booth / Wallace tree | 부스 인코딩 / 월리스 트리 | 곱셈을 빨리 하려고 부분곱을 병렬로 더하는 구조 | fast parallel adder tree for multiplication |
| Normalizer | 정규화기 | 결과 맨 앞 1을 맞추는 시프터 | shifts result so leading 1 is in place |
| Tensor Core | 텐서 코어 | 작은 행렬 곱을 한 명령으로 하는 전용 계산기 | dedicated small-matrix multiplier |
| MAC (Multiply-Accumulate) | 곱셈-누산기 | 곱해서 더해 쌓는 유닛 | multiply and add to a running sum |
| Systolic array | 시스톨릭 배열 | 데이터가 심장박동처럼 이웃으로 흐르는 계산 격자 | grid where data pulses neighbor to neighbor |
| Warp | 워프 | 같은 명령을 함께 실행하는 32스레드 묶음 | group of 32 threads run in lockstep |
| Warp scheduler | 워프 스케줄러 | 어느 워프의 다음 명령을 낼지 고르는 장치 | picks which warp issues next |
| Scoreboard | 스코어보드 | 결과가 아직 안 나온 레지스터를 표시하는 신호등 | tracks which results are still pending |
| Control code | 제어 코드 | 컴파일러가 명령에 적어둔 "몇 클럭 기다려라" 메모 | compiler's per-instruction timing hints |
| Register file | 레지스터 파일 | 코어 바로 옆 가장 빠른 작은 메모리 | fastest tiny memory next to the ALU |
| Bank conflict | 뱅크 충돌 | 같은 서랍을 동시에 열려다 기다리는 것 | two reads hit the same memory bank |
| Operand collector | 오퍼랜드 컬렉터 | 피연산자를 모아 주는 대기실(현 NVIDIA GPU엔 없음) | buffer gathering operands (not in current NVIDIA) |
| CMOS | 상보형 MOS | PMOS와 NMOS를 짝지어 대기 전력이 거의 0 | P and N transistors paired; near-zero idle power |
| Standard cell | 표준 셀 | 미리 그려둔 레고 블록 같은 논리 게이트 | pre-drawn logic gate layout blocks |
| Track (cell height) | 트랙 | 셀 높이를 배선 줄 수로 센 단위 | cell height counted in wire rows |
| CPP (Contacted Poly Pitch) | 접촉 게이트 피치 | 옆 게이트까지 거리(51 nm) | center-to-center gate spacing |
| Fin pitch | 핀 피치 | 옆 핀까지 거리(28 nm) | center-to-center fin spacing |
| MMP (Min Metal Pitch) | 최소 금속 피치 | 가장 가는 배선의 간격(28 nm) | tightest wire spacing |
| MTr/mm² | 백만 트랜지스터/mm² | 1 mm²에 들어가는 트랜지스터 수 | transistor density unit |
| SRAM 6T cell | 6T SRAM 셀 | 트랜지스터 6개로 1비트 기억 | six-transistor one-bit memory |
| Bitline / Wordline | 비트라인 / 워드라인 | 데이터 통로 / 행 선택 스위치 선 | data wire / row-select wire |
| Sense amplifier | 센스 앰프 | 아주 작은 전압 차를 키워 0/1 판정 | amplifies tiny voltage difference |
| Write assist | 쓰기 보조 | 저전압에서도 셀을 뒤집게 돕는 회로 | circuit helping writes at low voltage |
| DRAM 1T1C | 1T1C DRAM | 트랜지스터 1 + 커패시터 1로 1비트 | one transistor, one capacitor per bit |
| Refresh | 리프레시 | 새는 전하를 64 ms마다 다시 채움 | recharge leaking cells periodically |
| Row buffer | 행 버퍼 | 열어둔 한 줄(1 KB)을 담는 임시 저장소 | holds the currently open DRAM row |
| Bank / Bank group | 뱅크 / 뱅크 그룹 | 독립적으로 열고 닫는 메모리 구역 | independently operated memory arrays |
| Pseudo channel | 의사 채널 | 채널을 반으로 나눈 32-bit 통로 | half-width sub-channel |
| HBM | 고대역폭 메모리 | DRAM을 쌓아 GPU 옆에 붙인 메모리 | stacked DRAM beside the GPU |
| TSV (Through-Silicon Via) | 실리콘 관통 비아 | 다이를 위아래로 뚫는 구리 기둥 | copper pillar through the die |
| Micro-bump | 마이크로범프 | 다이 사이를 잇는 20 μm 땜납 점 | tiny solder joints between dies |
| Interposer (CoWoS) | 인터포저 | GPU와 HBM을 얹는 실리콘 배선판 | silicon wiring board under GPU and HBM |
| ECC | 오류 정정 코드 | 비트가 뒤집혀도 고쳐내는 여분 비트 | extra bits that fix flipped bits |
| Soft error / SEU | 소프트 에러 | 우주선·알파선으로 비트가 잠깐 뒤집힘 | radiation-induced bit flip |
| FinFET | 핀펫 | 지느러미 모양 채널을 게이트가 3면 감싼 트랜지스터 | fin-shaped channel, gate on 3 sides |
| GAA nanosheet | 게이트올어라운드 나노시트 | 얇은 판 채널을 게이트가 4면 감쌈(N2) | stacked sheets, gate on all sides |
| High-k / HfO₂ | 고유전율 절연막 | 두꺼워도 잘 통하는 산화막(하프늄) | thick-but-effective gate insulator |
| EOT | 유효 산화막 두께 | SiO₂로 환산한 절연막 두께 | insulator thickness in SiO₂ terms |
| Work-function metal | 일함수 금속 | 문턱 전압을 정하는 게이트 금속층 | gate metal setting threshold voltage |
| Threshold voltage (Vt) | 문턱 전압 | 트랜지스터가 켜지기 시작하는 전압 | voltage where the switch turns on |
| Subthreshold leakage | 서브스레숄드 누설 | 꺼져도 조금 새는 전류 | current that leaks when "off" |
| Quantum tunneling | 양자 터널링 | 벽을 뚫고 나타나는 전자 | electron passes through a barrier |
| DIBL | 드레인 유도 장벽 저하 | 드레인 전압이 문턱을 낮추는 단채널 효과 | drain lowers the barrier (short-channel effect) |
| Epitaxy (SiGe S/D) | 에피택시 | 결정을 이어 키운 소스/드레인 | crystal grown in place for source/drain |
| BEOL | 후공정 배선 | 트랜지스터 위에 쌓는 배선층 전부 | all the wiring layers above transistors |
| FEOL / MOL | 전공정 / 중간공정 | 트랜지스터 / 콘택트 층 | transistor layers / contact layers |
| Damascene | 다마신 | 홈 파고 구리 채우고 갈아내는 배선법 | etch trench, fill copper, polish |
| Barrier / Liner | 배리어 / 라이너 | 구리가 새지 않게 감싸는 얇은 막(TaN, Co, Ru) | thin film keeping copper contained |
| Low-k dielectric | 저유전율 절연막 | 배선 사이 정전용량을 줄이는 스펀지 같은 절연체 | porous insulator lowering wire capacitance |
| RC delay | RC 지연 | 저항×정전용량으로 신호가 늦어짐 | wire delay from resistance and capacitance |
| Repeater | 리피터 | 긴 선 중간에 넣는 버퍼 | buffer inserted along a long wire |
| Electromigration | 일렉트로마이그레이션 | 전자가 구리 원자를 밀어 선이 끊김 | current slowly moves metal atoms |
| PDN | 전원 공급망 | 전기를 모든 셀에 나눠주는 격자 | grid delivering power to every cell |
| Clock tree | 클럭 트리 | 박자를 모든 플립플롭에 같은 시각에 전달 | distributes the clock evenly |
| Diamond cubic | 다이아몬드 입방 | 실리콘 원자의 배열 방식 | silicon's crystal arrangement |
| Lattice constant | 격자 상수 | 결정 반복 단위 길이(0.5431 nm) | repeat length of the crystal |
| Doping | 도핑 | 불순물을 넣어 전기가 통하게 함 | adding impurities to conduct |
| Band gap | 밴드갭 | 전자가 자유로워지려면 넘어야 할 에너지(1.12 eV) | energy to free an electron |
| Drift velocity | 드리프트 속도 | 전계에서 전자가 실제 나아가는 속도 | net electron speed in a field |
| Junction temperature | 접합 온도 | 실리콘 자체의 온도 | silicon die temperature |
| Power density | 전력 밀도 | 면적당 열(W/cm²) | heat per area |
| Node name ("4 nm") | 노드 이름 | 실제 치수가 아닌 세대 이름 | marketing generation label |

---

## 11. 출처 (Sources)

### H: H100 / Hopper
- [H1] NVIDIA H100 Tensor Core GPU Architecture Whitepaper — https://resources.nvidia.com/en-us-hopper-architecture/nvidia-h100-tensor-c
- [H2] NVIDIA H100 SXM5 specs (boost 1,980 MHz, 700 W) — https://cputronic.com/gpu/nvidia-h100-sxm5 ; https://www.exxactcorp.com/blog/HPC/NVIDIA-H100
- [H3] Chips and Cheese, "Nvidia's H100: Funny L2, and Tons of Bandwidth" — https://chipsandcheese.com/p/nvidias-h100-funny-l2-and-tons-of-bandwidth
- [H4] Register file 256 KB/SM, 65,536 regs — https://www.linkedin.com/posts/joydeep-bhattacharjee-934a1157_if-you-are-running-your-models-in-nvidia-activity-7449848872614432769-oG1J (2차 자료; 128 reads/cycle 수치는 미확인)

### T: Tensor Core
- [T1] Glenn Lockwood, "Tensor cores and Matrix cores" — https://www.glennklockwood.com/garden/tensor-cores
- [T2] NVIDIA Developer Forums, "How to calculate the Tensor Core FP16 performance of H100?" — https://forums.developer.nvidia.com/t/how-to-calculate-the-tensor-core-fp16-performance-of-h100/244727

### F: FMA 게이트 수
- [F1] Semiconductor Engineering, "Reducing Latency, Power, and Gate Count with Floating-Point FMA" — https://semiengineering.com/reducing-latency-power-and-gate-count-with-floating-point-fma/
- [F2] US Patent 10282169 "Floating-point multiply-add with down-conversion" (27-bit adder, 48-bit product) — https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10282169
- [F3] Gate-equivalent 경험식 — https://hackmd.io/@derek8955/r1bDC9Oe2 ; https://en.wikipedia.org/wiki/Gate_equivalent
- [F4] RealWorldTech forum, "Typical gate/transistor count for 32 bit FPU" — https://www.realworldtech.com/forum/?threadid=9650&curpostid=9652
- [F5] S. Galal, Stanford dissertation "Energy Efficient Floating-Point Unit Design" — https://stacks.stanford.edu/file/druid:tf297yq9849/sg_thesis_submission-augmented.pdf

### W: 워프 스케줄러 / 레지스터 파일 / 파이프라인
- [W1] Z. Jia et al., "Dissecting the NVIDIA Volta GPU Architecture via Microbenchmarking" — https://arxiv.org/pdf/1804.06826 ; Turing T4 — https://arxiv.org/pdf/1903.07486
- [W2] zartbot, "Dissecting the SM_120 Microarchitecture" (control code, stall counter, scoreboard) — https://zartbot.github.io/micro_arch/nvidia/sm_120/paper.html ; RealWorldTech Ampere thread — https://realworldtech.com/forum/?curpostid=223835&threadid=223822
- [W3] "Dissecting and Modeling the Architecture of Modern GPU Cores", MICRO 2025 — https://dl.acm.org/doi/10.1145/3725843.3756041
- [W4] "Dissecting the NVIDIA Hopper Architecture through Microbenchmarking" — https://arxiv.org/pdf/2501.12084 ; "Microbenchmarking NVIDIA's Blackwell Architecture" — https://arxiv.org/pdf/2512.02189
- [W5] CORF (ASPLOS 2019) — https://www.cs.ucr.edu/~nael/pubs/asplos19.pdf ; Compiler-assisted RF cache — https://arxiv.org/pdf/2310.17501

### G: 논리 게이트 / 표준 셀
- [G1] CMOS Logic Gate Transistor Counts reference — https://industrialmonitordirect.com/blogs/knowledgebase/cmos-logic-gate-transistor-counts-complete-reference-guide
- [G2] Weste & Harris 계열 강의자료 (Circuits & Layout) — https://users.ece.utexas.edu/~adnan/vlsi-05/lec1Layout.ppt ; TSMC 플립플롭 특허 — https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11621703
- [G3] ASAP7 PDK 표준셀 라이브러리 — https://arxiv.org/pdf/1807.11396 ; https://www.sciencedirect.com/science/article/pii/S002626921630026X
- [G4] imec 6-track vs 7.5-track (SPIE 2017) — https://ui.adsabs.harvard.edu/abs/2017SPIE10148E..03D/abstract ; UCSD mixed track-height — https://vlsicad.ucsd.edu/Publications/Conferences/405/c405.pdf

### P: TSMC N5/N4 공정
- [P1] Angstronomics, "The TRUTH of TSMC 5nm" (A15 SEM: 210 nm 셀, CPP 51 nm, 핀 피치 28 nm, 137.6 MTr/mm²) — https://www.angstronomics.com/p/the-truth-of-tsmc-5nm
- [P2] WikiChip Fuse, "TSMC Details 5 nm" (IEDM 2019) — https://fuse.wikichip.org/news/3398/tsmc-details-5-nm/ ; "TSMC 5-Nanometer Update" — https://fuse.wikichip.org/news/2879/tsmc-5-nanometer-update/ ; WikiChip 5 nm 페이지 — https://en.wikichip.org/wiki/5_nm_lithography_process
- [P3] Semiconductor Digest, "Update: TSMC's 5nm CMOS Technology Platform" (M0 28 nm, M2 35 nm, 6-track 2+2 fin) — https://www.semiconductor-digest.com/tsmc-to-discuss-their-5-nm-cmos-technology-platform-at-iedm-2019/
- [P4] TechInsights, Apple A14 APL1W01 TSMC N5 CPU SoC Design Analysis (6-track library) — https://www.techinsights.com/products/sda-2011-801
- [P5] Tom's Hardware, "Apple's A14 SoC Under the Microscope" (11.8 B Tr, 88 mm²) — https://www.tomshardware.com/news/apple-a14-bionic-revealed
- [P6] TSMC N4P 보도자료 — https://pr.tsmc.com/english/news/2874 ; WikiChip Fuse N4P — https://fuse.wikichip.org/news/6439/tsmc-extends-its-5nm-family-with-a-new-enhanced-performance-n4p-node/
- [P7] TSMC 5nm/4nm 기술 페이지 — https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_5nm
- [P8] Tom's Hardware, "TSMC to Boost 4nm & 5nm Output" (NVIDIA 4N) — https://www.tomshardware.com/news/tsmc-to-boost-4nm-and-5nm-output-by-25-percent
- [P9] TechInsights, "FinFET Transistors: Tracing the Path of Evolution" — https://www.techinsights.com/blog/finfet-transistors-tracing-path-evolution
- [P10] TSMC Research, High Mobility Channel — https://research.tsmc.com/english/research/logic/high-mobility-channel/publish-time-1.html
- [P11] G. Yeap et al., "5nm CMOS Production Technology Platform featuring full-fledged EUV, and High Mobility Channel FinFETs with densest 0.021 μm² SRAM cells…", IEDM 2019 (paper 36.7)

### S: SRAM
- [S1] SemiWiki, "TSMC's 5nm 0.021um2 SRAM Cell… at ISSCC2020" — https://semiwiki.com/semiconductor-manufacturers/tsmc/283487-tsmcs-5nm-0-021um2-sram-cell-using-euv-and-high-mobility-channel-with-write-assist-at-isscc2020/
- [S2] WikiChip Fuse, "TSMC Details 5 nm" (HD 0.021 / HP 0.025 μm²) — https://fuse.wikichip.org/news/3398/tsmc-details-5-nm/
- [S3] WikiChip Fuse, "IEDM 2022: Did We Just Witness The Death Of SRAM?" — https://fuse.wikichip.org/news/7343/iedm-2022-did-we-just-witness-the-death-of-sram/
- [S4] SemiAnalysis, "TSMC's 3nm Conundrum" — https://newsletter.semianalysis.com/p/tsmcs-3nm-conundrum-does-it-even ; Tom's Hardware — https://www.tomshardware.com/news/no-sram-scaling-implies-on-more-expensive-cpus-and-gpus
- [S5] Tom's Hardware, "SRAM scaling isn't dead after all — TSMC 2nm" — https://www.tomshardware.com/tech-industry/sram-scaling-isnt-dead-after-all-tsmcs-2nm-process-tech-claims-major-improvements
- [S6] TSMC Research, "A 38.1Mb/mm² SRAM in a 2nm-CMOS-Nanosheet Technology" (ISSCC 2025) — https://research.tsmc.com/page/memory/4.html

### D/M: DRAM / HBM
- [D1] DEV Community, "What Is RAM, Actually?" (1T1C, refresh overhead) — https://dev.to/nazq/what-is-ram-actually-2fn7
- [D2] SemiAnalysis, "The Memory Wall: Past, Present, and Future of DRAM" (6~7 fF, ~40,000 electrons) — https://newsletter.semianalysis.com/p/the-memory-wall
- [D3] OSTI, "Memory technologies: Status and Perspectives" (Ccell ~25 fF) — https://www.osti.gov/servlets/purl/1684824
- [D4] HiRA (arXiv 2209.10198) DDR4/DDR5 tREFW/tREFI — https://arxiv.org/pdf/2209.10198 ; US Patent 11705180 — https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11705180
- [M1] H100 SXM5 5,120-bit / 3.35 TB/s — https://www.thundercompute.com/blog/nvidia-h100-specs-full-guide ; https://technical.city/en/video/H100-SXM5-80-GB
- [M2] Synopsys, "What is HBM3?" — https://www.synopsys.com/glossary/what-is-high-bandwitdth-memory-3.html ; Siemens, "HBM3e and HBM4 IC design guide" — https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/ ; Wevolver HBM3 guide — https://www.wevolver.com/article/what-is-high-bandwidth-memory-3-hbm3-complete-engineering-guide-2025
- [M3] Semiconductor Engineering, "HBM4 Sticks With Microbumps" (die 30~50 μm, 720/775 μm, bump pitch) — https://semiengineering.com/hbm4-sticks-with-microbumps-postponing-hybrid-bonding/ ; IMAPS underfill paper (20 μm bumps) — https://imapsource.org/api/v1/articles/57356-a-study-on-the-effectiveness-of-underfill-in-the-high-bandwidth-memory-with-tsv.pdf
- [M4] SK hynix HBM technology summary (TSV 5~10 μm, pitch 40~50 μm; 2차 자료) — https://michaelbommarito.com/wiki/ai-hardware/sk-hynix-hbm/ ; SK hynix Newsroom TSV article — https://news.skhynix.com/creating-new-values-in-dram-using-through-silicon-via-technology-for-continued-scaling-in-memory-system-performance-and-capacity/
- [M5] ServeTheHome, "SK hynix HBM Packaging at Hot Chips 2026" — https://www.servethehome.com/sk-hynix-hbm-packaging-at-hot-chips-2026/ ; SemiAnalysis HBM roadmap — https://newsletter.semianalysis.com/p/scaling-the-memory-wall-the-rise-and-roadmap-of-hbm
- [M6] HBM bank organization — https://github.com/zahrayousefijamarani/HBM_high_bandwidth_memory/blob/main/README.md ; Monitor Insider HBM2 deep dive (page 1 KB pseudo-channel) — http://monitorinsider.com/HBM.html ; Synopsys HBM3 IP — https://www.synopsys.com/articles/hbm3-ip-dwtb.html

### V/K/N: 트랜지스터 / 게이트 스택 / GAA
- [V1] ASAP7 PDK (0.7 V, SS 62~64 mV/dec, FO4 6~8 ps, multi-Vt) — https://asap.asu.edu/wp-content/uploads/sites/47/2021/11/iccad17_asu_asap7_171115c.pdf ; https://pages.hmc.edu/harris/research/asap7.pdf
- [V2] "The Effect of Fin Structure in 5 nm FinFET Technology" (fin height 50~60 nm, width 5 nm) — https://www.researchgate.net/publication/338338449_The_Effect_of_Fin_Structure_in_5_nm_FinFET_Technology
- [V3] TSMC 특허 (fin 40~80 nm 높이, 4~15 nm 폭) — https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12199100
- [V4] Multi-Vt FinFET TCAD — https://www.sciencedirect.com/science/article/abs/pii/S0026269218308784
- [K1] imec, "Ultrathin EOT high-κ/metal gate devices" — https://www.sciencedirect.com/science/article/abs/pii/S0167931711003807 ; J. Robertson, "High-K materials and Metal Gates for CMOS" — https://www.repository.cam.ac.uk/bitstreams/1108cccd-120f-49db-9629-a42a11aa25ec/download
- [K2] TSMC FinFET gate structure 특허 (TiN/TaN/TiAl 두께) — https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10832974
- [K3] Intel, "High-k and Metal Gate Transistor Research" (45 nm, 2007) — https://www.intel.com/pressroom/kits/advancedtech/doodle/ref_HiK-MG/high-k.htm ; RealWorldTech "Intel's 45nm Surprise" — https://www.realworldtech.com/intel-45nm-hkmg/3/
- [K4] C&EN, "Intel Unveils New Transistor" — https://cen.acs.org/articles/85/web/2007/01/Intel-Unveils-New-Transistor.html
- [N1] Tom's Hardware, TSMC N2 at IEDM 2024 — https://www.tomshardware.com/tech-industry/tsmc-shares-deep-dive-details-about-its-cutting-edge-2nm-process-node-at-iedm-2024-35-percent-less-power-or-15-percent-more-performance
- [N2] IEEE Spectrum, TSMC N2 / NanoFlex — https://spectrum.ieee.org/tsmc-n2 ; TSMC N2 페이지 — https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm
- [Q1] MIT 6.701 Introduction to Nanoelectronics, Part 5 (CG ≈ 1 aF/nm) — https://ocw.mit.edu/courses/6-701-introduction-to-nanoelectronics-spring-2010/d4cf00dfef7119a36223c743b2e3b424_MIT6_701S10_part5.pdf
- [Q2] Semiconductor Engineering, "Fins And Wires – How Do We Get To 5nm?" — https://semiengineering.com/fins-and-wires-how-do-we-get-to-5nm/

### B/I: 배선
- [B1] TechInsights, Apple C1 modem floorplan (N4: 15 Cu + 1 Al = 16 layers) — https://www.techinsights.com/blog/apple-custom-c1-5g-modem-floorplan-analysis
- [B2] EE Times Asia, "TSMC to Start 5nm Production in April" (EUV up to 14 layers) — https://www.eetasia.com/18100502-tsmc-to-start-5nm-production-in-april/
- [B3] TSMC BEOL 특허 (Ru/Co liner 5~25 Å) — https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12354958
- [B4] "Low-k dielectric materials", Materials Today — https://www.sciencedirect.com/science/article/pii/S1369702104000537 ; NASA NEPP low-k — https://nepp.nasa.gov/docuploads/AF96A3A1-EDED-4F4F-96F7353E045C654F/Low-k_TRO_revised.pdf
- [B5] Josell & Tökei, "Size-Dependent Resistivity in Nanoscale Interconnects", Annu. Rev. Mater. Res. 2009 — https://elton.freeshell.org/Mse311/Literature/AnnuRevMaterRes39-Josell-Tokei2009_interconnect-resistivity-review.pdf
- [B6] Phys. Rev. B 74, 045411 "Size-dependent resistivity of nanometric copper wires" — https://journals.aps.org/prb/abstract/10.1103/PhysRevB.74.045411 ; 특허 (18 nm ≈ 9 μΩ·cm) — https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11309216
- [B7] Synopsys, "What is Electromigration?" — https://www.synopsys.com/glossary/what-is-electromigration.html ; Cadence, Black's Equation — https://resources.system-analysis.cadence.com/blog/msa2020-blacks-equation-for-mttf-due-to-electromigration
- [B8] "Black's equation for today's ULSI interconnect EM reliability — A revisit" — https://ieeexplore.ieee.org/document/6117717/
- [B9] VentureBeat, Applied Materials wiring innovations (60+ miles, 18 layers) — https://venturebeat.com/ai/applied-materials-reveals-chip-wiring-innovations-for-energy-efficient-computing ; Mark LaPedus, "Scaling Copper Interconnects To 2nm" — https://marklapedus.substack.com/p/scaling-copper-interconnects-to-2nm
- [B10] IEEE Spectrum, "Cobalt Could Untangle Chips' Wiring Problems" — https://spectrum.ieee.org/cobalt-could-untangle-chips-wiring-problems
- [B11] MIT Technology Review, "Making Wiring that Doesn't Trip Up Computer Chips" (2012) — https://www.technologyreview.com/2012/07/10/185008/making-wiring-that-doesnt-trip-up-computer-chips/
- [B12] EDN, "What's the total length of the tracks on a silicon chip?" — https://www.edn.com/whats-the-total-length-of-the-tracks-on-a-silicon-chip/
- [I1] Stanford EE311 (Saraswat), "Scaling of Interconnections" — https://web.stanford.edu/class/ee311/NOTES/Interconnect%20Scaling.pdf
- [I2] Harvey Mudd, "Lecture 4: Interconnect RC" — https://pages.hmc.edu/harris/class/hal/lect4.pdf ; Semiconductor Engineering, "Interconnect Challenges Grow" — https://semiengineering.com/interconnect-challenges-grow/
- [I3] "Improved Analytical Delay Models for RC-Coupled Interconnects" — https://arxiv.org/pdf/1304.0835

### Si/Th/E: 실리콘 물성 / 열 / 소프트 에러
- [Si1] Ioffe NSM Archive, Silicon basic/electrical parameters — https://www.ioffe.ru/SVA/NSM/Semicond/Si/basic.html ; https://www.ioffe.ru/SVA/NSM/Semicond/Si/electric.html
- [Si2] UniversityWafer, "Silicon Lattice Constant (a = 5.431 Å)" — https://www.universitywafer.com/silicon-lattice-constant.html
- [Si3] ResearchGate, band gap narrowing vs doping — https://www.researchgate.net/post/How_can_I_derive_the_relationship_between_band_gap_change_and_doping_density_for_Silicon
- [Si4] 하이퍼도핑 특허(도핑 범위 10¹⁸~10²¹) — https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/7179329
- [Si5] arXiv 1007.4432, drift velocity saturation in bulk Si — https://arxiv.org/pdf/1007.4432
- [Th1] F. Pollack, "New microarchitecture challenges…", MICRO-32 keynote 1999; 재현 슬라이드 — https://www.ece.ucdavis.edu/~ramirtha/EEC216/W08/lecture1_updated.pdf ; https://www.cs.utexas.edu/~hunt/FMCAD/2007/presentations/Tutorial_Najm.pdf
- [Th2] NVIDIA Developer Forums, "Nvidia-smi GPU T.Limit / Shutdown T.Limit" — https://forums.developer.nvidia.com/t/nvidia-smi-gpu-t-limit-gpu-shutdown-t-limit-temp/292006
- [Th3] NVIDIA NVSentinel, "GPU Thermal Margin" (H100 slowdown offset −2) — https://docs.nvidia.com/nvsentinel/runbooks/gpu-thermal-margin/ ; H100 PCIe Product Brief PB-11133 — https://www.nvidia.com/content/dam/en-zz/Solutions/gtcs22/data-center/h100/PB-11133-001_v01.pdf
- [E1] Samsung, "A 16 GB 1024 GB/s HBM3 DRAM with On-Die Error Control Scheme", ISSCC 2022 — https://ieeexplore.ieee.org/document/9830391/
- [E2] "A Novel Prediction-Based Two-Tiered ECC for Mitigating SWD Errors in HBM" (Llama-3 72회 중단 인용) — https://www.researchgate.net/publication/385117333_A_Novel_Prediction-Based_Two-Tiered_ECC_for_Mitigating_SWD_Errors_in_HBM ; DBB-ECC for HBM3 — https://ui.adsabs.harvard.edu/abs/2025ITCAD..44.3236S/abstract
- [E3] NASA NEPP, "Scaling and Technology Issues for Soft Error Rates" — https://nepp.nasa.gov/docuploads/40d7d6c9-d5aa-40fc-829dc2f6a71b02e9/scal-00.pdf ; ATP, SRAM soft error — https://www.atpinc.com/blog/what-is-soft-error-detection-sram-emmc
- [E4] Meta, "Silent Data Corruptions at Scale" — https://arxiv.org/pdf/2102.11245
- [E5] "An Analysis of Radiation Protection in the NVIDIA H100 GPU" — https://newspaceeconomy.ca/2025/11/03/an-analysis-of-radiation-protection-in-the-nvidia-h100-gpu/ ; NVIDIA MICRO-54, "Characterizing and Mitigating Soft Errors in GPU DRAM" — https://dl.acm.org/doi/10.1145/3466752.3480111

### X: 기타
- [X1] Wikipedia "Micrometre" / "Hair's breadth" (17~181 μm, 대표 75 μm) — https://en.wikipedia.org/wiki/Micrometre ; https://en.wikipedia.org/wiki/Hair%27s_breadth

---

## 부록 A. 미확인·추정 항목 목록 (검수용)
- FP32 FMA 게이트/트랜지스터 수 (1만~2.5만 GE / 4만~10만 Tr): 경험식 기반 추정.
- NVIDIA 레지스터 파일 SRAM 셀 종류(8T/10T 등): 미확인.
- 텐서 부스트 클럭 1.83 GHz: 공표 TFLOPS 역산 추정.
- N5 핀 폭·핀 높이·물리 게이트 길이: TSMC 미공개, TCAD/특허 범위로 대체 (미확인).
- N5/4N 게이트 스택 각 층 두께, EOT, Vt, 실제 VDD: NDA (미확인).
- H100(4N) 금속층 수: N4 타 제품 16층에서 유추 (미확인).
- N2 나노시트 폭·두께·장수: TSMC 미공개.
- HBM TSV 지름 5~10 μm: 2차 자료; 벤더 1차 논문 값 미확인.
- 리피터 삽입 글로벌 배선 지연 50~150 ps/mm: 일반 경험치 (N5 실측 미확인).
- 칩당 배선 총길이: 수십~100 km 이상(업계 인용), H100 개별 값 미확인.
- SM/GPC/텐서코어 물리 면적: 다이샷 기반 개략 추정.
- 우주선 비트플립 빈도(칩당): 공개 FIT 없음, 추정.
