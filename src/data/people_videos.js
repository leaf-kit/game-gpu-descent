// 실존 인물 NPC + 게임 요소별 해설 영상. 모든 videoId는 YouTube oEmbed(또는 watch 페이지)로 존재 확인함 (2026-09-12).
// 출처/검증 표: docs/research/05_people_and_videos.md
export const PEOPLE = [
  { id: 'jensen', name: { ko: '젠슨 황', en: 'Jensen Huang' }, years: '1963–', role: { ko: 'NVIDIA 공동창업자·CEO. GPU를 그래픽 칩에서 AI 컴퓨팅의 엔진으로 바꾼 사람.', en: 'NVIDIA co-founder and CEO who turned the GPU from a graphics chip into the engine of AI computing.' }, areas: ['P10', 'L0', 'L2', 'L1'], quote: { ko: '많이 살수록 많이 아낍니다.', en: 'The more you buy, the more you save.' }, look: { hair: 0x111111, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x111111, suit2: 0x222222, glasses: false }, video: { id: 'DpQQi2scsHo', title: 'Nvidia CEO Jensen Huang and the $2 trillion company powering today\'s AI | 60 Minutes', channel: '60 Minutes', min: 13 } },
  { id: 'dally', name: { ko: '빌 댈리', en: 'Bill Dally' }, years: '1960–', role: { ko: 'NVIDIA 수석 과학자. 병렬 컴퓨팅·인터커넥트·딥러닝 하드웨어 연구를 이끈다.', en: 'NVIDIA chief scientist; leads research on parallel computing, interconnects and deep learning hardware.' }, areas: ['P10', 'L5', 'L6', 'L3', 'L4'], look: { hair: 0xbbbbbb, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x3a5f8f, suit2: 0x222b3a, glasses: true }, video: { id: 'zDBF0xwQW-0', title: 'SysML 18: Bill Dally, Hardware for Deep Learning', channel: 'SysML Conference', min: 37 } },
  { id: 'buck', name: { ko: '이언 벅', en: 'Ian Buck' }, years: 'b. 1970s', role: { ko: 'CUDA의 창시자. 스탠퍼드에서 Brook을 만들고 NVIDIA에서 CUDA를 만들었다.', en: 'Creator of CUDA; built Brook at Stanford and then CUDA at NVIDIA.' }, areas: ['L6', 'L7', 'L2'], look: { hair: 0x6b4a2b, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x2f2f2f, suit2: 0x76b900, glasses: false }, video: { id: 'MVMjOOLBUn8', title: 'NVIDIA CUDA - Introduction to CUDA5 by Ian Buck', channel: 'NVIDIA', min: 3 } },
  { id: 'nickolls', name: { ko: '존 니콜스', en: 'John Nickolls' }, years: '–2011', role: { ko: 'NVIDIA GPU 컴퓨팅 아키텍처 디렉터. 젠슨 황이 "그가 없었다면 CUDA도 없었다"고 말한 인물.', en: 'NVIDIA director of GPU computing architecture; Jensen Huang said there would be no CUDA without him.' }, areas: ['L5', 'L7', 'L4'], look: { hair: 0x999999, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x445566, suit2: 0x222222, glasses: true }, video: { id: 'nlGnKPpOpbE', title: 'Scalable Parallel Programming with CUDA on Manycore GPUs', channel: 'Stanford', min: 81 } },
  { id: 'morris', name: { ko: '모리스 창', en: 'Morris Chang' }, years: '1931–', role: { ko: 'TSMC 창업자. 순수 파운드리 모델을 만들어 팹리스 산업(NVIDIA 포함)을 가능하게 했다.', en: 'Founder of TSMC; invented the pure-play foundry model that made fabless companies like NVIDIA possible.' }, areas: ['P5', 'P9', 'P7'], look: { hair: 0xcccccc, hairStyle: 'short', skin: 0xe8c39e, suit: 0x1c2a3a, suit2: 0x333333, glasses: true }, video: { id: 'u-x7PdnvCyI', title: 'Morris Chang, in conversation with Jen-Hsun Huang', channel: 'Computer History Museum', min: 92 } },
  { id: 'hu', name: { ko: '후정밍', en: 'Chenming Hu' }, years: '1947–', role: { ko: 'FinFET 발명자(UC 버클리). 3D 트랜지스터로 무어의 법칙을 연장했다.', en: 'Inventor of the FinFET at UC Berkeley; the 3-D transistor that extended Moore\'s law.' }, areas: ['L12'], look: { hair: 0x555555, hairStyle: 'short', skin: 0xe8c39e, suit: 0x2a2a2a, suit2: 0x8a1c1c, glasses: true }, video: { id: 'DoXGomNzDjI', title: 'Chenming Hu and FinFET 胡正明与FinFET', channel: 'chenming hu', min: 6 } },
  { id: 'czochralski', name: { ko: '얀 초크랄스키', en: 'Jan Czochralski' }, years: '1885–1953', role: { ko: '폴란드 화학자. 1916년 단결정 인상법(CZ법)을 발견, 오늘날 거의 모든 실리콘 잉곳이 이 방법으로 자란다.', en: 'Polish chemist who discovered the crystal-pulling (CZ) method in 1916; nearly every silicon ingot today is grown this way.' }, areas: ['P3', 'P4'], look: { hair: 0x3a2a1a, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x3b3b3b, suit2: 0x1a1a1a, glasses: false }, video: { id: 'v0I3LbKnP3M', title: 'Czochralski Method Explained with Animation | How Single Crystals Are Grown for Semiconductors!', channel: 'Physics, Materials Science and Nano Lecture Series', min: 8 } },
  { id: 'shockley', name: { ko: '윌리엄 쇼클리', en: 'William Shockley' }, years: '1910–1989', role: { ko: '벨 연구소에서 접합 트랜지스터를 고안. 1956년 노벨 물리학상 공동 수상.', en: 'Conceived the junction transistor at Bell Labs; shared the 1956 Nobel Prize in Physics.' }, areas: ['L12', 'L14'], look: { hair: 0x777777, hairStyle: 'bald', skin: 0xf1c9a5, suit: 0x333333, suit2: 0x111111, glasses: false }, video: { id: 'WiQvGRjrLnU', title: 'AT&T Archives: Genesis of the Transistor', channel: 'AT&T Tech Channel', min: 15 } },
  { id: 'bardeen', name: { ko: '존 바딘', en: 'John Bardeen' }, years: '1908–1991', role: { ko: '점접촉 트랜지스터 공동 발명자. 물리학상을 두 번 받은 유일한 인물(1956, 1972).', en: 'Co-inventor of the point-contact transistor; the only person to win the physics Nobel twice (1956, 1972).' }, areas: ['L12', 'L14'], look: { hair: 0x999999, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x2b2b2b, suit2: 0x111111, glasses: true }, video: { id: 'OyV8qSwGUHU', title: 'Spark of Genius: The Story of John Bardeen', channel: 'University of Illinois Urbana-Champaign', min: 23 } },
  { id: 'brattain', name: { ko: '월터 브래튼', en: 'Walter Brattain' }, years: '1902–1987', role: { ko: '1947년 12월 바딘과 함께 첫 트랜지스터를 실제로 만든 실험 물리학자.', en: 'Experimental physicist who, with Bardeen, physically built the first transistor in December 1947.' }, areas: ['L12'], look: { hair: 0x888888, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x4a4a4a, suit2: 0x222222, glasses: true }, video: { id: 'LRJZtuqCoMw', title: 'The Genesis of the Transistor, with Bonus Introduction - AT&T Archives', channel: 'AT&T Tech Channel', min: 17 } },
  { id: 'kilby', name: { ko: '잭 킬비', en: 'Jack Kilby' }, years: '1923–2005', role: { ko: '1958년 텍사스 인스트루먼트에서 첫 집적회로를 시연. 2000년 노벨 물리학상.', en: 'Demonstrated the first integrated circuit at Texas Instruments in 1958; Nobel Prize in Physics 2000.' }, areas: ['L2', 'L11'], look: { hair: 0x999999, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x2f3b4a, suit2: 0x111111, glasses: true }, video: { id: 'gLNo4absXLA', title: 'The Chip That Jack Built', channel: 'tellyspottingpub (KERA film)', min: 9 } },
  { id: 'noyce', name: { ko: '로버트 노이스', en: 'Robert Noyce' }, years: '1927–1990', role: { ko: '평면 공정 기반 집적회로의 공동 발명자. 페어차일드와 인텔의 공동창업자.', en: 'Co-inventor of the planar integrated circuit; co-founder of Fairchild Semiconductor and Intel.' }, areas: ['L2', 'L10'], look: { hair: 0x666666, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x3a3a3a, suit2: 0x111111, glasses: false }, video: { id: 'AfxUq_QrpyY', title: 'The Impact of Integrated Circuits, lecture by Robert Noyce', channel: 'Computer History Museum', min: 42 } },
  { id: 'moore', name: { ko: '고든 무어', en: 'Gordon Moore' }, years: '1929–2023', role: { ko: '인텔 공동창업자. 1965년 "무어의 법칙"을 제시했다.', en: 'Intel co-founder who proposed Moore\'s law in 1965.' }, areas: ['L13'], quote: { ko: '최소 부품 비용에서의 복잡도는 대략 매년 두 배씩 증가해 왔다.', en: 'The complexity for minimum component costs has increased at a rate of roughly a factor of two per year.' }, look: { hair: 0xbbbbbb, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x2a3a5a, suit2: 0x111111, glasses: true }, video: { id: 'gtcLzokagAw', title: 'Oral History of Gordon Moore', channel: 'Computer History Museum', min: 48 } },
  { id: 'dennard', name: { ko: '로버트 데너드', en: 'Robert Dennard' }, years: '1932–2024', role: { ko: 'IBM에서 1-트랜지스터 DRAM 셀을 발명(1968). 트랜지스터 축소 규칙 "데너드 스케일링"도 그의 것.', en: 'Invented the one-transistor DRAM cell at IBM (1968) and formulated Dennard scaling.' }, areas: ['L9', 'L13', 'H2'], look: { hair: 0xcccccc, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x1f3d6b, suit2: 0x111111, glasses: true }, video: { id: 'mhVxv-oXfNA', title: 'IBM Engineer Bob Dennard and the Chip That Changed the World', channel: 'IBM Research', min: 5 } },
  { id: 'faggin', name: { ko: '페데리코 파진', en: 'Federico Faggin' }, years: '1941–', role: { ko: '실리콘 게이트 MOS 기술을 개발하고 최초의 마이크로프로세서 인텔 4004를 설계했다.', en: 'Developed silicon-gate MOS technology and designed the first microprocessor, the Intel 4004.' }, areas: ['L2', 'L11', 'L8'], look: { hair: 0xdddddd, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x333333, suit2: 0x111111, glasses: true }, video: { id: 'HwJGU9_Mj0c', title: 'Interview | Federico Faggin', channel: 'Lumafield', min: 55 } },
  { id: 'conway', name: { ko: '린 콘웨이', en: 'Lynn Conway' }, years: '1938–2024', role: { ko: '미드와 함께 VLSI 설계 방법론을 만들어 칩 설계를 누구나 할 수 있게 했다.', en: 'With Carver Mead created the VLSI design methodology that opened chip design to everyone.' }, areas: ['L2', 'L10'], look: { hair: 0xd8c8a0, hairStyle: 'long', skin: 0xf4d3b8, suit: 0x5a3d7a, suit2: 0x222222, glasses: true }, video: { id: 'EYzN_tgut88', title: 'Oral History of Lynn Conway', channel: 'Computer History Museum', min: 116 } },
  { id: 'mead', name: { ko: '카버 미드', en: 'Carver Mead' }, years: '1934–', role: { ko: '"무어의 법칙"이라는 이름을 붙인 칼텍 교수. VLSI 설계와 뉴로모픽 공학의 개척자.', en: 'Caltech professor who named Moore\'s law; pioneer of VLSI design and neuromorphic engineering.' }, areas: ['L13', 'L10', 'L8'], look: { hair: 0xdddddd, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x4a4a4a, suit2: 0x222222, glasses: true }, video: { id: 'eAZWXX5930M', title: 'Carver Mead “A Personal Journey Through the Information Revolution”', channel: 'Kyoto Prize', min: 39 } },
  { id: 'vandenbrink', name: { ko: '마르틴 판덴브링크', en: 'Martin van den Brink' }, years: '1957–', role: { ko: 'ASML 전 사장·CTO. EUV 리소그래피를 연구실에서 양산까지 끌고 간 기술 총책임자.', en: 'Former ASML president and CTO who drove EUV lithography from lab to high-volume manufacturing.' }, areas: ['P6'], look: { hair: 0x999999, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x1f3a5f, suit2: 0x222222, glasses: true }, video: { id: 'jxKlyUQd904', title: 'ZEISS Beyond Talk – Martin van den Brink of ASML about the semiconductor industry', channel: 'ZEISS Group', min: 8 } },
  { id: 'wennink', name: { ko: '페터르 베닝크', en: 'Peter Wennink' }, years: '1957–', role: { ko: 'ASML 전 CEO(2013–2024). EUV 시대의 ASML을 이끌었다.', en: 'Former ASML CEO (2013–2024) who led the company through the EUV era.' }, areas: ['P6'], look: { hair: 0xaaaaaa, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x2a2a2a, suit2: 0x111111, glasses: true }, video: { id: 'm2LlU_m8SBQ', title: 'TRUMPF: 100 Interviews with pioneer thinkers Peter Wennink (President and CEO, ASML N.V.)', channel: 'TRUMPFtube', min: 9 } },
  { id: 'keller', name: { ko: '짐 켈러', en: 'Jim Keller' }, years: '1958–', role: { ko: 'AMD Zen, 애플 A4/A5, 테슬라 FSD 칩을 이끈 칩 아키텍트.', en: 'Chip architect behind AMD Zen, Apple A4/A5 and Tesla\'s FSD chip.' }, areas: ['L2', 'L5', 'L4', 'L1'], look: { hair: 0x888888, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x333333, suit2: 0x111111, glasses: false }, video: { id: 'Nb2tebYAaOA', title: 'Jim Keller: Moore\'s Law, Microprocessors, and First Principles | Lex Fridman Podcast #70', channel: 'Lex Fridman', min: 95 } },
  { id: 'kwon', name: { ko: '권오현', en: 'Kwon Oh-hyun' }, years: '1952–', role: { ko: '삼성전자 전 부회장·CEO. 1992년 세계 최초 64Mb DRAM 개발을 이끌었다.', en: 'Former Samsung Electronics vice chairman and CEO; led development of the world\'s first 64Mb DRAM in 1992.' }, areas: ['P8', 'L9', 'H1', 'H2'], look: { hair: 0x222222, hairStyle: 'short', skin: 0xe8c39e, suit: 0x1a2a4a, suit2: 0x111111, glasses: true }, video: { id: 'uCkoRV4fOUs', title: 'Dr. Oh-Hyun Kwon, Vice Chairman & CEO, Samsung Electronics Co., Ltd.', channel: 'The Economic Club of Washington, D.C.', min: 28 } },
  { id: 'kwak', name: { ko: '곽노정', en: 'Kwak Noh-jung' }, years: '1965–', role: { ko: 'SK하이닉스 CEO. NVIDIA에 HBM을 공급하며 AI 메모리 1위를 이끈다.', en: 'SK hynix CEO leading the HBM business that supplies NVIDIA\'s AI GPUs.' }, areas: ['P8', 'H1'], look: { hair: 0x222222, hairStyle: 'short', skin: 0xe8c39e, suit: 0x2a2a2a, suit2: 0xe8501e, glasses: true }, video: { id: 'eSWFPJVIOUQ', title: 'SK hynix CEO Kwak Noh-Jung shares his vision for the AI era', channel: 'Nasdaq', min: 11 } },
  { id: 'kang', name: { ko: '강기동', en: 'Kang Ki-dong' }, years: '1934–', role: { ko: '1974년 한국반도체를 세운 한국 반도체의 선구자. 이 회사가 삼성반도체가 되었다.', en: 'Founded Korea Semiconductor in 1974, the company that became Samsung Semiconductor; pioneer of Korean chips.' }, areas: ['P5', 'L9'], look: { hair: 0xdddddd, hairStyle: 'short', skin: 0xe8c39e, suit: 0x3a3a3a, suit2: 0x111111, glasses: true }, video: { id: 'rRy_j5XaBX8', title: '[인터뷰] 한국 반도체의 선구자 강기동 박사. 그가 삼성에 편지를 보낸 이유는?', channel: '아시아경제', min: 13, lang: 'ko' } },
  { id: 'hinton', name: { ko: '제프리 힌턴', en: 'Geoffrey Hinton' }, years: '1947–', role: { ko: '딥러닝의 대부. AlexNet(2012)의 지도교수, 2024년 노벨 물리학상.', en: 'Godfather of deep learning; advisor on AlexNet (2012); Nobel Prize in Physics 2024.' }, areas: ['P10'], quote: { ko: '일리야가 하자고 했고, 알렉스가 되게 만들었고, 나는 노벨상을 받았다.', en: 'Ilya thought we should do it, Alex made it work, and I got the Nobel Prize.' }, look: { hair: 0xdddddd, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x3a3a3a, suit2: 0x1a1a1a, glasses: false }, video: { id: 'XDE9DjpcSdI', title: 'Nobel Prize lecture: Geoffrey Hinton, Nobel Prize in Physics', channel: 'Nobel Prize', min: 32 } },
  { id: 'krizhevsky', name: { ko: '알렉스 크리제브스키', en: 'Alex Krizhevsky' }, years: '1986–', role: { ko: 'GeForce GTX 580 두 장으로 AlexNet을 학습시켜 GPU 딥러닝 시대를 열었다.', en: 'Trained AlexNet on two GeForce GTX 580s, kicking off the GPU deep learning era.' }, areas: ['P10', 'L6'], look: { hair: 0x3a2a1a, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x2f4f6f, suit2: 0x222222, glasses: false }, video: { id: 'UZDiGooFs54', title: 'The moment we stopped understanding AI [AlexNet]', channel: 'Welch Labs', min: 18 } },
  { id: 'lecun', name: { ko: '얀 르쿤', en: 'Yann LeCun' }, years: '1960–', role: { ko: '합성곱 신경망(CNN)의 창시자. 튜링상 수상.', en: 'Creator of convolutional neural networks; Turing Award winner.' }, areas: ['P10'], look: { hair: 0x999999, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x222222, suit2: 0x111111, glasses: true }, video: { id: 'JS12eb1cTLE', title: 'deeplearning.ai\'s Heroes of Deep Learning: Yann LeCun', channel: 'DeepLearningAI', min: 28 } },
  { id: 'raibert', name: { ko: '마크 레이버트', en: 'Marc Raibert' }, years: '1949–', role: { ko: '보스턴 다이내믹스 창업자. 걷고 뛰는 로봇의 아버지.', en: 'Founder of Boston Dynamics; father of legged robots that walk and run.' }, areas: ['P10'], look: { hair: 0xdddddd, hairStyle: 'short', skin: 0xf1c9a5, suit: 0xd9c400, suit2: 0x333333, glasses: true }, video: { id: 'AO4In7d6X-c', title: 'Meet Spot, the robot dog that can run, hop and open doors | Marc Raibert', channel: 'TED', min: 15 } },
  { id: 'adcock', name: { ko: '브렛 애드콕', en: 'Brett Adcock' }, years: '1986–', role: { ko: 'Figure AI 창업자·CEO. 범용 휴머노이드 로봇을 만든다.', en: 'Founder and CEO of Figure AI, building general-purpose humanoid robots.' }, areas: ['P10'], look: { hair: 0x2a1a0e, hairStyle: 'short', skin: 0xf1c9a5, suit: 0x111111, suit2: 0x222222, glasses: false }, video: { id: 'g1ESjEGG1SM', title: 'The $10 Trillion Bet on Humanoid Robots | Figure Founder Brett Adcock', channel: 'Sourcery with Molly O\'Shea', min: 33 } },
  { id: 'talla', name: { ko: '디푸 탈라', en: 'Deepu Talla' }, years: '—', role: { ko: 'NVIDIA 로보틱스·엣지 AI 부사장. Jetson 플랫폼을 이끈다.', en: 'NVIDIA VP of Robotics and Edge AI; leads the Jetson platform.' }, areas: ['P10'], look: { hair: 0x111111, hairStyle: 'short', skin: 0xc68642, suit: 0x222222, suit2: 0x76b900, glasses: false }, video: { id: '2e8NouTL5AA', title: 'Live from GTC 2024: Interview on the latest in Robotics', channel: 'VentureBeat', min: 8 } },
  { id: 'jimfan', name: { ko: '짐 판', en: 'Jim Fan' }, years: '—', role: { ko: 'NVIDIA GEAR 랩 리더. 휴머노이드 파운데이션 모델 GR00T 프로젝트를 이끈다.', en: 'Leads NVIDIA\'s GEAR lab and the GR00T humanoid foundation-model project.' }, areas: ['P10'], look: { hair: 0x111111, hairStyle: 'short', skin: 0xe8c39e, suit: 0x222222, suit2: 0x76b900, glasses: true }, video: { id: '_2NijXqBESI', title: 'The Physical Turing Test: Jim Fan on Nvidia\'s Roadmap for Embodied AI', channel: 'Sequoia Capital', min: 18 } },
];

