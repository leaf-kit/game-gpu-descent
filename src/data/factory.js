// 프롤로그: 재료 → GPU 공장 시찰. 수치 출처: docs/research/02_manufacturing.md
// 각 스테이션 = 하나의 층(level). chapter: 'prologue'. 게이트는 "다음 스테이션으로".
const NEXT = { ko: '다음 스테이션', en: 'NEXT STATION' };
const F = 0xffd166, C = 0x5ee0ff, NV = 0x76b900;


// 스테이션별 회사·국가 로고 간판 (상표 이미지 대신 브랜드 색 워드마크로 표현). 출처: docs/research/02_manufacturing.md 의 실제 기업·장소.
const LOGOS = {
  P1: [
    { pos: [-30, 12], brand: 'SIBELCO', country: 'BE', color: '#00427a', role: { ko: '고순도 석영 (IOTA) · 스프루스 파인 광산 운영', en: 'High-purity quartz (IOTA) · Spruce Pine mine' } },
    { pos: [30, 12], brand: 'THE QUARTZ CORP', country: 'NO', color: '#1f3b73', role: { ko: '고순도 석영 · 노르웨이/프랑스 합작', en: 'High-purity quartz · Norway/France JV' } },
    { pos: [0, -14], brand: 'SPRUCE PINE', country: 'US', color: '#5a4a3a', role: { ko: '노스캐롤라이나 · 세계 HPQ의 약 70~90%', en: 'North Carolina · ≈70–90% of world HPQ' }, size: [7, 3.4] },
  ],
  P2: [
    { pos: [-28, 4], brand: 'ELKEM', country: 'NO', color: '#0060a9', role: { ko: '실리콘 금속 · 아크로 제련', en: 'Silicon metal · arc furnace smelting' } },
    { pos: [28, -4], brand: 'FERROGLOBE', country: 'ES', color: '#c8102e', role: { ko: '실리콘 금속 · 스페인/미국/프랑스 공장', en: 'Silicon metal · plants in Spain/US/France' } },
    { pos: [0, 20], brand: 'HOSHINE', country: 'CN', color: '#8a1c1c', role: { ko: '세계 최대 실리콘 금속 생산국 (약 85%)', en: 'World\'s largest silicon-metal producer (≈85%)' } },
  ],
  P3: [
    { pos: [-36, -6], brand: 'WACKER', country: 'DE', color: '#004a99', role: { ko: '전자급 폴리실리콘 (지멘스 공정)', en: 'Electronic-grade polysilicon (Siemens process)' } },
    { pos: [36, -18], brand: 'HEMLOCK', country: 'US', color: '#1a5f8a', role: { ko: '폴리실리콘 · 미시간', en: 'Polysilicon · Michigan' } },
    { pos: [-4, -30], brand: 'TOKUYAMA', country: 'JP', color: '#0a5cad', role: { ko: '반도체용 폴리실리콘', en: 'Semiconductor polysilicon' } },
  ],
  P4: [
    { pos: [-28, -14], brand: 'Shin-Etsu', country: 'JP', color: '#004098', role: { ko: '300 mm 실리콘 웨이퍼 세계 1위', en: 'World #1 in 300 mm silicon wafers' } },
    { pos: [28, -14], brand: 'SUMCO', country: 'JP', color: '#e60012', role: { ko: '실리콘 웨이퍼 · 잉곳 성장', en: 'Silicon wafers · ingot growth' } },
    { pos: [0, -28], brand: 'SK siltron', country: 'KR', color: '#ea002c', role: { ko: '실리콘 웨이퍼 · 구미', en: 'Silicon wafers · Gumi' } },
  ],
  P5: [
    { pos: [-44, 30], brand: 'TSMC', country: 'TW', color: '#c00c1e', role: { ko: 'Fab 18 · 타이난 · N5/N4 양산', en: 'Fab 18 · Tainan · N5/N4 volume production' }, size: [8, 3.6] },
    { pos: [44, 30], brand: 'Applied Materials', country: 'US', color: '#00263e', role: { ko: '증착·식각·CMP 장비', en: 'Deposition, etch and CMP tools' } },
    { pos: [-44, -30], brand: 'LAM RESEARCH', country: 'US', color: '#00558c', role: { ko: '플라즈마 식각 장비', en: 'Plasma etch tools' } },
    { pos: [44, -30], brand: 'Tokyo Electron', country: 'JP', color: '#0068b7', role: { ko: '코터/디벨로퍼 · 식각 장비', en: 'Coater/developer and etch tools' } },
    { pos: [0, -34], brand: 'Entegris', country: 'US', color: '#5b2c86', role: { ko: 'FOUP 웨이퍼 운반 용기', en: 'FOUP wafer carriers' } },
  ],
  P6: [
    { pos: [-30, -20], brand: 'ASML', country: 'NL', color: '#0f238c', role: { ko: 'EUV 노광기 세계 유일 제조사 · 펠트호번', en: 'Sole maker of EUV scanners · Veldhoven' }, size: [8, 3.6] },
    { pos: [30, -20], brand: 'ZEISS', country: 'DE', color: '#0b3d91', role: { ko: 'EUV 다층 거울 광학계 · 오버코헨', en: 'EUV multilayer mirror optics · Oberkochen' } },
    { pos: [30, 20], brand: 'TRUMPF', country: 'DE', color: '#1c1c1c', role: { ko: 'EUV 광원용 CO₂ 드라이브 레이저', en: 'CO₂ drive laser for the EUV source' } },
    { pos: [-30, 20], brand: 'Cymer', country: 'US', color: '#00457c', role: { ko: 'EUV 주석 플라즈마 광원 (ASML 자회사)', en: 'EUV tin-plasma light source (ASML subsidiary)' } },
  ],
  P7: [
    { pos: [-30, -22], brand: 'Technoprobe', country: 'IT', color: '#0055a5', role: { ko: '프로브 카드', en: 'Probe cards' } },
    { pos: [30, -22], brand: 'ADVANTEST', country: 'JP', color: '#e4002b', role: { ko: '자동 테스트 장비 (ATE)', en: 'Automatic test equipment (ATE)' } },
    { pos: [-30, 26], brand: 'DISCO', country: 'JP', color: '#0a2d6e', role: { ko: '다이싱 톱 · 스텔스 다이싱', en: 'Dicing saws · stealth dicing' } },
    { pos: [30, 26], brand: 'KYEC', country: 'TW', color: '#1f5f3f', role: { ko: '테스트 하우스 (번인·최종 테스트)', en: 'Test house (burn-in, final test)' } },
  ],
  P8: [
    { pos: [-30, 12], brand: 'SK hynix', country: 'KR', color: '#ea002c', role: { ko: 'HBM3 / HBM3E · 이천·청주 (NVIDIA 주공급)', en: 'HBM3/HBM3E · Icheon, Cheongju (main NVIDIA supplier)' }, size: [8, 3.6] },
    { pos: [30, 12], brand: 'SAMSUNG', country: 'KR', color: '#1428a0', role: { ko: 'HBM · 평택', en: 'HBM · Pyeongtaek' } },
    { pos: [0, -28], brand: 'Micron', country: 'US', color: '#0057b8', role: { ko: 'HBM3E · 히로시마·타이중', en: 'HBM3E · Hiroshima, Taichung' } },
  ],
  P9: [
    { pos: [-34, 22], brand: 'TSMC CoWoS', country: 'TW', color: '#c00c1e', role: { ko: '2.5D 패키징 · 주난·타이중·룽탄·자이', en: '2.5D packaging · Zhunan, Taichung, Longtan, Chiayi' }, size: [8, 3.6] },
    { pos: [34, 22], brand: 'Ajinomoto', country: 'JP', color: '#e60012', role: { ko: 'ABF 기판 절연 필름 (점유율 약 95%)', en: 'ABF substrate film (≈95% share)' } },
    { pos: [-34, -26], brand: 'IBIDEN', country: 'JP', color: '#004ea2', role: { ko: 'FC-BGA 패키지 기판', en: 'FC-BGA package substrates' } },
    { pos: [34, -26], brand: 'ASE', country: 'TW', color: '#0d3b66', role: { ko: 'OSAT · 패키징/테스트 외주', en: 'OSAT · outsourced packaging/test' } },
  ],
  P10: [
    { pos: [-44, 8], brand: 'NVIDIA', country: 'US', color: '#76b900', textColor: '#061000', role: { ko: 'GPU 설계 · 산타클라라 (팹리스)', en: 'GPU design · Santa Clara (fabless)' }, size: [8, 3.6] },
    { pos: [44, 8], brand: 'Foxconn', country: 'TW', color: '#1a1a1a', role: { ko: 'SXM 모듈·HGX 베이스보드 조립', en: 'SXM module and HGX baseboard assembly' } },
    { pos: [-44, -30], brand: 'Wistron', country: 'TW', color: '#005baa', role: { ko: 'GPU 보드·서버 조립', en: 'GPU board and server assembly' } },
    { pos: [44, -30], brand: 'Quanta', country: 'TW', color: '#003c8f', role: { ko: 'DGX/HGX 서버 ODM', en: 'DGX/HGX server ODM' } },
    { pos: [0, -30], brand: 'Supermicro', country: 'US', color: '#0a6d3b', role: { ko: 'GPU 서버 · 산호세', en: 'GPU servers · San Jose' } },
  ],
};

