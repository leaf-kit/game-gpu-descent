# 04. Physical AI와 프레이밍 스토리를 위한 사실 자료 (Physical AI & Story Facts)

> 목적: "휴머노이드 로봇의 두뇌(NVIDIA GPU) 속으로 축소되어 들어간다"는 게임 프레이밍 스토리를
> 실제 기술 사실 위에 세우기 위한 리서치 문서. 숫자는 가능한 한 1차 출처(NVIDIA 뉴스룸/개발자 블로그, 논문, 데이터시트)로 확인했고,
> 확인이 안 되는 것은 **(미확인)** 또는 **(추정)** 으로 표시했다.
> 조사 기준일: 2026-09-12. 출처 번호 [n]은 9장 "Sources" 참조.

---

## 1. "Physical AI"란 무엇인가 (What "Physical AI" Means)

### 1.1 NVIDIA의 정의 (Definition)
- NVIDIA 공식 정의: **"물리 세계를 인지하고(perceive), 추론하고(reason), 상호작용하고(interact), 이동(navigate)할 수 있는 엔드투엔드 모델"**. 이 모델이 로봇, 비주얼 AI 에이전트, 창고·공장 등 "실세계에서 동작하는 자율 시스템"에 **체화(embodied)** 된 것이 Physical AI다. [1]
- 젠슨 황(Jensen Huang)의 표현: "실세계를 이해하고, 추론하고, 행동을 계획하는 모델(models that understand the real world, reason and plan actions)". [3]
- 구분 포인트(스토리용): **로봇공학(robotics)** 은 모터·센서·기구(하드웨어)이고, **Physical AI** 는 그 하드웨어가 미리 짜인 동작이 아니라 "보고 판단해서" 움직이게 하는 소프트웨어 층이다.
- 생성형 AI(ChatGPT 등)가 인터넷 텍스트에서 배우는 것과 달리, Physical AI는 **중력·마찰·조명 같은 3D 물리 세계의 데이터**가 필요하다. 그래서 "데이터 갭(data gap)"과 "시뮬레이션-현실 격차(sim-to-real gap)"가 핵심 난관이다. [2]

### 1.2 "로봇공학의 ChatGPT 모먼트" 인용 연표 (Quote Timeline)
| 시점 | 무대 | 인용(원문) | 출처 |
|---|---|---|---|
| 2024-03-18 | GTC 2024 키노트 | "The ChatGPT moment for robotics **may be** right around the corner." — 이때 Project GR00T와 Jetson Thor를 처음 공개 | [2][10] |
| 2025-01-06 | CES 2025 키노트 | "The ChatGPT moment for general robotics **is just around the corner**." — 무대에 휴머노이드 10여 대와 함께 | [2] |
| 2026-01-05 | CES 2026 | "The ChatGPT moment for robotics **is here**. Breakthroughs in physical AI — models that understand the real world, reason and plan actions — are unlocking entirely new applications." | [3] |
| 2026-03 | GTC 2026 | "Physical AI has arrived — every industrial company will become a robotics company." (GR00T N2 프리뷰) | [4] |

> 스토리 활용: "may be → is just → is here"로 점점 확신이 강해지는 3단 인용은 게임 내 연도별 뉴스 헤드라인 소품으로 쓰기 좋다.

### 1.3 "세 대의 컴퓨터" 모델 (The Three-Computer Model)
NVIDIA는 2024년 10월 23일 블로그(2025-08-08 갱신)에서 로봇 개발에는 **세 대의 컴퓨터**가 필요하다고 정리했다. [1]

| 역할 | 컴퓨터 | 하는 일 | 위치 |
|---|---|---|---|
| ① 훈련(Training) | **NVIDIA DGX** AI 슈퍼컴퓨터 | 대규모 데이터로 파운데이션 모델을 학습 | 데이터센터 |
| ② 시뮬레이션(Simulation) | **Omniverse + Cosmos on RTX PRO Servers** (구 OVX) | 디지털 트윈에서 로봇을 테스트하고 합성 데이터 생성 | 데이터센터/워크스테이션 |
| ③ 실행(Runtime / Inference) | **Jetson AGX Thor** | 로봇 몸속에서 실시간 추론 | 로봇 내부 |

- 젠슨 황, CES 2025(자율주행에 같은 프레임 적용): "Building autonomous vehicles, like all robots, requires three computers: NVIDIA DGX to train AI models, Omniverse to test drive and generate synthetic data, and DRIVE AGX, a supercomputer in the car." [2]
- 로봇의 "두뇌"는 **제어 정책(control policy) + 비전 모델 + 언어 모델의 앙상블**이며, 이것이 전력 효율이 높은 온보드 엣지 컴퓨터(Jetson)에 배포된다. [2]
- Spencer Huang(NVIDIA 로보틱스 SW 제품 리드)도 같은 구도를 "DGX(훈련) / Omniverse(시뮬레이션) / Jetson·IGX(로봇 내부)"로 설명. [2]

> 게임 세계관 매핑: 주인공은 ③(로봇 속 Jetson Thor)로 축소되어 들어가고, ①·②는 "바깥 세계"의 방문 장소가 된다.

---

## 2. 로봇의 두뇌: Jetson AGX Thor (The Robot's Brain)

### 2.1 연표 (Dates)
- **2024-03-18 GTC 2024**: "Jetson Thor" 첫 공개. 당시 "800 TFLOPS(FP8)"로 발표. Project GR00T와 함께. [10]
- **2025-08-25**: Jetson AGX Thor 개발자 키트(**$3,499**) 및 **Jetson T5000** 양산 모듈(1,000개 단위 시 **$2,999**) 정식 출시(GA). [5][6]
- 2026-08 기준 NVIDIA 미국 마켓플레이스 개발자 키트 가격은 $5,499로 인상됨. (2차 출처, **미확인**) [7]

### 2.2 사양 비교표 (Spec Table)
| 항목 | **Jetson AGX Thor (T5000)** | **Jetson AGX Orin 64GB** |
|---|---|---|
| GPU 아키텍처 | **Blackwell** | Ampere |
| CUDA 코어 | **2,560** (20 SM × 128) | 2,048 (16 SM × 128) |
| 텐서 코어(Tensor Cores) | 마케팅 **96** (5세대) — 단, 개발자 포럼 실측은 20 SM×4 = **80** 활성화(24 SM 풀칩 기준이 96) → **주의** | 64 (3세대) |
| AI 연산 | **최대 2,070 TFLOPS FP4(sparse)**, 1,035 TFLOPS FP8(dense) @130 W | 275 TOPS INT8(sparse), 170 TOPS dense |
| GPU 클럭 | 최대 1.57 GHz | 최대 1.3 GHz |
| CPU | **14코어 Arm Neoverse V3AE**, 최대 2.6 GHz, L3 16 MB | 12코어 Arm Cortex-A78AE, 2.2 GHz |
| 메모리 | **128 GB LPDDR5X**, 256-bit, **273 GB/s** | 64 GB LPDDR5, 204.8 GB/s |
| 전력 | **40–130 W** | 15–60 W |
| 공정 | TSMC (Blackwell 세대) | Samsung 8 nm |
| 기타 가속기 | PVA 3.0, 상시 DSP(HiFi 5 ×2), 카메라 오프로드 엔진, Holoscan Sensor Bridge | 2× NVDLA v2.0, PVA v2.0 |
| I/O | 4× 25 GbE, 16 lane CSI-2, PCIe Gen5, 4×8K30 디코드 | 8 lane… (생략) |
| 세대 비교 | Orin 대비 AI 7.5×, CPU 3.1×, 메모리 2×, 전력효율 3.5× | — |
| 소프트웨어 | JetPack 7 (Ubuntu 24.04), CUDA, TensorRT, Isaac ROS, Holoscan | JetPack 6.x (Ubuntu 22.04) |
출처: [5][6][7][8][9]

### 2.3 "로봇 두뇌 안에 GPU가 몇 개?" (How many GPUs / SMs inside)
- Thor는 **SoC 하나에 GPU 1개**가 들어 있고, 그 GPU는 **20개의 SM(Streaming Multiprocessor)** 로 구성된다(런타임 쿼리 결과). SM 하나에 CUDA 코어 128개, 텐서 코어 4개. 즉 게임 내 "구역"은 SM 20개 = 20개의 방. [8]
- 참고로 Thor 기술 참조 매뉴얼(TRM)의 풀칩은 24 SM(3,072 CUDA 코어)이나, 판매 모듈 T5000은 20 SM 활성. → "잠긴 방 4개"라는 게임 장치로 쓸 수 있다(사실 기반: 수율/제품 세분화용 비활성 SM). [8]
- MIG(Multi-Instance GPU) 지원: GPU 하나를 여러 개의 독립 인스턴스로 쪼갤 수 있다. [7]
- 비교: H100 SXM은 132 SM(풀칩 144), 16,896 CUDA 코어, 528 텐서 코어 — 로봇 두뇌의 약 6.6배 SM 수. [14][15]