export const VIDEOS = {
  quartz: [
    { id: 'pPh3llHq5vc', title: 'Why You Need Sand from This Town to Make a Computer', channel: 'Half as Interesting', min: 8, why: 'Explains why ultra-pure quartz from Spruce Pine is the starting point of every chip.' },
    { id: '_VMYPLXnd7E', title: 'From Sand to Silicon: The Making of a Microchip | Intel', channel: 'Intel', min: 5, why: 'Official overview of the whole chain from sand to finished processor.' },
  ],
  mgsi: [
    { id: 'aXlDeDWittc', title: 'Elkem silicon & microsilica production', channel: 'Bluestar Silicones', min: 5, why: 'Real footage of quartz being smelted with carbon in a submerged arc furnace into metallurgical silicon.' },
    { id: 'IkRXpFIRUl4', title: 'How are microchips made? - George Zaidan and Sajan Saini', channel: 'TED-Ed', min: 5, why: 'Short animated overview that starts from sand and covers purification.' },
  ],
  polysi: [
    { id: 'ZkUiK8JPxaM', title: 'Polysilicon', channel: 'ChipDipvideo', min: 3, why: 'Quick explainer of trichlorosilane and the Siemens rod reactor.' },
    { id: 'sIRfWyyOFPg', title: 'The Amazing, Humble Silicon Wafer', channel: 'Asianometry', min: 18, why: 'Covers the Siemens purification chemistry on the way from metallurgical silicon to wafer.' },
  ],
  czochralski: [
    { id: 'v0I3LbKnP3M', title: 'Czochralski Method Explained with Animation | How Single Crystals Are Grown for Semiconductors!', channel: 'Physics, Materials Science and Nano Lecture Series', min: 8, why: 'Animated walkthrough of seed crystal, melt, rotation and pulling.' },
    { id: 'cYj_vqcyI78', title: 'Silicon Crystal Growth', channel: 'M&D Hauling', min: 1, why: 'Real time-lapse of an ingot being pulled from the melt.' },
  ],
  wafer: [
    { id: 'TZxD2ePrphY', title: 'Siltronic Animated Wafer Production Process', channel: 'Siltronic AG', min: 3, why: 'Wafer maker animation: ingot grinding, wire-saw slicing, lapping, etching and polishing.' },
    { id: '0s5TO9h6fco', title: 'The 300mm Silicon Wafer Transition', channel: 'Asianometry', min: 15, why: 'Why wafers are 300 mm and what it took to get there.' },
  ],
  cleanroom: [
    { id: 'NrpBc5NssvQ', title: 'INSIDE THE CLEANROOM How Microchips Are Made', channel: 'IHP GmbH', min: 7, why: 'Walk-through of a real Class 100 semiconductor cleanroom.' },
    { id: 'k599RnPq7o4', title: 'The Semiconductor Fab: How To Put On A Bunny Suit', channel: 'TechTechPotato', min: 6, why: 'Step-by-step gowning procedure before entering a fab.' },
  ],
  photolith: [
    { id: 'TjpbrLTem3M', title: 'Fabrication Processes of a Chip: Photolithography', channel: 'Institute of Microelectronics of Barcelona (CSIC)', min: 6, why: 'Resist coating, exposure, development explained by a research fab.' },
    { id: 'Bu52CE55BN0', title: '‘Semiconductor Manufacturing Process’ Explained', channel: 'Samsung Semiconductor Newsroom', min: 8, why: 'Official Samsung overview of the eight major fab steps including photolithography.' },
  ],
  euv: [
    { id: 'B2482h_TNwg', title: 'The $200M Machine that Prints Microchips:  The EUV Photolithography System', channel: 'Branch Education', min: 39, why: 'Definitive 3D-animated tour of the EUV scanner, tin-droplet source, mirrors and wafer stage.' },
    { id: 'MXnrzS3aGeM', title: 'ASML’s Breakthrough 3-Pulse EUV Light Source', channel: 'Asianometry', min: 18, why: 'Deep dive into how 13.5 nm light is generated from tin plasma.' },
  ],
  etch: [
    { id: 'po-nlRUQkbI', title: 'Etch: Lithography\'s Unheralded Sibling', channel: 'Asianometry', min: 18, why: 'Plasma etch explained as the step that actually carves the pattern.' },
    { id: '3UUq5cPH4Uw', title: 'The Unreasonable Effectiveness of Atomic Layer Deposition', channel: 'Asianometry', min: 17, why: 'How ALD lays down films one atomic layer at a time.' },
  ],
  wafertest: [
    { id: 'sjf1SBPxmkw', title: 'From Silicon to Chips: Understanding Wafer Yield in Semiconductor Production', channel: 'VPACHKAWADE', min: 6, why: 'Defines yield and why dies on the same wafer end up in different bins.' },
    { id: '-8s7PQjI4b4', title: 'Semiconductor Yield Management and Defect Analysis (9 Minutes)', channel: 'BioTech Whisperer', min: 8, why: 'Overview of defect sources and yield management.' },
  ],
  dicing: [
    { id: 'luGmSikiJvY', title: 'Wafer Sawing Overview Animation', channel: 'Semitracks Inc.', min: 1, why: 'Short animation of a diamond blade singulating a wafer along scribe lines.' },
    { id: 'mBsIoWgUdq0', title: 'Wafer Dicing Saw Training', channel: 'Minnesota Nano Center', min: 34, why: 'Real dicing saw operation in a university cleanroom.' },
  ],
  hbm: [
    { id: 'yAw63F1W_Us', title: 'The Special Memory Powering the AI Revolution', channel: 'Asianometry', min: 13, why: 'What HBM is, why it is stacked, and why AI GPUs need it.' },
    { id: 'Cg5tAujp6Go', title: 'SK hynix and the HBM Revolution', channel: 'Asianometry', min: 38, why: 'History of how SK hynix came to lead HBM.' },
  ],
  tsv: [
    { id: 's5IBdqM07P8', title: '[Eng Sub] TSV (Through Silicon Via) - HBM, Silicon Interposer, CMOS Image Sensor, MEMS', channel: 'Semicon Talk', min: 6, why: 'Explains through-silicon vias and how they connect stacked DRAM dies.' },
    { id: 'j8TFFhQ2s40', title: 'Secret of HBM Production Revealed - The 12 Steps That Power AI', channel: 'TechTalk', min: 6, why: 'Step-by-step TSV and stacking flow for HBM.' },
  ],
  cowos: [
    { id: 'wmlsAExkedg', title: 'TSMC’s CoWoS Explained: The Packaging Tech Powering AI Chips', channel: 'TechNews Pro', min: 4, why: 'Chip-on-wafer-on-substrate and the silicon interposer in four minutes.' },
    { id: 'nNpuiJitKwk', title: 'A Brief History of Semiconductor Packaging', channel: 'Asianometry', min: 19, why: 'From wire bonding to 2.5D interposers; context for why CoWoS exists.' },
  ],
  microbump: [
    { id: 'hKhMXzVzoqc', title: 'What Is Flip Chip Packaging?', channel: 'Open Answers', min: 3, why: 'Flip-chip bumps, attach and underfill in plain language.' },
    { id: '7gg2eVVayA4', title: 'Semiconductor Packaging Explained', channel: 'Samsung Semiconductor Newsroom', min: 3, why: 'Official Samsung explainer on what packaging does for a die.' },
  ],
  finaltest: [
    { id: 'BAO7BCS9fa4', title: 'Semiconductor Test -An Introduction', channel: 'CP Ravikumar - Webinars', min: 49, why: 'Why packaged chips are tested and how ATE works.' },
    { id: '0uPYrUmCWMs', title: 'Teradyne UltraFLEXplus Advanced Semiconductor Tester', channel: 'Teradyne, Inc.', min: 2, why: 'Look at a real production tester used for final test.' },
  ],
  vrm: [
    { id: 'tqvj4CQhRmg', title: 'ASUS Explains Transient Response, VRM Layout Basics, & LLC for Motherboards', channel: 'Gamers Nexus', min: 16, why: 'What a VRM phase does and why layout matters for power delivery.' },
    { id: 'F2gxVE8FUFw', title: 'The many ways to make an 8+2 phase.', channel: 'Actually Hardcore Overclocking', min: 27, why: 'Buildzoid on real VRM phase designs.' },
  ],
  dgx: [
    { id: '7a0UGHvxrLw', title: 'This is NVIDIA’s new GPU - Blackwell NVL72 Rack', channel: 'Linus Tech Tips', min: 13, why: 'Hands-on tour of a GB200 NVL72 rack: trays, NVLink spine, liquid cooling.' },
    { id: 'Hs2yXBlEIWs', title: 'NVIDIA GB200 NVL72 | ASUS AI POD', channel: 'ASUS', min: 1, why: 'Quick visual of a complete NVL72 rack from an OEM.' },
  ],
  jetson: [
    { id: 'S9L2WGf1KrM', title: 'Introducing NVIDIA Jetson Orin™ Nano Super: The World’s Most Affordable Generative AI Computer', channel: 'NVIDIA', min: 2, why: 'Official intro to the Jetson edge module.' },
    { id: 'Q5YvYb1X-BE', title: 'NVIDIA® Jetson AGX Thor™ – Powering the Next Era of Robotics', channel: '益登科技 EDOM Technology', min: 11, why: 'Jetson Thor, the Blackwell-based robot brain.' },
  ],
  physicalai: [
    { id: 'm1CH-mgpdYg', title: 'NVIDIA Isaac GR00T N1: An Open Foundation Model for Humanoid Robots', channel: 'NVIDIA', min: 2, why: 'Official GR00T N1 humanoid foundation model reveal.' },
    { id: '_2NijXqBESI', title: 'The Physical Turing Test: Jim Fan on Nvidia\'s Roadmap for Embodied AI', channel: 'Sequoia Capital', min: 18, why: 'Jim Fan explains simulation-first physical AI.' },
  ],
  pcb: [
    { id: 'Z2LgmIGE2nI', title: 'What are PCBs? || How do PCBs Work?', channel: 'Branch Education', min: 10, why: 'X-ray view of PCB layers, vias and traces.' },
  ],
  nvlink: [
    { id: 'HkbMdrfF0FA', title: 'S1eps6 - NVLINK & NVSwitch', channel: 'Data Sciences Corporation', min: 4, why: 'Whiteboard explanation of NVLink and NVSwitch.' },
    { id: 'RBf8FLS6q8E', title: 'NVIDIA NVLink High-Speed Interconnect: Maximizes throughput for Superior Application Performance', channel: 'NVIDIA', min: 1, why: 'Official NVIDIA NVLink overview.' },
  ],
  pcie: [
    { id: 'PrXwe21biJo', title: 'Explaining PCIe Slots', channel: 'ExplainingComputers', min: 11, why: 'Lanes, generations and bandwidth explained on real hardware.' },
    { id: 'frqgrEi3Df8', title: 'PCI Express (PCIe) | PCIe Explained', channel: 'Prodigy Technovations', min: 2, why: 'Two-minute PCIe protocol summary.' },
  ],
  package: [
    { id: 'nNpuiJitKwk', title: 'A Brief History of Semiconductor Packaging', channel: 'Asianometry', min: 19, why: 'Why a die needs a package and how packaging evolved.' },
    { id: '-egYoxajTz0', title: 'The World of Advanced Packaging', channel: 'Applied Materials', min: 1, why: 'Equipment maker\'s one-minute view of advanced packaging.' },
  ],
  die: [
    { id: 'rCwgAGG2sZQ', title: 'RTX 5090 Chip Deep-Dive', channel: 'High Yield', min: 18, why: 'Annotated die shot of a Blackwell GPU: GPCs, L2, memory controllers.' },
  ],
  gigathread: [
    { id: 'QQceTDjA4f4', title: 'GTC 2022 - How CUDA Programming Works - Stephen Jones, CUDA Architect, NVIDIA', channel: 'Coding Workflows', min: 41, why: 'CUDA architect explains how kernels, grids and blocks map onto the GPU.' },
    { id: 'OwJp5GudZ6o', title: 'CUDA: Kernels, Blocks, Grids, Threads and Warps', channel: 'Clarence Lee', min: 24, why: 'Kernel launch hierarchy from grid to warp.' },
  ],
  l2: [
    { id: '6JpLD3PUAZk', title: 'Why do CPUs Need Caches? - Computerphile', channel: 'Computerphile', min: 6, why: 'Why a fast processor needs a cache between it and memory.' },
    { id: 'SAk-6gVkio0', title: 'How CPU Memory & Caches Work - Computerphile', channel: 'Computerphile', min: 35, why: 'Multi-level cache hierarchy explained by Matt Godbolt.' },
  ],
  memctrl: [
    { id: '7J7X7aZvMXQ', title: 'How does Computer Memory Work? 💻🛠', channel: 'Branch Education', min: 36, why: 'DRAM rows, columns, sense amplifiers and the controller in 3D.' },
    { id: 'xOWZkDcEe38', title: '🎮 GDDR RAM Explained: Why Your GPU Needs It! ⚡', channel: 'Computer Engineering life', min: 4, why: 'Why GPUs use GDDR and how it differs from DDR.' },
  ],
  gpc: [
    { id: 'h9Z4oGN89MU', title: 'How do Graphics Cards Work?  Exploring GPU Architecture', channel: 'Branch Education', min: 29, why: 'GA102 die torn down into GPCs, TPCs, SMs and CUDA cores in 3D.' },
  ],
  warp: [
    { id: 'GveaLmXPJEY', title: 'GPU Warps Explained: How SIMT Really Works Under the Hood (Visual Deep Dive) | M2L3', channel: 'Parallel Routines', min: 10, why: 'Visual explanation of 32-thread warps and SIMT lockstep execution.' },
    { id: 'vscfS1pLCV8', title: 'GPU Execution Explained: Warps, Blocks, and Why Performance Stall', channel: 'step_henny0', min: 11, why: 'Warps, divergence and stalls.' },
  ],
  cudacore: [
    { id: 'pPStdjuYzSI', title: 'Nvidia CUDA in 100 Seconds', channel: 'Fireship', min: 3, why: 'Fast, fun intro to what a CUDA core executes.' },
    { id: 'C15HxODWq3o', title: 'CUDA Programming Tutorial: Threads and Blocks Explained in Detail', channel: 'Mr. AI Lab', min: 9, why: 'Threads, blocks and the per-thread FMA work.' },
  ],
  tensorcore: [
    { id: 'Yt1A-vaWTck', title: 'NVIDIA Tensor Cores Programming', channel: 'Tushar Gautam', min: 7, why: 'Tensor core matrix-multiply tiles shown with code.' },
    { id: 'ICeLiezk9Mk', title: 'An Introduction to NVIDIA Tensor Cores', channel: 'Jan Verschelde', min: 42, why: 'Lecture on tensor cores and mixed precision.' },
  ],
  fp8: [
    { id: 'PZRI1IfStY0', title: 'Floating Point Numbers - Computerphile', channel: 'Computerphile', min: 9, why: 'Sign, exponent, mantissa: the basis for FP32/FP16/FP8.' },
    { id: 'i1fIBtdhjIg', title: 'NVIDIA Developer How To Series: Mixed-Precision Training', channel: 'NVIDIA Developer', min: 6, why: 'Official NVIDIA explanation of lower-precision training.' },
  ],
  registerfile: [
    { id: 'Q1Y-vkXqCKM', title: 'GPU Memory Hierarchy Explained: Registers, Shared Memory, L2, HBM, and PCIe (Visual) | M2L2', channel: 'Parallel Routines', min: 5, why: 'Where the register file sits in the GPU memory hierarchy.' },
    { id: 'mlAd3TEX9sg', title: 'How a Register File Works – Superscalar 8-Bit CPU #16', channel: 'Fabian Schuiki', min: 32, why: 'Circuit-level view of a multi-port register file.' },
  ],
  sram6t: [
    { id: 'k5VBJcUcaWU', title: 'SRAM 6T - circuit explanation and read operation', channel: 'Shrenik Jain', min: 8, why: 'Cross-coupled inverters plus access transistors: the 6T cell.' },
    { id: 'P78GNkk_00s', title: 'VLSI - Lecture 8b: The 6T SRAM Bitcell', channel: 'Adi Teman', min: 23, why: 'University lecture on the 6T bitcell.' },
  ],
  dram: [
    { id: '7J7X7aZvMXQ', title: 'How does Computer Memory Work? 💻🛠', channel: 'Branch Education', min: 36, why: '1T1C DRAM cell, refresh, rows and columns in 3D.' },
    { id: 'mhVxv-oXfNA', title: 'IBM Engineer Bob Dennard and the Chip That Changed the World', channel: 'IBM Research', min: 5, why: 'The inventor of the DRAM cell in his own words.' },
  ],
  logicgate: [
    { id: 'sTu3LwpF6XI', title: 'Making logic gates from transistors', channel: 'Ben Eater', min: 13, why: 'Builds NOT, NAND and XOR from real transistors on a breadboard.' },
    { id: 'f3zRz0d9XA8', title: 'CMOS Logic Gates Explained | Logic Gate Implementation using CMOS logic', channel: 'ALL ABOUT ELECTRONICS', min: 28, why: 'PMOS/NMOS pairs forming CMOS inverter, NAND and NOR.' },
  ],
  finfet: [
    { id: 'd9SWNLZvA8g', title: 'Intel: The Making of a Chip with 22nm/3D Transistors | Intel', channel: 'Intel', min: 3, why: 'Official animation of the first mass-produced FinFET (tri-gate).' },
    { id: 'i3dDslo9ibw', title: 'The 3-D Transistor Transition', channel: 'Asianometry', min: 14, why: 'Planar to FinFET to gate-all-around, and why.' },
  ],
  gateoxide: [
    { id: 'oeAW5o3g2Sk', title: 'Intel\'s 45nm Secret "Revealed"', channel: 'TechnologyAtIntel', min: 1, why: 'Intel on replacing SiO2 with hafnium high-k gate dielectric.' },
    { id: '0jOF9zHjHzE', title: 'High-k gate dielectrics', channel: 'nptelhrd', min: 59, why: 'Lecture on why thin gate oxides leak and how high-k fixes it.' },
  ],
  beol: [
    { id: 'XHrQ-Pmvwao', title: 'TSMC\'s First Breakthrough: The Copper/Low-K Interconnect Transition', channel: 'Asianometry', min: 35, why: 'Back-end-of-line wiring: aluminum to copper, low-k dielectrics.' },
    { id: 'dX9CGRZwD-w', title: 'How are Microchips Made? 🖥️🛠️ CPU Manufacturing Process Steps', channel: 'Branch Education', min: 28, why: 'Shows the many metal layers built on top of the transistors.' },
  ],
  via: [
    { id: 'XHrQ-Pmvwao', title: 'TSMC\'s First Breakthrough: The Copper/Low-K Interconnect Transition', channel: 'Asianometry', min: 35, why: 'Includes the dual-damascene process for copper vias and lines.' },
    { id: '3UUq5cPH4Uw', title: 'The Unreasonable Effectiveness of Atomic Layer Deposition', channel: 'Asianometry', min: 17, why: 'ALD barrier/seed layers that line every via.' },
  ],
  clock: [
    { id: 'kRlSFm519Bo', title: 'Astable 555 timer - 8-bit computer clock - part 1', channel: 'Ben Eater', min: 28, why: 'Builds a clock signal from scratch and shows what a cycle is.' },
    { id: '0UnFN7yyMaA', title: 'Computer Speeds - Computerphile', channel: 'Computerphile', min: 6, why: 'Why GHz alone does not equal speed.' },
  ],
  latency: [
    { id: 'Yed-a9vqTYc', title: 'How Do Memory Timings Work?', channel: 'Techquickie', min: 5, why: 'CAS latency and why memory access takes many cycles.' },
    { id: '6JpLD3PUAZk', title: 'Why do CPUs Need Caches? - Computerphile', channel: 'Computerphile', min: 6, why: 'The latency gap between processor and DRAM.' },
  ],
  heat: [
    { id: 'kUyuKqIfMN0', title: 'Thermal Throttling as Fast As Possible', channel: 'Techquickie', min: 4, why: 'What happens when a chip gets too hot and slows itself down.' },
    { id: 'ieMvtUpFENM', title: 'TLDR: How Heatpipes & Air Coolers Work (w/ animation)', channel: 'Gamers Nexus', min: 5, why: 'How heat leaves the die through heatpipes and fins.' },
  ],
  ecc: [
    { id: 'AaZ_RSt0KP8', title: 'The Universe is Hostile to Computers', channel: 'Veritasium', min: 23, why: 'Cosmic rays flipping bits and why ECC exists.' },
    { id: 'ldhQ0a9-oKs', title: 'ECC Memory As Fast As Possible', channel: 'Techquickie', min: 5, why: 'Five-minute ECC explainer.' },
  ],
  lattice: [
    { id: '_A7oqoMFIiA', title: 'Silicon & diamond unit cell atomic model, wafer/crystal orientation, Miller indices (100) (111)', channel: 'Gray Chang', min: 7, why: 'The diamond-cubic silicon lattice and wafer orientation.' },
    { id: 'PbInpbDUBbU', title: 'Unit Cell of Silicon Crystal Lattice #diamond', channel: 'Bingsen Wang', min: 1, why: 'Twenty-second rotating unit cell of silicon.' },
  ],
  electron: [
    { id: 'nJsRUju_dQc', title: 'What is a Semiconductor? | Band Gap, Doping & How Semiconductors work', channel: 'Engineeringness', min: 6, why: 'Band gap, electrons and holes, n- and p-type doping.' },
    { id: 'IcrBqCFLHIY', title: 'How Does a Transistor Work?', channel: 'Veritasium', min: 6, why: 'Doped silicon and the transistor switch, physically explained.' },
  ],
  tunneling: [
    { id: 'rtI5wRyHpTg', title: 'Transistors & The End of Moore\'s Law', channel: '2veritasium', min: 9, why: 'Quantum tunneling as the physical limit of shrinking transistors.' },
    { id: 'sbXie768ZZQ', title: 'Have we reached the limit of computer power? - Sajan Saini and George Zaidan', channel: 'TED-Ed', min: 5, why: 'Animated summary of the end of Moore\'s law.' },
  ],
  dennard: [
    { id: '7p8ZeSbblec', title: 'The End of Dennard Scaling', channel: 'Asianometry', min: 16, why: 'Why clock speeds stopped rising around 2005.' },
  ],
  alexnet: [
    { id: 'UZDiGooFs54', title: 'The moment we stopped understanding AI [AlexNet]', channel: 'Welch Labs', min: 18, why: 'AlexNet and the 2012 GPU moment that made NVIDIA an AI company.' },
  ],
  keynote: [
    { id: '_waPvOwL9Z8', title: 'GTC March 2025 Keynote with NVIDIA CEO Jensen Huang', channel: 'NVIDIA', min: 132, why: 'Full keynote: Blackwell, NVL72, robotics and physical AI.' },
  ],
};
