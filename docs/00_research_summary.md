# GPU DESCENT 조사 요약 (Research Digest)

> 게임 제작을 위해 조사한 논문·백서·공정 자료의 **요약본**입니다. 각 항목의 상세 표와 전체 출처 URL은 `docs/research/01~07_*.md`에 있습니다.
> 표기 원칙: 1차 출처(NVIDIA 백서·튜닝 가이드, 학술 마이크로벤치마크 논문, TSMC/ASML/SK hynix 공식 자료)에서 확인한 수치만 "확인"으로 쓰고, 나머지는 **(추정)** 또는 **(미확인)** 으로 표시했습니다.

---

## 1. 조사 문서 구성

| 파일 | 주제 | 분량 | 핵심 산출물 |
|---|---|---|---|
| `research/01_gpu_architecture.md` | NVIDIA GPU 계층 구조 (H100 / B200 / RTX 4090) | 473줄 | 층별 계층표, 데이터 경로 서사, 지연시간 표, 스케일 사다리, 용어 100개 |
| `research/02_manufacturing.md` | 모래 → GPU 제조 공급망 15개 스테이션 | 476줄 | 스테이션별 장소·수치·재미있는 사실, 타임라인·비용, 클린룸 팩트, 용어 80개 |
| `research/03_micro_structure.md` | SM 아래: FMA·텐서 코어·SRAM·DRAM·FinFET·배선·결정 격자·물리 | 519줄 | 게이트 수 추정, N5 치수 실측치, 열·누설·터널링·우주선 에러, 스케일 사다리 |
| `research/04_physical_ai_and_story_facts.md` | Physical AI · Jetson Thor · GR00T N1 · 데이터센터 · 스토리 씬 | 469줄 | 로봇 추론 파이프라인(33 ms), 훈련 인프라 수치, 씬 12개, 캐릭터 8안 |
| `research/05_people_and_videos.md` | 반도체·GPU 실존 인물 30명과 요소별 해설 영상 | — | 인물별 유튜브 영상(oEmbed로 존재 확인), 51개 주제 영상 96편 |
| `research/06_media_and_companies.md` | 구조물별 실제 사진과 기업 정보 | — | 위키미디어 사진 130장(65개 키), 기업 40곳의 설립·본사·홈페이지 |
| `research/07_ai_race_facts.md` | AI 모델 경쟁사(알파고 → LLM) | 329줄 | 연도·수치·논문 47건, AI 인물 27명과 영상 63편 |

게임 데이터로 옮겨진 결과물: `src/data/terms.js`(용어 카드 78장), `gpus.js`(GPU 3종), `levels.js`(하강 15층 + HBM 지선 2층), `factory.js`(공장 10스테이션), `ai_levels.js`(AI 테마 7스테이지), `people_videos.js`·`people_ai.js`(실존 인물 61명), `media.js`(사진 130장·기업 40곳).

---

## 2. 핵심 논문·자료별 요약 (무엇을 가져왔는가)

