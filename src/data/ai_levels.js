// AI 모델 경쟁 테마: 알파고(2016) → 딥러닝·AlexNet → 트랜스포머(2017) → GPT·ChatGPT → 클로드·정렬 → LLM 경쟁 → 한국·HBM
// 연도·수치 출처: docs/research/07_ai_race_facts.md (논문·공식 발표). chapter: 'ai'. 인물 NPC 는 src/data/people_ai.js 의 areas 로 배치된다.
const F = 0xffd166, C = 0x5ee0ff, NV = 0x76b900, CU = 0xd08a3c;
const NEXT = { ko: '다음 스테이지', en: 'NEXT STAGE' };

export const AI_LEVELS = [
  {
    id: 'A1', chapter: 'ai', name: { ko: '알파고 대 이세돌', en: 'ALPHAGO vs LEE SEDOL' }, subtitle: { ko: '2016년 3월 · 서울 포시즌스 · 4 : 1', en: 'March 2016 · Seoul · 4 : 1' },
    size: 44, groundType: 'grid', palette: { sky: 0x1a1408, fog: 0x1e1810, ground: '#3a2a14', groundLine: 'rgba(20,10,0,0.45)', groundLine2: 'rgba(0,0,0,0.1)', hemiSky: 0xffe0b0, hemiGround: 0x1a1408, accent: F, dust: 0xffe0b0 }, fogDensity: 0.008, sunIntensity: 1.8, ambient: 'silence',
    terms: ['alphago', 'deeplearning'], gate: { pos: [0, -36], required: 2, label: NEXT }, spawn: [0, 36],
    narration: [
      { ko: '2016년 3월, 서울. 바둑판 앞에 이세돌 9단이 앉았고, 맞은편엔 알파고를 대신해 돌을 놓는 아자 황이 앉았어. 다섯 판 중 네 판을 기계가 이겼지.', en: 'March 2016, Seoul. Lee Sedol sat at the board; across from him, Aja Huang placed stones for AlphaGo. The machine won four games of five.' },
      { ko: '2국 37수. 인간 기사라면 만 번에 한 번 둘까 말까 한 수였어. 그리고 4국 78수, 이세돌이 알파고를 이긴 단 한 판의 신의 한 수.', en: 'Game 2, Move 37: a move a human would play maybe one time in ten thousand. Then game 4, Move 78: Lee Sedol\'s one winning "hand of God".' },
      { ko: '이 기계는 신경망 두 개와 트리 탐색, 그리고 GPU 176장으로 돌아갔어. 여기서 이야기가 시작돼.', en: 'The machine ran on two neural networks, tree search and 176 GPUs. This is where the story begins.' },
    ],
    objective: { ko: '37수와 78수 자리를 찾고, 알파고 서버를 살펴보라', en: 'Find Move 37 and Move 78, then inspect AlphaGo\'s servers' },
    structures: (g) => {
      const s = []; const B = 30;
      s.push({ type: 'box', pos: [0, 0], size: [B, 0.6, B], color: 0xd9b36b, mat: { rough: 0.8 }, edges: 0x5a3a14, solid: false });
      for (let i = 0; i < 19; i++) { s.push({ type: 'box', pos: [(i - 9) * (B / 19), 0], y: 0.6, size: [0.06, 0.02, B], color: 0x2a1a08, solid: false }); s.push({ type: 'box', pos: [0, (i - 9) * (B / 19)], y: 0.6, size: [B, 0.02, 0.06], color: 0x2a1a08, solid: false }); }
      const st = B / 19; const stones = [[3, 3, 'b'], [15, 15, 'w'], [15, 3, 'b'], [3, 15, 'w'], [9, 9, 'b'], [14, 9, 'w'], [4, 9, 'b'], [9, 14, 'w'], [9, 4, 'b'], [16, 10, 'w'], [2, 8, 'b'], [10, 16, 'w']];
      for (const [x, y, c] of stones) s.push({ type: 'cylinder', pos: [(x - 9) * st, (y - 9) * st], y: 0.6, size: [0.62, 0.3], color: c === 'b' ? 0x111111 : 0xf4f1ea, mat: { rough: 0.3, metal: 0.1 }, seg: 24, solid: false });
      s.push({ type: 'cylinder', pos: [(10 - 9) * st, (5 - 9) * st], y: 0.6, size: [0.62, 0.3], color: 0x111111, mat: { rough: 0.3, emissive: 0x76b900, ei: 0.8 }, seg: 24, term: 'alphago', label: { ko: '2국 37수 · 알파고 (백)', en: 'GAME 2 · MOVE 37 · ALPHAGO' }, triggerR: 5 });
      s.push({ type: 'cylinder', pos: [(4 - 9) * st, (10 - 9) * st], y: 0.6, size: [0.62, 0.3], color: 0xf4f1ea, mat: { rough: 0.3, emissive: 0xffd166, ei: 0.9 }, seg: 24, label: { ko: '4국 78수 · 이세돌 (백) · 신의 한 수', en: 'GAME 4 · MOVE 78 · LEE SEDOL' } });
      s.push({ type: 'panel', pos: [0, 24], size: [16, 5], label: { ko: '알파고 4 : 1 이세돌 · 2016.03.09~15', en: 'ALPHAGO 4 : 1 LEE SEDOL · MAR 9–15, 2016' } });
      s.push({ type: 'row', pos: [-30, -14], size: [3, 6, 2], count: 8, perRow: 4, gap: 0.6, color: 0x151a22, glow: 0x0a2a10, term: 'deeplearning', label: { ko: '분산 알파고 · CPU 1,202 · GPU 176', en: 'DISTRIBUTED ALPHAGO · 1,202 CPUs · 176 GPUs' }, triggerR: 10 });
      s.push({ type: 'panel', pos: [30, -14], size: [14, 5], label: { ko: '정책망 + 가치망 + 몬테카를로 트리 탐색', en: 'POLICY NET + VALUE NET + MCTS' } });
      s.push({ type: 'path', pos: [0, 0], path: [[0, 36], [2, -6], [-8, 2], [0, -32]], color: F, radius: 0.15 });
      return s;
    },
    logos: [{ pos: [-22, 30], brand: 'Google DeepMind', country: 'GB', color: '#1a73e8', role: { ko: '알파고 개발 · 런던', en: 'Built AlphaGo · London' } }, { pos: [22, 30], brand: 'Korea Baduk Association', country: 'KR', color: '#3a2a14', role: { ko: '한국기원 · 대국 주최', en: 'Korea Baduk Association · match host' } }],
    packetLabel: { ko: '한 수 (탐색 트리)', en: 'ONE MOVE (SEARCH TREE)' },
  },
  {
    id: 'A2', chapter: 'ai', name: { ko: '딥러닝의 시대 · AlexNet', en: 'DEEP LEARNING · ALEXNET' }, subtitle: { ko: '2012 ImageNet · GTX 580 2장 · 오차 15.3%', en: '2012 ImageNet · two GTX 580s · 15.3% error' },
    size: 44, groundType: 'floor', palette: { sky: 0x0a1020, fog: 0x0c1428, ground: '#121a2c', groundLine: 'rgba(94,224,255,0.1)', pad: 'rgba(118,185,0,0.3)', hemiSky: 0xa0c8ff, hemiGround: 0x0a1020, accent: NV, dust: 0x76b900 }, fogDensity: 0.009, sunIntensity: 1.5, ambient: 'fan',
    terms: ['deeplearning', 'cudacore', 'tensorcore'], gate: { pos: [0, -36], required: 2, label: NEXT }, spawn: [0, 36],
    narration: [
      { ko: '알파고보다 4년 전. 2012년, 토론토 대학의 학생 알렉스 크리제브스키가 게임용 그래픽카드 두 장으로 신경망을 학습시켜 이미지 인식 대회를 압도했어. 오차 15.3%, 2위와 10%포인트 차이.', en: 'Four years before AlphaGo. In 2012 a Toronto student, Alex Krizhevsky, trained a neural network on two gaming graphics cards and crushed the ImageNet contest: 15.3% error, ten points ahead of second place.' },
      { ko: '그날부터 GPU는 그림을 그리는 칩이 아니라 학습하는 칩이 됐어. 곱하고 더하기를 수십억 번, 동시에.', en: 'From that day the GPU was no longer a chip for drawing pictures but a chip for learning: billions of multiply-adds, all at once.' },
    ],
    objective: { ko: 'GTX 580 두 장과 ResNet 탑을 살펴보라', en: 'Inspect the two GTX 580s and the ResNet tower' },
    structures: (g) => [
      { type: 'box', pos: [-14, 0], size: [12, 1.2, 5], color: 0x123a1a, edges: 0xc9a24a, term: 'deeplearning', label: { ko: 'GeForce GTX 580 × 2 · 3 GB · AlexNet 학습 5~6일', en: 'GEFORCE GTX 580 × 2 · 3 GB · ALEXNET TRAINED 5–6 DAYS' }, triggerR: 10 },
      { type: 'box', pos: [-14, 8], size: [12, 1.2, 5], color: 0x123a1a, edges: 0xc9a24a },
      { type: 'row', pos: [14, 0], size: [2.4, 2.4, 0.3], count: 24, perRow: 6, gap: 0.4, color: 0x2a3a5a, glow: 0x102040, solid: false, label: { ko: 'ImageNet · 사진 120만 장 · 1,000 분류', en: 'IMAGENET · 1.2M IMAGES · 1,000 CLASSES' } },
      { type: 'tower', pos: [0, -16], size: [6, 20, 6], layers: 38, color: 0x2b4a6a, gapColor: C, term: 'cudacore', label: { ko: 'ResNet-152 (2015) · 152층 · 오차 3.57%', en: 'RESNET-152 (2015) · 152 LAYERS · 3.57% ERROR' }, triggerR: 9 },
      { type: 'panel', pos: [-28, -20], size: [12, 5], term: 'tensorcore', label: { ko: '합성곱 = 행렬곱 → 텐서 코어 (2017 Volta)', en: 'CONVOLUTION = MATMUL → TENSOR CORES (VOLTA 2017)' }, triggerR: 8 },
      { type: 'path', pos: [0, 0], path: [[0, 36], [-14, 4], [14, 0], [0, -30]], color: F, radius: 0.15 },
    ],
    logos: [{ pos: [-30, 24], brand: 'University of Toronto', country: 'CA', color: '#002a5c', role: { ko: '힌턴 연구실 · AlexNet', en: 'Hinton\'s lab · AlexNet' } }, { pos: [30, 24], brand: 'NVIDIA', country: 'US', color: '#76b900', textColor: '#061000', role: { ko: 'CUDA (2007) · GPU 범용 계산', en: 'CUDA (2007) · general-purpose GPU compute' } }],
  },
  {
    id: 'A3', chapter: 'ai', name: { ko: '트랜스포머 · 어텐션', en: 'TRANSFORMER · ATTENTION' }, subtitle: { ko: '2017 · "Attention Is All You Need" · 구글', en: '2017 · "Attention Is All You Need" · Google' },
    size: 46, groundType: 'grid', palette: { sky: 0x08081a, fog: 0x0a0a22, ground: '#12122c', groundLine: 'rgba(195,177,255,0.3)', groundLine2: 'rgba(195,177,255,0.06)', hemiSky: 0xc3b1ff, hemiGround: 0x08081a, accent: 0xc3b1ff, dust: 0xc3b1ff }, fogDensity: 0.009, sunIntensity: 1.5, ambient: 'clock', ceiling: 18,
    terms: ['transformer', 'attention', 'tensorcore'], gate: { pos: [0, -38], required: 2, label: NEXT }, spawn: [0, 38],
    narration: [
      { ko: '2017년 6월, 구글의 연구자 여덟 명이 논문 하나를 냈어. 제목은 "어텐션만 있으면 된다". 문장의 모든 단어가 서로를 동시에 바라보는 구조, 트랜스포머.', en: 'June 2017: eight Google researchers published a paper titled "Attention Is All You Need". A structure where every word looks at every other word at once: the Transformer.' },
      { ko: '순서대로 읽지 않으니 한꺼번에 계산할 수 있고, 그 계산은 전부 행렬곱이야. GPU와 텐서 코어가 기다리던 바로 그 일. GPT도 클로드도 제미나이도 이 구조 위에 서 있어.', en: 'No sequential reading means everything computes in parallel, and it is all matrix multiplies, exactly what GPUs and Tensor Cores were waiting for. GPT, Claude and Gemini all stand on this.' },
    ],
    objective: { ko: '어텐션 격자를 걷고 Q·K·V 기둥을 살펴보라', en: 'Walk the attention grid and inspect the Q, K, V pillars' },
    structures: (g) => [
      { type: 'row', pos: [0, 6], size: [1.8, 0.3, 1.8], count: 64, perRow: 8, gap: 0.5, color: 0x3a2a6a, glow: 0x6a4aff, solid: false, term: 'attention', label: { ko: '어텐션 행렬 · 토큰 8 × 8 (n²)', en: 'ATTENTION MATRIX · 8 × 8 TOKENS (n²)' }, triggerR: 12 },
      { type: 'cylinder', pos: [-10, -14], size: [1.4, 8], color: 0xffd166, mat: { emissive: 0x805a10, ei: 0.5 }, label: { ko: 'Q · 질문', en: 'Q · QUERY' } },
      { type: 'cylinder', pos: [0, -14], size: [1.4, 8], color: 0x5ee0ff, mat: { emissive: 0x104a5a, ei: 0.5 }, term: 'transformer', label: { ko: 'K · 열쇠', en: 'K · KEY' }, triggerR: 8 },
      { type: 'cylinder', pos: [10, -14], size: [1.4, 8], color: 0xc3b1ff, mat: { emissive: 0x3a2a7a, ei: 0.5 }, label: { ko: 'V · 값', en: 'V · VALUE' } },
      { type: 'panel', pos: [-28, 0], size: [14, 5], label: { ko: '저자 8명 · 2017.06 · arXiv 1706.03762', en: '8 AUTHORS · JUNE 2017 · arXiv 1706.03762' } },
      { type: 'row', pos: [28, 0], size: [3, 5, 2], count: 8, perRow: 4, gap: 0.5, color: 0x151a22, glow: 0x0a2a10, term: 'tensorcore', label: { ko: 'P100 GPU 8장 · 기본 모델 12시간 · 큰 모델 3.5일', en: '8 × P100 GPUs · BASE 12 h · BIG 3.5 DAYS' }, triggerR: 9 },
      { type: 'panel', pos: [0, 26], size: [16, 5], label: { ko: 'BERT (2018) · GPT (2018) · 모두 트랜스포머', en: 'BERT (2018) · GPT (2018) · ALL TRANSFORMERS' } },
      { type: 'path', pos: [0, 0], path: [[0, 38], [0, 6], [-10, -10], [10, -10], [0, -34]], color: F, radius: 0.15 },
    ],
    logos: [{ pos: [-24, -30], brand: 'Google', country: 'US', color: '#4285f4', role: { ko: '트랜스포머 논문 (Google Brain) · TPU', en: 'Transformer paper (Google Brain) · TPU' } }],
    packetLabel: { ko: '토큰', en: 'TOKEN' },
  },
  {
    id: 'A4', chapter: 'ai', name: { ko: 'GPT · 챗GPT', en: 'GPT · CHATGPT' }, subtitle: { ko: 'GPT-1 1.17억 → GPT-3 1,750억 → ChatGPT 2022.11.30', en: 'GPT-1 117M → GPT-3 175B → ChatGPT Nov 30 2022' },
    size: 50, groundType: 'grid', palette: { sky: 0x0a1410, fog: 0x0c1814, ground: '#10201a', groundLine: 'rgba(118,185,0,0.25)', hemiSky: 0xc0ffe0, hemiGround: 0x0a1410, accent: NV, dust: 0x76b900 }, fogDensity: 0.008, sunIntensity: 1.5, ambient: 'hum', ceiling: 26,
    terms: ['gpt', 'chatgpt', 'rlhf'], gate: { pos: [0, -42], required: 3, label: NEXT }, spawn: [0, 42],
    narration: [
      { ko: 'OpenAI는 트랜스포머로 "다음 단어 맞히기"만 시켰어. 2018년 1억 개, 2019년 15억 개, 2020년 1,750억 개 파라미터. 크기가 커지자 가르치지 않은 일까지 예시 몇 개로 해내기 시작했지.', en: 'OpenAI made Transformers do one thing: predict the next word. 117 million parameters in 2018, 1.5 billion in 2019, 175 billion in 2020. With scale came abilities nobody had taught it.' },
      { ko: '2022년 11월 30일, 사람의 피드백으로 대화를 배운 모델이 채팅창 하나로 공개됐어. 두 달 만에 1억 명. GPU 품귀가 시작된 날이야.', en: 'On November 30, 2022 a model taught to chat with human feedback was released as a simple chat box. 100 million users in two months. The day the GPU shortage began.' },
    ],
    objective: { ko: '파라미터 탑 세 개와 RLHF 고리, 1억 명 안내판을 살펴보라', en: 'Inspect the three parameter towers, the RLHF loop and the 100M sign' },
    structures: (g) => [
      { type: 'tower', pos: [-20, -6], size: [5, 3, 5], layers: 3, color: 0x2a5a3a, gapColor: NV, label: { ko: 'GPT-1 (2018) · 1.17억', en: 'GPT-1 (2018) · 117M' } },
      { type: 'tower', pos: [-8, -8], size: [6, 7, 6], layers: 6, color: 0x2a5a3a, gapColor: NV, label: { ko: 'GPT-2 (2019) · 15억', en: 'GPT-2 (2019) · 1.5B' } },
      { type: 'tower', pos: [8, -10], size: [9, 22, 9], layers: 14, color: 0x2a5a3a, gapColor: NV, term: 'gpt', label: { ko: 'GPT-3 (2020) · 1,750억 · 700 GB', en: 'GPT-3 (2020) · 175B · 700 GB' }, triggerR: 12 },
      { type: 'ring', pos: [-26, 16], size: [3, 0.35], color: F, y: 4, term: 'rlhf', label: { ko: 'RLHF · 사람 피드백 → 보상 모델 → 강화학습', en: 'RLHF · HUMAN FEEDBACK → REWARD MODEL → RL' }, triggerR: 8 },
      { type: 'panel', pos: [26, 16], size: [14, 5], term: 'chatgpt', label: { ko: 'ChatGPT · 2022.11.30 · 2개월 만에 1억 명', en: 'CHATGPT · NOV 30 2022 · 100M USERS IN 2 MONTHS' }, triggerR: 9 },
      { type: 'panel', pos: [0, 30], size: [16, 5], label: { ko: 'GPT-4 (2023.03) · GPT-4o (2024) · o1/o3 추론', en: 'GPT-4 (MAR 2023) · GPT-4o (2024) · o1/o3 REASONING' } },
      { type: 'row', pos: [24, -24], size: [3, 5, 2], count: 12, perRow: 6, gap: 0.5, color: 0x151a22, glow: 0x0a2a10, label: { ko: 'V100 클러스터 (Microsoft Azure)', en: 'V100 CLUSTER (MICROSOFT AZURE)' } },
      { type: 'path', pos: [0, 0], path: [[0, 42], [-20, 0], [8, -2], [26, 12], [0, -38]], color: F, radius: 0.15 },
    ],
    logos: [{ pos: [-30, -30], brand: 'OpenAI', country: 'US', color: '#111111', role: { ko: 'GPT · ChatGPT · 샌프란시스코 (2015 설립)', en: 'GPT · ChatGPT · San Francisco (founded 2015)' } }, { pos: [30, -34], brand: 'Microsoft', country: 'US', color: '#0078d4', role: { ko: 'Azure 슈퍼컴퓨터 · OpenAI 투자', en: 'Azure supercomputer · OpenAI investor' } }],
    packetLabel: { ko: '다음 토큰', en: 'NEXT TOKEN' },
  },
  {
    id: 'A5', chapter: 'ai', name: { ko: '클로드 · 앤트로픽', en: 'CLAUDE · ANTHROPIC' }, subtitle: { ko: '2021 설립 · Constitutional AI · Claude 3 (2024) · Claude 4 (2025)', en: 'Founded 2021 · Constitutional AI · Claude 3 (2024) · Claude 4 (2025)' },
    size: 46, groundType: 'floor', palette: { sky: 0x1a140e, fog: 0x1e1812, ground: '#2a2218', groundLine: 'rgba(255,209,102,0.12)', pad: 'rgba(217,119,87,0.4)', hemiSky: 0xffe8d0, hemiGround: 0x1a140e, accent: 0xd97757, dust: 0xffd7b0 }, fogDensity: 0.008, sunIntensity: 1.6, ambient: 'silence',
    terms: ['claude', 'rlhf', 'reasoning'], gate: { pos: [0, -38], required: 2, label: NEXT }, spawn: [0, 38],
    narration: [
      { ko: '2021년, OpenAI에서 나온 연구자들이 앤트로픽을 세웠어. 목표는 더 큰 모델이 아니라 더 안전한 모델. 규칙 목록, 그러니까 "헌법"을 읽고 스스로 답을 고치는 훈련법을 만들었지.', en: 'In 2021 researchers who left OpenAI founded Anthropic. The goal was not a bigger model but a safer one. They built a training method where the model reads a list of principles, a "constitution", and corrects its own answers.' },
      { ko: '2023년 3월 Claude 1, 2024년 3월 Claude 3 하이쿠·소넷·오퍼스, 2025년 Claude 4. 긴 문맥과 코딩, 그리고 답하기 전에 오래 생각하는 확장 사고.', en: 'Claude 1 in March 2023, Claude 3 Haiku, Sonnet and Opus in March 2024, Claude 4 in 2025. Long context, coding, and extended thinking before answering.' },
    ],
    objective: { ko: '헌법 비석과 Claude 3 세 탑, 확장 사고 방을 살펴보라', en: 'Inspect the constitution stone, the three Claude 3 towers and the thinking room' },
    structures: (g) => [
      { type: 'panel', pos: [0, 12], size: [14, 7], color: 0x2a1a10, glow: 0xd97757, term: 'rlhf', label: { ko: 'Constitutional AI (2022.12) · 원칙으로 스스로 고치기', en: 'CONSTITUTIONAL AI (DEC 2022) · SELF-CORRECTION BY PRINCIPLES' }, triggerR: 10 },
      { type: 'tower', pos: [-16, -8], size: [4, 4, 4], layers: 4, color: 0x5a3a2a, gapColor: 0xd97757, label: { ko: 'Claude 3 Haiku · 빠름', en: 'CLAUDE 3 HAIKU · FAST' } },
      { type: 'tower', pos: [0, -10], size: [5, 9, 5], layers: 7, color: 0x5a3a2a, gapColor: 0xd97757, term: 'claude', label: { ko: 'Claude 3 Sonnet · 균형', en: 'CLAUDE 3 SONNET · BALANCED' }, triggerR: 10 },
      { type: 'tower', pos: [16, -12], size: [6, 15, 6], layers: 10, color: 0x5a3a2a, gapColor: 0xd97757, label: { ko: 'Claude 3 Opus · 최상위', en: 'CLAUDE 3 OPUS · TOP' } },
      { type: 'box', pos: [-26, -26], size: [10, 5, 8], color: 0x2a2018, edges: 0xd97757, term: 'reasoning', label: { ko: '확장 사고 · 답하기 전에 생각의 사슬', en: 'EXTENDED THINKING · CHAIN OF THOUGHT FIRST' }, triggerR: 10 },
      { type: 'panel', pos: [26, -26], size: [12, 5], label: { ko: '긴 문맥 · 코딩 · 컴퓨터 사용 에이전트', en: 'LONG CONTEXT · CODING · COMPUTER-USE AGENTS' } },
      { type: 'path', pos: [0, 0], path: [[0, 38], [0, 14], [-16, -2], [16, -4], [0, -34]], color: F, radius: 0.15 },
    ],
    logos: [{ pos: [-28, 26], brand: 'Anthropic', country: 'US', color: '#d97757', textColor: '#1a0a05', role: { ko: 'Claude · AI 안전 연구 · 샌프란시스코', en: 'Claude · AI safety research · San Francisco' } }],
    packetLabel: { ko: '생각의 사슬', en: 'CHAIN OF THOUGHT' },
  },
  {
    id: 'A6', chapter: 'ai', name: { ko: 'LLM 경쟁 · 스케일링', en: 'THE LLM RACE · SCALING' }, subtitle: { ko: 'GPT · Claude · Gemini · Llama · Grok · DeepSeek · 10만 GPU', en: 'GPT · Claude · Gemini · Llama · Grok · DeepSeek · 100k GPUs' },
    size: 56, groundType: 'grid', palette: { sky: 0x06101c, fog: 0x081426, ground: '#0e1826', groundLine: 'rgba(94,224,255,0.2)', hemiSky: 0x9fb7d9, hemiGround: 0x06101c, accent: C, dust: 0x5ee0ff }, fogDensity: 0.008, sunIntensity: 1.5, ambient: 'fan', ceiling: 30,
    terms: ['airace', 'scaling', 'opensource', 'reasoning'], gate: { pos: [0, -48], required: 3, label: NEXT }, spawn: [0, 48],
    narration: [
      { ko: '경기장이야. OpenAI, 앤트로픽, 구글 제미나이, 메타 라마, xAI 그록, 딥시크, 미스트랄. 몇 달마다 신기록. 연료는 데이터와 GPU.', en: 'The arena. OpenAI, Anthropic, Google Gemini, Meta Llama, xAI Grok, DeepSeek, Mistral. New records every few months. The fuel is data and GPUs.' },
      { ko: '스케일링 법칙이 말해 줬어. 모델과 데이터와 연산을 함께 키우면 성능이 예측 가능하게 오른다고. 그래서 H100 10만 장짜리 클러스터가 생겼지. 그리고 2025년 1월, 딥시크가 훨씬 싸게 했다고 발표하자 시장이 흔들렸어.', en: 'Scaling laws said performance rises predictably with model, data and compute together. So 100,000-H100 clusters were built. Then in January 2025 DeepSeek claimed to do it far cheaper, and the market shook.' },
    ],
    objective: { ko: '경쟁 모델 탑들, 스케일링 경사로, 10만 GPU 랙을 살펴보라', en: 'Inspect the model towers, the scaling ramp and the 100k-GPU racks' },
    structures: (g) => {
      const s = []; const models = [['GPT-4 / o3', 'OpenAI', 0x111111, 18], ['Claude 4', 'Anthropic', 0xd97757, 17], ['Gemini 2', 'Google', 0x4285f4, 17], ['Llama 3.1 405B', 'Meta', 0x0866ff, 15], ['Grok', 'xAI', 0x222222, 14], ['DeepSeek R1', 'DeepSeek', 0x4d6bfe, 13], ['Mistral', 'Mistral', 0xff7000, 10]];
      models.forEach(([m, co, col, h], i) => { const x = (i - 3) * 12; s.push({ type: 'tower', pos: [x, -12], size: [5, h, 5], layers: Math.round(h / 1.6), color: 0x1a2436, gapColor: col, term: i === 0 ? 'airace' : (i === 5 ? 'opensource' : undefined), label: { ko: `${m} · ${co}`, en: `${m} · ${co}` }, labelScale: 0.8, triggerR: 8 }); });
      s.push({ type: 'path', pos: [0, 0], path: [[-40, 20, 0.2], [-20, 18, 2], [0, 16, 4.5], [20, 14, 8], [40, 12, 12]], color: NV, radius: 0.25 });
      s.push({ type: 'panel', pos: [-30, 24], size: [14, 5], term: 'scaling', label: { ko: '스케일링 법칙 · 모델·데이터·연산 ↑ → 손실 ↓ (거듭제곱)', en: 'SCALING LAWS · MODEL, DATA, COMPUTE ↑ → LOSS ↓ (POWER LAW)' }, triggerR: 10 });
      s.push({ type: 'row', pos: [30, 26], size: [1.6, 3.4, 1.0], count: 36, perRow: 12, gap: 0.5, color: 0x151a22, glow: 0x0a2a10, solid: false, term: 'reasoning', label: { ko: 'Colossus · H100 100,000장 · 122일 (xAI, 2024)', en: 'COLOSSUS · 100,000 H100s · 122 DAYS (xAI, 2024)' }, triggerR: 12 });
      s.push({ type: 'panel', pos: [0, 36], size: [16, 5], label: { ko: 'Llama 3.1 405B · H100 16,384장 · 54일', en: 'LLAMA 3.1 405B · 16,384 H100s · 54 DAYS' } });
      s.push({ type: 'path', pos: [0, 0], path: [[0, 48], [-30, 20], [30, 22], [0, -44]], color: F, radius: 0.15 });
      return s;
    },
    logos: [{ pos: [-48, -34], brand: 'Google DeepMind', country: 'US', color: '#1a73e8', role: { ko: 'Gemini (2023.12~)', en: 'Gemini (Dec 2023–)' } }, { pos: [-16, -40], brand: 'Meta', country: 'US', color: '#0866ff', role: { ko: 'Llama 오픈 가중치', en: 'Llama open weights' } }, { pos: [16, -40], brand: 'xAI', country: 'US', color: '#111111', role: { ko: 'Grok · Colossus 멤피스', en: 'Grok · Colossus, Memphis' } }, { pos: [48, -34], brand: 'DeepSeek', country: 'CN', color: '#4d6bfe', role: { ko: 'DeepSeek V3 / R1 · 항저우', en: 'DeepSeek V3 / R1 · Hangzhou' } }],
    packetLabel: { ko: '벤치마크 점수', en: 'BENCHMARK SCORE' },
  },
  {
    id: 'A7', chapter: 'ai', name: { ko: '한국 · HBM과 AI', en: 'KOREA · HBM & AI' }, subtitle: { ko: 'SK하이닉스 · 삼성전자 · 국가 AI 컴퓨팅 · 네이버·LG', en: 'SK hynix · Samsung · national AI computing · Naver, LG' },
    size: 50, groundType: 'floor', palette: { sky: 0x0a1020, fog: 0x0e1628, ground: '#141c2c', groundLine: 'rgba(94,224,255,0.12)', pad: 'rgba(234,0,44,0.3)', hemiSky: 0xa0c8ff, hemiGround: 0x0a1020, accent: 0xea002c, dust: 0x5ee0ff }, fogDensity: 0.009, sunIntensity: 1.5, ambient: 'hum',
    terms: ['koreaai', 'hbm', 'tsv', 'airace'], gate: { pos: [0, -42], required: 3, label: { ko: '끝 · GPU 속으로 이어진다', en: 'THE END · CONTINUES INSIDE THE GPU' } }, spawn: [0, 42],
    narration: [
      { ko: '경주의 타이어 가게가 가장 바쁜 법이지. AI 붐의 병목은 메모리야. H100 한 장에 HBM 다이 48장. SK하이닉스가 그 대부분을 NVIDIA에 대고, 삼성과 마이크론이 뒤를 쫓아.', en: 'In a race the tire shop is the busiest. The AI boom\'s bottleneck is memory: 48 HBM dies in every H100. SK hynix supplies most of them to NVIDIA, with Samsung and Micron chasing.' },
      { ko: '그리고 한국은 GPU와 데이터센터를 사고, 네이버·LG·업스테이지가 자기 모델을 만들어. 이 이야기의 다음 장은 GPU 속이야. 테마를 바꿔 내려가 봐.', en: 'And Korea buys GPUs and data centers while Naver, LG and Upstage build their own models. The next chapter of this story is inside the GPU. Switch theme and descend.' },
    ],
    objective: { ko: 'HBM 탑과 한국 AI 안내판을 살펴보라', en: 'Inspect the HBM tower and the Korean AI signs' },
    structures: (g) => [
      { type: 'tower', pos: [-16, -8], size: [8, 14, 8], layers: 12, color: 0x2b4a6a, gapColor: C, pillars: CU, term: 'hbm', label: { ko: 'HBM3E 12-Hi · SK하이닉스 → NVIDIA', en: 'HBM3E 12-Hi · SK HYNIX → NVIDIA' }, triggerR: 11 },
      { type: 'tower', pos: [16, -8], size: [8, 12, 8], layers: 8, color: 0x2b4a6a, gapColor: 0x1428a0, term: 'tsv', label: { ko: 'HBM3E · 삼성전자 · 마이크론', en: 'HBM3E · SAMSUNG · MICRON' }, triggerR: 11 },
      { type: 'row', pos: [0, 16], size: [3, 6, 2], count: 12, perRow: 6, gap: 0.5, color: 0x151a22, glow: 0x0a2a10, term: 'koreaai', label: { ko: '국가 AI 컴퓨팅 센터 · GPU 클러스터', en: 'NATIONAL AI COMPUTING CENTER · GPU CLUSTER' }, triggerR: 10 },
      { type: 'panel', pos: [-30, 20], size: [12, 5], label: { ko: 'HyperCLOVA X (네이버) · EXAONE (LG) · Solar (업스테이지)', en: 'HYPERCLOVA X (NAVER) · EXAONE (LG) · SOLAR (UPSTAGE)' } },
      { type: 'panel', pos: [30, 20], size: [12, 5], term: 'airace', label: { ko: 'H100 1장 = HBM3 다이 48장 + GPU 다이 1장', en: '1 H100 = 48 HBM3 DIES + 1 GPU DIE' }, triggerR: 8 },
      { type: 'path', pos: [0, 0], path: [[0, 42], [-16, 4], [16, 2], [0, 14], [0, -38]], color: F, radius: 0.15 },
    ],
    logos: [{ pos: [-34, -30], brand: 'SK hynix', country: 'KR', color: '#ea002c', role: { ko: 'HBM 1위 · 이천·청주', en: '#1 in HBM · Icheon, Cheongju' } }, { pos: [0, -30], brand: 'SAMSUNG', country: 'KR', color: '#1428a0', role: { ko: 'HBM · 파운드리 · 평택', en: 'HBM · foundry · Pyeongtaek' } }, { pos: [34, -30], brand: 'NAVER', country: 'KR', color: '#03c75a', textColor: '#062010', role: { ko: 'HyperCLOVA X · 세종 데이터센터', en: 'HyperCLOVA X · Sejong data center' } }],
    packetLabel: { ko: 'HBM 출하', en: 'HBM SHIPMENT' },
  },
];

