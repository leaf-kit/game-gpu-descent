// 언어 설정 (한국어 기본, 영어 선택). 정적 HTML은 data-i18n 속성, 동적 문자열은 t(), 데이터는 {ko, en} 쌍을 L()로 고른다.
export const LANG = (() => { try { const s = localStorage.getItem('gd_lang'); if (s) return s; return (navigator.language || '').toLowerCase().startsWith('ko') ? 'ko' : 'en'; } catch (_) { return 'ko'; } })();
export function setLang(l) { try { localStorage.setItem('gd_lang', l); } catch (_) { /* 무시 */ } location.reload(); }
/** {ko, en} 객체에서 현재 언어 문자열을 고른다. 문자열이면 그대로. */
export function L(v) { if (v == null) return ''; if (typeof v === 'string') return v; return v[LANG] ?? v.ko ?? v.en ?? ''; }
/** 반대 언어(용어 카드에서 두 언어를 함께 보여줄 때) */
export function L2(v) { if (v == null || typeof v === 'string') return ''; return LANG === 'ko' ? (v.en ?? '') : (v.ko ?? ''); }

const UI = {
  ko: {
    'title.sub': 'INTO THE SILICON', 'title.main': 'GPU 디센트',
    'title.desc': '"GPU 안에는 뭐가 있어?" — AI 신 아스트라가 당신을 원자 크기로 줄여 NVIDIA GPU 속으로 던져 넣는다. 보드에서 다이로, 마을 같은 SM에서 벽돌 같은 트랜지스터로, 실리콘 원자의 바닥까지. 실제 구조, 실제 숫자.',
    'title.start': '탐험 시작',
    'hint.move': '이동', 'hint.look': '시점 돌리기', 'hint.jump': '점프', 'hint.run': '달리기', 'hint.e': '상호작용 · 게이트 (빌런이 가까우면 주먹 연타)', 'hint.c': '시점 전환', 'hint.tab': '도감', 'hint.m': '음악',
    'tip.card': '📇 구조물을 지나면 <b>용어 카드</b>', 'tip.gate': '🌀 게이트에서 <b>×10~×100 축소</b>', 'tip.packet': '📦 카메라 프레임 하나의 <b>여행</b>을 따라가라', 'tip.fact': '📚 모든 수치는 <b>화이트페이퍼·논문</b> 출처',
    'lang.label': '언어', 'mobile.rotate': '가로 화면으로 돌려주세요',
    'select.title': '탐험가를 선택하세요', 'select.gpu': 'GPU', 'select.mode': '시작', 'select.modePrologue': '프롤로그(공장 시찰)부터', 'select.modeDescent': '바로 GPU 속으로', 'select.view': '시점', 'select.viewThird': '3인칭', 'select.viewFirst': '1인칭', 'select.back': '뒤로', 'select.go': '축소 시작',
    'select.perk': '특성',
    'hud.hint': 'E 상호작용 · C 시점 · TAB 도감', 'hud.terms': '용어 {n}/{total}', 'hud.level': '{id} · {name}', 'hud.scale': '나의 키 ≈ {h}', 'hud.gate': '게이트로 들어간다 (×{f} 축소)', 'hud.gateLocked': '게이트가 잠겨 있다 — 용어 카드 {n}장을 더 모아라', 'hud.read': '살펴보기', 'hud.exitGate': '다음 장소로 이동', 'hud.objective': '목표: {txt}', 'hud.packet': '📦 프레임 데이터 {n}/{total} 통과',
    'shrink.text': 'SHRINKING', 'shrink.enter': 'ENTERING',
    'codex.title': '도감 · Codex', 'codex.close': '닫기 (TAB)', 'codex.terms': '용어 카드', 'codex.levels': '층 지도', 'codex.sources': '출처', 'codex.locked': '아직 발견하지 못한 용어', 'codex.found': '발견 {n} / {total}',
    'menu.jump': '🧭 층으로 이동', 'menu.select': '👤 탐험가 선택으로', 'menu.home': '🏠 메인으로',
    'ending.sub': 'THE FLOOR', 'ending.title': '바닥에 도착했다', 'ending.share': '결과 카드 저장', 'ending.again': '다시 탐험',
    'ending.levels': '내려간 층', 'ending.terms': '배운 용어', 'ending.shrink': '총 축소 배율', 'ending.height': '마지막 키', 'ending.time': '탐험 시간', 'ending.gpu': '탐험한 GPU', 'ending.char': '탐험가',
    'ending.quote': '"이제 내가 뭘로 만들어졌는지 알겠지? 모래와 빛과 전기. 그리고 아주 많은 사람의 손. 그럼, 너는?" — 아스트라',
    'astra.intro': '내가 아스트라야. GPU 안이 궁금하다고 했지? 말로 설명하면 잊어버려. 직접 걸어 내려가. 텔레포트는 없어. 게이트마다 너를 더 작게 만들어 줄게.',
    'astra.gateHint': '이 층의 용어 카드를 충분히 모으면 게이트가 열려. 파란 빛을 따라가.',
    'char.select': '선택',
    'music.on': '♪ 음악 켜짐', 'music.off': '♪ 음악 꺼짐',
    'view.third': '3인칭', 'view.first': '1인칭', 'view.top': '조감',
    'depth.label': 'DEPTH',
    'share.saved': '결과 카드가 저장되었습니다',
    'unit.mm': 'mm', 'unit.um': 'μm', 'unit.nm': 'nm', 'unit.cm': 'cm', 'unit.m': 'm',
    'kid.mode': '어린이 설명',
    'hint.v': '관련 영상', 'hint.slide': '슬라이딩 (달리는 중)', 'hint.jet': '제트팩 공중부양', 'hint.x': '기어가기', 'hint.q': '대시', 'hint.p': '오토 모드', 'hud.fuel': '🚀 제트팩 연료 · F 누르고 있기', 'hud.sideGate': '{name} (지선 · 돌아올 수 있음)', 'company.site': '홈페이지', 'score.label': 'SCORE', 'auto.btn': '오토', 'coin.learned': '방금 배운 것', 'coin.hitLearned': '⚡ 맞고 배운 것', 'chapter.prologue': '반도체 만들기', 'chapter.descent': 'GPU 속', 'chapter.hbm': 'HBM 메모리', 'chapter.ai': 'AI 모델', 'score.missileHit': '미사일 명중', 'score.missileKill': '미사일 격추', 'missile.ready': '🚀 미사일 준비', 'missile.charging': '🚀 재장전', 'term.easy': '쉽게 말하면', 'term.more': '자세히 보기', 'hint.r': '발사 (ECC 정정)', 'hint.g': '미사일 (게이지를 크게 깎는다)', 'hint.z': '주먹', 'cel.title': 'ECC CORRECTED!', 'board.nudge': '👆 눌러서 영상으로 보기', 'board.videoMeta': '이 층에서 배우는 내용을 영상으로 확인해 보세요. 목록에서 다른 영상도 고를 수 있습니다.', 'hud.board': '안내판 영상 보기', 'cel.sub': '뒤집힌 비트를 되돌렸다', 'score.punch': '주먹 명중', 'villain.name': '소프트 에러', 'villain.monsterAi': '환각 괴물', 'villain.monsterHw': '열폭주 괴물', 'villain.monsterSpawn': '⚠ {name}이 나타났다 — G 미사일이 가장 아프고, 가까이서는 Z 주먹이 두 배다', 'villain.monsterKilled': '✔ {name}을 쓰러뜨렸다', 'villain.clawHurt': '괴물의 발톱에 맞았다! 콤보가 끊어진다', 'score.monsterHit': '괴물 명중', 'score.monsterKill': '괴물 제거', 'cel.titleMonster': 'BEAST DOWN!', 'cel.subMonster': '{name}을 쓰러뜨렸다 — 이 층이 다시 조용해졌다', 'tip.monster': '👹 <b>괴물</b>은 걸어서 쫓아온다 — Z 주먹이 총보다 아프다', 'tip.villain': '⚠ 빌런은 <b>R 사격</b>과 <b>G 미사일</b>로 게이지를 깎아 퇴치', 'timer.par': '/ 목표 {t}', 'score.hit': '명중', 'score.kill': 'ECC 정정 완료', 'score.timeBonus': '시간 보너스', 'villain.hurt': '비트가 뒤집혔다! 콤보가 끊어진다', 'villain.spawn': '⚠ 비트가 흔들린다 — R 사격, G 미사일로 게이지를 깎아라', 'villain.killed': '✔ ECC가 오류를 정정했다', 'timer.clearIn': '목표 시간 안에 통과하면 보너스', 'score.best': 'BEST', 'score.combo': '{n}연속', 'hint.b': '스케이트보드', 'tip.score': '🏆 사람·용어·코인·트릭으로 <b>점수</b>를 모아라', 'hud.coins': '🪙 코인 {n}/{total}', 'skate.on': '🛹 스케이트보드 · 달리며 SPACE 로 점프, 공중에서 A/D 로 회전', 'skate.off': '🛹 스케이트보드에서 내렸다', 'score.person': '{name} 만남', 'score.term': '용어', 'score.coin': '비트 코인', 'score.stage': '스테이지 통과', 'score.trick': '{deg}° 트릭', 'score.boost': '부스트', 'score.video': '영상', 'score.photo': '실제 사진', 'ending.score': '점수', 'ending.rank': '등급', 'ending.maxCombo': '최대 콤보', 'ending.coins': '모은 코인', 'ending.people': '만난 사람', 'ending.tricks': '성공한 트릭', 'ending.best': '최고 기록', 'music.playlist': '플레이리스트 · 누르면 그 곡을 재생', 'music.auto': '🔄 층에 맞춰 자동 전환', 'music.none': '(음원 없음)', 'gate.title': 'GPU 디센트', 'gate.text': '🔊 화면을 한 번 누르면 메인 테마와 함께 시작합니다', 'music.now': '재생 중', 'select.theme': '테마', 'select.themeGpu': 'GPU 디센트 (공장 → GPU 내부)', 'select.themeAi': 'AI 모델 경쟁 (알파고 → LLM)', 'company.founded': '설립 {y}', 'tip.click': '🖱 구조물·간판을 <b>클릭</b>하면 실제 사진·영상·회사 정보', 'auto.badge': '🤖 AUTO · P 키로 해제', 'auto.on': '오토 모드 시작: 용어를 모두 살펴본 뒤 게이트로 내려갑니다. (P: 해제)', 'auto.off': '오토 모드 해제', 'select.auto': '오토 모드 (자동 탐험)', 'tip.people': '🧑‍🔬 <b>실존 인물</b>을 만나 클릭하면 영상', 'video.note': '영어 영상입니다. 유튜브 자막(CC) 버튼에서 한국어 자동 번역을 켤 수 있습니다.', 'video.watch': '영상 보기', 'video.open': '유튜브에서 열기', 'video.openHint': '▶ 클릭하면 영상이 열립니다', 'video.hint': '▶ V 키: 관련 영상 보기', 'hud.talk': '{name} · 영상 보기', 'codex.people': '인물', 'video.about': '{name} ({years}) — {role}', 'video.term': '{term} 설명 영상',
    'hint.h': '전체 조작 보기', 'keys.open': '전체 조작', 'keys.title': '조작 방법', 'keys.close': '닫기 (H)', 'keys.hold': '누르고 있기',
    'keys.move': '이동 · 시점', 'keys.action': '동작', 'keys.system': '게임 · 화면',
    'jet.head': '제트팩으로 공중부양',
    'jet.body': 'F 키를 <b>누르고 있으면</b> 등에 멘 제트팩이 불을 뿜고, 몸이 공중으로 떠오릅니다. 계단으로 오르기 힘든 높은 구조물도 그대로 날아서 넘어갈 수 있습니다. 연료는 화면 왼쪽 위 게이지에 표시되며, 땅에 내려서면 빠르게 다시 채워집니다.',
    'jet.air': '키를 누르고 있으면 제트팩으로 떠오릅니다',
    'jet.narr': '높은 곳에 올라가고 싶으면 F 키를 누른 채로 있어 봐. 제트팩이 켜지면서 몸이 그대로 떠오를 거야. 연료는 땅에 내려서면 다시 채워져.',
  },
  en: {
    'title.sub': 'INTO THE SILICON', 'title.main': 'GPU DESCENT',
    'title.desc': '"What\'s inside a GPU?" — The AI god Astra shrinks you to atomic scale and drops you into an NVIDIA GPU. From the board to the die, from village-like SMs to brick-like transistors, all the way down to the floor of silicon atoms. Real structure, real numbers.',
    'title.start': 'START EXPLORING',
    'hint.move': 'Move', 'hint.look': 'Look around', 'hint.jump': 'Jump', 'hint.run': 'Run', 'hint.e': 'Interact · gate (punch when a villain is close)', 'hint.c': 'Camera', 'hint.tab': 'Codex', 'hint.m': 'Music',
    'tip.card': '📇 Pass a structure to get a <b>term card</b>', 'tip.gate': '🌀 Gates <b>shrink you ×10–×100</b>', 'tip.packet': '📦 Follow one camera frame\'s <b>journey</b>', 'tip.fact': '📚 Every number is from <b>whitepapers & papers</b>',
    'lang.label': 'Language', 'mobile.rotate': 'Please rotate to landscape',
    'select.title': 'Choose your explorer', 'select.gpu': 'GPU', 'select.mode': 'Start', 'select.modePrologue': 'From the prologue (factory tour)', 'select.modeDescent': 'Straight into the GPU', 'select.view': 'View', 'select.viewThird': 'Third person', 'select.viewFirst': 'First person', 'select.back': 'Back', 'select.go': 'SHRINK ME',
    'select.perk': 'Perk',
    'hud.hint': 'E interact · C camera · TAB codex', 'hud.terms': 'Terms {n}/{total}', 'hud.level': '{id} · {name}', 'hud.scale': 'My height ≈ {h}', 'hud.gate': 'Enter the gate (shrink ×{f})', 'hud.gateLocked': 'Gate locked — collect {n} more term cards', 'hud.read': 'Inspect', 'hud.exitGate': 'Go to next place', 'hud.objective': 'Objective: {txt}', 'hud.packet': '📦 Frame data {n}/{total} passed',
    'shrink.text': 'SHRINKING', 'shrink.enter': 'ENTERING',
    'codex.title': 'Codex', 'codex.close': 'Close (TAB)', 'codex.terms': 'Term cards', 'codex.levels': 'Level map', 'codex.sources': 'Sources', 'codex.locked': 'Not discovered yet', 'codex.found': 'Found {n} / {total}',
    'menu.jump': '🧭 Jump to level', 'menu.select': '👤 Explorer select', 'menu.home': '🏠 Main menu',
    'ending.sub': 'THE FLOOR', 'ending.title': 'You reached the floor', 'ending.share': 'Save result card', 'ending.again': 'Explore again',
    'ending.levels': 'Levels descended', 'ending.terms': 'Terms learned', 'ending.shrink': 'Total shrink factor', 'ending.height': 'Final height', 'ending.time': 'Time', 'ending.gpu': 'GPU explored', 'ending.char': 'Explorer',
    'ending.quote': '"Now you know what I\'m made of: sand, light, electricity — and a great many human hands. So... what are you made of?" — Astra',
    'astra.intro': 'I am Astra. You asked what\'s inside a GPU. Words are forgotten; walking is not. No teleporting. At every gate I will make you smaller.',
    'astra.gateHint': 'Collect enough term cards on this level and the gate opens. Follow the blue light.',
    'char.select': 'Select',
    'music.on': '♪ Music on', 'music.off': '♪ Music off',
    'view.third': 'Third person', 'view.first': 'First person', 'view.top': 'Overhead',
    'depth.label': 'DEPTH',
    'share.saved': 'Result card saved',
    'unit.mm': 'mm', 'unit.um': 'μm', 'unit.nm': 'nm', 'unit.cm': 'cm', 'unit.m': 'm',
    'kid.mode': 'Kid-friendly',
    'hint.v': 'Related video', 'hint.slide': 'Slide (while running)', 'hint.jet': 'Jetpack hover', 'hint.x': 'Crawl', 'hint.q': 'Dash', 'hint.p': 'Auto mode', 'hud.fuel': '🚀 Jetpack fuel · hold F', 'hud.sideGate': '{name} (side branch, you can return)', 'company.site': 'Homepage', 'score.label': 'SCORE', 'score.best': 'BEST', 'score.combo': '{n} in a row', 'auto.btn': 'AUTO', 'coin.learned': 'Just learned', 'coin.hitLearned': '⚡ Learned the hard way', 'chapter.prologue': 'Making chips', 'chapter.descent': 'Inside the GPU', 'chapter.hbm': 'HBM memory', 'chapter.ai': 'AI models', 'score.missileHit': 'Missile hit', 'score.missileKill': 'Missile kill', 'missile.ready': '🚀 MISSILE READY', 'missile.charging': '🚀 RELOADING', 'term.easy': 'In plain words', 'term.more': 'More detail', 'hint.r': 'Fire (ECC)', 'hint.g': 'Missile (big gauge damage)', 'hint.z': 'Punch', 'board.nudge': '👆 Tap to watch the video', 'board.videoMeta': 'Watch what this level teaches. Pick another video from the list.', 'hud.board': 'Watch the board video', 'cel.title': 'ECC CORRECTED!', 'cel.sub': 'The flipped bit is back', 'score.punch': 'Punch', 'villain.name': 'SOFT ERROR', 'villain.monsterAi': 'HALLUCINATION BEAST', 'villain.monsterHw': 'THERMAL RUNAWAY BEAST', 'villain.monsterSpawn': '⚠ A {name} appeared — the G missile hurts most, the Z punch doubles up close', 'villain.monsterKilled': '✔ The {name} is down', 'villain.clawHurt': 'The beast clawed you! Combo lost', 'score.monsterHit': 'Beast hit', 'score.monsterKill': 'Beast down', 'cel.titleMonster': 'BEAST DOWN!', 'cel.subMonster': '{name} defeated — this floor is quiet again', 'tip.monster': '👹 The <b>beast</b> walks after you — the Z punch hurts more than the gun', 'tip.villain': '⚠ Wear the villain gauge down with <b>R</b> shots and <b>G</b> missiles', 'timer.par': '/ target {t}', 'score.hit': 'Hit', 'score.kill': 'ECC corrected', 'score.timeBonus': 'Time bonus', 'villain.hurt': 'A bit flipped! Combo lost', 'villain.spawn': '⚠ The bits are wobbling — press R to shoot, G for a missile', 'villain.killed': '✔ ECC corrected the error', 'timer.clearIn': 'Clear within the target time for a bonus', 'hint.b': 'Skateboard', 'tip.score': '🏆 Score from people, terms, coins and tricks', 'hud.coins': '🪙 Coins {n}/{total}', 'skate.on': '🛹 Skateboard on · SPACE to ollie, A/D to spin in the air', 'skate.off': '🛹 Off the board', 'score.person': 'Met {name}', 'score.term': 'Term', 'score.coin': 'Bit coin', 'score.stage': 'Stage cleared', 'score.trick': '{deg}° trick', 'score.boost': 'Boost', 'score.video': 'Video', 'score.photo': 'Real photo', 'ending.score': 'Score', 'ending.rank': 'Rank', 'ending.maxCombo': 'Max combo', 'ending.coins': 'Coins', 'ending.people': 'People met', 'ending.tricks': 'Tricks landed', 'ending.best': 'Best', 'music.playlist': 'Playlist · click a track to play it', 'music.auto': '🔄 Auto-switch by level', 'music.none': '(no audio file)', 'gate.title': 'GPU DESCENT', 'gate.text': '🔊 Click anywhere to start with the main theme', 'music.now': 'Now playing', 'select.theme': 'Theme', 'select.themeGpu': 'GPU Descent (factory → inside the GPU)', 'select.themeAi': 'AI Model Race (AlphaGo → LLMs)', 'company.founded': 'Founded {y}', 'tip.click': '🖱 <b>Click</b> structures and signs for real photos, videos and company info', 'auto.badge': '🤖 AUTO · press P to stop', 'auto.on': 'Auto mode: visiting every term, then descending through the gate. (P: stop)', 'auto.off': 'Auto mode off', 'select.auto': 'Auto mode (self-guided tour)', 'tip.people': '🧑‍🔬 Meet <b>real people</b>; click for a video', 'video.note': 'English video. Use the YouTube CC button for auto-translated subtitles.', 'video.watch': 'Watch video', 'video.open': 'Open on YouTube', 'video.openHint': '▶ Click to open the video', 'video.hint': '▶ Press V: related video', 'hud.talk': '{name} · watch video', 'codex.people': 'People', 'video.about': '{name} ({years}) — {role}', 'video.term': 'Explainer: {term}',
    'hint.h': 'All controls', 'keys.open': 'all controls', 'keys.title': 'CONTROLS', 'keys.close': 'Close (H)', 'keys.hold': 'hold',
    'keys.move': 'Move & camera', 'keys.action': 'Actions', 'keys.system': 'Game & screen',
    'jet.head': 'Jetpack — hover in the air',
    'jet.body': '<b>Hold F</b> and the jetpack on your back fires, lifting you off the ground. Fly straight over tall structures instead of climbing the stairs. Fuel is shown in the gauge at the top left and refills quickly once you land.',
    'jet.air': '— hold it to hover with the jetpack',
    'jet.narr': 'Want to get up high? Hold down F. The jetpack kicks in and lifts you straight off the ground, and the fuel refills once you land.',
  },
};