### 2.1 NVIDIA 1차 자료
| 자료 | 게임에 반영한 내용 |
|---|---|
| **NVIDIA H100 Tensor Core GPU Architecture Whitepaper (v1.01, GTC 2022)** | GH100 풀 다이 = 8 GPC · 72 TPC · 144 SM, 제품 H100 SXM5 = 132 SM · 16,896 FP32 코어 · 528 텐서 코어; SM 구성(4 서브파티션, FP32 128, FP64 64, 텐서 코어 4, 레지스터 256 KB, L1/공유 256 KB); L2 50 MB 2파티션; HBM3 5스택 80 GB 3.35 TB/s; NVLink 4세대 900 GB/s; 814 mm², 800억 트랜지스터, TSMC 4N; 4세대 텐서 코어 SM당 FP16 2,048 FMA/clk; 8 NVDEC + 8 NVJPG(풀 다이) |
| **NVIDIA Hopper Architecture In-Depth (개발자 블로그)** | TMA(텐서 메모리 가속기), DSMEM(분산 공유 메모리), 스레드 블록 클러스터, Transformer Engine, DPX 명령 |
| **NVIDIA Hopper / Ada / Blackwell Tuning Guide, CUDA C++ Programming Guide** | SM당 최대 64 워프(Hopper) vs 48 워프(Ada CC 8.9), 블록당 1,024 스레드, 스레드당 레지스터 255개, 클러스터 8(이식성)/16(옵트인), 캐시 라인 128 B = 32 B 섹터 4개 |
| **NVIDIA Ada GPU Architecture Whitepaper (v2.02)** | AD102 풀 다이 12 GPC · 72 TPC · 144 SM, RTX 4090 = 11 GPC · 64 TPC · 128 SM · 16,384 코어, L2 72 MB(풀 96 MB), 608.5 mm², 763억 트랜지스터, 부스트 2,520 MHz, FP64 SM당 2개, 128 KB L1, GDDR6X 24 GB 1,008 GB/s |
| **NVIDIA Blackwell 아키텍처 페이지 · DGX B200 · GB200 NVL72 · B200 데이터시트** | 2다이 2,080억 트랜지스터, NV-HBI 10 TB/s, HBM3e 8스택(데이터시트 180 GB / 7.7 TB/s, 마케팅 192 GB / 8 TB/s), NVLink 5세대 1.8 TB/s, NVL72 = 72 GPU + 36 Grace, 130 TB/s, 약 120 kW 액체 냉각, 1,000 W TDP |
| **NVIDIA Jetson AGX Thor 블로그 · 개발자 포럼** | 로봇 두뇌: Blackwell GPU, CUDA 코어 2,560개, 런타임 조회 시 **활성 SM 20개**(풀칩 24개 → "96 텐서 코어"는 풀칩 기준), FP4 희소 2,070 TFLOPS / FP8 밀집 1,035, 128 GB LPDDR5X, 40~130 W, 2025년 8월 출시, 개발자 키트 $3,499 |
| **NVIDIA "The Three Computers for Robotics"** | DGX(학습) → Omniverse/Cosmos(시뮬레이션) → Jetson(실행)의 세 컴퓨터 모델. Physical AI 정의: "물리 세계를 인지·추론·상호작용하는 엔드투엔드 모델" |

### 2.2 학술 마이크로벤치마크 논문
| 논문 | 핵심 발견 (게임에 쓴 수치) |
|---|---|
| **Luo et al., "Benchmarking and Dissecting the Nvidia Hopper GPU Architecture" (arXiv 2402.13499, 2024) 및 2025 확장판 (arXiv 2501.12084)** | H800 실측 지연: 공유 메모리 29 클럭, L1 33~41, L2 근접 파티션 264.5 / 원격 502, HBM 479(2024) ~ 656(2025, 미스 경로 포함); DSMEM 약 180 클럭; "L2는 L1의 6.5배, 전역은 L2의 약 2배"; wgmma 명령 없이는 4세대 텐서 코어 성능을 다 못 씀; RTX 4090: 공유 30.1, L1 43.4, L2 273~285, 전역 541~571 |
| **Jia et al., "Dissecting the NVIDIA Volta GPU Architecture via Microbenchmarking" (arXiv 1804.06826, 2018)** | 레지스터 파일 뱅크 2개 × 64-bit, 뱅크 충돌 모델, L0 명령 캐시 약 12 KiB, FFMA 의존 지연 4클럭, V100 L1 28 / L2 약 193 클럭, 명령어 128-bit 제어 코드(대기 카운트·스코어보드 6개) |
| **Abdelkhalik et al., "Demystifying the Nvidia Ampere Architecture…" (arXiv 2208.11174, 2022)** | A100 L1 33, L2 200, 전역 290 클럭 — 세대 간 비교용 |
| **"Microbenchmarking NVIDIA's Blackwell Architecture" (arXiv 2512.02189)** | B200 148 SM, L2 126 MB 4파티션, TMEM 256 KB/SM(16 TB/s 읽기), tcgen05.mma 지연 11.0~11.4 클럭, 파티션당 FP16 1,024 MAC/clk(Hopper의 2배) |
| **"Dissecting the NVIDIA Blackwell Architecture with Microbenchmarks" (arXiv 2507.10789, 소비자 GB203)** | wgmma 대비 지연 비교, 소비자 Blackwell FP64 SM당 2개 |
| **MICRO 2025 역공학 논문 (레지스터 파일/스케줄링)** | 현대 NVIDIA GPU는 오퍼랜드 컬렉터를 쓰지 않고 컴파일러가 제어 코드에 스케줄링 힌트를 미리 적음 |
| **Chips and Cheese: "NVIDIA's H100: Funny L2, and Tons of Bandwidth" / "B200: Keeping the CUDA Juggernaut Rolling"** | H100 L2 = 25 MB × 2, 원격 파티션 약 2배 지연, 근접 L2 대역폭 5.5 TB/s 이상; B200 다이당 80 SM 중 74 활성, L1 39 클럭(19.6 ns), L2 근접 150 ns / 원격 190~220 ns |