export const PROLOGUE = [
  {
    id: 'P1', chapter: 'prologue', logos: LOGOS.P1, name: { ko: '석영 광산', en: 'QUARTZ MINE' }, subtitle: { ko: '스프루스 파인, 노스캐롤라이나', en: 'Spruce Pine, North Carolina' },
    size: 40, groundType: 'floor', palette: { sky: 0x9fc8e8, fog: 0xbcd6ea, ground: '#c9c2b4', groundLine: 'rgba(255,255,255,0.15)', pad: 'rgba(0,0,0,0)', hemiSky: 0xffffff, hemiGround: 0x8a7f70, accent: F, dust: 0xffffff }, fogDensity: 0.006, sunIntensity: 2.2, ambient: 'factory',
    terms: ['quartz'], gate: { pos: [0, -30], required: 1, label: NEXT }, spawn: [0, 28],
    narration: [
      { ko: '여기서 시작하자. GPU는 모래에서 온다. 정확히는 이 하얀 돌, 석영이야.', en: 'Let\'s start here. A GPU comes from sand. More precisely, from this white rock: quartz.' },
      { ko: '이 광산 하나가 세계 고순도 석영의 대부분을 댄다. 2024년 허리케인으로 멈췄을 때 반도체 업계가 긴장했지.', en: 'This one mine supplies most of the world\'s high-purity quartz. When a hurricane shut it down in 2024, the chip industry held its breath.' },
    ],
    objective: { ko: '석영 더미를 살펴보고 다음 스테이션으로', en: 'Inspect the quartz pile, then move on' },
    structures: [
      { type: 'flow', pos: [0, 34], span: 24, rot: Math.PI,
        input: [{ label: { ko: '페그마타이트 광석 (SiO₂ 결정)', en: 'PEGMATITE ORE (SiO₂ CRYSTALS)' }, color: 0xdcd6c8, shape: 'chunk' }],
        machine: { label: { ko: '분쇄 → 부유선광 → 산세척', en: 'CRUSH → FLOTATION → ACID LEACH' }, color: 0x3a3a42, glow: 0xffd166, cond: { ko: '화학 변화 없음 · 물리적 분리', en: 'NO CHEMICAL CHANGE · PHYSICAL SEPARATION' } },
        output: [{ label: { ko: '고순도 석영 모래 (HPQ)', en: 'HIGH-PURITY QUARTZ SAND' }, color: 0xf5f2ea, shape: 'powder' }, { label: { ko: '장석·운모 등 폐석', en: 'FELDSPAR / MICA TAILINGS', }, color: 0x6a6a6a, shape: 'powder', waste: true }],
        note: { ko: '석영은 이미 SiO₂. 여기서는 섞여 있는 다른 광물을 걷어낼 뿐이다', en: 'Quartz is already SiO₂; this stage only removes the other minerals mixed with it' } },
      { type: 'box', pos: [-14, -4], size: [16, 7, 12], color: 0xf2efe8, mat: { rough: 1 }, term: 'quartz', label: { ko: '고순도 석영 (SiO₂)', en: 'HIGH-PURITY QUARTZ (SiO₂)' }, triggerR: 12 },
      { type: 'box', pos: [12, 2], size: [10, 4, 8], color: 0xe8e2d6, mat: { rough: 1 } },
      { type: 'box', pos: [16, -14], size: [6, 3, 4], color: 0x3a3a3a, label: { ko: '채굴 트럭', en: 'MINING TRUCK' } },
      { type: 'cylinder', pos: [-4, -20], size: [3, 14], color: 0xd8d8d8, mat: { rough: 0.6 }, label: { ko: '석영 모래 사일로', en: 'QUARTZ SAND SILO' } },
      { type: 'panel', pos: [0, 16], size: [14, 4], label: { ko: '세계 공급의 약 70~90%', en: '≈70–90% OF WORLD SUPPLY' } },
    ],
  },
  {
    id: 'P2', chapter: 'prologue', logos: LOGOS.P2, name: { ko: '아크로 제련소', en: 'ARC FURNACE' }, subtitle: { ko: '금속급 실리콘 · 1,300~2,000 °C', en: 'Metallurgical silicon · 1,300–2,000 °C' },
    size: 40, groundType: 'floor', palette: { sky: 0x1a0d08, fog: 0x2a1208, ground: '#2b2420', groundLine: 'rgba(255,120,40,0.15)', pad: 'rgba(255,140,40,0.3)', hemiSky: 0xff9a4a, hemiGround: 0x1a0a05, accent: 0xff7a1a, dust: 0xffaa55 }, fogDensity: 0.012, sunIntensity: 0.8, ambient: 'factory',
    terms: ['mgsi'], gate: { pos: [0, -30], required: 1, label: NEXT }, spawn: [0, 28],
    narration: [
      { ko: '석영에 탄소를 섞고 전기 아크로 녹인다. 산소가 떨어져 나가면 98~99% 실리콘이 남아. 아직 GPU를 만들기엔 백만 배 더 순수해져야 해.', en: 'Mix quartz with carbon and melt it with an electric arc. Strip the oxygen away and 98–99% silicon is left. Still a million times too dirty for a GPU.' },
    ],
    objective: { ko: '전극 아래 용융 실리콘을 살펴보라', en: 'Inspect the molten silicon under the electrodes' },
    structures: [
      { type: 'flow', pos: [0, 30], span: 26, rot: Math.PI,
        input: [{ label: { ko: '석영 SiO₂', en: 'QUARTZ SiO₂' }, color: 0xf5f2ea, shape: 'chunk' }, { label: { ko: '탄소 C (코크스·목재칩)', en: 'CARBON C (COKE, WOOD CHIPS)' }, color: 0x2a2a2a, shape: 'chunk' }],
        machine: { label: { ko: '침지 아크로 (전극 3개)', en: 'SUBMERGED ARC FURNACE' }, color: 0x3a1c10, glow: 0xff5a00, size: [9, 7, 9], cond: { ko: '1,300~2,000 °C · 톤당 10~13 MWh', en: '1,300–2,000 °C · 10–13 MWh PER TONNE' } },
        output: [{ label: { ko: '금속급 실리콘 98~99%', en: 'METALLURGICAL SILICON 98–99%' }, color: 0x9aa4b0, shape: 'chunk' }, { label: { ko: '일산화탄소 CO (배기)', en: 'CARBON MONOXIDE CO (OFF-GAS)' }, color: 0x8a8a90, shape: 'gas', waste: true }],
        note: { ko: 'SiO₂ + 2C → Si + 2CO · 탄소가 산소를 가져가는 탄소열 환원', en: 'SiO₂ + 2C → Si + 2CO · carbothermic reduction: carbon takes the oxygen' } },
      { type: 'disc', pos: [0, -4], size: [9, 0.6], color: 0xff5a00, glow: 0xff3300, rim: 0xffaa00, term: 'mgsi', label: { ko: '용융 실리콘 (Si 98~99%)', en: 'MOLTEN SILICON (98–99%)' }, triggerR: 11 },
      { type: 'cylinder', pos: [-5, -4], size: [1.2, 18], color: 0x222222, mat: { rough: 0.9, emissive: 0x552200, ei: 0.4 }, label: { ko: '흑연 전극', en: 'GRAPHITE ELECTRODE' } },
      { type: 'cylinder', pos: [5, -4], size: [1.2, 18], color: 0x222222, mat: { rough: 0.9, emissive: 0x552200, ei: 0.4 } },
      { type: 'cylinder', pos: [0, -10], size: [1.2, 18], color: 0x222222, mat: { rough: 0.9, emissive: 0x552200, ei: 0.4 } },
      { type: 'light', pos: [0, -4], y: 4, color: 0xff6a00, intensity: 120, dist: 40 },
      { type: 'box', pos: [16, 8], size: [6, 3, 6], color: 0x9a9a9a, mat: { metal: 0.8, rough: 0.4 }, label: { ko: '실리콘 금속 덩어리', en: 'SILICON METAL CHUNKS' } },
      { type: 'panel', pos: [-16, 10], size: [12, 4], label: { ko: 'SiO₂ + 2C → Si + 2CO', en: 'SiO₂ + 2C → Si + 2CO' } },
    ],
  },
  {
    id: 'P3', chapter: 'prologue', logos: LOGOS.P3, name: { ko: '폴리실리콘 · 결정 성장실', en: 'POLYSILICON & CRYSTAL PULLER' }, subtitle: { ko: '지멘스 공정 9N → 초크랄스키 잉곳', en: 'Siemens process 9N → Czochralski ingot' },
    size: 48, groundType: 'floor', palette: { sky: 0x0b1420, fog: 0x101c2c, ground: '#1c2430', groundLine: 'rgba(255,255,255,0.06)', pad: 'rgba(255,209,102,0.35)', hemiSky: 0xbcd0ff, hemiGround: 0x101820, accent: F, dust: 0xffd166 }, fogDensity: 0.01, sunIntensity: 1.2, ambient: 'factory',
    terms: ['polysi', 'czochralski', 'dopant'], gate: { pos: [0, -38], required: 3, label: NEXT }, spawn: [0, 36],
    narration: [
      { ko: '증류탑에서 아홉 개의 9가 붙을 때까지 정제하고, 1,414도의 도가니에서 완벽한 단결정을 끌어올린다. 하루 반이 걸려.', en: 'Distill until the purity has nine nines, then pull one perfect crystal out of a 1,414 °C crucible. It takes a day and a half.' },
      { ko: '이 잉곳 하나가 200 kg이 넘어. 그리고 이 안에 붕소나 인을 아주 조금 섞지. 그게 트랜지스터의 비밀이야.', en: 'One ingot weighs over 200 kg. And a trace of boron or phosphorus is mixed in. That is the secret of the transistor.' },
    ],
    objective: { ko: '증류탑 · 도가니 · 도펀트 투입구를 살펴보라', en: 'Inspect the distillation tower, the crucible and the dopant hopper' },
    structures: [
      { type: 'flow', pos: [-30, 34], span: 22, rot: Math.PI,
        input: [{ label: { ko: '금속급 실리콘 분말', en: 'MG-Si POWDER' }, color: 0x9aa4b0, shape: 'powder' }, { label: { ko: '염화수소 HCl', en: 'HYDROGEN CHLORIDE HCl' }, color: 0xd2e86a, shape: 'gas' }],
        machine: { label: { ko: '유동층 반응 + 증류탑', en: 'FLUIDIZED BED + DISTILLATION' }, color: 0x2a3444, glow: 0x5ee0ff, cond: { ko: 'TCS 끓는점 31.8 °C · 반복 증류', en: 'TCS BOILS AT 31.8 °C · REPEATED DISTILLATION' } },
        output: [{ label: { ko: '트리클로로실란 SiHCl₃ (액체)', en: 'TRICHLOROSILANE SiHCl₃ (LIQUID)' }, color: 0x7fd4ff, shape: 'liquid' }],
        note: { ko: '고체 실리콘을 끓는점 낮은 액체로 바꿔야 증류로 불순물을 뗄 수 있다', en: 'Turning solid silicon into a low-boiling liquid is what makes distillation possible' } },
      { type: 'flow', pos: [30, 34], span: 22, rot: Math.PI,
        input: [{ label: { ko: 'SiHCl₃ + 수소 H₂', en: 'SiHCl₃ + HYDROGEN H₂' }, color: 0x7fd4ff, shape: 'liquid' }],
        machine: { label: { ko: '지멘스 반응기 (U자 심봉)', en: 'SIEMENS REACTOR (U-ROD)' }, color: 0x40323a, glow: 0xff7a1a, cond: { ko: '심봉 1,000~1,100 °C · 수십 시간 증착', en: 'RODS AT 1,000–1,100 °C · TENS OF HOURS' } },
        output: [{ label: { ko: '폴리실리콘 9N (다결정)', en: 'POLYSILICON 9N' }, color: 0xc8ccd4, shape: 'bar' }, { label: { ko: 'HCl · SiCl₄ 회수', en: 'HCl · SiCl₄ RECOVERED' }, color: 0x8a8a90, shape: 'gas', waste: true }],
        note: { ko: '2 HSiCl₃ → Si + 2 HCl + SiCl₄ · 뜨거운 봉 위에 실리콘만 쌓인다', en: '2 HSiCl₃ → Si + 2 HCl + SiCl₄ · only silicon builds up on the hot rod' } },
      { type: 'cylinder', pos: [-22, 10], size: [2.2, 22], color: 0xb8c4d0, mat: { metal: 0.8, rough: 0.3 }, term: 'polysi', label: { ko: '트리클로로실란 증류탑', en: 'TRICHLOROSILANE DISTILLATION' }, triggerR: 7 },
      { type: 'cylinder', pos: [-16, 4], size: [2.2, 22], color: 0xb8c4d0, mat: { metal: 0.8, rough: 0.3 } },
      { type: 'box', pos: [-14, -14], size: [8, 6, 8], color: 0x556677, mat: { metal: 0.6 }, label: { ko: '지멘스 반응기 (1,000~1,100 °C)', en: 'SIEMENS REACTOR (1,000–1,100 °C)' } },
      { type: 'cylinder', pos: [10, -6], size: [6, 3], color: 0xff7a1a, mat: { emissive: 0xff4400, ei: 0.8 }, term: 'czochralski', label: { ko: '석영 도가니 · 1,414 °C', en: 'QUARTZ CRUCIBLE · 1,414 °C' }, triggerR: 12 },
      { type: 'cylinder', pos: [10, -6], y: 3, size: [3.2, 20], color: 0x9aa4b0, mat: { metal: 0.9, rough: 0.25 }, solid: false, label: { ko: '단결정 잉곳 300 mm', en: 'SINGLE-CRYSTAL INGOT 300 mm' }, labelScale: 0.8 },
      { type: 'light', pos: [10, -6], y: 3, color: 0xff6a00, intensity: 80, dist: 30 },
      { type: 'box', pos: [22, 8], size: [4, 5, 4], color: 0xff5577, mat: { emissive: 0xff2255, ei: 0.4 }, term: 'dopant', label: { ko: '도펀트 투입: 붕소 / 인', en: 'DOPANT HOPPER: BORON / PHOSPHORUS' } },
      { type: 'panel', pos: [0, 20], size: [16, 4], label: { ko: '순도 99.9999999% (9N)', en: 'PURITY 99.9999999% (9N)' } },
    ],
  },
  {
    id: 'P4', chapter: 'prologue', logos: LOGOS.P4, name: { ko: '웨이퍼 가공실', en: 'WAFER LINE' }, subtitle: { ko: '다이아몬드 와이어 절단 → CMP 거울 연마', en: 'Diamond wire saw → CMP mirror polish' },
    size: 40, groundType: 'floor', palette: { sky: 0xdfe8f0, fog: 0xe6eef5, ground: '#dfe3e8', groundLine: 'rgba(0,0,0,0.06)', pad: 'rgba(80,120,200,0.3)', hemiSky: 0xffffff, hemiGround: 0x8090a0, accent: C, dust: 0xffffff }, fogDensity: 0.008, sunIntensity: 2.0, ambient: 'factory',
    terms: ['wafer'], gate: { pos: [0, -30], required: 1, label: NEXT }, spawn: [0, 28],
    narration: [
      { ko: '잉곳을 다이아몬드 실톱으로 수천 장 썰고, 갈고, 녹이고, 거울처럼 닦는다. 두께 775 마이크로미터. 종이 일곱 장.', en: 'Slice the ingot into thousands of discs with diamond wire, grind, etch and polish to a mirror. 775 micrometres thick: seven sheets of paper.' },
    ],
    objective: { ko: '완성된 웨이퍼를 살펴보라', en: 'Inspect a finished wafer' },
    structures: [
      { type: 'flow', pos: [0, 30], span: 26, rot: Math.PI,
        input: [{ label: { ko: '단결정 잉곳 300 mm', en: 'SINGLE-CRYSTAL INGOT 300 mm' }, color: 0x9aa4b0, shape: 'bar' }],
        machine: { label: { ko: '와이어 쏘 → 래핑 → 에칭 → CMP', en: 'WIRE SAW → LAP → ETCH → CMP' }, color: 0x2b3a4a, glow: 0x5ee0ff, size: [9, 5, 9], cond: { ko: '재료를 깎아 내는 공정 · 화학 반응 아님', en: 'MATERIAL REMOVAL · NOT A CHEMICAL REACTION' } },
        output: [{ label: { ko: '거울 웨이퍼 775 μm', en: 'MIRROR WAFER 775 μm' }, color: 0xc0c8d8, shape: 'wafer' }, { label: { ko: '커프 손실(톱밥) · 슬러리', en: 'KERF LOSS · SPENT SLURRY' }, color: 0x6a6a6a, shape: 'powder', waste: true }],
        note: { ko: '자를 때 톱날 두께만큼 실리콘이 가루로 사라진다. 그래서 처음엔 두껍게 썬다', en: 'The saw turns a slice of silicon into dust, so wafers are cut thick and then thinned' } },
      { type: 'cylinder', pos: [-14, 0], size: [3.2, 12], color: 0x9aa4b0, mat: { metal: 0.9, rough: 0.25 }, rot: 0, label: { ko: '잉곳 (와이어 쏘)', en: 'INGOT (WIRE SAW)' } },
      { type: 'box', pos: [-14, 0], y: 12, size: [10, 0.3, 0.3], color: 0x333333 },
      { type: 'cylinder', pos: [8, -2], size: [6, 0.5], color: 0xaab4c4, mat: { metal: 1, rough: 0.05 }, term: 'wafer', label: { ko: '300 mm 웨이퍼 · 775 μm', en: '300 mm WAFER · 775 μm' }, triggerR: 10, seg: 48 },
      { type: 'cylinder', pos: [8, -2], y: 0.5, size: [6, 0.5], color: 0xc0c8d8, mat: { metal: 1, rough: 0.05 }, seg: 48 },
      { type: 'cylinder', pos: [8, -2], y: 1.0, size: [6, 0.5], color: 0xd0d8e8, mat: { metal: 1, rough: 0.05 }, seg: 48 },
      { type: 'box', pos: [20, 10], size: [8, 2, 8], color: 0x2b4a6a, mat: { metal: 0.5 }, label: { ko: 'CMP 연마 테이블', en: 'CMP POLISHING TABLE' } },
      { type: 'panel', pos: [-4, 16], size: [16, 4], label: { ko: '표면 거칠기 < 1 nm', en: 'SURFACE ROUGHNESS < 1 nm' } },
    ],
  },
  {
    id: 'P5', chapter: 'prologue', logos: LOGOS.P5, name: { ko: '팹 클린룸', en: 'FAB CLEANROOM' }, subtitle: { ko: 'TSMC Fab 18 · ISO Class 1 · 노란 조명', en: 'TSMC Fab 18 · ISO Class 1 · yellow light' },
    size: 56, groundType: 'floor', palette: { sky: 0xf0dea0, fog: 0xf2e2a8, ground: '#e9e2c8', groundLine: 'rgba(0,0,0,0.08)', pad: 'rgba(0,0,0,0)', hemiSky: 0xfff0b0, hemiGround: 0x8a8060, accent: NV, dust: 0xfff0b0 }, fogDensity: 0.007, sunIntensity: 1.8, ambient: 'factory', ceiling: 14,
    terms: ['cleanroom', 'photolith', 'etch'], gate: { pos: [0, -46], required: 3, label: NEXT }, spawn: [0, 44],
    narration: [
      { ko: '수술실보다 천 배 깨끗한 방. 웨이퍼는 25장씩 FOUP에 담겨 천장 레일로 움직이고, 1,000번 넘는 공정을 석 달 동안 거친다.', en: 'A room a thousand times cleaner than an operating theatre. Wafers ride in FOUPs of 25 along ceiling rails through 1,000+ steps over three months.' },
      { ko: '왜 노란색이냐고? 감광액이 파란빛에 반응하거든. 여기서는 파란빛이 금지야.', en: 'Why yellow? Photoresist reacts to blue light. Blue is forbidden here.' },
    ],
    objective: { ko: 'FOUP · 노광 장비 · 식각 장비를 살펴보라', en: 'Inspect a FOUP, a litho tool and an etch tool' },
    structures: (g) => {
      const s = [];
      s.push({ type: 'flow', pos: [0, 40], span: 30, rot: Math.PI,
        input: [{ label: { ko: '민무늬 웨이퍼', en: 'BLANK WAFER' }, color: 0xc0c8d8, shape: 'wafer' }, { label: { ko: '공정 가스 (SiH₄ · O₂ · WF₆ …)', en: 'PROCESS GASES' }, color: 0x9ad2ff, shape: 'gas' }, { label: { ko: '포토레지스트', en: 'PHOTORESIST' }, color: 0xf0c040, shape: 'liquid' }],
        machine: { label: { ko: '산화 → 증착 → 노광 → 식각 → 이온주입 → 어닐 → CMP', en: 'OXIDE → DEPOSIT → EXPOSE → ETCH → IMPLANT → ANNEAL → CMP' }, color: 0x2a3444, glow: 0xffd166, size: [12, 6, 9], cond: { ko: '1,000회 이상 반복 · 마스크 81층 · 약 3개월', en: '1,000+ REPEATS · 81 MASK LAYERS · ≈3 MONTHS' } },
        output: [{ label: { ko: '회로가 새겨진 웨이퍼', en: 'PATTERNED WAFER' }, color: 0x6fa8dc, shape: 'wafer' }, { label: { ko: '폐가스 · 폐액 (정화 후 배출)', en: 'SPENT GAS / CHEMICALS (SCRUBBED)' }, color: 0x6a6a6a, shape: 'gas', waste: true }],
        note: { ko: '같은 웨이퍼가 이 장비들을 수백 번 돌며 층을 한 겹씩 얻는다', en: 'The same wafer loops through these tools hundreds of times, gaining one layer each pass' } },
      { type: 'flow', pos: [0, -46], span: 24, rot: 0,
        input: [{ label: { ko: '붕소 B⁺ / 인 P⁺ 이온', en: 'BORON B⁺ / PHOSPHORUS P⁺ IONS' }, color: 0xff5577, shape: 'ion' }],
        machine: { label: { ko: '이온 주입기 (가속 → 질량 분리)', en: 'ION IMPLANTER' }, color: 0x2a2a3a, glow: 0xff66aa, cond: { ko: '수 keV~수 MeV 로 가속해 격자에 박음', en: 'ACCELERATED TO keV–MeV AND DRIVEN INTO THE LATTICE' } },
        output: [{ label: { ko: 'n형 / p형 도핑 영역', en: 'n-TYPE / p-TYPE REGION' }, color: 0x88ccff, shape: 'wafer' }],
        note: { ko: '충돌로 망가진 격자는 1,000~1,200 °C 어닐로 되살리고 도펀트를 활성화한다', en: 'A 1,000–1,200 °C anneal repairs the lattice damage and activates the dopants' } });
      for (let i = 0; i < 6; i++) { s.push({ type: 'box', pos: [-30 + i * 12, 14], size: [8, 6, 6], color: 0xe6e6e6, mat: { rough: 0.5 }, edges: 0x8899aa }); s.push({ type: 'box', pos: [-30 + i * 12, -14], size: [8, 6, 6], color: 0xe6e6e6, mat: { rough: 0.5 }, edges: 0x8899aa }); }
      s.push({ type: 'box', pos: [-24, 0], size: [3, 3, 3], color: 0x8fb3ff, mat: { rough: 0.3 }, term: 'cleanroom', label: { ko: 'FOUP · 웨이퍼 25장', en: 'FOUP · 25 WAFERS' } });
      s.push({ type: 'pipe', pos: [0, 0], path: [[-50, 13, 0], [50, 13, 0]], radius: 0.25, color: 0x556677, label: { ko: 'OHT 천장 레일', en: 'OHT CEILING RAIL' } });
      s.push({ type: 'box', pos: [6, 14], size: [8, 6, 6], color: 0xd0d8ff, mat: { rough: 0.4 }, term: 'photolith', label: { ko: '노광 장비 (81 마스크 층)', en: 'LITHO SCANNER (81 MASK LAYERS)' }, triggerR: 8 });
      s.push({ type: 'box', pos: [18, -14], size: [8, 6, 6], color: 0xffd0d0, mat: { rough: 0.4 }, term: 'etch', label: { ko: '플라즈마 식각 · ALD 증착', en: 'PLASMA ETCH · ALD' }, triggerR: 8 });
      s.push({ type: 'panel', pos: [0, 30], size: [20, 4], label: { ko: '공정 1,000회+ · 약 3개월', en: '1,000+ STEPS · ≈3 MONTHS' } });
      return s;
    },
  },
  {
    id: 'P6', chapter: 'prologue', logos: LOGOS.P6, name: { ko: 'EUV 노광실', en: 'EUV BAY' }, subtitle: { ko: 'ASML NXE:3600D · 파장 13.5 nm', en: 'ASML NXE:3600D · 13.5 nm' },
    size: 44, groundType: 'floor', palette: { sky: 0x1a1030, fog: 0x1e1438, ground: '#1a1428', groundLine: 'rgba(160,120,255,0.12)', pad: 'rgba(160,120,255,0.3)', hemiSky: 0xc0a0ff, hemiGround: 0x100a20, accent: 0xc3b1ff, dust: 0xc3b1ff }, fogDensity: 0.012, sunIntensity: 1.0, ambient: 'hum',
    terms: ['euv', 'reticle'], gate: { pos: [0, -34], required: 2, label: NEXT }, spawn: [0, 32],
    narration: [
      { ko: '주석 방울을 초당 5만 개 떨어뜨리고 레이저로 쏴서 태양 표면보다 100배 뜨거운 플라즈마를 만든다. 거기서 나오는 빛으로 회로를 찍어.', en: 'Fifty thousand tin droplets a second, each hit by a laser, making a plasma 100 times hotter than the Sun\'s surface. Its light prints the circuit.' },
      { ko: '렌즈는 못 써. 이 빛은 유리도 삼키거든. 그래서 원자 수준으로 매끈한 거울 11장으로 굽힌다.', en: 'No lenses: this light is swallowed even by glass. So eleven atomically smooth mirrors bend it instead.' },
    ],
    objective: { ko: 'EUV 광원과 레티클 스테이지를 살펴보라', en: 'Inspect the EUV source and the reticle stage' },
    structures: [
      { type: 'flow', pos: [0, 30], span: 28, rot: Math.PI,
        input: [{ label: { ko: '주석 방울 25~27 μm', en: 'TIN DROPLETS 25–27 μm' }, color: 0xd8d8e0, shape: 'ion' }, { label: { ko: 'CO₂ 레이저 (프리펄스 + 메인)', en: 'CO₂ LASER (PRE + MAIN PULSE)' }, color: 0xff4444, shape: 'gas' }],
        machine: { label: { ko: '주석 플라즈마 광원', en: 'TIN PLASMA SOURCE' }, color: 0x2a1a40, glow: 0xb56cff, size: [9, 7, 9], cond: { ko: '초당 5만 방울 · 플라즈마 약 50만 K', en: '50,000 DROPS/s · PLASMA ≈500,000 K' } },
        output: [{ label: { ko: '13.5 nm 극자외선 광자', en: '13.5 nm EUV PHOTONS' }, color: 0xc3b1ff, shape: 'gas' }, { label: { ko: '주석 잔해 (거울 오염)', en: 'TIN DEBRIS (MIRROR CONTAMINANT)' }, color: 0x7a7a82, shape: 'powder', waste: true }],
        note: { ko: '거울 11장을 거치며 빛의 98%가 사라진다. 그래서 광원을 250 W 급으로 키운다', en: 'Eleven mirrors absorb about 98% of the light, which is why the source runs at ~250 W' } },
      { type: 'box', pos: [0, -6], size: [22, 8, 12], color: 0xd8dce8, mat: { rough: 0.4, metal: 0.3 }, edges: 0x8877cc, label: { ko: 'EUV 스캐너 (약 1.8억 달러)', en: 'EUV SCANNER (≈$180M)' }, labelScale: 1.1 },
      { type: 'sphere', pos: [-16, 4], size: [1.6], color: 0xffffff, glow: 0xa070ff, term: 'euv', label: { ko: '주석 플라즈마 광원 · 50만 K', en: 'TIN PLASMA SOURCE · 500,000 K' }, triggerR: 8 },
      { type: 'light', pos: [-16, 4], y: 3, color: 0xb080ff, intensity: 150, dist: 30 },
      { type: 'disc', pos: [16, 4], size: [3, 0.4], color: 0x223355, glow: 0x4466aa, rim: 0xc3b1ff, term: 'reticle', label: { ko: '레티클 · 26 × 33 mm', en: 'RETICLE · 26 × 33 mm' }, triggerR: 7 },
      { type: 'ring', pos: [-6, 10], size: [2.4, 0.3], color: 0xc3b1ff, y: 4, label: { ko: 'Mo/Si 다층 거울', en: 'Mo/Si MULTILAYER MIRROR' } },
      { type: 'ring', pos: [6, 12], size: [2.4, 0.3], color: 0xc3b1ff, y: 6 },
      { type: 'panel', pos: [0, 20], size: [18, 4], label: { ko: '거울을 독일 크기로 키워도 요철 0.1 mm', en: 'MIRROR SCALED TO GERMANY: BUMPS 0.1 mm' } },
    ],
  },
  {
    id: 'P7', chapter: 'prologue', logos: LOGOS.P7, name: { ko: '테스트 · 절단실', en: 'WAFER TEST & DICING' }, subtitle: { ko: '프로브 카드 → 비닝 → 다이싱', en: 'Probe card → binning → dicing' },
    size: 44, groundType: 'floor', palette: { sky: 0x0c1a14, fog: 0x102018, ground: '#16241c', groundLine: 'rgba(118,185,0,0.15)', pad: 'rgba(118,185,0,0.25)', hemiSky: 0xbfe0c0, hemiGround: 0x0a1410, accent: NV, dust: 0x76b900 }, fogDensity: 0.011, sunIntensity: 1.3, ambient: 'hum',
    terms: ['wafertest', 'yield', 'dicing'], gate: { pos: [0, -34], required: 3, label: NEXT }, spawn: [0, 32],
    narration: [
      { ko: '바늘 5만 개가 한 번에 내려와 다이마다 전기를 넣어 본다. 죽은 다이는 지도에 표시되고, 살아 있어도 흠이 있으면 그 블록을 퓨즈로 끈다.', en: 'Fifty thousand needles come down at once and test every die. Dead dies get marked on the map; live ones with flaws have those blocks fused off.' },
      { ko: 'GH100은 SM이 144개인데 H100은 132개만 켜. 12개는 보험이야. 814 제곱밀리미터 다이를 완벽하게 만드는 건 불가능에 가깝거든.', en: 'GH100 has 144 SMs but H100 enables 132. Twelve are insurance. A perfect 814 mm² die is nearly impossible.' },
    ],
    objective: { ko: '프로브 스테이션 · 웨이퍼 맵 · 다이싱 톱을 살펴보라', en: 'Inspect the probe station, the wafer map and the dicing saw' },
    structures: (g) => {
      const s = [];
      s.push({ type: 'flow', pos: [0, 30], span: 26, rot: Math.PI,
        input: [{ label: { ko: '회로가 새겨진 웨이퍼', en: 'PATTERNED WAFER' }, color: 0x6fa8dc, shape: 'wafer' }],
        machine: { label: { ko: '프로브 테스트 → 퓨즈 → 다이싱', en: 'PROBE TEST → FUSE → DICE' }, color: 0x243444, glow: 0x76b900, size: [10, 5, 9], cond: { ko: '바늘 5만 개 접촉 · 결함 블록은 퓨즈로 차단', en: '50,000 NEEDLES · DEFECTIVE BLOCKS FUSED OFF' } },
        output: [{ label: { ko: '양품 다이 (SM 132개 활성)', en: 'GOOD DIE (132 SMs ENABLED)' }, color: 0x1a2a3a, shape: 'chunk' }, { label: { ko: '불량 다이 · 커프 손실', en: 'FAILED DIE · KERF LOSS' }, color: 0x6a2a2a, shape: 'chunk', waste: true }],
        note: { ko: '814 mm² 다이는 무결점이 드물어, 애초에 일부를 끄고 팔 것을 전제로 설계한다', en: 'A perfect 814 mm² die is rare, so the design assumes some blocks will be switched off' } });
      s.push({ type: 'cylinder', pos: [-14, 0], size: [6, 0.5], color: 0xaab4c4, mat: { metal: 1, rough: 0.1 }, seg: 48 });
      s.push({ type: 'box', pos: [-14, 0], y: 3.5, size: [8, 1.2, 8], color: 0x334455, mat: { metal: 0.6 }, solid: false, term: 'wafertest', label: { ko: '프로브 카드 · 바늘 5만 개', en: 'PROBE CARD · 50,000 NEEDLES' }, triggerR: 10 });
      // 웨이퍼 맵: 다이 격자, 일부 빨강(불량)
      const cells = []; const n = 7; let k = 0;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const cx = (i - 3) * 1.6, cz = (j - 3) * 1.6; if (Math.hypot(cx, cz) > 5.2) continue; const bad = (k * 7 + i * 3 + j) % 11 === 0; k++; cells.push({ x: cx, z: cz, w: 1.4, d: 1.4, h: 0.5, color: bad ? 0xcc2233 : 0x3a7bd5, solid: false }); }
      s.push({ type: 'grid', pos: [12, 0], cells, edge: 0x222222 });
      s.push({ type: 'panel', pos: [12, -8], size: [12, 3], term: 'yield', label: { ko: '웨이퍼 맵 · 후보 다이 60~65개', en: 'WAFER MAP · 60–65 CANDIDATE DIES' }, triggerR: 9 });
      s.push({ type: 'box', pos: [0, 16], size: [10, 3, 6], color: 0x556677, mat: { metal: 0.7 }, term: 'dicing', label: { ko: '다이싱 톱 / 스텔스 레이저', en: 'DICING SAW / STEALTH LASER' }, triggerR: 8 });
      s.push({ type: 'panel', pos: [-14, 16], size: [12, 3], label: { ko: `${g.name}: SM ${g.sms} / ${g.smsFull}`, en: `${g.name}: ${g.sms} of ${g.smsFull} SMs enabled` } });
      return s;
    },
  },
  {
    id: 'P8', chapter: 'prologue', logos: LOGOS.P8, name: { ko: 'HBM 메모리 타워 공장', en: 'HBM STACKING PLANT' }, subtitle: { ko: 'SK hynix 이천 · DRAM 12단 적층', en: 'SK hynix Icheon · 12-high DRAM stacks' },
    size: 44, groundType: 'floor', palette: { sky: 0x0a1020, fog: 0x0e1628, ground: '#141c2c', groundLine: 'rgba(94,224,255,0.12)', pad: 'rgba(94,224,255,0.25)', hemiSky: 0xa0c8ff, hemiGround: 0x0a1020, accent: C, dust: 0x5ee0ff }, fogDensity: 0.011, sunIntensity: 1.3, ambient: 'hum',
    terms: ['hbm', 'tsv', 'dram'], gate: { pos: [0, -34], required: 3, label: NEXT }, spawn: [0, 32],
    narration: [
      { ko: 'DRAM 다이를 30 마이크로미터까지 얇게 갈아서 8장, 12장 쌓는다. 층과 층은 다이를 관통하는 구리 기둥, TSV로 잇지.', en: 'DRAM dies are thinned to 30 micrometres and stacked 8 or 12 high. Copper pillars drilled through the dies, TSVs, join the floors.' },
      { ko: 'GPU 다이 한 장 옆에 이 탑이 다섯에서 여덟 개 선다. 실리콘 면적으로 치면 메모리가 GPU보다 훨씬 커.', en: 'Five to eight of these towers stand beside one GPU die. In silicon area, the memory is much bigger than the GPU.' },
    ],
    objective: { ko: 'HBM 스택 · TSV 단면 · DRAM 웨이퍼를 살펴보라', en: 'Inspect an HBM stack, a TSV cross-section and a DRAM wafer' },
    structures: [
      { type: 'flow', pos: [0, 30], span: 28, rot: Math.PI,
        input: [{ label: { ko: 'DRAM 웨이퍼 (1T1C 셀)', en: 'DRAM WAFER (1T1C CELLS)' }, color: 0x8fb3ff, shape: 'wafer' }, { label: { ko: '구리 도금액', en: 'COPPER PLATING BATH' }, color: 0xd08a3c, shape: 'liquid' }],
        machine: { label: { ko: 'TSV 식각 → 구리 충전 → 박막화 → 적층', en: 'TSV ETCH → Cu FILL → THIN → STACK' }, color: 0x1c2a3a, glow: 0x5ee0ff, size: [11, 6, 9], cond: { ko: '다이를 약 30 μm 로 갈고 12장 적층 (MR-MUF)', en: 'THIN TO ≈30 μm AND STACK 12 HIGH (MR-MUF)' } },
        output: [{ label: { ko: 'HBM 스택 (1,024-bit)', en: 'HBM STACK (1,024-bit)' }, color: 0x2b4a6a, shape: 'chunk' }],
        note: { ko: 'TSV 자리 때문에 HBM 다이의 비트 밀도는 같은 세대 DDR4의 절반 수준이다', en: 'Space for TSVs makes an HBM die about half as bit-dense as a same-generation DDR4 die' } },
      { type: 'tower', pos: [-12, -4], size: [8, 14, 8], layers: 12, color: 0x2b4a6a, gapColor: 0x5ee0ff, baseColor: 0x1a2a3a, term: 'hbm', label: { ko: 'HBM3E 12-Hi · 36 GB', en: 'HBM3E 12-Hi · 36 GB' }, triggerR: 10 },
      { type: 'tower', pos: [10, -6], size: [8, 12, 8], layers: 8, color: 0x2b4a6a, gapColor: 0x5ee0ff, pillars: 0xd08a3c, term: 'tsv', label: { ko: 'TSV 단면 · 다이당 수천 개', en: 'TSV CUTAWAY · THOUSANDS PER DIE' }, triggerR: 10 },
      { type: 'cylinder', pos: [0, 14], size: [6, 0.5], color: 0x8fb3ff, mat: { metal: 0.8, rough: 0.2 }, seg: 48, term: 'dram', label: { ko: 'DRAM 웨이퍼 (1T1C 셀)', en: 'DRAM WAFER (1T1C CELLS)' }, triggerR: 9 },
      { type: 'panel', pos: [22, 6], size: [12, 4], label: { ko: '스택당 1,024-bit · 819 GB/s (HBM3)', en: '1,024-bit PER STACK · 819 GB/s (HBM3)' } },
    ],
  },
  {
    id: 'P9', chapter: 'prologue', logos: LOGOS.P9, name: { ko: 'CoWoS 패키징 팹', en: 'CoWoS PACKAGING FAB' }, subtitle: { ko: 'TSMC 어드밴스드 패키징 · 2.5D', en: 'TSMC advanced packaging · 2.5D' },
    size: 48, groundType: 'floor', palette: { sky: 0x101418, fog: 0x141a20, ground: '#1c2228', groundLine: 'rgba(255,209,102,0.1)', pad: 'rgba(255,209,102,0.3)', hemiSky: 0xd0d8e0, hemiGround: 0x101418, accent: F, dust: 0xffd166 }, fogDensity: 0.01, sunIntensity: 1.5, ambient: 'hum',
    terms: ['interposer', 'microbump', 'finaltest'], gate: { pos: [0, -38], required: 3, label: NEXT }, spawn: [0, 36],
    narration: [
      { ko: '얇은 실리콘 판(인터포저) 위에 GPU 다이와 HBM 탑을 나란히 얹고, 40 마이크로미터 간격의 솔더 구슬 수만 개로 잇는다. 이게 CoWoS야.', en: 'The GPU die and HBM towers are placed side by side on a thin silicon slab (the interposer) and joined by tens of thousands of solder bumps 40 micrometres apart. That is CoWoS.' },
      { ko: '2023년에 H100이 부족했던 건 실리콘이 아니라 이 공정의 용량 때문이었어.', en: 'The 2023 H100 shortage was not about silicon. It was about capacity here.' },
    ],
    objective: { ko: '인터포저 · 범프 · 최종 테스트 소켓을 살펴보라', en: 'Inspect the interposer, the bumps and the final-test socket' },
    structures: (g) => {
      const s = [];
      s.push({ type: 'flow', pos: [0, 32], span: 30, rot: Math.PI,
        input: [{ label: { ko: 'GPU 다이', en: 'GPU DIE' }, color: 0x1a2a3a, shape: 'chunk' }, { label: { ko: 'HBM 스택', en: 'HBM STACKS' }, color: 0x2b4a6a, shape: 'chunk' }, { label: { ko: '실리콘 인터포저 · ABF 기판', en: 'SILICON INTERPOSER · ABF SUBSTRATE' }, color: 0x2a3a4a, shape: 'disc' }],
        machine: { label: { ko: '마이크로범프 접합 → 리플로우 → 언더필', en: 'MICROBUMP BOND → REFLOW → UNDERFILL' }, color: 0x2f2a24, glow: 0xffd166, size: [11, 6, 9], cond: { ko: '범프 간격 약 40 μm · 수만 개를 한 번에', en: '≈40 μm PITCH · TENS OF THOUSANDS AT ONCE' } },
        output: [{ label: { ko: '완성 패키지 (CoWoS)', en: 'FINISHED PACKAGE (CoWoS)' }, color: 0x3a4a5a, shape: 'disc' }],
        note: { ko: '실리콘과 유기 기판은 열팽창률이 달라, 언더필로 접합부의 응력을 잡아 준다', en: 'Silicon and organic substrate expand differently with heat, so underfill holds the joints together' } });
      s.push({ type: 'box', pos: [0, 0], size: [30, 1, 22], color: 0x2a3a4a, mat: { metal: 0.5, rough: 0.5 }, edges: 0xffd166, term: 'interposer', label: { ko: 'CoWoS 인터포저', en: 'CoWoS INTERPOSER' }, triggerR: 18 });
      if (g.twoDie) { s.push({ type: 'box', pos: [-5, 0], y: 1, size: [8, 1.6, 9], color: 0x1a2a3a, edges: 0x76b900, label: { ko: 'GPU 다이 1', en: 'GPU DIE 1' } }); s.push({ type: 'box', pos: [5, 0], y: 1, size: [8, 1.6, 9], color: 0x1a2a3a, edges: 0x76b900, label: { ko: 'GPU 다이 2', en: 'GPU DIE 2' } }); }
      else s.push({ type: 'box', pos: [0, 0], y: 1, size: [9, 1.6, 9], color: 0x1a2a3a, edges: 0x76b900, label: { ko: 'GPU 다이', en: 'GPU DIE' } });
      const n = g.hbmSites || 0; for (let i = 0; i < n; i++) { const side = i < n / 2 ? -1 : 1; const idx = i % (n / 2); const z = (idx - (n / 2 - 1) / 2) * 6.5; s.push({ type: 'tower', pos: [side * 11, z], y: 1, size: [3.6, 3.2, 4.8], layers: 8, color: i < g.hbmStacks ? 0x2b4a6a : 0x222833, gapColor: i < g.hbmStacks ? 0x5ee0ff : 0x333a44 }); }
      s.push({ type: 'row', pos: [0, 16], size: [0.5, 0.5, 0.5], count: 60, perRow: 15, gap: 0.6, color: 0xd08a3c, glow: 0x804000, term: 'microbump', label: { ko: '마이크로범프 · 40 μm 간격', en: 'MICROBUMPS · 40 μm PITCH' }, triggerR: 8, solid: false });
      s.push({ type: 'box', pos: [22, -12], size: [6, 4, 6], color: 0x556677, mat: { metal: 0.7 }, term: 'finaltest', label: { ko: '최종 테스트 · 번인 125 °C', en: 'FINAL TEST · BURN-IN 125 °C' }, triggerR: 8 });
      s.push({ type: 'panel', pos: [-22, -12], size: [12, 4], label: { ko: g.twoDie ? 'CoWoS-L · 브리지 다이' : (g.hbmSites ? 'CoWoS-S · 실리콘 인터포저' : '유기 기판 플립칩 (인터포저 없음)'), en: g.twoDie ? 'CoWoS-L · BRIDGE DIES' : (g.hbmSites ? 'CoWoS-S · SILICON INTERPOSER' : 'ORGANIC FLIP-CHIP (NO INTERPOSER)') } });
      return s;
    },
  },
  {
    id: 'P10', chapter: 'prologue', logos: LOGOS.P10, name: { ko: '보드 조립 · 시스템 · 로봇', en: 'BOARD, SYSTEM & ROBOT' }, subtitle: { ko: 'SMT 라인 → DGX 랙 → Jetson Thor → 이오(EO)', en: 'SMT line → DGX rack → Jetson Thor → EO' },
    size: 60, groundType: 'floor', palette: { sky: 0x06101c, fog: 0x0a1424, ground: '#0e1826', groundLine: 'rgba(94,224,255,0.1)', pad: 'rgba(118,185,0,0.3)', hemiSky: 0x9fb7d9, hemiGround: 0x06101c, accent: NV, dust: 0x76b900 }, fogDensity: 0.009, sunIntensity: 1.4, ambient: 'fan',
    terms: ['vrm', 'sxm', 'dgx', 'jetson', 'physicalai', 'frame'], gate: { pos: [0, -50], required: 5, label: { ko: '아스트라의 방 · 축소', en: 'ASTRA\'S CHAMBER · SHRINK' } }, spawn: [0, 48], shrink: 1100,
    narration: [
      { ko: '패키지가 보드에 실리고, 보드 8장이 서버가 되고, 서버 수천 대가 로봇의 뇌를 학습시킨다. 그 뇌는 손바닥만 한 Jetson에 복사돼 로봇 몸에 들어가지.', en: 'The package goes onto a board, eight boards make a server, thousands of servers train the robot\'s brain. That brain is copied into a palm-sized Jetson inside the robot.' },
      { ko: '저기 이오가 컵을 집으려 하고 있어. 카메라 프레임 한 장이 GPU를 거쳐 손의 움직임이 되기까지, 33밀리초. 그 안을 걸어 볼래?', en: 'There is EO, trying to pick up a cup. One camera frame becomes a hand movement in 33 milliseconds inside the GPU. Want to walk that path?' },
      { ko: '준비됐으면 내 방으로 와. 너를 천 배 작게 만들 거야. 그다음부터는 게이트마다 더 작아져.', en: 'When you are ready, come to my chamber. I will make you a thousand times smaller. After that, every gate shrinks you further.' },
    ],
    objective: { ko: 'SXM 모듈 · DGX 랙 · Jetson · 이오를 살펴본 뒤 아스트라의 방으로', en: 'Inspect the SXM module, DGX rack, Jetson and EO, then enter Astra\'s chamber' },
    structures: (g) => {
      const s = [];
      s.push({ type: 'flow', pos: [0, 34], span: 30, rot: Math.PI,
        input: [{ label: { ko: 'GPU 패키지', en: 'GPU PACKAGE' }, color: 0x3a4a5a, shape: 'disc' }, { label: { ko: '다층 PCB · VRM 부품', en: 'MULTILAYER PCB · VRM PARTS' }, color: 0x123a1a, shape: 'chunk' }, { label: { ko: '솔더 페이스트 (SAC305)', en: 'SOLDER PASTE (SAC305)' }, color: 0xb0b0b8, shape: 'liquid' }],
        machine: { label: { ko: '스텐실 인쇄 → 픽앤플레이스 → 리플로우', en: 'STENCIL PRINT → PICK-AND-PLACE → REFLOW' }, color: 0x243040, glow: 0xff9f43, size: [11, 6, 9], cond: { ko: '피크 235~250 °C · 217 °C 이상 40~90초', en: 'PEAK 235–250 °C · 40–90 s ABOVE 217 °C' } },
        output: [{ label: { ko: 'SXM 모듈 (700 W)', en: 'SXM MODULE (700 W)' }, color: 0x1b3a2a, shape: 'disc' }],
        note: { ko: '솔더가 녹았다 굳으며 금속 결합을 만든다. 이 순간이 부품과 보드가 한 몸이 되는 때', en: 'Solder melts and solidifies into a metal bond: the moment the parts and the board become one' } });
      s.push({ type: 'box', pos: [-30, 24], size: [16, 1.2, 9], color: 0x123a1a, edges: 0xc9a24a, term: 'sxm', label: { ko: g.formFactor === 'PCIe' ? 'PCIe 카드 · 450 W' : `${g.formFactor} 모듈 · ${g.tdp}`, en: g.formFactor === 'PCIe' ? 'PCIe CARD · 450 W' : `${g.formFactor} MODULE · ${g.tdp}` }, triggerR: 12 });
      s.push({ type: 'box', pos: [-30, 24], y: 1.2, size: [5, 1, 5], color: 0x1a2a3a, edges: 0x76b900, solid: false });
      s.push({ type: 'row', pos: [-30, 30], y: 1.2, size: [0.8, 0.6, 0.8], count: 16, perRow: 16, gap: 0.2, color: 0x333333, glow: 0x111111, term: 'vrm', label: { ko: 'VRM · 파워 스테이지 61개', en: 'VRM · 61 POWER STAGES' }, triggerR: 8, solid: false });
      s.push({ type: 'box', pos: [-10, 0], size: [6, 22, 6], color: 0x151a22, edges: 0x76b900, term: 'dgx', label: { ko: 'DGX 랙 · GB200 NVL72 · 120 kW', en: 'DGX RACK · GB200 NVL72 · 120 kW' }, triggerR: 9 });
      s.push({ type: 'box', pos: [-2, 0], size: [6, 22, 6], color: 0x151a22, edges: 0x76b900 });
      s.push({ type: 'box', pos: [6, 0], size: [6, 22, 6], color: 0x151a22, edges: 0x76b900 });
      s.push({ type: 'box', pos: [24, 20], size: [4, 1, 4], color: 0x1a2a3a, edges: 0x5ee0ff, term: 'jetson', label: { ko: 'Jetson AGX Thor · 로봇 두뇌', en: 'JETSON AGX THOR · ROBOT BRAIN' }, triggerR: 8 });
      // 로봇 이오: 상자 조합
      s.push({ type: 'box', pos: [26, -6], size: [3, 4, 2], color: 0xe8ecf0, mat: { metal: 0.4, rough: 0.4 }, term: 'physicalai', label: { ko: '휴머노이드 이오 (EO)', en: 'HUMANOID EO' }, triggerR: 9 });
      s.push({ type: 'box', pos: [26, -6], y: 4.2, size: [1.6, 1.6, 1.6], color: 0xe8ecf0, mat: { metal: 0.4, rough: 0.4 }, solid: false });
      s.push({ type: 'box', pos: [26, -6], y: 4.6, size: [1.2, 0.4, 0.3], color: 0x5ee0ff, mat: { emissive: 0x5ee0ff, ei: 1.5 }, solid: false });
      s.push({ type: 'cylinder', pos: [30, -6], size: [0.6, 1.2], color: 0xffd166, term: 'frame', label: { ko: '컵 · 카메라 프레임 → 행동', en: 'CUP · CAMERA FRAME → ACTION' }, triggerR: 7 });
      s.push({ type: 'path', pos: [0, 0], path: [[26, -3], [24, 20], [-2, -12], [-30, 24]], color: 0xffd166, radius: 0.15 });
      s.push({ type: 'panel', pos: [0, 36], size: [22, 4], label: { ko: '세 대의 컴퓨터: DGX 학습 → Omniverse 시뮬 → Jetson 실행', en: 'THREE COMPUTERS: DGX TRAINS → OMNIVERSE SIMULATES → JETSON RUNS' } });
      return s;
    },
    packetLabel: { ko: '프레임 → 행동 33 ms', en: 'FRAME → ACTION 33 ms' }, packetSpeed: 0.05,
  },
];
