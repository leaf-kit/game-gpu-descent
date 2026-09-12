// 상황 대사: 층마다 다른 말이 나오도록 모아 둔 표. 그 층에서 실제로 일어날 법한 일로 쓴다.
// HURT: 빌런(소프트 에러)의 탄에 맞았을 때, KILL: 빌런을 제거했을 때.

/** 층별 피격 대사. 없으면 챕터 기본값, 그것도 없으면 공통을 쓴다. */
export const HURT = {
  // ---- 프롤로그: 공장 ----
  P1: [{ ko: '돌가루가 눈에 들어왔다! 잠깐 멈춰 선다', en: 'Rock dust in your eyes! You stop for a moment' },
       { ko: '광석 더미가 무너졌다! 발이 미끄러진다', en: 'The ore pile slid! Your footing goes' }],
  P2: [{ ko: '출탕구에서 불티가 튀었다! 뒤로 물러선다', en: 'Sparks from the tap hole! You back off' },
       { ko: '아크로의 열기에 밀렸다! 숨이 막힌다', en: 'The furnace heat pushes you back' }],
  P3: [{ ko: '증류탑 밸브에서 김이 샜다! 시야가 흐려진다', en: 'Steam from a valve! Your view blurs' },
       { ko: '도가니가 출렁였다! 결정이 흔들린다', en: 'The crucible sloshed! The crystal wobbles' }],
  P4: [{ ko: '웨이퍼에 금이 갔다! 한 장을 버린다', en: 'A wafer cracked! One is scrapped' },
       { ko: '슬러리에 미끄러졌다! 중심을 잃는다', en: 'You slipped on the slurry' }],
  P5: [{ ko: '먼지 한 톨이 들어왔다! 이 층 회로가 망가진다', en: 'One dust particle got in! That layer is ruined' },
       { ko: '레지스트가 빛을 먼저 먹었다! 패턴이 뭉갠다', en: 'The resist caught stray light! The pattern smears' }],
  P6: [{ ko: '주석 방울에 맞았다! 거울이 오염된다', en: 'Hit by a tin droplet! The mirror gets contaminated' },
       { ko: '플라즈마 섬광에 눈이 멀었다! 잠시 앞이 안 보인다', en: 'The plasma flash blinds you for a moment' }],
  P7: [{ ko: '프로브 바늘에 찔렸다! 접촉이 어긋난다', en: 'A probe needle jabbed you! Contact slips' },
       { ko: '다이싱 톱이 스쳤다! 스크라이브 라인을 벗어난다', en: 'The dicing blade grazed you, off the scribe line' }],
  P8: [{ ko: 'TSV 구리가 터졌다! 층 사이가 끊긴다', en: 'A copper TSV burst! The floors lose contact' },
       { ko: '다이가 너무 얇아 휘었다! 적층이 어긋난다', en: 'The thinned die warped! The stack misaligns' }],
  P9: [{ ko: '마이크로범프가 떨어졌다! 접합이 어긋난다', en: 'A microbump came loose! The joint misaligns' },
       { ko: '리플로우 열에 밀렸다! 언더필이 흐른다', en: 'Reflow heat pushes you; the underfill runs' }],
  P10: [{ ko: '전원 레일에 감전됐다! 손이 저리다', en: 'Shocked by the power rail! Your hand goes numb' },
        { ko: '솔더가 튀었다! 뒤로 물러선다', en: 'Molten solder splashed! You step back' }],
  // ---- 하강: GPU 내부 ----
  L0: [{ ko: '700 와트의 열기에 밀렸다! 발이 데인다', en: '700 watts of heat push you back' },
       { ko: 'VRM 인덕터가 울렸다! 귀가 멍하다', en: 'A VRM inductor whined! Your ears ring' }],
  L1: [{ ko: '인터포저 배선이 끊겼다! 신호 하나가 사라진다', en: 'An interposer trace broke! One signal is gone' },
       { ko: 'HBM 탑에서 떨어질 뻔했다! 중심을 잃는다', en: 'You nearly fell off the HBM tower' }],
  L2: [{ ko: '크로스바가 막혔다! 데이터가 돌아간다', en: 'The crossbar jammed! Data takes the long way' },
       { ko: '먼 L2 파티션으로 튕겼다! 두 배 느려진다', en: 'Bounced to the far L2 partition: twice as slow' }],
  L3: [{ ko: '비활성 TPC 구역에 빠졌다! 길이 막힌다', en: 'You fell into a disabled TPC: dead end' },
       { ko: '래스터 광장에서 넘어졌다! 픽셀이 흩어진다', en: 'Tripped in the raster plaza; pixels scatter' }],
  L4: [{ ko: '두 SM 사이 틈에 끼였다! 빠져나오느라 늦는다', en: 'Wedged between two SMs; you lose time' }],
  L5: [{ ko: '공유 메모리 뱅크가 충돌했다! 순서가 꼬인다', en: 'A shared-memory bank conflict! Order tangles' },
       { ko: 'TMA 화물에 치였다! 타일이 쏟아진다', en: 'Hit by a TMA cargo! The tile spills' }],
  L6: [{ ko: '스케줄러가 네 차례를 건너뛰었다! 한 박자 쉰다', en: 'The scheduler skipped your turn: one beat lost' },
       { ko: '레지스터가 모자라 값이 밀려났다! 스필이 났다', en: 'Out of registers; values spill to slow memory' }],
  L7: [{ ko: '워프가 갈라졌다! 절반이 멈춰 선다', en: 'The warp diverged! Half the crew stalls' },
       { ko: '레인을 벗어났다! 구령이 어긋난다', en: 'You broke formation; the call goes out of step' }],
  L8: [{ ko: '곱셈기 파이프라인이 멈췄다! 결과가 늦는다', en: 'The multiplier pipeline stalled' },
       { ko: '반올림이 어긋났다! 마지막 자리가 틀린다', en: 'Rounding slipped; the last digit is wrong' }],
  L9: [{ ko: '셀 하나가 뒤집혔다! 0이 1이 됐다', en: 'A cell flipped! A 0 became a 1' },
       { ko: '비트라인 전압차가 사라졌다! 값을 못 읽는다', en: 'The bitline difference vanished; the read fails' }],
  L10: [{ ko: '구리 배선이 끊겼다! 신호가 돌아간다', en: 'A copper wire opened; the signal detours' },
        { ko: '비아에서 미끄러졌다! 아래층으로 떨어질 뻔했다', en: 'You slipped on a via and nearly fell a layer' }],
  L11: [{ ko: '게이트가 반쯤 열렸다! 출력이 애매해진다', en: 'The gate half-opened; the output is ambiguous' },
        { ko: '입력이 흔들렸다! 0인지 1인지 모르겠다', en: 'The input wavered: is it 0 or 1?' }],
  L12: [{ ko: '게이트가 닫혔다! 전자가 갈 길을 잃는다', en: 'The gate shut; the electrons lose their path' },
        { ko: '핀 위에서 미끄러졌다! 채널을 벗어난다', en: 'You slipped off the fin, out of the channel' }],
  L13: [{ ko: '전자가 벽을 그냥 통과했다! 터널링 누설이다', en: 'An electron tunnelled straight through: leakage' },
        { ko: '산화막이 얇아 전하가 샜다! 문턱이 흔들린다', en: 'The thin oxide leaked; the threshold shifts' }],
  L14: [{ ko: '격자가 흔들렸다! 원자 하나가 제자리를 잃는다', en: 'The lattice shook; one atom left its site' },
        { ko: '결합이 하나 끊어졌다! 자리가 빈다', en: 'A bond broke, leaving a vacancy' }],
  // ---- HBM 지선 ----
  H1: [{ ko: '층 사이에서 떨어질 뻔했다! 30 마이크로미터 아래가 아찔하다', en: 'You nearly fell between dies, 30 micrometres down' }],
  H2: [{ ko: '커패시터의 전하가 새 버렸다! 리프레시 전에 값이 사라진다', en: 'The capacitor leaked before refresh; the value is gone' }],
  // ---- AI 테마 ----
  A1: [{ ko: '한 수를 잘못 뒀다! 흐름이 넘어간다', en: 'One bad move and the game turns' },
       { ko: '탐색 트리가 엉켰다! 다음 수가 늦는다', en: 'The search tree tangled; the next move is late' }],
  A2: [{ ko: '기울기가 폭발했다! 학습이 흐트러진다', en: 'The gradients exploded; training wobbles' },
       { ko: '그래픽카드가 뜨거워졌다! 잠시 느려진다', en: 'The card overheated and throttled' }],
  A3: [{ ko: '어텐션이 엉뚱한 곳을 봤다! 문맥이 어긋난다', en: 'Attention looked the wrong way; context slips' },
       { ko: '토큰 순서가 뒤섞였다! 문장이 무너진다', en: 'Token order scrambled; the sentence breaks' }],
  A4: [{ ko: '토큰 하나를 놓쳤다! 문맥이 끊어진다', en: 'You dropped a token; context is cut' },
       { ko: '모델이 헛소리를 했다! 처음부터 다시 말한다', en: 'The model hallucinated; start over' }],
  A5: [{ ko: '원칙과 어긋난 답이 나왔다! 스스로 고쳐 쓴다', en: 'An answer broke the principles; it rewrites itself' },
       { ko: '생각의 사슬이 끊겼다! 처음부터 다시 푼다', en: 'The chain of thought snapped; solve it again' }],
  A6: [{ ko: '클러스터 노드 하나가 죽었다! 학습이 멈춘다', en: 'A cluster node died; training halts' },
       { ko: '경쟁 모델이 앞서 나갔다! 순위가 밀린다', en: 'A rival model pulled ahead' }],
  A7: [{ ko: 'HBM 공급이 밀렸다! 출하가 늦어진다', en: 'HBM supply slipped; shipments are late' },
       { ko: '패키징 라인이 꽉 찼다! 줄을 서야 한다', en: 'The packaging line is full; get in line' }],
};