### 2.4 실제 로봇들의 두뇌 (Who uses what)
| 로봇 | 온보드 컴퓨트 | 비고 | 출처 |
|---|---|---|---|
| Boston Dynamics **Atlas**(전동) | **Jetson Thor** | "서버급 연산을 로봇 안에" | [6][11] |
| Agility **Digit** | 5세대: Jetson(Orin) → 6세대: **Jetson Thor** | CEO Peggy Johnson: "Jetson Thor will take Digit to the next level" | [6] |
| **1X NEO** | "NEO Cortex" = **Jetson Thor**; Redwood 모델(약 1.6억 파라미터, ~5 Hz) 온보드 실행 | 카메라 온리(스테레오 어안 8.85 MP 90 Hz), LiDAR 없음 | [12] |
| **Unitree G1 EDU** | Jetson **Orin NX 16 GB (100 TOPS)** + 8코어 CPU | LiDAR(Livox MID-360) + RealSense D435i | [13] |
| **Figure** (Figure 02/03) | "듀얼 온보드 GPU"에 Helix(7B S2 + 80M S1)를 4-bit 양자화해 실행; Thor 얼리 어답터 명단에 포함 | 구체 GPU 모델 **미확인** | [16][6] |
| **Tesla Optimus** | 자체 **AI4(HW4) FSD 컴퓨터** (NVIDIA 아님); 차기 AI5는 Optimus 우선 적용 예정 | 비교 대상: NVIDIA 밖에서도 같은 구조(카메라→신경망→모터) | [17] |
- Thor 얼리 어답터(2025-08): Agility, Amazon Robotics, Boston Dynamics, Caterpillar, Figure, Hexagon, Medtronic, Meta. 1X, John Deere, OpenAI, Physical Intelligence는 "평가 중". [6][11]

---

## 3. 로봇은 GPU를 10–50 ms마다 어떻게 쓰는가 (How the Robot Uses the GPU Every ~10–50 ms)

### 3.1 한눈에 보는 파이프라인 (Pipeline Overview)
```
[센서]  카메라 30–90 Hz, LiDAR 10–20 Hz, IMU 200–1000 Hz, 관절 인코더 500–1000 Hz
   │ (CSI-2 / 25GbE → 카메라 오프로드 엔진 / Holoscan Sensor Bridge → 메모리)
   ▼
[인지 Perception]  이미지 전처리(ISP, 리사이즈 224×224) → 비전 인코더(ViT/CNN) → 이미지 토큰
   │
   ▼
[System 2 – 느린 뇌]  VLM(비전-언어 모델) ≈ 10 Hz  → "무엇을 해야 하나" 잠재 벡터/토큰
   │
   ▼
[System 1 – 빠른 뇌]  Diffusion Transformer / flow-matching ≈ 120 Hz → 액션 청크(16개 관절 목표)
   │
   ▼
[저수준 제어]  PD/토크 제어 500 Hz–1 kHz (CPU/MCU) → 모터 드라이버 전류 루프 8–40 kHz
   ▼
[모터·관절]  → 세상이 바뀜 → 다시 [센서]
```

### 3.2 각 단계와 GPU 일감 (Per-Stage GPU Workload) — "카메라 프레임 하나의 여행"
| 단계 | 무엇이 일어나나 (쉬운 말) | GPU에서 도는 연산 | 사실 근거 |
|---|---|---|---|
| ① 센서 입력 | 카메라가 1/30초마다 사진 한 장을 찍음. 224×224 RGB = **150,528개의 숫자** | 메모리 복사, ISP(색보정), 리사이즈 — 대부분 전용 엔진(PVA/카메라 오프로드) | [7] |
| ② 비전 인코더 | 사진을 작은 조각(패치)으로 잘라 각 조각을 "의미 벡터"로 바꿈. GR00T N1은 SigLIP-2 인코더 → 픽셀 셔플 → **프레임당 64개 이미지 토큰** | 컨볼루션(patch embedding) + **어텐션(attention)** = 거대한 **행렬곱(GEMM)** 을 텐서 코어가 처리 | [18] |
| ③ System 2 (VLM) | 이미지 토큰 + 명령 문장("컵을 집어") + 로봇 상태를 언어모델(SmolLM2 기반 Eagle-2, GR00T N1 기준 **1.34B** 파라미터)이 읽고 "지금 할 일"을 압축한 토큰을 냄. **~10 Hz** | 트랜스포머 디코더 레이어 반복: QKV 투영 행렬곱 → 어텐션 → MLP 행렬곱. 메모리 대역폭에 크게 의존(가중치 읽기) | [18] |
| ④ System 1 (DiT) | 노이즈 덩어리에서 시작해 **4번 디노이징(K=4)** 하며 **16개 액션(H=16)** 을 한 번에 생성(flow-matching Diffusion Transformer). **~120 Hz** 로 갱신. 로봇 상태(관절각·속도)는 embodiment별 MLP로 투영, VLM 토큰에 크로스 어텐션 | 소형 트랜스포머(총 2.2B 중 VLM 제외분) × 4스텝; 행렬곱·크로스어텐션·LayerNorm | [18] |
| ⑤ 액션 토큰 → 관절 목표 | 16개 액션은 "앞으로 몇십 ms 동안 각 관절이 갈 목표 위치" 시퀀스. 이 청크를 실행하면서 다음 청크를 미리 계산(receding horizon) | 소형 MLP 디코더, 선형 보간(interpolation) | [18][19] |
| ⑥ 저수준 제어 | 500 Hz–1 kHz PD 제어기가 "목표 위치와 현재 위치의 차이"를 토크로 바꿈. 보통 **CPU/실시간 코어/모터 MCU**에서 실행, GPU 아님 | (GPU 없음) — 게임에서는 "출구"로 표현 | [20] |

- **실측 지연**: GR00T N1-2B는 L40 GPU(bf16)에서 16개 액션 샘플링에 **63.9 ms**. [18]
- Diffusion Policy 원논문(Chi et al., RSS 2023): 실제 UR5 로봇에서 **10 Hz**로 명령을 내고 **125 Hz**로 선형 보간해 실행; DDIM 16스텝으로 지연 감축; 관측 2스텝, 예측 16스텝, 실행 8스텝 구성이 표준. [19]
- Figure Helix(2025-02-20): S2 = 7B VLM **7–9 Hz**, S1 = 80M 트랜스포머 **200 Hz**, 상체 35 DoF, 엔드투엔드 지연 100 ms 미만, 전부 온보드 GPU. [16]
- 1X Redwood: ~1.6억 파라미터, **~5 Hz**, 디퓨전 정책으로 액션 디코딩. [12]
- RL 보행 정책의 정석: **정책 50 Hz → 관절 PD 500 Hz–1 kHz → 모터 전류 루프 수 kHz**(Berkeley Digit: 50 Hz/1 kHz; Unitree G1: 50 Hz/500 Hz; NVIDIA SONIC: 50 Hz/500 Hz). [20]

### 3.3 왜 "두 개의 뇌"인가 (Why Dual System)
- 카너먼의 System 1(반사·빠름)/System 2(숙고·느림)에서 따온 구조. VLM은 크고 느려서 10 Hz, 액션 모델은 작고 빨라서 120 Hz. 둘은 **엔드투엔드로 함께 학습**된다. [18]
- 게임 비유: 10 Hz의 System 2는 "관제탑", 120 Hz의 System 1은 "손과 발의 반사신경". 플레이어는 카메라 프레임 하나를 들고 관제탑을 거쳐 반사신경 회로까지 배달한다.

### 3.4 "미션" 설계용 시간표 (Mission Timing Sheet)
| 시각(ms) | 이벤트 | 게임 내 표현 |
|---|---|---|
| 0 | 카메라 셔터. 33 ms 후 다음 프레임이 온다 | 스테이지 시작 타이머 |
| 0–2 | CSI → 메모리 DMA, ISP | "입구 컨베이어" |
| 2–10 | 비전 인코더(ViT) — 패치 64개 토큰 | "토큰 공장" (텐서 코어 방) |
| 10–100 | System 2 VLM 1회 추론(10 Hz) | "관제탑" — 큰 가중치를 HBM/LPDDR에서 실어 나름 |
| 매 ~8 ms | System 1 DiT(120 Hz)가 최신 VLM 토큰으로 16개 액션 재생성 | "반사 회로" — 4번의 디노이징 루프 |
| 매 1–2 ms | PD 제어(CPU) → 모터 | "출구 게이트"(GPU 밖) |
| 33 | 다음 프레임 도착 — 못 끝내면 프레임 드롭 | 실패 조건 |
(수치는 GR00T N1/L40 실측과 Figure/Unitree 배포 사례를 조합한 대표값. 특정 로봇의 실제 수치가 아님.)

---

## 4. 훈련 쪽: 데이터센터와 시뮬레이션 (Training Side)

