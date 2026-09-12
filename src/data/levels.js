// 본편 하강: L0 보드 → L14 실리콘 격자. 수치 출처: docs/research/01_gpu_architecture.md, 03_micro_structure.md
// heightM: 이 층에서 주인공의 실제 키(미터). shrink: 다음 층으로 갈 때 축소 배율.
const NV = 0x76b900, C = 0x5ee0ff, F = 0xffd166, CU = 0xd08a3c;
const GATE = { ko: '게이트', en: 'GATE' };
const fmt = (n) => n.toLocaleString();


// 하강 층 로고: 보드·패키지·다이의 실제 제조/설계 주체
const LOGOS_L = {
  L0: (g) => [
    { pos: [-72, 60], brand: 'NVIDIA', country: 'US', color: '#76b900', textColor: '#061000', role: { ko: `${g.name} 설계`, en: `${g.name} design` }, size: [8, 3.6] },
    { pos: [72, 60], brand: g.formFactor === 'PCIe' ? 'NVIDIA Founders' : 'Foxconn / Wistron', country: g.formFactor === 'PCIe' ? 'US' : 'TW', color: '#1a1a1a', role: { ko: '보드 조립 (SMT 라인)', en: 'Board assembly (SMT line)' } },
  ],
  L1: (g) => g.hbmSites ? [
    { pos: [-62, 56], brand: 'TSMC CoWoS', country: 'TW', color: '#c00c1e', role: { ko: g.twoDie ? 'CoWoS-L 패키징' : 'CoWoS-S 패키징', en: g.twoDie ? 'CoWoS-L packaging' : 'CoWoS-S packaging' } },
    { pos: [62, 56], brand: 'SK hynix', country: 'KR', color: '#ea002c', role: { ko: `${g.memType} 스택 공급`, en: `${g.memType} stacks` } },
  ] : [
    { pos: [-62, 56], brand: 'Micron', country: 'US', color: '#0057b8', role: { ko: 'GDDR6X 메모리 (보드 위)', en: 'GDDR6X memory (on the board)' } },
    { pos: [62, 56], brand: 'IBIDEN / Unimicron', country: 'JP', color: '#004ea2', role: { ko: 'FC-BGA 유기 기판', en: 'FC-BGA organic substrate' } },
  ],
  L2: (g) => [
    { pos: [-72, 70], brand: 'TSMC', country: 'TW', color: '#c00c1e', role: { ko: `${g.process} 공정 · 타이난 Fab 18`, en: `${g.process} process · Tainan Fab 18` } },
    { pos: [72, 70], brand: 'NVIDIA', country: 'US', color: '#76b900', textColor: '#061000', role: { ko: `${g.arch.en} 아키텍처 설계`, en: `${g.arch.en} architecture design` } },
  ],
};

// ---------------- HBM 지선: L1 의 보라색 게이트로 진입, H2 에서 패키지로 복귀 ----------------
export const HBM_LEVELS = [
  {
    id: 'H1', chapter: 'hbm', name: { ko: 'HBM 스택 내부', en: 'INSIDE THE HBM STACK' }, subtitle: (g) => ({ ko: `${g.memType} · DRAM 다이 ${g.memType === 'HBM3e' ? 12 : 8}층 · TSV`, en: `${g.memType} · ${g.memType === 'HBM3e' ? 12 : 8} DRAM dies · TSV` }), heightM: 2e-5, shrink: 667, next: 'H2',
    size: 40, groundType: 'metal', palette: { sky: 0x0a0818, fog: 0x0c0a1c, ground: '#141026', groundLine: 'rgba(160,110,255,0.35)', hemiSky: 0xc0b0ff, hemiGround: 0x0a0818, accent: 0xb56cff, dust: 0xb56cff }, fogDensity: 0.008, sunIntensity: 1.5, ambient: 'hum',
    terms: ['hbm', 'tsv', 'microbump', 'memctrl'], gate: { pos: [0, -14], required: 3, label: { ko: 'DRAM 셀 속으로', en: 'INTO A DRAM CELL' } }, spawn: [0, 34],
    narration: [
      { ko: (g) => `HBM 탑 안이야. DRAM 다이 ${g.memType === 'HBM3e' ? 12 : 8}장이 30마이크로미터까지 얇게 갈려 층층이 쌓여 있어. 맨 아래는 GPU와 대화하는 베이스 로직 다이.`, en: (g) => `Inside the HBM tower. ${g.memType === 'HBM3e' ? 12 : 8} DRAM dies, thinned to 30 micrometres, stacked floor on floor. The base logic die at the bottom talks to the GPU.` },
      { ko: '구리 기둥 TSV가 모든 층을 꿰뚫어. 다이 한 장에 수천 개. 계단으로 꼭대기까지 올라가 봐. 제트팩(F)을 써도 돼.', en: 'Copper TSV pillars pierce every floor, thousands per die. Take the stairs to the top, or use the jetpack (F).' },
    ],
    objective: { ko: '계단으로 층을 오르며 TSV·마이크로범프·인터페이스를 살펴보라', en: 'Climb the floors; inspect the TSVs, microbumps and the interface' },
    structures: (g) => {
      const s = []; const n = g.memType === 'HBM3e' ? 12 : 8; const fh = 2.2; const W = 26, D = 20;
      s.push({ type: 'box', pos: [0, 0], size: [W + 2, 1.2, D + 2], color: 0x2a1a40, edges: 0xb56cff, top: 0x3a2a5a, term: 'memctrl', label: { ko: '베이스 로직 다이 · 1,024-bit 인터페이스', en: 'BASE LOGIC DIE · 1,024-bit INTERFACE' }, triggerR: 16 });
      for (let i = 0; i < n; i++) {
        const y = 1.2 + i * fh;
        s.push({ type: 'box', pos: [0, 0], y: y + fh - 0.5, size: [W, 0.5, D], color: 0x1c3550, edges: 0x5ee0ff, top: 0x244a6a, term: i === 0 ? 'hbm' : undefined, label: i === 0 || i === n - 1 ? { ko: `DRAM 다이 ${i + 1}/${n} · 두께 ≈30 μm`, en: `DRAM DIE ${i + 1}/${n} · ≈30 μm THICK` } : undefined, labelScale: 0.7, triggerR: 16 });
        s.push({ type: 'row', pos: [0, D / 2 - 1], y: y + 0.1, size: [0.5, 0.35, 0.5], count: 24, perRow: 24, gap: 0.55, color: 0xd08a3c, glow: 0x804010, solid: false, term: i === 1 ? 'microbump' : undefined, label: i === 1 ? { ko: '마이크로범프 · 층간 연결', en: 'MICROBUMPS · DIE-TO-DIE' } : undefined, triggerR: 8 });
        for (let k = 0; k < 4; k++) s.push({ type: 'box', pos: [W / 2 + 1.5, -D / 2 + 2 + k * 2.2], y, size: [3, 0.55 * (k + 1), 2], color: 0x3a3050, edges: 0x8a6acc }); // 계단
      }
      for (let k = 0; k < 3; k++) s.push({ type: 'box', pos: [W / 2 + 1.5, D / 2 + 3 + k * 2.2], size: [3, 0.4 * (3 - k), 2], color: 0x3a3050, edges: 0x8a6acc }); // 바닥 → 베이스 다이 계단
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) s.push({ type: 'cylinder', pos: [(i - 1.5) * 6, (j - 1) * 6], size: [0.45, 1.2 + n * fh], color: 0xd08a3c, mat: { metal: 0.9, rough: 0.3, emissive: 0x603010, ei: 0.4 }, term: i === 0 && j === 0 ? 'tsv' : undefined, label: i === 0 && j === 0 ? { ko: 'TSV · 실리콘 관통 전극', en: 'TSV · THROUGH-SILICON VIA' } : undefined, triggerR: 5 });
      s.push({ type: 'panel', pos: [-22, 24], size: [12, 4], label: { ko: `${g.memType} · 스택당 ${g.memType === 'HBM3e' ? '≈1.2 TB/s' : '819 GB/s'}`, en: `${g.memType} · ${g.memType === 'HBM3e' ? '≈1.2 TB/s' : '819 GB/s'} PER STACK` } });
      s.push({ type: 'panel', pos: [22, 24], size: [12, 4], label: { ko: '스택 높이 720~775 μm (JEDEC)', en: 'STACK HEIGHT 720–775 μm (JEDEC)' } });
      s.push({ type: 'path', pos: [0, 0], path: [[0, 34], [14, 10], [14, -8], [0, -12]], color: F, radius: 0.15 });
      return s;
    },
    gateY: (g) => 1.2 + (g.memType === 'HBM3e' ? 12 : 8) * 2.2,
    packetLabel: { ko: '읽기 요청 · 1,024-bit', en: 'READ REQUEST · 1,024-bit' },
  },
  {
    id: 'H2', chapter: 'hbm', name: { ko: 'DRAM 셀 · 1T1C', en: 'DRAM CELL · 1T1C' }, subtitle: { ko: '트랜지스터 1개 + 커패시터 1개 · 64 ms 리프레시', en: '1 transistor + 1 capacitor · 64 ms refresh' }, heightM: 3e-8, shrink: 1, next: 'L1',
    size: 34, groundType: 'grid', palette: { sky: 0x0a0a1a, fog: 0x0c0c20, ground: '#14142a', groundLine: 'rgba(160,110,255,0.3)', hemiSky: 0xc0b0ff, hemiGround: 0x0a0a1a, accent: 0xb56cff, dust: 0xb56cff }, fogDensity: 0.013, sunIntensity: 1.5, ambient: 'clock',
    terms: ['dram', 'ecc', 'latency'], gate: { pos: [0, -28], required: 2, label: { ko: '패키지로 돌아가기', en: 'BACK TO THE PACKAGE' } }, spawn: [0, 30],
    narration: [
      { ko: '1비트를 저장하는 가장 작은 방. 트랜지스터 하나가 문이고, 커패시터 하나가 물통이야. 전하가 새니까 64밀리초마다 다시 채워 줘야 해. 그게 리프레시.', en: 'The smallest room storing one bit: one transistor is the door, one capacitor the bucket. Charge leaks, so it is refilled every 64 milliseconds. That is refresh.' },
      { ko: 'SRAM 서랍보다 작지만 느려. 그래서 GPU 다이가 아니라 별도 칩에 두고 탑으로 쌓는 거야. 여기 게이트는 패키지 층으로 돌아가.', en: 'Smaller than an SRAM cell but slower, so it lives on separate chips stacked into towers. This gate takes you back to the package.' },
    ],
    objective: { ko: '커패시터·액세스 트랜지스터·센스 앰프를 살펴본 뒤 패키지로', en: 'Inspect the capacitor, access transistor and sense amp, then return' },
    structures: (g) => [
      { type: 'cylinder', pos: [0, -4], size: [3, 14], color: 0x5a3a8a, mat: { metal: 0.6, rough: 0.35, emissive: 0x2a1050, ei: 0.5 }, term: 'dram', label: { ko: '커패시터 · 전하(비트) 저장', en: 'CAPACITOR · STORES CHARGE (THE BIT)' }, triggerR: 8 },
      { type: 'box', pos: [0, 8], size: [5, 3, 4], color: 0x3a5a8a, edges: C, label: { ko: '액세스 트랜지스터 (문)', en: 'ACCESS TRANSISTOR (THE DOOR)' } },
      { type: 'pipe', pos: [0, 0], path: [[-26, 4.5, 8], [26, 4.5, 8]], radius: 0.35, color: F, glow: 0x806020, label: { ko: '워드라인 (행 선택)', en: 'WORDLINE (ROW SELECT)' } },
      { type: 'pipe', pos: [0, 0], path: [[6, 0.5, -26], [6, 0.5, 26]], radius: 0.3, color: CU, glow: 0x603010, label: { ko: '비트라인', en: 'BITLINE' } },
      { type: 'box', pos: [6, 22], size: [6, 3, 4], color: 0x2a3a2a, edges: NV, term: 'latency', label: { ko: '센스 앰프 · 수십 mV 증폭', en: 'SENSE AMP · AMPLIFIES TENS OF mV' }, triggerR: 8 },
      { type: 'panel', pos: [-20, -18], size: [12, 4], term: 'ecc', label: { ko: '리프레시 64 ms = 클럭 1.27억 번', en: 'REFRESH 64 ms = 127M CLOCKS' }, triggerR: 8 },
      { type: 'panel', pos: [20, -18], size: [12, 4], label: { ko: '행 버퍼 · 16채널 × 64-bit', en: 'ROW BUFFER · 16 CH × 64-bit' } },
      { type: 'path', pos: [0, 0], path: [[0, 30], [0, 8], [0, -2], [0, -24]], color: F, radius: 0.15 },
    ],
    packetLabel: { ko: '전하', en: 'CHARGE' },
  },
];

