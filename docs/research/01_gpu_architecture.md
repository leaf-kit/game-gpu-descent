# 01. NVIDIA GPU 아키텍처 — 레벨별 하강(Descent) 리서치

> 게임 컨셉: 플레이어가 GPU 보드에서 출발해 패키지 → 다이 → GPC → TPC → SM → 서브파티션 → 코어/레지스터 → SRAM 셀 → 트랜지스터 → 원자까지 "내려간다".
> 선택 가능 GPU 3종: **(a) H100 SXM5 (Hopper, GH100)**, **(b) B200 / GB200 (Blackwell)**, **(c) GeForce RTX 4090 (Ada Lovelace, AD102)**.
>
> **표기 규칙**
> - 숫자 뒤 아무 표시 없음 = NVIDIA 공식 문서(백서/데이터시트/개발자 블로그) 또는 1차 학술 논문에서 확인.
> - **(측정)** = 마이크로벤치마크 논문/Chips and Cheese 실측치 (칩·방법에 따라 달라짐).
> - **(추정)** = 공식 수치에서 산술적으로 유도했거나 애널리스트 추정. 근거를 병기.
> - **(미확인)** = 신뢰할 만한 1차 출처를 찾지 못함. 게임에 쓰려면 "약/대략"으로 표현할 것.
> - 작성일 2026-09-12. 출처 URL은 5장.

---

## 0. 한눈에 보는 3종 비교 (Top-level spec sheet)

| 항목 | H100 SXM5 (Hopper) | B200 (Blackwell) | RTX 4090 (Ada) |
|---|---|---|---|
| 다이(die) | GH100 ×1 | 2개 다이(레티클 한계 크기) NV-HBI 10 TB/s로 결합 | AD102 ×1 |
| 공정(process) | TSMC 4N (NVIDIA 맞춤 5nm급) | TSMC 4NP | TSMC 4N |
| 트랜지스터 | 800억 (80 B) | 2,080억 (208 B, 다이당 104 B) | 763억 (76.3 B) |
| 다이 면적 | 814 mm² | 다이당 공식 미공개, 합계 "약 1,600 mm²" (IEEE Spectrum) | 608.5 mm² |
| 트랜지스터 밀도 (추정) | ≈98 MTr/mm² | — | ≈125 MTr/mm² |
| 풀 다이 SM | 144 (8 GPC × 9 TPC × 2) | 다이당 80 (측정, Chips and Cheese) → 160 | 144 (12 GPC × 6 TPC × 2) |
| 제품 활성 SM | 132 (66 TPC, 8 GPC) | 148 (다이당 74) | 128 (64 TPC, 11 GPC) |
| FP32 CUDA 코어 | 16,896 | 18,944 (148 × 128, 추정) | 16,384 |
| Tensor Core | 528 (4세대) | 592 (5세대, 148 × 4, 추정) | 512 (4세대) |
| L2 캐시 | 50 MB (풀 다이 60 MB), 2 파티션 | 126 MB (측정), 4 파티션 (측정 논문) | 72 MB (풀 다이 96 MB) |
| 메모리 | 80 GB HBM3, 5 스택, 5120-bit, 3.35 TB/s | HBM3e 8 스택, 물리 192 GB / 데이터시트 180 GB, 8 TB/s (데이터시트 7.7 TB/s) | 24 GB GDDR6X, 384-bit, 21 Gbps, 1,008 GB/s |
| 부스트 클럭 | 1,980 MHz (GPU DB/nvidia-smi; NVIDIA 백서엔 "Not Finalized")¹ | 공식 미공개; 측정 역산 ≈1.9~2.0 GHz (미확인) | 2,520 MHz (백서) |
| TDP/TGP | 700 W | 1,000 W | 450 W |
| 인터커넥트 | NVLink 4세대 18링크 900 GB/s, PCIe Gen5 ×16 128 GB/s | NVLink 5세대 1.8 TB/s | PCIe Gen4 ×16 |
| FP16 Tensor (dense) | 989 TFLOPS (백서 초판 1,000) | 2.25 PFLOPS | 165 TFLOPS (FP32 누산) / 330 (FP16 누산) |
| FP8 Tensor (dense) | 1,979 TFLOPS (백서 초판 2,000) | 4.5 PFLOPS | 661 TFLOPS |
| FP4 Tensor (dense) | 없음 | 9 PFLOPS | 없음 |
| 비디오 엔진 | 7 NVDEC + 7 NVJPG (데이터시트), NVENC 없음 | (미확인) | 2 NVENC(8세대, AV1) + 1 NVDEC(5세대) |

¹ H100 SXM5 공식 TFLOPS를 역산하면 FP32 67 TFLOPS = 16,896 × 2 × 1.98 GHz로 1.98 GHz가 맞지만, FP16 Tensor 989 TFLOPS = 528 TC × 1,024 FLOP/clk × **1.83 GHz**로 계산된다. 즉 NVIDIA는 Tensor 피크를 낮은 클럭 기준으로 산정한 것으로 보인다(추정). 게임에서는 "약 2 GHz"로 표현하면 안전.

---

## 1. 레벨별 계층 표 (Level-by-level hierarchy)

### 1.0 비유 체계 (도시 비유)

| 레벨 | 비유 |
|---|---|
| 보드/모듈 | 섬(island) 위에 세워진 **대도시권(metro area)** — 발전소(VRM), 항만(PCIe/NVLink 커넥터) 포함 |
| 패키지 | 도시를 받치는 **인공 지반(interposer)** 과 도시 옆 **고층 창고단지(HBM 스택)** |
| 다이 | **도시(city)** 그 자체 |
| GPC | **행정구(district)** — 각 구마다 구청(래스터 엔진)과 여러 블록 |
| TPC | **블록(block)** — 집 2채(SM)와 공동 시설(PolyMorph 엔진) |
| SM | **집(house)** — 방 4개(서브파티션), 공동 창고(L1/공유 메모리), 우편함(TMA) |
| 서브파티션 | **방(room)** — 방장(워프 스케줄러) 1명, 작업대 32개(FP32), 특수 작업대(Tensor Core) 1대 |
| 워프 | 한 방에서 **같은 지시를 동시에 수행하는 32명의 작업조(crew)** |
| 스레드/레인 | 작업조원 **1명(worker)** |
| CUDA 코어 | 작업대 1개 — 곱셈+덧셈을 한 번에(FMA) |
| Tensor Core | **행렬 전용 대형 프레스 기계** |
| 레지스터 파일 | 작업자 손 옆 **서랍(drawer)** |
| L1/공유 메모리 | 집 안 **창고(pantry)** |
| L2 캐시 | 도시 중앙 **물류센터(depot)** 2동(H100) |
| HBM | 도시 외곽 **고층 창고단지(warehouse towers)** |
| SRAM 셀 | 서랍 속 **칸막이 1개(1 bit)** |
| 트랜지스터 | 칸막이를 여닫는 **스위치(switch)** |
| 원자 | 스위치를 이루는 **벽돌(brick)** |

### 1.1 보드 / 모듈 (PCB / Board)