### 2.3 공정·미시 구조 (TSMC N5/N4, SRAM, FinFET, 배선)
| 자료 | 핵심 발견 |
|---|---|
| **TSMC IEDM 2019 "5nm CMOS Production Technology Platform…" (WikiChip / SemiWiki 요약)** | HD 6T SRAM 셀 **0.021 μm²**, HP 셀 0.025 μm²; EUV 10층 이상; PMOS SiGe 고이동도 채널 최초 양산; N7 대비 밀도 1.84배; 마스크 81층(EUV 없으면 115층) |
| **Angstronomics "The TRUTH of TSMC 5nm" (SEM 실측)** | 접촉 게이트 피치(CPP) **51 nm**(HD)/57 nm(HP), 핀 피치 **28 nm**, M0 피치 28 nm, M2 35 nm, 셀 높이 210 nm(6트랙); N4는 CPP 49/55 nm; 논리 밀도 약 138 MTr/mm² (WikiChip 초기 추정 171은 과대) |
| **WikiChip IEDM 2022 "Did we just witness the death of SRAM?"** | N3E SRAM 셀이 N5와 같은 0.021 μm² → SRAM 축소 정체 |
| **TechInsights (Apple C1 N4 단면)** | N4 금속층 = Cu 15층 + Al 1층 (GPU 4N 층수는 미공개) |
| **TSMC 특허 · TCAD 문헌 · imec/ASAP7** | 핀 폭 약 5~6 nm, 핀 높이 약 50~55 nm, 물리 게이트 길이 약 16~20 nm **(모두 추정, 공개 실측 없음)**; FO4 게이트 지연 약 6~8 ps; 서브스레숄드 스윙 약 63 mV/dec |
| **Intel 45 nm HKMG 발표 (2007, C&EN)** | SiO₂ 1.2 nm 이하에서 터널링 누설 폭증 → HfO₂ high-k(k≈25) 도입, 누설 NMOS 25배·PMOS 1,000배 감소 |
| **Ioffe NSM 실리콘 물성 · 결정학 표준값** | 격자 상수 0.5431 nm, 최근접 거리 0.235 nm, 원자 밀도 5 × 10²²/cm³, 밴드갭 1.12 eV, 포화 속도 약 10⁷ cm/s, 전자 이동도 약 1,400 cm²/V·s |
| **Pollack (MICRO-32, 1999) 전력 밀도 도표** | 핫플레이트 10, 원자로 노심 100, 로켓 노즐 1,000 W/cm² → H100 700 W ÷ 814 mm² ≈ 86 W/cm² (계산) |
| **NVIDIA nvidia-smi T.Limit 문서 · 포럼** | H100 목표 온도 90 °C, 하드웨어 슬로다운 약 92 °C, 셧다운 약 97 °C (85 °C 공식값은 없음) |
| **Meta "The Llama 3 Herd of Models" (2024)** | H100 16,384장 × 54일 학습 중 중단 419회, 그중 정정 불가 HBM3 오류 72회 → "우주선 소프트 에러 + ECC" 이벤트의 근거 |
| **FMA 게이트 수 (경험식·문헌)** | 24-bit 곱셈기 ≈ 4,000 NAND2 등가 → FP32 FMA 전체 약 1만~2.5만 게이트(4만~10만 트랜지스터) **(추정; 공개 실측 없음)** |

