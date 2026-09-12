# 02. 제조 공급망 리서치 — 모래에서 NVIDIA GPU까지 (Sand-to-GPU Supply Chain)

> 용도: 플레이어가 "공장 시찰" 챕터에서 원재료 → GPU 완제품까지 전 공급망을 스테이션 단위로 탐험하는 게임 설계용 팩트 시트.
> 원칙: 모든 수치는 출처 표기([S#] → 5장 출처 목록). 확인 못 한 값은 **(미확인)** 표기. 추정치는 **(추정)** 표기.
> 기준 제품: NVIDIA H100 SXM5 (GH100 다이, TSMC 4N, HBM3 5스택, CoWoS-S). 시스템 예시: DGX H100, GB200 NVL72, Jetson AGX Thor.
> 작성일: 2026-09-12. 한국어 본문 + 영어 용어 병기.

---

## 0. 한눈에 보는 체인 (Overview)

```
[a] 석영 채굴 (Quartz)      Spruce Pine, NC (USA)
      ↓
[b] 금속급 실리콘 (MG-Si)   아크로 ~2,000 °C, 98-99 %      중국 85 %, Elkem(노르웨이), Ferroglobe
      ↓
[c] 폴리실리콘 (Poly-Si)    지멘스 공정, 9N-11N              Wacker(독일), Hemlock(미국), Tokuyama(일본), OCI
      ↓
[d] 초크랄스키 잉곳 (CZ)    1,414 °C 용융, 300 mm, 100-300 kg  Shin-Etsu, SUMCO(일본), SK실트론, GlobalWafers, Siltronic
      ↓
[e] 웨이퍼 가공 (Wafering)  다이아몬드 와이어 쏘 → CMP, 775 µm
      ↓
[f] 팹 전공정 (FEOL)        TSMC Fab 18, 대만 타이난, N4/4N     ASML EUV(네덜란드) + Zeiss 광학(독일)
      ↓
[g] 후공정 배선 (BEOL)      구리 다마신, 다층 금속
      ↓
[h] 웨이퍼 테스트 (Sort)    프로브 카드, 수율, 비닝 (144 SM → 132 SM)
      ↓
[i] 다이싱 (Dicing)         레이저/블레이드 → 개별 다이
      ↓                                            [j] HBM (SK hynix 이천/청주, Samsung 평택, Micron 히로시마/타이중)
[k] CoWoS 패키징            TSMC AP 팹 (Zhunan AP6, Taichung AP5, Longtan AP3, Chiayi AP7)   ← 기판: Ibiden(일본), Unimicron(대만) / ABF: Ajinomoto
      ↓
[l] 최종 테스트 (Final Test) KYEC(대만), Advantest/Teradyne ATE, 번인
      ↓
[m] 보드 조립 (SXM5/HGX)    Foxconn(FII), Wistron
      ↓
[n] 시스템 통합             DGX H100 / GB200 NVL72 (Quanta, Wiwynn, Supermicro…) / Jetson AGX Thor
      ↓
[o] 재활용 / 수명 종료
```

---

## 1. 스테이션별 상세 (Stations)

각 스테이션 = 게임의 한 구역(Area). 형식: 이름 → 실제 장소/기업 → 무슨 일이 일어나나(쉬운 설명) → 핵심 수치 → 검증 가능한 재미있는 사실 → 연출 힌트.

### [a] 석영 채굴 · 고순도 석영 (Quartz / High-Purity Quartz, HPQ) — 석영 광산

- **실제 장소/기업**: 미국 노스캐롤라이나주 스프루스 파인(Spruce Pine, North Carolina). 운영사는 벨기에 Sibelco(제품명 IOTA)와 노르웨이/프랑스 합작 The Quartz Corp(Imerys + Norsk Mineral). [S1][S2][S3]
- **무슨 일이**: 이산화규소(SiO2) 결정인 석영을 노천 채굴 → 분쇄 → 부유선광(flotation) → 산세척(chemical leaching)으로 불순물을 걷어내 고순도 석영 모래(HPQ)를 만든다. 이 HPQ는 (1) 실리콘 원료(대부분은 일반 석영암), (2) **잉곳 성장용 석영 도가니(fused quartz crucible)** 재료로 쓰인다. 도가니용 순도가 특히 중요하다 — 도가니 불순물이 녹은 실리콘에 스며들기 때문. [S1][S3]
- **핵심 수치**:
  - 스프루스 파인 산지가 세계 태양광·반도체용 HPQ의 약 70-90 % 공급 (BloombergNEF 2024 추정 80 %). 연 18-20만 톤 (추정, 업계가 비밀스러워 정확치 없음). [S1][S3]
  - Sibelco: 2023-2025년 2억 달러 투자 → 이후 총 7억 달러 규모 확장(Expansion 1+2). [S2]
  - 지질: 약 3억 8천만 년 전 아프리카-북미 대륙 충돌로 생성된 페그마타이트 광상. [S3]
- **재미있는 사실**: 2008년 한 석영 공장 화재로 전 세계 HPQ 공급이 "거의 끊길 뻔"했고, 2024년 9월 허리케인 헐린(Helene) 홍수로 Sibelco·Quartz Corp 모두 조업을 중단해 반도체 업계에 비상이 걸렸다. [S1][S3] (단, "모든 칩이 스프루스 파인에 달렸다"는 과장 — 합성 석영·다른 광상도 부분 대체 가능. [S3])
- **연출 힌트**: 하얀 산비탈, 채굴 트럭, 분쇄기, 흰 모래 사일로. 안내판에 "IOTA" 로고.

### [b] 금속급 실리콘 (Metallurgical-Grade Silicon, MG-Si) — 아크로 제련소

- **실제 장소/기업**: 중국(세계 실리콘 금속의 약 85 %, USGS 2023 추정; Hoshine 등), 노르웨이 Elkem, 스페인/미국/프랑스 등의 Ferroglobe, 브라질 Rima. [S4][S5]
- **무슨 일이**: 석영(SiO2)과 탄소원(석탄, 코크스, 목재칩)을 **침지 아크로(submerged arc furnace, SAF)** 에 넣고 거대한 흑연 전극으로 전기 아크를 일으켜 환원한다. 화학식: SiO2 + 2C → Si + 2CO. 바닥에서 액체 실리콘을 뽑아(tapping) 식히면 "실리콘 금속" 덩어리가 된다. [S6]
- **핵심 수치**:
  - 온도: 약 1,300-2,000 °C (아크 중심은 더 뜨거움). [S6]
  - 순도: 98-99 % (Fe, Al, Ca 등 불순물 1-2 %). [S6][S7]
  - 에너지: 실리콘 1톤당 전력 10-13 MWh. 투입 에너지의 약 30 %만 실리콘에 남고 나머지는 배기가스·냉각수로 빠져나감. 배기가스 온도 500-700 °C. [S6]
  - 중국 2023년 실리콘 금속 생산 3.80 Mt, 생산능력 6.4 Mt/yr. [S5]
- **재미있는 사실**: 실리콘은 화학적으로 금속이 아니라 준금속(metalloid)인데, 광택이 있어서 업계에서는 "실리콘 메탈(silicon metal)"이라 부른다. [S6]
- **연출 힌트**: 어두운 공장, 주황색으로 달아오른 3개의 거대 전극, 불꽃 튀는 출탕구, 냉각 중인 은회색 잉곳 덩어리.

### [c] 폴리실리콘 (Polysilicon, 지멘스 공정 Siemens Process) — 초고순도 정제 공장

- **실제 장소/기업**: Wacker Chemie (독일 Burghausen, Nünchritz; 미국 Charleston, TN), Hemlock Semiconductor (미국 Hemlock, Michigan), Tokuyama (일본), OCI (한국/말레이시아), REC Silicon, GCL·Tongwei (중국, 주로 태양광용). 지멘스 공정은 1950년대 독일 Siemens와 Wacker가 개발. [S8][S9]
- **무슨 일이**: MG-Si 분말을 염화수소(HCl)와 반응시켜 **트리클로로실란(trichlorosilane, TCS, SiHCl3)** 액체를 만든다 → TCS의 끓는점이 31.8 °C로 낮아 높은 증류탑에서 여러 번 증류해 불순물을 제거 → 정제된 TCS와 수소를 벨자(bell jar) 반응기에 넣고, 전기로 **약 1,000-1,100 °C** 로 가열한 U자형 실리콘 심봉(seed rod)에 며칠 동안 실리콘을 증착(CVD)시킨다. 반응: 2 HSiCl3 → Si + 2 HCl + SiCl4. 굵어진 봉을 꺼내 잘게 부수고(청크), 반도체용은 추가 세정. [S8][S9]
- **핵심 수치**:
  - 순도: 전자급(EG-Si) 9N-11N (99.9999999 % ~ 99.999999999 %), 불순물 1 ppb 미만. 태양광급은 6N-8N. [S8]
  - 반응기 벽은 냉각해야 해서 에너지의 최대 90 %가 벽으로 낭비 → 매우 에너지 집약적. [S8]
  - 지멘스 공정이 전자급 폴리실리콘의 75-90 % 차지. [S8]
- **재미있는 사실**: 11N 순도란 실리콘 원자 1,000억 개 중 불순물 원자 1개 수준. Hemlock은 2012년 5.6만 톤까지 확장했다가 2014년 Clarksville 공장을 공급과잉으로 폐쇄했다. [S8]
- **연출 힌트**: 은빛 증류탑 숲, 벨자 반응기 창 너머 주황빛으로 달아오른 U자 봉, 흰 장갑으로 폴리실리콘 청크를 다루는 작업자.

### [d] 초크랄스키 결정 성장 (Czochralski, CZ Growth) — 잉곳 성장실

- **실제 장소/기업**: Shin-Etsu Chemical(신에츠, 일본; 300 mm 세계 1위), SUMCO(일본), GlobalWafers(대만), Siltronic(독일), SK Siltron(한국). 상위 5개사가 시장 90 % 이상, Shin-Etsu+SUMCO가 300 mm의 약 53-55 %. [S10][S11]
- **무슨 일이**: 폴리실리콘 청크 300-400 kg을 **석영 도가니(quartz crucible)** 에 담아 흑연 히터로 녹인다(실리콘 융점 **1,414 °C**, 실제 용융 온도는 약 1,420-1,425 °C). 원하는 결정 방향을 가진 연필 크기의 **시드 결정(seed crystal)** 을 융액에 살짝 담갔다가 아주 천천히 회전시키며 끌어올리면(도가니는 반대 방향 회전) 시드와 같은 결정 구조로 실리콘이 굳으며 따라 올라온다. 처음엔 빠르게 당겨 얇은 목(neck, 결정 결함 제거)을 만든 뒤 어깨(shoulder)를 벌리고 300 mm 직경 몸통을 유지. 융액에 붕소(boron, p형)나 인(phosphorus, n형) 같은 **도펀트(dopant)** 를 미량 넣어 전기적 특성을 조절. [S12][S13]
- **핵심 수치**:
  - 인상 속도: 300 mm 결정은 약 0.3-0.7 mm/min (200 mm는 0.5-1.0 mm/min). [S12]
  - 소요 시간: 24-72시간 (직경에 따라). [S13]
  - 결과물: 직경 300 mm, 길이 1-2 m, 무게 약 200-300 kg (문헌 예: 2 m, 265 kg). [S13][S14]
  - 도가니 내벽은 용융 실리콘에 시간당 약 10 µm씩 녹아 없어짐 → **도가니는 1회용**. [S13]
- **재미있는 사실**: 이 방법은 1916년 폴란드 화학자 얀 초크랄스키(Jan Czochralski)가 펜을 잉크병 대신 녹은 주석에 잘못 담갔다가 발견했다는 일화로 유명하다 (일화 자체는 널리 회자되나 세부는 (미확인)). 공정명은 확실히 그의 이름에서 왔다. [S13]
- **연출 힌트**: 은빛 원통형 CZ 풀러(puller) 수십 대가 늘어선 어두운 홀, 관찰창으로 보이는 주황색 융액과 천천히 회전하며 올라오는 은색 원통.

### [e] 잉곳 → 웨이퍼 (Ingot to Wafer, Wafering) — 웨이퍼 가공실

- **실제 장소/기업**: [d]와 동일 기업(Shin-Etsu, SUMCO 등)의 웨이퍼 공장.
- **무슨 일이**: (1) 잉곳 양 끝을 잘라내고 직경을 연마로 정확히 맞춤 → (2) **다이아몬드 와이어 쏘(diamond wire saw, multi-wire saw)** 로 수천 장을 한 번에 얇게 썰기(슬라이싱) → (3) **엣지 그라인딩(edge grinding/profiling)**: 가장자리를 둥글게(R 0.2-0.5 mm) 다듬어 깨짐 방지 → (4) **래핑(lapping)/양면 연삭(double-side grinding)**: 톱자국·손상층 제거, 두께·평행도 맞춤 → (5) **에칭(etching)**: 산 또는 알칼리로 표면 손상층 화학 제거 → (6) **CMP 폴리싱(chemical mechanical polishing)**: 거울 같은 무결함 표면 → (7) 세정, 검사 → (8) 필요 시 **에피택시(epitaxy)**: 표면에 완벽한 단결정 실리콘층을 추가로 성장. [S15][S16]
- **핵심 수치**:
  - 최종 두께: 300 mm 웨이퍼 **775 ± 25 µm** (SEMI 규격; 200 mm는 725 µm). 와이어 쏘 직후는 ~895 µm처럼 두껍게 잘라 이후 공정에서 깎아냄. [S15]
  - 래핑 약 25 µm/면 제거, 에칭 15-25 µm 제거 (특허 예시). [S15]
  - 평탄도: 표면 거칠기 Ra 5 nm 미만(연삭 단계) → CMP 후 원자 수준(서브 nm) 거칠기. [S16]
  - 한 잉곳에서 웨이퍼 약 수천 장(특허 예: 1만 장을 여러 잉곳에서). [S15]
- **재미있는 사실**: 300 mm 웨이퍼를 축구장 크기로 확대하면 표면 굴곡이 종이 한 장 두께보다 작아야 한다 (비유, 정확 수치 (미확인)). 웨이퍼 한 장 가격은 대략 100-200달러 수준 (미확인).
- **연출 힌트**: 와이어가 수백 가닥 팽팽히 걸린 쏘, 슬러리 안개, 회전하는 CMP 패드, 거울처럼 반사되는 웨이퍼를 든 로봇 팔.

### [f] 팹 전공정 (Fab Front-End-Of-Line, FEOL) — 클린룸 본관

- **실제 장소/기업**: **TSMC Fab 18** (대만 타이난 남부과학단지, Southern Taiwan Science Park). N5/N4 계열의 주력 EUV 기가팹. 3단계(Phase 1-3) 투자 약 NT$5,000억(≈170억 달러), 월 8-12만 장. 2020년 양산 개시. NVIDIA H100은 여기서 만드는 **TSMC 4N**(N4 기반 NVIDIA 커스텀) 공정. [S17][S18][S19]
- **무슨 일이**: 웨이퍼가 **FOUP**(25장 들이 밀폐 용기)에 담겨 천장 레일의 **OHT**(overhead hoist transport) 로봇으로 수백 대의 장비를 오가며, 아래 단위 공정을 **수백~1,000회 이상 반복**해 트랜지스터를 만든다. 마스크(레티클) 층수만 N5가 **81층** (EUV 없이는 115층이었을 것). [S17]
  1. **산화(oxidation)**: 고온로에서 SiO2 절연막 성장.
  2. **포토레지스트 도포(photoresist coating)**: 스핀 코터로 감광액을 얇게 회전 도포.
  3. **포토리소그래피(photolithography)**: 마스크 패턴을 웨이퍼에 축소 투영(4:1). DUV ArF 이머전(193 nm, 물 렌즈) + **EUV(13.5 nm)**. 미세 층은 EUV 1회 노광, 나머지는 DUV 다중 패터닝(SADP/SAQP). N5는 EUV 10-14층. [S17][S20]
  4. **현상(develop)** → **에칭(etching)**: 플라즈마/RIE(reactive ion etching)로 레지스트가 없는 부분을 깎음.
  5. **이온 주입(ion implantation)**: 붕소·인·비소 이온을 keV 에너지로 쏘아 박아 도핑.
  6. **어닐링(annealing)**: 스파이크 RTA로 약 1,000-1,200 °C까지 수 초 내 급가열·급냉해 도펀트 활성화, 손상 회복 (램프 150-300 °C/s). [S21]
  7. **증착(deposition)**: CVD(화학기상), ALD(원자층, 한 층씩), PVD(스퍼터링).
  8. **CMP**: 표면 평탄화.
  9. **세정(wet clean)**: 공정의 30-40 %가 세정 단계. 초순수·HF·SC-1/SC-2 등. [S22]
  10. **계측/검사(metrology/inspection)**: CD, 오버레이, 결함 검사.
- **FinFET 형성 (N5/N4는 FinFET)**: SADP/SAQP로 지느러미(fin) 패터닝 → 고종횡비 RIE 에칭 → STI 산화물 채움·리세스로 fin 노출 → 더미 폴리 게이트 형성 → 스페이서 → 소스/드레인 에피 성장(pMOS는 SiGe) + 도핑 → **게이트-라스트(gate-last) 교체 금속 게이트(replacement metal gate, RMG)**: 더미 게이트 제거 후 **high-k HfO2** 절연막 + TiN 등 일함수 금속을 ALD로 채움 → CMP. gate-last 덕분에 S/D 활성화 어닐(900 °C 이상)이 금속 게이트를 손상시키지 않는다. [S23]
- **TSMC N5/N4 사양**:
  - N5: 최소 금속 피치(M0) 28 nm, 게이트 피치 약 48 nm(추정), 트랜지스터 밀도 약 171 MTr/mm²(추정), 고밀도 SRAM 셀 0.021 µm², 7 nm 대비 1.84배 밀도, 15 % 속도 향상 또는 30 % 저전력. 고이동도 채널(SiGe pMOS). [S20][S24]
  - N4: N5의 최적화 노드("nodelet"). 셀 라이브러리 최적화 + 소폭 광학 축소, 마스크 수·공정 복잡도 감소 → N5보다 웨이퍼당 비용 낮음. [S19]
  - 4N: NVIDIA 전용 튜닝 버전, GH100 80억×10 = 800억 트랜지스터를 814 mm²에. [S25]
- **ASML EUV 장비 (TWINSCAN NXE:3600D)**: 네덜란드 Veldhoven ASML 조립, 광학은 독일 Carl Zeiss SMT(Oberkochen), 광원 드라이브 레이저는 독일 TRUMPF. [S26][S27]
  - 파장 13.5 nm, NA 0.33, 노광 필드 26 × 33 mm, 처리량 **160 WPH**(30 mJ/cm²), 오버레이 1.1 nm. 광원 출력 약 250 W급. [S26]
  - 광원: 지름 약 25-27 µm 주석(tin) 방울을 초당 **50,000개** 초속 70 m로 떨어뜨리고, CO2 레이저를 두 번(프리펄스로 납작하게 → 메인펄스로 증발) 쏴 플라즈마화. 플라즈마 온도는 태양 표면의 약 100배(≈50만 K). 드라이브 레이저는 수십 kW급(Cymer 250 W 소스 = 43 kW CO2 레이저). [S27][S28]
  - 거울: 렌즈 대신 몰리브덴/실리콘(Mo/Si) 초박막 40-50쌍(100층 이상, 각 수 nm)을 입힌 다층 거울. 거울 하나 반사율 약 70 %, 11회 반사하면 빛의 2 % 미만만 웨이퍼에 도달. 거울 표면 형상 오차는 "거울을 독일 크기로 확대해도 가장 높은 요철이 0.1 mm(Zeiss 공식) / 1 mm 미만(ASML 표현)". 거울 1개 제작에 수개월. [S29][S30]
  - 가격: 저-NA EUV 약 1.7억 유로(≈1.83억 달러), High-NA EXE 약 3.8억 달러. High-NA 장비는 150톤, 컨테이너 250개, 조립에 엔지니어 250명·6개월. [S31]
- **재미있는 사실**: 웨이퍼 한 장이 팹을 도는 동안 이동 거리는 수십 km에 달한다 (미확인). 1990년대 말 180 nm 칩은 마스크 25층·약 2개월이었는데, N5는 81층인데도 사이클타임 개선으로 "8개월 걸릴 것을" 약 3-4개월로 줄였다. [S17]
- **연출 힌트**: 끝없이 이어진 흰 복도, 천장 레일을 미끄러지는 OHT, 노란 조명의 리소 구역, 유리창 너머 EUV 장비(버스 크기).

### [g] 팹 후공정 배선 (Back-End-Of-Line, BEOL) — 배선층 구역

- **실제 장소/기업**: 같은 TSMC Fab 18 (FEOL과 같은 클린룸의 후반 공정). 장비: Applied Materials(PVD/CVD/CMP), Lam Research(에칭/ECD 도금), TEL 등 (미확인, 일반 지식).
- **무슨 일이**: 트랜지스터 위에 **구리 다마신(copper damascene)** 배선을 층층이 쌓아 수십억 개 트랜지스터를 연결한다. 순서: 저유전율(**low-k**) 절연막 증착 → 리소·에칭으로 트렌치(선)와 비아(via, 층간 구멍) 파기(듀얼 다마신) → 확산 방지 배리어(TaN) + **코발트(Co) 라이너/캡** 증착 → 구리 시드 PVD → 전해 도금(ECD)으로 구리 채움 → CMP로 넘친 구리 제거 → 다음 층 반복. 아래층은 가늘고 촘촘하게(M0 28 nm 피치), 위층은 굵고 성기게(전원·클럭). [S32]
- **핵심 수치**:
  - N5 최소 금속 피치 28 nm (N7 40 nm). TSMC는 코발트 라이너/캡을 16FF의 M1-M3 이후 매 세대 최소 피치 금속에 사용하며 N5는 M0-M4에 적용 (TechInsights 단면 기준). N5는 배선 저항 3배 증가를 상쇄하려 via pillar 를 대량 사용. [S32][S24]
  - 총 금속층 수: N5/N4급 로직은 대략 14-18층 옵션 (미확인 — TSMC 미공개, 업계 통상치). GH100의 정확한 층수 (미확인).
  - N3에서는 최소 피치 23 nm, "혁신적 Cu 라이너"로 RC 20-30 % 감소. 차세대는 루테늄(Ru) 라이너/배선 연구 중. [S33]
- **재미있는 사실**: 구리 배선은 1997년 IBM이 알루미늄을 대체하며 도입 — 그 전엔 구리가 실리콘을 오염시켜 "금기"였다 (일반 지식, 출처 미표기). 첨단 칩의 총 배선 길이는 수십 km에 달한다 (미확인).
- **연출 힌트**: 웨이퍼 단면 홀로그램 — 아래는 지느러미 트랜지스터, 위로 갈수록 굵어지는 15층 구리 고속도로.

### [h] 웨이퍼 테스트 · 수율 · 비닝 (Wafer Sort / Probe, Yield, Binning) — 프로브 스테이션

- **실제 장소/기업**: TSMC 팹 내 또는 OSAT(KYEC 등)에서 프로브 테스트. 프로브 카드는 FormFactor(미국), Technoprobe(이탈리아), MJC(일본) 등. [S34][S35]
- **무슨 일이**: 아직 자르지 않은 웨이퍼 위 각 다이에 **프로브 카드(probe card)** 의 바늘 수만 개를 동시에 접촉시켜 전기 신호를 넣고 응답을 읽는다("sort test"). 죽은 다이는 잉크/전자 맵에 표시. 살아 있는 다이도 결함 위치에 따라 일부 블록을 끄고(fusing) 하위 등급으로 판다 = **비닝(binning)**. [S34]
- **핵심 수치**:
  - 프로브 카드 접점 5만 개 이상, 간격 40 µm까지. MEMS 프로브는 10만 개 넘기도 하며 접촉을 위해 500 kg 이상의 하중이 필요. 수명은 수십만~수백만 회 터치다운. [S34][S35]
  - **GH100**: 풀 다이 **144 SM**, 8 GPC. H100 SXM5는 **132 SM**(CUDA 코어 16,896), H100 PCIe는 **114 SM**(14,592). 즉 최대 12개 SM에 결함이 있어도 SXM5로, 그 이상은 PCIe로 판다. 814 mm² 거대 다이는 무결함 다이가 드물어 처음부터 일부 비활성화를 전제로 설계. HBM도 6스택 중 5개만 활성(80 GB, 5,120-bit) — 6개 모두 켠 것이 H100 NVL(94 GB, 6,144-bit). [S25][S36][S37]
  - 수율 모델: Poisson 수율 = e^(−다이면적×결함밀도). 814 mm² = 8.14 cm², 결함밀도 0.1/cm² 가정 시 약 44 %, 0.07/cm² 시 약 57 % (추정). 대형 첨단 다이는 50 % 미만 흔함. [S38][S39]
- **재미있는 사실**: H100 공급 부족은 "실리콘 수율"이 아니라 "CoWoS 패키징 용량"이 원인이었다. 파운드리가 워낙 좋아져 풀-레티클 다이도 "합리적 수율"이 나온다. [S39]
- **연출 힌트**: 반투명 웨이퍼 맵에 초록/빨강 다이가 번쩍이는 화면, 미세 바늘이 내려앉는 확대 영상, "132/144 SM PASS" 표시.

### [i] 다이싱 · 다이 어태치 (Dicing, Die Attach) — 절단실

- **실제 장소/기업**: 다이싱 장비 DISCO(일본; 세계 최대), Stealth Dicing 레이저 엔진은 Hamamatsu Photonics(일본). 다이싱은 TSMC AP 팹 또는 OSAT(ASE, SPIL, Amkor). [S40]
- **무슨 일이**: 웨이퍼 뒷면을 얇게 갈고(back-grinding) UV 다이싱 테이프에 붙인 뒤 (1) **블레이드 다이싱**: 다이아몬드 블레이드로 스크라이브 라인(street)을 톱질(폭 50-80 µm), 또는 (2) **레이저 그루빙 + 블레이드**: low-k 층은 깨지기 쉬워 레이저로 먼저 홈을 판 뒤 블레이드, 또는 (3) **스텔스 다이싱(stealth dicing)**: 실리콘에 반투명한 파장의 레이저를 내부에 집속해 안쪽부터 미세 균열을 만들고 테이프를 늘려(tape expansion) 톡 떼어냄 — 먼지 없음, 스크라이브 폭 15 µm. 이후 **픽앤플레이스(pick-and-place)** 로봇이 다이를 하나씩 집어 캐리어/인터포저 위에 **다이 어태치(die attach)**. [S40][S41]
- **핵심 수치**: 스텔스 다이싱 street 폭 15 µm vs 블레이드 50-80 µm → 웨이퍼당 다이 수 증가. 테이프 열수축 200 °C 이상. [S40]
- **재미있는 사실**: GH100 같은 거대 다이는 웨이퍼 300 mm 하나에서 후보 다이가 60-65개 정도밖에 안 나온다(2장 참조).
- **연출 힌트**: 고속 회전 블레이드와 물줄기, 혹은 보이지 않는 레이저 후 테이프가 늘어나며 다이가 격자로 벌어지는 장면.

### [j] HBM 제조 (High Bandwidth Memory) — 메모리 타워 공장

- **실제 장소/기업**: **SK hynix** (한국 이천 = DRAM 본거지·패키징 P&T, 청주 M15X = HBM 전용 신팹(1b DRAM, 2026년 2월 가동, 최대 9만 장/월), 미국 인디애나 West Lafayette 패키징 예정), **Samsung** (평택 P4/P5, 2026년 2월 HBM4 양산 출하; 온양 HBM 공장 착공), **Micron** (일본 히로시마 Fab 15 = 전공정+TSV, 대만 타이중 AATT = 스태킹·테스트; 2028년 히로시마 신팹 96억 달러). 2025년 3분기 점유율 SK hynix 53 %, Samsung 35 %, Micron ~21 %(Counterpoint; 합계가 100 초과인 것은 조사 기관별 차이). [S42][S43][S44]
- **무슨 일이**: (1) DRAM 웨이퍼(1T1C 셀)를 일반 DRAM처럼 만들되, 다이 곳곳에 **TSV(through-silicon via)** 자리를 남긴다. (2) 깊은 구멍을 에칭하고 구리를 채워 TSV 형성. (3) 웨이퍼 앞면에 캐리어를 임시 접합(temporary bonding), 뒷면을 갈아(backside grinding) TSV가 드러날 때까지 얇게 → 12-Hi는 다이 하나가 약 **30 µm 급** (8-Hi 대비 40 % 얇게). (4) 마이크로범프(microbump) 형성. (5) **베이스 로직 다이(base die)** 위에 DRAM 다이 8장(8-Hi) 또는 12장(12-Hi)을 정렬해 쌓는다. SK hynix 방식은 **MR-MUF(Mass Reflow Molded UnderFill)**: 여러 칩을 올린 뒤 리플로우로 한 번에 접합하고 칩 사이 틈을 몰드 재료로 동시에 채움 → 필름(NCF)을 층마다 까는 방식보다 방열·휨(warpage) 제어 우수. 12-Hi용 Advanced MR-MUF는 TC(thermo-compression) 본딩 병용, 신형 EMC로 방열 1.6배. (6) KGSD(known good stack die) 테스트. [S45][S46][S47]
- **핵심 수치**:
  - 인터페이스: 스택당 **1,024-bit** (16채널 × 64-bit, HBM3는 채널당 2개 32-bit 의사채널). HBM3 스택당 최대 819 GB/s. [S48]
  - HBM3 12-Hi 24 GB (16 Gb 다이 12장), HBM3E 12-Hi 36 GB (3 GB 다이 12장, 9.6 Gbps). [S46][S47]
  - 스택 높이 규격: HBM3 이하 720 µm, 신세대 775 µm(JEDEC). 16-Hi는 다이당 20 µm까지 얇아져야 함. [S48][S49]
  - TSV: 다이당 수천 개(SK hynix HBM3 8,000개 이상 추정; 미국 수출규제 기준은 3,000개 초과), 직경 5-10 µm(2차 자료). HBM4는 2만 개 이상. 마이크로범프 피치 약 40 µm → HBM3E 20-30 µm → HBM4 10 µm 급. [S49][S50]
  - TSV 때문에 HBM 다이 비트 밀도는 같은 세대 DDR4의 약 절반(0.16 vs 0.296 Gb/mm²). 이것이 일반 DRAM 라인을 HBM으로 전환할 때 병목. [S50]
- **재미있는 사실**: H100 한 개에 HBM3 다이가 8-Hi × 6스택 = 48장(+베이스 6장) 들어가는데, GPU 다이 1장보다 실리콘 면적이 훨씬 크다. HBM4부터 베이스 다이는 TSMC 로직 공정(N5/N3)으로 외주. [S45]
- **연출 힌트**: 현미경 뷰로 12층 다이가 한 층씩 내려앉는 애니메이션, 몰드 수지가 틈을 채우는 컷, "12-Hi 36 GB PASS".

### [k] CoWoS 패키징 (Chip-on-Wafer-on-Substrate, 2.5D) — 어드밴스드 패키징 팹

- **실제 장소/기업**: TSMC 어드밴스드 백엔드(AP) 팹 — **AP6 Zhunan(竹南, 苗栗; CoWoS·SoIC·InFO 통합 허브, 2024년 말 풀가동)**, **AP5 Taichung**, **AP3 Longtan(龍潭, 桃園; 주로 InFO/WMCM, 애플)**, **AP7 Chiayi(嘉義; 2025-12 개소, 세계 최대 예정)**, AP8 Tainan(구 디스플레이 공장 전환), AP1 Hsinchu. OSAT 협력: ASE/SPIL, Amkor. 기판: **Ibiden**(일본 오가키, NVIDIA용 고급 기판 사실상 독점 수주), **Unimicron**(대만), Shinko, AT&S, Kinsus, Nan Ya PCB. ABF 필름: **Ajinomoto**(일본, 점유율 약 95 %). [S51][S52][S53]
- **무슨 일이** (CoWoS-S 기준, H100):
  1. **인터포저(interposer)** 웨이퍼: 실리콘 웨이퍼에 TSV와 미세 배선(RDL)을 만든 "칩 밑의 칩". 트랜지스터는 없고 배선만.
  2. **Chip-on-Wafer**: GPU 다이와 HBM 스택을 인터포저 웨이퍼 위에 **마이크로범프(microbump, 피치 약 40 µm)** 로 플립칩 접합. 언더필.
  3. 인터포저 웨이퍼 뒷면 연마 → TSV 노출 → **C4 범프(controlled collapse chip connection, 피치 약 130 µm)** 형성 → 인터포저를 개별 조각으로 절단.
  4. **on-Substrate**: 인터포저 조각을 **ABF 유기 기판(organic substrate)** 에 C4 플립칩 접합 + 언더필(underfill). 기판은 코어 양면에 ABF 필름 라미네이트 → 레이저 비아 → 구리 도금을 15회 이상 반복한 빌드업 기판(AI용은 100 × 100 mm 초과).
  5. 스티프너/리드(lid, heat spreader) 부착, 기판 밑에 BGA 볼(피치 ~1.0 mm) 또는 LGA 패드.
  - **CoWoS-L**(Blackwell B200): 거대 실리콘 인터포저 대신 LSI(local silicon interconnect) 브리지 다이 + RDL 인터포저. 브리지 배치 정밀도가 극히 중요. **CoWoS-R**: RDL만. [S54][S55]
- **핵심 수치**:
  - **레티클 한계(reticle limit)** 26 × 33 mm = **858 mm²** (TSMC 실사용 ~830 mm²). GH100 814 mm²는 거의 한계. CoWoS-S 인터포저는 스티칭으로 최대 3.3× 레티클(~2,700-2,831 mm²). CoWoS-L 3.5× 양산(2024), 5.5×(4,719 mm², HBM 12스택, 기판 100 × 100 mm) → 2027년 9.5×, 2029년 14× 이상. High-NA EUV에서는 레티클이 반으로(26 × 16.5 mm = 429 mm²). [S51][S56][S57]
  - 스택: 다이 → 마이크로범프(~40 µm) → 인터포저 → C4(~130 µm) → ABF 기판 → BGA(~1.0 mm) → 보드. [S54]
  - 비용: CoWoS-S 패키지 약 750달러, CoWoS-L 1,100-1,500달러 (인터포저가 패키징 비용의 50-70 %) (분석가 추정). [S58]
  - 용량: 2024년 CoWoS 수요 약 37만 장 → 2025년 67만 장 → 2026년 약 100만 장. 월 7.5-8만 장(2025 말) → 12-13만 장(2026 말 목표). NVIDIA가 약 60 % 선점. 리드타임 52-78주. [S58][S59]
- **재미있는 사실**: 반도체 기판 절연 필름 ABF(Ajinomoto Build-up Film)는 조미료(MSG) 회사 아지노모토가 1970년대 아미노산 화학→에폭시 연구에서 개발, 1999년 대형 반도체사에 첫 채택. 전자재료 부문이 매출 6 %로 그룹 이익 30 %, 영업이익률 50 % 이상. [S53]
- **연출 힌트**: 웨이퍼 위에 GPU 다이 1개 + HBM 6개가 내려앉는 거대 "타일 맞추기" 장면, 리드가 덮이는 순간, "CoWoS 대기열 52주" 전광판.

### [l] 최종 테스트 · 번인 · 스피드 비닝 (Final Test, Burn-in, Speed Binning) — 테스트 하우스

- **실제 장소/기업**: **KYEC(King Yuan Electronics, 대만 苗栗)** — NVIDIA AI 칩 테스트의 90 % 이상 담당(분석가 추정). ATE 장비: **Advantest**(일본; V93000, T2000 — HBM/CoWoS 테스트 강세), **Teradyne**(미국; UltraFlex, J750). 번인 오븐: KYEC 자체 제작 등. [S60][S61]
- **무슨 일이**: 패키징된 GPU를 소켓에 꽂고 (1) **최종 테스트(final test, FT)**: ATE로 전 기능·전력·속도 검사, (2) **번인(burn-in)**: 고온(접합부 125 °C 이상)·고전압에서 수 시간 가동해 초기 불량(infant mortality) 걸러내기, (3) **스피드 비닝(speed binning)**: 각 칩의 공정 편차를 재는 온칩 회로 값("Speedo")을 FT 단계에서 칩에 기록 — 느린 칩은 전압을 높이고 빠른 칩은 낮춰 동일 성능·다른 효율로 출하, (4) **시스템 레벨 테스트(SLT)**: 실제 보드/OS 환경에서 워크로드 실행. [S60][S62]
- **핵심 수치**: 번인 불량률 3-8 %, 총 제조 감모 15-25 %, 현장 연간 고장률 ~9 % (분석가 추정, NVIDIA 공식 아님). KYEC는 H100(700 W)용 600 W급 번인 오븐을 Blackwell용 1 kW급으로 교체. [S60]
- **재미있는 사실**: 다이의 "속도 등급"은 눈으로 안 보이고 퓨즈에 구워진 숫자로만 존재 — 같은 H100인데 칩마다 동작 전압이 조금씩 다르다. [S62]
- **연출 힌트**: 수백 개 소켓이 줄지어 뜨겁게 달아오른 번인 오븐, 테스트 로그가 폭포처럼 흐르는 모니터.

### [m] 보드 조립 (Board Assembly: SXM5 모듈 / PCIe 카드 / HGX 베이스보드) — SMT 라인

- **실제 장소/기업**: TSMC에서 나온 GPU 패키지를 **FII(Foxconn Industrial Internet)** 와 **Wistron** 이 받아 SXM5 모듈·**HGX UBB(universal baseboard)**·Bianca 보드(GB200)로 조립 → NVIDIA에 되판다 → NVIDIA가 ODM에 판매. 서버 시장 점유율 Foxconn 약 43 %, Quanta 약 17 %. 미국향 서버 조립의 상당 부분은 멕시코. [S63][S64]
- **무슨 일이**: (1) 다층 PCB(고속 NVLink 112G PAM4용 초저손실 소재, 임피던스 정밀 제어)에 솔더 페이스트 인쇄 → (2) **SMT 픽앤플레이스**: 칩 슈터가 시간당 수만~10만+ 개 부품 배치 → (3) **리플로우(reflow)**: 무연 SAC305 솔더, 예열 150-200 °C 소크 → 피크 235-250 °C(BGA 상부 최대 245-260 °C), 217 °C 이상 40-90초 → (4) GPU 패키지(BGA) 실장, X-ray 검사 → (5) 히트싱크/베이퍼챔버 장착, 기능 테스트. [S65][S66]
- **핵심 수치 (H100 SXM5)**:
  - TDP **700 W** (PCIe 350 W, NVL 400 W). [S25]
  - VRM: 인덕터 29개 × 파워 스테이지 2개 + 인덕터 3개 × 1개 ≈ **61개 파워 스테이지**, 금속 셸 인덕터. 커넥터는 짧은/긴 메자닌 2개(전원 평면과 NVLink 평면 분리). [S67]
  - HGX H100 8-GPU 베이스보드: 무게 24 kg, 통상 전력 5,600 W, NVSwitch 3세대 4개, GPU간 900 GB/s, 총 7.2 TB/s. [S68]
  - PCB 층수: NVIDIA 미공개 (미확인).
- **재미있는 사실**: SXM5 모듈에는 팬이 없다 — 방열은 전부 섀시 히트싱크/수냉 콜드플레이트에 의존. [S67]
- **연출 힌트**: 리플로우 오븐 터널을 지나는 컨베이어, 초고속으로 부품을 찍는 픽앤플레이스 헤드, 보드 위 은색 인덕터 군단.

### [n] 시스템 통합 (System Integration) — 데이터센터 & 엣지

- **DGX H100** (NVIDIA 자체 브랜드 서버, ODM 제조): H100 SXM5 ×8 (640 GB HBM3), NVSwitch ×4, GPU간 900 GB/s, 총 7.2 TB/s, Xeon Platinum 8480C ×2(112코어), 2 TB RAM, 30 TB NVMe, ConnectX-7 400 Gb/s ×10. **8U, 최대 130.45 kg(287.6 lb), 최대 10.2 kW**, FP8 32 PFLOPS(sparsity). [S69]
- **HGX H100**: ODM(Foxconn, Inventec, Quanta, Wistron 등 2017년 HGX 파트너 프로그램; 이후 Wiwynn, Supermicro, Dell, HPE)이 자체 서버에 넣는 8-GPU 베이스보드. [S64][S68]
- **GB200 NVL72** (Blackwell 랙): GB200 슈퍼칩 36개(Grace CPU 1 + B200 GPU 2) = **GPU 72 + CPU 36**, 1U 컴퓨트 트레이 18개(각 Bianca 보드 2장) + NVLink 스위치 트레이 9개(NVSwitch 5세대 ×2, 28.8 Tb/s), 버스바 전원, **전량 수냉(cold plate + CDU)**. 랙당 약 **120 kW**, 무게 약 1.36 t(3rd-party), FP4 1.44 EFLOPS, HBM 13.4 TB, NVLink 130 TB/s. 인로우 CDU 1.3 MW/8랙. 공랭 H100 랙 ~40 kW와 비교. 120 kW 랙을 못 받는 데이터센터용으로 NVL36×2 형태 존재. [S70][S71]
- **엣지: Jetson AGX Thor** (로봇용 모듈, Jetson T5000): Blackwell GPU 2,560 CUDA + 96 Tensor 코어, **FP4 2,070 TFLOPS(sparse)**, FP8 1,035 TFLOPS(dense), Arm Neoverse V3AE 14코어, **128 GB LPDDR5X** 273 GB/s, **40-130 W**, 4× 25GbE, 카메라 20대+. Orin 대비 AI 7.5배·전력효율 3.5배. 개발자 키트 3,499달러. 휴머노이드(GR00T N1.5 VLA 모델) 타깃. [S72][S73]
- **연출 힌트**: 데이터센터 — 파란 LED, 굵은 냉각수 배관, 랙 뒤 버스바; 엣지 — 손바닥 크기 모듈이 휴머노이드 가슴에 들어가는 컷.

### [o] 재활용 · 수명 종료 (Recycling / End-of-Life) — 리사이클 야드 (간략)

- **실제**: 데이터센터 GPU는 고장보다 "더 빠른 칩 등장"으로 **2-5년** 주기 교체. 처리 순서: 사내 재배치 → 데이터 삭제 후 중고 판매(원가의 10-20 % 회수; ITAD 인증 R2v3/e-Stewards/NAID AAA) → 부품 회수 → 스크랩. 생성형 AI가 연간 e-waste를 120-500만 톤 추가할 수 있다는 Nature 연구. 2022년 세계 e-waste 6,200만 톤 중 22 %만 정식 수거·재활용. [S74][S75]
- **금속 회수**: PCB에는 금·은·팔라듐·구리(가치의 96 %). 폐전자제품의 귀금속 농도는 광석의 최대 50배. 고품위 스크랩 금 400 ppm 이상. 방법: 건식(구리 제련에 넣어 귀금속을 구리에 흡수), 습식(왕수/염산 침출), 신공정(티오황산염, 요오드, 박테리아). [S75][S76]
- **팹 내부 재활용**: 테스트/모니터 웨이퍼는 막을 벗기고 재연마해 재사용(reclaim; 신품 대비 60-90 % 저렴, 디바이스용은 불가). TSMC 공정수 재활용률 2023년 90.3 %. [S77][S22]
- **연출 힌트**: 산더미 같은 옛 GPU, 분쇄기, 금 회수 전해조; "이 칩은 4년 전 슈퍼컴퓨터였다".

---

## 2. 타임라인 & 비용 (Timeline & Cost)

### 2.1 소요 시간 (모래 → 출하 GPU)

| 단계 | 소요 | 근거 |
|---|---|---|
| 석영 채굴·정제 → MG-Si → 폴리실리콘 | 수 주 (지멘스 증착 자체는 "며칠") | [S8] |
| CZ 잉곳 성장 | 24-72시간 | [S13] |
| 웨이퍼 가공 (슬라이스~폴리싱) | 수 일~수 주 (미확인) | — |
| **팹 사이클 (FEOL+BEOL, N5/N4)** | **약 3-4개월** (사이클타임 개선 전이라면 "8개월") | [S17] |
| 웨이퍼 테스트, 다이싱 | 수 일 | — |
| HBM (DRAM 웨이퍼 → 스택 → KGSD) | 별도 병렬; HBM4는 웨이퍼→패키징 6개월 초과 보고 | [S78] |
| **CoWoS 패키징 + 최종 테스트** | 수 주; Epoch AI 모델: 로직 다이 팹아웃은 출하 16주 전, CoWoS는 출하 8주 전 | [S79] |
| 보드·시스템 조립 | 수 주 | — |
| **합계 (웨이퍼 투입 → 출하)** | **약 6-7개월** (Rubin 3 nm 기준 6-7개월 제조 사이클 보도) | [S78][S79] |
| 고객 주문 리드타임 (참고) | 36-52주; CoWoS 예약 52-78주 | [S59] |

- 정리: "팹 약 3개월 + 후공정(HBM 병합·CoWoS·테스트·보드) 약 3개월 ≈ 6개월"은 업계 보도·Epoch AI 모델과 일치. Jensen Huang의 직접 인용 수치는 (미확인).

### 2.2 비용

| 항목 | 값 | 근거 |
|---|---|---|
| TSMC N4/N5 웨이퍼 (300 mm) | 2024년 약 **18,000달러** → 2025년 약 **20,000달러**(10 % 인상, Morgan Stanley 노트) / 분석가 평균 18,500달러. 16,000달러는 2021-23년 인상 전 수준. (비공식 출처) | [S80][S81] |
| N3 웨이퍼 | 약 18,000-20,000달러 | [S81] |
| 2 nm / 1.4 nm 웨이퍼 (전망) | 25,000 / 45,000달러 | [S81] |
| **GH100 후보 다이 수 / 300 mm 웨이퍼** | 다이 814 mm²(≈28.5 × 28.5 mm) 가정, 표준 공식 π(d/2)²/A − πd/√(2A): d=300 → 약 64개, 3 mm 엣지 제외(d=294) → 약 61개 ⇒ **약 60-65개** (추정). 엣지 손실 무시 시 72개(arXiv 비교표). | [S38][S82] |
| 양품 다이 (수율 44-57 % 가정) | 약 27-37개 (추정) | 2.1 계산 |
| 다이당 웨이퍼 원가 | 18,000-20,000 ÷ ~30 ≈ **600-700달러** (추정, 수율·엣지 가정에 민감) | — |
| CoWoS-S 패키징 | ~750달러 (추정) | [S58] |
| HBM3 80 GB | (미확인; 수백~1,000달러대 추정치 다수) | — |
| H100 제조원가 총합 (3rd-party 추정) | 약 3,320달러 | [S83] |
| **H100 판매가** | **25,000-40,000달러** (PCIe 25-30k, SXM5 35-40k; 2023년 말 2차 시장 최고 40-50k). NVIDIA는 공식 가격표 미공개. | [S83][S84] |
| 저-NA EUV 장비 | ≈1.7억 유로(≈1.83억 달러) | [S31] |
| High-NA EUV (EXE:5000/5200) | ≈3.8억 달러; Hyper-NA 7억 달러+ 전망 | [S31] |
| 첨단 팹 1개 | "200억 달러"가 통설; 2 nm급 모듈(2만 장/월) 250-350억 달러; TSMC 애리조나 첫 3개 팹 650억 달러(≈220억/팹), 전체 1,650억 달러. Fab 18 3단계 ≈170억 달러. | [S85][S86][S18] |
| DGX H100 | 시스템 가격 (미확인; 통상 30-40만 달러대 보도) | — |
| Jetson AGX Thor 개발자 키트 | 3,499달러 | [S73] |

---

## 3. 클린룸 & 팹 분위기 팩트 (Cleanroom Atmosphere)

- **입자 규격 (ISO 14644-1)**: ISO 1 = 0.1 µm 이상 입자 ≤ 10개/m³; ISO 3 ≤ 1,000개/m³; ISO 4 ≤ 10,000; ISO 5 ≤ 100,000. 바깥 공기는 0.5 µm 기준 약 3,500만 개/m³. 리소 구역은 ISO 3-4(또는 미니환경 ISO 1급). [S87][S88]
- **환기**: ISO 1급은 시간당 500-750회 이상 공기 교체, 풍속 0.3-0.46 m/s, ULPA 필터(0.12 µm 99.9995 %). 구역별로 리소 400 ACH, 조립 240 ACH 식으로 차등. 위에서 아래로 층류(laminar flow), 바닥은 구멍 뚫린 그레이팅. [S87][S88]
- **노란 조명 (yellow room)**: 포토레지스트가 청색·자외선에 감광하므로 리소 구역은 UV를 걸러낸 노란/앰버 조명 사용. 여기가 "팹의 심장". [S88]
- **왜 입자가 치명적인가**: 3 nm 노드에서 100 nm 입자는 게이트 구조의 약 33배 크기 — 입자 하나 = 수율 손실 이벤트. [S88]
- **버니 수트(bunny suit)**: 사람이 최대 오염원(피부 각질, 머리카락, 화장품). 전신 복장 + 마스크 + 장갑 + 부츠, 에어샤워 통과. (일반 지식)
- **진동**: 리소 장비는 nm 정밀도라 천장 FFU 모터 진동조차 문제. 클린룸 천장 그리드는 건물 골조와 구조적으로 분리, 배관 관통부에 유연 조인트, 냉수 배관에 관성 베이스. Zeiss 예나 공장은 진동 규격을 위해 콘크리트 14,600 m³를 10일간 끊김 없이 타설(2차 자료). [S88][S30]
- **초순수(UPW)**: 팹 물 사용의 약 3/4이 공정용이며 대부분 UPW. UPW 1,000갤런 만드는 데 시수 1,400-1,600갤런. 평균 팹 하루 UPW 1,000만 갤런(≈3,800만 L) = 미국 3.3만 가구 사용량. TSMC 타이난 팹들(Fab 14+18) 2019년 하루 5,000만 L. TSMC 2023년 연간 1,010억 L, 공정수 재활용률 90.3 %. 2021년 대만 가뭄 때 물 트럭 동원. [S22][S89]
- **화학물질**: 불산(HF, 산화막 제거·세정), 황산/과산화수소(피라냐), 암모니아(SC-1), 염산(SC-2), TMAH 현상액, 실란·포스핀·아르신 같은 독성 가스(CVD/임플란트), NF3·CF4 등 에칭 가스. 공정 단계의 30-40 %가 세정. [S22] (개별 화학물 용도는 일반 지식)
- **24/7 & 자동화**: 팹은 연중무휴 가동. 300 mm 팹은 FOUP(25장, 만재 시 ~9 kg, 420 × 335 × 335 mm, RFID 태그)를 사람이 들지 않고 천장 레일 OHT 차량 수백 대(대형 팹은 그 이상)가 운반, 스토커에 보관. Daifuku·Murata가 주요 AMHS 공급사(TSMC 애리조나도 Daifuku). 첨단 팹은 "플로어에 사람 거의 없음". [S90]
- **EUV 장비 내부는 진공**: 13.5 nm 빛은 공기에도 흡수되므로 전체 광학계가 진공 챔버. 수소 가스로 주석 오염 세척. [S27]
- **팹 규모**: Fab 18 월 8-12만 장, 3단계 투자 ≈170억 달러. [S18]

---

## 4. 용어집 (Glossary, 55+ terms)

| EN | KO | 쉬운 한국어 설명 | Plain English |
|---|---|---|---|
| Silica / Quartz (SiO2) | 실리카 / 석영 | 모래·수정의 주성분. 실리콘의 원료 | The mineral (silicon dioxide) that sand and crystal are made of; raw source of silicon |
| High-purity quartz (HPQ) | 고순도 석영 | 불순물을 극도로 줄인 석영. 도가니·루츠보 원료 | Ultra-clean quartz used for crucibles that hold molten silicon |
| Metallurgical-grade silicon (MG-Si) | 금속급 실리콘 | 아크로에서 만든 98-99 % 실리콘 덩어리 | First-stage 98-99 % pure silicon from an arc furnace |
| Polysilicon | 폴리실리콘 | 작은 결정 알갱이가 뭉친 초고순도 실리콘(9N-11N) | Ultra-pure silicon made of many small crystals; feedstock for ingots |
| Trichlorosilane (TCS) | 트리클로로실란 | 실리콘을 정제하기 위해 만드는 액체 화합물(SiHCl3) | Volatile liquid used to purify silicon by distillation |
| Siemens process | 지멘스 공정 | 뜨거운 실리콘 봉에 TCS 가스를 분해시켜 실리콘을 입히는 정제법 | Method of depositing pure silicon onto hot rods from gas |
| Czochralski (CZ) | 초크랄스키법 | 녹은 실리콘에서 씨앗 결정을 천천히 뽑아 올려 하나의 큰 결정을 만드는 방법 | Pulling a single crystal from molten silicon with a seed |
| Seed crystal | 시드 결정 | 잉곳 결정 방향을 정해주는 연필 크기 실리콘 조각 | Small crystal that sets the orientation of the whole ingot |
| Ingot (boule) | 잉곳 | 지름 300 mm, 길이 1-2 m, 무게 200-300 kg의 실리콘 단결정 원통 | The big cylindrical single crystal of silicon |
| Crucible | 도가니 | 녹은 실리콘을 담는 석영 그릇. 1회용 | Quartz bowl that holds the melt; used once |
| Dopant | 도펀트 | 실리콘에 아주 조금 넣어 전기 성질을 바꾸는 원소(붕소, 인, 비소) | Trace element added to control electrical behavior (boron, phosphorus, arsenic) |
| Wafer | 웨이퍼 | 잉곳을 얇게(775 µm) 썬 원판. 칩의 바탕 | Thin round slice of silicon on which chips are built |
| Lapping / Grinding | 래핑 / 연삭 | 웨이퍼 양면을 갈아 두께와 평행도를 맞추는 것 | Abrasive flattening of the wafer surfaces |
| CMP (chemical mechanical polishing) | 화학기계연마 | 약품과 연마패드로 표면을 원자 수준으로 평평하게 | Polishing with slurry and pad to atomic-scale flatness |
| Epitaxy (epi) | 에피택시 | 웨이퍼 위에 완벽한 결정층을 한 층 더 키우는 것 | Growing an extra perfect crystal layer on the wafer |
| Fab | 팹 | 반도체 제조 공장 | Semiconductor fabrication plant |
| Cleanroom / ISO class | 클린룸 / ISO 등급 | 먼지를 극단적으로 줄인 방. ISO 1이 가장 깨끗(0.1 µm 입자 ≤10개/m³) | Dust-controlled room; ISO 1 is cleanest |
| Bunny suit | 버니 수트 | 작업자 몸에서 나오는 먼지를 막는 전신 복장 | Full-body cleanroom garment |
| FOUP | 풉 | 웨이퍼 25장을 담는 밀폐 운반 상자 | Sealed pod carrying 25 wafers |
| OHT (overhead hoist transport) | 천장 이송 시스템 | 천장 레일을 달리며 FOUP을 나르는 로봇 차량 | Ceiling-rail robot vehicles that move FOUPs |
| Ultrapure water (UPW) | 초순수 | 이온·입자·유기물을 거의 다 제거한 물. 세정용 | Water purified far beyond drinking standards, used for rinsing |
| FEOL (front-end-of-line) | 전공정 | 트랜지스터를 만드는 앞 단계 공정 | Fab steps that build transistors |
| BEOL (back-end-of-line) | 후공정(배선) | 트랜지스터 위에 금속 배선을 쌓는 뒷 단계 | Fab steps that wire transistors together with metal |
| Oxidation | 산화 | 고온로에서 실리콘 표면에 산화막(유리)을 키움 | Growing an insulating oxide layer in a furnace |
| Photoresist | 포토레지스트(감광액) | 빛을 받으면 성질이 바뀌는 액체 막. 패턴 전사용 | Light-sensitive coating used to transfer patterns |
| Mask / Reticle | 마스크 / 레티클 | 회로 패턴이 그려진 석영 판. 4:1로 축소 투영 | Quartz plate with the circuit pattern; projected 4× smaller |
| Photolithography | 포토리소그래피 | 빛으로 마스크 패턴을 웨이퍼에 찍는 것 | Printing circuit patterns with light |
| DUV (deep ultraviolet) | 심자외선 | 193 nm ArF 레이저 리소그래피 | 193 nm laser lithography |
| Immersion lithography | 이머전(액침) 리소그래피 | 렌즈와 웨이퍼 사이에 물을 채워 해상도를 높이는 DUV | DUV with water between lens and wafer for sharper images |
| EUV (extreme ultraviolet) | 극자외선 | 13.5 nm 파장. 주석 플라즈마 광원 + 거울 광학. 진공 | 13.5 nm light from tin plasma, mirror optics, in vacuum |
| Stepper / Scanner | 스테퍼 / 스캐너 | 웨이퍼를 한 필드씩 움직이며 노광하는 장비 | Tool that exposes the wafer one field at a time |
| Multi-patterning (SADP/SAQP) | 다중 패터닝 | 한 번에 못 그리는 촘촘한 선을 여러 번 나눠 그리는 기법 | Splitting a dense pattern into multiple exposures/spacers |
| Overlay | 오버레이 | 층과 층이 얼마나 정확히 겹치는가(nm) | Layer-to-layer alignment accuracy |
| CD (critical dimension) | 임계 치수 | 패턴의 가장 작은 선폭 | The smallest feature width |
| Etch (RIE / plasma) | 에칭(식각) | 플라즈마로 원하지 않는 부분을 깎아냄 | Removing material with reactive plasma |
| Plasma | 플라즈마 | 전기로 이온화된 기체. 에칭·증착에 사용 | Electrically ionized gas used for etch/deposition |
| Ion implantation | 이온 주입 | 도펀트 이온을 가속해 웨이퍼에 박아 넣음 | Shooting dopant ions into silicon |
| Anneal (RTA, spike) | 어닐링(열처리) | 수 초 1,000 °C 이상으로 급가열해 도펀트 활성화 | Brief high-temperature heating to activate dopants |
| CVD | 화학기상증착 | 가스 반응으로 박막을 입힘 | Depositing a film from reacting gases |
| ALD | 원자층증착 | 한 번에 원자 한 층씩 입히는 극정밀 증착 | Deposition one atomic layer at a time |
| PVD (sputtering) | 물리기상증착 | 금속 타깃을 때려 튀어나온 원자로 막을 입힘 | Depositing metal by knocking atoms off a target |
| FinFET | 핀펫 | 지느러미(fin) 모양 채널을 게이트가 3면에서 감싸는 트랜지스터 | Transistor whose channel is a fin wrapped by the gate on 3 sides |
| GAA nanosheet | 게이트올어라운드 나노시트 | 채널을 게이트가 4면 모두 감싸는 차세대 트랜지스터(N2) | Next-gen transistor with gate on all 4 sides of stacked sheets |
| High-k metal gate (HKMG) | 하이케이 메탈 게이트 | 유전율 높은 HfO2 절연막 + 금속 게이트 | HfO2 insulator plus metal gate for less leakage |
| Gate-last (RMG) | 게이트 라스트(교체 금속 게이트) | 가짜 게이트로 먼저 만들고 나중에 진짜 금속 게이트로 교체 | Build with a dummy gate, swap in metal gate at the end |
| Damascene | 다마신 | 홈을 파고 구리를 채운 뒤 CMP로 깎는 배선법 | Trench-fill-polish method for copper wiring |
| Via | 비아 | 층과 층을 잇는 수직 구멍 배선 | Vertical hole connecting wiring layers |
| Interconnect | 인터커넥트(배선) | 트랜지스터를 연결하는 금속선들 | The metal wires connecting transistors |
| Low-k dielectric | 저유전율 절연막 | 배선 사이 신호 간섭을 줄이는 절연체 | Insulator that reduces wire-to-wire capacitance |
| Liner / Barrier (Co, Ru, TaN) | 라이너 / 배리어 | 구리가 새어나가지 않게 감싸는 얇은 금속 | Thin metal shell keeping copper in place |
| Die | 다이 | 웨이퍼에서 잘라낸 칩 한 개 | One chip cut from a wafer |
| Reticle limit | 레티클 한계 | 한 번에 노광 가능한 최대 면적 26 × 33 mm = 858 mm² | Max area printable in one exposure |
| Dicing | 다이싱 | 웨이퍼를 다이로 자르기(블레이드/레이저/스텔스) | Cutting the wafer into dies |
| Yield | 수율 | 만든 것 중 양품 비율 | Fraction of good chips |
| Defect density (D0) | 결함 밀도 | cm²당 치명 결함 수. 수율 계산의 핵심 | Killer defects per cm² |
| Binning | 비닝 | 결함·속도에 따라 등급을 나눠 다른 제품으로 파는 것 | Sorting chips into product grades |
| Probe card | 프로브 카드 | 수만 개 바늘로 웨이퍼 위 다이를 테스트하는 판 | Needle board for testing chips on the wafer |
| Wafer sort / Final test | 웨이퍼 테스트 / 최종 테스트 | 자르기 전 테스트 / 패키징 후 테스트 | Test before dicing / after packaging |
| Burn-in | 번인 | 고온·고전압에서 미리 돌려 초기 불량 걸러내기 | Stress test to weed out early failures |
| TSV (through-silicon via) | 실리콘 관통 전극 | 다이를 수직으로 관통하는 구리 기둥. HBM 적층용 | Copper pillar through the die for 3D stacking |
| Microbump | 마이크로범프 | 다이를 붙이는 수십 µm 크기 땜납 돌기 | Tiny solder bumps (~10-40 µm pitch) joining dies |
| C4 bump | C4 범프 | 인터포저-기판을 잇는 큰 땜납 범프(~130 µm 피치) | Larger solder bumps joining interposer to substrate |
| Interposer | 인터포저 | 칩들 밑에 깔리는 배선 전용 실리콘 판 | Wiring-only silicon slab under the chips |
| CoWoS | 코워스 | TSMC의 2.5D 패키징: 칩→인터포저 웨이퍼→기판 | TSMC's chip-on-wafer-on-substrate 2.5D packaging |
| Substrate (package) | 패키지 기판 | 칩과 보드 사이를 잇는 다층 유기 기판 | Multilayer organic board under the chip |
| ABF | 아지노모토 빌드업 필름 | 기판 절연층용 필름. 아지노모토가 95 % 공급 | Insulating film for substrates, ~95 % from Ajinomoto |
| Underfill | 언더필 | 범프 사이 틈을 메워 균열을 막는 수지 | Resin filling gaps under a chip for strength |
| Lid / Heat spreader (IHS) | 리드 / 방열판 | 패키지 위 금속 뚜껑, 열을 퍼뜨림 | Metal cap spreading heat |
| HBM | 고대역폭 메모리 | DRAM 다이 8-12장을 TSV로 쌓아 1,024-bit로 연결한 메모리 | Stacked DRAM with 1,024-bit interface |
| MR-MUF | 몰드 언더필 리플로우 | SK hynix의 HBM 적층법: 한 번에 리플로우 + 몰드로 틈 채움 | SK hynix stacking: mass reflow then molded underfill |
| DRAM cell (1T1C) | 디램 셀 | 트랜지스터 1개 + 커패시터 1개로 1비트 저장(주기적 리프레시 필요) | 1 transistor + 1 capacitor storing one bit |
| SRAM cell (6T) | 에스램 셀 | 트랜지스터 6개로 1비트. 빠르지만 큼. GPU 캐시용 | 6-transistor bit cell used for caches |
| SM (streaming multiprocessor) | 스트리밍 멀티프로세서 | NVIDIA GPU의 연산 블록 단위. GH100 144개, H100 SXM 132개 | NVIDIA's compute block; 144 on die, 132 enabled |
| SMT (surface-mount technology) | 표면실장 | 부품을 보드 표면에 붙이는 자동 조립 | Automated placing of parts on a board |
| Reflow | 리플로우 | 오븐에서 솔더를 녹여 부품을 붙임(피크 ~245 °C) | Melting solder in an oven to attach parts |
| VRM | 전압 조정 모듈 | 12 V 등을 GPU용 ~1 V 대전류로 바꾸는 회로 | Circuit converting board voltage to GPU core voltage |
| SXM / HGX / DGX | — | SXM: GPU 모듈 규격, HGX: 8-GPU 베이스보드, DGX: NVIDIA 완성 서버 | Module form factor / 8-GPU baseboard / NVIDIA-branded server |
| NVLink / NVSwitch | — | GPU끼리 직접 연결하는 고속 링크 / 그 스위치 칩 | GPU-to-GPU link / switch chip |
| OSAT | 외주 패키징·테스트 | ASE, Amkor, KYEC 같은 후공정 전문업체 | Outsourced assembly & test companies |
| ODM / EMS | 제조 위탁사 | Foxconn, Quanta, Wistron 등 서버 조립사 | Contract manufacturers |
| ITAD | IT 자산 처분 | 데이터 삭제 후 재판매/재활용 | Secure disposal/resale of used IT gear |

---

## 5. 출처 목록 (Sources)

- [S1] Sibelco — Spruce Pine HPQ expansion: https://www.sibelco.com/en/news/sibelco-announces-a-major-expansion-of-its-spruce-pine-usa-high-purity-quartz-operations
- [S2] Sibelco — expansion update ($700M): https://www.sibelco.com/en/news/sibelco-provides-an-update-on-the-expansion-of-its-spruce-pine-usa-high-purity-quartz-operations ; Sibelco 150 years Spruce Pine: https://www.sibelco.com/en/150-years/spruce-pine
- [S3] Construction Physics — Does All Semiconductor Manufacturing Depend on Spruce Pine Quartz?: https://www.construction-physics.com/p/does-all-semiconductor-manufacturing ; Wikipedia High-purity quartz: https://en.wikipedia.org/wiki/High-purity_quartz ; NBC News (Helene): https://www.nbcnews.com/business/business-news/tiny-town-hit-helene-upend-global-semiconductor-chip-industry-rcna173933
- [S4] USGS Mineral Commodity Summaries 2024 — Silicon: https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-silicon.pdf
- [S5] USGS Minerals Yearbook 2023 — China: https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf ; Ferroglobe 20-F: https://www.sec.gov/Archives/edgar/data/1639877/000155837024007862/tmb-20231231x20f.htm
- [S6] Springer J. Sustainable Metallurgy — LCA of MG-Si: https://link.springer.com/article/10.1007/s40831-024-00941-z ; ScienceDirect carbothermal reduction 2025: https://www.sciencedirect.com/science/article/abs/pii/S0959652625021675
- [S7] Frontiers in Photonics — Upgraded MG-Si editorial: https://www.frontiersin.org/journals/photonics/articles/10.3389/fphot.2025.1544237/full
- [S8] Bernreuter Research — Siemens process: https://www.bernreuter.com/polysilicon/production-processes/ ; ScienceDirect Topics Siemens process: https://www.sciencedirect.com/topics/engineering/siemens-process
- [S9] Wacker Annual Report 2022 — Purity: https://reports.wacker.com/2022/annual-report/sustainable-solutions/purity-is-our-recipe-for-success.html
- [S10] Shin-Etsu silicon wafers: https://www.shinetsu.co.jp/en/products/electronics-materials/silicon-wafers/
- [S11] AIChipMap SUMCO: https://www.aichipmap.com/en/company/sumco/ ; Semiecosystem (Mark LaPedus) wafer industry: https://marklapedus.substack.com/p/taiwan-firm-boosts-us-silicon-wafer
- [S12] USPTO 6689209 (CZ pull rates): https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/6689209
- [S13] Uniglass — quartz crucibles for CZ: https://uniglassquartz.com/application/crystal-growth-ingot-production/ ; UniversityWafer CZ: https://www.universitywafer.com/czochralski-growth-silicon-wafers.html
- [S14] ResearchGate figure — 300 mm, 2 m, 265 kg crystal: https://www.researchgate.net/figure/A-single-crystal-of-silicon-300-mm-in-diameter-2-m-long-and-weighing-265-kg-drawn_fig3_8971873
- [S15] USPTO 7754009 (Siltronic, 775 µm) / 6114245 (MEMC lapping) / 6997779 (double-side grinding): https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/7754009
- [S16] UKAM — wafer manufacturing & diamond tools: https://ukam.com/semiconductor-wafer-manufacturing-process-cutting-grinding-dicing-polishing-tools-explained/
- [S17] Asianometry — The Economics of TSMC's Giga-Fabs (layer counts, cycle time): https://www.asianometry.com/p/the-economics-of-tsmcs-giga-fabs
- [S18] FabulousMap — TSMC Fab 18: https://www.fabulousmap.com/pages/tsmc-fab-18.html ; WikiChip Fuse TSMC 5 nm: https://fuse.wikichip.org/news/3398/tsmc-details-5-nm/
- [S19] TSMC 5nm technology page: https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_5nm ; CdrInfo TSMC roadmap (N4): https://www.cdrinfo.com/d7/content/update-tsmcs-processes-and-roadmap
- [S20] WikiChip 5 nm lithography process: https://en.wikichip.org/wiki/5_nm_lithography_process ; SemiAnalysis N3 (N5 M0 28 nm): https://newsletter.semianalysis.com/p/tsmcs-3nm-conundrum-does-it-even
- [S21] USPTO 7398693 (spike anneal 1000-1200 °C): https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/7398693 ; MRS spike anneal 1050 °C: https://www.cambridge.org/core/journals/mrs-online-proceedings-library-archive/article/abs/activation-diffusion-and-defect-analysis-of-a-spike-anneal-thermal-cycle/CF245E4F9861DB65542F5E3DA6393648
- [S22] Semiconductor Digest — Water supply challenges: https://www.semiconductor-digest.com/water-supply-challenges-for-the-semiconductor-industry/ ; WEF water challenge: https://www.weforum.org/stories/2024/07/the-water-challenge-for-semiconductor-manufacturing-and-big-tech-what-needs-to-be-done/
- [S23] MDPI — Challenges of Advanced CMOS 2D to 3D: https://www.mdpi.com/2076-3417/7/10/1047 ; USPTO 9231080 replacement metal gate: https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9231080 ; USPTO 11145555 gate-last thermal budget: https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11145555
- [S24] Semiconductor Digest — TSMC 5nm at IEDM 2019: https://www.semiconductor-digest.com/tsmc-to-discuss-their-5-nm-cmos-technology-platform-at-iedm-2019/ ; Angstronomics — The TRUTH of TSMC 5nm: https://www.angstronomics.com/p/the-truth-of-tsmc-5nm
- [S25] Chips and Cheese — Nvidia's H100: https://chipsandcheese.com/p/nvidias-h100-funny-l2-and-tons-of-bandwidth ; HWCooling Hopper: https://www.hwcooling.net/en/nvidia-hopper-gpu-architecture-revealed-4nm-die-18432-shaders/ ; Circuit Copilot What's inside an H100: https://circuitcopilot.com/glossary/whats-inside-an-h100
- [S26] ASML TWINSCAN NXE:3600D: https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe-3600d ; SemiWiki ASML EUV Update at SPIE: https://semiwiki.com/semiconductor-services/techinsights/314387-asml-euv-update-at-spie/ ; Patsnap EUV roadmap: https://www.patsnap.com/resources/blog/articles/asml-euv-and-high-na-lithography-technology-roadmap/
- [S27] ASML — Light & lasers: https://www.asml.com/en/technology/lithography-principles/light-and-lasers ; ASML EUV systems: https://www.asml.com/en/products/euv-lithography-systems
- [S28] TRUMPF EUV drive laser: https://www.trumpf.com/en_INT/solutions/applications/euv-lithography/euv-drive-laser/ ; Laser Focus World (Cymer 250 W / 43 kW): https://www.laserfocusworld.com/lasers-sources/article/16557008/photonic-frontiers-euv-lithography-euv-lithography-has-yet-to-find-its-way-into-the-fab ; heise (100k droplets/s): https://www.heise.de/en/news/EUV-Lithography-ASML-will-shoot-tin-droplets-300-000-times-per-second-11187649.html
- [S29] ZEISS SMT — EUV lithography: https://www.zeiss.com/semiconductor-manufacturing-technology/inspiring-technology/euv-lithography.html ; ZEISS "So does EUV work": https://www.zeiss.com/semiconductor-manufacturing-technology/smt-magazine/so-does-euv-lithography-work.html ; Bihr et al. ZEISS EUV Optics (EUVL 2022): https://euvlitho.com/2022/P53.pdf
- [S30] ASML — Lenses & mirrors: https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors ; Philosopher's Stone EUV mirrors: https://philosophersston.ee/knowledge/euv-mirrors-the-smoothest-objects-ever-manufactured
- [S31] Tom's Hardware — High-NA $380M: https://www.tomshardware.com/tech-industry/manufacturing/asmls-high-na-chipmaking-tool-will-cost-dollar380-million-the-company-already-has-orders-for-10-to-20-machines-and-is-ramping-up-production ; TechPowerUp: https://www.techpowerup.com/319071/asml-high-na-euv-twinscan-exe-machines-cost-usd380-million-10-20-units-already-booked
- [S32] Semiconductor Digest — Intel 4 drops cobalt, Co liner in TSMC N5 M0-M4: https://www.semiconductor-digest.com/intel-4-process-drops-cobalt-interconnect-goes-with-tried-and-tested-copper-with-cobalt-liner-cap/ ; SemiWiki TSMC IEDM 2019: https://semiwiki.com/semiconductor-manufacturers/tsmc/282339-tsmc-unveils-details-of-5nm-cmos-production-technology-platform-featuring-euv-and-high-mobility-channel-finfets-at-iedm2019/
- [S33] WikiChip Fuse — TSMC N3 and challenges ahead: https://fuse.wikichip.org/news/7375/tsmc-n3-and-challenges-ahead/
- [S34] Technoprobe — What is a probe card: https://www.technoprobe.com/technologies-and-products/what-is-a-probe-card ; KEYENCE probe card: https://www.keyence.com/products/microscope/digital-microscope/industries/electronics/probe-card-contact-probe.jsp
- [S35] LinkedIn (John West) — Anatomy of a probe card: https://www.linkedin.com/pulse/anatomy-probe-card-john-west
- [S36] Spheron — H100 specs: https://www.spheron.network/blog/nvidia-h100-specs/ ; Hyperstack H100 PCIe vs SXM: https://www.hyperstack.cloud/technical-resources/performance-benchmarks/comparing-nvidia-h100-pcie-vs-sxm-performance-use-cases-and-more
- [S37] Vast.ai H100 NVL vs SXM5: https://vast.ai/article/h100-nvl-vs-sxm5-nvidia-super-computing-gpus ; Exxact GDDR6 vs HBM (5120-bit math): https://www.exxactcorp.com/blog/hpc/gddr6-vs-hbm-gpu-memory
- [S38] Promex die-per-wafer calculator (formulas): https://promex-ind.com/die-per-wafer-calculator/ ; Silicon Analysts chips-per-wafer guide: https://siliconanalysts.com/guide/chips-per-wafer ; AnySilicon: https://anysilicon.com/die-per-wafer-formula-free-calculators/
- [S39] Wikipedia Blackwell (reticle limit context) : https://en.wikipedia.org/wiki/Blackwell_(microarchitecture) ; WikiChip Mask/Reticle: https://en.wikichip.org/wiki/mask ; EE Times advanced packaging: https://www.eetimes.com/understanding-the-big-spend-on-advanced-packaging-facilities/
- [S40] DISCO Stealth Dicing: https://www.disco.co.jp/eg/solution/library/laser/stealth.html ; DISCO Laser dicing: https://www.disco.co.jp/eg/solution/library/laser_dicing.html
- [S41] AnySilicon wafer dicing guide: https://anysilicon.com/wafer-dicing/ ; dicing-grinding.com laser: https://www.dicing-grinding.com/services/laser/
- [S42] TrendForce — SK hynix M15X HBM: https://www.trendforce.com/news/2024/12/16/news-sk-hynix-reportedly-expands-hbm-production-at-cheongju-m15x-fab-aiming-for-late-2025-completion/ ; Korea Herald P&T7: https://www.koreaherald.com/article/10654507 ; DigiTimes M15X ramp: https://www.digitimes.com/news/a20260410VL207/sk-hynix-production-dram-hbm-capacity.html
- [S43] Samsung Newsroom — first commercial HBM4: https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4 ; TrendForce Samsung Pyeongtaek/Onyang: https://www.trendforce.com/news/2026/08/20/news-samsung-to-break-ground-on-krw-6t-onyang-hbm-fab-in-sept-p5-eyes-triple-fab-shift-as-expansion-accelerates/
- [S44] Tom's Hardware — Micron $9.6B Hiroshima HBM fab: https://www.tomshardware.com/tech-industry/semiconductors/micron-plans-hbm-fab-in-japan-as-ai-memory-race-accelerates ; Taipei Times Micron Taichung: https://www.taipeitimes.com/News/biz/archives/2023/11/07/2003808781 ; DCD Samsung/SK capacity: https://www.datacenterdynamics.com/en/news/samsung-and-sk-hynix-to-scale-up-memory-production-capacity-in-2026-to-meet-ai-demand/
- [S45] SK hynix Newsroom — MR-MUF: https://news.skhynix.com/en/rulebreaker-revolutions-mr-muf-unlocks-hbm-heat-control/ ; FMS 2025 Tom Hsu HBM process: https://files.futurememorystorage.com/proceedings/2025/20250807_DRAM-301-1_Tom-Hsu.pdf
- [S46] SK hynix — 12-layer HBM3 (40 % thinner): https://news.skhynix.com/en/sk-hynix-develops-industrys-first-12-layer-hbm3/ ; team story: https://news.skhynix.com/en/meet-the-sk-hynix-team-behind-the-worlds-first-12-layer-hbm3/
- [S47] SK hynix — 12-layer HBM3E volume production: https://news.skhynix.com/en/sk-hynix-begins-volume-production-of-the-world-first-12-layer-hbm3e/
- [S48] Wevolver HBM3 engineering guide: https://www.wevolver.com/article/what-is-high-bandwidth-memory-3-hbm3-complete-engineering-guide-2025 ; Tom's Hardware SK hynix 24GB HBM3: https://www.tomshardware.com/news/sk-hynix-samples-24-gb-hbm3-modules
- [S49] Semiconductor Engineering — HBM4 sticks with microbumps: https://semiengineering.com/hbm4-sticks-with-microbumps-postponing-hybrid-bonding/ ; Siemens HBM3e/HBM4 design guide: https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/ ; ServeTheHome SK hynix Hot Chips 2026: https://www.servethehome.com/sk-hynix-hbm-packaging-at-hot-chips-2026/
- [S50] SemiAnalysis — Scaling the Memory Wall (HBM): https://newsletter.semianalysis.com/p/scaling-the-memory-wall-the-rise-and-roadmap-of-hbm ; Nomad Semi Deep Dive on HBM: https://www.nomadsemi.com/p/deep-dive-on-hbm
- [S51] TSMC CoWoS official: https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm
- [S52] DigiTimes — TSMC AP fab plans: https://www.digitimes.com/news/a20260129PD220/tsmc-packaging-fab-cowos-genai.html ; TrendForce AP7 Chiayi: https://www.trendforce.com/news/2025/12/04/news-tsmc-speeds-advanced-packaging-ap7-targets-2026-output-arizona-p6-eyed-for-u-s-packaging-hub/ ; Nomad Semi CoWoS capacity: https://www.nomadsemi.com/p/tsmcs-cowos-capacity
- [S53] Ajinomoto ABF innovation story: https://www.ajinomoto.com/innovation/our_innovation/buildupfilm ; Tom's Hardware ABF substrates 2026: https://www.tomshardware.com/tech-industry/semiconductors/the-state-of-abf-substrates-in-data-center-silicon-in-2026-solving-the-supply-crunch-and-material-wall-beneath-every-ai-accelerator ; Ibiden capex notice: https://www.ibiden.com/company/2026/02/notice-regarding-capital-investment-plan-for-high-performance-ic-package-substrates.html ; DigiTimes Ibiden AI substrates: https://www.digitimes.com/news/a20240129PD217/ibiden-generative-ai-ic-substrate-sales-2024.html
- [S54] SemiAnalysis — AI Expansion: Supply Chain Analysis for CoWoS and HBM: https://semianalysis.com/2023/07/26/ai-expansion-supply-chain-analysis/ ; SemiconductorX CoWoS: https://semiconductorx.com/packaging-cowos.html
- [S55] 3D InCites IFTLE 607 — Blackwell CoWoS-L issues: https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/ ; Tom's Hardware Nvidia shifts to CoWoS-L: https://www.tomshardware.com/tech-industry/nvidia-shifts-to-cowos-l-packaging-for-blackwell-gpu-production-ramp-up
- [S56] 3D InCites IFTLE 615 — 9x reticle by 2027: https://www.3dincites.com/2024/12/iftle-615-tsmc-evolves-cowos-technology-promising-9x-reticle-size-by-2027/ ; Tom's Hardware CoWoS roadmap 14x: https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump
- [S57] SemiWiki TSMC Symposium Part 2 (CoWoS-L 25 µm pitch): https://semiwiki.com/semiconductor-manufacturers/tsmc/290560-highlights-of-the-tsmc-technology-symposium-part-2/
- [S58] Medium (P. Asrar) CoWoS-L critical path: https://medium.com/@pasrar/cowos-l-is-the-new-critical-path-why-advanced-packaging-now-decides-ai-chip-volume-e0ba94ccbdb5 ; SemiAnalysis Blackwell reworked: https://newsletter.semianalysis.com/p/nvidias-blackwell-reworked-shipment
- [S59] Silicon Analysts — foundry allocation Q1 2026: https://siliconanalysts.com/analysis/foundry-allocation-status-q1-2026 ; Fusion Worldwide CoWoS/HBM bottleneck: https://info.fusionww.com/blog/inside-the-ai-bottleneck-cowos-hbm-and-2-3nm-capacity-constraints-through-2027
- [S60] Chips and Wafers — Semiconductor test theme (KYEC, burn-in): https://chipsandwafers.substack.com/p/semiconductor-test-a-compelling-investment ; Jason Hoffman GPU failure rates: https://fullhoffman.com/2026/03/21/gpu-failure-rates/ ; The SEA Analyst OSAT/test: https://www.theseaanalyst.com/p/semiconductor-osat-ai-test-southeast-asia
- [S61] KYEC investor update (ATE fleet): https://www.kyec.com.tw/Upfiles/EDUp/files/%E9%97%9C%E6%96%BC%E4%BA%AC%E5%85%83/1Q19_KYEC_Investor%20update_e.pdf ; Advantest SLT: https://www.advantest.com/en/products/component-test-system/system-level-test-systems/
- [S62] Igor's Lab — NVIDIA Speedo & continuous virtual binning: https://www.igorslab.de/en/the-secret-behind-nvidias-sophisticated-telemetry-the-role-of-buckets-speedo-and-continuous-virtual-binning-cvb/
- [S63] SemiAnalysis — Tariff Armageddon (FII/Wistron board assembly flow, Mexico): https://newsletter.semianalysis.com/p/tariff-armageddon-gpu-loopholes
- [S64] NVIDIA Newsroom — HGX partner program 2017: https://nvidianews.nvidia.com/news/nvidia-partners-with-world-s-top-server-manufacturers-to-advance-ai-cloud-computing ; TEJ EMS/ODM AI servers: https://www.tejwin.com/en/insight/electronic-manufacturing-service/ ; AI News Taiwan ODMs: https://www.artificialintelligence-news.com/news/ai-servers-transform-taiwan-manufacturing-giants/
- [S65] Intel SMT board assembly databook ch.9 (SAC305 profile): https://www.intel.de/content/dam/www/public/us/en/documents/packaging-databooks/packaging-chapter-09-databook.pdf ; APTPCB reflow basics: https://aptpcb.com/en/blog/reflow-profile-basics-soak-time-peak-and-delta-t
- [S66] Wikipedia pick-and-place: https://en.wikipedia.org/wiki/Pick-and-place_machine ; PCBasic guide: https://www.pcbasic.com/blog/pick-and-place_machinesH.html ; NextPCB OAM vs SXM baseboard: https://www.nextpcb.com/blog/ocp-oam-vs-nvidia-sxm-ai-gpu-pcb-design
- [S67] ServeTheHome — H100 first look: https://www.servethehome.com/checking-out-the-nvidia-h100-in-our-first-look-at-hopper/ ; Tom's Hardware SXM5 VRM: https://www.tomshardware.com/news/nvidia-hopper-h100-sxm5-pictured ; Anasim H100 PDN: https://www.anasim.com/articles/modeling-the-h100
- [S68] NVIDIA HGX H100 PCF summary (24 kg, 5,600 W): https://images.nvidia.com/aem-dam/Solutions/documents/HGX-H100-PCF-Summary.pdf
- [S69] NVIDIA DGX H100: https://www.nvidia.com/en-eu/data-center/dgx-h100/ ; FS.com DGX H100 intro (weight/power): https://www.fs.com/blog/introduction-to-nvidia-dgx-h100-3856.html ; IntuitionLabs HGX DC requirements: https://intuitionlabs.ai/articles/nvidia-hgx-data-center-requirements
- [S70] NVIDIA GB200 NVL72: https://www.nvidia.com/en-us/data-center/gb200-nvl72/ ; NVIDIA DGX GB200 hardware docs: https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html ; HPE GB200 NVL72 QuickSpecs (CDU 1.3 MW): https://www.hpe.com/us/en/collaterals/collateral.a50009224enw.html
- [S71] SemiAnalysis — GB200 hardware architecture & BOM: https://newsletter.semianalysis.com/p/gb200-hardware-architecture-and-component ; Spheron GB200 NVL72 guide (1.36 t): https://www.spheron.network/blog/nvidia-gb200-nvl72-guide/ ; Introl NVL72 deployment: https://introl.com/blog/gb200-nvl72-deployment-72-gpu-liquid-cooled
- [S72] NVIDIA Jetson Thor: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/ ; NVIDIA Technical Blog — Introducing Jetson Thor: https://developer.nvidia.com/blog/introducing-nvidia-jetson-thor-the-ultimate-platform-for-physical-ai/
- [S73] RidgeRun Jetson Thor wiki: https://developer.ridgerun.com/wiki/index.php/NVIDIA_Jetson_Thor:_Powering_the_Future_of_Physical_AI ; Electronics-Lab ($3,499): https://www.electronics-lab.com/get-nvidia-jetson-agx-thor-developer-kit-at-just-3499-with-2070-tflops-ai-performance-for-edge-ai-and-robotics/
- [S74] Engineer Live — End-of-life GPU hardware: https://www.engineerlive.com/content/why-end-life-gpu-hardware-too-valuable-scrap ; Data Center Knowledge GPU lifespan: https://www.datacenterknowledge.com/data-center-chips/gpu-lifespan-in-data-centers-physical-vs-economic ; Reloop AI hardware recycling guide: https://reloopglobal.com/blog/ai-hardware-recycling-gpu-servers/
- [S75] Electronics360 — Data centers and recycling economy: https://electronics360.globalspec.com/article/23631/data-centers-and-the-new-recycling-economy ; Samr Inc AI e-waste: https://samrinc.com/blog/ai-hardware-e-waste/
- [S76] PMC — Selective gold recovery from waste electronics: https://pmc.ncbi.nlm.nih.gov/articles/PMC12898858/ ; PMC hydrometallurgical PCB recovery: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4586516/ ; emew precious metals from e-waste: https://emew.com/blog/precious-metals-recovery-from-e-waste
- [S77] UniversityWafer — wafer reclaim: https://universitywafer.com/silicon-wafer-reclaim.html ; WaferWorld wafer recycling: https://www.waferworld.com/post/the-rise-of-silicon-wafer-recycling-in-semiconductor-manufacturing
- [S78] Medium (elongated_musk) — Annual cadence (6-7 month cycle, Rubin): https://medium.com/@Elongated_musk/the-annual-cadence-gamble-can-nvidia-keep-launching-a-new-platform-each-spring-3029a6520938 ; Silicon Analysts weekly (HBM4 >6 months): https://siliconanalysts.com/newsletter/qual-watch/2026-08-25
- [S79] Epoch AI — Advanced packaging and HBM bottlenecks (16-week / 8-week lags): https://epoch.ai/data-insights/ai-chip-supply-chain-constraints
- [S80] Tom's Hardware — TSMC 10 % price hike 2025 ($18k→$20k N4): https://www.tomshardware.com/tech-industry/tsmc-may-increase-wafer-pricing-by-10-for-2025-report ; TechPowerUp: https://www.techpowerup.com/324323/tsmc-to-raise-wafer-prices-by-10-in-2025-customers-seemingly-agree
- [S81] Silicon Analysts — wafer pricing by node: https://siliconanalysts.com/data/wafer-pricing ; Tom's Hardware 3nm $18k: https://www.tomshardware.com/tech-industry/tsmcs-wafer-pricing-now-usd18-000-for-a-3nm-wafer-increased-by-over-3x-in-10-years-analyst ; PhoneArena 2nm $25k: https://www.phonearena.com/news/2025-2nm-wafer-prices-to-hit-25k_id148472
- [S82] arXiv 2503.11698 — Cerebras WSE vs NVIDIA (72 chips/wafer table): https://arxiv.org/pdf/2503.11698
- [S83] IntuitionLabs — NVIDIA GPU pricing guide: https://intuitionlabs.ai/articles/nvidia-ai-gpu-pricing-guide ; Compute Exchange H100 price 2026: https://compute.exchange/blogs/h100-gpu-price-2026
- [S84] Cyfuture H100 price guide: https://cyfuture.cloud/kb/gpu/nvidia-h100-price-guide ; Thunder Compute H100 specs: https://www.thundercompute.com/blog/nvidia-h100-specs-full-guide
- [S85] Construction Physics — How to build a $20B fab: https://www.construction-physics.com/p/how-to-build-a-20-billion-semiconductor ; IEEE Spectrum Intel Ohio $20B: https://spectrum.ieee.org/intel-ohio-fab ; Semiecosystem (LaPedus) fab cost $55B+: https://marklapedus.substack.com/p/foundryecosystem-report-terafab-capacity
- [S86] NIST CHIPS — TSMC Arizona ($6.6B award, $65B, 3 fabs): https://www.nist.gov/chips/tsmc-arizona-phoenix ; Wikipedia TSMC Arizona: https://en.wikipedia.org/wiki/TSMC_Arizona ; TechInsights Arizona vs Taiwan cost: https://www.techinsights.com/blog/chip-insider-tsmcs-true-cost-arizona-versus-taiwan
- [S87] igus — ISO cleanroom classes: https://toolbox.igus.com/motion-plastics-blog/iso-classifications-and-standards-for-cleanrooms/ ; TSI ISO 14644: https://tsi.com/electronics-manufacturing/learn/meeting-iso-14644-standards
- [S88] SemiconductorX — Semiconductor cleanrooms & HVAC: https://semiconductorx.com/semiconductor-cleanrooms.html ; CKY fab HVAC design (vibration): https://www.cky.com.tw/en/insights/semiconductor-fab-hvac ; KLC cleanroom setup guide: https://www.klcintl.com/semiconductor-cleanroom-setup-guide-iso-3-to-iso-6-equipment-requirements-and-ffu-coverage-calculation
- [S89] Fortune — Taiwan drought TSMC water 2021: https://fortune.com/2021/06/12/chip-shortage-taiwan-drought-tsmc-water-usage ; Asianometry — Big semiconductor water problem: https://www.asianometry.com/p/the-big-semiconductor-water-problem ; Robeco water & chips: https://www.robeco.com/en-int/insights/2026/03/why-the-future-of-chips-depends-on-water ; The Diplomat: https://thediplomat.com/2024/09/how-water-scarcity-threatens-taiwans-semiconductor-industry/
- [S90] Reeman — FOUP & reticle automation: https://reemanbot.com/ms/posts/semiconductor-fab-material-handling-foup-and-reticle-automation-explained ; Fortrend FOUP/load port: http://www.fortrend.com/technical-blog/the-collaboration-mechanism-between-wafer-handling-robots-load-ports-and-foups.html ; SNS Insider AMHS (Daifuku/Murata): https://www.snsinsider.com/reports/amhs-for-semiconductor-market-8136 ; ISMI 2022 OHT routing paper: https://www.conf.tw/site/userdata/1449/ISMI_paper/ISMI2022_paper_5130.pdf

### 미확인/추정 항목 요약 (Unverified items at a glance)
- N5/N4 총 금속층 수 (14-18층 추정), GH100 실제 층수 — TSMC 미공개.
- SXM5 모듈·HGX UBB PCB 층수 — NVIDIA 미공개.
- HBM3 80 GB 단가, DGX H100 시스템 가격, 웨이퍼 단가(프라임 300 mm).
- KYEC 점유율 90 %+, 번인 불량률, CoWoS 패키지 단가 — 분석가 추정.
- 웨이퍼가 팹 내에서 이동하는 총 거리, 칩 내 총 배선 길이 — 비유용 수치, 출처 미확보.
- 초크랄스키 "잉크병 대신 주석" 일화 — 널리 회자되나 1차 출처 미확인.
- 2 nm 이후 세대(GAA, High-NA) 수치는 본 문서 범위 밖(참고만).
