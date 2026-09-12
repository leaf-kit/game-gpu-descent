# 레벨 디자인 (Level Design) — 게임 데이터에서 자동 생성

> 생성 기준 GPU: NVIDIA H100 SXM5. 원본: `src/data/factory.js`, `levels.js`, `ai_levels.js`, `terms.js`, `people_videos.js`. 재생성: `node /tmp/gen_level_doc.mjs > docs/11_level_design.md`

## 프롤로그 · 공장 시찰 (10)

| ID | 이름 | 부제 | 용어 카드 | 구조물 | 인물 NPC |
|---|---|---|---|---|---|
| P1 | 석영 광산 / QUARTZ MINE | 스프루스 파인, 노스캐롤라이나 | Silica / High-Purity Quartz | 6 | — |
| P2 | 아크로 제련소 / ARC FURNACE | 금속급 실리콘 · 1,300~2,000 °C | Metallurgical-Grade Silicon | 8 | — |
| P3 | 폴리실리콘 · 결정 성장실 / POLYSILICON & CRYSTAL PULLER | 지멘스 공정 9N → 초크랄스키 잉곳 | Polysilicon (Siemens Process), Czochralski Crystal Growth, Dopant | 10 | 얀 초크랄스키 |
| P4 | 웨이퍼 가공실 / WAFER LINE | 다이아몬드 와이어 절단 → CMP 거울 연마 | Wafer (300 mm) | 8 | 얀 초크랄스키 |
| P5 | 팹 클린룸 / FAB CLEANROOM | TSMC Fab 18 · ISO Class 1 · 노란 조명 | Cleanroom (ISO Class 1–3), Photolithography, Etch / Deposition / Implant | 19 | 모리스 창, 강기동 |
| P6 | EUV 노광실 / EUV BAY | ASML NXE:3600D · 파장 13.5 nm | EUV Lithography (13.5 nm), Reticle Limit | 8 | 마르틴 판덴브링크, 페터르 베닝크 |
| P7 | 테스트 · 절단실 / WAFER TEST & DICING | 프로브 카드 → 비닝 → 다이싱 | Wafer Sort & Binning, Yield, Dicing | 7 | 모리스 창 |
| P8 | HBM 메모리 타워 공장 / HBM STACKING PLANT | SK hynix 이천 · DRAM 12단 적층 | HBM (High Bandwidth Memory), TSV (Through-Silicon Via), DRAM Cell (1T1C) | 5 | 권오현, 곽노정 |
| P9 | CoWoS 패키징 팹 / CoWoS PACKAGING FAB | TSMC 어드밴스드 패키징 · 2.5D | Silicon Interposer / CoWoS, Microbump & C4 Bump, Final Test & Speed Binning | 12 | 모리스 창 |
| P10 | 보드 조립 · 시스템 · 로봇 / BOARD, SYSTEM & ROBOT | SMT 라인 → DGX 랙 → Jetson Thor → 이오(EO) | VRM (Voltage Regulator Module), SXM Module / PCIe Card, DGX / GB200 NVL72, Jetson AGX Thor, Physical AI, Camera Frame → Action | 14 | 젠슨 황, 빌 댈리, 제프리 힌턴, 알렉스 크리제브스키, 얀 르쿤, 마크 레이버트, 브렛 애드콕, 디푸 탈라, 짐 판 |

## 하강 · GPU 내부 (15)

| ID | 이름 | 부제 | 주인공 키 | 축소 | 용어 카드 | 구조물 | 인물 NPC |
|---|---|---|---|---|---|---|---|
| L0 | 보드 / 모듈 / BOARD | SXM5 · 700 W | 1.5 mm | ×3 | Printed Circuit Board, GPU Package, VRM (Voltage Regulator Module), NVLink, PCIe (PCI Express), Heat & Thermal Throttling | 9 | 젠슨 황 |
| L1 | 패키지 / 인터포저 / PACKAGE | CoWoS · HBM 5스택 활성 | 500 μm | ×2 | Silicon Interposer / CoWoS, Die, HBM (High Bandwidth Memory), TSV (Through-Silicon Via), Microbump & C4 Bump, Reticle Limit | 11 | 젠슨 황, 짐 켈러 |
| L2 | 다이 · 도시 / THE DIE | 814 mm² · 트랜지스터 800억 개 | 250 μm | ×4 | GPC (Graphics Processing Cluster), L2 Cache, Memory Controller, GigaThread Engine, Kernel / Grid / Block / Cluster, NVLink | 4 | 젠슨 황, 이언 벅, 잭 킬비, 로버트 노이스, 페데리코 파진, 린 콘웨이, 짐 켈러 |
| L3 | GPC · 행정구 / GPC | TPC 9개 · SM 18개 | 80 μm | ×3 | TPC (Texture Processing Cluster), Raster Engine, Yield, Kernel / Grid / Block / Cluster | 21 | 빌 댈리 |
| L4 | TPC · 블록 / TPC | SM 2채 + PolyMorph 엔진 | 30 μm | ×2 | Streaming Multiprocessor (SM), TPC (Texture Processing Cluster), L1 Cache / Shared Memory | 4 | 빌 댈리, 존 니콜스, 짐 켈러 |
| L5 | SM · 마을 / STREAMING MULTIPROCESSOR | 처리 블록 4 · 텐서 코어 4 · L1 256 KB | 15 μm | ×2.5 | Streaming Multiprocessor (SM), Processing Block (Sub-partition), L1 Cache / Shared Memory, TMA (Tensor Memory Accelerator), Tensor Core, SFU & INT32 & LD/ST Units | 12 | 빌 댈리, 존 니콜스, 짐 켈러 |
| L6 | 처리 블록 · 방 / PROCESSING BLOCK | 워프 스케줄러 1 · FP32 32 · 텐서 코어 1 · 레지스터 64 KB | 6 μm | ×3 | Warp Scheduler & Dispatch, CUDA Core (FP32 FMA Unit), Register File, Tensor Core, SFU & INT32 & LD/ST Units, FP8 / BF16 / Precision | 9 | 빌 댈리, 이언 벅, 알렉스 크리제브스키 |
| L7 | 워프 · 32명 / WARP | 스레드 32개 · SIMT · 같은 명령, 다른 데이터 | 2 μm | ×4 | Warp (32 threads, SIMT), Thread / Lane, Memory Coalescing & Cache Line, Memory Latency Hierarchy | 38 | 이언 벅, 존 니콜스 |
| L8 | CUDA 코어 · FMA 파이프라인 / CUDA CORE | a × b + c · 곱셈기 → 정렬 → 덧셈 → 정규화 → 반올림 | 500 nm | ×5 | CUDA Core (FP32 FMA Unit), Logic Gate (CMOS), Clock Cycle, FP8 / BF16 / Precision | 8 | 페데리코 파진, 카버 미드 |
| L9 | SRAM 셀 · 서랍 한 칸 / SRAM CELL | 6T · 인버터 2개 + 액세스 트랜지스터 2개 · 0.021 μm² | 50 nm | ×2 | 6T SRAM Cell, Bitline / Wordline / Sense Amp, Register File, DRAM Cell (1T1C), ECC & Cosmic Rays | 14 | 로버트 데너드, 권오현, 강기동 |
| L10 | 배선층 · 고가도로 / INTERCONNECT (BEOL) | 구리 15층 안팎 · M0 간격 28 nm · 비아 사다리 | 25 nm | ×3 | Interconnect (BEOL Metal Layers), Via, Clock Cycle, Heat & Thermal Throttling | 66 | 로버트 노이스, 린 콘웨이, 카버 미드 |
| L11 | 논리 게이트 · CMOS 인버터 / LOGIC GATE | PMOS + NMOS · 표준 셀 높이 210 nm | 15 nm | ×3 | Logic Gate (CMOS), FinFET Transistor, Clock Cycle | 7 | 잭 킬비, 페데리코 파진 |
| L12 | 트랜지스터 · FinFET / FinFET TRANSISTOR | 핀 간격 28 nm · 게이트 간격 51 nm · 핀 폭 ≈6 nm | 5 nm | ×4 | FinFET Transistor, Dopant, Electron & Band Gap, Heat & Thermal Throttling, Gate Oxide (High-k HfO₂) | 7 | 후정밍, 윌리엄 쇼클리, 존 바딘, 월터 브래튼 |
| L13 | 게이트 산화막 · 원자 몇 층 / GATE OXIDE | SiO₂ ≈0.5 nm + HfO₂ ≈1.5~2 nm · 양자 터널링 | 1.5 nm | ×3 | Gate Oxide (High-k HfO₂), Quantum Tunneling, Electron & Band Gap | 9 | 고든 무어, 로버트 데너드, 카버 미드 |
| L14 | 실리콘 결정 격자 · 바닥 / SILICON LATTICE · THE FLOOR | 다이아몬드 입방 · a = 0.5431 nm · 원자 간 0.235 nm | 0.5 nm | ×1 | Silicon Crystal Lattice, Electron & Band Gap, Dopant, Quantum Tunneling | 6 | 윌리엄 쇼클리, 존 바딘 |