### 4.1 훈련 하드웨어 (Hardware)
**NVIDIA H100 (Hopper, 2022)** [14][15]
- 다이 814 mm², **800억(80 B) 트랜지스터**, TSMC 4N 공정(TSMC Fab 18, 대만 타이난). 풀칩 144 SM 중 SXM은 132 SM 활성.
- FP8 텐서 **3,958 TFLOPS(sparse)** / 1,979 dense; FP16 989 dense. 80 GB HBM3, 3.35 TB/s. TDP **700 W**(SXM).
- CoWoS-S 2.5D 패키징: GPU 다이 1 + HBM 스택 5개 + 더미 1개가 실리콘 인터포저 위에 얹힘. [21]

**DGX H100** (1노드) [22]
- H100 ×8, 640 GB HBM, NVLink 4(GPU당 900 GB/s) + NVSwitch 4개, 최대 **~10.2 kW**, FP8 32 PFLOPS(sparse). 가격 약 **$30–50만(추정)**.

**GB200 NVL72 (Blackwell, 2024 발표)** [23][24]
- **Blackwell GPU 72개 + Grace CPU 36개**가 **랙 하나**에. 컴퓨트 트레이 18개(트레이당 GB200 슈퍼칩 2개), NVLink 스위치 트레이 9개.
- GB200 슈퍼칩 = Grace CPU(72코어 Arm Neoverse V2, LPDDR5X 480 GB) 1 + B200 GPU 2, NVLink-C2C 900 GB/s.
- B200: **2,080억 트랜지스터**, 레티클 한계 다이 2개를 **10 TB/s** NV-HBI로 연결, HBM3e 192 GB, 8 TB/s. TSMC 4NP.
- 5세대 NVLink: GPU당 **1.8 TB/s**, 72-GPU 도메인 총 **130 TB/s** (확인됨).
- 랙 총 FP4 **1.44 EFLOPS(sparse)** / ~0.72 dense, HBM 합계 ~13.4–13.8 TB, 무게 **1.36 t**, 최대 **120 kW**, **직접 칩 액체냉각(direct-to-chip liquid cooling)**.
- 후속: GB300 NVL72 (Blackwell Ultra 72 + Grace 36).

### 4.2 대형 모델은 어떻게 훈련되나 (How big models are trained)
- 수천~수만 GPU를 InfiniBand/Spectrum-X 이더넷으로 묶고, 모델·데이터·파이프라인·컨텍스트 병렬화로 쪼개 몇 주~몇 달 학습.
- **Llama 3.1 405B**: H100 **16,384장**, 54일 프리트레이닝 구간에 **419회** 예기치 않은 장애(약 3시간에 1번), 절반은 GPU/HBM3 원인. 총 연산 ~3.8e25 FLOP. [25]
- **GPT-4(추정, 비공식)**: A100 약 25,000장 × 90–100일, ~2.1e25 FLOP → H100 환산 약 **1만 장**(SemiAnalysis 등 누설 기반, **추정**). [26]
- **GR00T N1-2B**: 최대 **1,024 GPU**, 약 **50,000 H100 GPU-hours**. [18] / N1.5: ~1,000 H100, 25만 스텝(모델 카드). [27]
- **xAI Colossus**(멤피스): H100 **10만 장**을 **122일**에 구축, 이후 92일 만에 20만 장으로. 전력 100k 규모 ~150 MW(출처마다 50–250 MW로 상이, **추정**). 액체냉각 + Spectrum-X. [28]
- 전력 감각: DGX H100 1대 10.2 kW ≈ 가정용 에어컨 5–7대; NVL72 랙 120 kW ≈ 한국 가정 약 40–60가구 순간 소비(대략치, **추정**).

### 4.3 시뮬레이션과 합성 데이터 (Simulation & Synthetic Data)
- **Isaac Sim**(Omniverse 기반, RTX 렌더링) + **Isaac Lab**(RL 프레임워크): GPU 하나에서 **4,096개 이상**의 로봇 환경을 병렬 시뮬레이션. 물리 백엔드 PhysX 또는 **Newton**(NVIDIA·Google DeepMind·Disney Research 공동, Warp 기반, Linux Foundation 관리). [29][30]
- Isaac Lab 3.0부터는 RTX 렌더링 없이(H100/B200 등에서) 물리 전용 학습 가능; 카메라 센서·합성 데이터 생성엔 여전히 RTX(L40S/RTX PRO 서버) 필요. [29]
- **GR00T-Mimic(DexMimicGen)**: 사람 시연 소수를 시뮬에서 증폭 → **78만 개 궤적(6,500시간, 사람 시연 9개월 분량)을 11시간 만에** 생성. 실데이터와 섞어 GR00T N1 성능 약 40% 향상. [18][31]
- **GR00T-Dreams(DreamGen)**: Cosmos 비디오 월드 모델로 "꿈"(neural trajectories) 생성. N1.5를 **36시간** 만에 개발(사람 데이터 수집이면 ~3개월). [31][27]
- GR00T N1 데이터 피라미드: 실로봇 텔레옵 **88시간**(Fourier GR-1) / 신경 궤적 827시간 / 시뮬 6,500시간 / 웹 비디오. [18]

### 4.4 파운데이션 모델 계보 (Foundation Models)
| 모델 | 시점 | 핵심 | 출처 |
|---|---|---|---|
| **GR00T N1** | 2025-03-18 GTC | 세계 최초 오픈 휴머노이드 파운데이션 모델. **2.2B** 파라미터(VLM 1.34B). Eagle-2 VLM(SmolLM2 + SigLIP-2) + flow-matching DiT | [18][32] |
| GR00T N1.5 | 2025-05 Computex | Dreams로 36시간 만에 개발, Jetson Thor 배포 대상 | [31] |
| GR00T N1.6 | 2025-09 발표 / 2026-01-05 CES 출시 | System 2를 **Cosmos Reason** 2B로 교체, 전신 제어 | [3][33] |
| GR00T N1.7 | 2026-03 GTC → GA | Cosmos-Reason2-2B(Qwen3-VL) 백본, 상용 라이선스, EgoScale 2만 시간 | [4][33] |
| **GR00T N2** | 2026 말 목표 | DreamZero(14B World Action Model) 기반 — 비디오 프레임과 액션을 함께 예측, 7 Hz 실시간 | [4][34] |
| **Cosmos WFM** | 2025-01-06 CES | 물리 인식 비디오 생성 월드 모델. **2천만 시간 영상, 9,000조 토큰**으로 학습. Predict1 7B/14B(diffusion), 4B/12B(autoregressive); Predict2 2B/14B. NeMo Curator로 2천만 시간 처리: Blackwell 14일(CPU면 3년+) | [35][36] |
| Cosmos Reason / Reason 2 | 2025 / 2026-01 | 물리 상식 추론 VLM. "로봇의 깊이 생각하는 뇌" | [3][33] |
| Cosmos 3 | 2026-05-31 | Nano 16B / Super 64B(reasoner+generator) | [33] |

---

## 5. 일반인이 좋아할 숫자들 (Numbers a Layperson Would Love)