/** 챕터 기본값 */
export const HURT_CHAPTER = {
  prologue: [{ ko: '공정이 한 번 어긋났다! 다시 줄을 선다', en: 'A process step went wrong; back in line' }],
  descent: [{ ko: '비트가 뒤집혔다! 콤보가 끊어진다', en: 'A bit flipped! Your combo breaks' }],
  hbm: [{ ko: '적층이 흔들렸다! 신호가 끊긴다', en: 'The stack shook; the signal drops' }],
  ai: [{ ko: '추론이 어긋났다! 흐름이 끊어진다', en: 'The inference went wrong; the flow breaks' }],
};

/** 빌런을 제거했을 때 (챕터별) */
export const KILL = {
  prologue: [{ ko: 'ECC가 오류를 잡아냈다 — 이 웨이퍼는 살렸다', en: 'ECC caught the error; this wafer is saved' }],
  descent: [{ ko: 'ECC가 뒤집힌 비트를 되돌렸다 — 계산이 다시 맞는다', en: 'ECC flipped the bit back; the math is right again' }],
  hbm: [{ ko: '사이드밴드 ECC가 정정했다 — 기억이 제자리로', en: 'Sideband ECC corrected it; memory is intact' }],
  ai: [{ ko: '체크포인트에서 복구했다 — 학습이 이어진다', en: 'Recovered from a checkpoint; training continues' }],
};