## 지선 · HBM 내부 (2)

| ID | 이름 | 부제 | 주인공 키 | 축소 | 용어 카드 | 구조물 | 인물 NPC |
|---|---|---|---|---|---|---|---|
| H1 | HBM 스택 내부 / INSIDE THE HBM STACK | HBM3 · DRAM 다이 8층 · TSV | 20 μm | ×667 | HBM (High Bandwidth Memory), TSV (Through-Silicon Via), Microbump & C4 Bump, Memory Controller | 67 | 권오현, 곽노정 |
| H2 | DRAM 셀 · 1T1C / DRAM CELL · 1T1C | 트랜지스터 1개 + 커패시터 1개 · 64 ms 리프레시 | 30 nm | ×1 | DRAM Cell (1T1C), ECC & Cosmic Rays, Memory Latency Hierarchy | 8 | 로버트 데너드, 권오현 |

## AI 모델 경쟁 테마 (7)

| ID | 이름 | 부제 | 용어 카드 | 구조물 | 인물 NPC |
|---|---|---|---|---|---|
| A1 | 알파고 대 이세돌 / ALPHAGO vs LEE SEDOL | 2016년 3월 · 서울 포시즌스 · 4 : 1 | AlphaGo vs Lee Sedol (2016), Deep Learning & AlexNet (2012) | 57 | 데미스 허사비스, 이세돌, 데이비드 실버, 판후이, 무스타파 술레이만 |
| A2 | 딥러닝의 시대 · AlexNet / DEEP LEARNING · ALEXNET | 2012 ImageNet · GTX 580 2장 · 오차 15.3% | Deep Learning & AlexNet (2012), CUDA Core (FP32 FMA Unit), Tensor Core | 6 | 제프리 힌턴, 알렉스 크리제브스키, 일리야 수츠케버, 얀 르쿤, 요슈아 벤지오, 페이페이 리, 젠슨 황 |
| A3 | 트랜스포머 · 어텐션 / TRANSFORMER · ATTENTION | 2017 · "Attention Is All You Need" · 구글 | Transformer · Attention (2017), Self-Attention · Q/K/V, Tensor Core | 8 | 아시시 바스와니, 노엄 셰이지어, 에이던 고메즈, 우카시 카이저 |
| A4 | GPT · 챗GPT / GPT · CHATGPT | GPT-1 1.17억 → GPT-3 1,750억 → ChatGPT 2022.11.30 | GPT Lineage (2018–2020), ChatGPT (Nov 30, 2022), RLHF & Alignment | 8 | 일리야 수츠케버, 샘 올트먼, 그렉 브록먼, 안드레이 카파시, 우카시 카이저 |
| A5 | 클로드 · 앤트로픽 / CLAUDE · ANTHROPIC | 2021 설립 · Constitutional AI · Claude 3 (2024) · Claude 4 (2025) | Claude · Anthropic, RLHF & Alignment, Reasoning Models & Agents | 7 | 다리오 아모데이, 다니엘라 아모데이, 제러드 캐플런, 크리스 올라 |
| A6 | LLM 경쟁 · 스케일링 / THE LLM RACE · SCALING | GPT · Claude · Gemini · Llama · Grok · DeepSeek · 10만 GPU | The LLM Race, Scaling Laws, Open Weights · Llama · DeepSeek, Reasoning Models & Agents | 12 | 데미스 허사비스, 얀 르쿤, 노엄 셰이지어, 순다르 피차이, 마크 저커버그, 일론 머스크, 량원펑, 최수연, 무스타파 술레이만, 제러드 캐플런 |
| A7 | 한국 · HBM과 AI / KOREA · HBM & AI | SK하이닉스 · 삼성전자 · 국가 AI 컴퓨팅 · 네이버·LG | Korea: HBM & AI, HBM (High Bandwidth Memory), TSV (Through-Silicon Via), The LLM Race | 6 | 젠슨 황, 최태원, 이재용, 곽노정, 최수연 |