| # | 사실 | 수치 | 비교/감각 | 출처 |
|---|---|---|---|---|
| 1 | H100 트랜지스터 수 | **800억(80 B)** | 사람 뇌 뉴런 **약 860억(86 B)** (Herculano-Houzel 2009; 2025년 재검토 논문은 정밀도에 의문) → "거의 뉴런 수만큼의 스위치" | [14][37] |
| 2 | B200 트랜지스터 | **2,080억** | 뇌 뉴런의 2.4배; Hopper의 2.6배 | [24] |
| 3 | Jetson Thor(로봇 두뇌) 트랜지스터 | **미확인** | — | — |
| 4 | 뇌 소비 전력 | **약 20 W** (체중 2%, 에너지 20%) | Jetson Thor 40–130 W, H100 700 W, NVL72 랙 120,000 W | [38] |
| 5 | 뇌의 연산 능력 추정 | **1e15 FLOP/s**(Carlsmith 2020 선호값; 범위 1e12–1e28) | H100 FP8 ≈ **4e15**(sparse) → "H100 한 장 ≈ 뇌 하나(연산량만)" 라는 비유는 **추정 기반**임을 명시 | [39] |
| 6 | 1997년 최초 테라플롭 슈퍼컴 | **ASCI Red** 1.068 TFLOPS(Linpack), 850 kW, 노드 7,264개 | H100 FP8 3,958 TFLOPS → **약 3,700배**를 700 W로; Jetson Thor FP4 2,070 TFLOPS(정밀도 다름, 단순 비교 주의) | [40] |
| 7 | 로봇 두뇌 vs 20년 전 | Thor 2,070 TFLOPS(FP4) | ASCI Red의 약 2,000배(정밀도 차이 무시한 마케팅 수치) | [5][40] |
| 8 | GPT-4 훈련 GPU | A100 **~25,000장**, 90–100일(**추정, 비공식**) ≈ H100 **~1만 장** | [26] |
| 9 | Llama 3.1 405B 훈련 | H100 **16,384장**, 54일 구간에 장애 419회 | "3시간마다 GPU 하나가 쓰러진다" | [25] |
| 10 | Colossus | H100 10만 장, 122일 | 이후 20만 장 | [28] |
| 11 | H100 출하 추정 | 2023년 A100+H100 약 **50만 장**(Omdia, Q3 기준); 2024년 상위 12개 고객에 Hopper **200만 장+**; MS 48.5만, Meta 22.4만(**추정**) | 대당 ~$25–30k(**추정**) | [41] |
| 12 | H100 제조 원가(추정) | ~$3,320 (다이 $300, HBM3 $1,350, CoWoS $750, 테스트 $920) vs 판매가 ~$28,000 | 분석사 모델, **추정** | [21] |
| 13 | 웨이퍼당 H100 | 300 mm 웨이퍼 1장에 gross ~65–80개, 양품 ~50개; 웨이퍼 $16–21k(**추정**) | 다이 814 mm²는 레티클 한계 근처 | [21] |
| 14 | 클린룸 | ISO Class 1: 1 m³당 100–200 nm 입자 10개 이하 — 병원의 1만 개보다 **1,000배** 깨끗 | 바니 슈트(bunny suit) + 에어샤워 | [42] |
| 15 | EUV 파장 | **13.5 nm**, 레이저 생성 플라즈마(주석 방울) | 한 장비 ~100 wafer/hr(**추정**) | [42] |
| 16 | 추론 1회 에너지 | Google Gemini 텍스트 프롬프트 중앙값 **0.24 Wh**(2025-05 실측) / ChatGPT ~0.3–0.34 Wh(추정) | 60 W 전구 15초; 물 0.26 mL | [43] |
| 17 | 로봇 추론 에너지(계산) | Thor 130 W ÷ 10 Hz VLM = **13 J/추론**(≈0.0036 Wh) — 단순 계산(**추정**) | 사람 뇌는 20 W로 모든 걸 함 | [5][38] |
| 18 | NVIDIA 시가총액 | $1T 2023-05-30 → $2T 2024-02-23 → $3T 2024-06-05 → **$4T 2025-07-09(사상 최초)** → **$5T 2025-10-29** → 2026년 $5.5T 안팎 | 미국·중국 제외 모든 나라 GDP보다 큼 | [44] |
| 19 | Physical AI 매출 | NVIDIA FY2026 물리 AI 관련 매출 $6B+ (2차 출처, **미확인**) | — | [2] |
| 20 | 개발자 수 | NVIDIA 로보틱스 스택 사용 개발자 **200만 명+** | — | [6] |
| 21 | GR00T N1 훈련 | 1,024 GPU, 5만 H100-hours | ≈ H100 1장으로 5.7년 | [18] |
| 22 | 합성 데이터 속도 | 78만 궤적/11시간 = 사람 9개월치 | — | [31] |
| 23 | Cosmos 학습 데이터 | 2천만 시간 = **2,283년**치 영상 | — | [35] |
| 24 | 카메라 프레임 하나 | 224×224×3 = **150,528 숫자** → 64 토큰 | 사람 망막 광수용체 ~1억 개(일반 지식) | [18] |
| 25 | NVL72 무게/전력 | 1.36 t / 120 kW / GPU 72개가 "하나의 GPU처럼" | — | [23] |

---

## 6. 축소 전 "바깥 세계" 씬 목록 (Story-Realistic Scene List)

각 씬: 보이는 것 / 실제인 것 / 사실을 가르치는 대사 훅(KO·EN).

### 씬 1. 로보틱스 연구실 (Robotics Lab)
- **보이는 것**: 휴머노이드가 안전 하네스(gantry)에 매달려 테이블 위 컵을 집는 중. 옆에 텔레옵(teleoperation) VR 헤드셋과 컨트롤러, 모션캡처 카메라, 바닥에 케이블. 모니터엔 ROS 2 토픽 그래프와 Isaac Sim 창.
- **실제인 것**: GR00T N1 실데이터는 Fourier GR-1 텔레옵 **88시간** [18]; Helix는 500시간 텔레옵 [16]; 정책 50 Hz/PD 500 Hz 구조 [20].
- **대사 훅**
  - KO: "저 로봇, 지금 사진을 초당 30장 찍고 그중 한 장마다 15만 개 숫자를 GPU에 밀어 넣어. 사람이 하는 건 '이렇게 하라'고 손으로 보여주는 것뿐이야."
  - EN: "That robot takes 30 pictures a second and shoves 150,000 numbers per picture into the GPU. All we humans do is show it the move by hand."

### 씬 2. 로봇의 등판 — 컴퓨트 모듈 (The Torso Compute Module)
- **보이는 것**: 등판 커버를 열면 손바닥만 한 **Jetson T5000 모듈**이 방열판·팬과 함께 캐리어 보드에 꽂혀 있음. 카메라 리본(CSI-2) 16레인, 25 GbE 케이블, 배터리 버스. 온도 표시 LED.
- **실제인 것**: 128 GB LPDDR5X, 40–130 W, 4×25 GbE, CSI 16 lane [7]; Atlas·Digit·NEO가 Thor 채택 [6][12].
- **대사 훅**
  - KO: "이 손바닥만 한 게 로봇의 뇌야. 2,560개의 작은 계산기가 20개 방에 나뉘어 있고, 전력은 전기밥솥 반 개 정도만 써."
  - EN: "This palm-sized board is the brain. 2,560 tiny calculators split into 20 rooms, and it sips less power than half a rice cooker."

### 씬 3. Jetson 모듈 클로즈업 / 개발자 키트 (Jetson Dev Kit Bench)
- **보이는 것**: RTX Founders Edition처럼 생긴 개발자 키트 상자, Ubuntu 24.04 터미널에 `nvidia-smi`/`tegrastats`가 20 SM, 130 W 모드를 표시. `jtop`에 GPU 부하 그래프.
- **실제인 것**: $3,499, JetPack 7, 1 TB NVMe, Wi-Fi 6E 동봉 [6]; 포럼 실측 20 SM [8].
- **대사 훅**
  - KO: "스펙표엔 텐서 코어 96개라는데 쿼리하면 80개가 나와. 4개 방은 잠겨 있는 거지—수율 때문에. 그 잠긴 방에 들어가 볼래?"
  - EN: "The spec sheet says 96 tensor cores, but the query returns 80. Four rooms are locked—yield. Want to see what's inside a locked room?"

### 씬 4. 데이터센터 — DGX / NVL72 랙 복도 (The Data Center Aisle)
- **보이는 것**: 검은 랙이 줄지어 있고, 랙마다 냉각수 배관(직접 칩 액체냉각), 오렌지색 NVLink 케이블 다발(NVL72 스파인의 구리 케이블 수천 가닥), 바닥 진동, 80 dB 소음. 랙 하나에 "72 GPU / 36 CPU / 120 kW" 라벨.
- **실제인 것**: NVL72 1.36 t, 130 TB/s, 1.44 EFLOPS [23]; Llama 3 훈련 3시간마다 장애 [25].
- **대사 훅**
  - KO: "이 랙 하나가 로봇 두뇌 72개를 하나처럼 묶은 거야. 무게 1.4톤, 전기 120킬로와트. 로봇이 밤새 배우는 '꿈'을 여기서 꿔."
  - EN: "This one rack is 72 brains wired into one. 1.4 tons, 120 kilowatts. This is where the robot dreams overnight."

### 씬 5. 시뮬레이션 룸 — Omniverse / Isaac Sim (The Digital Twin Room)
- **보이는 것**: 대형 화면에 4,096개의 반투명 로봇이 동시에 걷다 넘어지는 Isaac Lab 화면; 옆엔 Cosmos가 생성한 "비 오는 창고" 합성 영상. RTX PRO 서버(구 OVX)가 윙윙.
- **실제인 것**: 4,096+ 병렬 환경 [29]; 78만 궤적/11시간 [31]; Newton 물리 엔진(DeepMind·Disney 공동) [30].
- **대사 훅**
  - KO: "저 로봇 4천 대는 전부 가짜야. 근데 저기서 9개월치 연습을 11시간 만에 끝내고, 진짜 로봇은 그 기억을 그대로 받아."
  - EN: "Those 4,000 robots are all fake. But they finish nine months of practice in eleven hours, and the real robot inherits the memory."

### 씬 6. 반도체 팹 — 클린룸 (The Fab Cleanroom)
- **보이는 것**: 바니 슈트(bunny suit)와 에어샤워, 호박색 조명, 천장 레일을 달리는 FOUP(웨이퍼 운반함), 버스만 한 EUV 장비. 300 mm 웨이퍼 한 장에 H100 다이 65~80개가 찍혀 있음.
- **실제인 것**: TSMC Fab 18 타이난, 4N 공정 [21]; ISO Class 1 [42]; EUV 13.5 nm [42].
- **대사 훅**
  - KO: "여긴 병원보다 천 배 깨끗해. 머리카락 굵기 1/5000짜리 먼지 하나가 칩 하나를 죽이거든. 그래서 사람도 먼지 취급을 받아—그게 이 옷이야."
  - EN: "This room is a thousand times cleaner than a hospital. One speck 1/5000th of a hair kills a chip. So people count as dust—hence the suit."