### 2.4 제조 공급망 (모래 → GPU)
| 스테이션 | 자료 | 핵심 사실 |
|---|---|---|
| 석영 광산 | Sibelco 보도자료, Construction Physics, Wikipedia HPQ | 스프루스 파인이 세계 고순도 석영의 약 70~90%(BloombergNEF 80%), 2008년 화재·2024년 허리케인 헐린 조업 중단 |
| 금속급 실리콘 | USGS MCS 2024, Springer LCA 논문 | 아크로 1,300~2,000 °C, 순도 98~99%, 톤당 10~13 MWh, 중국 약 85% |
| 폴리실리콘 | Bernreuter, Wacker 연차보고서 | 지멘스 공정 TCS 증착 1,000~1,100 °C, 9N~11N(원자 1,000억 개당 불순물 1개) |
| 초크랄스키 성장 | USPTO 6689209, 결정 성장 문헌 | 융점 1,414 °C, 인상 0.3~0.7 mm/min, 24~72 h, 300 mm × 1~2 m × 200~300 kg, 도가니 1회용 |
| 웨이퍼 가공 | SEMI 규격, Siltronic/MEMC 특허 | 775 ± 25 μm, 래핑 25 μm/면, CMP 후 서브 nm 거칠기 |
| 팹 전공정 | Asianometry, WikiChip, TSMC Fab 18 | 공정 1,000회 이상, 약 3~4개월, 팹 건설비 200억 달러 이상, 하루 물 5,000만 L(90% 재활용) |
| EUV | ASML NXE:3600D 스펙, TRUMPF/Cymer, ZEISS | 파장 13.5 nm, 주석 방울 초당 5만 개, 플라즈마 약 50만 K, 광원 250 W(CO₂ 레이저 43 kW), 거울 반사율 약 70%, 장비 약 1.83억 달러, "독일 크기 거울에 요철 0.1 mm" |
| 배선(BEOL) | Semiconductor Digest, SemiAnalysis N3 | 구리 다마신, M0 28 nm, Co 라이너 M0~M4, via pillar 대량 사용 |
| 웨이퍼 테스트·비닝 | Technoprobe, 수율 계산기 | 프로브 접점 5만 개 이상, GH100 144 SM → SXM5 132 / PCIe 114, 814 mm² 포아송 수율 약 44~57% (추정) |
| 다이싱 | DISCO | 스텔스 다이싱(내부 레이저 균열), 300 mm 웨이퍼당 GH100 후보 60~65개 |
| HBM | SK hynix 보도자료(12단 HBM3/HBM3E, MR-MUF), JEDEC | 12-Hi 다이 약 30 μm(40% 얇게), 1,024-bit/스택, HBM3 819 GB/s, HBM3E 9.6 Gbps, TSV 다이당 8,000개 이상(추정), 스택 높이 720/775 μm |
| CoWoS | TSMC 3DFabric, 3D InCites, SemiAnalysis | 레티클 858 mm², CoWoS-S 3.3× → CoWoS-L 3.5×(2024) → 5.5× → 9.5×(2027) → 14×; 마이크로범프 약 40 μm, C4 약 130 μm; 2023년 H100 병목은 CoWoS 용량; 패키지 약 $750(S) / $1,100~1,500(L) (분석가 추정) |
| 기판(ABF) | Ajinomoto 공식 | 조미료 회사 아지노모토가 개발한 절연 필름, 점유율 약 95% |
| 최종 테스트 | Igor's Lab(Speedo), Advantest | 번인 125 °C 이상, 온칩 Speedo 값으로 스피드 비닝 → 칩마다 전압이 다름 |
| 보드 조립 | ServeTheHome, Tom's Hardware SXM5 사진, HGX PCF | SXM5 700 W, 파워 스테이지 약 61개, 팬 없음; HGX H100 베이스보드 24 kg · 5,600 W · NVSwitch 4개; 리플로우 SAC305 피크 235~250 °C |
| 시스템 | NVIDIA DGX/NVL72, Epoch AI | DGX H100 8 GPU 10.2 kW; 모래 → 출하 약 6~7개월(팹 3~4 + 패키징·테스트 약 3); N4 웨이퍼 약 $18~20k; H100 약 $25~40k (추정) |

### 2.5 Physical AI · 로봇 · 스토리 근거
| 자료 | 핵심 발견 |
|---|---|
| **GR00T N1 논문 (arXiv 2503.14734)** | 22억 파라미터 이중 구조: System 2 VLM(Eagle-2, 13.4억, 약 10 Hz) + System 1 flow-matching DiT(약 120 Hz, 액션 16개, 디노이징 4스텝); 224×224 프레임 → 이미지 토큰 64개; L40에서 액션 16개 생성 63.9 ms; 학습 GPU 1,024장(H100 5만 시간) |
| **Diffusion Policy (Chi et al., RSS 2023)** | 정책 10 Hz → 125 Hz 보간 실행, 예측 16스텝·실행 8스텝 |
| **Figure Helix · 1X Redwood · RL 보행 논문** | Helix: 7B VLM 7~9 Hz + 80M 200 Hz, 지연 100 ms 미만; Redwood 1.6억 파라미터 5 Hz; 보행 정책 50 Hz → PD 500 Hz~1 kHz → 전류 루프 수 kHz |
| **NVIDIA GTC/CES 키노트 인용** | "로봇공학의 ChatGPT 모먼트": GTC 2024 "may be" → CES 2025 "just around the corner" → CES 2026 "is here" |
| **일반인용 숫자** | H100 트랜지스터 800억 vs 뇌 뉴런 860억; H100 ≈ 1997년 ASCI Red 슈퍼컴퓨터의 약 3,700배 성능을 1/1000 전력으로; Gemini 프롬프트 1회 약 0.24 Wh; NVIDIA 시총 1조 → 5조 달러 |

