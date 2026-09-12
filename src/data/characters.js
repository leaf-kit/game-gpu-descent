// 탐험가(플레이어 캐릭터) 정의. 직업이 곧 특성(perk). 색상은 절차 생성 모델용.
export const CHARACTERS = [
  {
    id: 'yuna', name: { ko: '유나', en: 'Yuna' }, job: { ko: '로봇 공학자', en: 'Robotics Engineer' },
    desc: { ko: '휴머노이드 이오(EO)를 만든 사람. "내 로봇의 머릿속이 궁금해."', en: 'Built the humanoid EO. "I want to see inside my robot\'s head."' },
    perk: { ko: '프레임 데이터의 위치가 항상 미니맵에 표시된다', en: 'The frame data packet is always shown on the minimap' },
    skin: 0xf1c9a5, suit: 0x2d6cdf, suit2: 0x1b2a44, hair: 0x2a1a0e, accent: 0x5ee0ff, hat: 'headset', hairStyle: 'ponytail', eye: 0x3b2a1a, shoe: 0x22304a, showPacket: true,
    intro: { L0: { ko: '이오의 등판을 열면 이 모듈이 있어. 여기가 이오의 뇌야.', en: 'Open EO\'s back panel and this module is right there. This is EO\'s brain.' } },
  },
  {
    id: 'minjun', name: { ko: '민준', en: 'Minjun' }, job: { ko: '칩 설계자', en: 'Chip Designer' },
    desc: { ko: '물리 설계 엔지니어. "설계는 했지만 실제로 들어가 본 적은 없지."', en: 'Physical design engineer. "I laid it out, but I\'ve never walked in it."' },
    perk: { ko: '구조물 근처에 가면 용어 카드가 자동으로 열린다', en: 'Term cards open automatically near structures' },
    skin: 0xe8b894, suit: 0x3a3f4a, suit2: 0x22262e, hair: 0x111111, accent: 0x76b900, hat: 'goggles', hairStyle: 'short', eye: 0x2a1a10, shoe: 0x111111, autoRead: true,
    intro: { L2: { ko: '이 플로어플랜, 내가 그린 거랑 똑같아. 다만 백만 배 크지.', en: 'This floorplan is exactly what I drew. Just a million times bigger.' } },
  },
  {
    id: 'hana', name: { ko: '하나', en: 'Hana' }, job: { ko: '팹 공정 엔지니어', en: 'Fab Process Engineer' },
    desc: { ko: '클린룸에서 웨이퍼를 다룬다. "웨이퍼는 내 손을 거쳤어. 그 다음이 궁금해."', en: 'Handles wafers in the cleanroom. "The wafer passed through my hands. I want to see what comes next."' },
    perk: { ko: '방진복 스킨. 프롤로그 공장 챕터에서 이동 속도 ×1.25', en: 'Bunny-suit skin. Moves ×1.25 faster in the factory prologue' },
    skin: 0xf4d3b8, suit: 0xf4f4f4, suit2: 0xdcdcdc, hair: 0x3a2413, accent: 0xffd166, hat: 'bunny', hairStyle: 'bob', eye: 0x3b2a1a, shoe: 0xeeeeee, prologueSpeed: 1.25,
    intro: { P6: { ko: '여기야. 내가 매일 12시간 서 있던 곳. 노란 불빛이 그리웠어.', en: 'This is it. Where I stood twelve hours a day. I missed the yellow light.' } },
  },
  {
    id: 'leo', name: { ko: '레오', en: 'Leo' }, job: { ko: '데이터센터 기술자', en: 'Data Center Technician' },
    desc: { ko: 'GPU를 만 개는 꽂아 봤다. "안은 처음이야."', en: 'Has racked ten thousand GPUs. "Never been inside one."' },
    perk: { ko: '달리기 속도 ×1.2, 점프가 높다', en: 'Runs ×1.2 faster and jumps higher' },
    skin: 0xc68642, suit: 0xd9480f, suit2: 0x3b2a1a, hair: 0x1a1a1a, accent: 0xff9f43, hat: 'cap', hairStyle: 'buzz', eye: 0x2a1a10, shoe: 0x3b2a1a, speedMul: 1.2, jumpMul: 1.15,
    intro: { L0: { ko: '700와트. 이걸 8장 꽂으면 방이 사우나가 돼.', en: 'Seven hundred watts. Rack eight of these and the room becomes a sauna.' } },
  },
  {
    id: 'sara', name: { ko: '사라', en: 'Sara' }, job: { ko: 'CUDA 프로그래머', en: 'CUDA Programmer' },
    desc: { ko: '커널을 짜면서 늘 상상만 했던 그곳. "워프 안에 들어가 보고 싶었어."', en: 'Always imagined this while writing kernels. "I wanted to stand inside a warp."' },
    perk: { ko: '워프·처리 블록 층에서 이동 속도 ×1.3', en: 'Moves ×1.3 faster on the warp and processing-block levels' },
    skin: 0xf7dcc4, suit: 0x6c3fb5, suit2: 0x2a1b4a, hair: 0x5a2d0c, accent: 0xc3b1ff, hat: 'none', hairStyle: 'long', eye: 0x4a6a3a, shoe: 0x2a1b4a, warpSpeed: 1.3,
    intro: { L7: { ko: '32개... 내 코드가 저 32명을 한 줄로 세운 거야.', en: 'Thirty-two... my code is what lines those thirty-two up.' } },
  },
  {
    id: 'tori', name: { ko: '토리', en: 'Tori' }, job: { ko: '호기심 많은 아이', en: 'Curious Kid' },
    desc: { ko: '"GPU가 뭐야? 안에 사람이 살아?"', en: '"What\'s a GPU? Do people live inside?"' },
    perk: { ko: '용어 카드가 더 쉬운 어린이 설명으로 뜬다 (K 키로 전환)', en: 'Term cards use simpler kid-friendly text (toggle with K)' },
    skin: 0xf9e0c8, suit: 0xffc857, suit2: 0x2b6ca3, hair: 0x4a2a12, accent: 0xff6b9d, hat: 'cap', hairStyle: 'short', eye: 0x3b2a1a, shoe: 0xff6b9d, kid: true, scale: 0.85,
    intro: { L5: { ko: '마을이다! 여기 사람은 없지만... 일꾼이 128명이래.', en: 'A village! Nobody lives here... but they say 128 workers do.' } },
  },
];