### 씬 7. 패키징 라인 — CoWoS와 HBM (Packaging & HBM)
- **보이는 것**: 실리콘 인터포저 위에 GPU 다이 하나와 HBM 스택 5개(+더미 1개)가 놓이는 현미경 영상. 12층으로 쌓인 DRAM 단면도.
- **실제인 것**: H100 = 7-die CoWoS-S 패키지 [21]; 2023–24년 CoWoS가 GPU 공급 병목 [21]; SK하이닉스가 HBM3 초기 95% 공급 [21].
- **대사 훅**
  - KO: "칩이 부족했던 진짜 이유는 GPU 다이가 아니라 '이 위에 얹는' 공정이었어. 메모리가 칩 옆에 딱 붙어야 초당 3테라바이트가 흘러."
  - EN: "The real chip shortage wasn't the GPU die—it was this stacking step. Memory has to sit right next to the chip to move 3 terabytes a second."

### 씬 8. GTC 키노트 홀 (The Keynote Hall)
- **보이는 것**: 가죽 재킷의 CEO, 무대 바닥 해치에서 나오는 파란 BDX 드로이드 "Blue", 뒤에 14대의 휴머노이드 실루엣. 스크린엔 "GR00T N1 — 세계 최초 오픈 휴머노이드 파운데이션 모델".
- **실제인 것**: 2025-03-18 GTC, Newton 발표, 1X NEO가 GR00T N1로 청소 시연 [32].
- **대사 훅**
  - KO: "'로봇의 ChatGPT 순간이 코앞이다'—2024년엔 '아마도', 2025년엔 '곧', 2026년엔 '왔다'고 했어. 매년 한 단어씩 확신이 늘어."
  - EN: "'The ChatGPT moment for robots'—'may be' in 2024, 'is just' in 2025, 'is here' in 2026. One more confident word every year."

### 씬 9. 로봇 정비 베이 — 배터리와 열 (Maintenance Bay: Power & Heat)
- **보이는 것**: 로봇 가슴에서 빼낸 배터리 팩, 열화상 카메라로 본 등판(Jetson 부위가 빨갛게), 팬 교체.
- **실제인 것**: Thor 40–130 W 전력 모드 [5]; Unitree G1 배터리 약 2시간 [13].
- **대사 훅**
  - KO: "두뇌를 130와트로 올리면 똑똑해지지만 배터리가 빨리 죽어. 40와트로 낮추면 오래 가지만 느리게 생각해. 사람 뇌는 그냥 20와트야."
  - EN: "Crank the brain to 130 watts and it gets smarter but the battery dies fast. Drop to 40 and it lasts, but thinks slower. A human brain just runs on 20."

### 씬 10. 텔레오퍼레이션 스테이션 (Teleop Station)
- **보이는 것**: 작업자가 VR 헤드셋과 장갑을 끼고 로봇 팔을 원격 조종; 화면에 "에피소드 #4,812 — 저장됨".
- **실제인 것**: 텔레옵 데이터가 데이터 피라미드 최상단 [18]; Isaac Teleop [33].
- **대사 훅**
  - KO: "내가 컵을 집으면 로봇도 집어. 그 장면이 '정답지'가 돼서 데이터센터로 가. 88시간이면 첫 뇌를 만들 수 있어."
  - EN: "When I grab the cup, the robot grabs it too. That clip becomes an answer key and ships to the data center. 88 hours is enough for a first brain."

### 씬 11. 네트워크 룸 — Spectrum-X / InfiniBand (The Network Room)
- **보이는 것**: 광케이블 폭포, 400 Gb/s 포트가 빽빽한 스위치, 케이블 라벨 "GPU 0031-7".
- **실제인 것**: DGX H100은 ConnectX-7 400 Gb/s ×8 [22]; Colossus는 Spectrum-X 이더넷 단일 RDMA 패브릭 [28].
- **대사 훅**
  - KO: "GPU 만 장이 한 모델을 배우려면 서로 답을 매 순간 맞춰 봐야 해. 그래서 이 방이 데이터센터의 '신경'이야."
  - EN: "Ten thousand GPUs learning one model have to compare notes every instant. That's why this room is the data center's nervous system."

### 씬 12. 축소 직전 — "아스트라(Astra)"의 방 (The Shrink Chamber)
- **보이는 것**: 로봇 등판 위 Jetson 모듈에 손을 대는 주인공; 아스트라가 "20개의 방과 4개의 잠긴 방, 128 GB의 기억, 초당 2,070조 번의 계산"을 읊음.
- **실제인 것**: 위 수치 전부 [5][8].
- **대사 훅**
  - KO: "네가 들어갈 곳은 초당 2,070조 번 계산하는 손바닥이야. 카메라 프레임 하나를 33밀리초 안에 관절 명령으로 바꿔 나와. 늦으면—로봇이 넘어져."
  - EN: "You're entering a palm that computes 2,070 trillion times a second. Turn one camera frame into joint commands within 33 milliseconds. Be late—and the robot falls."

---

## 7. 현실에 기반한 캐릭터 제안 (Character Ideas — Proposal)

| 캐릭터 | 현실 직무 | 현실에서 보는 것 | 게임 퍽(perk) 제안 | 근거 |
|---|---|---|---|---|
| **로보틱스 엔지니어** (Robotics Engineer) | ROS 2 노드 작성, 정책 배포, 텔레옵 데이터 수집 | 50 Hz 정책/500 Hz PD 루프, 시뮬→실기 갭 | "타이밍 감각": 미션 타이머가 25% 느리게 감; 프레임 드롭 경고 미리 보임 | [20] |
| **칩 설계자 — RTL/물리 설계** (Chip Designer) | SM·텐서 코어·캐시 계층 설계, 타이밍 클로저 | 20 SM 중 4 SM 비활성, L2 크기, 클럭 도메인 | "숨은 라벨 보기": SM·캐시·NVLink 링크의 이름/사양이 항상 표시; 잠긴 4개 SM 방 입장 | [8][14] |
| **팹 공정 엔지니어** (Fab Process Engineer, bunny suit) | EUV 리소, 식각, 증착, 수율 관리 | 13.5 nm 파장, ISO 1 클린룸, 웨이퍼당 양품 ~50개 | "무결점": 먼지/결함(버그) 장애물이 한 번 무시됨; 결함 SM을 '수리'해 잠긴 방 해제 가능 | [21][42] |
| **데이터센터 기술자** (Data Center Technician) | GPU 교체, 액체냉각 배관, NVLink 케이블링 | 3시간마다 GPU 장애, 120 kW 랙, 1.36 t | "핫스왑": 과열(오버클럭) 구역에서 피해 50% 감소; NVLink 순간이동 1회 | [23][25] |
| **CUDA 프로그래머** (CUDA Programmer) | 커널 작성, 워프(32 스레드) 단위 최적화, 텐서 코어 GEMM | occupancy, shared memory, warp divergence | "워프 이동": 32칸 직선 대시; 텐서 코어 방에서 행렬곱 퍼즐 힌트 | [14] |
| **머신러닝 연구자** (ML Researcher) | VLA/디퓨전 정책 학습, 데이터 피라미드 설계 | System 1/2, 4스텝 디노이징, 16 액션 청크 | "디노이즈": 안개(노이즈) 구역이 4단계 만에 걷힘; 액션 청크 16개 미리 보기 | [18][19] |
| **아이(Kid)** | 로봇 연구실에 놀러 온 엔지니어의 자녀 | 모든 것이 처음, 질문이 많음 | "초심자 행운": 튜토리얼 힌트 무제한, 용어 사전 자동 팝업 | — |
| **텔레오퍼레이터** (Teleoperator) | VR로 로봇을 조종해 시연 데이터 생산 | 88시간의 시연 = 첫 두뇌 | "시연": 어려운 구간 한 번 '정답 궤적' 자동 재생 | [18] |

> 모든 퍽은 "실제 직무에서 보는 것/하는 것"을 은유한 것. 밸런스 수치는 게임 디자인 단계에서 조정.

---

## 8. 용어집 (Glossary) — EN | KO | 쉬운 한국어 | Plain English