/** 층 id 와 챕터로 한 줄 고르기 */
export function pickLine(table, chapterTable, id, chapter) {
  const arr = table[id] || chapterTable[chapter] || chapterTable.descent;
  return arr[Math.floor(Math.random() * arr.length)];
}

// 20260913 jwjeong 피격 지식: 빌런의 탄에 맞을 때마다 그 층의 지식을 하나씩 띄운다.
// 아프기만 하고 끝나면 재미가 없어서, 맞는 것을 배우는 계기로 바꿨다. 층마다 세 개씩 두고 순서대로 돌린다.
// 수치는 terms.js 와 같은 출처(NVIDIA 화이트페이퍼, TSMC/ASML/SK hynix 공개 자료)를 따른다.
// 문장을 고칠 때 주의: 여기 숫자가 terms.js 와 어긋나면 같은 화면에서 다른 값이 보인다.
export const HURT_FACT = {
  // ---- 프롤로그: 공장 ----
  P1: [{ ko: '반도체는 <b>모래</b>에서 온다. 다만 아무 모래가 아니라 석영 모래(규사)다', en: 'Chips really do start as <b>sand</b>: quartz sand, not just any sand' },
       { ko: '지각의 <b>28%</b>가 실리콘이다. 산소 다음으로 흔하다', en: 'Silicon is <b>28%</b> of the crust, second only to oxygen' },
       { ko: '석영은 <b>SiO₂</b>. 규소 하나에 산소 둘이 붙어 있다', en: 'Quartz is <b>SiO₂</b>: one silicon, two oxygens' },
       { ko: '반도체용 <b>고순도 석영</b>은 산지가 몇 곳 안 된다. 스프루스 파인이 그중 하나다', en: '<b>High-purity quartz</b> comes from only a few places; Spruce Pine is one' }],
  P2: [{ ko: '아크로에서 <b>SiO₂ + 2C → Si + 2CO</b>. 탄소가 산소를 떼어 간다', en: 'In the arc furnace: <b>SiO₂ + 2C → Si + 2CO</b>. Carbon takes the oxygen' },
       { ko: '여기서 나오는 금속급 실리콘은 순도 <b>98~99%</b>. 아직 한참 멀었다', en: 'Metallurgical silicon leaves here at <b>98–99%</b> purity. A long way to go' },
       { ko: '실리콘 1톤에 전기 <b>11~13 MWh</b>. 제련은 전기를 먹는 공정이다', en: 'About <b>11–13 MWh</b> per tonne. Smelting eats electricity' }],
  P3: [{ ko: '지멘스 공정으로 순도 <b>99.9999999%</b>(9N)까지 올린다', en: 'The Siemens process reaches <b>99.9999999%</b> (9N) purity' },
       { ko: '초크랄스키법: 씨결정을 녹은 실리콘에 담그고 <b>돌리면서 천천히</b> 끌어올린다', en: 'Czochralski: dip a seed crystal and pull it up slowly <b>while rotating</b>' },
       { ko: '잉곳 하나가 수백 킬로그램. 자라는 데 <b>며칠</b>이 걸린다', en: 'One ingot weighs hundreds of kilos and takes <b>days</b> to grow' }],
  P4: [{ ko: '다이아몬드 와이어로 썰면 웨이퍼 두께 <b>775 μm</b>. 종이 여덟 장쯤', en: 'Diamond wire cuts wafers <b>775 μm</b> thick, about eight sheets of paper' },
       { ko: 'CMP 연마 뒤 표면 굴곡은 <b>나노미터</b> 단위. 그래서 거울처럼 보인다', en: 'After CMP the surface varies by <b>nanometres</b>, so it looks like a mirror' },
       { ko: '300 mm 웨이퍼 한 장의 면적은 <b>약 70,700 mm²</b>. 여기서 칩 수십 개가 나온다', en: 'A 300 mm wafer is <b>about 70,700 mm²</b>, enough for dozens of chips' }],
  P5: [{ ko: 'ISO Class 1: 0.1 μm 입자가 세제곱미터당 <b>10개 이하</b>여야 한다', en: 'ISO Class 1 allows <b>10 or fewer</b> 0.1 μm particles per cubic metre' },
       { ko: '조명이 노란 이유는 <b>감광막이 짧은 파장에 반응</b>하기 때문이다', en: 'The light is yellow because <b>photoresist reacts to short wavelengths</b>' },
       { ko: '최신 팹 한 곳 짓는 데 <b>200억 달러</b> 안팎이 든다', en: 'A leading-edge fab costs around <b>$20 billion</b> to build' }],
  P6: [{ ko: 'EUV 파장은 <b>13.5 nm</b>. 공기에도 흡수돼 진공에서만 쓴다', en: 'EUV is <b>13.5 nm</b>; air absorbs it, so it only works in vacuum' },
       { ko: '주석 방울 하나에 레이저를 <b>두 번</b> 쏜다. 납작하게 편 뒤 플라즈마로 만든다', en: 'Each tin droplet is hit <b>twice</b>: flattened, then turned into plasma' },
       { ko: 'EUV 거울을 지구만큼 키워도 <b>요철이 1 mm</b> 남짓이다', en: 'Scale an EUV mirror to Earth size and its bumps stay near <b>1 mm</b>' }],
  P7: [{ ko: '프로브 카드가 웨이퍼를 <b>자르기 전에</b> 전기로 먼저 검사한다', en: 'The probe card tests electrically <b>before</b> the wafer is cut' },
       { ko: '비닝: 같은 설계라도 잘 도는 칩과 덜 도는 칩을 <b>등급으로 나눈다</b>', en: 'Binning <b>sorts</b> identical designs by how fast they actually run' },
       { ko: '절단은 <b>스크라이브 라인</b>이라는 빈 통로를 따라간다. 회로가 없는 자리다', en: 'Dicing follows the <b>scribe lines</b>, empty lanes with no circuitry' }],
  P8: [{ ko: 'HBM3e 는 DRAM 다이를 <b>12층</b>까지 쌓는다', en: 'HBM3e stacks DRAM dies <b>12 high</b>' },
       { ko: '쌓으려면 다이를 <b>30~50 μm</b>까지 갈아 낸다. 머리카락보다 얇다', en: 'Dies are thinned to <b>30–50 μm</b>, thinner than a hair, to stack' },
       { ko: 'TSV 는 다이를 <b>수직으로 관통</b>하는 구리 기둥이다', en: 'A TSV is a copper pillar that goes <b>straight through</b> the die' }],
  P9: [{ ko: 'CoWoS = <b>Chip on Wafer on Substrate</b>. 실리콘 판 위에 칩을 나란히 놓는다', en: 'CoWoS = <b>Chip on Wafer on Substrate</b>: chips side by side on silicon' },
       { ko: '2.5D 라고 부르는 이유는 <b>쌓지 않고 옆에</b> 놓기 때문이다', en: "It's called 2.5D because chips sit <b>beside</b>, not on top of, each other" },
       { ko: '인터포저 면적은 노광 한 번의 한계(<b>레티클</b>)를 훌쩍 넘긴다. 여러 번 이어 찍는다', en: 'Interposers exceed one <b>reticle</b> field, so exposures are stitched' }],
  P10: [{ ko: 'SMT 라인은 부품을 놓고 <b>리플로우 오븐</b>에 통과시켜 납을 한 번에 녹인다', en: 'SMT places parts, then a <b>reflow oven</b> melts all the solder at once' },
        { ko: 'DGX 한 대에 GPU <b>8장</b>이 들어간다', en: 'One DGX system holds <b>eight</b> GPUs' },
        { ko: 'Jetson 은 로봇 안에 넣는 GPU 다. <b>전력 예산</b>이 서버와 다르다', en: 'Jetson is a GPU for robots, with a very different <b>power budget</b>' }],
  // ---- 하강: GPU 내부 ----
  L0: [{ ko: 'H100 SXM 의 열 설계 전력은 <b>700 W</b>. 전기포트 한 대와 비슷하다', en: 'The H100 SXM is a <b>700 W</b> part, like a small kettle' },
       { ko: 'VRM 이 12 V 를 <b>1 V 아래</b>로 낮춘다. 그만큼 전류는 수백 암페어가 된다', en: 'VRMs drop 12 V to <b>under 1 V</b>, so current runs to hundreds of amps' },
       { ko: 'SXM 은 소켓이 아니라 <b>메자닌 모듈</b>이다. 그래서 전력과 냉각을 크게 쓸 수 있다', en: 'SXM is a <b>mezzanine module</b>, not a socket, allowing more power and cooling' }],
  L1: [{ ko: '플립칩은 칩을 <b>뒤집어</b> 범프로 붙인다. 선으로 잇던 시절보다 훨씬 짧다', en: 'Flip-chip turns the die <b>upside down</b> onto bumps, far shorter than wires' },
       { ko: '인터포저는 <b>실리콘으로 만든 배선판</b>이다. 유기 기판보다 선을 촘촘히 놓는다', en: 'An interposer is <b>wiring on silicon</b>, finer than an organic substrate' },
       { ko: 'GPU 와 HBM 사이가 짧을수록 <b>전력과 지연</b>이 함께 준다', en: 'Shorter GPU-to-HBM distance cuts both <b>power and latency</b>' }],
  L2: [{ ko: 'H100 다이는 <b>814 mm²</b>에 트랜지스터 <b>800억 개</b>다', en: 'The H100 die is <b>814 mm²</b> with <b>80 billion</b> transistors' },
       { ko: 'L2 캐시 <b>50 MB</b>가 두 파티션으로 나뉘어 있다. 먼 쪽은 더 느리다', en: 'The <b>50 MB</b> L2 is split in two partitions; the far one is slower' },
       { ko: '다이 위 <b>크로스바</b>가 SM 과 L2, 메모리 컨트롤러를 잇는다', en: 'An on-die <b>crossbar</b> links SMs, L2 and the memory controllers' },
       { ko: 'CPU 는 큰 코어 몇 개, GPU 는 <b>작은 코어 수만 개</b>다. 같은 공정, 다른 배치', en: 'A CPU has a few big cores; a GPU has <b>tens of thousands of small ones</b>. Same process, different layout' }],
  L3: [{ ko: 'GPC = <b>Graphics Processing Cluster</b>. 다이를 나눈 행정구 같은 단위다', en: 'GPC = <b>Graphics Processing Cluster</b>, a district of the die' },
       { ko: 'H100 은 GPC <b>8개</b>로 나뉜다. 하나가 통째로 꺼져 출하되기도 한다', en: 'H100 has <b>8 GPCs</b>; sometimes one ships fully disabled' },
       { ko: '래스터 엔진은 삼각형을 픽셀로 바꾼다. <b>계산용 GPU</b>에서는 거의 놀고 있다', en: 'The raster engine turns triangles into pixels, mostly idle on <b>compute GPUs</b>' }],
  L4: [{ ko: 'TPC 하나는 SM <b>두 채</b>다. 둘이 짝을 이룬다', en: 'One TPC is <b>two SMs</b> paired together' },
       { ko: 'PolyMorph 엔진이 <b>정점과 테셀레이션</b>을 맡는다', en: 'The PolyMorph engine handles <b>vertices and tessellation</b>' },
       { ko: '완전한 칩을 파는 일은 드물다. 일부를 꺼서 <b>수율</b>을 건진다', en: 'Full chips rarely ship; disabling parts rescues <b>yield</b>' }],
  L5: [{ ko: 'SM 하나에 처리 블록 <b>4개</b>와 텐서 코어 <b>4개</b>가 있다', en: 'Each SM has <b>4</b> processing blocks and <b>4</b> Tensor Cores' },
       { ko: 'L1 과 공유 메모리는 <b>같은 SRAM</b>을 나눠 쓴다. 커널이 비율을 고른다', en: 'L1 and shared memory come from the <b>same SRAM</b>, split by the kernel' },
       { ko: 'TMA 는 Hopper 에서 생겼다. 타일을 <b>통째로</b> 옮겨 주소 계산을 줄인다', en: 'TMA arrived with Hopper: it moves <b>whole tiles</b>, cutting address math' }],
  L6: [{ ko: '처리 블록마다 레지스터 파일이 <b>64 KB</b>씩 있다', en: 'Each processing block has a <b>64 KB</b> register file' },
       { ko: '워프 스케줄러는 <b>매 사이클</b> 준비된 워프를 골라 명령을 내보낸다', en: 'The warp scheduler picks a ready warp <b>every cycle</b>' },
       { ko: '레지스터가 모자라면 값이 느린 메모리로 밀려난다. 이걸 <b>스필</b>이라 한다', en: 'When registers run out, values <b>spill</b> to slow memory' }],
  L7: [{ ko: '워프는 스레드 <b>32개</b>가 한 몸처럼 같은 명령을 실행하는 단위다', en: 'A warp is <b>32 threads</b> running one instruction together' },
       { ko: '분기가 갈리면 양쪽을 <b>차례로</b> 돈다. 그동안 반대편은 쉰다', en: 'On divergence both paths run <b>in turn</b>; the other half waits' },
       { ko: '주소가 나란하면 메모리 요청이 <b>한 번</b>으로 합쳐진다. 코얼레싱이다', en: 'Neighbouring addresses merge into <b>one</b> request: coalescing' }],
  L8: [{ ko: 'FMA 는 <b>a×b+c</b> 를 한 번에 계산하고 반올림도 <b>한 번</b>만 한다', en: 'FMA computes <b>a×b+c</b> at once and rounds only <b>once</b>' },
       { ko: '곱셈은 여러 단계로 쪼개 흘려보낸다. 그래서 <b>파이프라인</b>이라 부른다', en: 'Multiplication is split into stages and streamed: a <b>pipeline</b>' },
       { ko: '계산용 GPU 는 FP64 도 빠르지만, 게임용은 <b>일부러 느리게</b> 만든다', en: 'Compute GPUs run FP64 fast; gaming parts are <b>deliberately slow</b> at it' }],
  L9: [{ ko: '6T 셀은 인버터 둘이 <b>서로를 붙잡아</b> 값을 지킨다', en: 'In a 6T cell two inverters <b>hold each other</b> to keep the value' },
       { ko: '셀 하나의 면적은 <b>0.021 μm²</b>. L2 에는 이런 칸이 수억 개다', en: 'One cell is <b>0.021 μm²</b>; L2 holds hundreds of millions' },
       { ko: '센스 앰프가 비트라인의 <b>수십 mV</b> 차이를 읽어 0과 1로 키운다', en: 'The sense amp turns a <b>few tens of mV</b> into a clean 0 or 1' }],
  L10: [{ ko: '구리는 식각이 잘 안 된다. 그래서 <b>홈을 파고 채운 뒤 갈아 낸다</b>(다마신)', en: "Copper doesn't etch well, so it's <b>filled into trenches and polished</b> (damascene)" },
        { ko: '가장 아래 배선(M0)의 간격은 <b>28 nm</b>. 위로 갈수록 굵어진다', en: 'The lowest metal (M0) has a <b>28 nm</b> pitch; upper layers get thicker' },
        { ko: '배선은 <b>15층</b> 안팎으로 쌓인다. 도시의 고가도로처럼 층이 나뉜다', en: 'About <b>15</b> metal layers stack up, like tiered overpasses' }],
  L11: [{ ko: 'CMOS 인버터는 <b>PMOS 하나 + NMOS 하나</b>. 둘 중 하나만 열린다', en: 'A CMOS inverter is <b>one PMOS + one NMOS</b>; only one opens at a time' },
        { ko: '가만히 있을 때는 전력을 거의 안 쓴다. <b>바뀔 때</b>만 쓴다', en: 'It burns almost nothing at rest, only when it <b>switches</b>' },
        { ko: '표준 셀 높이는 <b>210 nm</b> 정도로 통일한다. 그래야 줄 세워 붙일 수 있다', en: 'Standard cells share a <b>210 nm</b> height so they can tile in rows' },
        { ko: '이 게이트는 GPU 만의 것이 아니다. <b>모든 디지털 칩</b>이 같은 인버터를 쓴다', en: 'This gate is not GPU-specific: <b>every digital chip</b> uses the same inverter' }],
  L12: [{ ko: 'FinFET 은 채널을 <b>세워서</b> 게이트가 세 면을 감싸게 만든 것이다', en: 'FinFET stands the channel <b>upright</b> so the gate wraps three sides' },
        { ko: '핀 하나의 폭은 <b>약 6 nm</b>. 실리콘 원자 스물몇 개 폭이다', en: 'A fin is <b>about 6 nm</b> wide, a couple dozen silicon atoms' },
        { ko: '다음 세대는 GAA 다. 게이트가 채널을 <b>네 면 모두</b> 감싼다', en: 'Next comes GAA, where the gate wraps <b>all four sides</b>' }],
  L13: [{ ko: 'SiO₂ 게이트 산화막은 <b>0.5 nm</b>, 원자 두세 층 두께다', en: 'The SiO₂ gate oxide is <b>0.5 nm</b>, two or three atoms thick' },
        { ko: 'HfO₂ 같은 high-k 를 쓰면 <b>두껍게 만들어도</b> 제어력이 유지된다', en: 'High-k like HfO₂ keeps control while staying <b>physically thicker</b>' },
        { ko: '이 두께에서는 전자가 벽을 <b>그냥 통과</b>한다. 양자 터널링 누설이다', en: 'At this thickness electrons <b>tunnel straight through</b>: leakage' }],
  L14: [{ ko: '실리콘 결정은 <b>다이아몬드 입방</b> 구조다. 격자 상수 0.5431 nm', en: 'Silicon is <b>diamond cubic</b>, lattice constant 0.5431 nm' },
        { ko: '이웃한 원자 사이는 <b>0.235 nm</b>. 여기가 바닥이다', en: 'Neighbouring atoms sit <b>0.235 nm</b> apart. This is the floor' },
        { ko: '도핑은 원자 <b>백만 개에 하나</b> 꼴로 다른 원소를 섞는 일이다', en: 'Doping swaps in a foreign atom roughly <b>one in a million</b>' },
        { ko: '여기까지는 <b>모든 실리콘 칩</b>이 같다. GPU 를 GPU 로 만드는 것은 위층의 배치다', en: '<b>Every silicon chip</b> is the same down here; what makes a GPU is the layout above' }],
  // ---- HBM 지선 ----
  H1: [{ ko: 'HBM 은 <b>1024비트</b> 폭으로 읽는다. 넓게 가는 대신 느긋하게 간다', en: 'HBM reads <b>1024 bits</b> wide: broad rather than fast per pin' },
       { ko: '다이 사이 간격은 <b>30 μm</b> 남짓. 열이 빠져나갈 틈이 거의 없다', en: 'Dies sit about <b>30 μm</b> apart, leaving little room for heat to escape' },
       { ko: '맨 아래 <b>베이스 다이</b>가 GPU 와 이야기하고 위층을 지휘한다', en: 'The bottom <b>base die</b> talks to the GPU and drives the stack' }],
  H2: [{ ko: 'DRAM 한 칸은 <b>트랜지스터 1개 + 커패시터 1개</b>가 전부다', en: 'One DRAM cell is just <b>one transistor and one capacitor</b>' },
       { ko: '전하가 새기 때문에 <b>64 ms</b>마다 읽고 다시 써 넣는다. 리프레시다', en: 'Charge leaks, so every <b>64 ms</b> it is read and written back: refresh' },
       { ko: '읽으면 값이 깨진다. 그래서 읽은 뒤 <b>바로 되써야</b> 한다', en: 'Reading destroys the value, so it must be <b>written straight back</b>' }],
  // ---- AI 테마 ----
  A1: [{ ko: '2016년 3월 서울, 알파고가 이세돌에게 <b>4 대 1</b>로 이겼다', en: 'Seoul, March 2016: AlphaGo beat Lee Sedol <b>4-1</b>' },
       { ko: '알파고는 정책망과 가치망을 <b>몬테카를로 트리 탐색</b>에 얹었다', en: 'AlphaGo put policy and value networks on top of <b>Monte Carlo tree search</b>' },
       { ko: '이세돌은 4국에서 <b>78수</b>로 한 판을 가져갔다. 유일한 승리다', en: 'Lee Sedol took game 4 with move <b>78</b>, the only human win' }],
  A2: [{ ko: '2012년 AlexNet 의 ImageNet 오차 <b>15.3%</b>. 2위와 격차가 컸다', en: 'AlexNet hit <b>15.3%</b> ImageNet error in 2012, far ahead of second' },
       { ko: '학습에 쓴 것은 <b>GTX 580 두 장</b>. 메모리가 모자라 모델을 반으로 쪼갰다', en: 'It trained on <b>two GTX 580s</b>, splitting the model to fit memory' },
       { ko: 'ReLU 와 드롭아웃이 여기서 널리 알려졌다. <b>단순한 것</b>이 잘 통했다', en: 'ReLU and dropout became standard here: the <b>simple things</b> worked' }],
  A3: [{ ko: '2017년 논문 제목이 그대로 결론이었다. <b>Attention Is All You Need</b>', en: 'The 2017 title was the conclusion: <b>Attention Is All You Need</b>' },
       { ko: '순환 없이 <b>한꺼번에</b> 보기 때문에 GPU 로 병렬 처리가 된다', en: 'Without recurrence it looks at everything <b>at once</b>, so GPUs parallelise it' },
       { ko: '대신 계산량이 문장 길이의 <b>제곱</b>으로 늘어난다', en: 'The cost grows with the <b>square</b> of sequence length' }],
  A4: [{ ko: 'GPT-3 는 파라미터 <b>1,750억 개</b>. GPT-1 의 1,500배쯤 된다', en: 'GPT-3 has <b>175 billion</b> parameters, some 1,500x GPT-1' },
       { ko: '하는 일은 하나다. <b>다음 토큰</b>이 무엇일지 고른다', en: 'It does one thing: pick the <b>next token</b>' },
       { ko: 'ChatGPT 는 2022년 11월 30일에 나와 <b>닷새</b> 만에 사용자 100만을 넘겼다', en: 'ChatGPT launched 30 Nov 2022 and passed a million users in <b>five days</b>' }],
  A5: [{ ko: 'Constitutional AI 는 원칙을 적은 <b>문서</b>를 주고 스스로 답을 고치게 한다', en: 'Constitutional AI hands the model a <b>written set of principles</b> to self-correct' },
       { ko: '사람이 일일이 고르는 대신 <b>모델이 모델을</b> 평가한다', en: 'Instead of human ranking every reply, <b>a model judges a model</b>' },
       { ko: '긴 문맥을 다루면 그만큼 <b>메모리</b>가 든다. 어텐션 비용 때문이다', en: 'Long context costs <b>memory</b>, because attention scales with it' }],
  A6: [{ ko: '요즘 대형 학습은 GPU <b>10만 장</b> 규모의 클러스터에서 돈다', en: 'Frontier training runs on clusters of <b>100,000</b> GPUs' },
       { ko: '스케일링 법칙: 모델과 데이터, 계산을 <b>함께</b> 키워야 효과가 난다', en: 'Scaling laws: model, data and compute must grow <b>together</b>' },
       { ko: '그 규모에서는 노드가 <b>매일</b> 죽는다. 체크포인트가 생명줄이다', en: 'At that size nodes die <b>daily</b>; checkpoints are the lifeline' }],
  A7: [{ ko: 'HBM 은 한국이 사실상 <b>세계 공급</b>을 맡고 있다', en: 'Korea supplies most of the world\'s <b>HBM</b>' },
       { ko: 'GPU 가 아무리 빨라도 <b>HBM 이 못 오면</b> 출하가 멈춘다', en: 'However fast the GPU, shipments stall if <b>HBM does not arrive</b>' },
       { ko: 'AI 경쟁의 병목은 이제 연산이 아니라 <b>메모리 대역폭</b>이다', en: 'The bottleneck is no longer compute but <b>memory bandwidth</b>' }],
};

