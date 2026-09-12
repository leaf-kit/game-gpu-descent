// 용어 카드 데이터. 모든 수치는 docs/research/*.md 의 1차 출처에서 가져옴. 확인되지 않은 수치는 "약/추정"으로 표기.
// 형식: key: { en, ko, desc:{ko,en}, analogy:{ko,en}, fact:{ko,en}, kid?:{ko,en}, src:[sourceId] }

export const SOURCES = {
  'nv-h100-wp': { short: 'NVIDIA H100 WP', title: 'NVIDIA H100 Tensor Core GPU Architecture Whitepaper (v1.01)', url: 'https://resources.nvidia.com/en-us-tensor-core' },
  'nv-hopper-blog': { short: 'NVIDIA Hopper blog', title: 'NVIDIA Hopper Architecture In-Depth (NVIDIA Developer Blog)', url: 'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/' },
  'nv-ada-wp': { short: 'NVIDIA Ada WP', title: 'NVIDIA Ada GPU Architecture Whitepaper', url: 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-ada-gpu-architecture.pdf' },
  'nv-blackwell': { short: 'NVIDIA Blackwell', title: 'NVIDIA Blackwell Architecture / DGX B200 / GB200 NVL72', url: 'https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/' },
  'cuda-guide': { short: 'CUDA Guide', title: 'CUDA C++ Programming Guide', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/' },
  'hopper-tuning': { short: 'Hopper Tuning', title: 'NVIDIA Hopper Tuning Guide', url: 'https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html' },
  'luo2024': { short: 'Luo et al. 2024', title: 'Benchmarking and Dissecting the Nvidia Hopper GPU Architecture (arXiv 2402.13499)', url: 'https://arxiv.org/abs/2402.13499' },
  'jia2018': { short: 'Jia et al. 2018', title: 'Dissecting the NVIDIA Volta GPU Architecture via Microbenchmarking (arXiv 1804.06826)', url: 'https://arxiv.org/pdf/1804.06826' },
  'cc-h100': { short: 'Chips and Cheese', title: 'Chips and Cheese: NVIDIA H100 — Funny L2 and Tons of Bandwidth', url: 'https://chipsandcheese.com/p/nvidias-h100-funny-l2-and-tons-of-bandwidth' },
  'cc-b200': { short: 'Chips and Cheese', title: 'Chips and Cheese: NVIDIA B200 — Keeping the CUDA Juggernaut Going', url: 'https://chipsandcheese.com/p/nvidias-b200-keeping-the-cuda-juggernaut' },
  'wikichip-n5': { short: 'WikiChip N5', title: 'WikiChip: TSMC 5 nm lithography process (IEDM 2019)', url: 'https://en.wikichip.org/wiki/5_nm_lithography_process' },
  'angstronomics': { short: 'Angstronomics', title: 'Angstronomics: The Truth of TSMC 5nm (SEM measurements)', url: 'https://www.angstronomics.com/p/the-truth-of-tsmc-5nm' },
  'semiwiki-n5': { short: 'SemiWiki IEDM2019', title: 'TSMC 5nm CMOS Production Technology Platform (IEDM 2019 summary)', url: 'https://semiwiki.com/semiconductor-manufacturers/tsmc/282339-tsmc-unveils-details-of-5nm-cmos-production-technology-platform-featuring-euv-and-high-mobility-channel-finfets-at-iedm2019/' },
  'skhynix-hbm3': { short: 'SK hynix', title: 'SK hynix HBM3 / 12-layer HBM3E press releases', url: 'https://news.skhynix.com/en/sk-hynix-develops-industrys-first-12-layer-hbm3/' },
  'tsmc-cowos': { short: 'TSMC CoWoS', title: 'TSMC 3DFabric: CoWoS', url: 'https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm' },
  'asml-euv': { short: 'ASML', title: 'ASML TWINSCAN NXE:3600D EUV lithography system', url: 'https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe-3600d' },
  'zeiss-euv': { short: 'ZEISS', title: 'ZEISS SMT: EUV optics', url: 'https://www.zeiss.com/semiconductor-manufacturing-technology/inspiring-technology/euv-lithography.html' },
  'usgs-si': { short: 'USGS', title: 'USGS Mineral Commodity Summaries 2024: Silicon', url: 'https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-silicon.pdf' },
  'wiki-hpq': { short: 'Wikipedia', title: 'High-purity quartz (Spruce Pine)', url: 'https://en.wikipedia.org/wiki/High-purity_quartz' },
  'wiki-siemens': { short: 'Wikipedia', title: 'Polycrystalline silicon — Siemens process', url: 'https://en.wikipedia.org/wiki/Polycrystalline_silicon' },
  'wiki-cz': { short: 'Wikipedia', title: 'Czochralski method', url: 'https://en.wikipedia.org/wiki/Czochralski_method' },
  'wiki-wafer': { short: 'Wikipedia', title: 'Wafer (electronics) — SEMI standard thickness', url: 'https://en.wikipedia.org/wiki/Wafer_(electronics)' },
  'wiki-si': { short: 'Wikipedia', title: 'Silicon — crystal structure, lattice constant', url: 'https://en.wikipedia.org/wiki/Silicon' },
  'ioffe-si': { short: 'Ioffe NSM', title: 'Ioffe Institute: Silicon electrical properties', url: 'http://www.ioffe.ru/SVA/NSM/Semicond/Si/electric.html' },
  'ajinomoto': { short: 'Ajinomoto', title: 'Ajinomoto Build-up Film (ABF)', url: 'https://www.ajinomoto.com/innovation/our_innovation/buildupfilm' },
  'semianalysis-cowos': { short: 'SemiAnalysis', title: 'SemiAnalysis: AI expansion supply chain / CoWoS capacity', url: 'https://semianalysis.com/2023/07/26/ai-expansion-supply-chain-analysis/' },
  'sth-sxm5': { short: 'ServeTheHome', title: 'ServeTheHome: NVIDIA H100 SXM5 module teardown photos', url: 'https://www.servethehome.com/' },
  'nv-jetson-thor': { short: 'NVIDIA Jetson Thor', title: 'NVIDIA Jetson AGX Thor — Physical AI edge computer', url: 'https://blogs.nvidia.com/blog/jetson-thor-physical-ai-edge' },
  'nv-3computers': { short: 'NVIDIA blog', title: 'NVIDIA: The Three Computers for Robotics', url: 'https://blogs.nvidia.com/blog/three-computers-robotics/' },
  'gr00t-n1': { short: 'GR00T N1 paper', title: 'GR00T N1: An Open Foundation Model for Generalist Humanoid Robots (arXiv 2503.14734)', url: 'https://arxiv.org/html/2503.14734v1' },
  'diffusion-policy': { short: 'Chi et al. 2023', title: 'Diffusion Policy (RSS 2023, arXiv 2303.04137)', url: 'https://arxiv.org/abs/2303.04137' },
  'nvl72': { short: 'NVIDIA NVL72', title: 'NVIDIA GB200 NVL72', url: 'https://www.nvidia.com/en-us/data-center/gb200-nvl72/' },
  'intel-hkmg': { short: 'Intel 2007', title: 'Intel 45 nm high-k metal gate announcement (C&EN)', url: 'https://cen.acs.org/articles/85/web/2007/01/Intel-Unveils-New-Transistor.html' },
  'wikichip-sram': { short: 'WikiChip IEDM2022', title: 'WikiChip: IEDM 2022 — Did we just witness the death of SRAM?', url: 'https://fuse.wikichip.org/news/7343/iedm-2022-did-we-just-witness-the-death-of-sram/' },
  'llama3': { short: 'Meta Llama 3', title: 'The Llama 3 Herd of Models (16,384 H100 training, failure statistics)', url: 'https://arxiv.org/abs/2407.21783' },
  'alphago-nature': { short: 'Silver et al. 2016', title: 'Mastering the game of Go with deep neural networks and tree search (Nature, 2016)', url: 'https://www.nature.com/articles/nature16961' },
  'alexnet': { short: 'Krizhevsky 2012', title: 'ImageNet Classification with Deep Convolutional Neural Networks (NeurIPS 2012)', url: 'https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html' },
  'vaswani2017': { short: 'Vaswani et al. 2017', title: 'Attention Is All You Need (arXiv 1706.03762)', url: 'https://arxiv.org/abs/1706.03762' },
  'gpt3': { short: 'Brown et al. 2020', title: 'Language Models are Few-Shot Learners (GPT-3, arXiv 2005.14165)', url: 'https://arxiv.org/abs/2005.14165' },
  'openai-chatgpt': { short: 'OpenAI 2022', title: 'Introducing ChatGPT (OpenAI, Nov 30 2022)', url: 'https://openai.com/blog/chatgpt' },
  'anthropic-cai': { short: 'Bai et al. 2022', title: 'Constitutional AI: Harmlessness from AI Feedback (arXiv 2212.08073)', url: 'https://arxiv.org/abs/2212.08073' },
  'anthropic-claude': { short: 'Anthropic', title: 'Anthropic: Claude model announcements', url: 'https://www.anthropic.com/news' },
  'kaplan2020': { short: 'Kaplan et al. 2020', title: 'Scaling Laws for Neural Language Models (arXiv 2001.08361)', url: 'https://arxiv.org/abs/2001.08361' },
  'chinchilla': { short: 'Hoffmann et al. 2022', title: 'Training Compute-Optimal Large Language Models (Chinchilla, arXiv 2203.15556)', url: 'https://arxiv.org/abs/2203.15556' },
  'deepseek-r1': { short: 'DeepSeek 2025', title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL (arXiv 2501.12948)', url: 'https://arxiv.org/abs/2501.12948' },
  'rlhf': { short: 'Ouyang et al. 2022', title: 'Training language models to follow instructions with human feedback (InstructGPT, arXiv 2203.02155)', url: 'https://arxiv.org/abs/2203.02155' },
  'resnet': { short: 'He et al. 2015', title: 'Deep Residual Learning for Image Recognition (arXiv 1512.03385)', url: 'https://arxiv.org/abs/1512.03385' },
  'pollack': { short: 'Pollack 1999', title: 'F. Pollack, "New Microarchitecture Challenges…" (MICRO-32 keynote power density chart)', url: 'https://www.cs.cmu.edu/~ckh/DOCS/pollack-micro32.pdf' },
};

const T = {};
const add = (key, en, ko, desc, analogy, fact, src, extra = {}) => { T[key] = { en, ko, desc, analogy, fact, src, ...extra }; };

// ---------- 프롤로그: 재료 → GPU ----------
add('quartz', 'Silica / High-Purity Quartz', '석영(이산화규소, SiO₂)',
  { ko: '모래의 주성분인 이산화규소 결정. 반도체용 고순도 석영(HPQ)은 캐서 부수고 화학 세척해 불순물을 걷어낸다. 특히 잉곳을 녹이는 석영 도가니의 재료로 쓰인다.', en: 'Silicon dioxide crystal, the main ingredient of sand. High-purity quartz is mined, crushed and acid-leached. It is especially needed for the quartz crucibles that melt silicon.' },
  { ko: '집을 지을 흙을 고르는 첫 단계', en: 'Choosing the clay before building a house' },
  { ko: '미국 노스캐롤라이나 스프루스 파인 광산이 세계 고순도 석영의 약 70~90%를 공급 (BloombergNEF 추정 80%)', en: 'Spruce Pine, North Carolina supplies roughly 70–90% of the world\'s high-purity quartz (BloombergNEF: ~80%)' },
  ['wiki-hpq'], { kid: { ko: '바닷가 모래랑 같은 성분의 하얀 돌이야. 이걸 아주 깨끗하게 골라내는 게 첫 단추야.', en: 'The same stuff as beach sand, a white rock. Picking out the clean parts is step one.' } });
add('mgsi', 'Metallurgical-Grade Silicon', '금속급 실리콘',
  { ko: '석영(SiO₂)과 탄소를 거대한 전기 아크로에서 1,300~2,000 °C로 녹여 산소를 떼어낸 98~99% 순도의 실리콘. SiO₂ + 2C → Si + 2CO.', en: 'Silicon at 98–99% purity, made by reducing quartz with carbon in a submerged arc furnace at roughly 1,300–2,000 °C. SiO₂ + 2C → Si + 2CO.' },
  { ko: '광석에서 쇠를 뽑아내는 제철소', en: 'A steel mill, but for silicon' },
  { ko: '실리콘 1톤에 전력 10~13 MWh가 든다. 세계 생산의 약 85%가 중국(USGS 2023)', en: 'Making one tonne takes 10–13 MWh of electricity. China produces about 85% of the world\'s silicon metal (USGS 2023)' },
  ['usgs-si'], { kid: { ko: '돌에서 산소를 떼어내면 은색 실리콘 덩어리가 남아. 아직은 백 개 중 두 개가 불순물이야.', en: 'Strip the oxygen from the rock and you get silvery silicon. Still two parts in a hundred are impurities.' } });
add('polysi', 'Polysilicon (Siemens Process)', '폴리실리콘(지멘스 공정)',
  { ko: '금속급 실리콘을 염화수소와 반응시켜 트리클로로실란 액체로 만들고, 증류로 정제한 뒤 약 1,000~1,100 °C의 실리콘 봉 위에 며칠간 증착해 99.9999999%(9N) 이상 순도로 만든다.', en: 'Metallurgical silicon is turned into trichlorosilane, distilled, then deposited for days onto silicon rods heated to ~1,000–1,100 °C, reaching 99.9999999% (9N) purity or better.' },
  { ko: '물을 아홉 번 증류해 초순수를 만드는 것', en: 'Distilling water nine times over' },
  { ko: '11N 순도 = 실리콘 원자 1,000억 개 중 불순물 원자 1개', en: '11N purity means one impurity atom per 100 billion silicon atoms' },
  ['wiki-siemens'], { kid: { ko: '실리콘을 액체로 바꿔서 몇 번이고 걸러 낸 다음, 다시 굳혀서 아주 깨끗한 덩어리로 만들어.', en: 'Turn silicon into a liquid, filter it over and over, then harden it again into something very clean.' } });
add('czochralski', 'Czochralski Crystal Growth', '초크랄스키 결정 성장',
  { ko: '석영 도가니에서 폴리실리콘 300~400 kg을 1,414 °C(융점)로 녹이고, 연필 크기의 시드 결정을 담갔다가 분당 0.3~0.7 mm로 천천히 돌리며 끌어올리면 시드와 같은 완벽한 단결정 잉곳이 자란다.', en: 'Polysilicon is melted at 1,414 °C in a quartz crucible; a pencil-sized seed crystal is dipped in and slowly pulled up (0.3–0.7 mm/min) while rotating, growing one perfect single crystal.' },
  { ko: '설탕물에서 얼음사탕 결정을 키우듯', en: 'Growing rock candy from sugar water' },
  { ko: '300 mm 잉곳 하나는 길이 1~2 m, 무게 200~300 kg, 24~72시간 소요. 도가니는 1회용', en: 'A 300 mm ingot is 1–2 m long, 200–300 kg, and takes 24–72 h. The crucible is single-use' },
  ['wiki-cz'], { kid: { ko: '녹인 실리콘에 씨앗을 담갔다가 천천히 뽑아 올려. 그러면 통째로 하나의 결정이 되는 기둥이 자라.', en: 'Dip a seed into molten silicon and pull it up slowly; a single-crystal column grows out.' } });
add('dopant', 'Dopant', '도펀트(불순물 원자)',
  { ko: '순수 실리콘에 아주 조금 섞는 붕소(p형)나 인·비소(n형) 원자. 이것으로 전기가 흐르는 방식을 조절해 트랜지스터를 만들 수 있다.', en: 'Tiny amounts of boron (p-type) or phosphorus/arsenic (n-type) mixed into pure silicon to control how it conducts. This is what makes transistors possible.' },
  { ko: '순수한 물에 소금 한 알을 넣어 전기가 통하게 하는 것', en: 'A pinch of salt that lets pure water conduct' },
  { ko: '트랜지스터 소스/드레인은 실리콘 원자 500개당 불순물 1개(10²⁰ /cm³) 수준으로 진하게 도핑된다', en: 'Source/drain regions are doped to about one dopant per 500 silicon atoms (10²⁰ /cm³)' },
  ['ioffe-si'], { kid: { ko: '순수한 실리콘에 아주 조금 섞는 다른 원자야. 이걸 넣어야 전기가 흐를 수 있어.', en: 'A few different atoms mixed into pure silicon. They let electricity flow.' } });
add('wafer', 'Wafer (300 mm)', '웨이퍼',
  { ko: '잉곳을 다이아몬드 와이어 톱으로 얇게 썰고, 연마·식각·CMP로 거울처럼 다듬은 원판. 지름 300 mm, 두께 775 ± 25 μm(SEMI 규격). 이 위에 칩을 새긴다.', en: 'A disc sliced from the ingot with a diamond wire saw, then ground, etched and polished to a mirror. 300 mm across, 775 ± 25 μm thick (SEMI standard). Chips are printed on it.' },
  { ko: '그림을 그릴 완벽하게 평평한 캔버스', en: 'A perfectly flat canvas for painting' },
  { ko: 'CMP 후 표면 거칠기는 원자 수준(1 nm 미만)', en: 'After CMP polishing the surface roughness is atomic-scale (below 1 nm)' },
  ['wiki-wafer'], { kid: { ko: '칩을 그리는 동그란 판이야. 피자만 하고, 거울처럼 매끈해.', en: 'A round plate where chips are drawn. It is the size of a pizza and as smooth as a mirror.' } });
add('cleanroom', 'Cleanroom (ISO Class 1–3)', '클린룸',
  { ko: '먼지 하나가 회로를 망치므로 공기를 초당 수십 번 갈아 넣고 사람은 방진복을 입는다. 웨이퍼는 25장씩 밀폐 용기(FOUP)에 담겨 천장 레일 로봇(OHT)으로 이동한다.', en: 'One dust particle can ruin a circuit, so air is replaced hundreds of times per hour and people wear bunny suits. Wafers travel 25 to a sealed FOUP on overhead rail robots (OHT).' },
  { ko: '수술실보다 천 배 깨끗한 방', en: 'A room a thousand times cleaner than an operating theatre' },
  { ko: '첨단 팹 건설비는 200억 달러 이상. TSMC 타이난 팹은 하루 물 5,000만 리터 이상을 쓰고 90% 넘게 재활용', en: 'A leading-edge fab costs $20B+. TSMC\'s Tainan fabs use 50M+ litres of water a day and recycle over 90%' },
  ['semianalysis-cowos'], { kid: { ko: '먼지 하나가 회로를 망치니까, 수술실보다 훨씬 깨끗한 방에서 만들어.', en: 'One speck of dust ruins a circuit, so chips are made in a room far cleaner than an operating theatre.' } });
add('photolith', 'Photolithography', '포토리소그래피(노광)',
  { ko: '웨이퍼에 감광액(포토레지스트)을 바르고 마스크(레티클)의 회로 무늬를 빛으로 비춰 새긴다. 노광 → 현상 → 식각을 층마다 반복한다. 5 nm급 공정은 마스크 층이 약 81층.', en: 'Coat the wafer with photoresist, then project the circuit pattern from a mask (reticle) with light. Expose, develop, etch, repeat for every layer. A 5 nm-class process uses about 81 mask layers.' },
  { ko: '스텐실로 페인트를 뿌려 무늬를 찍는 것, 단 나노미터 정밀도로', en: 'Stencil painting, but with nanometre precision' },
  { ko: '노광실이 노란 이유: 감광액이 파란빛·자외선에 반응하므로 그 파장을 뺀 조명을 쓴다', en: 'Litho bays are lit yellow because photoresist reacts to blue and UV light, so those wavelengths are filtered out' },
  ['wikichip-n5'], { kid: { ko: '스텐실에 물감 뿌리듯, 빛으로 회로 무늬를 찍어. 이걸 여든 번 넘게 반복해.', en: 'Like spray-painting through a stencil, light prints the circuit pattern, over eighty times over.' } });
add('euv', 'EUV Lithography (13.5 nm)', '극자외선 노광',
  { ko: 'ASML 장비가 주석 방울을 초당 5만 개 떨어뜨리고 CO₂ 레이저로 두 번 쏴 플라즈마를 만들어 파장 13.5 nm의 빛을 얻는다. 렌즈 대신 몰리브덴/실리콘 다층 거울로 빛을 굽힌다.', en: 'An ASML scanner fires a CO₂ laser at 50,000 tin droplets per second to make a plasma that emits 13.5 nm light. Lenses cannot bend it, so multilayer molybdenum/silicon mirrors are used.' },
  { ko: '태양보다 뜨거운 불꽃으로 그림자를 찍는 카메라', en: 'A camera that prints shadows using a flame hotter than the Sun' },
  { ko: '플라즈마 온도 약 50만 K(태양 표면의 100배). 거울을 독일 크기로 키워도 요철이 0.1 mm(ZEISS). 장비 한 대 약 1.8억 달러', en: 'Plasma ~500,000 K (100× the Sun\'s surface). Scale a mirror to the size of Germany and its bumps would be 0.1 mm (ZEISS). One machine ≈ $180M' },
  ['asml-euv', 'zeiss-euv'], { kid: { ko: '아주아주 작은 빛으로 회로 그림을 찍는 기계야. 빛을 만들려고 작은 주석 방울을 레이저로 쏴.', en: 'A machine that prints circuit pictures with a very, very tiny light. To make the light, it zaps tiny tin droplets with a laser.' } });
add('etch', 'Etch / Deposition / Implant', '식각·증착·이온 주입',
  { ko: '식각(etch)은 플라즈마로 원치 않는 부분을 깎아내고, 증착(CVD/ALD/PVD)은 원자 한 층씩 재료를 입히며, 이온 주입은 도펀트 원자를 가속해 실리콘에 박아 넣는다. 이 세 가지를 수백 번 반복한다.', en: 'Etching removes material with plasma, deposition (CVD/ALD/PVD) adds material one atomic layer at a time, and ion implantation fires dopant atoms into the silicon. These repeat hundreds of times.' },
  { ko: '조각(깎기) + 도금(입히기) + 문신(박기)', en: 'Carving, plating and tattooing, repeated hundreds of times' },
  { ko: 'ALD(원자층 증착)는 한 번에 원자 한 층(약 0.1 nm)씩 쌓는다', en: 'Atomic layer deposition adds one atomic layer (~0.1 nm) per cycle' },
  ['semiwiki-n5'], { kid: { ko: '깎고, 입히고, 박아 넣고. 이 세 가지를 수백 번 반복해서 층을 쌓아 올려.', en: 'Carve, coat, implant. Repeat these three hundreds of times to build up the layers.' } });
add('wafertest', 'Wafer Sort & Binning', '웨이퍼 테스트·비닝',
  { ko: '자르기 전 웨이퍼 위 각 다이에 프로브 카드의 바늘 수만 개를 대고 전기 신호를 넣어 검사한다. 결함 있는 블록은 퓨즈로 끄고 하위 등급으로 판다(비닝).', en: 'Before dicing, a probe card with tens of thousands of needles tests every die electrically. Dies with defective blocks get those blocks fused off and are sold as lower bins.' },
  { ko: '과일 선별장: 흠집 난 과일도 등급을 나눠 판다', en: 'A fruit-sorting line: bruised fruit still sells in a lower grade' },
  { ko: 'GH100 풀 다이는 SM 144개지만 H100 SXM5는 132개, PCIe판은 114개만 켠다. 814 mm² 다이는 수율이 50% 미만이기 쉽다(포아송 모델 추정)', en: 'Full GH100 has 144 SMs; H100 SXM5 enables 132, the PCIe card 114. An 814 mm² die likely yields under 50% (Poisson estimate)' },
  ['nv-h100-wp'], { kid: { ko: '다 만든 다음 하나씩 전기를 넣어 봐. 고장 난 부분은 아예 꺼 버리고 조금 싼 제품으로 팔아.', en: 'Each finished chip gets a shock test; broken parts are switched off and sold as a cheaper model.' } });
add('yield', 'Yield', '수율',
  { ko: '웨이퍼 위 다이 중 정상 동작하는 비율. 다이가 클수록 결함이 들어갈 확률이 높아져 수율이 떨어진다. 그래서 거대 GPU는 처음부터 일부 블록을 끌 것을 전제로 설계한다.', en: 'The share of dies on a wafer that work. Bigger dies are more likely to contain a defect, so giant GPUs are designed from the start to disable some blocks.' },
  { ko: '큰 유리창일수록 기포 없이 만들기 어렵다', en: 'The bigger the pane of glass, the harder to make it bubble-free' },
  { ko: '300 mm 웨이퍼 한 장에서 814 mm² GH100 후보 다이는 약 60~65개. 4 nm급 웨이퍼 가격은 약 1.8~2만 달러(분석가 추정)', en: 'A 300 mm wafer holds only ~60–65 candidate GH100 dies. A 4 nm-class wafer costs roughly $18–20k (analyst estimate)' },
  ['semianalysis-cowos'], { kid: { ko: '한 판에서 몇 개나 멀쩡하게 나오느냐. 칩이 클수록 성공률이 뚝 떨어져.', en: 'How many come out working from one wafer. The bigger the chip, the lower the odds.' } });
add('dicing', 'Dicing', '다이싱(절단)',
  { ko: '웨이퍼 뒷면을 얇게 갈고 다이아몬드 블레이드나 레이저(스텔스 다이싱)로 다이 사이 스크라이브 라인을 잘라 낱개 칩으로 분리한 뒤 로봇이 하나씩 집어 옮긴다.', en: 'The wafer back is thinned, then a diamond blade or laser (stealth dicing) cuts along scribe lines between dies. A pick-and-place robot lifts each chip.' },
  { ko: '쿠키 판에서 쿠키를 하나씩 떼어내기', en: 'Snapping cookies off a baking sheet' },
  { ko: '스텔스 다이싱은 레이저를 실리콘 내부에 집속해 안쪽부터 균열을 내며 톱밥이 없다', en: 'Stealth dicing focuses a laser inside the silicon to crack it from within, with no sawdust' },
  ['tsmc-cowos'], { kid: { ko: '쿠키 판에서 쿠키를 떼어내듯, 웨이퍼를 잘라 칩 한 개씩으로 나눠.', en: 'Like snapping cookies off a tray, the wafer is cut into single chips.' } });
add('hbm', 'HBM (High Bandwidth Memory)', '고대역폭 메모리',
  { ko: 'DRAM 다이를 8~12장 수직으로 쌓고 TSV(실리콘 관통 전극)로 연결한 메모리 탑. 스택당 1,024개 신호선으로 GPU 옆에 바짝 붙어 엄청난 대역폭을 낸다.', en: 'A tower of 8–12 DRAM dies stacked vertically and wired through TSVs. Each stack has a 1,024-bit interface and sits right beside the GPU for enormous bandwidth.' },
  { ko: '도시 바로 옆 고층 창고 단지', en: 'High-rise warehouses right next to the city' },
  { ko: 'H100: HBM3 5스택 활성(6자리 중), 80 GB, 3.35 TB/s. B200: HBM3e 8스택, 192 GB(데이터시트 180 GB), 8 TB/s', en: 'H100: 5 of 6 HBM3 stacks active, 80 GB, 3.35 TB/s. B200: 8 HBM3e stacks, 192 GB (datasheet 180 GB), 8 TB/s' },
  ['nv-h100-wp', 'skhynix-hbm3'], { kid: { ko: 'GPU 옆에 세운 기억 창고 탑이야. 메모리 칩을 8층, 12층으로 쌓아서 아주 빨라.', en: 'Memory warehouse towers next to the GPU. Memory chips are stacked 8 or 12 high, so they are very fast.' } });
add('tsv', 'TSV (Through-Silicon Via)', '실리콘 관통 전극',
  { ko: 'DRAM 다이를 관통하는 수직 구리 기둥. 다이를 약 30 μm까지 얇게 갈아 TSV가 드러나게 한 뒤 위아래 다이를 마이크로범프로 잇는다.', en: 'Vertical copper pillars drilled through DRAM dies. Dies are thinned to about 30 μm so the TSVs poke through, then stacked with microbumps.' },
  { ko: '아파트 층을 잇는 엘리베이터 통로', en: 'Elevator shafts linking apartment floors' },
  { ko: 'HBM3 다이 한 장에 TSV 수천 개(SK hynix 8,000개 이상 추정), 직경 약 5~10 μm(2차 자료)', en: 'Thousands of TSVs per HBM3 die (SK hynix: 8,000+ est.), each ~5–10 μm wide (secondary sources)' },
  ['skhynix-hbm3'], { kid: { ko: '칩을 위아래로 쌓으려면 층을 뚫는 엘리베이터가 필요해. 그게 구리 기둥이야.', en: 'To stack chips you need elevators through the floors: these copper pillars.' } });
add('interposer', 'Silicon Interposer / CoWoS', '실리콘 인터포저 / CoWoS',
  { ko: 'GPU 다이와 HBM 스택을 나란히 얹는 얇은 실리콘 판. 그 안의 미세 배선이 수천 개 신호선을 잇는다. TSMC의 CoWoS(Chip-on-Wafer-on-Substrate) 2.5D 패키징.', en: 'A thin silicon slab on which the GPU die and HBM stacks sit side by side, linked by fine wiring inside it. TSMC\'s CoWoS 2.5D packaging.' },
  { ko: '도시와 창고를 한 덩어리로 받치는 인공 지반', en: 'Artificial ground that carries the city and its warehouses as one' },
  { ko: 'H100 = CoWoS-S(실리콘 인터포저), B200 = CoWoS-L(브리지 다이). 2023~24년 H100 품귀의 원인은 실리콘 수율이 아니라 CoWoS 패키징 용량', en: 'H100 uses CoWoS-S (silicon interposer), B200 CoWoS-L (bridge dies). The 2023–24 H100 shortage was CoWoS capacity, not silicon yield' },
  ['tsmc-cowos', 'semianalysis-cowos'], { kid: { ko: '칩과 메모리를 한 판 위에 나란히 앉히는 받침대야. 그 안에 아주 가는 길이 수천 개 나 있어.', en: 'A tray that seats the chip and memory side by side, with thousands of hair-thin roads inside.' } });
add('microbump', 'Microbump & C4 Bump', '마이크로범프 / C4 범프',
  { ko: '다이와 인터포저를 잇는 작은 솔더 구슬(약 40 μm 간격)과, 인터포저를 기판에 잇는 더 큰 구슬(약 130 μm). 그 아래 기판은 BGA(약 1 mm)로 보드에 붙는다.', en: 'Tiny solder balls (~40 μm pitch) join die to interposer; larger C4 bumps (~130 μm) join interposer to substrate; BGA balls (~1 mm) join substrate to board.' },
  { ko: '층마다 크기가 다른 레고 스터드', en: 'Lego studs that get bigger at every layer down' },
  { ko: '기판 절연 필름 ABF는 조미료 회사 아지노모토가 개발했다', en: 'ABF, the substrate insulator film, was invented by the seasoning company Ajinomoto' },
  ['tsmc-cowos', 'ajinomoto'], { kid: { ko: '칩을 붙이는 아주 작은 땜납 구슬이야. 머리카락 절반 굵기 간격으로 수만 개가 박혀.', en: 'Tiny solder balls that join chips, tens of thousands of them spaced half a hair apart.' } });
add('reticle', 'Reticle Limit', '레티클 한계',
  { ko: '노광기가 한 번에 찍을 수 있는 최대 면적 26 × 33 mm = 858 mm². GH100(814 mm²)은 사실상 이 한계 크기다. Blackwell은 그래서 다이 두 개를 붙였다.', en: 'The largest area a scanner can print in one shot: 26 × 33 mm = 858 mm². GH100 (814 mm²) is essentially at this limit, which is why Blackwell joins two dies.' },
  { ko: '프린터 한 장의 최대 크기', en: 'The biggest sheet the printer can take' },
  { ko: 'B200 두 다이는 NV-HBI 10 TB/s 링크로 하나의 GPU처럼 동작', en: 'B200\'s two dies act as one GPU over a 10 TB/s NV-HBI link' },
  ['nv-blackwell', 'tsmc-cowos'], { kid: { ko: '한 번에 찍을 수 있는 도장 크기가 정해져 있어. 그보다 큰 칩은 못 만들어.', en: 'There is a maximum stamp size for one print; you cannot make a chip bigger than that.' } });
add('finaltest', 'Final Test & Speed Binning', '최종 테스트·스피드 비닝',
  { ko: '패키징된 GPU를 소켓에 꽂아 전 기능을 검사하고, 125 °C 이상 고온·고전압 번인으로 초기 불량을 걸러낸다. 칩마다 공정 편차를 재서 동작 전압을 퓨즈에 기록한다.', en: 'Packaged GPUs are socketed and fully tested, then burned in at 125 °C+ and high voltage to weed out early failures. Each chip\'s speed grade is measured and burned into fuses.' },
  { ko: '출고 전 차량 주행 시험', en: 'The road test before a car leaves the factory' },
  { ko: '같은 H100이라도 칩마다 동작 전압이 조금씩 다르다', en: 'Two H100s can run at slightly different voltages, set by their fuses' },
  ['sth-sxm5'], { kid: { ko: '출고 전 주행 시험 같은 거야. 뜨겁게 달궈 돌려 보고 약한 놈을 걸러 내.', en: 'Like a road test before shipping: run it hot and weed out the weak ones.' } });
add('vrm', 'VRM (Voltage Regulator Module)', '전압 조정 모듈',
  { ko: '보드에 들어온 12 V(또는 48 V) 전기를 GPU가 쓰는 약 1 V 이하의 낮은 전압·수백 A의 큰 전류로 바꾸는 회로. 인덕터와 파워 스테이지가 줄지어 있다.', en: 'Converts the board\'s 12 V (or 48 V) into the ~1 V, hundreds-of-amps supply the GPU needs. Rows of inductors and power stages.' },
  { ko: '고압 송전선을 가정용 전기로 바꾸는 변전소', en: 'The substation that turns high-voltage lines into household power' },
  { ko: 'H100 SXM5 모듈은 700 W, 파워 스테이지 약 61개(사진 분석). 팬이 없고 섀시 히트싱크/수냉에 의존', en: 'H100 SXM5 is 700 W with ~61 power stages (photo analysis). No fan: it relies on the chassis heatsink or liquid cooling' },
  ['sth-sxm5'], { kid: { ko: '집에 들어오는 전기를 기계가 쓰는 낮은 전압으로 바꿔 주는 변압기 역할이야.', en: 'A transformer that converts incoming power into the low voltage the chip actually uses.' } });
add('sxm', 'SXM Module / PCIe Card', 'SXM 모듈 / PCIe 카드',
  { ko: '데이터센터 GPU는 케이블 없이 베이스보드에 꽂는 SXM 모듈 형태(H100 SXM5, 700 W). 소비자용 RTX 4090은 PCIe 카드(450 W, 16핀 전원). HGX 베이스보드 하나에 SXM 8장이 올라간다.', en: 'Data-center GPUs are SXM mezzanine modules plugged straight into a baseboard (H100 SXM5, 700 W). The consumer RTX 4090 is a PCIe card (450 W, 16-pin power). One HGX baseboard carries eight SXM modules.' },
  { ko: '섬 위에 세워진 대도시권: 발전소(VRM)와 항구(NVLink/PCIe)가 있다', en: 'A metro area on an island, with its power plant (VRM) and harbours (NVLink/PCIe)' },
  { ko: 'HGX H100 8-GPU 베이스보드: 무게 24 kg, 5,600 W, NVSwitch 4개', en: 'HGX H100 8-GPU baseboard: 24 kg, 5,600 W, four NVSwitches' },
  ['nv-h100-wp', 'sth-sxm5'], { kid: { ko: 'GPU를 서버에 꽂는 방식이야. 케이블 없이 보드에 바로 눕혀 꽂아.', en: 'How a GPU plugs into a server: no cables, just laid straight onto the board.' } });
add('dgx', 'DGX / GB200 NVL72', 'DGX 서버 / NVL72 랙',
  { ko: '로봇의 두뇌를 학습시키는 데이터센터 컴퓨터. DGX H100은 GPU 8장(10.2 kW). GB200 NVL72 랙은 Blackwell GPU 72개 + Grace CPU 36개를 NVLink 130 TB/s로 묶고 약 120 kW를 액체 냉각한다.', en: 'The data-center computers that train the robot\'s brain. DGX H100 has 8 GPUs (10.2 kW). A GB200 NVL72 rack links 72 Blackwell GPUs + 36 Grace CPUs with 130 TB/s NVLink and liquid-cools ~120 kW.' },
  { ko: '로봇 학교. 로봇은 여기서 배운 뒤 몸(Jetson)에 뇌를 복사한다', en: 'Robot school. The brain is trained here, then copied into the body (Jetson)' },
  { ko: 'Meta의 Llama 3 405B 학습: H100 16,384장, 54일, 그중 HBM 오류로 72회 중단', en: 'Meta trained Llama 3 405B on 16,384 H100s for 54 days; 72 interruptions were HBM errors' },
  ['nvl72', 'llama3'], { kid: { ko: 'GPU 여덟 장을 한 상자에 넣은 컴퓨터야. 로봇의 뇌를 여기서 가르쳐.', en: 'A box holding eight GPUs. This is where a robot\'s brain is taught.' } });
add('jetson', 'Jetson AGX Thor', '젯슨 AGX 토르(로봇 두뇌)',
  { ko: '로봇 몸속에 들어가는 손바닥 크기 컴퓨터. Blackwell GPU(CUDA 코어 2,560개, 활성 SM 20개), 14코어 Arm CPU, 128 GB 메모리, 40~130 W. 2025년 8월 출시.', en: 'The palm-sized computer inside the robot: a Blackwell GPU (2,560 CUDA cores, 20 active SMs), 14-core Arm CPU, 128 GB memory, 40–130 W. Shipped August 2025.' },
  { ko: '데이터센터 GPU의 축소판이 로봇 등에 들어 있다', en: 'A pocket-sized data-center GPU riding in the robot\'s back' },
  { ko: 'FP4 희소 2,070 TFLOPS(밀집 FP8 1,035). NVIDIA는 로봇 시대를 "세 대의 컴퓨터"(DGX 학습 → Omniverse 시뮬 → Jetson 실행)로 설명', en: '2,070 TFLOPS FP4 sparse (1,035 dense FP8). NVIDIA\'s "three computers": DGX trains, Omniverse simulates, Jetson runs' },
  ['nv-jetson-thor', 'nv-3computers'], { kid: { ko: '데이터센터 컴퓨터를 손바닥만 하게 줄인 것. 로봇 몸속에 들어가.', en: 'A data-center computer shrunk to palm size, riding inside the robot.' } });
add('physicalai', 'Physical AI', '피지컬 AI',
  { ko: '카메라·센서로 세상을 보고, 판단하고, 팔다리를 움직여 실제 세계와 상호작용하는 AI. 언어 모델이 글을 다루듯, 피지컬 AI는 물리 세계를 다룬다.', en: 'AI that perceives the world through cameras and sensors, reasons, and moves limbs to act in the physical world. Where language models handle text, physical AI handles matter.' },
  { ko: '몸을 가진 AI', en: 'AI with a body' },
  { ko: 'GR00T N1은 느린 뇌(VLM, 약 10 Hz)와 빠른 뇌(디퓨전 트랜스포머, 약 120 Hz)의 이중 구조. 총 22억 파라미터', en: 'GR00T N1 pairs a slow brain (VLM, ~10 Hz) with a fast brain (diffusion transformer, ~120 Hz). 2.2B parameters total' },
  ['gr00t-n1', 'nv-3computers'], { kid: { ko: '몸을 가진 AI야. 눈으로 보고, 판단하고, 팔다리를 움직여.', en: 'AI with a body: it sees, decides and moves its limbs.' } });
add('frame', 'Camera Frame → Action', '카메라 프레임 → 행동',
  { ko: '로봇 카메라가 1/30초마다 찍는 사진 한 장(224×224 RGB = 숫자 150,528개)이 GPU에서 이미지 토큰 64개로 압축되고, 언어 모델과 행동 모델을 거쳐 관절 목표 16개가 된다. 이 데이터를 따라 내려간다.', en: 'Every 1/30 s the robot camera takes one frame (224×224 RGB = 150,528 numbers). The GPU compresses it to 64 image tokens, runs it through the language and action models, and outputs 16 joint targets. You follow this data down.' },
  { ko: '택배 상자 하나가 물류망을 거쳐 배달되는 여정', en: 'One parcel\'s journey through the delivery network' },
  { ko: 'GR00T N1은 L40 GPU에서 행동 16개를 63.9 ms에 생성. 다음 프레임은 33 ms 뒤에 도착한다', en: 'GR00T N1 samples 16 actions in 63.9 ms on an L40. The next frame arrives 33 ms later' },
  ['gr00t-n1', 'diffusion-policy'], { kid: { ko: '로봇 눈이 찍은 사진 한 장이 손동작이 되기까지, 그 길을 따라가는 거야.', en: 'You follow one photo from the robot\'s eye all the way to a hand movement.' } });

// ---------- 하강: 보드 → 다이 ----------
add('pcb', 'Printed Circuit Board', '인쇄 회로 기판',
  { ko: '여러 층의 구리 배선을 유리섬유 판에 겹친 기판. GPU 패키지, VRM, 커넥터를 잇는 도로망이다. NVLink 같은 초고속 신호에는 초저손실 소재를 쓴다.', en: 'Layers of copper traces laminated into a fibreglass board: the road network joining the GPU package, VRM and connectors. Ultra-low-loss materials carry NVLink-speed signals.' },
  { ko: '대도시권의 도로망', en: 'The metro area\'s road network' },
  { ko: 'RTX 4090 FE 카드: 304 × 137 × 61 mm, 3슬롯, 2.19 kg', en: 'RTX 4090 FE card: 304 × 137 × 61 mm, 3 slots, 2.19 kg' },
  ['nv-ada-wp'], { kid: { ko: '부품들을 잇는 초록색 도로판이야. 구리 선이 층층이 깔려 있어.', en: 'The green road board that links the parts, with copper lines layered inside.' } });
add('nvlink', 'NVLink', '엔브이링크',
  { ko: 'GPU끼리 직접 데이터를 주고받는 전용 고속 통로. PCIe보다 훨씬 넓다. 여러 GPU가 하나의 큰 모델을 나눠 계산할 때 결과를 합치는 데 쓴다.', en: 'A dedicated high-speed link between GPUs, far wider than PCIe. Used when many GPUs split one big model and must combine results.' },
  { ko: '도시와 도시를 잇는 전용 고속철', en: 'A dedicated bullet train between cities' },
  { ko: 'H100: 4세대 NVLink 18링크 900 GB/s. B200: 5세대 1.8 TB/s. RTX 4090: 없음', en: 'H100: 4th-gen NVLink, 18 links, 900 GB/s. B200: 5th-gen, 1.8 TB/s. RTX 4090: none' },
  ['nv-h100-wp', 'nv-blackwell'], { kid: { ko: 'GPU끼리만 다니는 전용 고속도로야. 여러 장이 한 몸처럼 일할 때 써.', en: 'A private highway between GPUs, used when several work as one.' } });
add('pcie', 'PCIe (PCI Express)', 'PCIe',
  { ko: 'CPU와 GPU를 잇는 표준 통로. 커널 실행 명령과 데이터가 이 길로 GPU에 들어온다.', en: 'The standard link between CPU and GPU. Kernel launch commands and data enter the GPU through it.' },
  { ko: '도시로 들어오는 고속도로 나들목', en: 'The highway on-ramp into the city' },
  { ko: 'H100: PCIe Gen5 ×16 (양방향 128 GB/s). RTX 4090: Gen4 ×16', en: 'H100: PCIe Gen5 ×16 (128 GB/s bidirectional). RTX 4090: Gen4 ×16' },
  ['nv-h100-wp'], { kid: { ko: '컴퓨터 본체와 GPU를 잇는 표준 통로야. 일감이 이 길로 들어와.', en: 'The standard road between the computer and the GPU. Work comes in this way.' } });
add('package', 'GPU Package', 'GPU 패키지',
  { ko: '다이·인터포저·HBM·기판·방열 뚜껑을 한 덩어리로 묶은 것. 보드에 보이는 "칩"은 사실 이 패키지다. 안에는 실리콘 조각 여러 개가 들어 있다.', en: 'Die, interposer, HBM stacks, substrate and heat-spreader lid bonded into one unit. The "chip" you see on the board is really this package holding several silicon pieces.' },
  { ko: '도시 + 창고 + 인공 지반을 한 상자에', en: 'City, warehouses and ground in one box' },
  { ko: 'H100 패키지 크기 약 55 × 58 mm(Locuza 추정, 미확인). HBM 다이 48장 + 베이스 다이 6장이 GPU 다이 1장과 함께 들어간다', en: 'H100 package ≈ 55 × 58 mm (Locuza estimate, unverified). 48 HBM dies + 6 base dies ride alongside the single GPU die' },
  ['cc-h100'], { kid: { ko: '칩과 메모리를 한 상자에 담아 놓은 것. 우리가 보는 \'칩\'은 사실 이 상자야.', en: 'Chip and memory packed into one box. The \'chip\' you see is really this box.' } });
add('die', 'Die', '다이(칩 본체)',
  { ko: '웨이퍼에서 잘라낸 실리콘 한 조각. 트랜지스터 수백억 개가 새겨진 도시 그 자체. GH100은 814 mm², 트랜지스터 800억 개, TSMC 4N 공정.', en: 'One piece of silicon cut from the wafer: the city itself, with tens of billions of transistors. GH100 is 814 mm², 80 billion transistors, TSMC 4N.' },
  { ko: '도시', en: 'The city' },
  { ko: 'AD102(RTX 4090): 608.5 mm², 763억. B200: 다이 2개, 합 2,080억. 800억 트랜지스터 ≈ 사람 뇌 뉴런 860억 개와 비슷한 수', en: 'AD102 (RTX 4090): 608.5 mm², 76.3B. B200: two dies, 208B total. 80B transistors ≈ the 86B neurons in a human brain' },
  ['nv-h100-wp', 'nv-ada-wp', 'nv-blackwell'], { kid: { ko: '실리콘으로 만든 아주 작은 도시야. 이 안에 스위치가 800억 개나 있어. 사람 머릿속 뇌세포 수랑 비슷해!', en: 'A tiny city made of silicon. It holds 80 billion switches, about as many as the brain cells in your head!' } });
add('gigathread', 'GigaThread Engine', '기가스레드 엔진',
  { ko: '칩 전체의 작업 배분 본부. 커널이 수천 개의 스레드 블록으로 쪼개지면, 이 엔진이 자원이 남는 SM에 블록을 던져 준다.', en: 'The chip-wide work dispatcher. When a kernel splits into thousands of thread blocks, this engine hands each block to an SM with free resources.' },
  { ko: '도시의 배차 본부', en: 'The city\'s dispatch centre' },
  { ko: 'SM 하나는 최대 32블록·64워프(2,048스레드)를 동시에 품는다(Hopper)', en: 'One Hopper SM can hold up to 32 blocks / 64 warps (2,048 threads) at once' },
  ['nv-h100-wp', 'cuda-guide'], { kid: { ko: '일감을 나눠 주는 배차 사무실이야. 어느 집이 한가한지 보고 던져 줘.', en: 'The dispatch office that hands out work to whichever house is free.' } });
add('l2', 'L2 Cache', 'L2 캐시',
  { ko: '다이 중앙의 큰 SRAM 창고. 모든 SM이 공유하며 HBM에서 가져온 데이터를 붙잡아 둔다. H100은 50 MB가 두 파티션으로 나뉘어 있어 먼 쪽 파티션은 두 배 느리다.', en: 'The big SRAM depot in the middle of the die, shared by every SM, holding data fetched from HBM. H100\'s 50 MB is split into two partitions, and the far one is twice as slow.' },
  { ko: '도시 중앙 물류센터 2동', en: 'Two central logistics depots' },
  { ko: 'H100 L2 지연: 가까운 파티션 약 264클럭, 먼 파티션 약 502클럭(측정). RTX 4090: 72 MB. B200: 126 MB(측정)', en: 'H100 L2 latency: ~264 cycles near, ~502 far (measured). RTX 4090: 72 MB. B200: 126 MB (measured)' },
  ['luo2024', 'cc-h100'], { kid: { ko: '마을들이 같이 쓰는 큰 창고야. 멀리 있는 창고까지 가기 전에 여기서 먼저 찾아봐.', en: 'A big storeroom shared by all the villages. Check here before going to the far-away warehouse.' } });
add('memctrl', 'Memory Controller', '메모리 컨트롤러',
  { ko: 'HBM 스택과 대화하는 창구. 어느 줄·어느 칸의 데이터를 읽을지 명령하고, ECC로 오류를 검출·정정한다.', en: 'The gateway that talks to HBM stacks: which row and column to read, with ECC to detect and correct errors.' },
  { ko: '창고의 출하 사무소', en: 'The warehouse shipping office' },
  { ko: 'H100: 512-bit 컨트롤러 10개 활성(HBM 5스택 × 1,024-bit)', en: 'H100: 10 active 512-bit controllers (5 HBM stacks × 1,024-bit)' },
  ['nv-h100-wp'], { kid: { ko: '창고에 \'몇 번 칸 물건 꺼내 줘\'라고 주문하는 창구야.', en: 'The counter that asks the warehouse for the item in a particular slot.' } });
add('gpc', 'GPC (Graphics Processing Cluster)', '그래픽 처리 클러스터',
  { ko: '다이를 나누는 큰 행정구. H100은 GPC 8개, 각 GPC에 TPC 최대 9개(SM 18개). 그래픽용 GPU라면 삼각형을 픽셀로 바꾸는 래스터 엔진이 여기 있다.', en: 'The big district of the die. H100 has 8 GPCs, each with up to 9 TPCs (18 SMs). On graphics GPUs the raster engine that turns triangles into pixels lives here.' },
  { ko: '행정구', en: 'A city district' },
  { ko: 'Hopper부터 "스레드 블록 클러스터"는 반드시 같은 GPC 안 SM들에 배치된다. RTX 4090: GPC 11개(풀 12)', en: 'Since Hopper, a thread block cluster is always placed on SMs within one GPC. RTX 4090: 11 GPCs (12 on the full die)' },
  ['nv-h100-wp', 'cuda-guide'], { kid: { ko: '칩을 나눈 큰 구역이야. 도시로 치면 구(區) 하나.', en: 'A big district of the chip, like one borough of a city.' } });
add('raster', 'Raster Engine', '래스터 엔진',
  { ko: '3D 삼각형을 화면 픽셀로 바꾸는 장치. 게임 그래픽의 핵심. H100 같은 AI용 GPU는 이 기능을 거의 쓰지 않는다(그래픽 가능 TPC 2개뿐).', en: 'Turns 3D triangles into screen pixels: the heart of game graphics. AI GPUs like H100 barely use it (only 2 TPCs can do graphics).' },
  { ko: '구청 앞 광장의 도면 인쇄소', en: 'The district\'s blueprint-to-pixel print shop' },
  { ko: 'RTX 4090: GPC마다 래스터 엔진 1개 + ROP 16개. H100은 디스플레이 출력조차 없다', en: 'RTX 4090: one raster engine + 16 ROPs per GPC. H100 has no display output at all' },
  ['nv-ada-wp', 'nv-h100-wp'], { kid: { ko: '삼각형을 화면의 점으로 바꿔 주는 장치야. 게임 화면이 여기서 나와.', en: 'Turns triangles into screen dots. Game images are born here.' } });
add('tpc', 'TPC (Texture Processing Cluster)', '텍스처 처리 클러스터',
  { ko: 'SM 두 채가 나란히 붙은 블록. 그래픽 GPU에서는 두 SM이 지오메트리를 처리하는 PolyMorph 엔진을 함께 쓴다.', en: 'A block of two SMs side by side. On graphics GPUs the pair shares a PolyMorph engine for geometry work.' },
  { ko: '집 두 채가 마당을 공유하는 블록', en: 'Two houses sharing a yard' },
  { ko: 'H100: TPC 66개 활성(풀 72). RTX 4090: 64개(풀 72)', en: 'H100: 66 TPCs active (72 full). RTX 4090: 64 (72 full)' },
  ['nv-h100-wp', 'nv-ada-wp'], { kid: { ko: '집 두 채가 마당을 같이 쓰는 한 블록이야.', en: 'One block where two houses share a yard.' } });
add('sm', 'Streaming Multiprocessor (SM)', '스트리밍 멀티프로세서',
  { ko: 'GPU의 기본 "집". 처리 블록(방) 4개, FP32 코어 128개, 텐서 코어 4개, 256 KB 레지스터, 256 KB L1/공유 메모리(창고)를 갖추고 최대 2,048개 스레드가 동시에 산다.', en: 'The GPU\'s basic "house": 4 processing blocks (rooms), 128 FP32 cores, 4 Tensor Cores, 256 KB of registers, 256 KB L1/shared memory (pantry), and up to 2,048 resident threads.' },
  { ko: '방 4개짜리 집. 방마다 32명 작업조가 산다', en: 'A four-room house; each room has a crew of 32' },
  { ko: 'H100: SM 132개(풀 144). RTX 4090: 128개, L1은 128 KB. B200: 148개 + 텐서 전용 메모리(TMEM) 256 KB', en: 'H100: 132 SMs (144 full). RTX 4090: 128, with 128 KB L1. B200: 148, plus 256 KB Tensor Memory' },
  ['nv-h100-wp', 'nv-ada-wp', 'cc-b200'], { kid: { ko: '일꾼 128명이 사는 마을이야. 방이 4개 있고, 방마다 32명이 같이 일해.', en: 'A village where 128 workers live. It has four rooms, and 32 workers share each room.' } });
add('l1shared', 'L1 Cache / Shared Memory', 'L1 캐시 / 공유 메모리',
  { ko: 'SM 안의 빠른 창고(SRAM). 같은 블록의 스레드끼리 데이터를 주고받는 공유 메모리와 L1 캐시가 256 KB를 나눠 쓴다. 공유 메모리는 약 29클럭, L1은 약 33~41클럭에 응답한다.', en: 'The fast SRAM pantry inside the SM. Shared memory (for threads in a block to exchange data) and the L1 cache split 256 KB. Shared responds in ~29 cycles, L1 in ~33–41 (measured).' },
  { ko: '집 안 창고', en: 'The pantry inside the house' },
  { ko: 'Hopper의 분산 공유 메모리(DSMEM)는 클러스터 내 옆집 SM 창고에 직접 접근(약 180클럭)', en: 'Hopper\'s Distributed Shared Memory lets an SM reach a neighbour SM\'s pantry directly (~180 cycles)' },
  ['luo2024', 'nv-h100-wp'], { kid: { ko: '집 안 창고야. 자주 쓰는 물건을 가까이 두면 훨씬 빨라.', en: 'The pantry inside the house: keeping what you use close makes everything faster.' } });
add('tma', 'TMA (Tensor Memory Accelerator)', '텐서 메모리 가속기',
  { ko: '큰 데이터 타일을 HBM/L2에서 공유 메모리로 비동기 복사하는 SM의 화물 터미널. 스레드가 주소 계산에 매달리지 않게 해 준다.', en: 'The SM\'s cargo terminal: copies big data tiles from HBM/L2 to shared memory asynchronously so threads don\'t waste time computing addresses.' },
  { ko: '집 앞 택배 하역장', en: 'The loading dock at the house' },
  { ko: 'Hopper에서 처음 도입. 완료는 비동기 트랜잭션 배리어로 알린다', en: 'Introduced with Hopper; completion is signalled by an asynchronous transaction barrier' },
  ['nv-hopper-blog'], { kid: { ko: '짐을 알아서 옮겨 주는 하역 로봇이야. 일꾼은 계산만 하면 돼.', en: 'A loading robot that moves the cargo, so the workers only have to compute.' } });
add('subpartition', 'Processing Block (Sub-partition)', '처리 블록(서브파티션)',
  { ko: 'SM의 방 하나. 워프 스케줄러 1, 디스패치 1, FP32 코어 32, INT32 16, FP64 16, 텐서 코어 1, 레지스터 64 KB, L0 명령 캐시. 매 클럭 워프 하나에 명령 하나를 발행한다.', en: 'One room of the SM: 1 warp scheduler, 1 dispatch unit, 32 FP32 cores, 16 INT32, 16 FP64, 1 Tensor Core, 64 KB registers, an L0 instruction cache. It issues one instruction to one warp per clock.' },
  { ko: '방장(스케줄러) 1명과 작업대 32개가 있는 방', en: 'A room with one foreman and 32 workbenches' },
  { ko: 'RTX 4090의 방: FP32 전용 16 + FP32/INT32 겸용 16, FP64는 SM당 2개뿐', en: 'RTX 4090\'s room: 16 FP32-only + 16 FP32/INT32 shared; only 2 FP64 units per SM' },
  ['nv-h100-wp', 'nv-ada-wp'], { kid: { ko: '집 안의 방 하나야. 방장 한 명과 작업대 서른두 개가 있어.', en: 'One room in the house: a foreman and thirty-two workbenches.' } });
add('warpsched', 'Warp Scheduler & Dispatch', '워프 스케줄러·디스패치',
  { ko: '방장. 준비된 워프들 중 하나를 골라 매 클럭 명령 1개를 내린다. 어떤 워프가 메모리를 기다리면 다른 워프를 돌려 시간을 숨긴다(지연 숨기기).', en: 'The foreman. Each clock it picks one ready warp and issues one instruction. If a warp is waiting on memory, another warp runs instead (latency hiding).' },
  { ko: '기다리는 팀 대신 준비된 팀을 바로 투입하는 감독', en: 'A coach who subs in whoever is ready' },
  { ko: '스케줄링 힌트는 컴파일러가 명령어 안 128-bit 제어 코드(대기 클럭 수, 스코어보드 6개)로 미리 적어 둔다(역공학)', en: 'The compiler pre-encodes scheduling hints in 128-bit instruction control codes (stall counts, 6 scoreboards) — reverse-engineered' },
  ['jia2018', 'luo2024'], { kid: { ko: '누가 지금 일할 수 있는지 보고 순서를 정해 주는 반장이야.', en: 'The foreman who checks who is ready and decides whose turn it is.' } });
add('warp', 'Warp (32 threads, SIMT)', '워프',
  { ko: '32개 스레드가 같은 명령을 한 번에 수행하는 단위. GPU 병렬성의 심장. 32명이 "if"에서 서로 다른 길로 가면 워프 분기가 일어나 절반이 멈춰 기다린다.', en: 'A group of 32 threads that execute the same instruction together: the heart of GPU parallelism. If they split at an "if", warp divergence makes half of them idle.' },
  { ko: '같은 구령에 맞춰 움직이는 32명 작업조', en: 'A crew of 32 moving to the same call' },
  { ko: 'H100 SM당 최대 64워프 상주. RTX 4090은 48워프. 스레드당 레지스터 최대 255개', en: 'Up to 64 resident warps per H100 SM; 48 on RTX 4090. Up to 255 registers per thread' },
  ['cuda-guide', 'hopper-tuning'], { kid: { ko: '32명이 한 줄로 서서 똑같은 일을 동시에 해. 한 명이 딴 길로 가면 나머지는 기다려야 해.', en: '32 workers stand in a line and do the same job at the same time. If one goes a different way, the rest have to wait.' } });
add('thread', 'Thread / Lane', '스레드(레인)',
  { ko: '워프의 구성원 한 명. 자기 레지스터를 가지고 자기 데이터 한 조각(예: 픽셀 하나, 행렬 원소 하나)을 맡는다. GPU 프로그램은 이 스레드를 수만~수백만 개 띄운다.', en: 'One member of a warp with its own registers, in charge of one piece of data (a pixel, a matrix element). A GPU program launches tens of thousands to millions of them.' },
  { ko: '작업조원 1명', en: 'One worker in the crew' },
  { ko: 'H100 전체 스레드 슬롯: 132 SM × 2,048 = 270,336개', en: 'H100 total thread slots: 132 SMs × 2,048 = 270,336' },
  ['cuda-guide'], { kid: { ko: '작업조원 한 명이야. 자기 숫자 하나를 맡아서 계산해.', en: 'One worker in the crew, handling a single number.' } });
add('coalescing', 'Memory Coalescing & Cache Line', '메모리 병합·캐시 라인',
  { ko: '워프 32명이 이웃한 주소를 읽으면 한 번의 128 B 캐시 라인(32 B 섹터 4개)으로 합쳐 가져온다. 흩어진 주소를 읽으면 32번 따로 가야 해 느리다.', en: 'If the 32 threads read neighbouring addresses, the loads merge into one 128-byte cache line (four 32-byte sectors). Scattered addresses mean 32 separate trips.' },
  { ko: '32명이 한 버스에 타느냐, 택시 32대를 부르느냐', en: 'One bus for 32 people, or 32 taxis' },
  { ko: 'L1 라인 128 B, 섹터 32 B — 필요한 섹터만 가져온다', en: 'L1 line 128 B, sector 32 B — only needed sectors are fetched' },
  ['cuda-guide', 'jia2018'], { kid: { ko: '서른두 명이 한 버스에 같이 타면 빠르고, 택시를 따로 부르면 느려.', en: 'Thirty-two people on one bus is fast; thirty-two taxis is slow.' } });
add('cudacore', 'CUDA Core (FP32 FMA Unit)', 'CUDA 코어(FMA 유닛)',
  { ko: '곱셈과 덧셈을 한 번에(a×b+c, 반올림 한 번) 하는 32-bit 부동소수점 계산기. 내부는 24×24 가수 곱셈기 배열 → 정렬 시프터 → 덧셈기 → 정규화 → 반올림의 파이프라인.', en: 'A 32-bit floating-point calculator that does multiply and add in one step (a×b+c, one rounding). Inside: a 24×24 mantissa multiplier array → alignment shifter → adder → normaliser → rounding pipeline.' },
  { ko: '작업대 1개. 숫자 두 개를 곱해 세 번째에 더한다', en: 'One workbench: multiply two numbers, add a third' },
  { ko: 'H100: 16,896개 × 2 FLOP × 1.98 GHz ≈ 67 TFLOPS. FMA 하나는 약 1만~2.5만 게이트(4만~10만 트랜지스터, 추정)', en: 'H100: 16,896 cores × 2 FLOP × 1.98 GHz ≈ 67 TFLOPS. One FMA ≈ 10k–25k gates (40k–100k transistors, estimate)' },
  ['nv-h100-wp', 'jia2018'], { kid: { ko: '곱하기와 더하기를 한 번에 하는 계산기야. 이런 계산기가 GPU에 만 개 넘게 있어.', en: 'A calculator that multiplies and adds in one go. A GPU has more than ten thousand of them.' } });
add('tensorcore', 'Tensor Core', '텐서 코어',
  { ko: '작은 행렬끼리의 곱셈을 통째로 한 클럭에 처리하는 전용 기계. AI의 거의 모든 계산(어텐션, MLP)이 행렬곱이라 이것이 AI 속도를 결정한다. FP8/FP16/BF16/TF32/FP64를 다룬다.', en: 'A dedicated engine that multiplies small matrices whole, per clock. Almost all AI math (attention, MLPs) is matrix multiply, so this sets AI speed. Handles FP8/FP16/BF16/TF32/FP64.' },
  { ko: '행렬 전용 대형 프레스 기계', en: 'A giant press built only for matrices' },
  { ko: 'H100 4세대: 텐서 코어당 클럭당 FP16 FMA 512개(SM당 2,048), FP8은 2배. 칩 전체 FP8 밀집 1,979 TFLOPS. B200 5세대는 SM당 4,096(측정)', en: 'H100 4th-gen: 512 FP16 FMA per Tensor Core per clock (2,048 per SM), 2× for FP8. Whole chip: 1,979 dense FP8 TFLOPS. B200 5th-gen: 4,096 per SM (measured)' },
  ['nv-h100-wp', 'cc-b200'], { kid: { ko: '숫자 표(행렬)끼리 곱하는 초강력 기계야. AI가 생각하는 건 거의 다 이 곱셈이야.', en: "A super-strong machine that multiplies number tables (matrices). Almost all of an AI\'s thinking is this kind of multiplying." } });
add('fp8', 'FP8 / BF16 / Precision', 'FP8·BF16·정밀도',
  { ko: '숫자를 몇 비트로 적느냐. FP32는 32비트, FP16/BF16은 16비트, FP8은 8비트. 비트가 적을수록 텐서 코어가 두 배씩 빨라지고 메모리도 덜 쓴다. Transformer Engine이 층마다 자동으로 고른다.', en: 'How many bits a number uses. FP32 = 32, FP16/BF16 = 16, FP8 = 8. Fewer bits doubles Tensor Core speed and halves memory. The Transformer Engine picks per layer automatically.' },
  { ko: '소수점 몇째 자리까지 적을지 정하기', en: 'Deciding how many decimal places to keep' },
  { ko: 'B200은 FP4까지 지원(밀집 9 PFLOPS). 2:4 구조적 희소성으로 또 2배', en: 'B200 adds FP4 (9 dense PFLOPS). 2:4 structured sparsity doubles it again' },
  ['nv-h100-wp', 'nv-blackwell'], { kid: { ko: '숫자를 몇 자리까지 적을지 정하는 거야. 짧게 적으면 두 배 빨라져.', en: 'Deciding how many digits to keep. Shorter numbers run twice as fast.' } });
add('sfu', 'SFU & INT32 & LD/ST Units', 'SFU·INT32·로드/스토어 유닛',
  { ko: '방 안의 특수 작업대들. SFU는 sin, exp, 역수 같은 특수 함수를, INT32는 주소 계산 같은 정수 연산을, LD/ST 유닛은 메모리 읽기·쓰기를 맡는다.', en: 'Special workbenches in the room. SFUs compute sin, exp, reciprocals; INT32 units do integer math like address calculation; LD/ST units move data to and from memory.' },
  { ko: '전문 공구 코너', en: 'The specialist tool corner' },
  { ko: 'H100 SM당 SFU 16, LD/ST 32, 텍스처 유닛 4. 활성화 함수(exp)는 SFU가 처리', en: 'Per H100 SM: 16 SFUs, 32 LD/ST, 4 texture units. Activation functions (exp) run on the SFU' },
  ['nv-h100-wp'], { kid: { ko: '특별한 계산을 맡는 전문 공구 코너야. 사인, 지수 같은 걸 처리해.', en: 'The specialist tool corner for things like sine and exponentials.' } });
add('registerfile', 'Register File', '레지스터 파일',
  { ko: '작업자 손 옆 서랍. 스레드의 변수가 여기 산다. SM당 256 KB = 32-bit 레지스터 65,536개. 파이프라인 안에 있어 사실상 지연 0. 다중 포트 SRAM 뱅크로 만든다.', en: 'The drawer beside each worker, holding the thread\'s variables. 256 KB per SM = 65,536 32-bit registers. Effectively zero latency inside the pipeline. Built as multi-ported SRAM banks.' },
  { ko: '손 닿는 곳의 서랍', en: 'The drawer within arm\'s reach' },
  { ko: 'H100 전체 레지스터: 33,792 KB ≈ 865만 개. Volta 실측: 뱅크 2개, 64-bit 폭. 레지스터가 모자라면 느린 메모리로 밀려난다(스필)', en: 'H100 total: 33,792 KB ≈ 8.65M registers. Volta measured: 2 banks, 64-bit wide. Run out and values spill to slow memory' },
  ['nv-h100-wp', 'jia2018'], { kid: { ko: '손이 닿는 곳에 있는 서랍이야. 지금 쓰는 숫자를 여기 둬.', en: 'The drawer within arm\'s reach, holding the numbers you are using right now.' } });
add('sram6t', '6T SRAM Cell', '6T SRAM 셀',
  { ko: '1비트를 저장하는 기본 단위. 인버터 2개가 서로를 붙잡아(교차 결합) 0 또는 1을 유지하고, 액세스 트랜지스터 2개가 워드라인 신호로 열려 비트라인에 연결한다. 전원만 있으면 리프레시가 필요 없다.', en: 'The basic unit storing one bit. Two cross-coupled inverters hold a 0 or 1; two access transistors open on the wordline to connect to the bitlines. Needs no refresh while powered.' },
  { ko: '서로 밀어 주는 두 사람이 문을 열어 둔 상태를 유지하듯', en: 'Two people leaning on each other to hold a door open' },
  { ko: 'TSMC N5 고밀도 셀 0.021 μm²(약 145 × 145 nm). N3E도 같은 크기 — SRAM 축소가 멈췄다', en: 'TSMC N5 high-density cell: 0.021 μm² (~145 × 145 nm). N3E is the same size — SRAM scaling has stalled' },
  ['wikichip-n5', 'wikichip-sram'], { kid: { ko: '1을 기억하는 가장 작은 칸이야. 두 사람이 서로 밀어 주며 문을 붙잡고 있는 것 같아.', en: 'The smallest slot that remembers a 1, like two people holding a door for each other.' } });
add('bitline', 'Bitline / Wordline / Sense Amp', '비트라인·워드라인·센스앰프',
  { ko: '워드라인은 한 줄의 셀을 여는 신호, 비트라인은 데이터가 오가는 세로 통로. 읽을 때는 수십 mV의 미세한 전압 차를 센스 앰프가 증폭한다.', en: 'The wordline opens one row of cells; bitlines are the vertical lanes data travels on. On a read, a sense amplifier boosts a tiny difference of tens of millivolts.' },
  { ko: '복도(워드라인)와 계단(비트라인)', en: 'Corridors (wordlines) and stairwells (bitlines)' },
  { ko: 'H100 L2 50 MB = 4.2억 비트 ≈ 셀 트랜지스터만 25억 개(추정)', en: 'H100 L2 50 MB = 420M bits ≈ 2.5B transistors just for cells (estimate)' },
  ['wikichip-n5'], { kid: { ko: '복도(가로줄)를 열면 계단(세로줄)으로 답이 내려와. 그 작은 차이를 증폭해 읽어.', en: 'Open a corridor and the answer comes down the stairwell; a tiny difference gets amplified.' } });
add('dram', 'DRAM Cell (1T1C)', 'DRAM 셀',
  { ko: 'HBM 안의 1비트 저장 단위. 트랜지스터 1개 + 커패시터 1개. 전하가 새기 때문에 64 ms마다 다시 써 줘야(리프레시) 한다. SRAM보다 작지만 느리고, 그래서 GPU 다이와 별도 칩이다.', en: 'The one-bit storage unit inside HBM: one transistor + one capacitor. Charge leaks, so it must be rewritten every 64 ms (refresh). Smaller than SRAM but slower, hence a separate chip.' },
  { ko: '물이 새는 양동이: 계속 채워 줘야 한다', en: 'A leaky bucket that must be topped up' },
  { ko: '64 ms = H100 클럭 1.27억 번. TSV 때문에 HBM 다이의 비트 밀도는 일반 DDR4의 약 절반', en: '64 ms = 127 million H100 clocks. TSVs make HBM dies about half as dense as DDR4' },
  ['skhynix-hbm3'], { kid: { ko: '구멍 난 물통에 물을 담아 1을 기억해. 자꾸 새니까 계속 다시 채워 줘야 해.', en: 'It remembers a 1 as water in a leaky bucket, so it must be topped up again and again.' } });
add('logicgate', 'Logic Gate (CMOS)', '논리 게이트(CMOS)',
  { ko: '트랜지스터 몇 개로 만드는 가장 작은 판단 회로. 인버터(NOT)는 2개, NAND/NOR는 4개, 플립플롭은 20개 안팎. 곱셈기·덧셈기는 이런 게이트 수천 개의 조합이다.', en: 'The smallest decision circuit, made of a few transistors. An inverter (NOT) uses 2, NAND/NOR 4, a flip-flop around 20. Multipliers and adders are thousands of these combined.' },
  { ko: '벽돌(트랜지스터)로 쌓은 문틀', en: 'A door frame built from bricks (transistors)' },
  { ko: 'N5 표준 셀 높이 210 nm(6트랙), 논리 밀도 약 1억 3,800만 트랜지스터/mm²(실측 기반)', en: 'N5 standard cell height 210 nm (6-track); logic density ≈138M transistors/mm² (measured)' },
  ['angstronomics'], { kid: { ko: '트랜지스터 몇 개로 만든 가장 작은 판단 장치야. 이걸 수천 개 모으면 곱셈기가 돼.', en: 'The smallest decision device, a few transistors. Thousands of them make a multiplier.' } });
add('finfet', 'FinFET Transistor', '핀펫 트랜지스터',
  { ko: '전류가 흐르는 채널을 지느러미(fin)처럼 세우고 게이트가 3면을 감싸 껐다 켰다 하는 스위치. N5: 핀 간격 28 nm, 게이트 간격 51 nm, 핀 폭 약 5~6 nm, 높이 약 50 nm(추정). 약 0.7~1 V로 동작.', en: 'A switch whose channel stands up like a fin, wrapped on three sides by the gate. N5: fin pitch 28 nm, gate pitch 51 nm, fin width ~5–6 nm, height ~50 nm (est.). Runs at ~0.7–1 V.' },
  { ko: '수문: 게이트 전압이 열리면 소스→드레인으로 전자가 흐른다', en: 'A floodgate: gate voltage opens it and electrons flow source→drain' },
  { ko: '"4 nm"는 어떤 실제 치수도 아니다(마케팅 세대명). 스위칭 한 번에 전자 약 1,000~3,000개(추정), 게이트 지연 수 ps', en: '"4 nm" is not a physical dimension (a marketing generation name). One switch moves ~1,000–3,000 electrons (est.), gate delay a few ps' },
  ['angstronomics', 'semiwiki-n5'], { kid: { ko: "전기를 켜고 끄는 아주 작은 스위치야. 지느러미처럼 서 있어서 '핀'이라고 불러. 머리카락보다 만 배 얇아.", en: 'A tiny switch that turns electricity on and off. It stands up like a fin, and it is ten thousand times thinner than a hair.' } });
add('gateoxide', 'Gate Oxide (High-k HfO₂)', '게이트 산화막',
  { ko: '게이트와 채널 사이의 절연막. SiO₂ 계면층 약 0.5~1 nm + 하프늄 산화물(HfO₂) 약 1.5~2 nm. 원자 몇 층 두께라 전자가 양자 터널링으로 새어 나가려 한다.', en: 'The insulator between gate and channel: ~0.5–1 nm SiO₂ interface + ~1.5–2 nm hafnium oxide. Only a few atoms thick, so electrons try to quantum-tunnel through.' },
  { ko: '원자 몇 겹짜리 벽지', en: 'Wallpaper a few atoms thick' },
  { ko: 'SiO₂ 1.2 nm 이하에서 터널링 누설이 폭증해 Intel이 2007년 45 nm에서 high-k를 도입 — 누설 최대 1,000배 감소', en: 'Below 1.2 nm of SiO₂ tunnelling leakage explodes; Intel introduced high-k at 45 nm in 2007, cutting leakage up to 1,000×' },
  ['intel-hkmg', 'semiwiki-n5'], { kid: { ko: '스위치의 문과 통로 사이에 있는 아주 얇은 벽이야. 원자 몇 겹밖에 안 돼.', en: 'A very thin wall between the switch\'s door and its corridor, just a few atoms thick.' } });
add('beol', 'Interconnect (BEOL Metal Layers)', '배선층(BEOL)',
  { ko: '트랜지스터 위에 쌓인 구리 배선 15층 안팎(4N 층수는 미공개). 아래층은 가늘고 촘촘하게(M0 간격 28 nm), 위층은 굵게(전원·클럭). 구리 다마신 공정으로 홈을 파고 구리를 채운 뒤 갈아 낸다.', en: 'Around 15 copper wiring layers stacked above the transistors (exact count for 4N undisclosed). Lower layers are fine (M0 pitch 28 nm), upper layers thick (power, clock). Made by damascene: etch trenches, fill with copper, polish.' },
  { ko: '도시 위 15층짜리 고가도로망', en: 'A 15-storey stack of highways over the city' },
  { ko: '요즘은 트랜지스터보다 배선이 더 느리다(RC 지연). 첨단 칩 배선 총길이는 수십 km(미확인)', en: 'Wires are now slower than transistors (RC delay). Total wire length in a modern chip is tens of km (unverified)' },
  ['angstronomics', 'wikichip-n5'], { kid: { ko: '스위치들 위에 깔린 구리 도로망이야. 열다섯 층쯤 겹쳐 있어.', en: 'The copper road network above the switches, stacked about fifteen storeys high.' } });
add('via', 'Via', '비아',
  { ko: '배선층과 배선층을 수직으로 잇는 작은 구멍. 신호가 위층 굵은 도로로 올라가거나 아래층 트랜지스터로 내려올 때 이 사다리를 탄다.', en: 'A small vertical hole joining one metal layer to the next. Signals climb these ladders to reach the thick upper highways or descend to transistors.' },
  { ko: '고가도로 사이 램프', en: 'Ramps between highway decks' },
  { ko: 'N5는 배선 저항 증가를 상쇄하려 비아 필러(via pillar)를 대량 사용', en: 'N5 uses many via pillars to offset rising wire resistance' },
  ['wikichip-n5'], { kid: { ko: '위층 도로와 아래층 도로를 잇는 계단이야.', en: 'The stairway joining an upper road to a lower one.' } });
add('clock', 'Clock Cycle', '클럭 주기',
  { ko: 'GPU 전체가 박자를 맞추는 심장 박동. H100 부스트 약 1.98 GHz → 한 박자 0.505 ns. 이 시간에 빛조차 15 cm밖에 못 간다. 배선 신호는 RC 지연 때문에 그보다 훨씬 느리다.', en: 'The heartbeat the whole GPU marches to. H100 boost ~1.98 GHz → one beat = 0.505 ns. Light travels only 15 cm in that time; wire signals are far slower due to RC delay.' },
  { ko: '오케스트라의 메트로놈', en: 'The orchestra\'s metronome' },
  { ko: '한 클럭에 H100은 FP32 FMA 16,896개 + FP8 텐서 FMA 540,672개를 처리하고 HBM에서 약 1,692바이트를 받는다', en: 'Per clock, H100 does 16,896 FP32 FMAs + 540,672 FP8 tensor FMAs and receives ~1,692 bytes from HBM' },
  ['nv-h100-wp', 'luo2024'], { kid: { ko: 'GPU의 심장 박동이야. 1초에 20억 번 뛰어!', en: "The GPU\'s heartbeat. It beats two billion times every second!" } });
add('latency', 'Memory Latency Hierarchy', '메모리 지연 계층',
  { ko: '데이터를 가져오는 데 걸리는 시간은 거리에 비례한다. 레지스터 0 → 공유 메모리 29 → L1 33~41 → L2 264(가까움)/502(멂) → HBM 479~656 클럭(H100 측정). 그래서 GPU는 워프를 수십 개 띄워 기다림을 숨긴다.', en: 'Fetch time grows with distance: registers 0 → shared 29 → L1 33–41 → L2 264 (near)/502 (far) → HBM 479–656 cycles (H100, measured). GPUs run dozens of warps to hide the wait.' },
  { ko: '서랍 → 창고 → 물류센터 → 외곽 창고탑, 갈수록 멀다', en: 'Drawer → pantry → depot → warehouse tower, each farther away' },
  { ko: 'L1 : L2 : HBM ≈ 1 : 6.5 : 13 (Luo et al.)', en: 'L1 : L2 : HBM ≈ 1 : 6.5 : 13 (Luo et al.)' },
  ['luo2024'], { kid: { ko: '가까운 곳에서 꺼내면 금방, 먼 창고까지 가면 한참 걸려. 그래서 기다리는 동안 다른 일을 시켜.', en: 'Close by is quick, the far warehouse is slow, so other work runs while you wait.' } });
add('kernel', 'Kernel / Grid / Block / Cluster', '커널·그리드·블록·클러스터',
  { ko: 'GPU 프로그램(커널)은 수천 개 스레드 블록(그리드)으로 실행된다. 블록 하나(최대 1,024스레드)는 한 SM에서 돌고, Hopper는 블록 여러 개를 클러스터로 묶어 같은 GPC에 배치한다.', en: 'A GPU program (kernel) runs as a grid of thousands of thread blocks. One block (up to 1,024 threads) runs on one SM; Hopper groups blocks into clusters placed within one GPC.' },
  { ko: '작업 지시서 → 팀 배정 → 같은 구역 배치', en: 'Work order → team assignment → same-district placement' },
  { ko: '로봇 추론 1회 = 커널 수십~수백 개. 클러스터 최대 8블록(이식성)/16(옵트인)', en: 'One robot inference = dozens to hundreds of kernels. Clusters: up to 8 blocks (portable) / 16 (opt-in)' },
  ['cuda-guide', 'nv-hopper-blog'], { kid: { ko: 'GPU에게 주는 작업 지시서야. 이걸 수천 개 팀으로 쪼개서 나눠 줘.', en: 'The work order given to the GPU, split into thousands of teams.' } });
add('heat', 'Heat & Thermal Throttling', '열과 스로틀링',
  { ko: '700 W를 814 mm²에서 내면 평균 86 W/cm² — 원자로 노심(약 100 W/cm²) 수준. 온도가 약 90 °C 목표를 넘으면 클럭을 낮춘다(스로틀링). 뜨거울수록 누설 전류가 지수적으로 는다.', en: '700 W over 814 mm² is 86 W/cm² on average — near a nuclear reactor core (~100 W/cm²). Above the ~90 °C target the clock is lowered (throttling). Leakage grows exponentially with heat.' },
  { ko: '도시 전체가 화로 위에 있다', en: 'The whole city sits on a stove' },
  { ko: 'H100 T.Limit: 목표 90 °C, 하드웨어 슬로다운 약 92 °C, 셧다운 약 97 °C', en: 'H100 T.Limit: target 90 °C, hardware slowdown ~92 °C, shutdown ~97 °C' },
  ['pollack', 'nv-h100-wp'], { kid: { ko: '손톱만 한 칸에 전기난로만큼 열이 나. 너무 뜨거우면 스스로 속도를 줄여.', en: 'A fingernail-sized area makes as much heat as a heater, so it slows itself when too hot.' } });
add('ecc', 'ECC & Cosmic Rays', 'ECC와 우주선',
  { ko: '대기 중 중성자(우주선의 2차 입자)가 SRAM/DRAM 비트를 뒤집는 소프트 에러. 콘크리트 1.5 m도 통과해 막을 수 없다. 그래서 H100은 HBM·L2·L1·레지스터에 오류 정정 코드(ECC)를 둔다.', en: 'Atmospheric neutrons (cosmic-ray secondaries) flip SRAM/DRAM bits: soft errors. They pass through 1.5 m of concrete, so H100 puts error-correcting codes on HBM, L2, L1 and registers.' },
  { ko: '우주에서 날아온 총알이 서류 한 글자를 바꾼다. 교정자가 고친다', en: 'A bullet from space changes one letter; the proofreader fixes it' },
  { ko: 'Llama 3 학습(H100 16,384장, 54일) 중 정정 불가 HBM3 오류로 72회 중단', en: 'During Llama 3 training (16,384 H100s, 54 days), 72 interruptions came from uncorrectable HBM3 errors' },
  ['llama3', 'nv-h100-wp'], { kid: { ko: '우주에서 날아온 입자가 가끔 숫자 하나를 바꿔 놔. 그걸 알아채고 고쳐 주는 장치야.', en: 'A particle from space sometimes flips a number; this catches it and fixes it.' } });
add('lattice', 'Silicon Crystal Lattice', '실리콘 결정 격자',
  { ko: '다이아몬드와 같은 입방 격자. 원자 하나가 이웃 4개와 결합한다. 격자 상수 0.5431 nm, 원자 간 거리 0.235 nm, 1 cm³에 원자 5 × 10²² 개. 이것이 바닥이다.', en: 'The same cubic lattice as diamond: each atom bonds to four neighbours. Lattice constant 0.5431 nm, atom spacing 0.235 nm, 5 × 10²² atoms per cm³. This is the floor.' },
  { ko: '벽돌', en: 'The bricks' },
  { ko: '핀 폭 6 nm = 원자 약 25층. 게이트 길이 18 nm = 격자 33개. GH100 다이 안 실리콘 원자 ≈ 3 × 10²² 개(추정)', en: 'A 6 nm fin is ~25 atoms wide. An 18 nm gate spans 33 unit cells. A GH100 die holds ≈3 × 10²² silicon atoms (est.)' },
  ['wiki-si', 'ioffe-si'], { kid: { ko: '실리콘 원자들이 손을 잡고 만든 격자야. 이게 GPU의 가장 밑바닥이야. 더 아래는 없어!', en: 'Silicon atoms holding hands in a grid. This is the very bottom of the GPU. There is nothing below!' } });
add('electron', 'Electron & Band Gap', '전자와 밴드갭',
  { ko: '실리콘의 밴드갭은 1.12 eV. 순수 실리콘은 거의 절연체지만 도핑하면 전자(또는 정공)가 흐른다. 채널 안 전자는 초속 약 100 km(포화 속도)로 20 nm를 0.2 ps에 지난다.', en: 'Silicon\'s band gap is 1.12 eV. Pure silicon is nearly an insulator; doping lets electrons (or holes) flow. In a channel they move at ~100 km/s (saturation velocity), crossing 20 nm in 0.2 ps.' },
  { ko: '당신은 이제 전자다', en: 'You are the electron now' },
  { ko: '트랜지스터 스위칭 에너지 약 0.05~0.15 fJ(추정). 생각의 속도보다 빠르고, 빛보다 훨씬 느리다', en: 'Switching energy ≈0.05–0.15 fJ (est.). Faster than thought, far slower than light' },
  ['ioffe-si', 'wiki-si'], { kid: { ko: '이제 네가 전자야! 전기는 전자가 움직이는 거야.', en: 'Now you are an electron! Electricity is electrons moving.' } });
add('tunneling', 'Quantum Tunneling', '양자 터널링',
  { ko: '전자가 넘을 수 없는 벽을 확률적으로 통과하는 현상. 산화막이 원자 몇 층이 되자 전자가 새기 시작했고, 게이트가 10 nm 아래로 가면 채널을 건너뛴다. 트랜지스터 축소의 근본 한계.', en: 'Electrons passing through a barrier they can\'t climb. With gate oxides a few atoms thick, electrons leak; below ~10 nm gates they skip the channel entirely. The fundamental limit to shrinking.' },
  { ko: '벽에 던진 공이 가끔 저쪽에 나타난다', en: 'A ball thrown at a wall sometimes appears on the other side' },
  { ko: '다음 세대(N2)는 채널을 4면에서 감싸는 GAA 나노시트로 대응', en: 'The next node (N2) answers with gate-all-around nanosheets wrapping the channel on four sides' },
  ['semiwiki-n5', 'intel-hkmg'], { kid: { ko: '벽이 너무 얇으면 전자가 그냥 통과해 버려. 더 작게 만들기 어려운 이유야.', en: 'If the wall is too thin, electrons pass straight through. That is why shrinking gets hard.' } });

// ---------- AI 테마 ----------
add('alphago', 'AlphaGo vs Lee Sedol (2016)', '알파고 대 이세돌',
  { ko: '2016년 3월 서울에서 딥마인드의 알파고가 이세돌 9단을 4대 1로 이겼다. 신경망(정책망·가치망)과 몬테카를로 트리 탐색을 합친 AI로, 2국 37수는 인간이 두지 않던 수였고, 4국 78수는 이세돌이 알파고를 이긴 "신의 한 수"였다.', en: 'In March 2016 in Seoul, DeepMind\'s AlphaGo beat Lee Sedol 4–1. It combined neural networks (policy and value) with Monte Carlo tree search. Move 37 in game 2 was a move no human would play; Lee\'s Move 78 in game 4 beat it once.' },
  { ko: '바둑판 위에서 인간이 처음으로 AI에게 진 날', en: 'The day a human first lost to AI on the Go board' },
  { ko: '분산 알파고는 CPU 1,202개·GPU 176개를 썼다(Nature 2016). 이세돌은 2019년 은퇴하며 "AI는 이길 수 없는 존재"라고 말했다', en: 'Distributed AlphaGo used 1,202 CPUs and 176 GPUs (Nature 2016). Lee Sedol retired in 2019, saying AI "cannot be defeated"' },
  ['alphago-nature'], { kid: { ko: '사람이 바둑에서 컴퓨터에게 처음 진 날이야. 2016년 서울에서.', en: 'The day a human first lost at Go to a computer, in Seoul in 2016.' } });
add('deeplearning', 'Deep Learning & AlexNet (2012)', '딥러닝과 AlexNet',
  { ko: '2012년 알렉스 크리제브스키·일리야 수츠케버·제프리 힌턴의 AlexNet이 ImageNet 대회에서 오차율 15.3%로 2위를 10%포인트 넘게 앞섰다. 게임용 GPU(GTX 580) 두 장으로 학습했다. 이때부터 GPU가 AI의 엔진이 됐다.', en: 'In 2012 AlexNet (Krizhevsky, Sutskever, Hinton) won ImageNet with a 15.3% top-5 error, more than 10 points ahead of second place, trained on two gaming GPUs (GTX 580). GPUs became the engine of AI.' },
  { ko: '게임 그래픽카드가 뇌의 학습기가 된 순간', en: 'The moment a gaming card became a brain trainer' },
  { ko: '2015년 ResNet은 152층 신경망으로 인간 수준(오차 3.57%)을 넘었다', en: 'In 2015 ResNet went 152 layers deep and passed human level (3.57% error)' },
  ['alexnet', 'resnet'], { kid: { ko: '게임용 그래픽카드 두 장으로 사진 맞히기 대회를 휩쓴 순간부터 AI 시대가 열렸어.', en: 'The AI era opened when two gaming graphics cards swept an image-recognition contest.' } });
add('transformer', 'Transformer · Attention (2017)', '트랜스포머 · 어텐션',
  { ko: '2017년 구글의 논문 "Attention Is All You Need"가 제안한 구조. 문장의 모든 단어가 서로를 "주목(attention)"해 관계를 계산하며, 순서대로가 아니라 한꺼번에 병렬로 처리해 GPU에 딱 맞는다. GPT·클로드·제미나이가 모두 이 구조다.', en: 'Proposed in Google\'s 2017 paper "Attention Is All You Need". Every word attends to every other word, and everything is processed in parallel rather than in sequence, a perfect fit for GPUs. GPT, Claude and Gemini all use it.' },
  { ko: '회의실에서 모두가 모두의 말을 동시에 듣는 것', en: 'A meeting where everyone listens to everyone at once' },
  { ko: '저자 8명. 기본 모델은 P100 GPU 8장으로 12시간, 큰 모델은 3.5일 학습했다', en: 'Eight authors. The base model trained on 8 P100 GPUs for 12 hours; the big model for 3.5 days' },
  ['vaswani2017'], { kid: { ko: '문장 속 모든 단어가 서로를 한꺼번에 쳐다보는 방식이야. 지금 AI는 거의 다 이걸 써.', en: 'A way for every word in a sentence to look at every other at once. Nearly all AI uses it now.' } });
add('attention', 'Self-Attention · Q/K/V', '셀프 어텐션 · Q/K/V',
  { ko: '각 단어를 질문(Query)·열쇠(Key)·값(Value) 벡터로 바꾸고, 질문과 열쇠의 유사도로 어느 단어를 얼마나 볼지 정한 뒤 값을 섞는다. 이 계산은 거대한 행렬곱이라 텐서 코어가 처리한다.', en: 'Each token becomes Query, Key and Value vectors. Query·Key similarity decides how much to look at each token, then Values are mixed. It is all giant matrix multiplies, which Tensor Cores run.' },
  { ko: '도서관에서 질문(Q)에 맞는 색인(K)을 찾아 책(V)을 꺼내는 것', en: 'Matching a question (Q) to index cards (K) to pull the right books (V)' },
  { ko: '토큰 n개면 어텐션 계산은 n²으로 는다. 그래서 긴 문맥은 비싸다', en: 'Attention cost grows with n² for n tokens, which is why long context is expensive' },
  ['vaswani2017'], { kid: { ko: '질문에 맞는 색인을 찾아 책을 꺼내는 것과 같아. 어디를 얼마나 볼지 점수로 정해.', en: 'Like matching a question to an index card to pull the right book, scored by how much to look.' } });
add('gpt', 'GPT Lineage (2018–2020)', 'GPT 계보',
  { ko: '"다음 단어 맞히기"만 대규모로 학습한 언어 모델. GPT-1(2018, 1.17억)·GPT-2(2019, 15억)·GPT-3(2020, 1,750억 파라미터). 크게 만들수록 배우지 않은 일도 예시 몇 개로 해내는 능력이 나타났다.', en: 'Language models trained only to predict the next token. GPT-1 (2018, 117M), GPT-2 (2019, 1.5B), GPT-3 (2020, 175B parameters). Scale brought few-shot abilities nobody explicitly trained.' },
  { ko: '책을 아주 많이 읽고 다음 단어를 맞히는 놀이의 끝판', en: 'The ultimate game of reading everything and guessing the next word' },
  { ko: 'GPT-3는 V100 GPU 클러스터에서 학습됐고, 파라미터 1,750억 개는 32비트로 700 GB에 달한다', en: 'GPT-3 trained on a V100 cluster; 175B parameters take 700 GB at 32-bit' },
  ['gpt3'], { kid: { ko: '다음에 올 단어를 맞히는 연습만 엄청나게 시킨 모델이야. 크게 만드니 안 가르친 일도 하더라.', en: 'A model trained only to guess the next word. Made big enough, it started doing untaught things.' } });
add('chatgpt', 'ChatGPT (Nov 30, 2022)', '챗GPT',
  { ko: '2022년 11월 30일 공개. GPT-3.5에 사람의 피드백으로 대화를 가르친(RLHF) 서비스. 두 달 만에 사용자 1억 명을 모아 역사상 가장 빨리 퍼진 소비자 앱이 됐고, "AI 붐"과 GPU 품귀가 시작됐다.', en: 'Released November 30, 2022: GPT-3.5 taught to converse with human feedback (RLHF). It reached 100 million users in two months, the fastest-growing consumer app ever, and kicked off the AI boom and the GPU shortage.' },
  { ko: '모두가 AI와 처음 대화한 날', en: 'The day everyone first talked to an AI' },
  { ko: 'GPT-4는 2023년 3월 공개. 이후 GPT-4o(2024), 추론 모델 o1·o3(2024~25)로 이어졌다', en: 'GPT-4 followed in March 2023, then GPT-4o (2024) and the reasoning models o1/o3 (2024–25)' },
  ['openai-chatgpt', 'rlhf'], { kid: { ko: '채팅창 하나로 모두가 AI와 처음 이야기한 날이야. 두 달 만에 1억 명이 썼어.', en: 'The day everyone first talked to an AI through a chat box; 100 million users in two months.' } });
add('rlhf', 'RLHF & Alignment', '인간 피드백 강화학습 · 정렬',
  { ko: '모델의 답 여러 개를 사람이 비교해 점수를 매기고, 그 선호를 배운 보상 모델로 언어 모델을 강화학습시켜 "도움이 되고 해롭지 않게" 만드는 방법. 앤트로픽은 여기에 원칙 목록(헌법)으로 AI가 스스로 답을 고치는 Constitutional AI를 더했다.', en: 'Humans rank model answers, a reward model learns those preferences, and the language model is reinforced to be helpful and harmless. Anthropic added Constitutional AI, where the model critiques itself against a list of principles.' },
  { ko: '글쓰기 코치의 첨삭을 수백만 번 받는 것', en: 'Getting a writing coach\'s corrections millions of times' },
  { ko: 'InstructGPT 논문(2022): 13억 모델이 RLHF 후 1,750억 GPT-3보다 선호됐다', en: 'InstructGPT (2022): a 1.3B model with RLHF was preferred over the 175B GPT-3' },
  ['rlhf', 'anthropic-cai'], { kid: { ko: '사람이 좋은 답을 골라 주면 모델이 그걸 배워. 똑똑한 것과 좋은 것은 다르니까.', en: 'People pick the better answers and the model learns from that, because smart and good differ.' } });
add('claude', 'Claude · Anthropic', '클로드 · 앤트로픽',
  { ko: '2021년 다리오·다니엘라 아모데이 등이 세운 AI 안전 연구 기업 앤트로픽의 모델. 2023년 3월 Claude 1, 2024년 3월 Claude 3(하이쿠·소넷·오퍼스), 2025년 Claude 4로 이어졌다. 긴 문맥과 코딩, 안전성을 강조한다.', en: 'Models from Anthropic, the AI-safety company founded in 2021 by Dario and Daniela Amodei and others. Claude 1 (March 2023), Claude 3 (March 2024: Haiku, Sonnet, Opus), Claude 4 (2025). Known for long context, coding and safety.' },
  { ko: '규칙서를 든 사서', en: 'A librarian who carries the rulebook' },
  { ko: 'Claude의 학습 원칙 "헌법"에는 UN 세계인권선언 조항도 들어 있다', en: 'Claude\'s "constitution" includes clauses from the UN Declaration of Human Rights' },
  ['anthropic-claude', 'anthropic-cai'], { kid: { ko: '안전을 먼저 생각하는 회사가 만든 AI야. 규칙이 적힌 종이를 읽고 스스로 답을 고쳐.', en: 'An AI from a safety-first company; it reads a page of principles and corrects itself.' } });
add('scaling', 'Scaling Laws', '스케일링 법칙',
  { ko: '모델 크기·데이터·연산량을 늘리면 성능이 예측 가능한 거듭제곱 법칙으로 좋아진다(Kaplan 2020). 친칠라(2022)는 같은 연산이면 모델을 키우기보다 데이터를 더 쓰라고 했다. 이 법칙이 "GPU를 더 사라"는 근거가 됐다.', en: 'Performance improves as a predictable power law with model size, data and compute (Kaplan 2020). Chinchilla (2022) showed that for fixed compute you should use more data, not just bigger models. This is why everyone buys more GPUs.' },
  { ko: '공부 시간을 두 배로 늘리면 점수가 얼마나 오르는지 미리 아는 공식', en: 'A formula that predicts your score from your study hours' },
  { ko: 'Llama 3.1 405B 학습: H100 16,384장, 15조 토큰 이상', en: 'Llama 3.1 405B trained on 16,384 H100s with over 15 trillion tokens' },
  ['kaplan2020', 'chinchilla', 'llama3'], { kid: { ko: '크게 만들수록 잘한다는 게 공식으로 나와. 그래서 다들 GPU를 더 사.', en: 'There is a formula saying bigger is better, which is why everyone buys more GPUs.' } });
add('opensource', 'Open Weights · Llama · DeepSeek', '오픈 가중치 · 라마 · 딥시크',
  { ko: '메타의 Llama는 가중치를 공개해 누구나 내려받아 돌릴 수 있게 했다. 2025년 1월 중국 딥시크의 R1은 강화학습으로 추론 능력을 키운 오픈 모델로, 낮은 비용 주장과 함께 시장을 흔들었다.', en: 'Meta\'s Llama released its weights so anyone can download and run it. In January 2025 China\'s DeepSeek R1, an open reasoning model trained with reinforcement learning, shook the market with claims of low training cost.' },
  { ko: '요리법을 공개한 식당', en: 'A restaurant that publishes its recipes' },
  { ko: 'DeepSeek R1 공개 다음 날(2025-01-27) NVIDIA 시가총액이 하루 만에 약 6,000억 달러 줄었다', en: 'The day after DeepSeek R1 (Jan 27 2025), NVIDIA lost about $600B in market value in one day' },
  ['deepseek-r1', 'llama3'], { kid: { ko: '요리법을 공개한 식당처럼, 모델을 누구나 내려받아 돌릴 수 있게 푼 거야.', en: 'Like a restaurant publishing its recipes: anyone can download and run the model.' } });
add('reasoning', 'Reasoning Models & Agents', '추론 모델 · 에이전트',
  { ko: '답하기 전에 "생각의 사슬"을 길게 쓰며 문제를 푸는 모델(OpenAI o1·o3, DeepSeek R1, Claude의 확장 사고). 여기에 도구 사용과 여러 단계 행동을 붙이면 에이전트가 된다. 추론 시간(inference)에도 GPU를 많이 쓴다.', en: 'Models that write a long chain of thought before answering (OpenAI o1/o3, DeepSeek R1, Claude extended thinking). Add tools and multi-step actions and you get agents. They spend GPU time at inference, not just training.' },
  { ko: '답을 말하기 전에 연습장에 풀이를 적는 학생', en: 'A student who works it out on scratch paper first' },
  { ko: '추론 모델은 답 하나에 수천~수만 토큰을 "생각"에 쓴다', en: 'A reasoning model may spend thousands of tokens thinking per answer' },
  ['deepseek-r1'], { kid: { ko: '답을 말하기 전에 연습장에 풀이를 길게 적는 학생 같은 모델이야.', en: 'A model like a student who works the problem out on scratch paper before answering.' } });
add('airace', 'The LLM Race', 'LLM 경쟁',
  { ko: 'OpenAI(GPT), 앤트로픽(Claude), 구글(Gemini, 2023년 12월), 메타(Llama), xAI(Grok), 딥시크, 미스트랄 등이 몇 달 단위로 새 모델을 낸다. 경쟁의 연료는 데이터와 GPU. 10만 장 규모 GPU 클러스터가 생겼다.', en: 'OpenAI (GPT), Anthropic (Claude), Google (Gemini, Dec 2023), Meta (Llama), xAI (Grok), DeepSeek, Mistral and others ship new models every few months. The fuel is data and GPUs; clusters of 100,000 GPUs now exist.' },
  { ko: '몇 달마다 신기록이 깨지는 육상 경기', en: 'A track meet where records fall every few months' },
  { ko: 'xAI의 Colossus는 H100 10만 장을 122일 만에 세웠다고 발표했다(2024)', en: 'xAI said its Colossus cluster of 100,000 H100s was built in 122 days (2024)' },
  ['llama3'], { kid: { ko: '몇 달마다 신기록이 깨지는 경주야. 연료는 데이터와 GPU.', en: 'A race where records fall every few months. The fuel is data and GPUs.' } });
add('koreaai', 'Korea: HBM & AI', '한국의 HBM과 AI',
  { ko: 'AI 붐의 병목은 메모리다. SK하이닉스는 HBM3·HBM3E를 NVIDIA에 주공급하고, 삼성전자·마이크론이 뒤를 잇는다. 한국은 GPU와 데이터센터에 투자하고 네이버·LG·업스테이지 등이 자체 LLM을 만든다.', en: 'Memory is the bottleneck of the AI boom. SK hynix is NVIDIA\'s main HBM3/HBM3E supplier, followed by Samsung and Micron. Korea invests in GPUs and data centers, and Naver, LG and Upstage build their own LLMs.' },
  { ko: '경주에서 타이어를 대는 회사가 가장 바쁘다', en: 'In a race, the tire supplier is the busiest' },
  { ko: 'H100 한 장에 HBM3 다이 48장이 들어간다. GPU 한 장이 팔릴 때마다 DRAM 다이 수십 장이 함께 팔린다', en: 'One H100 carries 48 HBM3 dies; every GPU sold sells dozens of DRAM dies with it' },
  ['skhynix-hbm3', 'nv-h100-wp'], { kid: { ko: '경주에서 제일 바쁜 건 타이어 가게야. AI 붐의 병목은 메모리고, 그걸 한국이 만들어.', en: 'In a race the tire shop is busiest. The AI bottleneck is memory, and Korea makes it.' } });

export const TERMS = T;