/** 유튜브 영상 주소 (모달 밖에서 바로 열 수 있는 링크) */
export function ytUrl(id) { return `https://www.youtube.com/watch?v=${id}`; }
/** 안내판·말풍선처럼 글자 수가 빠듯한 자리에 적는 짧은 주소 */
export function ytShort(id) { return `youtu.be/${id}`; }
export function t(key, vars) {
  let s = (UI[LANG] && UI[LANG][key]) ?? UI.ko[key] ?? key;
  if (vars) for (const k of Object.keys(vars)) s = s.split('{' + k + '}').join(String(vars[k]));
  return s;
}
export function applyStaticI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach((el) => { const k = el.dataset.i18n; if (UI[LANG][k] != null) el.innerHTML = UI[LANG][k]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { const k = el.dataset.i18nPlaceholder; if (UI[LANG][k] != null) el.placeholder = UI[LANG][k]; });
  const sel = document.getElementById('lang-select'); if (sel) sel.value = LANG;
}

/** 길이(미터)를 사람이 읽기 좋은 단위로 */
export function fmtLen(m) {
  const a = Math.abs(m);
  if (a >= 1) return trim(m) + ' m';
  if (a >= 1e-2) return trim(m * 100) + ' cm';
  if (a >= 1e-3) return trim(m * 1e3) + ' mm';
  if (a >= 1e-6) return trim(m * 1e6) + ' μm';
  if (a >= 1e-9) return trim(m * 1e9) + ' nm';
  return trim(m * 1e12) + ' pm';
}
function trim(x) { const s = x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2); return s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1'); }
export function fmtBig(n) { if (n >= 1e9) return trim(n / 1e9) + (LANG === 'ko' ? '십억' : 'B'); if (n >= 1e6) return trim(n / 1e6) + 'M'; if (n >= 1e3) return trim(n / 1e3) + 'K'; return String(n); }