| EN | KO | 쉬운 한국어 설명 | Plain English |
|---|---|---|---|
| Physical AI | 피지컬 AI / 물리 AI | 실제 세상을 보고·판단하고·움직이는 AI. 로봇·자율주행에 들어감 | AI that perceives and acts in the real world |
| Embodied AI | 체화 AI | 몸(로봇)을 가진 AI. Physical AI와 거의 같은 뜻 | AI with a body |
| VLA (Vision-Language-Action) | 비전-언어-행동 모델 | 사진과 말을 넣으면 로봇 동작이 나오는 모델 | Model: image + text in → robot action out |
| VLM (Vision-Language Model) | 비전-언어 모델 | 사진을 보고 말로 이해하는 모델(ChatGPT에 눈이 달린 것) | A chatbot that can see |
| LLM (Large Language Model) | 대규모 언어 모델 | 글을 읽고 쓰는 거대 신경망 | Big text model |
| Diffusion policy | 디퓨전 정책 | 노이즈에서 시작해 몇 번 다듬어 로봇 동작을 만드는 방법 | Denoise noise into a motion plan |
| Flow matching | 플로 매칭 | 디퓨전과 비슷하지만 더 곧은 경로로 빨리 다듬는 방법 | A faster cousin of diffusion |
| DiT (Diffusion Transformer) | 디퓨전 트랜스포머 | 디퓨전을 트랜스포머 구조로 구현한 것 | Transformer used for denoising |
| Action chunk / horizon | 액션 청크 / 지평 | 한 번에 미리 내놓는 여러 개(예: 16개)의 동작 명령 | A batch of future moves |
| System 1 / System 2 | 시스템 1 / 시스템 2 | 빠른 반사 뇌 / 느린 생각 뇌 | Fast reflex brain / slow thinking brain |
| Inference | 추론 | 학습 끝난 모델을 실제로 "돌리는" 것 | Running a trained model |
| Training | 학습(훈련) | 데이터로 모델의 숫자(가중치)를 맞추는 과정 | Teaching the model |
| Post-training / fine-tuning | 사후 학습 / 미세조정 | 기본 모델을 내 로봇에 맞게 조금 더 가르치기 | Extra teaching for your robot |
| Foundation model | 파운데이션 모델 | 여러 일에 두루 쓰이도록 크게 미리 학습한 모델 | One big pretrained model for many tasks |
| World model / WFM | 월드 모델 / 세계 파운데이션 모델 | "다음에 세상이 어떻게 될지" 영상으로 예측하는 모델 | A model that predicts the future of a scene |
| World Action Model (WAM) | 월드 액션 모델 | 미래 영상과 로봇 동작을 함께 예측하는 모델(GR00T N2) | Predicts video + action together |
| Sim-to-real | 심투리얼 | 시뮬레이션에서 배운 걸 진짜 로봇에 옮기기 | Sim practice → real robot |
| Domain randomization | 도메인 랜덤화 | 시뮬의 조명·마찰 등을 마구 바꿔 튼튼하게 학습 | Randomize sim so real world isn't a surprise |
| Digital twin | 디지털 트윈 | 실제 공장/로봇의 똑같은 가상 복제본 | Virtual copy of a real thing |
| Synthetic data | 합성 데이터 | 시뮬이나 생성 모델로 만든 가짜(하지만 쓸모 있는) 학습 데이터 | Made-up training data |
| Teleoperation | 텔레오퍼레이션(원격 조작) | 사람이 VR 등으로 로봇을 조종해 시범 데이터를 만듦 | Human remote-controls robot to demo |
| Omniverse | 옴니버스 | NVIDIA의 3D 시뮬레이션/디지털 트윈 플랫폼(USD 기반) | NVIDIA's 3D sim platform |
| Isaac / Isaac Sim / Isaac Lab | 아이작 | NVIDIA 로봇 플랫폼 / 로봇 시뮬레이터 / 강화학습 프레임워크 | NVIDIA robotics stack |
| Isaac ROS | 아이작 ROS | ROS 2용 GPU 가속 패키지 | GPU-accelerated ROS 2 |
| GR00T | 그루트 | NVIDIA 휴머노이드 파운데이션 모델 시리즈(N1→N2) | NVIDIA humanoid brain model |
| Cosmos | 코스모스 | NVIDIA 월드 파운데이션 모델·추론 VLM 플랫폼 | NVIDIA world-model platform |
| Newton | 뉴턴 | NVIDIA·DeepMind·Disney 오픈소스 물리 엔진 | Open-source physics engine |
| Jetson | 젯슨 | 로봇/엣지용 NVIDIA 소형 AI 컴퓨터 시리즈 | NVIDIA's small robot computers |
| Jetson AGX Thor / T5000 | 젯슨 토르 | Blackwell 세대 로봇 두뇌 모듈(2025-08) | Latest robot brain |
| Jetson AGX Orin | 젯슨 오린 | 이전 세대(Ampere) 로봇 두뇌 | Previous-gen robot brain |
| SoC (System on Chip) | 시스템 온 칩 | CPU·GPU·메모리 컨트롤러가 한 칩에 | Whole computer on one chip |
| SM (Streaming Multiprocessor) | 스트리밍 멀티프로세서 | GPU 안의 "작업반". Thor는 20개 | A GPU work-crew unit |
| CUDA core | 쿠다 코어 | SM 안의 작은 계산기(FP32) | A tiny calculator |
| Tensor Core | 텐서 코어 | 행렬곱 전용 초고속 계산기(AI의 핵심) | Matrix-multiply engine |
| CUDA | 쿠다 | NVIDIA GPU 프로그래밍 플랫폼 | NVIDIA GPU programming |
| Warp | 워프 | 32개 스레드가 한 몸처럼 움직이는 단위 | 32 threads moving together |
| Kernel | 커널 | GPU에서 도는 함수 하나 | One GPU program |
| GEMM / matrix multiply | 행렬곱 | AI 연산의 90% 이상을 차지하는 곱셈-덧셈 덩어리 | The core AI math |
| Attention | 어텐션 | 토큰들이 서로 얼마나 관련 있는지 계산하는 연산 | Tokens looking at each other |
| Convolution | 컨볼루션 | 작은 필터를 이미지에 훑어 특징을 뽑는 연산 | Sliding filter over an image |
| Token | 토큰 | 모델이 다루는 최소 단위(단어 조각, 이미지 패치) | A chunk the model reads |
| Patch | 패치 | 이미지를 잘게 자른 조각(ViT 입력) | Image tile |
| ViT (Vision Transformer) | 비전 트랜스포머 | 이미지를 패치 토큰으로 바꿔 트랜스포머로 처리 | Transformer for images |
| Latency | 지연 시간 | 입력이 들어가 출력이 나오기까지 걸리는 시간 | Delay |
| Hz (Hertz) | 헤르츠 | 초당 반복 횟수. 10 Hz = 0.1초마다 | Times per second |
| FLOPS / TFLOPS / PFLOPS / EFLOPS | 플롭스 | 초당 실수 연산 횟수. T=조, P=천조, E=백경 | Math ops per second |
| TOPS | 톱스 | 초당 정수(INT8) 연산 횟수(조) | Integer ops per second |
| Sparse vs dense | 희소 / 밀집 | 2:4 희소성 적용 시 마케팅 수치가 2배. 실제는 dense 기준 | Sparsity doubles the marketing number |
| FP32 / FP16 / BF16 / FP8 / FP4 | 부동소수점 정밀도 | 숫자 하나에 쓰는 비트 수. 낮을수록 빠르고 덜 정확 | Bits per number; fewer = faster |
| Quantization | 양자화 | 모델 숫자를 더 적은 비트로 줄여 작고 빠르게 | Shrinking model numbers |
| HBM (High Bandwidth Memory) | 고대역폭 메모리 | GPU 옆에 쌓아 붙인 초고속 메모리 | Stacked super-fast memory |
| LPDDR5X | 저전력 DDR 메모리 | Jetson이 쓰는 모바일급 메모리(128 GB) | Phone-style memory |
| Memory bandwidth | 메모리 대역폭 | 초당 메모리에서 읽어올 수 있는 양 | Data speed from memory |
| DGX | 디지엑스 | NVIDIA의 AI 훈련 서버(8 GPU) | NVIDIA training server |
| HGX | 에이치지엑스 | 서버 제조사용 8-GPU 베이스보드 | 8-GPU board for OEMs |
| GB200 NVL72 | 엔브이엘72 | GPU 72 + CPU 36 액체냉각 랙 | 72-GPU rack |
| Grace CPU | 그레이스 CPU | NVIDIA의 Arm 기반 데이터센터 CPU(72코어) | NVIDIA's Arm CPU |
| NVLink / NVSwitch | 엔브이링크 | GPU끼리 직접 잇는 초고속 통로(1.8 TB/s) | GPU-to-GPU highway |
| InfiniBand / Spectrum-X | 인피니밴드 / 스펙트럼-X | 서버 랙끼리 잇는 초고속 네트워크 | Rack-to-rack network |
| MIG (Multi-Instance GPU) | 멀티 인스턴스 GPU | GPU 하나를 여러 개로 쪼개 쓰기 | Splitting one GPU |
| TensorRT | 텐서RT | 추론을 빠르게 하는 NVIDIA 최적화 도구 | NVIDIA inference optimizer |
| JetPack | 젯팩 | Jetson용 OS+드라이버+라이브러리 묶음 | Jetson's software bundle |
| ROS 2 | 로스 2 | 로봇 소프트웨어 표준 미들웨어 | Robot software plumbing |
| PD controller | PD 제어기 | "목표와 현재 차이"를 힘으로 바꾸는 가장 기본 제어기 | Basic motor controller |
| IMU | 관성 측정 장치 | 기울기·가속도 센서(로봇의 귓속 평형기관) | Tilt/acceleration sensor |
| LiDAR | 라이다 | 레이저로 거리를 재는 센서 | Laser distance sensor |
| Joint encoder | 관절 인코더 | 관절 각도를 재는 센서 | Joint angle sensor |
| Proprioception | 고유수용감각 | 로봇이 자기 관절 상태를 아는 감각 | Body-position sense |
| DoF (Degrees of Freedom) | 자유도 | 움직일 수 있는 관절 축 개수 | Number of movable joints |
| CoWoS | 코워스 | TSMC의 2.5D 패키징(GPU+HBM을 한 판에) | TSMC chip-stacking package |
| EUV | 극자외선 리소그래피 | 13.5 nm 빛으로 회로를 찍는 장비 | The light that prints chips |
| Wafer / die / yield | 웨이퍼 / 다이 / 수율 | 원판 / 칩 한 개 / 양품 비율 | Disc / one chip / good-chip rate |
| Transistor | 트랜지스터 | 칩 속 전기 스위치. H100은 800억 개 | Electronic switch |