| 항목 | H100 SXM5 | B200 / GB200 | RTX 4090 |
|---|---|---|---|
| 폼팩터 | SXM5 메자닌 모듈, HGX H100 베이스보드에 8장 장착 | SXM 계열 모듈(매체에서 "SXM6" 호칭, 미확인), HGX B200 베이스보드 8장; GB200 = Grace CPU 1 + Blackwell GPU 2 (NVLink-C2C 900 GB/s) | PCIe 카드, Founders Edition 304 × 137 × 61 mm, 3슬롯, 2,186 g (Tom's Hardware) |
| 모듈 크기 | ≈150 × 80 mm (Locuza 추정, 미확인) | (미확인) | 304 mm (NVIDIA 공식 클리어런스) |
| 전력 | 700 W TDP, 베이스보드 통해 급전 | 1,000 W TDP | 450 W TGP, 16핀 12VHPWR 커넥터(어댑터: 8핀 ×3~4) |
| 호스트 연결 | PCIe Gen5 ×16 (128 GB/s 양방향 합) | PCIe (Gen6 주장 다수, 미확인) | PCIe Gen4 ×16 |
| GPU 간 연결 | NVLink 4세대 18링크, 900 GB/s; NVSwitch 3세대 | NVLink 5세대 1.8 TB/s/GPU; HGX 8-GPU 합 14.4 TB/s; NVL72 랙 130 TB/s | 없음 (NVLink 미지원) |
| 메모리 칩 위치 | 패키지 안(HBM) | 패키지 안(HBM3e) | PCB 위 GDDR6X 칩 12개 (24 GB / 32-bit × 12 채널, 추정) |
| 부모 대비 개수 | HGX 베이스보드당 8 | HGX당 8; GB200 슈퍼칩당 2; NVL72당 72 | PC당 1 |
| 하는 일 | 전기를 GPU가 쓰는 낮은 전압으로 바꾸고(VRM), 열을 빼고, 바깥 세계와 데이터를 주고받는 항구 | 동일 | 동일 + 모니터 출력 |
| 비유 | 섬 위의 대도시권 | 섬 3개(CPU 1 + GPU 2)가 다리로 연결된 도시권 | 대도시권 |

### 1.2 패키지 (Package)

| 항목 | H100 SXM5 | B200 | RTX 4090 |
|---|---|---|---|
| 패키징 기술 | TSMC **CoWoS-S** (실리콘 인터포저, 65 nm급 공정으로 제작) | TSMC **CoWoS-L** (RDL 인터포저 + 국소 실리콘 브리지 LSI) — 양산 최초 적용 | 유기 기판 위 플립칩 BGA, 인터포저 없음 |
| 패키지 크기 | ≈55 × 58 mm (Locuza 추정, 미확인) | (미확인) | (미확인) |
| HBM 스택 | 풀 다이 6 사이트 중 **5 스택 활성**, 스택당 16 GB (80 GB ÷ 5), 1024-bit/스택 → 5120-bit | **8 스택 HBM3e**, 스택당 24 GB(추정: 192 ÷ 8), 스택당 1 TB/s(추정: 8 ÷ 8) | 없음 |
| HBM 스택 구조 | SK hynix HBM3: 8-Hi 16 GB / 12-Hi 24 GB 발표(2021.10), TSV로 DRAM 다이 수직 적층, 스택당 최대 819 GB/s(6.4 Gbps) | HBM3e: 핀당 최대 9.6 Gbps, 12-Hi 36 GB까지(JEDEC) | — |
| 메모리 대역폭 | 3.35 TB/s (5120-bit × 5.23 Gbps ÷ 8 = 3.35) | 8 TB/s (데이터시트 7.7 TB/s) | 1,008 GB/s (384-bit × 21 Gbps ÷ 8) |
| 다이-다이 연결 | — | **NV-HBI 10 TB/s** (두 다이를 하나의 GPU로 동작) | — |
| 부모 대비 개수 | 모듈당 1 | 모듈당 1 (GPU 다이 2 + HBM 8 포함) | 카드당 1 |
| 하는 일 | 거대한 칩과 메모리 탑을 한 덩어리로 묶어 수천 개의 초미세 배선으로 연결 | 동일 + 두 도시를 하나처럼 잇는 초광대역 다리 | 칩을 기판에 얹어 PCB와 연결 |
| 비유 | 인공 지반 위 도시 1개 + 창고탑 5개 | 인공 지반 위 쌍둥이 도시 + 창고탑 8개 | 지반 위 도시 1개, 창고는 도시 밖(PCB) |

### 1.3 다이 (Die)

| 항목 | H100 SXM5 (GH100) | B200 | RTX 4090 (AD102) |
|---|---|---|---|
| 면적 | 814 mm² (스크라이브 라인 제외); 한 변 ≈28.5 mm 정사각형 환산(추정) | 다이당 미공개(레티클 한계 ≈800 mm² 급, 추정); 합계 ≈1,600 mm² | 608.5 mm²; 한 변 ≈24.7 mm 환산(추정) |
| 트랜지스터 | 80 B | 다이당 104 B, 합 208 B | 76.3 B |
| 공정 | TSMC 4N (N5 파생, NVIDIA 맞춤) | TSMC 4NP | TSMC 4N |
| 레티클 한계 | 단일 노광 필드 ≈858 mm² — GH100은 사실상 한계치 | 다이 2개 각각 레티클 한계급 | — |
| 부모 대비 개수 | 패키지당 1 | 패키지당 2 | 패키지당 1 |
| 하는 일 | 실리콘 한 조각에 새겨진 도시 전체 | 두 조각이 한 도시처럼 | 한 조각 |
| 비유 | 도시 | 쌍둥이 도시 | 도시 |

### 1.4 풀 다이 레이아웃 (Full-die layout)

| 구성 요소 | H100 SXM5 (풀 GH100 → 제품) | B200 | RTX 4090 (풀 AD102 → 제품) |
|---|---|---|---|
| GPC | 8 → 8 | 측정 논문: "148 SMs across eight GPCs"(다이당인지 합계인지 미확인) | 12 → 11 |
| TPC | 72 (9/GPC) → 66 | (미확인) | 72 (6/GPC) → 64 |
| SM | 144 → 132 | 160 → 148 | 144 → 128 |
| L2 캐시 | 60 MB → 50 MB, **2 파티션**, "partitioned crossbar" 구조 | 126 MB (측정), 4 파티션 (측정 논문) — 다이당 2개로 추정 | 96 MB (98,304 KB) → 72 MB (73,728 KB) |
| 메모리 컨트롤러 | 12 × 512-bit (6 HBM) → 10 × 512-bit (5 HBM) | 다이당 4096-bit (8 스택 × 1024-bit ÷ 2) | 12 × 32-bit = 384-bit GDDR6X |
| NVLink | 4세대 18링크, 900 GB/s | 5세대, 1.8 TB/s | 없음 |
| PCIe | Gen5 ×16 | (Gen6, 미확인) | Gen4 ×16 |
| GigaThread 엔진 | 있음 — 스레드 블록을 SM에 배분하는 칩 전역 스케줄러 (Fermi 백서에서 정의; 이후 세대 다이어그램에 동일 명칭) | 있음 | 있음 |
| 비디오/이미지 엔진 | 풀 GH100: 8 NVDEC + 8 NVJPG (백서 v1.01); 제품 H100: 7 NVDEC + 7 NVJPG (데이터시트); **NVENC 없음, RT Core 없음, 디스플레이 출력 없음** | 디컴프레션 엔진, RAS 엔진 (NVIDIA) | 2 NVENC (8세대, AV1) + 1 NVDEC (5세대); RT Core 144 → 128 |
| 그래픽 기능 | 2개 TPC만 그래픽(버텍스/픽셀 셰이더) 가능 | (미확인) | 전 GPC 그래픽 가능, ROP 192 → 176 |
| Copy Engine | 있음 (개수 미확인) | (미확인) | (미확인) |
| MIG | 최대 7 인스턴스 (각 10 GB), 인스턴스마다 NVDEC/NVJPG 전용 배정 | 최대 7 (각 23 GB) | 없음 |
| 하는 일 | 도시 지도: 행정구 8개, 물류센터 2동, 항만(NVLink/PCIe), 배차 본부(GigaThread) | 쌍둥이 도시 지도 | 행정구 12개짜리 도시, 방송국(NVENC) 포함 |

### 1.5 GPC (Graphics Processing Cluster, 그래픽 처리 클러스터)

| 항목 | H100 | B200 | RTX 4090 |
|---|---|---|---|
| 부모(다이) 대비 개수 | 8 | (미확인) | 11 (풀 12) |
| 자식(TPC) 수 | 최대 9 (제품은 66/8 = 평균 8.25, 일부 GPC는 TPC 비활성) | (미확인) | 6 |
| 포함 요소 | TPC들, 래스터 엔진(그래픽 가능 GPC만 의미 있음) | — | **래스터 엔진 1, ROP 파티션 2 (각 8 ROP = 16 ROP), TPC 6, SM 12** |
| 클러스터 스케줄링 | Hopper부터 **스레드 블록 클러스터**는 반드시 같은 GPC 안 SM들에 배치됨 (최대 8 이식성 / 16 옵트인) | 동일 (최대 16 옵트인) | 해당 없음(CC 8.9) |
| 하는 일 | 여러 블록을 묶은 행정구. 그래픽 GPU에서는 삼각형을 픽셀로 바꾸는 구청(래스터 엔진)이 여기 있음 | 동일 | 동일 |
| 비유 | 행정구 | 행정구 | 행정구 |

### 1.6 TPC (Texture Processing Cluster)

| 항목 | H100 | B200 | RTX 4090 |
|---|---|---|---|
| 부모(GPC) 대비 개수 | 9 (풀) | (미확인) | 6 |
| 자식(SM) 수 | 2 | 2 (추정) | 2 |
| 포함 요소 | SM 2 (+ 그래픽용 PolyMorph 엔진은 그래픽 가능 TPC 2개에만 의미) | SM 2 | **PolyMorph 엔진 1 + SM 2** |
| 하는 일 | 집 두 채가 공동 시설(지오메트리/테셀레이션 담당 PolyMorph)을 공유하는 블록 | 동일 | 동일 |
| 비유 | 블록 | 블록 | 블록 |

### 1.7 SM (Streaming Multiprocessor, 스트리밍 멀티프로세서)

| 항목 | H100 (GH100 SM) | B200 SM | RTX 4090 (AD10x SM) |
|---|---|---|---|
| 부모(TPC) 대비 개수 | 2 | 2 | 2 |
| 서브파티션(processing block) | 4 | 4 | 4 |
| FP32 CUDA 코어 | 128 | 128 | 128 (64는 FP32 전용 + 64는 FP32/INT32 겸용) |
| INT32 | 64 | (GB203 소비자 다이는 INT32/FP32 통합; B200 미확인) | 64 (FP32 겸용) |
| FP64 | 64 (Tensor 제외) | 64 (추정: 37 TFLOPS ÷ 148 SM ÷ 2 ÷ ≈1.95 GHz ≈ 64) | 2 (FP32의 1/64 속도) |
| Tensor Core | 4 (4세대) | 4 (5세대) | 4 (4세대) |
| RT Core | 없음 | 없음(데이터센터) | 1 (3세대) |
| 텍스처 유닛 | 4 (528 ÷ 132) | (미확인) | 4 |
| LD/ST 유닛 | 32 (8 × 4) | (미확인) | 16 (4 × 4) |
| SFU | 16 (4 × 4) | (미확인) | 4 (1 × 4) |
| 워프 스케줄러 / 디스패치 | 4 / 4 | 4 / 4 | 4 / 4 |
| 레지스터 파일 | 256 KB = 65,536 × 32-bit | 256 KB | 256 KB |
| L1 데이터 캐시 + 공유 메모리 | **256 KB** 통합, 공유 메모리 최대 228 KB (블록당 227 KB) | 256 KB (측정, Chips and Cheese; 분할 216/112/16 KB 등) | 128 KB 통합 |
| Tensor Memory (TMEM) | 없음 | **256 KB** (128 레인 × 512 열 × 32-bit), Tensor Core 전용 | 없음 |
| TMA (Tensor Memory Accelerator) | 있음 — 전역↔공유 메모리 대용량 비동기 복사 | 있음 | 없음 |
| DSMEM (분산 공유 메모리) | 있음 — 클러스터 내 다른 SM의 공유 메모리에 load/store/atomic | 있음 | 없음 |
| 최대 상주 | 64 워프 = 2,048 스레드, 32 블록 | 64 워프 (Blackwell 튜닝 가이드) | **48 워프 = 1,536 스레드, 24 블록** (CC 8.9, Ada 튜닝 가이드); 공유 메모리 SM당 최대 100 KB(블록당 99 KB) |
| 클럭당 연산 (dense FP16 Tensor) | 2,048 FMA/clk/SM (A100의 2배, 백서) | 4,096 FMA/clk/SM (측정: 파티션당 1,024 MAC/clk) | 512 FMA/clk/SM (FP16 누산; 역산: 330.3 TFLOPS ÷ 128 ÷ 2 ÷ 2.52 GHz) |
| 하는 일 | GPU의 기본 "집". 수천 개 스레드가 동시에 살며, 방 4개가 각자 32명 작업조에 명령을 내림 | 동일 + 행렬 전용 창고(TMEM) | 동일 + 광선 추적 장비(RT Core) |
| 비유 | 집 | 집 | 집 |

### 1.8 서브파티션 / 프로세싱 블록 (Sub-partition, SMSP)

| 항목 | H100 | B200 | RTX 4090 |
|---|---|---|---|
| 부모(SM) 대비 개수 | 4 | 4 | 4 |
| 워프 스케줄러 | 1 (32 thread/clk — 워프 1개 명령을 클럭당 1개 발행) | 1 | 1 |
| 디스패치 유닛 | 1 | 1 | 1 |
| L0 명령어 캐시 | 1 (Volta 기준 ≈12 KiB, Jia et al.; Hopper 용량 미확인) | 1 | 1 |
| FP32 | 32 | 32 | 16 전용 + 16 겸용 |
| INT32 | 16 | — | (겸용 16) |
| FP64 | 16 | (추정 16) | — |
| Tensor Core | 1 | 1 | 1 |
| LD/ST | 8 | (미확인) | 4 |
| SFU | 4 | (미확인) | 1 |
| 레지스터 파일 | 64 KB = 16,384 × 32-bit | 64 KB | 64 KB |
| 하는 일 | 방장(스케줄러)이 준비된 작업조(워프) 중 하나를 골라 매 클럭 명령 1개를 내림 | 동일 | 동일 |
| 비유 | 방 | 방 | 방 |

### 1.9 워프 (Warp) · 스레드 (Thread) · CUDA 코어 · Tensor Core

| 항목 | 내용 (3종 공통, 차이는 명시) |
|---|---|
| 워프 | 32 스레드가 **같은 명령을 한 번에**(SIMT) 실행하는 단위. SM당 최대 64 워프 상주. 블록 최대 1,024 스레드. 스레드당 최대 255 레지스터. |
| 스레드/레인 | 워프의 구성원 1명. 자기 레지스터를 가짐. 조건 분기로 서로 다른 길을 가면 **워프 분기(divergence)** 로 순차 실행 → 느려짐. |
| CUDA 코어 (FP32) | 곱셈과 덧셈을 한 번에 하는 **FMA 유닛** (a×b+c). 클럭당 1 FMA = 2 FLOP. 의존 명령 발행 지연(FFMA latency) Volta 4 cycle(측정, Jia et al.; Hopper 미확인). H100 SXM5: 16,896 코어 × 2 × 1.98 GHz ≈ 67 TFLOPS. |
| Tensor Core 4세대 (H100) | 입력 FP8(E4M3/E5M2)/FP16/BF16/TF32/FP64/INT8. SM당 클럭당 dense FP16 2,048 FMA → **Tensor Core당 512 FMA/clk** (A100 256의 2배, 백서 "2x the MMA rate per SM"); FP8은 2배(1,024 FMA/clk/TC). 명령: 레거시 `mma.sync` (예: m16n8k16), Hopper 전용 비동기 워프그룹 `wgmma` (m64nNk16, N ≤ 256; 4세대 성능을 다 쓰려면 wgmma 필수 — Luo et al.). 2:4 구조적 희소성(sparsity)으로 2배. |
| Tensor Core 5세대 (B200) | FP4/FP6 추가, 2세대 Transformer Engine. 파티션당 1,024 FP16 MAC/clk(측정) → Hopper 2배. 새 명령 `tcgen05.mma`(단일 스레드가 발행, 지연 11.0–11.4 cycle 측정 vs wgmma 32–128 cycle), 결과는 TMEM에 축적. |
| Tensor Core 4세대 (Ada, RTX 4090) | FP8 지원, 그러나 FP32 누산 FP16 속도는 FP16 누산의 절반(165 vs 330 TFLOPS) — 소비자 제품 제한. |
| 비유 | 워프 = 32명 작업조, 스레드 = 작업조원, CUDA 코어 = 작업대, Tensor Core = 행렬 전용 프레스 |

### 1.10 메모리 계층 (Register file → L1/Shared → L2 → HBM)

| 레벨 | H100 SXM5 | B200 | RTX 4090 | 하는 일 / 비유 |
|---|---|---|---|---|
| 레지스터 파일 | SM당 256 KB (65,536 × 32-bit), 파티션당 64 KB; GPU 합 33,792 KB; SRAM. Volta 실측: 뱅크 2개, 64-bit 폭 (Jia et al.) | 256 KB/SM | 256 KB/SM, 합 32,768 KB | 작업자 손 옆 서랍. 지연 사실상 0(파이프라인에 포함) |
| L0/L1 명령어 캐시 | L0/파티션, L1 명령어/SM (Volta 128 KiB, Jia) | — | — | 작업 지시서 사본 |
| L1 데이터 + 공유 메모리 | 256 KB/SM 통합(공유 최대 228 KB); 라인 128 B = 4 × 32 B 섹터; **L1 ≈33–41 cycle, 공유 메모리 ≈29 cycle (측정, Luo)** | 256 KB/SM; L1 39 cycle = 19.6 ns (측정, Chips and Cheese) | 128 KB/SM; L1 43.4, 공유 30.1 cycle (측정) | 집 안 창고 |
| DSMEM (SM↔SM) | 클러스터 내 다른 SM 공유 메모리 접근 ≈180 cycle (측정, L2보다 32% 빠름) | 있음 | 없음 | 옆집 창고 직접 방문 |
| L2 캐시 | 50 MB, 2 파티션(각 25 MB) — 가까운 파티션 ≈264.5 cycle, 먼 파티션 ≈502 cycle (측정, H800); 근접 파티션 읽기 대역폭 >5.5 TB/s (측정, C&C) | 126 MB, 근접 ≈150 ns / 원격 190–220 ns, 파티션 내 21 TB/s (측정, C&C) | 72 MB, ≈273–285 cycle (측정) | 도시 중앙 물류센터. H100은 2동이라 먼 쪽은 2배 느림 |
| HBM / GDDR | 80 GB HBM3, 3.35 TB/s; 지연 ≈479 cycle(Luo 2024 표) ~ 656 cycle(Luo 2025 확장판, L2 미스 경로 포함) (측정, H800); PCIe H100 HBM2e ≈354 ns (C&C) | 180/192 GB HBM3e, 8 TB/s; 지연 (미확인) | 24 GB GDDR6X, 1,008 GB/s; ≈541–571 cycle (측정) | 도시 외곽 창고탑. 한 번 다녀오면 수백 클럭 |
| ECC/RAS | HBM SECDED 사이드밴드 ECC, L2/L1/레지스터도 ECC, 행 리매핑 | RAS 엔진 | 없음(소비자) | 창고 재고 오류 검출/정정 |

### 1.11 SRAM 셀 · 트랜지스터 · 배선 · 원자

| 레벨 | 수치 | 출처/비고 | 하는 일 / 비유 |
|---|---|---|---|
| 6T SRAM 셀 (고밀도) | TSMC N5: **0.021 μm²** (≈145 nm × 145 nm 환산, 추정); 고성능 셀 0.025 μm² | TSMC IEDM 2019 (Yeap), WikiChip. 4N/4NP는 N5 파생이므로 유사(GPU 실제 셀 크기 미확인) | 1비트를 저장하는 칸막이. 트랜지스터 6개로 구성 |
| SRAM 밀도 | ≈32 Mib/mm² (어시스트 회로 ~30% 포함, WikiChip 추정) | 추정 | 50 MB L2를 셀만으로 채우면 ≈8.8 mm² (추정; 태그·크로스바 제외라 실제 L2 블록은 훨씬 큼) |
| 트랜지스터 (FinFET) | N5 핀 피치 **28 nm**, 접촉 게이트 피치(CPP) **51 nm**(HD) / 57 nm(HP); N4는 CPP 49/55 nm, 셀 높이 206 nm | Angstronomics(SEM 실측), WikiChip(초기 추정 48 nm) | 전류를 켜고 끄는 스위치. 채널이 지느러미(fin) 모양으로 서 있음 |
| 게이트 길이 (Lg) | 10nm대 중반 (미확인 — 공개 실측치 없음; IBM 이론상 12–14 nm) | TechInsights 유료 보고서에만 존재 | 스위치의 "문" 폭 |
| 채널 재료 | PMOS에 SiGe 채널(N5 최초) | TSMC IEDM 2019 | — |
| 최소 금속 피치 | M0 28 nm, M2 35 nm (6-트랙 셀) | Angstronomics | 가장 가는 전선 간격 |
| 금속 배선층 (BEOL) | N4 예시: 총 16층 = Cu 15층 + 최상단 Al 1층 (Apple C1, TechInsights); GPU 4N 층수 (미확인) | 구리 + 극저유전율(ELK) 유전체, EUV 10층 이상 | 도시 위 고가도로 15층 |
| 실리콘 원자 | 격자 상수 **0.5431 nm**(다이아몬드 입방), 최근접 원자 간 거리 **0.235 nm**, 단위 격자당 8원자 | 교과서/문헌 표준값 | 벽돌 |

---

## 2. 데이터 경로 서사 (Data path narrative): 로봇이 AI 모델을 돌릴 때

아래는 H100 SXM5 기준. 클럭 1.98 GHz → **1 클럭 = 0.505 ns**. 이 시간에 빛은 진공에서 **15.1 cm** 간다 (RTX 4090 2.52 GHz: 0.397 ns, 11.9 cm; B200 ≈1.99 GHz 측정 역산: ≈15 cm). 즉 "빛이 보드 한 변(30 cm)을 가로지르는 동안 GPU는 2클럭밖에 못 센다". 칩 내부 전기 신호는 RC 지연 때문에 이보다 훨씬 느리다(일반론).

### 2.1 단계별 흐름

1. **호스트가 커널을 띄운다 (kernel launch)** — 로봇의 CPU(예: GB200이면 Grace)가 드라이버를 통해 PCIe Gen5(64 GB/s 편도)나 NVLink-C2C(900 GB/s)로 명령 버퍼를 GPU 호스트 인터페이스에 보낸다. 모델 가중치는 이미 HBM(80 GB)에 올라가 있다. 80 GB를 한 번 다 읽는 데만 3.35 TB/s로 ≈24 ms.
2. **그리드 → 스레드 블록 → (Hopper) 클러스터** — 커널은 수천 개의 스레드 블록으로 쪼개진다. Hopper는 블록 여러 개(이식성 8, 옵트인 16)를 **클러스터**로 묶어 같은 GPC에 함께 배치할 것을 보장한다.
3. **GigaThread 엔진이 블록을 SM에 배분** — 칩 전역 스케줄러(Fermi 백서: "creates and dispatches thread blocks to various SMs")가 132개 SM 중 자원(레지스터·공유 메모리·워프 슬롯)이 남는 SM에 블록을 던진다. SM당 최대 32 블록, 64 워프(2,048 스레드).
4. **SM 안에서 워프로 쪼개짐** — 블록의 스레드가 32개씩 워프로 묶여 4개 서브파티션에 나뉜다. 각 파티션의 **워프 스케줄러**가 매 클럭 준비된 워프 하나를 골라 명령 1개를 **디스패치 유닛**으로 발행(32 thread/clk).
5. **가중치/활성값 로드: HBM → L2 → L1/공유 메모리** — 첫 접근은 HBM까지 간다: **≈479–656 클럭 (≈240–330 ns)**. 같은 데이터를 다른 SM이 다시 쓰면 L2에서 **≈264 클럭 (≈134 ns)** — 단, 먼 L2 파티션이면 **≈502 클럭 (≈254 ns)**. Hopper의 **TMA**가 큰 타일을 전역→공유 메모리로 비동기 복사하고, 비동기 트랜잭션 배리어가 완료를 알린다. 이때 워프는 기다리지 않고 다른 워프가 실행된다(**지연 숨기기**).
6. **공유 메모리 → 레지스터** — 타일이 공유 메모리(≈29 클럭)나 L1(≈33–41 클럭)에서 레지스터로 옮겨진다. 캐시 라인 128 B, 32 B 섹터 단위로 필요한 섹터만 가져온다. 워프 32 스레드가 연속 주소를 읽으면 4섹터 = 1라인으로 **병합(coalescing)** 된다.
7. **Tensor Core 행렬곱** — `wgmma` 명령이 4개 Tensor Core에 비동기로 발행된다. SM당 클럭당 dense FP16 2,048 FMA, FP8이면 4,096 FMA. 칩 전체로는 클럭당 FP8 **540,672 FMA**(132 × 4,096). Transformer Engine이 층별로 FP8/FP16을 골라 정밀도와 속도를 조절한다. B200은 `tcgen05.mma`가 결과를 **TMEM**(256 KB/SM)에 쌓고, 지연이 11 클럭 수준(측정).
8. **후처리** — 누산 결과가 레지스터로 내려오고, 활성화 함수(exp 등)는 **SFU**(MUFU 명령)가, 정수 주소 계산은 INT32 유닛이 처리한다. Hopper의 **DPX** 명령은 동적 프로그래밍(예: 로봇 경로 탐색 Floyd-Warshall)을 최대 7배 가속.
9. **결과 쓰기: 레지스터 → 공유 → L2 → HBM** — TMA 스토어가 타일을 전역 메모리로 내보낸다. L2는 쓰기를 모아 HBM에 반영(write-back). 다른 SM/GPU가 곧 읽을 데이터는 L2 상주 제어로 붙잡아 둘 수 있다.
10. **다음 층으로** — 커널이 끝나면 다음 층 커널이 같은 절차를 반복. 다중 GPU면 NVLink(900 GB/s)로 all-reduce. 로봇 추론 1회 = 수십~수백 커널.

### 2.2 지연 시간 요약 (H100/H800 측정, 1.98 GHz 환산)

| 계층 | 클럭 | ns (≈) | 출처 |
|---|---|---|---|
| 레지스터 | 0 (파이프라인 내) | — | — |
| FFMA 의존 지연 | 4 (Volta) | 2 | Jia et al. 2018 (Hopper 미확인) |
| 공유 메모리 | 29.0 | 15 | Luo et al. 2024 표 |
| L1 히트 | 32–33 (P-chase) / 40.7 (표) | 17–21 | Luo et al. 2024/2025 |
| DSMEM (SM↔SM) | ≈180 | 91 | Luo et al. 2024 |
| L2 근접 파티션 | 264.5 (263.0 표) | 134 | Luo et al. 2025 확장판 |
| L2 원격 파티션 | ≈502 | 254 | Luo et al. 2025 확장판 |
| HBM (전역 메모리) | 478.8 (표) / 656 (확장판) | 242–331 | Luo et al. 2024/2025 |
| 참고: Volta V100 | L1 28, L2 ≈193, L2 미스+TLB 히트 375, L2+TLB 미스 1,029 | — | Jia et al. 2018 |
| 참고: A100 | L1 33, L2 200, 전역 290 (캐시 우회 측정) | — | Abdelkhalik et al. 2022 |
| 참고: RTX 4090 | 공유 30.1, L1 43.4, L2 273–285, 전역 541–571 | 2.52 GHz 기준 L2 ≈110 ns, 전역 ≈220 ns | Luo et al. |
| 참고: B200 | L1 39 cyc(19.6 ns), L2 근접 ≈150 ns / 원격 190–220 ns | — | Chips and Cheese |

> 게임 연출용 비율: L1 : L2 : HBM ≈ 1 : 6.5 : 13 (Luo: "L2는 L1의 6.5배, 전역은 L2의 1.9~2.1배").

### 2.3 클럭당 처리량 (H100 SXM5, 1 클럭 = 0.5 ns 동안 일어나는 일)

| 단위 | 클럭당 |
|---|---|
| 워프 명령 발행 | 132 SM × 4 = 528 개 |
| FP32 FMA | 16,896 |
| FP64 FMA | 8,448 |
| dense FP16 Tensor FMA | 270,336 (132 × 2,048) |
| dense FP8 Tensor FMA | 540,672 |
| HBM 전송 | 3.35 TB/s ÷ 1.98 GHz ≈ 1,692 바이트 |
| L2 처리량 | >4,472 바이트/clk (측정, H800) |

---

## 3. 물리 스케일 사다리 (Physical scale ladder)

한 변 길이(대표 치수) 기준. "축소 배율"은 바로 위 레벨 대비 대략 몇 배 작아지는지.

| # | 레벨 | 대표 치수 (한 변) | 면적/부피 근거 | 위 레벨 대비 축소 | 확인 상태 |
|---|---|---|---|---|---|
| 1 | 사람 | ≈1.7 m | — | — | — |
| 2 | RTX 4090 카드 / HGX 베이스보드 | 304 mm (4090 FE) / SXM5 모듈 ≈150 × 80 mm | 공식 / Locuza 추정 | ≈5–10× | 확인 / 미확인 |
| 3 | 패키지 (H100) | ≈55–58 mm | Locuza 추정 | ≈3× | 미확인 |
| 4 | 다이 (GH100) | ≈28.5 mm (814 mm²) / AD102 ≈24.7 mm (608.5 mm²) | 공식 면적, 정사각 환산 | ≈2× | 면적 확인, 변 길이 추정 |
| 5 | GPC | ≈7–9 mm (면적 ≈50–80 mm²) | 814 ÷ 8 = 102 mm²가 상한; L2/IO/HBM PHY 제외하면 그 이하 | ≈3.5× | 추정 |
| 6 | TPC | ≈2.6 mm (≈7 mm²) | Locuza: GA102 TPC 6.86–6.95 mm² (Samsung 8N). 4N에서 SM이 커졌지만 공정이 조밀해져 비슷한 자릿수(추정) | ≈3× | 추정 |
| 7 | SM | ≈1.9 mm (≈3–4 mm²) | TPC의 절반 미만; 상한 814 ÷ 144 = 5.65 mm² | ≈1.4× | 추정 |
| 8 | 서브파티션 | ≈0.8 mm (≈0.6–0.8 mm²) | SM ÷ 4 (L1/공유 메모리·텍스처 제외) | ≈2.4× | 추정 |
| 9 | 64 KB 레지스터 파일 | ≈0.1–0.2 mm | 524,288 bit × 0.021 μm² = 0.011 mm² (셀만); 다중 포트라 실제 수 배 | ≈5× | 추정 |
| 10 | Tensor Core / CUDA 코어 | 수십~수백 μm | 공개 실측 없음 | ≈5× | 미확인 |
| 11 | 6T SRAM 셀 | ≈0.145 μm = 145 nm | 0.021 μm² | ≈100–1,000× | 확인(N5), GPU 셀 미확인 |
| 12 | 트랜지스터 1개 (풋프린트) | ≈51 nm (CPP) × 28 nm (핀 피치) | Angstronomics 실측 | ≈3× | 확인 |
| 13 | 핀(fin) 간격 / 최소 금속 피치 | 28 nm / 28–30 nm | TSMC/Angstronomics/WikiChip | — | 확인 |
| 14 | 게이트 길이 | ≈10nm대 중반 | 이론/추정 | ≈3× | 미확인 |
| 15 | 실리콘 단위 격자 | 0.5431 nm | 표준값 | ≈30× | 확인 |
| 16 | Si–Si 원자 간 거리 | 0.235 nm | 표준값 | ≈2× | 확인 |

**총 축소 배율**: 보드(0.3 m) → 원자(0.24 nm) ≈ **1.3 × 10⁹ 배**. 다이(28 mm) → SRAM 셀(145 nm) ≈ 2 × 10⁵ 배. 셀 → 원자 ≈ 600배.

**개수 감각 (H100 SXM5)**: 다이 1 → GPC 8 → TPC 66 → SM 132 → 서브파티션 528 → 워프 슬롯 8,448 (132 × 64) → 스레드 슬롯 270,336 → FP32 코어 16,896 → 레지스터 8.65 M개(32-bit) → SRAM 비트 ≈ 50 MB L2 = 4.2억 비트 + 레지스터 2.77억 비트 + L1 2.77억 비트 → 트랜지스터 800억 → 실리콘 원자: 814 mm² × 두께(≈0.7 mm 웨이퍼, 미확인) 기준 ≈ 2.8 × 10²² 개 (추정: 5 × 10²² 원자/cm³ × 0.057 cm³).

---

## 4. 일반인용 용어집 (Layperson glossary)

| 용어 (EN) | 용어 (KO) | 쉬운 설명 (KO) | Plain explanation (EN) |
|---|---|---|---|
| GPU | 그래픽 처리 장치 | 똑같은 계산을 수만 개 동시에 하도록 만든 칩 | A chip built to do tens of thousands of identical calculations at once |
| Die | 다이 | 웨이퍼에서 잘라낸 실리콘 조각 하나, 칩의 본체 | One rectangle of silicon cut from a wafer; the chip itself |
| Wafer | 웨이퍼 | 지름 300 mm 실리콘 원판, 여기에 다이 수십~수백 개를 한꺼번에 찍는다 | A 300 mm silicon disc on which dozens to hundreds of dies are printed together |
| Yield | 수율 | 찍어낸 다이 중 정상 작동하는 비율 | The fraction of printed dies that work |
| Binning | 비닝(등급 분류) | 결함 있는 부분을 끄고 등급을 매겨 파는 것. H100은 144 SM 중 132만 켜서 팔아 수율을 높인다 | Disabling defective parts and selling by grade; H100 ships 132 of 144 SMs to raise yield |
| Reticle limit | 레티클 한계 | 노광기가 한 번에 찍을 수 있는 최대 면적(≈858 mm²). 그래서 Blackwell은 다이 2개를 붙였다 | Max area a lithography tool prints in one shot (~858 mm²); why Blackwell uses two dies |
| Process node (TSMC 4N/4NP) | 공정 노드 | 트랜지스터를 얼마나 작게 만드는 제조 레시피. "4N"은 NVIDIA용 맞춤 5 nm급 | The manufacturing recipe for transistor size; "4N" is an NVIDIA-customized 5 nm-class node |
| Transistor | 트랜지스터 | 전기를 켜고 끄는 초소형 스위치. H100에 800억 개 | A tiny electrical switch; 80 billion in an H100 |
| FinFET | 핀펫 | 채널이 지느러미처럼 서 있는 3차원 트랜지스터 | A 3D transistor whose channel stands up like a fin |
| Gate / gate length | 게이트 / 게이트 길이 | 스위치를 여닫는 전극과 그 폭 | The electrode that opens/closes the switch, and its width |
| Fin pitch / gate pitch | 핀 피치 / 게이트 피치 | 이웃한 핀(28 nm)·게이트(51 nm) 사이 간격 | Spacing between neighboring fins (28 nm) or gates (51 nm) |
| BEOL / metal layers | 배선층 | 트랜지스터 위에 쌓은 구리 전선 층(약 15층) | Copper wiring layers (~15) stacked above the transistors |
| Low-k dielectric | 저유전율 절연체 | 전선 사이를 채워 신호 간섭을 줄이는 절연 재료 | Insulator between wires that reduces signal crosstalk |
| SRAM / 6T cell | SRAM / 6T 셀 | 트랜지스터 6개로 1비트를 기억하는 빠른 메모리 칸 | A fast memory cell that stores one bit with six transistors |
| Silicon lattice | 실리콘 격자 | 실리콘 원자가 0.543 nm 간격으로 규칙적으로 배열된 구조 | Regular arrangement of silicon atoms with 0.543 nm repeat |
| Package | 패키지 | 다이와 메모리를 한 덩어리로 묶어 보드에 꽂을 수 있게 한 것 | The assembly that bundles die and memory so it can mount on a board |
| Substrate | 기판 | 패키지 바닥의 다층 회로판 | The multilayer circuit board at the bottom of the package |
| Interposer | 인터포저 | 다이와 HBM 사이를 잇는 초미세 배선판 | An ultra-fine wiring layer connecting die and HBM |
| CoWoS (-S / -L) | 코워스 | TSMC의 2.5D 패키징. -S는 실리콘 판 하나, -L은 작은 실리콘 다리를 박은 큰 판 | TSMC 2.5D packaging; -S one silicon slab, -L small silicon bridges in a larger slab |
| HBM (HBM3 / HBM3e) | 고대역폭 메모리 | DRAM 칩을 8~12장 수직으로 쌓아 옆에 붙인 초고속 메모리 | Ultra-fast memory made by stacking 8–12 DRAM dies vertically beside the GPU |
| TSV | 실리콘 관통 전극 | 쌓인 DRAM 칩들을 수직으로 관통하는 구멍 전선 | Vertical through-holes wiring stacked DRAM dies together |
| GDDR6X | GDDR6X | 게이밍 카드의 메모리; 칩이 PCB 위에 따로 붙는다 | Gaming-card memory; chips sit separately on the PCB |
| Memory controller | 메모리 컨트롤러 | 메모리 창고에 읽기/쓰기 명령을 내리는 관리자 | The unit that issues reads/writes to memory |
| Bandwidth | 대역폭 | 초당 옮길 수 있는 데이터 양(H100 3.35 TB/s) | Data moved per second (H100: 3.35 TB/s) |
| Latency | 지연 시간 | 요청부터 데이터가 오기까지 걸리는 시간(HBM ≈ 수백 클럭) | Time from request to data arrival (HBM ≈ hundreds of clocks) |
| Clock / clock cycle | 클럭 | 칩의 심장 박동. 1.98 GHz면 초당 19.8억 번, 1박동 = 0.5 ns | The chip's heartbeat; 1.98 GHz = 1.98 billion beats/s, one beat = 0.5 ns |
| Boost clock | 부스트 클럭 | 전력·온도 여유가 있을 때 올라가는 최고 클럭 | Highest clock reached when power and temperature allow |
| TDP / TGP | 열설계전력 | 칩이 소비·발열하는 최대 전력(H100 700 W) | Max power consumed/heat produced (H100: 700 W) |
| Thermal throttling | 열 제한 | 너무 뜨거우면 클럭을 스스로 낮추는 것 | Automatically lowering clock when too hot |
| VRM | 전압 조정 모듈 | 12 V 등을 칩용 ~1 V로 바꾸는 보드 위 전원 회로 | Board circuitry converting 12 V to ~1 V for the chip |
| 12VHPWR (16-pin) | 16핀 전원 커넥터 | RTX 4090의 600 W급 전원 플러그 | The RTX 4090's 600 W-class power plug |
| PCIe (Gen4/Gen5) | PCIe | CPU와 GPU를 잇는 표준 통로(Gen5 ×16: 128 GB/s 양방향 합) | Standard CPU–GPU link (Gen5 ×16: 128 GB/s both directions combined) |
| NVLink | NVLink | GPU끼리 직접 잇는 NVIDIA 전용 고속 통로(H100 900 GB/s, B200 1.8 TB/s) | NVIDIA's direct GPU-to-GPU link (H100 900 GB/s, B200 1.8 TB/s) |
| NVSwitch | NVSwitch | 여러 GPU의 NVLink를 한데 모아 모두가 모두와 통신하게 하는 스위치 칩 | A switch chip letting every GPU talk to every other over NVLink |
| NV-HBI | NV-HBI | Blackwell의 두 다이를 10 TB/s로 잇는 다이 간 다리 | The 10 TB/s bridge joining Blackwell's two dies |
| NVLink-C2C | NVLink-C2C | Grace CPU와 GPU를 900 GB/s로 잇는 칩 간 링크 | 900 GB/s chip-to-chip link between Grace CPU and GPU |
| GPC | 그래픽 처리 클러스터 | 다이 안의 큰 행정구. H100은 8개 | A large district of the die; H100 has 8 |
| Raster engine | 래스터 엔진 | 삼각형을 픽셀로 바꾸는 그래픽 전용 장치(GPC마다 1개) | Graphics unit converting triangles to pixels (one per GPC) |
| TPC | 텍스처 처리 클러스터 | SM 2개를 묶은 블록 | A block of two SMs |
| PolyMorph engine | 폴리모프 엔진 | TPC 안의 정점·테셀레이션 처리 장치(그래픽용) | Vertex/tessellation unit inside a TPC (graphics) |
| SM | 스트리밍 멀티프로세서 | GPU의 기본 "집". 코어 128개, 창고(L1) 256 KB, 최대 2,048 스레드 | The GPU's basic "house": 128 cores, 256 KB L1, up to 2,048 threads |
| Sub-partition / processing block | 서브파티션 | SM 안의 방 4개 중 하나. 스케줄러 1, FP32 32, Tensor Core 1 | One of four rooms in an SM: 1 scheduler, 32 FP32, 1 Tensor Core |
| Warp scheduler | 워프 스케줄러 | 매 클럭 준비된 작업조(워프) 하나를 골라 명령을 내리는 방장 | Picks one ready warp each clock and issues its instruction |
| Dispatch unit | 디스패치 유닛 | 스케줄러가 고른 명령을 실제 작업대로 보내는 전달자 | Sends the chosen instruction to the execution units |
| L0 instruction cache | L0 명령어 캐시 | 방마다 있는 작업 지시서 사본 | Per-room copy of the instruction list |
| CUDA core | CUDA 코어 | 곱하고 더하는 기본 작업대(FP32 FMA) | The basic multiply-add worker unit (FP32 FMA) |
| FMA | 융합 곱셈-덧셈 | a×b+c를 한 번에, 반올림 한 번으로 계산 | Computes a×b+c in one step with a single rounding |
| FP64 unit | FP64 유닛 | 배정밀도(64비트) 계산 전용 작업대. H100은 SM당 64, RTX 4090은 2 | Double-precision unit; 64 per SM on H100, 2 on RTX 4090 |
| INT32 unit | INT32 유닛 | 정수 계산(주소 계산 등) 작업대 | Integer unit (e.g., address math) |
| SFU | 특수 함수 유닛 | sin, exp, sqrt 같은 특수 함수 전용 작업대(MUFU 명령) | Unit for transcendental functions like sin, exp, sqrt |
| LSU / LD/ST unit | 로드/스토어 유닛 | 메모리에서 읽고 쓰는 작업을 담당하는 유닛 | Unit that performs memory loads and stores |
| Texture unit | 텍스처 유닛 | 이미지(텍스처)를 읽고 보간하는 유닛, SM당 4 | Reads and filters images (textures); 4 per SM |
| RT Core | RT 코어 | 광선이 삼각형에 맞는지 검사하는 광선 추적 전용 장치(RTX 4090만) | Ray-tracing unit testing ray–triangle hits (RTX 4090 only) |
| Tensor Core | 텐서 코어 | 작은 행렬 곱셈을 한 번에 처리하는 AI 전용 프레스 | AI unit that multiplies small matrices in one go |
| Transformer Engine | 트랜스포머 엔진 | 층마다 FP8/FP16을 자동으로 골라 속도와 정확도를 맞추는 기능 | Auto-selects FP8/FP16 per layer to balance speed and accuracy |
| TMA | 텐서 메모리 가속기 | 큰 데이터 덩어리를 전역→공유 메모리로 비동기 복사하는 우편배달부 | Asynchronously copies large tiles global→shared memory |
| TMEM (Tensor Memory) | 텐서 메모리 | Blackwell SM당 256 KB, 행렬 결과 전용 창고 | 256 KB per Blackwell SM, dedicated to matrix accumulators |
| DPX instructions | DPX 명령 | 동적 프로그래밍(경로 탐색 등)을 최대 7배 빠르게 하는 Hopper 명령 | Hopper instructions speeding dynamic programming up to 7× |
| SIMT | 단일 명령 다중 스레드 | 32명이 같은 명령을 각자 데이터에 동시에 수행하는 방식 | 32 threads execute the same instruction on their own data |
| Warp | 워프 | 32 스레드 작업조 | A group of 32 threads |
| Thread / lane | 스레드 / 레인 | 작업조원 1명, 자기 레지스터를 가짐 | One worker with its own registers |
| Thread block (CTA) | 스레드 블록 | 한 SM에서 함께 실행되며 공유 메모리로 협력하는 스레드 묶음(최대 1,024) | Threads co-scheduled on one SM sharing memory (up to 1,024) |
| Thread block cluster | 스레드 블록 클러스터 | Hopper 신설: 같은 GPC에 함께 배치되는 블록 묶음(8~16) | New in Hopper: blocks guaranteed co-scheduled in one GPC (8–16) |
| Grid | 그리드 | 커널 하나가 만드는 모든 블록의 집합 | All blocks launched by one kernel |
| Kernel | 커널 | GPU에서 실행하는 함수 하나 | One function executed on the GPU |
| CUDA | CUDA | NVIDIA GPU 프로그래밍 플랫폼 | NVIDIA's GPU programming platform |
| Compute capability | 컴퓨트 능력 | 세대별 기능 번호(H100 9.0, RTX 4090 8.9, B200 10.0) | Generation feature number (H100 9.0, RTX 4090 8.9, B200 10.0) |
| GigaThread engine | 기가스레드 엔진 | 스레드 블록을 SM들에 나눠주는 칩 전역 배차 본부 | Chip-wide dispatcher assigning thread blocks to SMs |
| Warp divergence | 워프 분기 | 한 작업조 안에서 if문으로 길이 갈리면 차례로 실행돼 느려지는 현상 | When threads in a warp take different branches and run serially |
| Occupancy | 점유율 | SM이 최대 64 워프 중 몇 개를 채웠는지의 비율 | Fraction of an SM's 64 warp slots in use |
| Latency hiding | 지연 숨기기 | 한 워프가 메모리를 기다릴 때 다른 워프를 돌려 시간을 메우는 것 | Running other warps while one waits for memory |
| Register file | 레지스터 파일 | SM당 256 KB, 스레드 손 옆 서랍 | 256 KB per SM; each thread's fastest storage |
| Register spill | 레지스터 스필 | 서랍(255개 한도)이 넘쳐 느린 메모리로 밀려나는 것 | Overflow of registers (255 max) into slower memory |
| Shared memory | 공유 메모리 | 블록 내 스레드가 함께 쓰는 SM 안 창고(H100 최대 228 KB) | On-SM storage shared by a block (H100: up to 228 KB) |
| DSMEM | 분산 공유 메모리 | 클러스터 안 다른 SM의 공유 메모리를 직접 읽고 쓰는 기능 | Direct access to another SM's shared memory within a cluster |
| L1 cache | L1 캐시 | SM 안의 가장 가까운 자동 캐시(≈33 클럭) | Closest automatic cache inside the SM (~33 clocks) |
| L2 cache | L2 캐시 | 다이 중앙의 큰 캐시(H100 50 MB, 2동) | Large central cache (H100: 50 MB in two halves) |
| Cache line / sector | 캐시 라인 / 섹터 | 캐시가 다루는 단위: 128 B 라인 = 32 B 섹터 4개 | Cache granularity: 128 B line = four 32 B sectors |
| Coalescing | 병합 접근 | 워프 32명이 연속 주소를 읽어 한 번의 전송으로 끝내는 것 | 32 threads reading contiguous addresses in one transfer |
| Crossbar | 크로스바 | SM들과 L2 파티션을 모두 연결하는 교차 배선망 | The interconnect linking all SMs to L2 partitions |
| Partitioned L2 | 분할 L2 | L2가 두 동으로 나뉘어 먼 동은 약 2배 느린 구조 | L2 split in two halves; the far half is ~2× slower |
| ECC | 오류 정정 코드 | 메모리 비트가 뒤집혀도 잡아내고 고치는 기능 | Detects and corrects flipped memory bits |
| MIG | 다중 인스턴스 GPU | GPU 하나를 최대 7개의 독립 GPU처럼 나누는 기능 | Splits one GPU into up to 7 isolated GPUs |
| FLOPS / TFLOPS / PFLOPS | 플롭스 | 초당 부동소수점 연산 횟수; T=10¹², P=10¹⁵ | Floating-point operations per second; T=10¹², P=10¹⁵ |
| FP32 / FP64 | 단정밀도 / 배정밀도 | 32비트 / 64비트 실수 | 32-bit / 64-bit floating point |
| FP16 / BF16 | 반정밀도 / 브레인 플로트 | 16비트 실수. BF16은 범위를 넓히고 정밀도를 줄인 것 | 16-bit floats; BF16 trades precision for range |
| TF32 | TF32 | 32비트처럼 보이지만 내부 계산은 19비트인 Tensor Core 형식 | Tensor format with FP32 range and 10-bit mantissa |
| FP8 (E4M3 / E5M2) | FP8 | 8비트 실수 두 종류(정밀도형 / 범위형), Hopper부터 | Two 8-bit float formats (precision vs range), since Hopper |
| FP4 | FP4 | 4비트 실수, Blackwell부터 (B200 9 PFLOPS) | 4-bit float, since Blackwell (B200: 9 PFLOPS) |
| INT8 | INT8 | 8비트 정수, 추론용 | 8-bit integer for inference |
| Sparsity (2:4) | 희소성 | 4개 중 2개가 0인 가중치를 건너뛰어 2배 빠르게 | Skips zeros (2 of every 4) to double tensor throughput |
| Dense vs sparse | 밀집/희소 | 스펙표의 "1,979/3,958 TFLOPS"에서 앞이 밀집, 뒤가 희소 | In "1,979/3,958 TFLOPS", first is dense, second sparse |
| MMA / wgmma / tcgen05 | 행렬 곱-누산 명령 | Tensor Core를 부르는 명령. 세대별로 이름이 다름 | Instructions invoking Tensor Cores; names differ by generation |
| NVDEC / NVENC / NVJPG | 비디오 디코더/인코더/JPEG | 영상·이미지 전용 소형 엔진. H100은 디코더 7 + JPEG 7, 인코더 없음 | Fixed-function video/image engines; H100 has 7 decoders + 7 JPEG, no encoder |
| Copy engine | 복사 엔진 | 계산과 별개로 메모리를 옮기는 DMA 장치 | DMA units moving memory independently of compute |
| ROP | 래스터 출력 유닛 | 최종 픽셀을 프레임버퍼에 쓰는 장치(RTX 4090 176개) | Writes final pixels to the framebuffer (RTX 4090: 176) |
| SXM | SXM | 데이터센터용 메자닌 모듈 규격(PCIe 카드 아님) | Data-center mezzanine module form factor (not a PCIe card) |
| HGX / DGX | HGX / DGX | GPU 8장 베이스보드 / 그것을 넣은 완제품 서버 | 8-GPU baseboard / the complete server built on it |
| GB200 NVL72 | GB200 NVL72 | Grace 36 + Blackwell 72를 한 랙에서 NVLink 130 TB/s로 묶은 시스템 | 36 Grace + 72 Blackwell in one rack, 130 TB/s NVLink |

---

## 5. 출처 (Sources)

### NVIDIA 1차 자료
- NVIDIA H100 Tensor Core GPU Architecture 백서 (GTC22, v1.01 PDF 미러): https://www.advancedclustering.com/wp-content/uploads/2022/03/gtc22-whitepaper-hopper.pdf — 풀 GH100/SXM5/PCIe 구성, SM 사양, 표 3·4, L2 "partitioned crossbar", ECC, NVDEC/NVJPG(8/8, 풀 다이), NVENC 없음, "2x the MMA rate per SM"
- NVIDIA Hopper Architecture In-Depth (개발자 블로그): https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/ — 814 mm², 80 B, 4N, 256 KB L1/공유, TMA, DSMEM, 클러스터, NVLink 900 GB/s, PCIe Gen5 128 GB/s, MIG
- NVIDIA H100 데이터시트 (미러): https://www.megware.com/fileadmin/user_upload/LandingPage%20NVIDIA/nvidia-h100-datasheet.pdf — 7 NVDEC / 7 JPEG, 700 W, 3.35 TB/s, 989/1,979 TFLOPS
- NVIDIA Hopper Tuning Guide: https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html — 64K 레지스터/SM, 255/스레드, 32 블록/SM, 228 KB 공유, 클러스터 16 옵트인
- NVIDIA Blackwell Tuning Guide: https://docs.nvidia.com/cuda/blackwell-tuning-guide/index.html
- NVIDIA Ada Tuning Guide: https://docs.nvidia.com/cuda/ada-tuning-guide/index.html — CC 8.9: 48 워프/SM, 24 블록/SM, 공유 메모리 100 KB/SM (블록당 99 KB), 64K 레지스터, L2 98,304 KB
- CUDA C++ Programming Guide: https://docs.nvidia.com/cuda/cuda-c-programming-guide/ — 클러스터(이식성 8), 1,024 스레드/블록
- CUDA C++ Best Practices Guide: https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html — 32 B 트랜잭션, 병합
- Nsight Compute Kernel Profiling Guide: https://docs.nvidia.com/nsight-compute/pdf/ProfilingGuide.pdf — "sector = 32 B, cache line = 4 sectors = 128 B"
- NVIDIA Ada GPU Architecture 백서 v2.02: https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-ada-gpu-architecture.pdf — AD102 12 GPC/72 TPC/144 SM, RTX 4090 부록 A (11 GPC, 64 TPC, 128 SM, 2,520 MHz, 176 ROP, 73,728 KB L2, 608.5 mm², 76.3 B, PCIe Gen4, 2 NVENC + 1 NVDEC, 파티션 구성)
- NVIDIA Ada Lovelace Professional GPU 백서 v1.1: https://images.nvidia.com/aem-dam/en-zz/Solutions/technologies/NVIDIA-ADA-GPU-PROVIZ-Architecture-Whitepaper_1.1.pdf — 288 FP64 (2/SM)
- NVIDIA Blackwell Architecture 페이지: https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/ — 208 B, 4NP, 두 다이 10 TB/s, NVLink 5 1.8 TB/s, NVL72 130 TB/s
- NVIDIA DGX B200: https://www.nvidia.com/en-us/data-center/dgx-b200/ — 8 GPU 1,440 GB (=180 GB/GPU), 64 TB/s, 14.4 TB/s NVLink
- NVIDIA Blackwell B200 데이터시트 (미러): https://www.primeline-solutions.com/media/categories/server/nach-gpu/nvidia-hgx-h200/nvidia-blackwell-b200-datasheet.pdf — 180 GB HBM3e 7.7 TB/s, FP4 18 PF(희소), FP8 9 PF(희소), FP64 37 TF, 1,000 W
- NVIDIA GB200 NVL72: https://www.nvidia.com/en-us/data-center/gb200-nvl72/ ; GB200 NVL 튜닝 가이드: https://docs.nvidia.com/multi-node-nvlink-systems/multi-node-tuning-guide/overview.html — Grace 1 + Blackwell 2, NVLink-C2C 900 GB/s
- NVIDIA GF100 (Fermi) 백서: https://www.ece.lsu.edu/gp/refs/gf100-whitepaper.pdf — GigaThread 엔진 정의
- NVIDIA GeForce RTX 4090 제품 페이지: https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/ — 304 × 137 × 61 mm 3슬롯
- PTX ISA (tcgen05 / Tensor Memory): https://docs.nvidia.com/cuda/parallel-thread-execution/ — TMEM 128 레인 × 512 열 × 32-bit = 256 KB

### 학술 마이크로벤치마크
- Luo et al., "Benchmarking and Dissecting the Nvidia Hopper GPU Architecture" (2024): https://arxiv.org/abs/2402.13499 (HTML: https://arxiv.org/html/2402.13499v1) — 표: 공유 29.0 / L1 40.7 / L2 263.0 / 전역 478.8 cycle (H800); RTX 4090 30.1/43.4/273.0/541.5; DSMEM 180 cycle; wgmma 필수; FP8 wgmma ≈1,450 TFLOPS
- Luo et al., "Dissecting the NVIDIA Hopper Architecture through Microbenchmarking and Multiple Level Analysis" (2025 확장판): https://arxiv.org/pdf/2501.12084 — L1 32–33, L2 264.5(근접)/502(원격), 전역 656 cycle (H800); A100 202.8/408/566; RTX 4090 284.8/571
- Jia et al., "Dissecting the NVIDIA Volta GPU Architecture via Microbenchmarking" (2018): https://arxiv.org/pdf/1804.06826 — 표 3.1: L1 28, L2 ≈193, 공유 19, L1 라인 32 B(Volta), 레지스터 뱅크 2 × 64-bit, L0 ≈12 KiB; 그림 3.2: 375 / 1,029 cycle
- Jia et al., "Dissecting the NVidia Turing T4 GPU via Microbenchmarking" (2019): https://arxiv.org/pdf/1903.07486
- Abdelkhalik et al., "Demystifying the Nvidia Ampere Architecture through Microbenchmarking and Instruction-level Analysis" (2022): https://arxiv.org/pdf/2208.11174 — A100 L1 33, L2 200, 전역 290 (캐시 우회)
- "Dissecting the NVIDIA Blackwell Architecture with Microbenchmarks" (GB203 소비자 Blackwell): https://arxiv.org/html/2507.10789v2 — wgmma 지연 비교, FP64 2/SM(소비자)
- "Microbenchmarking NVIDIA's Blackwell Architecture" (B200): https://arxiv.org/html/2512.02189v1 — 148 SM, L2 4 파티션, 8 HBM3e, TMEM 256 KB/SM 16 TB/s 읽기, tcgen05.mma 11.0–11.4 cycle, FP16 1,929 / FP8 3,851 / FP4 7,703 TFLOPS 측정
- Glenn Lockwood, "Tensor cores and Matrix cores": https://www.glennklockwood.com/garden/tensor-cores — H100 TC당 512 FP16 FMA/clk, A100 256
- NVIDIA 개발자 포럼 (H100 Tensor FP16 계산): https://forums.developer.nvidia.com/t/how-to-calculate-the-tensor-core-fp16-performance-of-h100/244727

### 다이·패키지·공정 분석
- Chips and Cheese, "Nvidia's H100: Funny L2, and Tons of Bandwidth": https://chipsandcheese.com/p/nvidias-h100-funny-l2-and-tons-of-bandwidth — 2 × 25 MB L2, 원격 ≈2배 지연, 근접 L2 >5.5 TB/s, HBM2e ≈354 ns (PCIe 모델)
- Chips and Cheese, "Nvidia's B200: Keeping the CUDA Juggernaut Rolling": https://chipsandcheese.com/p/nvidias-b200-keeping-the-cuda-juggernaut — 다이당 80 SM/74 활성, 126 MB L2, L1 39 cycle 19.6 ns, L2 ≈150 ns / 190–220 ns, 21 TB/s, 파티션당 1,024 FP16 MAC/clk
- Locuza (SXM5/H100 다이 추정): https://x.com/Locuza_/status/1522260942049918981 — SXM5 ≈150 × 80 mm, 패키지 ≈55 × 58 mm, 다이 ≈822.88 mm²(스크라이브 포함) (추정)
- Locuza, "Nvidia's Ada lineup, configurations, estimated die sizes": https://locuza.substack.com/p/nvidias-ada-lineup-configurations — GA102 TPC 6.86–6.95 mm²
- Tom's Hardware, RTX 4090 FE 리뷰: https://www.tomshardware.com/reviews/nvidia-geforce-rtx-4090-review/2 — 304 × 137 × 61 mm, 2,186 g, 16핀
- Tom's Hardware, "Nvidia's Hopper H100 SXM5 Pictured": https://www.tomshardware.com/news/nvidia-hopper-h100-sxm5-pictured
- Tom's Hardware, Ada 트랜지스터 밀도: https://www.tomshardware.com/news/nvidia-reveals-secrets-of-ada-lovelace-gpus
- IEEE Spectrum, Blackwell: https://spectrum.ieee.org/amp/nvidia-blackwell-2667535060 — "약 1,600 mm²" 두 다이
- TSMC CoWoS 공식: https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm — CoWoS-S 3.3× 레티클(≈2,700 mm²)까지, 그 이상 CoWoS-L/R
- NextPCB, "CoWoS Packaging Explained: Why H100 & B200 Need 2.5D": https://www.nextpcb.com/blog/cowos-packaging-h100-b200 — 레티클 ≈858 mm², H100 인터포저 65 nm, B100/B200 최초 CoWoS-L
- TSMC 5 nm 공식: https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_5nm
- WikiChip Fuse, "TSMC Details 5 nm" (IEDM 2019): https://fuse.wikichip.org/news/3398/tsmc-details-5-nm/ — 6T HD 0.021 μm², HP 0.025 μm², ≈32 Mib/mm², Cu reflow, ELK
- WikiChip 5 nm 프로세스: https://en.wikichip.org/wiki/5_nm_lithography_process
- Angstronomics, "The TRUTH of TSMC 5nm": https://www.angstronomics.com/p/the-truth-of-tsmc-5nm — CGP 51/57 nm 실측, 핀 피치 28 nm, M0 28 nm, M2 35 nm, N4 CGP 49/55 nm
- SemiWiki, TSMC IEDM 2019 5 nm: https://semiwiki.com/semiconductor-manufacturers/tsmc/282339-tsmc-unveils-details-of-5nm-cmos-production-technology-platform-featuring-euv-and-high-mobility-channel-finfets-at-iedm2019/
- TechInsights, RTX 4090 4N 공정 분석(유료 개요): https://www.techinsights.com/products/ace-2211-801 ; Apple C1 (N4) 16 금속층: https://www.techinsights.com/blog/apple-custom-c1-5g-modem-floorplan-analysis
- SK hynix, HBM3를 NVIDIA H100에 공급 (2022-06-08): https://news.skhynix.com/sk-hynix-to-supply-industrys-first-hbm3-dram-to-nvidia/ — 스택당 최대 819 GB/s
- HBM3/HBM3e 개요 (JEDEC JESD238, 1024-bit, 16채널, 6.4→9.6 Gbps, TSV): https://www.wevolver.com/article/what-is-high-bandwidth-memory-3-hbm3-complete-engineering-guide-2025
- 실리콘 결정 구조 (a = 0.543 nm, 최근접 0.235 nm): https://www.chemicalbook.com/article/silicon-diamond-cubic-crystal-structure.htm ; MSOE 강의노트: https://faculty-web.msoe.edu/johnsontimoj/CE3101/files3101/silicon_crystal_structure.pdf
- 기타 GPU DB (H100 SXM5 1,590/1,980 MHz, 메모리 1,313 MHz): https://videocardz.net/nvidia-h100-sxm-80gb ; https://technical.city/en/video/H100-SXM5 (2차 자료, 공식 아님)

### 미확인/주의 목록 (게임 텍스트에서 "약"으로 처리할 것)
- H100 SXM5 부스트 클럭 1,980 MHz: NVIDIA 백서/데이터시트에 명시 없음(2차 DB 값). Tensor 피크 역산은 1.83 GHz.
- SXM5 모듈·패키지 치수, GH100 다이 가로세로, SM/GPC/L2 개별 면적: 전부 추정.
- B200: 다이당 면적, GPC/TPC 수, 텍스처/LSU/SFU 수, PCIe 세대, 클럭, HBM 지연.
- 4N 게이트 길이, GPU 4N 금속층 수, GPU 실제 SRAM 셀 크기.
- H100 Copy Engine 개수.