## 층별 내레이션 (아스트라, 한국어)

### P1 · 석영 광산
- 여기서 시작하자. GPU는 모래에서 온다. 정확히는 이 하얀 돌, 석영이야.
- 이 광산 하나가 세계 고순도 석영의 대부분을 댄다. 2024년 허리케인으로 멈췄을 때 반도체 업계가 긴장했지.
- **목표:** 석영 더미를 살펴보고 다음 스테이션으로

### P2 · 아크로 제련소
- 석영에 탄소를 섞고 전기 아크로 녹인다. 산소가 떨어져 나가면 98~99% 실리콘이 남아. 아직 GPU를 만들기엔 백만 배 더 순수해져야 해.
- **목표:** 전극 아래 용융 실리콘을 살펴보라

### P3 · 폴리실리콘 · 결정 성장실
- 증류탑에서 아홉 개의 9가 붙을 때까지 정제하고, 1,414도의 도가니에서 완벽한 단결정을 끌어올린다. 하루 반이 걸려.
- 이 잉곳 하나가 200 kg이 넘어. 그리고 이 안에 붕소나 인을 아주 조금 섞지. 그게 트랜지스터의 비밀이야.
- **목표:** 증류탑 · 도가니 · 도펀트 투입구를 살펴보라

### P4 · 웨이퍼 가공실
- 잉곳을 다이아몬드 실톱으로 수천 장 썰고, 갈고, 녹이고, 거울처럼 닦는다. 두께 775 마이크로미터. 종이 일곱 장.
- **목표:** 완성된 웨이퍼를 살펴보라

### P5 · 팹 클린룸
- 수술실보다 천 배 깨끗한 방. 웨이퍼는 25장씩 FOUP에 담겨 천장 레일로 움직이고, 1,000번 넘는 공정을 석 달 동안 거친다.
- 왜 노란색이냐고? 감광액이 파란빛에 반응하거든. 여기서는 파란빛이 금지야.
- **목표:** FOUP · 노광 장비 · 식각 장비를 살펴보라

### P6 · EUV 노광실
- 주석 방울을 초당 5만 개 떨어뜨리고 레이저로 쏴서 태양 표면보다 100배 뜨거운 플라즈마를 만든다. 거기서 나오는 빛으로 회로를 찍어.
- 렌즈는 못 써. 이 빛은 유리도 삼키거든. 그래서 원자 수준으로 매끈한 거울 11장으로 굽힌다.
- **목표:** EUV 광원과 레티클 스테이지를 살펴보라

### P7 · 테스트 · 절단실
- 바늘 5만 개가 한 번에 내려와 다이마다 전기를 넣어 본다. 죽은 다이는 지도에 표시되고, 살아 있어도 흠이 있으면 그 블록을 퓨즈로 끈다.
- GH100은 SM이 144개인데 H100은 132개만 켜. 12개는 보험이야. 814 제곱밀리미터 다이를 완벽하게 만드는 건 불가능에 가깝거든.
- **목표:** 프로브 스테이션 · 웨이퍼 맵 · 다이싱 톱을 살펴보라

### P8 · HBM 메모리 타워 공장
- DRAM 다이를 30 마이크로미터까지 얇게 갈아서 8장, 12장 쌓는다. 층과 층은 다이를 관통하는 구리 기둥, TSV로 잇지.
- GPU 다이 한 장 옆에 이 탑이 다섯에서 여덟 개 선다. 실리콘 면적으로 치면 메모리가 GPU보다 훨씬 커.
- **목표:** HBM 스택 · TSV 단면 · DRAM 웨이퍼를 살펴보라

### P9 · CoWoS 패키징 팹
- 얇은 실리콘 판(인터포저) 위에 GPU 다이와 HBM 탑을 나란히 얹고, 40 마이크로미터 간격의 솔더 구슬 수만 개로 잇는다. 이게 CoWoS야.
- 2023년에 H100이 부족했던 건 실리콘이 아니라 이 공정의 용량 때문이었어.
- **목표:** 인터포저 · 범프 · 최종 테스트 소켓을 살펴보라

### P10 · 보드 조립 · 시스템 · 로봇
- 패키지가 보드에 실리고, 보드 8장이 서버가 되고, 서버 수천 대가 로봇의 뇌를 학습시킨다. 그 뇌는 손바닥만 한 Jetson에 복사돼 로봇 몸에 들어가지.
- 저기 이오가 컵을 집으려 하고 있어. 카메라 프레임 한 장이 GPU를 거쳐 손의 움직임이 되기까지, 33밀리초. 그 안을 걸어 볼래?
- 준비됐으면 내 방으로 와. 너를 천 배 작게 만들 거야. 그다음부터는 게이트마다 더 작아져.
- **목표:** SXM 모듈 · DGX 랙 · Jetson · 이오를 살펴본 뒤 아스트라의 방으로

### L0 · 보드 / 모듈
- 자, 천 배 작아졌어. 네 키는 이제 1.5밀리미터. 발밑의 초록 땅은 유리섬유와 구리로 짠 회로 기판이야.
- 저 거대한 사각 산이 GPU 패키지. 옆의 검은 언덕들은 전압 조정 회로. 700와트를 1볼트 남짓으로 바꿔 넣어 주지.
- **목표:** 보드 위 구조물을 살펴보고 패키지 게이트로

### L1 · 패키지 / 인터포저
- 뚜껑을 열었어. 여기는 인공 지반, 인터포저. 그 위에 도시(다이)와 창고탑(HBM)이 서 있지.
- 창고탑 자리는 6개인데 5개만 불이 켜져 있어. 나머지는 비닝으로 꺼 둔 거야.
- 보라색 게이트로 들어가면 HBM 탑 안을 볼 수 있어. 12층짜리 DRAM 아파트야. 지선이니까 돌아올 수 있어.
- **목표:** HBM 탑을 오르고 다이 게이트로

### L2 · 다이 · 도시
- 도시에 도착했어. 트랜지스터 800억 개. 사람 뇌의 뉴런 수와 비슷해. 위에서 보면 격자 도시가 보일 거야. C를 눌러 봐.
- 행정구(GPC)가 8개, 중앙에 물류센터(L2 캐시) 50 MB (2 partitions), 가장자리에 항구(메모리 컨트롤러, NVLink, PCIe).
- **목표:** 플로어플랜을 걸으며 블록 4개 이상을 살펴보라