---

## 9. 출처 (Sources)

1. NVIDIA Blog, "The Three Computer Solution: Powering the Next Wave of AI Robotics" (2024-10-23, upd. 2025-08-08) — https://blogs.nvidia.com/blog/three-computers-robotics/
2. Calcalist/CTech, "Jensen Huang: 'The ChatGPT moment for general robotics is just around the corner'" (CES 2025) — https://www.calcalistech.com/ctechnews/article/6czk05rq0 ; Turing Post, "Spencer Huang Explains NVIDIA Physical AI" — https://www.turingpost.com/p/spencer ; MarketScreener 재게재 — https://www.marketscreener.com/quote/stock/NVIDIA-CORPORATION-57355629/news/The-Three-Computer-Solution-Powering-the-Next-Wave-of-AI-Robotics-48149405/
3. NVIDIA Newsroom, "NVIDIA Releases New Physical AI Models as Global Partners Unveil Next-Generation Robots" (CES 2026-01-05) — https://nvidianews.nvidia.com/news/nvidia-releases-new-physical-ai-models-as-global-partners-unveil-next-generation-robots
4. NVIDIA Newsroom, "NVIDIA and Global Robotics Leaders Take Physical AI to the Real World" (GTC 2026-03) — https://nvidianews.nvidia.com/news/nvidia-and-global-robotics-leaders-take-physical-ai-to-the-real-world
5. NVIDIA Newsroom, "NVIDIA Blackwell-Powered Jetson Thor Now Available" (2025-08-25) — https://nvidianews.nvidia.com/news/nvidia-blackwell-powered-jetson-thor-now-available-accelerating-the-age-of-general-robotics
6. NVIDIA Blog, "NVIDIA Jetson Thor Unlocks Real-Time Reasoning for General Robotics and Physical AI" (2025-08-25) — https://blogs.nvidia.com/blog/jetson-thor-physical-ai-edge ; CNBC (2025-08-25) — https://www.cnbc.com/2025/08/25/nvidias-thor-t5000-robot-brain-chip.html
7. ServeTheHome, "NVIDIA Jetson AGX Thor Developer Kit Specs" — https://www.servethehome.com/nvidia-jetson-agx-thor-developer-kit-blackwell-for-robotics/2/ ; NVIDIA Jetson Thor 제품 페이지 — https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/ ; RidgeRun Thor SoC guide — https://developer.ridgerun.com/wiki/index.php/NVIDIA_Jetson_Thor:_Powering_the_Future_of_Physical_AI ; The Robot Report 비교 기사 — https://www.therobotreport.com/how-does-nvidias-jetson-thor-compare-with-other-robot-brains/
8. NVIDIA Developer Forums, "Clarification on CUDA Core and Tensor Core counts for Jetson AGX Thor" (20 SM × 128 = 2,560; 96 텐서 코어는 24 SM 풀칩 기준) — https://forums.developer.nvidia.com/t/clarification-on-cuda-core-and-tensor-core-counts-for-jetson-agx-thor/356355
9. NVIDIA, "Jetson AGX Orin Series Technical Brief v1.2" (2022-07) — https://www.nvidia.com/content/dam/en-zz/Solutions/gtcf21/jetson-orin/nvidia-jetson-agx-orin-technical-brief.pdf ; Orin TOPS 설명 포럼 — https://forums.developer.nvidia.com/t/jetson-agx-orin-tops-cuda-cores-explained/252426
10. Hackster.io, "NVIDIA Tells Resellers to Open Jetson AGX Thor Developer Kit Orders at $3,499" (GTC 2024 800 TFLOPS 언급) — https://www.hackster.io/news/nvidia-tells-resellers-to-open-jetson-agx-thor-developer-kit-orders-at-3-499-06e8cbf52441
11. DCD, "Nvidia launches Jetson Thor compute modules for humanoid robots" — https://www.datacenterdynamics.com/en/news/nvidia-launches-jetson-thor-compute-modules-for-humanoid-robots/ ; The Register (2025-08-25) — https://www.theregister.com/2025/08/25/nvidia_touts_jetson_thor_kit/
12. 1X, "Redwood AI" — https://www.1x.tech/discover/redwood-ai ; 1X, "Inside 1X's Humanoid Robot Stack … with NVIDIA" (GTC 2026) — https://www.1x.tech/discover/nvidia-gtc-2026 ; The Robot Report, "1X's NEO humanoid gains autonomy with new Redwood AI model" — https://www.therobotreport.com/1xs-neo-humanoid-gains-autonomy-with-new-redwood-ai-model/
13. Unitree G1 EDU 사양(리셀러) — https://robostore.com/products/unitree-g1-edu-ultimate-a-robotic-humanoid ; https://www.robotshop.com/products/unitree-g1-edu-standard-u1-humanoid-robot-us
14. Tom's Hardware, "Nvidia Reveals Hopper H100 GPU With 80 Billion Transistors" (GTC 2022) — https://www.tomshardware.com/news/nvidia-hopper-h100-gpu-revealed-gtc-2022 ; NVIDIA H100 데이터시트(Microway 미러) — https://www.microway.com/wp-content/uploads/2024/04/NVIDIA-H100-Datasheet-Microway.pdf
15. Chips and Cheese, "Nvidia's H100: Funny L2, and Tons of Bandwidth" (144 SM 풀칩/132 활성) — https://chipsandcheese.com/p/nvidias-h100-funny-l2-and-tons-of-bandwidth
16. Figure AI, "Helix: A Vision-Language-Action Model for Generalist Humanoid Control" (2025-02-20) — https://www.figure.ai/news/helix
17. Not a Tesla App, "Tesla Announces New AI4+ FSD Computer" (2026-04) — https://www.notateslaapp.com/news/4032/tesla-announces-new-ai4-fsd-computer-with-more-memory-and-compute ; Tesla AI 페이지 — https://www.tesla.com/AI (Optimus Gen 2의 HW4 사용은 2차 출처 기반, 세부 **미확인**)
18. NVIDIA, "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots" (arXiv 2503.14734, 2025-03) — https://arxiv.org/html/2503.14734v1 (System 2 Eagle-2 10 Hz on L40; System 1 DiT 120 Hz; H=16, K=4; 2.2B/1.34B; 63.9 ms; 1,024 GPU / 50k H100-hrs; 88 h 텔레옵; 224×224 → 64 토큰)
19. Chi et al., "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion" (RSS 2023, arXiv 2303.04137) — https://arxiv.org/abs/2303.04137 ; 코드 — https://github.com/real-stanford/diffusion_policy
20. Radosavovic et al., "Real-world humanoid locomotion with reinforcement learning" (Science Robotics, 2024; 정책 50 Hz / PD 1 kHz) — https://science.org/doi/10.1126/scirobotics.adi9579 ; NVIDIA SONIC (arXiv 2511.07820; 50 Hz/500 Hz) — https://arxiv.org/pdf/2511.07820 ; JAEGER (arXiv 2505.06584) — https://arxiv.org/pdf/2505.06584 ; Isaac Sim 토크 제어 토론 — https://github.com/isaac-sim/IsaacSim/discussions/582
21. SemiAnalysis, "AI Capacity Constraints - CoWoS and HBM Supply Chain" — https://newsletter.semianalysis.com/p/ai-capacity-constraints-cowos-and ; Tom's Hardware, "Nvidia to Reportedly Triple Output… Up to 2 Million H100s" (웨이퍼당 ≤65개) — https://www.tomshardware.com/news/nvidia-to-reportedly-triple-output-of-compute-gpus-in-2024-up-to-2-million-h100s ; Silicon Analysts AI chip cost 모델(**추정**) — https://siliconanalysts.com/data/ai-chip-costs ; NextPCB CoWoS 설명 — https://www.nextpcb.com/blog/cowos-packaging-h100-b200
22. DGX H100 사양/가격 — https://flopper.io/system/nvidia-dgx-h100 ; https://cyfuture.cloud/kb/gpu/dgx-h100-price-guide-specs-cost-and-2025-availability
23. NVIDIA, "GB200 NVL72" 제품 페이지 — https://www.nvidia.com/en-us/data-center/gb200-nvl72/ ; Pantheon spec sheet — https://pantheon.run/learn/nvidia-gb200-nvl72-specs ; Introl 배치 가이드 — https://introl.com/blog/gb200-nvl72-deployment-72-gpu-liquid-cooled
24. NVIDIA Newsroom, "NVIDIA Blackwell Platform Arrives to Power a New Era of Computing" (2024-03-18) — https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing ; NVIDIA Multi-Node NVLink tuning guide — https://docs.nvidia.com/multi-node-nvlink-systems/multi-node-tuning-guide/overview.html ; NVIDIA Tech Blog, "Inside NVIDIA Blackwell Ultra" — https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/
25. Tom's Hardware, "Faulty Nvidia H100 GPUs and HBM3 memory caused half of failures during Llama 3 training" — https://www.tomshardware.com/tech-industry/artificial-intelligence/faulty-nvidia-h100-gpus-and-hbm3-memory-caused-half-of-the-failures-during-llama-3-training-one-failure-every-three-hours-for-metas-16384-gpu-training-cluster ; Meta, "Introducing Llama 3.1" — https://ai.meta.com/blog/meta-llama-3-1/ ; Epoch AI 계산(~72일) — https://x.com/EpochAIResearch/status/1815778832265232483
26. Patrick McGuinness, "GPT-4 Details Revealed" (SemiAnalysis 누설 요약, **비공식**) — https://patmcguinness.substack.com/p/gpt-4-details-revealed ; Situational Awareness, "Racing to the Trillion-Dollar Cluster" — https://situational-awareness.ai/racing-to-the-trillion-dollar-cluster/
27. GR00T N1.5 설명(phospho) — https://blog.phospho.ai/d-groot-n1-5-a-foundation-model-for-generalist-humanoid-robots/ ; LearnOpenCV — https://learnopencv.com/gr00t-n1_5-explained/
28. NVIDIA Newsroom, "NVIDIA Ethernet Networking Accelerates World's Largest AI Supercomputer, Built by xAI" — https://nvidianews.nvidia.com/news/spectrum-x-ethernet-networking-xai-colossus ; Supermicro 사례 — https://www.supermicro.com/CaseStudies/Success_Story_xAI_Colossus_Cluster.pdf ; Introl, "xAI's Memphis Colossus" — https://introl.com/blog/xai-memphis-colossus-100000-gpu-supercomputer-infrastructure
29. NVIDIA Isaac Lab — https://developer.nvidia.com/isaac/lab ; Isaac Lab 문서 — https://isaac-sim.github.io/IsaacLab/develop/index.html ; Isaac Lab Development Update (Newton/kit-less) — https://github.com/isaac-sim/IsaacLab/discussions/4339
30. NVIDIA Perspectives, "Newton Physics Engine in Isaac Sim & Lab" — https://perspectives.nvidia.com/isaac-sim/newtons-integration-isaac-sim-and-isaac-lab/ ; Variety, "Nvidia GTC 2025: Disney, Google DeepMind Team on AI Robotics Research" — https://variety.com/2025/digital/news/nvidia-disney-ai-robotics-gtc-2025-1236341728/
31. NVIDIA Tech Blog, "Building a Synthetic Motion Generation Pipeline for Humanoid Robot Learning" — https://developer.nvidia.com/blog/building-a-synthetic-motion-generation-pipeline-for-humanoid-robot-learning ; Hackster.io, "NVIDIA's Robots Dream of Trajectories… GR00T-Dreams" — https://www.hackster.io/news/nvidia-s-robots-dream-of-trajectories-not-electric-sheep-with-gr00t-dreams-1f12db16c80f
32. NVIDIA Newsroom, "NVIDIA Announces Isaac GR00T N1 — the World's First Open Humanoid Robot Foundation Model" (2025-03-18) — https://nvidianews.nvidia.com/news/nvidia-isaac-gr00t-n1-open-humanoid-robot-foundation-model-simulation-frameworks ; NVIDIA GTC 2025 live blog — https://blogs.nvidia.com/blog/nvidia-keynote-at-gtc-2025-ai-news-live-updates/
33. NVIDIA Research, "GR00T N1.6" — https://research.nvidia.com/labs/gear/gr00t-n1_6/ ; Hugging Face nvidia/GR00T-N1.6-3B — https://huggingface.co/nvidia/GR00T-N1.6-3B ; GitHub NVIDIA/Isaac-GR00T (N1.7 GA) — https://github.com/Nvidia/Isaac-GR00T ; The Robot Report (GTC Taipei 2026, Cosmos 3, 레퍼런스 로봇) — https://www.therobotreport.com/nvidia-cloud-robot-computing-platforms-physical-ai-humanoid-development/
34. "World Action Models are Zero-shot Policies" (DreamZero, arXiv 2602.15922, 2026-02-17) — https://arxiv.org/abs/2602.15922
35. NVIDIA Newsroom, "NVIDIA Launches Cosmos World Foundation Model Platform" (CES 2025-01-06) — https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-world-foundation-model-platform-to-accelerate-physical-ai-development ; NVIDIA Blog, Cosmos 오픈 공개 — https://blogs.nvidia.com/blog/cosmos-world-foundation-models
36. "Cosmos World Foundation Model Platform for Physical AI" (arXiv 2501.03575) — https://arxiv.org/html/2501.03575v2 ; Cosmos Predict1 model matrix — https://docs.nvidia.com/cosmos/latest/predict1/model_matrix.html
37. Azevedo, Herculano-Houzel et al. (2009), "Equal numbers of neuronal and nonneuronal cells make the human brain an isometrically scaled-up primate brain" — https://onlinelibrary.wiley.com/doi/10.1002/cne.21974 ; Brain (2025) 재검토 논문 — https://academic.oup.com/brain/article/148/3/689/7909879
38. Britannica, "The Human Brain Runs on Less Power than a Light Bulb" — https://www.britannica.com/science/The-Human-Brain-Runs-on-Less-Power-than-a-Light-Bulb
39. Carlsmith/Open Philanthropy, "How Much Computational Power Does It Take to Match the Human Brain?" (2020) — https://coefficientgiving.org/research/how-much-computational-power-does-it-take-to-match-the-human-brain/ ; AI Impacts, "Brain performance in FLOPS" — https://aiimpacts.org/brain-performance-in-flops/
40. TOP500, "ASCI Red: Sandia National Laboratory" — https://top500.org/resources/top-systems/asci-red-sandia-national-laboratory/ ; Sandia 퇴역 보도 — https://newsreleases.sandia.gov/releases/2006/asci-red-decom.html
41. Omdia 추정 보도: Tom's Hardware (2023-11, 50만 장) — https://tech.yahoo.com/ai/articles/nvidia-sold-half-million-h100-001055544.html ; DCD/FT (2024, MS 48.5만) — https://www.datacenterdynamics.com/en/news/microsoft-bought-twice-as-many-nvidia-hopper-gpus-as-other-big-tech-companies-report/ ; The Register (2024 Hopper 200만+) — https://www.theregister.com/2024/12/23/nvidia_ai_hardware_competition/
42. ASML, "How microchips are made" — https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made ; American Cleanroom Systems, "Semiconductor Cleanrooms 101" — https://www.americancleanrooms.com/semiconductor-cleanrooms-101/ ; Wikipedia, "Cleanroom suit" — https://en.wikipedia.org/wiki/Cleanroom_suit
43. Google, "Measuring the environmental impact of delivering AI at Google Scale" (arXiv 2508.15734, 2025-08) — https://arxiv.org/abs/2508.15734 ; MIT Tech Review 보도 — https://www.technologyreview.com/2025/08/21/1122288/google-gemini-ai-energy/ ; Epoch AI, "How much energy does ChatGPT use?" — https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use
44. Morningstar, "4 Charts on Nvidia's Record $4 Trillion Market Cap" — https://www.morningstar.com/stocks/4-charts-nvidias-record-4-trillion-market-cap ; NBC News, "Nvidia becomes the first company worth $5 trillion" (2025-10-29) — https://www.nbcnews.com/business/markets/nvidia-record-five-trillion-ai-bubble-rcna240447

### 미확인/추정 항목 요약 (Unverified or Estimated Items)
- Jetson Thor 트랜지스터 수 — **미확인**
- Jetson Thor "96 텐서 코어": 마케팅 수치. 실측 활성은 80(20 SM×4)일 가능성 — 포럼 근거, NVIDIA 공식 해명 **미확인**
- Thor 개발자 키트 $5,499 인상(2026-08) — 2차 출처, **미확인**
- Figure 로봇의 정확한 온보드 GPU 모델 — **미확인** ("듀얼 온보드 GPU"만 공식)
- Tesla Optimus Gen 2의 HW4 탑재 — 2차 출처, **미확인**
- GPT-4 훈련 GPU 수/기간 — 누설 기반 **추정**
- H100 출하량, 제조원가, 웨이퍼 단가 — 애널리스트 **추정**
- Colossus 전력(50–250 MW) — 출처별 상이, **추정**
- NVIDIA Physical AI 매출 $6B(FY2026) — **미확인**
- 뇌 FLOPS(1e15) — 학술 **추정**, 범위 매우 넓음
- "GR00T가 Thor에서 30 fps 이상" — 2차 출처, **미확인**