export const LEVELS = [
  // ---------------- L0 보드 ----------------
  {
    id: 'L0', chapter: 'descent', logos: LOGOS_L.L0, name: { ko: '보드 / 모듈', en: 'BOARD' }, subtitle: (g) => ({ ko: `${g.formFactor} · ${g.tdp}`, en: `${g.formFactor} · ${g.tdp}` }), heightM: 1.5e-3, shrink: 3,
    size: 90, groundType: 'pcb', palette: { sky: 0x06101c, fog: 0x081426, ground: '#0f3a1f', groundLine: 'rgba(201,162,74,0.45)', pad: '#c9a24a', hemiSky: 0x9fb7d9, hemiGround: 0x06200e, accent: NV, dust: 0x76b900 }, fogDensity: 0.008, sunIntensity: 1.6, ambient: 'fan',
    terms: ['pcb', 'package', 'vrm', 'nvlink', 'pcie', 'heat'], gate: { pos: [0, -12], required: 4, label: { ko: '패키지 안으로', en: 'INTO THE PACKAGE' } }, spawn: [0, 70],
    narration: [
      { ko: '자, 천 배 작아졌어. 네 키는 이제 1.5밀리미터. 발밑의 초록 땅은 유리섬유와 구리로 짠 회로 기판이야.', en: 'There. A thousand times smaller. You are 1.5 millimetres tall now. The green ground is a circuit board woven from fibreglass and copper.' },
      { ko: '저 거대한 사각 산이 GPU 패키지. 옆의 검은 언덕들은 전압 조정 회로. 700와트를 1볼트 남짓으로 바꿔 넣어 주지.', en: 'That huge square mountain is the GPU package. The black hills beside it are voltage regulators, turning 700 watts into just over one volt.' },
    ],
    objective: { ko: '보드 위 구조물을 살펴보고 패키지 게이트로', en: 'Inspect the board, then enter the package gate' },
    structures: (g) => {
      const s = [];
      s.push({ type: 'flow', pos: [0, 52], span: 26, rot: Math.PI,
        input: [{ label: { ko: '12 V 입력 전력', en: '12 V INPUT POWER' }, color: 0xffd166, shape: 'ion' }],
        machine: { label: { ko: 'VRM · 강압 스위칭 컨버터', en: 'VRM · BUCK CONVERTER' }, color: 0x2a2a2a, glow: 0xff9f43, cond: { ko: '초당 수십만 번 켜고 끄며 전압을 낮춘다', en: 'SWITCHES HUNDREDS OF THOUSANDS OF TIMES PER SECOND' } },
        output: [{ label: { ko: '약 1 V · 수백 A 로 GPU에 공급', en: '≈1 V AT HUNDREDS OF AMPS' }, color: 0x76b900, shape: 'ion' }, { label: { ko: '열 (변환 손실)', en: 'HEAT (CONVERSION LOSS)' }, color: 0x8a5a3a, shape: 'gas', waste: true }],
        note: { ko: '전력 = 전압 × 전류. 700 W를 1 V로 쓰면 700 A가 흐른다', en: 'Power = volts × amps: drawing 700 W at 1 V means 700 amperes' } });
      const pk = g.formFactor === 'PCIe' ? 26 : 34;
      s.push({ type: 'box', pos: [0, -30], size: [pk, 6, pk], color: 0x1c2733, mat: { metal: 0.6, rough: 0.35 }, edges: 0x76b900, top: 0x2a3a4a, term: 'package', label: { ko: 'GPU 패키지', en: 'GPU PACKAGE' }, labelScale: 1.4, triggerR: pk / 2 + 6 });
      // VRM: 인덕터 열
      const nV = g.formFactor === 'PCIe' ? 22 : 30;
      s.push({ type: 'row', pos: [-52, -20], size: [3, 2.2, 3], count: nV, perRow: 3, gap: 1.2, color: 0x2a2a2a, glow: 0x111111, term: 'vrm', label: { ko: `VRM · ${g.tdp}`, en: `VRM · ${g.tdp}` }, triggerR: 12 });
      s.push({ type: 'row', pos: [52, -20], size: [3, 2.2, 3], count: nV, perRow: 3, gap: 1.2, color: 0x2a2a2a, glow: 0x111111 });
      if (g.formFactor === 'PCIe') {
        // GDDR6X 12개
        for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; s.push({ type: 'box', pos: [Math.cos(a) * 26, -30 + Math.sin(a) * 26], size: [6, 1.6, 8], color: 0x111111, edges: 0x556677, label: i === 0 ? { ko: 'GDDR6X 2 GB × 12', en: 'GDDR6X 2 GB × 12' } : undefined, rot: -a }); }
        s.push({ type: 'box', pos: [0, 60], size: [40, 1.5, 6], color: 0xc9a24a, mat: { metal: 0.9, rough: 0.3 }, term: 'pcie', label: { ko: 'PCIe Gen4 ×16 커넥터', en: 'PCIe Gen4 ×16 EDGE' }, triggerR: 12 });
        s.push({ type: 'box', pos: [60, -50], size: [8, 4, 6], color: 0x222222, term: 'nvlink', label: { ko: '16핀 12VHPWR 전원 · 450 W', en: '16-PIN 12VHPWR POWER · 450 W' }, triggerR: 9 });
        s.push({ type: 'row', pos: [0, 20], size: [60, 5, 0.6], count: 8, perRow: 1, gap: 2.4, color: 0x8a94a0, glow: 0x111111, term: 'heat', label: { ko: '베이퍼 챔버 · 히트싱크 핀', en: 'VAPOR CHAMBER · HEATSINK FINS' }, triggerR: 14, solid: true });
      } else {
        s.push({ type: 'box', pos: [0, 62], size: [50, 2, 5], color: 0x2a3340, edges: 0xc9a24a, term: 'nvlink', label: { ko: `NVLink 메자닌 커넥터 · ${g.nvlink}`, en: `NVLink MEZZANINE · ${g.nvlink}` }, triggerR: 14 });
        s.push({ type: 'box', pos: [0, 76], size: [50, 2, 5], color: 0x2a3340, edges: 0xc9a24a, term: 'pcie', label: { ko: '전원 · PCIe Gen5 메자닌', en: 'POWER · PCIe Gen5 MEZZANINE' }, triggerR: 14 });
        s.push({ type: 'panel', pos: [-60, 30], size: [16, 5], term: 'heat', label: { ko: '팬 없음 · 콜드플레이트 수냉', en: 'NO FAN · LIQUID COLD PLATE' }, triggerR: 10 });
      }
      s.push({ type: 'panel', pos: [60, 30], size: [16, 5], term: 'pcb', label: { ko: '다층 PCB · 구리 배선', en: 'MULTILAYER PCB · COPPER TRACES' }, triggerR: 10 });
      s.push({ type: 'path', pos: [0, 0], path: [[0, 70], [0, 40], [-20, 10], [0, -8]], color: F, radius: 0.18 });
      return s;
    },
    packetHint: { ko: '이 금빛 조각이 이오의 카메라 프레임이야. 게이트마다 같이 내려갈 거야.', en: 'That golden shard is EO\'s camera frame. It descends with you at every gate.' },
  },
  // ---------------- L1 패키지 ----------------
  {
    id: 'L1', chapter: 'descent', logos: LOGOS_L.L1, name: { ko: '패키지 / 인터포저', en: 'PACKAGE' }, subtitle: (g) => ({ ko: g.hbmSites ? `CoWoS · HBM ${g.hbmStacks}스택 활성` : '유기 기판 플립칩', en: g.hbmSites ? `CoWoS · ${g.hbmStacks} HBM stacks active` : 'Organic flip-chip' }), heightM: 5e-4, shrink: 2,
    size: 80, groundType: 'silicon', palette: { sky: 0x0a0f18, fog: 0x0c1220, ground: '#1a2230', groundLine: 'rgba(255,209,102,0.35)', groundLine2: 'rgba(255,209,102,0.08)', hemiSky: 0xbcd0ff, hemiGround: 0x0a0f18, accent: F, dust: 0xffd166 }, fogDensity: 0.009, sunIntensity: 1.5, ambient: 'hum',
    terms: ['interposer', 'die', 'hbm', 'tsv', 'microbump', 'reticle'], gate: { pos: [0, -8], required: 4, label: { ko: '다이 안으로', en: 'INTO THE DIE' } }, spawn: [0, 66],
    sideGate: (g) => g.hbmSites ? { pos: [-(g.twoDie ? 46 : 32), -30 + (0 - (g.hbmSites / 2 - 1) / 2) * 16 + 11], target: 'H1', label: { ko: 'HBM 탑 내부로', en: 'INTO THE HBM TOWER' } } : null,
    narration: [
      { ko: '뚜껑을 열었어. 여기는 인공 지반, 인터포저. 그 위에 도시(다이)와 창고탑(HBM)이 서 있지.', en: 'Lid off. This is the artificial ground, the interposer. On it stand the city (the die) and the warehouse towers (HBM).' },
      { ko: (g) => g.hbmSites ? `창고탑 자리는 ${g.hbmSites}개인데 ${g.hbmStacks}개만 불이 켜져 있어. 나머지는 비닝으로 꺼 둔 거야.` : '이 GPU는 메모리를 패키지 밖 보드에 두었어. 그래서 인터포저가 필요 없지.', en: (g) => g.hbmSites ? `There are ${g.hbmSites} tower sites but only ${g.hbmStacks} are lit. The rest were fused off in binning.` : 'This GPU keeps its memory out on the board, so it needs no interposer.' },
      { ko: (g) => g.hbmSites ? '보라색 게이트로 들어가면 HBM 탑 안을 볼 수 있어. 12층짜리 DRAM 아파트야. 지선이니까 돌아올 수 있어.' : '', en: (g) => g.hbmSites ? 'The purple gate leads inside an HBM tower, a twelve-storey DRAM apartment block. It is a side branch; you can come back.' : '' },
    ],
    objective: { ko: 'HBM 탑을 오르고 다이 게이트로', en: 'Climb an HBM tower, then enter the die gate' },
    structures: (g) => {
      const s = [];
      if (g.twoDie) {
        s.push({ type: 'box', pos: [-16, -30], size: [28, 5, 30], color: 0x121c2a, edges: NV, top: 0x1f2f44, term: 'die', label: { ko: '다이 1 · 104 B', en: 'DIE 1 · 104 B' }, triggerR: 22 });
        s.push({ type: 'box', pos: [16, -30], size: [28, 5, 30], color: 0x121c2a, edges: NV, top: 0x1f2f44, label: { ko: '다이 2 · 104 B', en: 'DIE 2 · 104 B' } });
        s.push({ type: 'pipe', pos: [0, 0], path: [[-8, 5.5, -30], [8, 5.5, -30]], radius: 0.7, color: C, glow: C, term: 'reticle', label: { ko: 'NV-HBI · 10 TB/s', en: 'NV-HBI · 10 TB/s' } });
      } else {
        s.push({ type: 'box', pos: [0, -30], size: [30, 5, 30], color: 0x121c2a, edges: NV, top: 0x1f2f44, term: 'die', label: { ko: `${g.arch.en.split(' ')[0]} 다이 · ${g.dieMm2} · ${g.transistorsKo}`, en: `${g.arch.en.split(' ')[0]} DIE · ${g.dieMm2} · ${g.transistors}` }, labelScale: 1.3, triggerR: 24 });
        s.push({ type: 'panel', pos: [0, -60], size: [18, 5], term: 'reticle', label: { ko: '레티클 한계 858 mm²', en: 'RETICLE LIMIT 858 mm²' }, triggerR: 10 });
      }
      const n = g.hbmSites;
      for (let i = 0; i < n; i++) { const side = i < n / 2 ? -1 : 1; const idx = i % (n / 2); const z = -30 + (idx - (n / 2 - 1) / 2) * 16; const on = i < g.hbmStacks; s.push({ type: 'tower', pos: [side * (g.twoDie ? 46 : 32), z], size: [10, on ? 12 : 9, 12], layers: 8, color: on ? 0x2b4a6a : 0x1a1f28, gapColor: on ? C : 0x2a3038, baseColor: 0x1a2a3a, pillars: on && i === 0 ? CU : undefined, term: i === 0 ? 'hbm' : (i === 1 ? 'tsv' : undefined), label: i === 0 ? { ko: `${g.memType} 스택 · ${on ? '활성' : '비활성'}`, en: `${g.memType} STACK · ${on ? 'ACTIVE' : 'DISABLED'}` } : (on ? undefined : { ko: '비활성 (비닝)', en: 'DISABLED (BINNING)' }), triggerR: 12 }); }
      if (!n) { for (let i = 0; i < 24; i++) s.push({ type: 'box', pos: [-40 + (i % 12) * 7.2, i < 12 ? 20 : 30], size: [3, 1.2, 2], color: 0x8a7a3a, mat: { metal: 0.6 }, label: i === 0 ? { ko: '디커플링 커패시터', en: 'DECOUPLING CAPACITORS' } : undefined }); }
      s.push({ type: 'row', pos: [0, 40], size: [1.2, 0.8, 1.2], count: 64, perRow: 16, gap: 1.0, color: CU, glow: 0x603010, term: 'microbump', label: { ko: '마이크로범프 · 40 μm 간격', en: 'MICROBUMPS · 40 μm PITCH' }, triggerR: 12, solid: false });
      s.push({ type: 'panel', pos: [0, 58], size: [22, 5], term: 'interposer', label: { ko: g.hbmSites ? (g.twoDie ? 'CoWoS-L 인터포저' : 'CoWoS-S 실리콘 인터포저') : 'ABF 유기 기판', en: g.hbmSites ? (g.twoDie ? 'CoWoS-L INTERPOSER' : 'CoWoS-S SILICON INTERPOSER') : 'ABF ORGANIC SUBSTRATE' }, triggerR: 12 });
      s.push({ type: 'path', pos: [0, 0], path: [[0, 66], [-24, 40], [-30, -14], [-4, -6]], color: F, radius: 0.18 });
      return s;
    },
  },
  // ---------------- L2 다이 플로어플랜 ----------------
  {
    id: 'L2', chapter: 'descent', logos: LOGOS_L.L2, name: { ko: '다이 · 도시', en: 'THE DIE' }, subtitle: (g) => ({ ko: `${g.dieMm2} · 트랜지스터 ${g.transistorsKo} 개`, en: `${g.dieMm2} · ${g.transistors} transistors` }), heightM: 2.5e-4, shrink: 4,
    size: 84, groundType: 'grid', palette: { sky: 0x050a14, fog: 0x070d1a, ground: '#0d1524', groundLine: 'rgba(118,185,0,0.35)', groundLine2: 'rgba(94,224,255,0.06)', hemiSky: 0xa0c0ff, hemiGround: 0x050a14, accent: NV, dust: 0x5ee0ff }, fogDensity: 0.008, sunIntensity: 1.6, ambient: 'hum', ceiling: 40,
    terms: ['gpc', 'l2', 'memctrl', 'gigathread', 'kernel', 'nvlink'], gate: { pos: [0, -6], required: 4, label: { ko: 'GPC 안으로', en: 'INTO A GPC' } }, spawn: [0, 74],
    narration: [
      { ko: (g) => `도시에 도착했어. 트랜지스터 ${g.transistorsKo} 개. 사람 뇌의 뉴런 수와 비슷해. 위에서 보면 격자 도시가 보일 거야. C를 눌러 봐.`, en: (g) => `Welcome to the city. ${g.transistors} transistors, about as many as neurons in a human brain. Press C to see the grid from above.` },
      { ko: (g) => `행정구(GPC)가 ${g.gpcs}개, 중앙에 물류센터(L2 캐시) ${g.l2}, 가장자리에 항구(메모리 컨트롤러, NVLink, PCIe).`, en: (g) => `${g.gpcs} districts (GPCs), central depots (L2 cache, ${g.l2}), and harbours along the edge (memory controllers, NVLink, PCIe).` },
    ],
    objective: { ko: '플로어플랜을 걸으며 블록 4개 이상을 살펴보라', en: 'Walk the floorplan and inspect at least 4 blocks' },
    structures: (g) => {
      const cells = []; const n = g.gpcs; const cols = 2; const rows = Math.ceil(n / cols);
      for (let i = 0; i < n; i++) { const c = i % cols, r = Math.floor(i / cols); cells.push({ x: (c === 0 ? -1 : 1) * 40, z: -44 + r * (84 / rows) + 84 / rows / 2, w: 30, d: 84 / rows - 4, h: 3, color: 0x152a44, label: { ko: `GPC ${i}`, en: `GPC ${i}` }, term: i === 0 ? 'gpc' : undefined, labelScale: 0.9 }); }
      const l2n = g.id === 'b200' ? 4 : 2; for (let i = 0; i < l2n; i++) cells.push({ x: 0, z: -30 + i * (60 / l2n) + 30 / l2n, w: 16, d: 60 / l2n - 3, h: 2, color: 0x2a3a1a, label: { ko: `L2 파티션 ${i}`, en: `L2 PARTITION ${i}` }, term: i === 0 ? 'l2' : undefined, labelScale: 0.8 });
      cells.push({ x: 0, z: 40, w: 16, d: 8, h: 2.5, color: 0x3a2a1a, label: { ko: '기가스레드 엔진', en: 'GIGATHREAD ENGINE' }, term: 'gigathread', labelScale: 0.8 });
      cells.push({ x: 0, z: -50, w: 16, d: 8, h: 2.5, color: 0x3a1a2a, label: { ko: g.nvlink === 'none' ? 'NVENC ×2 · NVDEC' : `NVLink ${g.nvlink}`, en: g.nvlink === 'none' ? 'NVENC ×2 · NVDEC' : `NVLink ${g.nvlink}` }, term: 'nvlink', labelScale: 0.8 });
      cells.push({ x: 0, z: 58, w: 16, d: 6, h: 2.5, color: 0x2a2a3a, label: { ko: 'PCIe · 호스트 인터페이스', en: 'PCIe · HOST INTERFACE' }, term: 'kernel', labelScale: 0.8 });
      const mc = g.hbmSites ? g.hbmSites * 2 : 12; for (let i = 0; i < mc; i++) { const side = i < mc / 2 ? -1 : 1; const idx = i % (mc / 2); cells.push({ x: side * 62, z: -44 + idx * (88 / (mc / 2)) + 44 / (mc / 2), w: 6, d: 88 / (mc / 2) - 2, h: 2, color: 0x1a3a3a, label: idx === 0 && side === -1 ? { ko: `메모리 컨트롤러 × ${mc}`, en: `MEMORY CONTROLLER × ${mc}` } : undefined, term: idx === 0 && side === -1 ? 'memctrl' : undefined, labelScale: 0.7 }); }
      const s = [{ type: 'grid', pos: [0, 0], cells, edge: NV }];
      s.push({ type: 'path', pos: [0, 0], path: [[0, 74], [0, 46], [8, 20], [0, -2], [40, -20]], color: F, radius: 0.18 });
      if (g.hbmSites) { s.push({ type: 'panel', pos: [-72, 0], size: [10, 5], color: 0x2a1040, glow: 0x6a2aa0, label: { ko: `← HBM ${g.hbmStacks}스택 · 다이 밖 패키지 층(L1)에`, en: `← HBM ×${g.hbmStacks} · outside the die, on the package (L1)` } }); s.push({ type: 'panel', pos: [72, 0], size: [10, 5], color: 0x2a1040, glow: 0x6a2aa0, label: { ko: 'HBM → 메모리 컨트롤러 → L2', en: 'HBM → MEMORY CONTROLLER → L2' } }); }
      return s;
    },
    packetHint: { ko: '프레임은 PCIe로 들어와 기가스레드가 배분한 SM으로 간다. HBM에서 가중치를 실어 나르는 길이 L2를 지나.', en: 'The frame enters via PCIe and heads to an SM assigned by GigaThread. Weights arrive from HBM through L2.' },
  },
  // ---------------- L3 GPC ----------------
  {
    id: 'L3', chapter: 'descent', name: { ko: 'GPC · 행정구', en: 'GPC' }, subtitle: (g) => ({ ko: `TPC ${g.tpcsPerGpc}개 · SM ${g.tpcsPerGpc * 2}개`, en: `${g.tpcsPerGpc} TPCs · ${g.tpcsPerGpc * 2} SMs` }), heightM: 8e-5, shrink: 3,
    size: 64, groundType: 'grid', palette: { sky: 0x08101c, fog: 0x0a1424, ground: '#101c2c', groundLine: 'rgba(94,224,255,0.3)', groundLine2: 'rgba(94,224,255,0.06)', hemiSky: 0xa0c0ff, hemiGround: 0x08101c, accent: C, dust: 0x5ee0ff }, fogDensity: 0.01, sunIntensity: 1.5, ambient: 'hum', ceiling: 30,
    terms: ['tpc', 'raster', 'yield', 'kernel'], gate: { pos: [0, -50], required: 3, label: { ko: 'TPC 안으로', en: 'INTO A TPC' } }, spawn: [0, 56],
    narration: [
      { ko: (g) => `행정구 하나. 블록(TPC)이 ${g.tpcsPerGpc}개, 블록마다 집(SM) 두 채. 어두운 블록은 결함이 있어 퓨즈로 꺼 둔 곳이야.`, en: (g) => `One district. ${g.tpcsPerGpc} blocks (TPCs), two houses (SMs) each. The dark block had a defect and was fused off.` },
      { ko: (g) => g.graphics ? '광장의 래스터 엔진이 삼각형을 픽셀로 바꿔. 게임 화면은 여기서 태어나지.' : '가운데 광장은 래스터 엔진 자리인데, 이 GPU는 그래픽을 거의 안 해. AI 전용이거든.', en: (g) => g.graphics ? 'The raster engine in the plaza turns triangles into pixels. Game frames are born here.' : 'The plaza is where a raster engine would sit, but this GPU barely does graphics. It is built for AI.' },
    ],
    objective: { ko: 'TPC 블록과 래스터 광장을 살펴보라', en: 'Inspect a TPC block and the raster plaza' },
    structures: (g) => {
      const s = []; const n = g.tpcsPerGpc; const perRow = Math.ceil(n / 2);
      for (let i = 0; i < n; i++) { const c = i % perRow, r = Math.floor(i / perRow); const x = (c - (perRow - 1) / 2) * 13, z = r === 0 ? 20 : -20; const off = i === n - 1 && g.sms < g.smsFull; s.push({ type: 'box', pos: [x - 3, z], size: [5, 6, 10], color: off ? 0x151a20 : 0x1b3550, edges: off ? 0x333333 : C, top: off ? undefined : 0x2a4a6a }); s.push({ type: 'box', pos: [x + 3, z], size: [5, 6, 10], color: off ? 0x151a20 : 0x1b3550, edges: off ? 0x333333 : C, top: off ? undefined : 0x2a4a6a, term: i === 0 ? 'tpc' : (off ? 'yield' : undefined), label: i === 0 ? { ko: 'TPC · SM 2채', en: 'TPC · 2 SMs' } : (off ? { ko: '비활성 TPC', en: 'DISABLED TPC' } : undefined), triggerR: 9 }); }
      s.push({ type: 'disc', pos: [0, 0], size: [9, 0.4], color: 0x1e3a5a, glow: 0x0a2040, rim: C, term: 'raster', label: g.graphics ? { ko: '래스터 엔진 · ROP 16', en: 'RASTER ENGINE · 16 ROPs' } : { ko: '래스터 엔진 (그래픽 GPU만)', en: 'RASTER ENGINE (GRAPHICS GPUS)' }, triggerR: 11 });
      s.push({ type: 'panel', pos: [-40, 0], size: [14, 5], term: 'kernel', label: { ko: '스레드 블록 클러스터 · 같은 GPC', en: 'THREAD BLOCK CLUSTER · SAME GPC' }, triggerR: 9 });
      s.push({ type: 'path', pos: [0, 0], path: [[0, 56], [0, 34], [-13, 20], [0, 0], [0, -46]], color: F, radius: 0.18 });
      return s;
    },
  },
  // ---------------- L4 TPC ----------------
  {
    id: 'L4', chapter: 'descent', name: { ko: 'TPC · 블록', en: 'TPC' }, subtitle: { ko: 'SM 2채 + PolyMorph 엔진', en: '2 SMs + PolyMorph engine' }, heightM: 3e-5, shrink: 2,
    size: 44, groundType: 'grid', palette: { sky: 0x0a1218, fog: 0x0c161e, ground: '#122028', groundLine: 'rgba(118,185,0,0.3)', hemiSky: 0xb0d0c0, hemiGround: 0x0a1218, accent: NV, dust: 0x76b900 }, fogDensity: 0.012, sunIntensity: 1.5, ambient: 'hum', ceiling: 22,
    terms: ['sm', 'tpc', 'l1shared'], gate: { pos: [-12, -8], required: 2, label: { ko: 'SM 안으로', en: 'INTO AN SM' } }, spawn: [0, 36],
    narration: [
      { ko: '집 두 채가 마당을 공유하는 블록. 그래픽 GPU라면 마당에 PolyMorph 엔진이 있어 3D 도형을 다듬지.', en: 'Two houses sharing a yard. On a graphics GPU the yard holds a PolyMorph engine that shapes 3D geometry.' },
      { ko: '왼쪽 집으로 들어가자. 프레임 데이터가 그리로 배정됐어.', en: 'Let\'s enter the left house. The frame data was assigned there.' },
    ],
    objective: { ko: 'SM 두 채를 살펴보고 왼쪽 SM으로', en: 'Inspect both SMs, then enter the left one' },
    structures: (g) => [
      { type: 'box', pos: [-12, -12], size: [16, 9, 20], color: 0x1c3a2a, edges: NV, top: 0x2a5a3a, term: 'sm', label: { ko: 'SM 0 · CUDA 코어 128', en: 'SM 0 · 128 CUDA CORES' }, triggerR: 16 },
      { type: 'box', pos: [12, -12], size: [16, 9, 20], color: 0x1c3a2a, edges: NV, top: 0x2a5a3a, term: 'l1shared', label: { ko: `SM 1 · L1/공유 ${g.l1kb} KB`, en: `SM 1 · L1/SHARED ${g.l1kb} KB` }, triggerR: 16 },
      { type: 'disc', pos: [0, 12], size: [6, 0.5], color: 0x1e2a3a, glow: 0x102030, rim: NV, term: 'tpc', label: g.graphics ? { ko: 'PolyMorph 엔진', en: 'POLYMORPH ENGINE' } : { ko: 'PolyMorph 엔진 (그래픽 TPC만)', en: 'POLYMORPH ENGINE (GRAPHICS TPCS)' }, triggerR: 9 },
      { type: 'path', pos: [0, 0], path: [[0, 36], [0, 20], [-8, 4], [-12, -4]], color: F, radius: 0.18 },
    ],
  },
  // ---------------- L5 SM 마을 ----------------
  {
    id: 'L5', chapter: 'descent', name: { ko: 'SM · 마을', en: 'STREAMING MULTIPROCESSOR' }, subtitle: (g) => ({ ko: `처리 블록 4 · 텐서 코어 4 · L1 ${g.l1kb} KB`, en: `4 processing blocks · 4 Tensor Cores · L1 ${g.l1kb} KB` }), heightM: 1.5e-5, shrink: 2.5,
    size: 60, groundType: 'grid', palette: { sky: 0x1a1208, fog: 0x1e160a, ground: '#2a2014', groundLine: 'rgba(255,170,60,0.3)', groundLine2: 'rgba(255,170,60,0.06)', hemiSky: 0xffd0a0, hemiGround: 0x1a1208, accent: 0xffa94d, dust: 0xffa94d }, fogDensity: 0.011, sunIntensity: 1.7, ambient: 'clock', ceiling: 26,
    terms: ['sm', 'subpartition', 'l1shared', 'tma', 'tensorcore', 'sfu'], gate: { pos: [-18, -22], required: 4, label: { ko: '처리 블록 안으로', en: 'INTO A PROCESSING BLOCK' } }, spawn: [0, 52],
    narration: [
      { ko: (g) => `마을이야. 방(처리 블록) 4개가 각자 32명 작업조에 명령을 내리고, 가운데 창고(L1/공유 메모리 ${g.l1kb} KB)를 함께 써. 동시에 최대 ${g.maxWarps * 32}명이 살 수 있어.`, en: (g) => `The village. Four rooms (processing blocks) each command crews of 32 and share the central pantry (L1/shared memory, ${g.l1kb} KB). Up to ${g.maxWarps * 32} threads live here at once.` },
      { ko: '소리 들려? 저 박동이 클럭이야. 약 2기가헤르츠. 한 박자 0.5나노초.', en: 'Hear that? The pulse is the clock. About 2 gigahertz. One beat every half a nanosecond.' },
    ],
    objective: { ko: '창고 · 하역장 · 텐서 코어 공장 · 처리 블록을 살펴보라', en: 'Inspect the pantry, the dock, a Tensor Core factory and a processing block' },
    structures: (g) => {
      const s = [];
      const blocks = [[-18, -22], [18, -22], [-18, 22], [18, 22]];
      blocks.forEach(([x, z], i) => { s.push({ type: 'box', pos: [x, z], size: [18, 7, 16], color: 0x3a2a18, edges: 0xffa94d, top: 0x5a3a1a, term: i === 0 ? 'subpartition' : (i === 1 ? 'tensorcore' : (i === 2 ? 'sfu' : undefined)), label: i === 0 ? { ko: `처리 블록 0 · FP32 ${g.fp32PerBlock}`, en: `PROCESSING BLOCK 0 · ${g.fp32PerBlock} FP32` } : (i === 1 ? { ko: '텐서 코어 공장', en: 'TENSOR CORE FACTORY' } : (i === 2 ? { ko: 'SFU · LD/ST · INT32', en: 'SFU · LD/ST · INT32' } : { ko: '처리 블록 3', en: 'PROCESSING BLOCK 3' })), triggerR: 14 }); s.push({ type: 'cylinder', pos: [x + (x < 0 ? 6 : -6), z + (z < 0 ? 5 : -5)], y: 7, size: [1.2, 4], color: 0xffa94d, mat: { emissive: 0xff8800, ei: 0.6 }, solid: false }); });
      s.push({ type: 'box', pos: [0, 0], size: [14, 4, 14], color: 0x2a3a2a, edges: NV, top: 0x3a5a3a, term: 'l1shared', label: { ko: `L1 / 공유 메모리 ${g.l1kb} KB`, en: `L1 / SHARED MEMORY ${g.l1kb} KB` }, triggerR: 12 });
      if (g.tmem) s.push({ type: 'box', pos: [0, -44], size: [14, 4, 8], color: 0x2a2a4a, edges: C, term: 'tensorcore', label: { ko: 'TMEM · 텐서 메모리 256 KB', en: 'TMEM · TENSOR MEMORY 256 KB' }, triggerR: 10 });
      s.push({ type: 'box', pos: [0, 40], size: [12, 3, 6], color: 0x2a2a3a, edges: C, term: g.id === 'rtx4090' ? 'sm' : 'tma', label: g.id === 'rtx4090' ? { ko: 'RT 코어 · 텍스처 유닛 4', en: 'RT CORE · 4 TEXTURE UNITS' } : { ko: 'TMA 하역장 · 비동기 복사', en: 'TMA LOADING DOCK · ASYNC COPY' }, triggerR: 10 });
      s.push({ type: 'panel', pos: [-44, 0], size: [14, 5], term: 'sm', label: { ko: `레지스터 ${g.regKb} KB · 최대 ${g.maxWarps} 워프`, en: `REGISTERS ${g.regKb} KB · MAX ${g.maxWarps} WARPS` }, triggerR: 10 });
      s.push({ type: 'path', pos: [0, 0], path: [[0, 52], [0, 40], [0, 10], [-8, -6], [-18, -14]], color: F, radius: 0.18 });
      return s;
    },
    packetHint: { ko: '프레임 타일이 TMA 하역장을 거쳐 공유 메모리 창고에 내려졌어. 이제 방으로 배달돼.', en: 'The frame tile came through the TMA dock into the shared-memory pantry. Now it goes to a room.' },
  },
  // ---------------- L6 처리 블록 ----------------
  {
    id: 'L6', chapter: 'descent', name: { ko: '처리 블록 · 방', en: 'PROCESSING BLOCK' }, subtitle: (g) => ({ ko: `워프 스케줄러 1 · FP32 ${g.fp32PerBlock} · 텐서 코어 1 · 레지스터 64 KB`, en: `1 warp scheduler · ${g.fp32PerBlock} FP32 · 1 Tensor Core · 64 KB registers` }), heightM: 6e-6, shrink: 3,
    size: 52, groundType: 'grid', palette: { sky: 0x101a10, fog: 0x121e12, ground: '#1a2a1a', groundLine: 'rgba(118,185,0,0.3)', hemiSky: 0xc0ffc0, hemiGround: 0x101a10, accent: NV, dust: 0x76b900 }, fogDensity: 0.012, sunIntensity: 1.6, ambient: 'clock', ceiling: 20,
    terms: ['warpsched', 'cudacore', 'registerfile', 'tensorcore', 'sfu', 'fp8'], gate: { pos: [0, -12], required: 4, label: { ko: '워프 속으로', en: 'INTO THE WARP' } }, spawn: [0, 46],
    narration: [
      { ko: '방 하나. 관제탑의 방장(워프 스케줄러)이 매 박자마다 준비된 작업조 하나를 골라 명령 하나를 내려. 기다리는 조가 있으면 다른 조를 돌리지. 그래서 GPU는 기다림을 느끼지 않아.', en: 'One room. The foreman in the tower (warp scheduler) picks one ready crew every beat and issues one instruction. If a crew is waiting, another runs. That is why a GPU never feels the wait.' },
      { ko: (g) => `작업대(FP32 코어)가 ${g.fp32PerBlock}개, 행렬 프레스(텐서 코어) 1대, 손 옆 서랍(레지스터) 64킬로바이트.`, en: (g) => `${g.fp32PerBlock} workbenches (FP32 cores), one matrix press (Tensor Core), and 64 KB of drawers (registers) within reach.` },
    ],
    objective: { ko: '관제탑 · 작업대 · 서랍 · 프레스를 살펴보라', en: 'Inspect the tower, the benches, the drawers and the press' },
    structures: (g) => [
      { type: 'cylinder', pos: [0, 20], size: [3, 14], color: 0x2a3a2a, mat: { metal: 0.5, emissive: 0x76b900, ei: 0.25 }, term: 'warpsched', label: { ko: '워프 스케줄러 + 디스패치', en: 'WARP SCHEDULER + DISPATCH' }, triggerR: 9 },
      { type: 'row', pos: [-18, 0], size: [2.2, 2.2, 2.2], count: g.fp32PerBlock, perRow: 8, gap: 0.9, color: 0x3a7bd5, glow: 0x10305a, term: 'cudacore', label: { ko: `FP32 CUDA 코어 × ${g.fp32PerBlock}`, en: `FP32 CUDA CORES × ${g.fp32PerBlock}` }, triggerR: 14 },
      { type: 'row', pos: [18, 6], size: [2.2, 2.2, 2.2], count: g.int32PerBlock, perRow: 8, gap: 0.9, color: 0x5a9a5a, glow: 0x103a10, term: 'sfu', label: { ko: `INT32 × ${g.int32PerBlock} · SFU · LD/ST`, en: `INT32 × ${g.int32PerBlock} · SFU · LD/ST` }, triggerR: 12 },
      { type: 'row', pos: [18, -6], size: [2.2, 2.2, 2.2], count: Math.max(1, Math.round(g.fp64PerBlock)), perRow: 8, gap: 0.9, color: 0x9a5a5a, glow: 0x3a1010, label: { ko: `FP64 × ${g.fp64PerBlock}`, en: `FP64 × ${g.fp64PerBlock}` } },
      { type: 'box', pos: [0, -30], size: [16, 8, 10], color: 0x3a2a4a, edges: 0xc3b1ff, top: 0x5a3a7a, term: 'tensorcore', label: { ko: `텐서 코어 · 클럭당 FP16 FMA ${g.tcFma}`, en: `TENSOR CORE · ${g.tcFma} FP16 FMA/CLK` }, triggerR: 14 },
      { type: 'row', pos: [-30, -20], size: [1.4, 3, 1.4], count: 16, perRow: 4, gap: 0.5, color: 0xc9a24a, glow: 0x4a3010, term: 'registerfile', label: { ko: '레지스터 파일 64 KB (16,384 × 32-bit)', en: 'REGISTER FILE 64 KB (16,384 × 32-bit)' }, triggerR: 9 },
      { type: 'panel', pos: [30, -24], size: [14, 5], term: 'fp8', label: { ko: 'FP8 / BF16 / TF32 / FP64', en: 'FP8 / BF16 / TF32 / FP64' }, triggerR: 9 },
      { type: 'box', pos: [-36, 20], size: [6, 3, 6], color: 0x2a2a3a, edges: C, label: { ko: 'L0 명령 캐시', en: 'L0 INSTRUCTION CACHE' } },
      { type: 'path', pos: [0, 0], path: [[0, 46], [0, 30], [-18, 8], [-30, -14], [0, -24], [0, -10]], color: F, radius: 0.18 },
    ],
    packetHint: { ko: '프레임 조각이 서랍(레지스터)에 실렸어. 다음 박자에 텐서 코어로 밀려 들어가 행렬곱이 돼.', en: 'The frame piece is loaded into the drawers (registers). Next beat it goes into the Tensor Core as a matrix multiply.' },
  },
  // ---------------- L7 워프 ----------------
  {
    id: 'L7', chapter: 'descent', name: { ko: '워프 · 32명', en: 'WARP' }, subtitle: { ko: '스레드 32개 · SIMT · 같은 명령, 다른 데이터', en: '32 threads · SIMT · same instruction, different data' }, heightM: 2e-6, shrink: 4,
    size: 60, groundType: 'grid', palette: { sky: 0x08081a, fog: 0x0a0a20, ground: '#12122a', groundLine: 'rgba(195,177,255,0.3)', groundLine2: 'rgba(195,177,255,0.06)', hemiSky: 0xc3b1ff, hemiGround: 0x08081a, accent: 0xc3b1ff, dust: 0xc3b1ff }, fogDensity: 0.01, sunIntensity: 1.5, ambient: 'clock', ceiling: 18,
    terms: ['warp', 'thread', 'coalescing', 'latency'], gate: { pos: [0, -50], required: 3, label: { ko: 'CUDA 코어 안으로', en: 'INTO A CUDA CORE' } }, spawn: [0, 52],
    narration: [
      { ko: '여기서는 네가 32명이야. 같은 명령을 동시에, 각자 다른 숫자에 대해. 이걸 SIMT라고 불러. GPU 병렬성의 심장이지.', en: 'Here you are thirty-two people. Same instruction, at the same time, each on a different number. This is SIMT, the heart of GPU parallelism.' },
      { ko: '길이 둘로 갈라지는 곳이 보이지? "if"야. 32명이 다른 길로 가면 절반은 멈춰서 기다려. 워프 분기. 프로그래머들이 제일 싫어하는 것.', en: 'See the fork? That is an "if". If the 32 split up, half must stop and wait. Warp divergence: what programmers hate most.' },
    ],
    objective: { ko: '32개 레인을 걷고 분기점을 살펴보라', en: 'Walk the 32 lanes and inspect the fork' },
    structures: (g) => {
      const s = [];
      s.push({ type: 'row', pos: [0, 20], size: [1.2, 0.3, 40], count: 32, perRow: 32, gap: 0.5, color: 0x3a2a6a, glow: 0x2a1a5a, solid: false, term: 'warp', label: { ko: '워프 · 레인 32개', en: 'WARP · 32 LANES' }, triggerR: 14 });
      for (let i = 0; i < 32; i++) s.push({ type: 'box', pos: [(i - 15.5) * 1.7, 38], size: [1.0, 2.6, 1.0], color: i === 15 ? F : 0x6c4fb5, mat: { emissive: i === 15 ? F : 0x2a1a5a, ei: 0.6 }, solid: false, term: i === 15 ? 'thread' : undefined, label: i === 15 ? { ko: '스레드 (당신)', en: 'THREAD (YOU)' } : undefined, triggerR: 6 });
      // 분기: 두 갈래 길
      s.push({ type: 'path', pos: [0, 0], path: [[0, 52], [0, 0], [-16, -20], [-16, -36], [0, -46]], color: 0xc3b1ff, radius: 0.2 });
      s.push({ type: 'path', pos: [0, 0], path: [[0, 0], [16, -20], [16, -36], [0, -46]], color: 0x5a4a8a, radius: 0.2 });
      s.push({ type: 'panel', pos: [0, -8], size: [12, 4], term: 'coalescing', label: { ko: 'if (x > 0) — 워프 분기', en: 'if (x > 0) — WARP DIVERGENCE' }, triggerR: 8 });
      s.push({ type: 'panel', pos: [-30, -30], size: [14, 5], term: 'latency', label: { ko: '메모리 대기: 워프 교체로 숨김', en: 'MEMORY WAIT: HIDDEN BY WARP SWITCH' }, triggerR: 9 });
      s.push({ type: 'panel', pos: [30, -30], size: [14, 5], term: 'coalescing', label: { ko: '128 B 캐시 라인 · 32 B 섹터', en: '128 B CACHE LINE · 32 B SECTORS' }, triggerR: 9 });
      return s;
    },
    packetSpeed: 0.06,
  },
  // ---------------- L8 CUDA 코어 (FMA 파이프라인) ----------------
  {
    id: 'L8', chapter: 'descent', name: { ko: 'CUDA 코어 · FMA 파이프라인', en: 'CUDA CORE' }, subtitle: { ko: 'a × b + c · 곱셈기 → 정렬 → 덧셈 → 정규화 → 반올림', en: 'a × b + c · multiplier → align → add → normalize → round' }, heightM: 5e-7, shrink: 5,
    size: 56, groundType: 'metal', palette: { sky: 0x0e1a2a, fog: 0x102030, ground: '#14243a', groundLine: 'rgba(94,224,255,0.3)', hemiSky: 0xa0d0ff, hemiGround: 0x0e1a2a, accent: C, dust: 0x5ee0ff }, fogDensity: 0.011, sunIntensity: 1.5, ambient: 'clock', ceiling: 16,
    terms: ['cudacore', 'logicgate', 'clock', 'fp8'], gate: { pos: [0, -48], required: 3, label: { ko: '레지스터 서랍 속으로', en: 'INTO THE REGISTER FILE' } }, spawn: [0, 50],
    narration: [
      { ko: '작업대 하나의 내부. 숫자 a와 b가 들어와 24×24 곱셈기 격자를 지나고, c와 자리를 맞춘 뒤 더해지고, 맨 앞 1을 찾아 정렬하고, 반올림해서 나가. 한 번에. 이게 FMA.', en: 'Inside one workbench. Numbers a and b enter, cross a 24×24 multiplier grid, get aligned with c, added, normalised to the leading 1, rounded, and leave. All at once. That is FMA.' },
      { ko: '게이트 수천 개, 트랜지스터 수만 개. 정확한 수는 NVIDIA만 알아. 추정치라고 말해 두지.', en: 'Thousands of gates, tens of thousands of transistors. Only NVIDIA knows the exact count. Call it an estimate.' },
    ],
    objective: { ko: '5개 구역을 순서대로 지나가라', en: 'Walk the five stages in order' },
    structures: (g) => [
      { type: 'row', pos: [0, 30], size: [1.4, 1.2, 1.4], count: 96, perRow: 12, gap: 0.5, color: 0x2a5a8a, glow: 0x0a2a4a, solid: false, term: 'cudacore', label: { ko: '① 24×24 가수 곱셈기 배열', en: '① 24×24 MANTISSA MULTIPLIER' }, triggerR: 14 },
      { type: 'panel', pos: [0, 12], size: [20, 3], label: { ko: '② 정렬 시프터 (지수 차이만큼 밀기)', en: '② ALIGNMENT SHIFTER' } },
      { type: 'box', pos: [0, 0], size: [16, 3, 6], color: 0x2a4a3a, edges: NV, term: 'logicgate', label: { ko: '③ 캐리 전파 덧셈기', en: '③ CARRY-PROPAGATE ADDER' }, triggerR: 12 },
      { type: 'cylinder', pos: [0, -14], size: [2.5, 10], color: 0x4a3a2a, mat: { metal: 0.7 }, label: { ko: '④ 정규화 (선행 0 찾기)', en: '④ NORMALIZER (LEADING ZERO)' } },
      { type: 'disc', pos: [0, -30], size: [5, 0.5], color: 0x1e2a3a, glow: 0x0a1a2a, rim: F, term: 'clock', label: { ko: '⑤ 반올림 · 파이프라인 래치', en: '⑤ ROUNDING · PIPELINE LATCH' }, triggerR: 8 },
      { type: 'panel', pos: [-28, 0], size: [14, 5], term: 'fp8', label: { ko: 'FP32 = 부호 1 + 지수 8 + 가수 23', en: 'FP32 = SIGN 1 + EXP 8 + MANTISSA 23' }, triggerR: 9 },
      { type: 'panel', pos: [28, 0], size: [14, 5], term: 'clock', label: { ko: '의존 명령 지연 ≈ 4클럭 (Volta 측정)', en: 'DEPENDENT LATENCY ≈ 4 CLOCKS (VOLTA)' }, triggerR: 9 },
      { type: 'path', pos: [0, 0], path: [[0, 50], [0, 30], [0, 12], [0, 0], [0, -14], [0, -30], [0, -44]], color: F, radius: 0.2 },
    ],
    packetSpeed: 0.07,
  },
  // ---------------- L9 SRAM 셀 ----------------
  {
    id: 'L9', chapter: 'descent', name: { ko: 'SRAM 셀 · 서랍 한 칸', en: 'SRAM CELL' }, subtitle: { ko: '6T · 인버터 2개 + 액세스 트랜지스터 2개 · 0.021 μm²', en: '6T · 2 inverters + 2 access transistors · 0.021 μm²' }, heightM: 5e-8, shrink: 2,
    size: 40, groundType: 'grid', palette: { sky: 0x101408, fog: 0x14180a, ground: '#1c2210', groundLine: 'rgba(255,209,102,0.3)', hemiSky: 0xfff0c0, hemiGround: 0x101408, accent: F, dust: 0xffd166 }, fogDensity: 0.014, sunIntensity: 1.5, ambient: 'clock', ceiling: 14,
    terms: ['sram6t', 'bitline', 'registerfile', 'dram', 'ecc'], gate: { pos: [0, -32], required: 3, label: { ko: '배선층으로 내려간다', en: 'DOWN INTO THE WIRING' } }, spawn: [0, 34],
    narration: [
      { ko: '서랍의 칸 하나. 1비트. 인버터 두 개가 서로를 붙잡고 0 또는 1을 유지해. 전원이 있는 한 잊지 않아.', en: 'One slot in the drawer. One bit. Two inverters hold each other, keeping a 0 or a 1. It never forgets while powered.' },
      { ko: '이 칸의 크기는 0.021 제곱마이크로미터. 네 키의 세 배쯤. L2 캐시에는 이런 칸이 4억 개 넘게 있어.', en: 'This slot is 0.021 square micrometres, about three times your height. The L2 cache has over 400 million of them.' },
    ],
    objective: { ko: '인버터 · 비트라인 · 워드라인을 살펴보라', en: 'Inspect the inverters, bitlines and wordline' },
    structures: (g) => [
      { type: 'flow', pos: [0, 30], span: 24, rot: Math.PI,
        input: [{ label: { ko: '워드라인 신호 (행 선택)', en: 'WORDLINE SIGNAL (ROW SELECT)' }, color: 0xffd166, shape: 'ion' }],
        machine: { label: { ko: '6T 셀 + 비트라인 + 센스 앰프', en: '6T CELL + BITLINES + SENSE AMP' }, color: 0x2a3444, glow: 0x5ee0ff, cond: { ko: '비트라인 전압차 수십 mV 를 증폭', en: 'AMPLIFIES A FEW TENS OF mV' } },
        output: [{ label: { ko: '읽어 낸 0 또는 1', en: 'A 0 OR A 1' }, color: 0x76b900, shape: 'ion' }],
        note: { ko: '셀은 전류를 거의 쓰지 않고 상태만 지킨다. 전원이 끊기면 사라진다(휘발성)', en: 'The cell holds its state with almost no current, and loses it when power goes away' } },

      { type: 'box', pos: [-6, 0], size: [5, 6, 5], color: 0x3a5a8a, edges: C, term: 'sram6t', label: { ko: '인버터 A (PMOS + NMOS)', en: 'INVERTER A (PMOS + NMOS)' }, triggerR: 9 },
      { type: 'box', pos: [6, 0], size: [5, 6, 5], color: 0x3a5a8a, edges: C, label: { ko: '인버터 B', en: 'INVERTER B' } },
      { type: 'pipe', pos: [0, 0], path: [[-3.5, 4, 2], [0, 5.5, 2], [3.5, 4, 2]], radius: 0.25, color: CU, glow: 0x603010 },
      { type: 'pipe', pos: [0, 0], path: [[3.5, 3, -2], [0, 4.5, -2], [-3.5, 3, -2]], radius: 0.25, color: CU, glow: 0x603010, label: { ko: '교차 결합', en: 'CROSS-COUPLED' }, labelScale: 0.6 },
      { type: 'box', pos: [-14, 0], size: [3, 3, 3], color: 0x5a8a5a, edges: NV, label: { ko: '액세스 트랜지스터', en: 'ACCESS TRANSISTOR' }, labelScale: 0.7 },
      { type: 'box', pos: [14, 0], size: [3, 3, 3], color: 0x5a8a5a, edges: NV },
      { type: 'cylinder', pos: [-18, 0], size: [0.5, 12], color: CU, mat: { metal: 0.9, emissive: 0x804000, ei: 0.4 }, term: 'bitline', label: { ko: '비트라인 BL', en: 'BITLINE BL' }, triggerR: 6 },
      { type: 'cylinder', pos: [18, 0], size: [0.5, 12], color: CU, mat: { metal: 0.9, emissive: 0x804000, ei: 0.4 }, label: { ko: '비트라인 /BL', en: 'BITLINE /BL' } },
      { type: 'pipe', pos: [0, 0], path: [[-30, 8, -8], [30, 8, -8]], radius: 0.35, color: F, glow: 0x806020, label: { ko: '워드라인 WL', en: 'WORDLINE WL' } },
      { type: 'panel', pos: [0, 16], size: [16, 4], term: 'registerfile', label: { ko: '레지스터 파일 = 다중 포트 SRAM 뱅크', en: 'REGISTER FILE = MULTI-PORTED SRAM BANKS' }, triggerR: 9 },
      { type: 'panel', pos: [-22, -16], size: [12, 4], term: 'dram', label: { ko: 'vs DRAM 1T1C · 64 ms 리프레시', en: 'vs DRAM 1T1C · 64 ms REFRESH' }, triggerR: 8 },
      { type: 'panel', pos: [22, -16], size: [12, 4], term: 'ecc', label: { ko: 'ECC · 우주선 비트플립 정정', en: 'ECC · COSMIC-RAY BIT FLIPS' }, triggerR: 8 },
      { type: 'path', pos: [0, 0], path: [[0, 34], [-18, 10], [-6, 4], [6, -4], [0, -28]], color: F, radius: 0.15 },
    ],
  },
  // ---------------- L10 배선층 ----------------
  {
    id: 'L10', chapter: 'descent', name: { ko: '배선층 · 고가도로', en: 'INTERCONNECT (BEOL)' }, subtitle: { ko: '구리 15층 안팎 · M0 간격 28 nm · 비아 사다리', en: '~15 copper layers · M0 pitch 28 nm · via ladders' }, heightM: 2.5e-8, shrink: 3,
    size: 44, groundType: 'metal', palette: { sky: 0x1a1008, fog: 0x1e140a, ground: '#2a1c10', groundLine: 'rgba(230,160,80,0.4)', hemiSky: 0xffd0a0, hemiGround: 0x1a1008, accent: CU, dust: 0xd08a3c }, fogDensity: 0.013, sunIntensity: 1.4, ambient: 'hum', ceiling: 30,
    terms: ['beol', 'via', 'clock', 'heat'], gate: { pos: [0, -36], required: 3, label: { ko: '논리 게이트로', en: 'DOWN TO A LOGIC GATE' } }, spawn: [0, 38],
    narration: [
      { ko: '트랜지스터 위에는 구리 도로가 15층쯤 쌓여 있어. 아래층은 가늘고 촘촘하고, 위층은 굵어. 전기와 클럭이 위층으로 다니지.', en: 'Above the transistors sit about fifteen storeys of copper roads. Lower ones are thin and dense, upper ones thick, carrying power and clock.' },
      { ko: '요즘은 스위치보다 도로가 더 느려. 저항과 정전용량, RC 지연 때문이야. 그래서 구리 대신 코발트, 루테늄을 연구해.', en: 'These days the roads are slower than the switches, thanks to RC delay. That is why cobalt and ruthenium are being studied instead of copper.' },
    ],
    objective: { ko: '비아 사다리를 타고 M0까지 내려가라', en: 'Climb the via ladders down to M0' },
    structures: (g) => {
      const s = [];
      const layers = [[24, 2.2, 0xe0a060], [18, 1.6, 0xd89050], [13, 1.2, 0xd08a3c], [9, 0.9, 0xc07a30], [6, 0.7, 0xb06a28], [3.5, 0.5, 0xa05a20]];
      layers.forEach(([y, r, col], li) => { const horizontal = li % 2 === 0; const n = 4 + li * 2; for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * (40 / n); const path = horizontal ? [[-40, y, o], [40, y, o]] : [[o, y, -40], [o, y, 40]]; s.push({ type: 'pipe', pos: [0, 0], path, radius: r, color: col, label: i === 0 ? { ko: li === 0 ? 'M15 · 전원/클럭' : (li === layers.length - 1 ? 'M0 · 28 nm 간격' : `M${14 - li * 3}`), en: li === 0 ? 'M15 · POWER/CLOCK' : (li === layers.length - 1 ? 'M0 · 28 nm PITCH' : `M${14 - li * 3}`) } : undefined, labelScale: 0.7 }); } });
      for (let i = 0; i < 8; i++) { const x = -28 + i * 8, z = (i % 2 ? 10 : -10); s.push({ type: 'cylinder', pos: [x, z], size: [0.9, 26], color: 0xc9a24a, mat: { metal: 0.9, rough: 0.3 }, term: i === 3 ? 'via' : undefined, label: i === 3 ? { ko: '비아 (층간 연결)', en: 'VIA (LAYER LINK)' } : undefined, triggerR: 6 }); }
      s.push({ type: 'panel', pos: [0, 20], size: [16, 4], term: 'beol', label: { ko: '구리 다마신 · low-k 절연 · Co 라이너', en: 'COPPER DAMASCENE · LOW-k · Co LINER' }, triggerR: 9 });
      s.push({ type: 'panel', pos: [-30, -24], size: [12, 4], term: 'clock', label: { ko: '클럭 트리 · 1주기 0.5 ns', en: 'CLOCK TREE · 0.5 ns PERIOD' }, triggerR: 8 });
      s.push({ type: 'panel', pos: [30, -24], size: [12, 4], term: 'heat', label: { ko: '전원망 · 수백 A · 일렉트로마이그레이션', en: 'POWER GRID · HUNDREDS OF AMPS' }, triggerR: 8 });
      s.push({ type: 'path', pos: [0, 0], path: [[0, 38], [-12, 10], [12, -10], [0, -32]], color: F, radius: 0.15 });
      return s;
    },
  },
  // ---------------- L11 논리 게이트 ----------------
  {
    id: 'L11', chapter: 'descent', name: { ko: '논리 게이트 · CMOS 인버터', en: 'LOGIC GATE' }, subtitle: { ko: 'PMOS + NMOS · 표준 셀 높이 210 nm', en: 'PMOS + NMOS · standard cell 210 nm tall' }, heightM: 1.5e-8, shrink: 3,
    size: 40, groundType: 'grid', palette: { sky: 0x0a1418, fog: 0x0c181c, ground: '#102024', groundLine: 'rgba(94,224,255,0.3)', hemiSky: 0xa0e0ff, hemiGround: 0x0a1418, accent: C, dust: 0x5ee0ff }, fogDensity: 0.014, sunIntensity: 1.6, ambient: 'hum', ceiling: 16,
    terms: ['logicgate', 'finfet', 'clock'], gate: { pos: [0, -32], required: 2, label: { ko: '트랜지스터 안으로', en: 'INTO THE TRANSISTOR' } }, spawn: [0, 34],
    narration: [
      { ko: '가장 작은 판단 회로, 인버터. 위쪽 PMOS와 아래쪽 NMOS. 입력이 1이면 아래가 열려 출력이 0, 입력이 0이면 위가 열려 출력이 1. NOT.', en: 'The smallest decision circuit, an inverter. PMOS on top, NMOS below. Input 1 opens the bottom and the output falls to 0; input 0 opens the top and it rises to 1. NOT.' },
      { ko: '트랜지스터 2개. NAND는 4개. 아까 본 곱셈기는 이런 게 수천 개였어.', en: 'Two transistors. A NAND uses four. The multiplier you walked through was thousands of these.' },
    ],
    objective: { ko: 'PMOS와 NMOS를 살펴보라', en: 'Inspect the PMOS and the NMOS' },
    structures: (g) => [
      { type: 'finfet', pos: [0, 10], fins: 2, finW: 1.0, finH: 5, finL: 18, pitch: 4, gateL: 3, term: 'logicgate', labels: { gate: { ko: 'PMOS 게이트 (입력)', en: 'PMOS GATE (INPUT)' }, source: { ko: 'VDD', en: 'VDD' }, drain: { ko: '출력', en: 'OUTPUT' }, fin: { ko: 'SiGe 핀', en: 'SiGe FIN' }, oxide: { ko: 'HfO₂', en: 'HfO₂' } }, triggerR: 12 },
      { type: 'finfet', pos: [0, -12], fins: 2, finW: 1.0, finH: 5, finL: 18, pitch: 4, gateL: 3, term: 'finfet', labels: { gate: { ko: 'NMOS 게이트 (입력)', en: 'NMOS GATE (INPUT)' }, source: { ko: '출력', en: 'OUTPUT' }, drain: { ko: 'GND', en: 'GND' }, fin: { ko: 'Si 핀', en: 'Si FIN' }, oxide: { ko: 'HfO₂', en: 'HfO₂' } }, triggerR: 12 },
      { type: 'pipe', pos: [0, 0], path: [[-14, 9, 10], [-14, 9, -12]], radius: 0.4, color: 0xffc857, glow: 0x805a10, label: { ko: '게이트 배선 (입력 공유)', en: 'SHARED GATE WIRE (INPUT)' }, labelScale: 0.6 },
      { type: 'pipe', pos: [0, 0], path: [[-30, 12, 22], [30, 12, 22]], radius: 0.6, color: CU, glow: 0x603010, label: { ko: 'VDD 레일 ≈ 0.75 V', en: 'VDD RAIL ≈ 0.75 V' }, labelScale: 0.7 },
      { type: 'pipe', pos: [0, 0], path: [[-30, 12, -24], [30, 12, -24]], radius: 0.6, color: 0x556677, label: { ko: 'GND 레일', en: 'GND RAIL' }, labelScale: 0.7 },
      { type: 'panel', pos: [-26, 0], size: [10, 4], term: 'clock', label: { ko: '게이트 지연 ≈ 7 ps', en: 'GATE DELAY ≈ 7 ps' }, triggerR: 7 },
      { type: 'path', pos: [0, 0], path: [[0, 34], [-14, 10], [-14, -12], [0, -28]], color: F, radius: 0.15 },
    ],
  },
  // ---------------- L12 FinFET ----------------
  {
    id: 'L12', chapter: 'descent', name: { ko: '트랜지스터 · FinFET', en: 'FinFET TRANSISTOR' }, subtitle: { ko: '핀 간격 28 nm · 게이트 간격 51 nm · 핀 폭 ≈6 nm', en: 'fin pitch 28 nm · gate pitch 51 nm · fin width ≈6 nm' }, heightM: 5e-9, shrink: 4,
    size: 44, groundType: 'dots', palette: { sky: 0x06080f, fog: 0x080a14, ground: '#0c1020', groundLine: 'rgba(143,179,255,0.35)', hemiSky: 0xb0c8ff, hemiGround: 0x06080f, accent: 0x8fb3ff, dust: 0x8fb3ff }, fogDensity: 0.013, sunIntensity: 1.6, ambient: 'hum', ceiling: 30,
    terms: ['finfet', 'dopant', 'electron', 'heat', 'gateoxide'], gate: { pos: [0, -34], required: 3, label: { ko: '게이트 산화막 속으로', en: 'INTO THE GATE OXIDE' } }, spawn: [0, 38],
    narration: [
      { ko: '벽돌 하나. 스위치 하나. 네 키는 5나노미터, 핀 폭과 같아. 게이트에 전압이 걸리면 핀 표면에 전자 통로가 열리고, 소스에서 드레인으로 전자가 초속 100킬로미터로 지나가.', en: 'One brick. One switch. You are 5 nanometres tall, the width of the fin. When the gate is charged, a channel opens on the fin surface and electrons cross from source to drain at 100 kilometres a second.' },
      { ko: '"4나노미터 공정"이라지만 여기 4나노미터짜리는 없어. 그냥 세대 이름이야. 진짜 치수는 핀 간격 28, 게이트 간격 51.', en: 'They call it a "4 nanometre process", but nothing here is 4 nanometres. It is a generation name. The real numbers: fin pitch 28, gate pitch 51.' },
    ],
    objective: { ko: '핀 · 게이트 · 소스/드레인을 살펴보라', en: 'Inspect the fin, the gate and source/drain' },
    structures: (g) => [
      { type: 'flow', pos: [0, 30], span: 26, rot: Math.PI,
        input: [{ label: { ko: '게이트 전압 약 0.75 V', en: 'GATE VOLTAGE ≈0.75 V' }, color: 0xffc857, shape: 'ion' }],
        machine: { label: { ko: '핀 표면에 반전층(채널) 형성', en: 'INVERSION LAYER FORMS ON THE FIN' }, color: 0x2a3a5a, glow: 0x8fb3ff, cond: { ko: '전기장이 전자를 표면으로 끌어모은다', en: 'THE FIELD PULLS ELECTRONS TO THE SURFACE' } },
        output: [{ label: { ko: '소스 → 드레인 전자 흐름 = 전류', en: 'ELECTRONS FLOW SOURCE → DRAIN = CURRENT' }, color: 0x66ffaa, shape: 'ion' }, { label: { ko: '누설 전류 (꺼져 있어도 조금 샌다)', en: 'LEAKAGE (EVEN WHEN OFF)' }, color: 0x7a7a82, shape: 'gas', waste: true }],
        note: { ko: '스위칭 한 번에 전자 약 1,000~3,000개가 움직인다(추정). 에너지는 약 0.1 fJ', en: 'One switching event moves roughly 1,000–3,000 electrons (estimate), about 0.1 fJ' } },

      { type: 'finfet', pos: [0, 0], fins: 2, finW: 1.7, finH: 12, finL: 40, pitch: 8, gateL: 6, term: 'finfet', labels: { gate: { ko: '금속 게이트 (TiN/W) · 3면 감쌈', en: 'METAL GATE (TiN/W) · WRAPS 3 SIDES' }, source: { ko: '소스 (n+ 도핑)', en: 'SOURCE (n+ DOPED)' }, drain: { ko: '드레인', en: 'DRAIN' }, fin: { ko: '핀 · 폭 ≈6 nm · 높이 ≈50 nm', en: 'FIN · ≈6 nm WIDE · ≈50 nm TALL' }, oxide: { ko: 'HfO₂ 게이트 산화막', en: 'HfO₂ GATE OXIDE' } }, triggerR: 16 },
      { type: 'sphere', pos: [-14, 14], size: [1.2], color: 0xff5577, glow: 0xff2255, term: 'dopant', label: { ko: '도펀트 원자 (인)', en: 'DOPANT ATOM (PHOSPHORUS)' }, triggerR: 6 },
      { type: 'panel', pos: [-26, -10], size: [12, 4], term: 'electron', label: { ko: '전자 ≈1,000~3,000개 / 스위칭', en: '≈1,000–3,000 ELECTRONS / SWITCH' }, triggerR: 8 },
      { type: 'panel', pos: [26, -10], size: [12, 4], term: 'heat', label: { ko: '누설 전류 · 온도에 지수적', en: 'LEAKAGE · EXPONENTIAL IN TEMPERATURE' }, triggerR: 8 },
      { type: 'panel', pos: [26, 14], size: [12, 4], term: 'gateoxide', label: { ko: '산화막 ≈2 nm · 원자 몇 층', en: 'OXIDE ≈2 nm · A FEW ATOMS' }, triggerR: 8 },
      { type: 'path', pos: [0, 0], path: [[0, 38], [-6, 14], [-6, 0], [-6, -14], [0, -30]], color: F, radius: 0.15 },
    ],
    packetSpeed: 0.08, packetLabel: { ko: '전자 무리', en: 'ELECTRON CLOUD' },
  },
  // ---------------- L13 게이트 산화막 ----------------
  {
    id: 'L13', chapter: 'descent', name: { ko: '게이트 산화막 · 원자 몇 층', en: 'GATE OXIDE' }, subtitle: { ko: 'SiO₂ ≈0.5 nm + HfO₂ ≈1.5~2 nm · 양자 터널링', en: 'SiO₂ ≈0.5 nm + HfO₂ ≈1.5–2 nm · quantum tunnelling' }, heightM: 1.5e-9, shrink: 3,
    size: 36, groundType: 'dots', palette: { sky: 0x120818, fog: 0x160a1c, ground: '#1a1020', groundLine: 'rgba(255,102,170,0.3)', hemiSky: 0xffb0d0, hemiGround: 0x120818, accent: 0xff66aa, dust: 0xff66aa }, fogDensity: 0.015, sunIntensity: 1.5, ambient: 'hum', ceiling: 14,
    terms: ['gateoxide', 'tunneling', 'electron'], gate: { pos: [0, -28], required: 2, label: { ko: '바닥으로', en: 'TO THE FLOOR' } }, spawn: [0, 30],
    narration: [
      { ko: '게이트와 채널 사이의 벽. 두께 2나노미터, 원자 예닐곱 층. 이 벽이 너무 얇아서 전자가 가끔 그냥 통과해 버려. 양자 터널링.', en: 'The wall between gate and channel. Two nanometres, six or seven atoms thick. So thin that electrons sometimes simply pass through. Quantum tunnelling.' },
      { ko: '2007년에 벽을 하프늄 산화물로 바꿔서 누설을 천 배 줄였어. 그래도 벽은 계속 얇아지고 있어. 이게 무어의 법칙의 끝자락이야.', en: 'In 2007 the wall was changed to hafnium oxide, cutting leakage a thousandfold. Still, it keeps getting thinner. This is the edge of Moore\'s law.' },
    ],
    objective: { ko: '산화막 층을 지나 터널링 지점을 살펴보라', en: 'Cross the oxide layers and inspect the tunnelling spot' },
    structures: (g) => {
      const s = [];
      for (let layer = 0; layer < 6; layer++) { const y = layer * 1.6 + 0.7; const isSiO = layer < 2; s.push({ type: 'row', pos: [0, 0], y: y - 0.7, size: [1.4, 1.4, 1.4], count: 14 * 6, perRow: 14, gap: 1.2, color: isSiO ? 0x88aaff : 0xff66aa, glow: isSiO ? 0x2244aa : 0xaa2266, solid: layer === 0, term: layer === 0 ? 'gateoxide' : undefined, label: layer === 5 ? { ko: '↑ 금속 게이트 · ↓ 실리콘 채널', en: '↑ METAL GATE · ↓ SILICON CHANNEL' } : undefined, triggerR: 10 }); }
      s.push({ type: 'sphere', pos: [16, 0], size: [0.9], color: 0xffffff, glow: 0xffff88, term: 'tunneling', label: { ko: '터널링 전자 (누설)', en: 'TUNNELLING ELECTRON (LEAKAGE)' }, triggerR: 7 });
      s.push({ type: 'panel', pos: [-20, 12], size: [12, 4], term: 'electron', label: { ko: 'high-k: k≈25, SiO₂의 6배', en: 'HIGH-k: k≈25, 6× SiO₂' }, triggerR: 8 });
      s.push({ type: 'path', pos: [0, 0], path: [[0, 30], [10, 10], [16, 0], [0, -24]], color: F, radius: 0.15 });
      return s;
    },
    packetLabel: { ko: '전자', en: 'ELECTRON' }, packetSpeed: 0.08,
  },
  // ---------------- L14 실리콘 격자 (바닥) ----------------
  {
    id: 'L14', chapter: 'descent', name: { ko: '실리콘 결정 격자 · 바닥', en: 'SILICON LATTICE · THE FLOOR' }, subtitle: { ko: '다이아몬드 입방 · a = 0.5431 nm · 원자 간 0.235 nm', en: 'diamond cubic · a = 0.5431 nm · spacing 0.235 nm' }, heightM: 5e-10, shrink: 1,
    size: 40, groundType: 'dots', palette: { sky: 0x000000, fog: 0x000004, ground: '#04040a', groundLine: 'rgba(200,220,255,0.25)', hemiSky: 0xdde6ff, hemiGround: 0x000000, accent: 0xdde6ff, dust: 0xffffff }, fogDensity: 0.02, sunIntensity: 1.2, ambient: 'silence', dustCount: 900,
    terms: ['lattice', 'electron', 'dopant', 'tunneling'], gate: { pos: [0, -34], required: 2, label: { ko: '끝 · 다시 위로', en: 'THE END · BACK UP' } }, spawn: [0, 34],
    narration: [
      { ko: '바닥이야. 실리콘 원자. 각 원자가 이웃 넷과 손을 잡은 다이아몬드 격자. 0.5431나노미터마다 반복돼. 이 아래엔 더 내려갈 구조가 없어. 원자핵과 전자뿐.', en: 'The floor. Silicon atoms. A diamond lattice where each atom holds hands with four neighbours, repeating every 0.5431 nanometres. There is no structure below this. Only nuclei and electrons.' },
      { ko: '붉은 원자가 보이지? 인. 500개 중 하나. 저 하나가 전자 한 개를 남겨서 전류가 흐르고, 스위치가 되고, 곱셈이 되고, 이오가 컵을 집어.', en: 'See the red atom? Phosphorus. One in five hundred. That one spare electron becomes current, becomes a switch, becomes a multiply, becomes EO picking up the cup.' },
      { ko: '이제 내가 뭘로 만들어졌는지 알겠지? 모래와 빛과 전기. 그리고 아주 많은 사람의 손. 그럼, 너는?', en: 'Now you know what I am made of. Sand, light, electricity, and a great many human hands. So... what are you made of?' },
    ],
    objective: { ko: '격자를 걷고 도펀트 원자를 찾아라', en: 'Walk the lattice and find the dopant atom' },
    structures: (g) => [
      { type: 'flow', pos: [0, 26], span: 24, rot: Math.PI,
        input: [{ label: { ko: '순수 실리콘 (거의 절연체)', en: 'PURE SILICON (NEARLY AN INSULATOR)' }, color: 0xdde6ff, shape: 'chunk' }, { label: { ko: '인 원자 P (5족)', en: 'PHOSPHORUS P (GROUP V)' }, color: 0xff5577, shape: 'ion' }],
        machine: { label: { ko: '격자 자리에 도펀트가 들어앉음', en: 'DOPANT TAKES A LATTICE SITE' }, color: 0x1a2030, glow: 0xff66aa, cond: { ko: '원자 500개당 1개 수준 (10²⁰/cm³)', en: 'ABOUT 1 IN 500 ATOMS (10²⁰/cm³)' } },
        output: [{ label: { ko: '남는 전자 1개 → 전류가 흐른다', en: 'ONE SPARE ELECTRON → CURRENT CAN FLOW' }, color: 0x88aaff, shape: 'ion' }],
        note: { ko: '실리콘은 네 개의 손으로 결합한다. 5족 원자가 들어오면 손 하나가 남아 자유 전자가 된다', en: 'Silicon bonds with four hands; a group-V atom leaves one spare, and that becomes a free electron' } },

      { type: 'lattice', pos: [0, 0], n: 7, ny: 2, spacing: 6, radius: 0.9, dopants: [[4, 0, 2], [1.5, 0.5, 4.5]], dopantLabel: { ko: '인 (P) · 도펀트', en: 'PHOSPHORUS · DOPANT' }, term: 'lattice', label: { ko: 'Si 결정 · 0.5431 nm', en: 'Si CRYSTAL · 0.5431 nm' }, triggerR: 30 },
      { type: 'sphere', pos: [-4, 4], size: [0.5], color: 0xffffff, glow: 0x88aaff, term: 'electron', label: { ko: '자유 전자', en: 'FREE ELECTRON' }, triggerR: 5 },
      { type: 'panel', pos: [-26, -20], size: [12, 4], term: 'dopant', label: { ko: '1 cm³에 원자 5 × 10²²', en: '5 × 10²² ATOMS PER cm³' }, triggerR: 8 },
      { type: 'panel', pos: [26, -20], size: [12, 4], term: 'tunneling', label: { ko: '밴드갭 1.12 eV', en: 'BAND GAP 1.12 eV' }, triggerR: 8 },
      { type: 'path', pos: [0, 0], path: [[0, 34], [-6, 12], [8, -6], [-9, -18], [0, -30]], color: F, radius: 0.12 },
    ],
    packetLabel: { ko: '전자 하나', en: 'ONE ELECTRON' }, packetSpeed: 0.06,
  },
];