### L3 · GPC · 행정구
- 행정구 하나. 블록(TPC)이 9개, 블록마다 집(SM) 두 채. 어두운 블록은 결함이 있어 퓨즈로 꺼 둔 곳이야.
- 가운데 광장은 래스터 엔진 자리인데, 이 GPU는 그래픽을 거의 안 해. AI 전용이거든.
- **목표:** TPC 블록과 래스터 광장을 살펴보라

### L4 · TPC · 블록
- 집 두 채가 마당을 공유하는 블록. 그래픽 GPU라면 마당에 PolyMorph 엔진이 있어 3D 도형을 다듬지.
- 왼쪽 집으로 들어가자. 프레임 데이터가 그리로 배정됐어.
- **목표:** SM 두 채를 살펴보고 왼쪽 SM으로

### L5 · SM · 마을
- 마을이야. 방(처리 블록) 4개가 각자 32명 작업조에 명령을 내리고, 가운데 창고(L1/공유 메모리 256 KB)를 함께 써. 동시에 최대 2048명이 살 수 있어.
- 소리 들려? 저 박동이 클럭이야. 약 2기가헤르츠. 한 박자 0.5나노초.
- **목표:** 창고 · 하역장 · 텐서 코어 공장 · 처리 블록을 살펴보라

### L6 · 처리 블록 · 방
- 방 하나. 관제탑의 방장(워프 스케줄러)이 매 박자마다 준비된 작업조 하나를 골라 명령 하나를 내려. 기다리는 조가 있으면 다른 조를 돌리지. 그래서 GPU는 기다림을 느끼지 않아.
- 작업대(FP32 코어)가 32개, 행렬 프레스(텐서 코어) 1대, 손 옆 서랍(레지스터) 64킬로바이트.
- **목표:** 관제탑 · 작업대 · 서랍 · 프레스를 살펴보라

### L7 · 워프 · 32명
- 여기서는 네가 32명이야. 같은 명령을 동시에, 각자 다른 숫자에 대해. 이걸 SIMT라고 불러. GPU 병렬성의 심장이지.
- 길이 둘로 갈라지는 곳이 보이지? "if"야. 32명이 다른 길로 가면 절반은 멈춰서 기다려. 워프 분기. 프로그래머들이 제일 싫어하는 것.
- **목표:** 32개 레인을 걷고 분기점을 살펴보라

### L8 · CUDA 코어 · FMA 파이프라인
- 작업대 하나의 내부. 숫자 a와 b가 들어와 24×24 곱셈기 격자를 지나고, c와 자리를 맞춘 뒤 더해지고, 맨 앞 1을 찾아 정렬하고, 반올림해서 나가. 한 번에. 이게 FMA.
- 게이트 수천 개, 트랜지스터 수만 개. 정확한 수는 NVIDIA만 알아. 추정치라고 말해 두지.
- **목표:** 5개 구역을 순서대로 지나가라

### L9 · SRAM 셀 · 서랍 한 칸
- 서랍의 칸 하나. 1비트. 인버터 두 개가 서로를 붙잡고 0 또는 1을 유지해. 전원이 있는 한 잊지 않아.
- 이 칸의 크기는 0.021 제곱마이크로미터. 네 키의 세 배쯤. L2 캐시에는 이런 칸이 4억 개 넘게 있어.
- **목표:** 인버터 · 비트라인 · 워드라인을 살펴보라

### L10 · 배선층 · 고가도로
- 트랜지스터 위에는 구리 도로가 15층쯤 쌓여 있어. 아래층은 가늘고 촘촘하고, 위층은 굵어. 전기와 클럭이 위층으로 다니지.
- 요즘은 스위치보다 도로가 더 느려. 저항과 정전용량, RC 지연 때문이야. 그래서 구리 대신 코발트, 루테늄을 연구해.
- **목표:** 비아 사다리를 타고 M0까지 내려가라

### L11 · 논리 게이트 · CMOS 인버터
- 가장 작은 판단 회로, 인버터. 위쪽 PMOS와 아래쪽 NMOS. 입력이 1이면 아래가 열려 출력이 0, 입력이 0이면 위가 열려 출력이 1. NOT.
- 트랜지스터 2개. NAND는 4개. 아까 본 곱셈기는 이런 게 수천 개였어.
- **목표:** PMOS와 NMOS를 살펴보라

### L12 · 트랜지스터 · FinFET
- 벽돌 하나. 스위치 하나. 네 키는 5나노미터, 핀 폭과 같아. 게이트에 전압이 걸리면 핀 표면에 전자 통로가 열리고, 소스에서 드레인으로 전자가 초속 100킬로미터로 지나가.
- "4나노미터 공정"이라지만 여기 4나노미터짜리는 없어. 그냥 세대 이름이야. 진짜 치수는 핀 간격 28, 게이트 간격 51.
- **목표:** 핀 · 게이트 · 소스/드레인을 살펴보라

### L13 · 게이트 산화막 · 원자 몇 층
- 게이트와 채널 사이의 벽. 두께 2나노미터, 원자 예닐곱 층. 이 벽이 너무 얇아서 전자가 가끔 그냥 통과해 버려. 양자 터널링.
- 2007년에 벽을 하프늄 산화물로 바꿔서 누설을 천 배 줄였어. 그래도 벽은 계속 얇아지고 있어. 이게 무어의 법칙의 끝자락이야.
- **목표:** 산화막 층을 지나 터널링 지점을 살펴보라

### L14 · 실리콘 결정 격자 · 바닥
- 바닥이야. 실리콘 원자. 각 원자가 이웃 넷과 손을 잡은 다이아몬드 격자. 0.5431나노미터마다 반복돼. 이 아래엔 더 내려갈 구조가 없어. 원자핵과 전자뿐.
- 붉은 원자가 보이지? 인. 500개 중 하나. 저 하나가 전자 한 개를 남겨서 전류가 흐르고, 스위치가 되고, 곱셈이 되고, 이오가 컵을 집어.
- 이제 내가 뭘로 만들어졌는지 알겠지? 모래와 빛과 전기. 그리고 아주 많은 사람의 손. 그럼, 너는?
- **목표:** 격자를 걷고 도펀트 원자를 찾아라