/** 챕터 기본값 (층 표에 없을 때) */
export const HURT_FACT_CHAPTER = {
  prologue: [{ ko: '모래에서 칩까지 <b>수백 단계</b>를 거친다. 여기까지는 GPU 든 CPU 든 같은 길이다', en: 'Sand to chip takes <b>hundreds of steps</b>, the same road for a GPU or a CPU' }],
  descent: [{ ko: '비트를 뒤집는 것은 <b>우주선이 만든 중성자</b>다. 콘크리트 1.5 m 도 통과한다', en: 'Bits flip from <b>cosmic-ray neutrons</b> that pass through 1.5 m of concrete' }],
  hbm: [{ ko: 'HBM 은 <b>넓게</b> 간다. 한 번에 1024비트를 읽는다', en: 'HBM goes <b>wide</b>: 1024 bits per read' }],
  ai: [{ ko: '모델은 <b>다음 토큰</b>을 고르는 일만 반복한다', en: 'The model only ever picks the <b>next token</b>' }],
};

// 20260913 jwjeong 같은 층에서 맞을 때마다 다른 지식이 나오도록 층별로 순서를 기억한다.
// 층을 옮기면 그 층의 자리부터 다시 이어간다(처음부터가 아니라). 다 돌면 앞으로 돌아온다.
const factCursor = new Map();
export function nextFact(id, chapter) {
  const arr = HURT_FACT[id] || HURT_FACT_CHAPTER[chapter] || HURT_FACT_CHAPTER.descent;
  const i = (factCursor.get(id) || 0) % arr.length;
  factCursor.set(id, i + 1);
  return arr[i];
}