---

## 3. 게임 층 구조에 반영한 스케일 사다리 (요약)

| 층 | 대상 | 대표 크기 | 주인공 키(게임) | 확인 상태 |
|---|---|---|---|---|
| L0 | SXM5 모듈 / PCIe 카드 | 약 150 × 80 mm(추정) / 304 mm | 1.5 mm | 모듈 치수 미확인 |
| L1 | 패키지·인터포저 | 약 55~58 mm(추정) | 0.5 mm | 미확인 |
| L2 | GH100 다이 | 814 mm² ≈ 28.5 mm 변 | 0.25 mm | 면적 확인 |
| L3 | GPC | 약 7~9 mm | 80 μm | 추정 |
| L4 | TPC | 약 2.6 mm | 30 μm | 추정(GA102 기반) |
| L5 | SM | 약 1.9 mm | 15 μm | 추정 |
| L6 | 서브파티션 | 약 0.8 mm | 6 μm | 추정 |
| L7 | 워프(개념적) | — | 2 μm | 개념 층 |
| L8 | FMA 유닛 | 수십~수백 μm | 0.5 μm | 미확인 |
| L9 | 6T SRAM 셀 | 0.021 μm² ≈ 145 nm | 50 nm | 확인(N5) |
| L10 | 배선(BEOL) | M0 피치 28 nm, 약 15층 | 25 nm | 피치 확인, 층수 미확인 |
| L11 | 표준 셀(인버터) | 높이 210 nm | 15 nm | 확인 |
| L12 | FinFET | CPP 51 nm, 핀 폭 약 6 nm | 5 nm | 피치 확인, 핀 치수 추정 |
| L13 | 게이트 산화막 | 약 2 nm(SiO₂ 0.5 + HfO₂ 1.5~2) | 1.5 nm | 추정 |
| L14 | 실리콘 격자 | a = 0.5431 nm | 0.5 nm | 확인 |

보드(0.3 m) → 원자(0.24 nm) 총 축소 배율 ≈ **1.3 × 10⁹** (계산). 시간 축: 클럭 1주기 0.505 ns(H100 1.98 GHz), 그 시간에 빛은 15.1 cm 이동.

---

## 4. 조사 중 바로잡은 통념 (게임 텍스트에 반영)

1. **"H100 텐서 코어당 1,024 FMA/clk"는 틀림.** 4세대는 텐서 코어당 FP16 512 FMA/clk(SM당 2,048), FP8은 2배. 1,024/SM는 A100 수치.
2. **H100 부스트 1,980 MHz는 NVIDIA 문서에 없음.** FP32 67 TFLOPS 역산은 1.98 GHz, 텐서 989 TFLOPS 역산은 1.83 GHz. 게임에서는 "약 2 GHz".
3. **"4 nm"는 물리 치수가 아님.** 실제 최소 피치는 핀/M0 28 nm, CPP 51 nm.
4. **B200 메모리는 데이터시트 기준 180 GB / 7.7 TB/s.** 192 GB / 8 TB/s는 마케팅 수치. 활성 SM 148(풀 160).
5. **RTX 4090 SM당 최대 워프는 48개**(Hopper 64개와 다름).
6. **Jetson Thor "96 텐서 코어"는 풀칩 기준.** 활성 SM 20개 → 80개.
7. **H100 품귀는 실리콘 수율이 아니라 CoWoS 패키징 용량 때문.**
8. **SRAM 셀은 N3E에서 더 작아지지 않음**(0.021 μm² 동일).
9. **H100 열 한계는 85 °C가 아니라 T.Limit 기준 90 °C 목표 / 약 92 °C 슬로다운 / 약 97 °C 셧다운.**
10. **GR00T N1 System 2 10 Hz는 L40 기준 실측**이며 Jetson 기준이 아님.

---

## 5. 미확인·추정으로 남긴 항목 (게임 내 "약/추정" 표기 대상)