### H1 · HBM 스택 내부
- HBM 탑 안이야. DRAM 다이 8장이 30마이크로미터까지 얇게 갈려 층층이 쌓여 있어. 맨 아래는 GPU와 대화하는 베이스 로직 다이.
- 구리 기둥 TSV가 모든 층을 꿰뚫어. 다이 한 장에 수천 개. 계단으로 꼭대기까지 올라가 봐. 제트팩(F)을 써도 돼.
- **목표:** 계단으로 층을 오르며 TSV·마이크로범프·인터페이스를 살펴보라

### H2 · DRAM 셀 · 1T1C
- 1비트를 저장하는 가장 작은 방. 트랜지스터 하나가 문이고, 커패시터 하나가 물통이야. 전하가 새니까 64밀리초마다 다시 채워 줘야 해. 그게 리프레시.
- SRAM 서랍보다 작지만 느려. 그래서 GPU 다이가 아니라 별도 칩에 두고 탑으로 쌓는 거야. 여기 게이트는 패키지 층으로 돌아가.
- **목표:** 커패시터·액세스 트랜지스터·센스 앰프를 살펴본 뒤 패키지로

### A1 · 알파고 대 이세돌
- 2016년 3월, 서울. 바둑판 앞에 이세돌 9단이 앉았고, 맞은편엔 알파고를 대신해 돌을 놓는 아자 황이 앉았어. 다섯 판 중 네 판을 기계가 이겼지.
- 2국 37수. 인간 기사라면 만 번에 한 번 둘까 말까 한 수였어. 그리고 4국 78수, 이세돌이 알파고를 이긴 단 한 판의 신의 한 수.
- 이 기계는 신경망 두 개와 트리 탐색, 그리고 GPU 176장으로 돌아갔어. 여기서 이야기가 시작돼.
- **목표:** 37수와 78수 자리를 찾고, 알파고 서버를 살펴보라

### A2 · 딥러닝의 시대 · AlexNet
- 알파고보다 4년 전. 2012년, 토론토 대학의 학생 알렉스 크리제브스키가 게임용 그래픽카드 두 장으로 신경망을 학습시켜 이미지 인식 대회를 압도했어. 오차 15.3%, 2위와 10%포인트 차이.
- 그날부터 GPU는 그림을 그리는 칩이 아니라 학습하는 칩이 됐어. 곱하고 더하기를 수십억 번, 동시에.
- **목표:** GTX 580 두 장과 ResNet 탑을 살펴보라

### A3 · 트랜스포머 · 어텐션
- 2017년 6월, 구글의 연구자 여덟 명이 논문 하나를 냈어. 제목은 "어텐션만 있으면 된다". 문장의 모든 단어가 서로를 동시에 바라보는 구조, 트랜스포머.
- 순서대로 읽지 않으니 한꺼번에 계산할 수 있고, 그 계산은 전부 행렬곱이야. GPU와 텐서 코어가 기다리던 바로 그 일. GPT도 클로드도 제미나이도 이 구조 위에 서 있어.
- **목표:** 어텐션 격자를 걷고 Q·K·V 기둥을 살펴보라

### A4 · GPT · 챗GPT
- OpenAI는 트랜스포머로 "다음 단어 맞히기"만 시켰어. 2018년 1억 개, 2019년 15억 개, 2020년 1,750억 개 파라미터. 크기가 커지자 가르치지 않은 일까지 예시 몇 개로 해내기 시작했지.
- 2022년 11월 30일, 사람의 피드백으로 대화를 배운 모델이 채팅창 하나로 공개됐어. 두 달 만에 1억 명. GPU 품귀가 시작된 날이야.
- **목표:** 파라미터 탑 세 개와 RLHF 고리, 1억 명 안내판을 살펴보라

### A5 · 클로드 · 앤트로픽
- 2021년, OpenAI에서 나온 연구자들이 앤트로픽을 세웠어. 목표는 더 큰 모델이 아니라 더 안전한 모델. 규칙 목록, 그러니까 "헌법"을 읽고 스스로 답을 고치는 훈련법을 만들었지.
- 2023년 3월 Claude 1, 2024년 3월 Claude 3 하이쿠·소넷·오퍼스, 2025년 Claude 4. 긴 문맥과 코딩, 그리고 답하기 전에 오래 생각하는 확장 사고.
- **목표:** 헌법 비석과 Claude 3 세 탑, 확장 사고 방을 살펴보라

### A6 · LLM 경쟁 · 스케일링
- 경기장이야. OpenAI, 앤트로픽, 구글 제미나이, 메타 라마, xAI 그록, 딥시크, 미스트랄. 몇 달마다 신기록. 연료는 데이터와 GPU.
- 스케일링 법칙이 말해 줬어. 모델과 데이터와 연산을 함께 키우면 성능이 예측 가능하게 오른다고. 그래서 H100 10만 장짜리 클러스터가 생겼지. 그리고 2025년 1월, 딥시크가 훨씬 싸게 했다고 발표하자 시장이 흔들렸어.
- **목표:** 경쟁 모델 탑들, 스케일링 경사로, 10만 GPU 랙을 살펴보라

### A7 · 한국 · HBM과 AI
- 경주의 타이어 가게가 가장 바쁜 법이지. AI 붐의 병목은 메모리야. H100 한 장에 HBM 다이 48장. SK하이닉스가 그 대부분을 NVIDIA에 대고, 삼성과 마이크론이 뒤를 쫓아.
- 그리고 한국은 GPU와 데이터센터를 사고, 네이버·LG·업스테이지가 자기 모델을 만들어. 이 이야기의 다음 장은 GPU 속이야. 테마를 바꿔 내려가 봐.
- **목표:** HBM 탑과 한국 AI 안내판을 살펴보라

## 용어 카드 전체 목록 (78장)