// AI 테마 간판을 클릭했을 때 보여 줄 회사·기관 정보 (홈페이지는 공식 주소)
export const COMPANIES_AI = {
  'Google DeepMind': { name: 'Google DeepMind', country: 'GB', founded: 2010, hq: '런던, 영국 / London, UK', desc: { ko: '2010년 런던에서 설립된 AI 연구소로 2014년 구글에 인수됐다. 2016년 알파고로 이세돌 9단을 4대 1로 이겼고, 이후 단백질 구조를 예측한 알파폴드와 대규모 언어 모델 제미나이를 만든다.', en: 'AI lab founded in London in 2010 and acquired by Google in 2014. AlphaGo beat Lee Sedol 4–1 in 2016; the lab later built AlphaFold for protein structure and the Gemini language models.' }, url: 'https://deepmind.google/', wiki: 'https://en.wikipedia.org/wiki/Google_DeepMind' },
  'Korea Baduk Association': { name: '한국기원 (Korea Baduk Association)', country: 'KR', founded: 1945, hq: '서울, 대한민국 / Seoul, Korea', desc: { ko: '대한민국 바둑을 총괄하는 기관으로 프로기사 제도를 운영한다. 2016년 알파고와 이세돌 9단의 다섯 판 대국이 서울에서 열렸다.', en: 'The governing body of Go in Korea, which runs the professional player system. The five AlphaGo vs Lee Sedol games were held in Seoul in 2016.' }, url: 'https://www.baduk.or.kr/', wiki: 'https://en.wikipedia.org/wiki/Korea_Baduk_Association' },
  'University of Toronto': { name: 'University of Toronto', country: 'CA', founded: 1827, hq: '토론토, 캐나다 / Toronto, Canada', desc: { ko: '제프리 힌턴 교수의 연구실에서 2012년 AlexNet이 나왔다. 알렉스 크리제브스키와 일리야 수츠케버가 게임용 GPU 두 장으로 학습시켜 ImageNet 대회를 압도했고, 딥러닝 시대가 열렸다.', en: 'Geoffrey Hinton\'s lab produced AlexNet in 2012. Alex Krizhevsky and Ilya Sutskever trained it on two gaming GPUs and dominated ImageNet, opening the deep learning era.' }, url: 'https://www.utoronto.ca/', wiki: 'https://en.wikipedia.org/wiki/University_of_Toronto' },
  'Google': { name: 'Google (Alphabet)', country: 'US', founded: 1998, hq: '마운틴뷰, 미국 / Mountain View, USA', desc: { ko: '2017년 구글 연구자 8명이 트랜스포머 논문 "Attention Is All You Need"를 발표해 오늘날 모든 대규모 언어 모델의 뼈대를 만들었다. 자체 AI 칩 TPU도 개발한다.', en: 'In 2017 eight Google researchers published the Transformer paper "Attention Is All You Need", the backbone of every modern large language model. Google also builds its own AI chip, the TPU.' }, url: 'https://ai.google/', wiki: 'https://en.wikipedia.org/wiki/Google' },
  'OpenAI': { name: 'OpenAI', country: 'US', founded: 2015, hq: '샌프란시스코, 미국 / San Francisco, USA', desc: { ko: '2015년 설립된 AI 연구 기업. GPT 계열 모델을 만들었고 2022년 11월 30일 ChatGPT를 공개해 두 달 만에 사용자 1억 명을 모았다. 이 일이 오늘의 GPU 수요를 만들었다.', en: 'AI research company founded in 2015. It built the GPT models and released ChatGPT on November 30, 2022, reaching 100 million users in two months and creating today\'s GPU demand.' }, url: 'https://openai.com/', wiki: 'https://en.wikipedia.org/wiki/OpenAI' },
  'Microsoft': { name: 'Microsoft', country: 'US', founded: 1975, hq: '레드먼드, 미국 / Redmond, USA', desc: { ko: 'OpenAI에 대규모 투자를 하고 Azure 클라우드에 전용 슈퍼컴퓨터를 지어 GPT 학습을 지원했다. 자체 AI 가속기 Maia도 개발한다.', en: 'Invested heavily in OpenAI and built a dedicated Azure supercomputer to train GPT models. It also develops its own AI accelerator, Maia.' }, url: 'https://azure.microsoft.com/en-us/solutions/high-performance-computing/ai-infrastructure', wiki: 'https://en.wikipedia.org/wiki/Microsoft' },
  'Anthropic': { name: 'Anthropic', country: 'US', founded: 2021, hq: '샌프란시스코, 미국 / San Francisco, USA', desc: { ko: '2021년 다리오·다니엘라 아모데이를 비롯한 전 OpenAI 연구자들이 세운 AI 안전 연구 기업. 원칙 목록을 읽고 스스로 답을 고치는 Constitutional AI 기법을 만들었고 Claude 모델을 개발한다.', en: 'AI safety company founded in 2021 by former OpenAI researchers including Dario and Daniela Amodei. It created Constitutional AI, where the model critiques itself against written principles, and develops the Claude models.' }, url: 'https://www.anthropic.com/', wiki: 'https://en.wikipedia.org/wiki/Anthropic' },
  'Meta': { name: 'Meta (Facebook)', country: 'US', founded: 2004, hq: '멘로파크, 미국 / Menlo Park, USA', desc: { ko: 'Llama 계열 모델의 가중치를 공개해 누구나 내려받아 돌릴 수 있게 했다. Llama 3.1 405B는 H100 16,384장으로 54일간 학습했다.', en: 'Releases the weights of its Llama models so anyone can download and run them. Llama 3.1 405B was trained on 16,384 H100 GPUs over 54 days.' }, url: 'https://ai.meta.com/', wiki: 'https://en.wikipedia.org/wiki/Meta_AI' },
  'xAI': { name: 'xAI', country: 'US', founded: 2023, hq: '샌프란시스코·멤피스, 미국 / San Francisco & Memphis, USA', desc: { ko: '2023년 일론 머스크가 세운 AI 기업으로 Grok 모델을 만든다. 멤피스에 지은 Colossus 클러스터는 H100 10만 장을 122일 만에 세웠다고 발표했다.', en: 'AI company founded by Elon Musk in 2023, maker of the Grok models. Its Colossus cluster in Memphis was announced as 100,000 H100 GPUs built in 122 days.' }, url: 'https://x.ai/', wiki: 'https://en.wikipedia.org/wiki/XAI_(company)' },
  'DeepSeek': { name: 'DeepSeek (深度求索)', country: 'CN', founded: 2023, hq: '항저우, 중국 / Hangzhou, China', desc: { ko: '량원펑이 이끄는 중국 AI 기업. 2025년 1월 공개한 R1은 강화학습으로 추론 능력을 키운 오픈 가중치 모델로, 낮은 학습 비용 주장과 함께 세계 증시를 흔들었다.', en: 'Chinese AI company led by Liang Wenfeng. Its R1 model, released in January 2025, is an open-weights reasoning model trained with reinforcement learning; its low-cost training claim shook global markets.' }, url: 'https://www.deepseek.com/', wiki: 'https://en.wikipedia.org/wiki/DeepSeek' },
  'NAVER': { name: 'NAVER', country: 'KR', founded: 1999, hq: '성남, 대한민국 / Seongnam, Korea', desc: { ko: '한국 최대 인터넷 기업으로 한국어 중심 대규모 언어 모델 HyperCLOVA X를 만든다. 세종에 대규모 데이터센터 각(閣)을 운영한다.', en: 'Korea\'s largest internet company and maker of HyperCLOVA X, a large language model centred on Korean. It operates the large Gak data center in Sejong.' }, url: 'https://clova.ai/hyperclova', wiki: 'https://en.wikipedia.org/wiki/Naver' },
};