- SXM5 모듈·패키지 치수, GH100 다이 가로세로, GPC/TPC/SM 개별 면적, FMA 유닛 면적
- TSMC 4N 물리 게이트 길이, 핀 폭·높이, HKMG 각 층 두께, 문턱 전압, GPU 4N 금속층 수
- B200 다이당 면적, GPC 수, PCIe 세대, 클럭, HBM 지연
- HBM TSV 직경(5~10 μm, 2차 자료), FP32 FMA 게이트 수, 칩 내 총 배선 길이, 웨이퍼 팹 내 이동 거리
- CoWoS 패키지 단가, 웨이퍼 단가, H100 판매가, 번인 불량률, KYEC 점유율 — 분석가 추정
- 초크랄스키 "잉크병 대신 주석" 일화 — 널리 회자되나 1차 출처 없음

---

## 6. 주요 출처 (게임 도감 "출처" 탭과 동일 목록)

- NVIDIA H100 Whitepaper — https://resources.nvidia.com/en-us-tensor-core
- NVIDIA Hopper In-Depth — https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/
- NVIDIA Ada Whitepaper — https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-ada-gpu-architecture.pdf
- NVIDIA Blackwell — https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/
- NVIDIA GB200 NVL72 — https://www.nvidia.com/en-us/data-center/gb200-nvl72/
- CUDA C++ Programming Guide — https://docs.nvidia.com/cuda/cuda-c-programming-guide/
- Hopper Tuning Guide — https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html
- Luo et al. 2024 (Hopper microbenchmark) — https://arxiv.org/abs/2402.13499
- Luo et al. 2025 확장판 — https://arxiv.org/pdf/2501.12084
- Jia et al. 2018 (Volta microbenchmark) — https://arxiv.org/pdf/1804.06826
- Blackwell B200 microbenchmark — https://arxiv.org/html/2512.02189v1
- Chips and Cheese H100 — https://chipsandcheese.com/p/nvidias-h100-funny-l2-and-tons-of-bandwidth
- Chips and Cheese B200 — https://chipsandcheese.com/p/nvidias-b200-keeping-the-cuda-juggernaut
- WikiChip TSMC 5 nm — https://en.wikichip.org/wiki/5_nm_lithography_process
- Angstronomics TSMC 5nm — https://www.angstronomics.com/p/the-truth-of-tsmc-5nm
- SemiWiki IEDM 2019 N5 — https://semiwiki.com/semiconductor-manufacturers/tsmc/282339-tsmc-unveils-details-of-5nm-cmos-production-technology-platform-featuring-euv-and-high-mobility-channel-finfets-at-iedm2019/
- WikiChip IEDM 2022 SRAM — https://fuse.wikichip.org/news/7343/iedm-2022-did-we-just-witness-the-death-of-sram/
- SK hynix 12-layer HBM3 — https://news.skhynix.com/en/sk-hynix-develops-industrys-first-12-layer-hbm3/
- TSMC CoWoS — https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm
- ASML NXE:3600D — https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe-3600d
- ZEISS EUV optics — https://www.zeiss.com/semiconductor-manufacturing-technology/inspiring-technology/euv-lithography.html
- USGS Silicon 2024 — https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-silicon.pdf
- Ajinomoto ABF — https://www.ajinomoto.com/innovation/our_innovation/buildupfilm
- SemiAnalysis CoWoS/HBM — https://semianalysis.com/2023/07/26/ai-expansion-supply-chain-analysis/
- Intel 45 nm HKMG (C&EN) — https://cen.acs.org/articles/85/web/2007/01/Intel-Unveils-New-Transistor.html
- Ioffe NSM Silicon — http://www.ioffe.ru/SVA/NSM/Semicond/Si/electric.html
- Pollack MICRO-32 — https://www.cs.cmu.edu/~ckh/DOCS/pollack-micro32.pdf
- Meta Llama 3 — https://arxiv.org/abs/2407.21783
- NVIDIA Jetson Thor — https://blogs.nvidia.com/blog/jetson-thor-physical-ai-edge
- NVIDIA Three Computers — https://blogs.nvidia.com/blog/three-computers-robotics/
- GR00T N1 — https://arxiv.org/html/2503.14734v1
- Diffusion Policy — https://arxiv.org/abs/2303.04137

(전체 약 250건의 URL은 `docs/research/*.md` 각 문서 말미 "출처" 절 참조)