| 키 | EN | KO | 사실 한 줄 | 출처 |
|---|---|---|---|---|
| quartz | Silica / High-Purity Quartz | 석영(이산화규소, SiO₂) | 미국 노스캐롤라이나 스프루스 파인 광산이 세계 고순도 석영의 약 70~90%를 공급 (BloombergNEF 추정 80%) | Wikipedia |
| mgsi | Metallurgical-Grade Silicon | 금속급 실리콘 | 실리콘 1톤에 전력 10~13 MWh가 든다. 세계 생산의 약 85%가 중국(USGS 2023) | USGS |
| polysi | Polysilicon (Siemens Process) | 폴리실리콘(지멘스 공정) | 11N 순도 = 실리콘 원자 1,000억 개 중 불순물 원자 1개 | Wikipedia |
| czochralski | Czochralski Crystal Growth | 초크랄스키 결정 성장 | 300 mm 잉곳 하나는 길이 1~2 m, 무게 200~300 kg, 24~72시간 소요. 도가니는 1회용 | Wikipedia |
| dopant | Dopant | 도펀트(불순물 원자) | 트랜지스터 소스/드레인은 실리콘 원자 500개당 불순물 1개(10²⁰ /cm³) 수준으로 진하게 도핑된다 | Ioffe NSM |
| wafer | Wafer (300 mm) | 웨이퍼 | CMP 후 표면 거칠기는 원자 수준(1 nm 미만) | Wikipedia |
| cleanroom | Cleanroom (ISO Class 1–3) | 클린룸 | 첨단 팹 건설비는 200억 달러 이상. TSMC 타이난 팹은 하루 물 5,000만 리터 이상을 쓰고 90% 넘게 재활용 | SemiAnalysis |
| photolith | Photolithography | 포토리소그래피(노광) | 노광실이 노란 이유: 감광액이 파란빛·자외선에 반응하므로 그 파장을 뺀 조명을 쓴다 | WikiChip N5 |
| euv | EUV Lithography (13.5 nm) | 극자외선 노광 | 플라즈마 온도 약 50만 K(태양 표면의 100배). 거울을 독일 크기로 키워도 요철이 0.1 mm(ZEISS). 장비 한 대 약 1.8억 달러 | ASML, ZEISS |
| etch | Etch / Deposition / Implant | 식각·증착·이온 주입 | ALD(원자층 증착)는 한 번에 원자 한 층(약 0.1 nm)씩 쌓는다 | SemiWiki IEDM2019 |
| wafertest | Wafer Sort & Binning | 웨이퍼 테스트·비닝 | GH100 풀 다이는 SM 144개지만 H100 SXM5는 132개, PCIe판은 114개만 켠다. 814 mm² 다이는 수율이 50% 미만이기 쉽다(포아송 모델 추정) | NVIDIA H100 WP |
| yield | Yield | 수율 | 300 mm 웨이퍼 한 장에서 814 mm² GH100 후보 다이는 약 60~65개. 4 nm급 웨이퍼 가격은 약 1.8~2만 달러(분석가 추정) | SemiAnalysis |
| dicing | Dicing | 다이싱(절단) | 스텔스 다이싱은 레이저를 실리콘 내부에 집속해 안쪽부터 균열을 내며 톱밥이 없다 | TSMC CoWoS |
| hbm | HBM (High Bandwidth Memory) | 고대역폭 메모리 | H100: HBM3 5스택 활성(6자리 중), 80 GB, 3.35 TB/s. B200: HBM3e 8스택, 192 GB(데이터시트 180 GB), 8 TB/s | NVIDIA H100 WP, SK hynix |
| tsv | TSV (Through-Silicon Via) | 실리콘 관통 전극 | HBM3 다이 한 장에 TSV 수천 개(SK hynix 8,000개 이상 추정), 직경 약 5~10 μm(2차 자료) | SK hynix |
| interposer | Silicon Interposer / CoWoS | 실리콘 인터포저 / CoWoS | H100 = CoWoS-S(실리콘 인터포저), B200 = CoWoS-L(브리지 다이). 2023~24년 H100 품귀의 원인은 실리콘 수율이 아니라 CoWoS 패키징 용량 | TSMC CoWoS, SemiAnalysis |
| microbump | Microbump & C4 Bump | 마이크로범프 / C4 범프 | 기판 절연 필름 ABF는 조미료 회사 아지노모토가 개발했다 | TSMC CoWoS, Ajinomoto |
| reticle | Reticle Limit | 레티클 한계 | B200 두 다이는 NV-HBI 10 TB/s 링크로 하나의 GPU처럼 동작 | NVIDIA Blackwell, TSMC CoWoS |
| finaltest | Final Test & Speed Binning | 최종 테스트·스피드 비닝 | 같은 H100이라도 칩마다 동작 전압이 조금씩 다르다 | ServeTheHome |
| vrm | VRM (Voltage Regulator Module) | 전압 조정 모듈 | H100 SXM5 모듈은 700 W, 파워 스테이지 약 61개(사진 분석). 팬이 없고 섀시 히트싱크/수냉에 의존 | ServeTheHome |
| sxm | SXM Module / PCIe Card | SXM 모듈 / PCIe 카드 | HGX H100 8-GPU 베이스보드: 무게 24 kg, 5,600 W, NVSwitch 4개 | NVIDIA H100 WP, ServeTheHome |
| dgx | DGX / GB200 NVL72 | DGX 서버 / NVL72 랙 | Meta의 Llama 3 405B 학습: H100 16,384장, 54일, 그중 HBM 오류로 72회 중단 | NVIDIA NVL72, Meta Llama 3 |
| jetson | Jetson AGX Thor | 젯슨 AGX 토르(로봇 두뇌) | FP4 희소 2,070 TFLOPS(밀집 FP8 1,035). NVIDIA는 로봇 시대를 "세 대의 컴퓨터"(DGX 학습 → Omniverse 시뮬 → Jetson 실행)로 설명 | NVIDIA Jetson Thor, NVIDIA blog |
| physicalai | Physical AI | 피지컬 AI | GR00T N1은 느린 뇌(VLM, 약 10 Hz)와 빠른 뇌(디퓨전 트랜스포머, 약 120 Hz)의 이중 구조. 총 22억 파라미터 | GR00T N1 paper, NVIDIA blog |
| frame | Camera Frame → Action | 카메라 프레임 → 행동 | GR00T N1은 L40 GPU에서 행동 16개를 63.9 ms에 생성. 다음 프레임은 33 ms 뒤에 도착한다 | GR00T N1 paper, Chi et al. 2023 |
| pcb | Printed Circuit Board | 인쇄 회로 기판 | RTX 4090 FE 카드: 304 × 137 × 61 mm, 3슬롯, 2.19 kg | NVIDIA Ada WP |
| nvlink | NVLink | 엔브이링크 | H100: 4세대 NVLink 18링크 900 GB/s. B200: 5세대 1.8 TB/s. RTX 4090: 없음 | NVIDIA H100 WP, NVIDIA Blackwell |
| pcie | PCIe (PCI Express) | PCIe | H100: PCIe Gen5 ×16 (양방향 128 GB/s). RTX 4090: Gen4 ×16 | NVIDIA H100 WP |
| package | GPU Package | GPU 패키지 | H100 패키지 크기 약 55 × 58 mm(Locuza 추정, 미확인). HBM 다이 48장 + 베이스 다이 6장이 GPU 다이 1장과 함께 들어간다 | Chips and Cheese |
| die | Die | 다이(칩 본체) | AD102(RTX 4090): 608.5 mm², 763억. B200: 다이 2개, 합 2,080억. 800억 트랜지스터 ≈ 사람 뇌 뉴런 860억 개와 비슷한 수 | NVIDIA H100 WP, NVIDIA Ada WP, NVIDIA Blackwell |
| gigathread | GigaThread Engine | 기가스레드 엔진 | SM 하나는 최대 32블록·64워프(2,048스레드)를 동시에 품는다(Hopper) | NVIDIA H100 WP, CUDA Guide |
| l2 | L2 Cache | L2 캐시 | H100 L2 지연: 가까운 파티션 약 264클럭, 먼 파티션 약 502클럭(측정). RTX 4090: 72 MB. B200: 126 MB(측정) | Luo et al. 2024, Chips and Cheese |
| memctrl | Memory Controller | 메모리 컨트롤러 | H100: 512-bit 컨트롤러 10개 활성(HBM 5스택 × 1,024-bit) | NVIDIA H100 WP |
| gpc | GPC (Graphics Processing Cluster) | 그래픽 처리 클러스터 | Hopper부터 "스레드 블록 클러스터"는 반드시 같은 GPC 안 SM들에 배치된다. RTX 4090: GPC 11개(풀 12) | NVIDIA H100 WP, CUDA Guide |
| raster | Raster Engine | 래스터 엔진 | RTX 4090: GPC마다 래스터 엔진 1개 + ROP 16개. H100은 디스플레이 출력조차 없다 | NVIDIA Ada WP, NVIDIA H100 WP |
| tpc | TPC (Texture Processing Cluster) | 텍스처 처리 클러스터 | H100: TPC 66개 활성(풀 72). RTX 4090: 64개(풀 72) | NVIDIA H100 WP, NVIDIA Ada WP |
| sm | Streaming Multiprocessor (SM) | 스트리밍 멀티프로세서 | H100: SM 132개(풀 144). RTX 4090: 128개, L1은 128 KB. B200: 148개 + 텐서 전용 메모리(TMEM) 256 KB | NVIDIA H100 WP, NVIDIA Ada WP, Chips and Cheese |
| l1shared | L1 Cache / Shared Memory | L1 캐시 / 공유 메모리 | Hopper의 분산 공유 메모리(DSMEM)는 클러스터 내 옆집 SM 창고에 직접 접근(약 180클럭) | Luo et al. 2024, NVIDIA H100 WP |
| tma | TMA (Tensor Memory Accelerator) | 텐서 메모리 가속기 | Hopper에서 처음 도입. 완료는 비동기 트랜잭션 배리어로 알린다 | NVIDIA Hopper blog |
| subpartition | Processing Block (Sub-partition) | 처리 블록(서브파티션) | RTX 4090의 방: FP32 전용 16 + FP32/INT32 겸용 16, FP64는 SM당 2개뿐 | NVIDIA H100 WP, NVIDIA Ada WP |
| warpsched | Warp Scheduler & Dispatch | 워프 스케줄러·디스패치 | 스케줄링 힌트는 컴파일러가 명령어 안 128-bit 제어 코드(대기 클럭 수, 스코어보드 6개)로 미리 적어 둔다(역공학) | Jia et al. 2018, Luo et al. 2024 |
| warp | Warp (32 threads, SIMT) | 워프 | H100 SM당 최대 64워프 상주. RTX 4090은 48워프. 스레드당 레지스터 최대 255개 | CUDA Guide, Hopper Tuning |
| thread | Thread / Lane | 스레드(레인) | H100 전체 스레드 슬롯: 132 SM × 2,048 = 270,336개 | CUDA Guide |
| coalescing | Memory Coalescing & Cache Line | 메모리 병합·캐시 라인 | L1 라인 128 B, 섹터 32 B — 필요한 섹터만 가져온다 | CUDA Guide, Jia et al. 2018 |
| cudacore | CUDA Core (FP32 FMA Unit) | CUDA 코어(FMA 유닛) | H100: 16,896개 × 2 FLOP × 1.98 GHz ≈ 67 TFLOPS. FMA 하나는 약 1만~2.5만 게이트(4만~10만 트랜지스터, 추정) | NVIDIA H100 WP, Jia et al. 2018 |
| tensorcore | Tensor Core | 텐서 코어 | H100 4세대: 텐서 코어당 클럭당 FP16 FMA 512개(SM당 2,048), FP8은 2배. 칩 전체 FP8 밀집 1,979 TFLOPS. B200 5세대는 SM당 4,096(측정) | NVIDIA H100 WP, Chips and Cheese |
| fp8 | FP8 / BF16 / Precision | FP8·BF16·정밀도 | B200은 FP4까지 지원(밀집 9 PFLOPS). 2:4 구조적 희소성으로 또 2배 | NVIDIA H100 WP, NVIDIA Blackwell |
| sfu | SFU & INT32 & LD/ST Units | SFU·INT32·로드/스토어 유닛 | H100 SM당 SFU 16, LD/ST 32, 텍스처 유닛 4. 활성화 함수(exp)는 SFU가 처리 | NVIDIA H100 WP |
| registerfile | Register File | 레지스터 파일 | H100 전체 레지스터: 33,792 KB ≈ 865만 개. Volta 실측: 뱅크 2개, 64-bit 폭. 레지스터가 모자라면 느린 메모리로 밀려난다(스필) | NVIDIA H100 WP, Jia et al. 2018 |
| sram6t | 6T SRAM Cell | 6T SRAM 셀 | TSMC N5 고밀도 셀 0.021 μm²(약 145 × 145 nm). N3E도 같은 크기 — SRAM 축소가 멈췄다 | WikiChip N5, WikiChip IEDM2022 |
| bitline | Bitline / Wordline / Sense Amp | 비트라인·워드라인·센스앰프 | H100 L2 50 MB = 4.2억 비트 ≈ 셀 트랜지스터만 25억 개(추정) | WikiChip N5 |
| dram | DRAM Cell (1T1C) | DRAM 셀 | 64 ms = H100 클럭 1.27억 번. TSV 때문에 HBM 다이의 비트 밀도는 일반 DDR4의 약 절반 | SK hynix |
| logicgate | Logic Gate (CMOS) | 논리 게이트(CMOS) | N5 표준 셀 높이 210 nm(6트랙), 논리 밀도 약 1억 3,800만 트랜지스터/mm²(실측 기반) | Angstronomics |
| finfet | FinFET Transistor | 핀펫 트랜지스터 | "4 nm"는 어떤 실제 치수도 아니다(마케팅 세대명). 스위칭 한 번에 전자 약 1,000~3,000개(추정), 게이트 지연 수 ps | Angstronomics, SemiWiki IEDM2019 |
| gateoxide | Gate Oxide (High-k HfO₂) | 게이트 산화막 | SiO₂ 1.2 nm 이하에서 터널링 누설이 폭증해 Intel이 2007년 45 nm에서 high-k를 도입 — 누설 최대 1,000배 감소 | Intel 2007, SemiWiki IEDM2019 |
| beol | Interconnect (BEOL Metal Layers) | 배선층(BEOL) | 요즘은 트랜지스터보다 배선이 더 느리다(RC 지연). 첨단 칩 배선 총길이는 수십 km(미확인) | Angstronomics, WikiChip N5 |
| via | Via | 비아 | N5는 배선 저항 증가를 상쇄하려 비아 필러(via pillar)를 대량 사용 | WikiChip N5 |
| clock | Clock Cycle | 클럭 주기 | 한 클럭에 H100은 FP32 FMA 16,896개 + FP8 텐서 FMA 540,672개를 처리하고 HBM에서 약 1,692바이트를 받는다 | NVIDIA H100 WP, Luo et al. 2024 |
| latency | Memory Latency Hierarchy | 메모리 지연 계층 | L1 : L2 : HBM ≈ 1 : 6.5 : 13 (Luo et al.) | Luo et al. 2024 |
| kernel | Kernel / Grid / Block / Cluster | 커널·그리드·블록·클러스터 | 로봇 추론 1회 = 커널 수십~수백 개. 클러스터 최대 8블록(이식성)/16(옵트인) | CUDA Guide, NVIDIA Hopper blog |
| heat | Heat & Thermal Throttling | 열과 스로틀링 | H100 T.Limit: 목표 90 °C, 하드웨어 슬로다운 약 92 °C, 셧다운 약 97 °C | Pollack 1999, NVIDIA H100 WP |
| ecc | ECC & Cosmic Rays | ECC와 우주선 | Llama 3 학습(H100 16,384장, 54일) 중 정정 불가 HBM3 오류로 72회 중단 | Meta Llama 3, NVIDIA H100 WP |
| lattice | Silicon Crystal Lattice | 실리콘 결정 격자 | 핀 폭 6 nm = 원자 약 25층. 게이트 길이 18 nm = 격자 33개. GH100 다이 안 실리콘 원자 ≈ 3 × 10²² 개(추정) | Wikipedia, Ioffe NSM |
| electron | Electron & Band Gap | 전자와 밴드갭 | 트랜지스터 스위칭 에너지 약 0.05~0.15 fJ(추정). 생각의 속도보다 빠르고, 빛보다 훨씬 느리다 | Ioffe NSM, Wikipedia |
| tunneling | Quantum Tunneling | 양자 터널링 | 다음 세대(N2)는 채널을 4면에서 감싸는 GAA 나노시트로 대응 | SemiWiki IEDM2019, Intel 2007 |
| alphago | AlphaGo vs Lee Sedol (2016) | 알파고 대 이세돌 | 분산 알파고는 CPU 1,202개·GPU 176개를 썼다(Nature 2016). 이세돌은 2019년 은퇴하며 "AI는 이길 수 없는 존재"라고 말했다 | Silver et al. 2016 |
| deeplearning | Deep Learning & AlexNet (2012) | 딥러닝과 AlexNet | 2015년 ResNet은 152층 신경망으로 인간 수준(오차 3.57%)을 넘었다 | Krizhevsky 2012, He et al. 2015 |
| transformer | Transformer · Attention (2017) | 트랜스포머 · 어텐션 | 저자 8명. 기본 모델은 P100 GPU 8장으로 12시간, 큰 모델은 3.5일 학습했다 | Vaswani et al. 2017 |
| attention | Self-Attention · Q/K/V | 셀프 어텐션 · Q/K/V | 토큰 n개면 어텐션 계산은 n²으로 는다. 그래서 긴 문맥은 비싸다 | Vaswani et al. 2017 |
| gpt | GPT Lineage (2018–2020) | GPT 계보 | GPT-3는 V100 GPU 클러스터에서 학습됐고, 파라미터 1,750억 개는 32비트로 700 GB에 달한다 | Brown et al. 2020 |
| chatgpt | ChatGPT (Nov 30, 2022) | 챗GPT | GPT-4는 2023년 3월 공개. 이후 GPT-4o(2024), 추론 모델 o1·o3(2024~25)로 이어졌다 | OpenAI 2022, Ouyang et al. 2022 |
| rlhf | RLHF & Alignment | 인간 피드백 강화학습 · 정렬 | InstructGPT 논문(2022): 13억 모델이 RLHF 후 1,750억 GPT-3보다 선호됐다 | Ouyang et al. 2022, Bai et al. 2022 |
| claude | Claude · Anthropic | 클로드 · 앤트로픽 | Claude의 학습 원칙 "헌법"에는 UN 세계인권선언 조항도 들어 있다 | Anthropic, Bai et al. 2022 |
| scaling | Scaling Laws | 스케일링 법칙 | Llama 3.1 405B 학습: H100 16,384장, 15조 토큰 이상 | Kaplan et al. 2020, Hoffmann et al. 2022, Meta Llama 3 |
| opensource | Open Weights · Llama · DeepSeek | 오픈 가중치 · 라마 · 딥시크 | DeepSeek R1 공개 다음 날(2025-01-27) NVIDIA 시가총액이 하루 만에 약 6,000억 달러 줄었다 | DeepSeek 2025, Meta Llama 3 |
| reasoning | Reasoning Models & Agents | 추론 모델 · 에이전트 | 추론 모델은 답 하나에 수천~수만 토큰을 "생각"에 쓴다 | DeepSeek 2025 |
| airace | The LLM Race | LLM 경쟁 | xAI의 Colossus는 H100 10만 장을 122일 만에 세웠다고 발표했다(2024) | Meta Llama 3 |
| koreaai | Korea: HBM & AI | 한국의 HBM과 AI | H100 한 장에 HBM3 다이 48장이 들어간다. GPU 한 장이 팔릴 때마다 DRAM 다이 수십 장이 함께 팔린다 | SK hynix, NVIDIA H100 WP |
