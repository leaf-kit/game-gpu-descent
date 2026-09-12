// GPU DESCENT — 메인 루프 / 상태 전환
import * as THREE from 'three';
import { t, L, L2, LANG, setLang, applyStaticI18n, fmtLen, ytUrl } from './i18n.js?v=20260913002818';
import { Player, PLAYER_H, buildHumanoid } from './player.js?v=20260913002818';
import { CameraRig } from './camera.js?v=20260913002818';
import { Level } from './world.js?v=20260913002818';
import { HUD, formatTime } from './hud.js?v=20260913002818';
import { AudioManager } from './audio.js?v=20260913002818';
import { NPCManager } from './npcs.js?v=20260913002818';
import { Score } from './score.js?v=20260913002818';
import { ItemField } from './items.js?v=20260913002818';
import { Combat } from './villain.js?v=20260913002818';
import { HURT, HURT_CHAPTER, KILL, pickLine, nextFact } from './data/flavor.js?v=20260913002818';
import { PEOPLE as PEOPLE_GPU, VIDEOS as VIDEOS_GPU } from './data/people_videos.js?v=20260913002818';
import { PEOPLE_AI, VIDEOS_AI } from './data/people_ai.js?v=20260913002818';
import { AI_LEVELS, COMPANIES_AI } from './data/ai_levels.js?v=20260913002818';
import { PHOTOS, COMPANIES as COMPANIES_HW } from './data/media.js?v=20260913002818';
import { COUNTRIES } from './structures.js?v=20260913002818';
import { TERMS, SOURCES } from './data/terms.js?v=20260913002818';
import { LEVELS, HBM_LEVELS } from './data/levels.js?v=20260913002818';
import { PROLOGUE } from './data/factory.js?v=20260913002818';
import { GPUS } from './data/gpus.js?v=20260913002818';
import { CHARACTERS } from './data/characters.js?v=20260913002818';

// 인물·영상 데이터 병합: 같은 인물이 두 파일에 있으면 등장 층(areas)을 합친다
const PEOPLE = [...PEOPLE_GPU, ...PEOPLE_AI.filter((p) => !PEOPLE_GPU.some((q) => q.id === p.id))];
for (const p of PEOPLE_AI) { const q = PEOPLE_GPU.find((x) => x.id === p.id); if (q) q.areas = [...new Set([...(q.areas || []), ...(p.areas || [])])]; }
const VIDEO_ALIAS = { deeplearning: ['alexnet'], attention: ['transformer'], rlhf: ['claude', 'chatgpt'], opensource: ['llama', 'deepseek'], reasoning: ['reasoning', 'agents'], airace: ['gemini', 'grok'], koreaai: ['korea_ai', 'hbm_race'], physicalai: ['agents'] };
const VIDEOS = { ...VIDEOS_GPU, ...VIDEOS_AI };
for (const [key, from] of Object.entries(VIDEO_ALIAS)) { const merged = [...(VIDEOS[key] || []), ...from.flatMap((k) => VIDEOS_AI[k] || [])]; if (merged.length) VIDEOS[key] = merged.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i); }

applyStaticI18n();
document.getElementById('lang-select').addEventListener('change', (e) => setLang(e.target.value));
const $ = (id) => document.getElementById(id);
/** {ko,en} 값이 함수(gpu => 문자열)일 수 있으므로 현재 GPU로 풀어 준다 */
function R(v, gpu) { if (v == null) return ''; if (typeof v === 'function') v = v(gpu); let s = L(v); if (typeof s === 'function') s = s(gpu); return s ?? ''; }

// ---------- 렌더러 ----------
let renderer;
try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); }
catch (err) { window.showLoadError?.('WebGL 컨텍스트를 만들 수 없습니다. 브라우저 하드웨어 가속을 켜 주세요. (' + err.message + ')'); throw err; }
const IS_MOBILE = document.documentElement.classList.contains('is-mobile');
renderer.setPixelRatio(Math.min(window.devicePixelRatio, IS_MOBILE ? 1.25 : 1.75)); renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.3;
renderer.shadowMap.enabled = !IS_MOBILE; renderer.shadowMap.type = IS_MOBILE ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
$('app').appendChild(renderer.domElement);
const scene = new THREE.Scene();
const BASE_FOV = 74; // 넓은 화각 (달릴 때 약간 더 넓어진다)
const camera = new THREE.PerspectiveCamera(BASE_FOV, window.innerWidth / window.innerHeight, 0.1, 900);
window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

const ALL_LEVELS = [...PROLOGUE, ...LEVELS];
const EVERY_LEVEL = [...ALL_LEVELS, ...HBM_LEVELS, ...AI_LEVELS];
const findLevel = (id) => EVERY_LEVEL.find((l) => l.id === id);
const hud = new HUD(TERMS, SOURCES, EVERY_LEVEL, VIDEOS, PEOPLE);
hud.onVideo = (v, meta) => openVideo(v, meta);
const audio = new AudioManager();
const rig = new CameraRig(camera);
const npcs = new NPCManager(scene);
const items = new ItemField(scene);
const combat = new Combat(scene);
const score = new Score(); // HUD 요소는 이미 문서에 있으므로 바로 만든다
const clock = new THREE.Clock();

// ---------- 게임 상태 ----------
const G = {
  state: 'title', // title | select | play | shrink | ending
  char: CHARACTERS[0], gpu: GPUS[0], mode: 'prologue', view: 'third', theme: 'gpu',
  seq: [], idx: 0, level: null, player: null, fired: new Set(), levelTerms: [],
  keys: {}, input: { x: 0, y: 0, run: false, jump: false }, startTime: 0, elapsed: 0, levelsDone: 0, totalShrink: 1,
  metPeople: new Set(), seenPhotos: new Set(), levelStart: 0, par: 90, slowmo: 0, celTimer: 0, turn: 0, touchFire: false, dtLast: 0.016,
  auto: false, autoWait: 0, autoStuck: 0, autoLast: null, autoSide: 0, autoJet: 0,
  stepT: 0, packetNear: false, packetHits: 0, near: null, gateReady: false, hintT: 0, clones: [],
  jetUsed: false, jetTipT: 10, // 제트팩을 아직 써 보지 않은 사람에게 공중에서 안내를 띄우는 데 쓰는 시간(초)
  tapTime: {}, runLatch: false, // 방향키 두 번 연타 → 달리기 유지(멈추면 해제)
};
const MOVE_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

// ---------- 입력 ----------
window.addEventListener('keydown', (e) => {
  if (e.target && e.target.closest && e.target.closest('input, textarea, select')) return;
  G.keys[e.code] = true;
  if (G.state === 'video' && e.code === 'Escape') { closeVideo(); return; }
  if (G.state !== 'play') return;
  if (MOVE_KEYS.has(e.code) && !e.repeat) { const now = performance.now(); if (now - (G.tapTime[e.code] || 0) < 320) G.runLatch = true; G.tapTime[e.code] = now; }
  if (e.code === 'Space') { G.input.jump = true; e.preventDefault(); }
  if (e.code === 'KeyX') G.input.crouchToggle = true;
  if (e.code === 'KeyQ') G.input.dash = true;
  if (e.code === 'KeyB') G.input.skateToggle = true;
  if (e.code === 'KeyR') G.input.fire = true;
  if (e.code === 'KeyZ') G.input.punch = true;
  if (e.code === 'KeyG') G.input.missile = true; // 20260913 jwjeong 미사일
  if (e.code === 'KeyP') setAuto(!G.auto);
  if (e.code === 'KeyE') interact();
  if (e.code === 'KeyC') cycleView();
  if (e.code === 'KeyB') setTimeout(() => hud.narrateNow(G.player.skate ? t('skate.on') : t('skate.off'), { who: 'SKATE', dur: 3 }), 30);
  if (e.code === 'Tab') { e.preventDefault(); hud.toggleCodex(); }
  if (e.code === 'KeyV') { if (G.lastTerm && VIDEOS[G.lastTerm]?.length) openVideo(VIDEOS[G.lastTerm][0], { title: t('video.term', { term: TERMS[G.lastTerm].en }), list: VIDEOS[G.lastTerm], meta: VIDEOS[G.lastTerm][0].why || '' }); }
  if (e.code === 'KeyM') { audio.init(); const on = audio.toggle(); hud.narrateNow(on ? t('music.on') + (audio.trackTitle ? ' · ' + audio.trackTitle : '') : t('music.off'), { who: 'SYSTEM', dur: 2 }); renderMusicWidget(); }
  if (e.code === 'KeyK') { hud.kid = !hud.kid; hud.narrateNow(t('kid.mode') + ': ' + (hud.kid ? 'ON' : 'OFF'), { who: 'SYSTEM', dur: 1.5 }); }
  if (e.code === 'KeyH') toggleKeys();
  if (e.code === 'Escape') { hud.toggleCodex(false); $('top-menu-list').classList.add('hidden'); toggleKeys(false); closeVideo(); }
});
window.addEventListener('keyup', (e) => { G.keys[e.code] = false; });
// 마우스 드래그 시점
let drag = null;
renderer.domElement.addEventListener('pointerdown', (e) => { if (G.state !== 'play') return; audio.init(); drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, id: e.pointerId, t: performance.now() }; });
window.addEventListener('pointermove', (e) => { if (!drag || e.pointerId !== drag.id) return; rig.rotate(e.clientX - drag.x, e.clientY - drag.y); drag.x = e.clientX; drag.y = e.clientY; });
window.addEventListener('pointerup', (e) => { if (drag && e.pointerId === drag.id) { const moved = Math.hypot(e.clientX - (drag.sx ?? e.clientX), e.clientY - (drag.sy ?? e.clientY)); drag = null; if (moved < 6 && G.state === 'play' && e.target === renderer.domElement) pickNPC(e.clientX, e.clientY); } });
const _ray = new THREE.Raycaster(); const _ndc = new THREE.Vector2();
function isPartOfPlayer(o) { let x = o; while (x) { if (x === G.player?.mesh) return true; if (G.clones.some((c) => c.mesh === x)) return true; x = x.parent; } return false; }
/** 화면 클릭 → 인물 / 회사 간판 / 구조물 순으로 찾아 모달을 연다 */
function pickNPC(cx, cy) {
  _ndc.set((cx / window.innerWidth) * 2 - 1, -(cy / window.innerHeight) * 2 + 1); _ray.setFromCamera(_ndc, camera);
  const n = npcs.pick(_ray); if (n) { openPerson(n.person); return; }
  const hits = _ray.intersectObjects(scene.children, true);
  for (const h of hits) {
    const o0 = h.object;
    if (o0.isSprite || o0.isPoints || o0.isLine || o0.userData.isLabel || isPartOfPlayer(o0)) continue; // 라벨·먼지·선·내 캐릭터는 무시
    let o = o0, tagged = null;
    while (o) { if (o.userData.boardVideo) { tagged = { kind: 'board', v: o.userData.boardVideo }; break; } if (o.userData.logo) { tagged = { kind: 'logo', v: o.userData.logo }; break; } if (o.userData.term) { tagged = { kind: 'term', v: o.userData.term }; break; } o = o.parent; }
    if (tagged) {
      if (tagged.kind === 'board') { score.add('video', t('score.video'), { combo: false }); openVideo(tagged.v, { title: `${G.def.id} · ${L(G.def.name)}`, meta: t('board.videoMeta'), list: boardVideoList() }); }
      else if (tagged.kind === 'logo') openCompany(tagged.v);
      else openObject(tagged.v);
      return;
    }
    if (o0.isMesh && o0.material && o0.material.transparent !== true) return; // 태그 없는 불투명 물체에 가로막힘
  }
}
/** 한 층에 딸린 영상 전부: 용어 영상 → 이 층 인물의 영상 → 같은 챕터의 다른 층 영상 순서로 모은다.
 *  안내판이 하나도 비지 않도록, 마지막에는 챕터 안의 아무 영상이라도 끌어온다. */
function videosFor(lv) {
  if (!lv) return [];
  const out = []; const seen = new Set();
  const push = (v) => { if (v && v.id && !seen.has(v.id)) { seen.add(v.id); out.push(v); } };
  for (const k of (lv.terms || [])) for (const v of (VIDEOS[k] || [])) push(v);
  for (const p of PEOPLE) if ((p.areas || []).includes(lv.id)) push(p.video);
  if (!out.length) {
    for (const other of EVERY_LEVEL) {
      if (other.id === lv.id || other.chapter !== lv.chapter) continue;
      for (const k of (other.terms || [])) for (const v of (VIDEOS[k] || [])) push(v);
      if (out.length) break;
    }
  }
  if (!out.length) for (const p of PEOPLE) { push(p.video); if (out.length) break; }
  return out.slice(0, 8);
}
/** 안내판 모달에서 고를 수 있는 현재 층의 영상 목록 */
function boardVideoList() { return videosFor(G.def); }
/** 회사 간판 클릭: 설명 + 홈페이지 링크 */
function openCompany(logo) {
  const c = { ...COMPANIES_HW, ...COMPANIES_AI }[logo.brand] || {}; const cc = COUNTRIES[c.country || logo.country] || {};
  const links = []; if (c.url) links.push({ href: c.url, label: t('company.site') }); if (c.wiki) links.push({ href: c.wiki, label: 'Wikipedia' });
  openVideo(null, { title: `${cc.flag || ''} ${c.name || logo.brand}`, meta: `${L(logo.role || '')}${c.founded ? ` · ${t('company.founded', { y: c.founded })}` : ''}${c.hq ? ` · ${c.hq}` : ''}<br>${esc(L(c.desc || ''))}`, links, html: true });
}
/** 구조물 클릭: 용어 설명 + 실제 사진 + 설명 영상 */
function openObject(term) {
  const T = TERMS[term]; if (!T) return; const vids = VIDEOS[term] || []; const photos = PHOTOS[term] || [];
  G.lastTerm = term;
  if (!hud.found.has(term)) { hud.showTerm(term, G.def.id); G.fired.add(term); score.add('termNew', T.ko); checkGate(); }
  if (photos.length && !G.seenPhotos.has(term)) { G.seenPhotos.add(term); score.add('photo', t('score.photo'), { combo: false }); }
  openVideo(vids[0] || null, { title: `${T.en} · ${T.ko}`, meta: `${esc(L(T.desc))}${T.fact ? `<br><span style="color:#c9e6a0">● ${esc(L(T.fact))}</span>` : ''}`, list: vids, photos, html: true });
}
renderer.domElement.addEventListener('wheel', (e) => { if (G.state === 'play') rig.zoom(e.deltaY * 0.004); }, { passive: true });
// 터치 조이스틱
(function touch() {
  const zone = $('joy-zone'), knob = $('joy-knob'); let jid = null, cx = 0, cy = 0;
  zone.addEventListener('pointerdown', (e) => { if (jid !== null) return; jid = e.pointerId; cx = e.clientX; cy = e.clientY; zone.setPointerCapture(jid); audio.init(); });
  zone.addEventListener('pointermove', (e) => { if (e.pointerId !== jid) return; const dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.min(45, Math.hypot(dx, dy)); const a = Math.atan2(dy, dx); knob.style.transform = `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px)`; G.touchMove = { x: Math.cos(a) * d / 45, y: -Math.sin(a) * d / 45, run: d > 38 }; });
  const end = (e) => { if (e.pointerId !== jid) return; jid = null; knob.style.transform = ''; G.touchMove = null; };
  zone.addEventListener('pointerup', end); zone.addEventListener('pointercancel', end);
  $('tb-jump').addEventListener('pointerdown', () => { G.input.jump = true; }); $('tb-jet').addEventListener('pointerdown', () => { G.touchJet = true; }); $('tb-jet').addEventListener('pointerup', () => { G.touchJet = false; }); $('tb-jet').addEventListener('pointercancel', () => { G.touchJet = false; }); $('tb-x').addEventListener('pointerdown', () => { G.input.crouchToggle = true; }); $('tb-b').addEventListener('pointerdown', () => { G.input.skateToggle = true; });
  // 좌우 회전 패드 (누르고 있는 동안 시점이 돈다)
  const hold = (id, on, off) => { const b = $(id); b.addEventListener('pointerdown', (e) => { e.preventDefault(); on(); }); ['pointerup', 'pointercancel', 'pointerleave'].forEach((k) => b.addEventListener(k, off)); };
  hold('tb-left', () => { G.turn = -1; }, () => { G.turn = 0; });
  hold('tb-right', () => { G.turn = 1; }, () => { G.turn = 0; });
  $('tb-run').addEventListener('pointerdown', (e) => { e.preventDefault(); G.runLatch = !G.runLatch; $('tb-run').classList.toggle('on', G.runLatch); });
  hold('tb-fire', () => { G.touchFire = true; G.input.fire = true; }, () => { G.touchFire = false; });
  $('tb-punch').addEventListener('pointerdown', (e) => { e.preventDefault(); G.input.punch = true; });
  $('tb-missile').addEventListener('pointerdown', (e) => { e.preventDefault(); G.input.missile = true; });
  $('tb-fire').addEventListener('pointerdown', () => { G.input.fire = true; });
  $('tb-fire').addEventListener('pointerup', () => { G.input.fire = false; });
  $('tb-fire').addEventListener('pointercancel', () => { G.input.fire = false; }); $('tb-e').addEventListener('pointerdown', interact); $('tb-c').addEventListener('pointerdown', cycleView); $('tb-tab').addEventListener('pointerdown', () => hud.toggleCodex());
  // 오른쪽 화면 드래그로 시점 (조이스틱/버튼 외)
  window.addEventListener('pointerdown', (e) => { if (document.documentElement.classList.contains('is-mobile') && G.state === 'play' && !e.target.closest('#joy-zone, #touch-buttons, button')) drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, id: e.pointerId }; });
})();

function readInput() {
  const k = G.keys; let x = 0, y = 0;
  if (k.KeyW || k.ArrowUp) y += 1; if (k.KeyS || k.ArrowDown) y -= 1; if (k.KeyD || k.ArrowRight) x += 1; if (k.KeyA || k.ArrowLeft) x -= 1;
  if (G.touchMove) { x = G.touchMove.x; y = G.touchMove.y; }
  if (x === 0 && y === 0) G.runLatch = false; // 멈추면 달리기 해제
  G.input.jet = !!(k.KeyF || G.touchJet);
  if (k.KeyR || G.touchFire) G.input.fire = true;
  if (G.turn) rig.yaw += G.turn * 2.2 * (G.dtLast || 0.016);
  G.input.x = x; G.input.y = y; G.input.run = !!(k.ShiftLeft || k.ShiftRight || G.runLatch || (G.touchMove && G.touchMove.run));
}
function cycleView() { const m = rig.cycle(); hud.narrateNow(t('view.' + m), { who: 'CAMERA', dur: 1.2 }); }
/** 전체 조작 안내 패널 (H). v 를 생략하면 열림/닫힘을 뒤집는다. */
function toggleKeys(v) { const el = $('keys-panel'); const open = v === undefined ? el.classList.contains('hidden') : !!v; el.classList.toggle('hidden', !open); }
$('keys-close').addEventListener('click', () => toggleKeys(false));
$('keys-panel').addEventListener('click', (e) => { if (e.target.id === 'keys-panel') toggleKeys(false); });

// ---------- 화면 전환 ----------
function showScreen(id) {
  for (const s of ['title-screen', 'select-screen', 'ending-screen']) $(s).classList.toggle('hidden', s !== id);
  $('lang-bar').classList.toggle('hidden', id === null);
  if (id === 'title-screen') audio.playFor('title');
  else if (id === 'select-screen') audio.playFor('select');
  else if (id === 'ending-screen') audio.playFor('ending');
}
$('btn-start').addEventListener('click', () => { audio.init(); G.state = 'select'; showScreen('select-screen'); renderSelect(); });
$('btn-back').addEventListener('click', () => { G.state = 'title'; showScreen('title-screen'); });
$('btn-go').addEventListener('click', startGame);
$('btn-again').addEventListener('click', () => { G.state = 'select'; showScreen('select-screen'); renderSelect(); });
$('btn-share').addEventListener('click', saveShareCard);
$('menu-toggle').addEventListener('click', (e) => { e.stopPropagation(); $('music-list').classList.add('hidden'); $('top-menu-list').classList.toggle('hidden'); renderMenu(); });
window.addEventListener('pointerdown', (e) => { if (!e.target.closest('#top-menu')) $('top-menu-list').classList.add('hidden'); });
$('menu-select').addEventListener('click', () => { leaveGame(); G.state = 'select'; showScreen('select-screen'); renderSelect(); });
$('menu-home').addEventListener('click', () => { leaveGame(); G.state = 'title'; showScreen('title-screen'); });

// ---------- 선택 화면 ----------
const previewDisposers = [];
function renderSelect() {
  const wrap = $('char-cards'); wrap.innerHTML = ''; previewDisposers.forEach((d) => d()); previewDisposers.length = 0;
  for (const ch of CHARACTERS) {
    const card = document.createElement('div'); card.className = 'char-card' + (ch === G.char ? ' selected' : '');
    const cv = document.createElement('canvas'); cv.width = 300; cv.height = 260; card.appendChild(cv);
    card.insertAdjacentHTML('beforeend', `<div class="cc-name">${L(ch.name)}</div><div class="cc-job">${L(ch.job)}</div><div class="cc-desc">${L(ch.desc)}</div><div class="cc-perk">★ ${L(ch.perk)}</div>`);
    card.addEventListener('click', () => { G.char = ch; wrap.querySelectorAll('.char-card').forEach((c) => c.classList.remove('selected')); card.classList.add('selected'); });
    wrap.appendChild(card); previewDisposers.push(renderPreview(cv, ch));
  }
  const sel = $('opt-gpu'); sel.innerHTML = ''; for (const g of GPUS) { const o = document.createElement('option'); o.value = g.id; o.textContent = g.name; sel.appendChild(o); } sel.value = G.gpu.id;
  sel.onchange = () => { G.gpu = GPUS.find((g) => g.id === sel.value) || GPUS[0]; renderGpuSummary(); }; renderGpuSummary();
  $('opt-mode').value = G.mode; $('opt-mode').onchange = (e) => { G.mode = e.target.value; };
  $('opt-theme').value = G.theme; $('opt-theme').onchange = (e) => { G.theme = e.target.value; $('opt-mode').disabled = G.theme === 'ai'; $('opt-gpu').disabled = G.theme === 'ai'; }; $('opt-mode').disabled = G.theme === 'ai'; $('opt-gpu').disabled = G.theme === 'ai';
  $('opt-view').value = G.view; $('opt-view').onchange = (e) => { G.view = e.target.value; };
  $('opt-auto').checked = G.auto; $('opt-auto').onchange = (e) => { G.auto = e.target.checked; };
}
function renderGpuSummary() { const g = G.gpu; $('gpu-summary').innerHTML = `<b>${g.name}</b> · ${L(g.arch)} · ${g.process} · ${g.transistors} ${LANG === 'ko' ? '트랜지스터' : 'transistors'} · ${g.dieMm2} · SM ${g.sms} · CUDA ${g.cudaCores} · Tensor ${g.tensorCores} · L2 ${g.l2} · ${g.memory} ${g.memBw}<br><span style="color:#8a9bb8">${L(g.blurb)}</span>`; }
function renderPreview(canvas, ch) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); r.setPixelRatio(1); r.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(28, canvas.width / canvas.height, 0.1, 50); cam.position.set(0.15, 1.25, 2.9); cam.lookAt(0, 1.08, 0);
  sc.add(new THREE.HemisphereLight(0xffffff, 0x223344, 1.2)); const dl = new THREE.DirectionalLight(0xffffff, 1.5); dl.position.set(2, 4, 3); sc.add(dl);
  const m = buildHumanoid(ch); sc.add(m); let alive = true; let tt = 0;
  const loop = () => { if (!alive) return; tt += 0.016; m.rotation.y = Math.sin(tt * 0.8) * 0.6; const p = m.userData.parts; p.armL.rotation.x = Math.sin(tt * 2) * 0.15; p.armR.rotation.x = -Math.sin(tt * 2) * 0.15; r.render(sc, cam); requestAnimationFrame(loop); };
  loop(); return () => { alive = false; r.dispose(); };
}

// ---------- 게임 시작 / 층 로드 ----------
function startGame() {
  previewDisposers.forEach((d) => d()); previewDisposers.length = 0;
  G.seq = G.theme === 'ai' ? AI_LEVELS : (G.mode === 'prologue' ? ALL_LEVELS : LEVELS); G.idx = 0; G.levelsDone = 0; G.totalShrink = 1; G.startTime = performance.now(); G.elapsed = 0;
  showScreen(null); $('top-menu').classList.remove('hidden'); hud.show(true); $('lang-bar').classList.add('hidden');
  if (!G.player) { G.player = new Player(scene, G.char); } else { scene.remove(G.player.mesh); G.player = new Player(scene, G.char); }
  score.reset(); G.metPeople = new Set(); G.seenPhotos = new Set();
  hud.kid = !!G.char.kid; hud.showPacket = !!G.char.showPacket;
  if (G.mode === 'descent') G.totalShrink = 1100; // 아스트라가 먼저 ×1,100 축소
  rig.setMode(G.view); G.state = 'play'; audio.init();
  loadLevel(0, true);
  hud.narrate(t('astra.intro'));
  G.jetUsed = false; G.jetTipT = 10; hud.narrate(t('jet.narr'), { who: 'JETPACK', dur: 6, hint: true });
  $('auto-btn').classList.toggle('on', G.auto); if (G.auto) hud.narrate(t('auto.on'), { who: 'AUTO', dur: 3 });
}
function leaveGame() { clearClones(); npcs.clear(); items.clear(); combat.clear(); closeVideo(); toggleKeys(false); if (G.level) { G.level.dispose(); G.level = null; } hud.show(false); $('top-menu').classList.add('hidden'); hud.toggleCodex(false); $('lang-bar').classList.remove('hidden'); audio.stopDrone(); }
function loadLevel(i, first = false) {
  if (G.level) G.level.dispose();
  const raw = typeof i === 'string' ? findLevel(i) : G.seq[i]; if (!raw) return; if (typeof i === 'number') G.idx = i; else { const k = G.seq.indexOf(raw); if (k >= 0) G.idx = k; }
  const sub = R(raw.subtitle, G.gpu);
  const narr = (typeof raw.narration === 'function' ? raw.narration(G.gpu) : raw.narration) || [];
  const boardVids = videosFor(raw);
  const boardVideo = boardVids[0] || null;
  const boardInfo = {
    video: boardVideo, videoCount: boardVids.length, nudge: t('board.nudge'),
    title: `${raw.id} · ${L(raw.name)}`,
    subtitle: sub,
    body: R(narr[0], G.gpu) || L(raw.objective || ''),
    bullets: (raw.terms || []).filter((k) => TERMS[k]).slice(0, 4).map((k) => `${TERMS[k].ko}: ${L(TERMS[k].kid || TERMS[k].analogy || TERMS[k].fact || '')}`),
    accent: raw.chapter === 'ai' ? '#c3b1ff' : raw.chapter === 'prologue' ? '#ffd166' : raw.chapter === 'hbm' ? '#b56cff' : '#76b900',
  };
  const def = { ...raw, boardInfo, subtitle: sub ? { ko: sub, en: sub } : null, sideGate: typeof raw.sideGate === 'function' ? raw.sideGate(G.gpu) : raw.sideGate, gateY: typeof raw.gateY === 'function' ? raw.gateY(G.gpu) : raw.gateY }; G.def = def;
  G.firedMap = G.firedMap || {}; G.fired = G.firedMap[def.id] || new Set(); G.firedMap[def.id] = G.fired; G.packetHits = 0; G.gateReady = false; G.hintT = 25; G.autoWait = 2.5; G.autoStuck = 0; G.autoLast = null; G.autoTries = 0; G.player.crouch = false;
  G.level = new Level(def, G.gpu, scene, renderer);
  const facts = (def.terms || []).flatMap((k) => TERMS[k] ? [L(TERMS[k].kid), L(TERMS[k].fact)] : []).filter(Boolean);
  npcs.load(def.id, PEOPLE, G.level.size, [G.level.spawn, [G.level.gatePos.x, G.level.gatePos.z]], facts);
  // 캐릭터 특성: 층별 이동 속도 / 점프
  const ch = G.char; let mul = ch.speedMul || 1;
  if (ch.warpSpeed && (def.id === 'L6' || def.id === 'L7')) mul *= ch.warpSpeed;
  if (ch.prologueSpeed && def.chapter === 'prologue') mul *= ch.prologueSpeed;
  G.player.speedMul = mul; G.player.jumpV = 7.5 * (ch.jumpMul || 1); G.player.mesh.scale.setScalar(ch.scale || 1);
  G.levelTerms = (def.terms || []).filter((k) => TERMS[k]);
  const p = G.player; p.colliders = G.level.colliders; p.bounds = G.level.size * 1.1; p.reset(G.level.spawn[0], G.level.spawn[1], Math.PI);
  rig.colliders = G.level.colliders; rig.yaw = Math.PI; rig.pitch = 0.24; rig.startIntro(G.level.size);
  // 코인마다 이 층의 지식 한 조각을 담는다 (사실 한 줄 → 비유 → 설명 순서로 섞어 담는다)
  const coinFacts = [];
  for (const k of G.levelTerms) {
    const T = TERMS[k]; if (!T) continue;
    if (T.kid) coinFacts.push(`<b>${T.ko}</b> · ${L(T.kid)}`);       // 쉬운 말을 먼저
    if (T.analogy) coinFacts.push(`<b>${T.ko}</b> · ${L(T.analogy)}`); // 그다음 비유
    if (T.fact) coinFacts.push(`<b>${T.ko}</b> · ${L(T.fact)}`);       // 마지막에 숫자
  }
  items.spawn(G.level, (x, z, y) => p.floorAt(x, z, y), { facts: coinFacts, pathCoins: IS_MOBILE ? 16 : 26, scatterCoins: IS_MOBILE ? 12 : 22, pads: IS_MOBILE ? 3 : 4, ramps: IS_MOBILE ? 2 : 3 });
  combat.spawn(G.level, (x, z, y) => p.floorAt(x, z, y), { mobile: IS_MOBILE });
  villainHudRows = 0; // 층이 바뀌면 빌런 체력 줄을 다시 만든다
  // 목표 시간: 층 크기와 볼거리 수로 정한다 (넘겨도 실패는 없고 보너스만 사라진다)
  G.levelStart = performance.now();
  G.par = Math.round(45 + G.levelTerms.length * 12 + G.level.size * 0.35);
  G.parBonusGiven = false; // 충돌 상자가 준비된 뒤라야 구조물 위에도 코인이 놓인다
  const hm = def.heightM ?? 1.7;
  hud.levelTitle(def, hm); hud.updateTermCount(G.levelTerms);
  if (def.chapter === 'hbm') { G.level.setGateOpen(false); }
  hud.depth(G.idx, G.seq.length, def.id);
  const nar = typeof def.narration === 'function' ? def.narration(G.gpu) : def.narration;
  if (!first) hud.narQueue.length = 0;
  for (const n of nar || []) hud.narrate(R(n, G.gpu));
  if (G.char.intro && G.char.intro[def.id]) hud.narrate(L(G.char.intro[def.id]), { who: L(G.char.name).toUpperCase(), hint: true });
  audio.playFor(def.id); // 층에 맞는 배경음악으로 크로스페이드
  // 워프 층: 31명의 분신이 같은 명령(입력)을 동시에 수행한다 (SIMT)
  clearClones();
  if (def.id === 'L7') { const cloneN = IS_MOBILE ? 12 : 32; for (let k = 0; k < cloneN; k++) { if (k === (cloneN >> 1)) continue; const m = buildHumanoid(G.char); m.scale.setScalar(ch.scale || 1); m.traverse((o) => { o.castShadow = false; }); scene.add(m); G.clones.push({ mesh: m, lane: (k - (cloneN >> 1)) * (32 / cloneN) }); } }
  checkGate();
  renderMenu();
}
function clearClones() { for (const c of G.clones || []) scene.remove(c.mesh); G.clones = []; }
const CLONE_PARTS = ['torso', 'head', 'armL', 'armR', 'foreL', 'foreR', 'legL', 'legR', 'shinL', 'shinR', 'tail'];
function updateClones() {
  const p = G.player; const src = p.mesh.userData.parts;
  for (const c of G.clones) { const m = c.mesh; m.position.set(p.pos.x + c.lane * 1.7, p.pos.y, p.pos.z); m.rotation.y = p.yaw; m.visible = true;
    const d = m.userData.parts; for (const k of CLONE_PARTS) { if (src[k] && d[k]) { d[k].rotation.copy(src[k].rotation); d[k].position.copy(src[k].position); } } }
}
function checkGate() {
  const def = G.def; const need = def.gate?.required ?? Math.min(3, G.levelTerms.length); const n = hud.updateTermCount(G.levelTerms);
  const open = n >= need; if (open && !G.level.gateOpen) { G.level.setGateOpen(true); if (G.gateReady) { audio.gateOpen(); hud.narrate(t('astra.gateHint'), { hint: true }); } } G.gateReady = true; return open;
}
function interact() {
  if (G.state !== 'play' || !G.level) return; audio.init();
  // 20260913 jwjeong E 는 원래 상호작용 키다. 빌런이 주먹 거리 안에 있을 때만 주먹으로 바꿔 준다.
  // 이렇게 해야 키를 새로 외우지 않고도 "가까우면 E 로 때린다" 가 성립하고, 대화나 용어 카드가 막히지 않는다.
  if (combat.villainInReach(G.player)) { doPunch(G.player); return; }
  const p = G.player.pos; const lv = G.level;
  const npc = npcs.nearest(p); if (npc) { openPerson(npc.person); return; }
  if (lv.boardPos && p.distanceTo(lv.boardPos) < 9 && G.def.boardInfo && G.def.boardInfo.video) {
    score.add('video', t('score.video'), { combo: false });
    openVideo(G.def.boardInfo.video, { title: `${G.def.id} · ${L(G.def.name)}`, meta: t('board.videoMeta'), list: boardVideoList() });
    return;
  }
  if (lv.sideGatePos && p.distanceTo(lv.sideGatePos) < 4.5) { enterSide(G.def.sideGate.target); return; }
  if (p.distanceTo(lv.gatePos) < 4.5) { if (lv.gateOpen) { beginShrink(); } else { audio.deny(); const need = (G.def.gate?.required ?? Math.min(3, G.levelTerms.length)) - hud.updateTermCount(G.levelTerms); hud.narrateNow(t('hud.gateLocked', { n: Math.max(1, need) }), { who: 'GATE', dur: 3 }); } return; }
  const tr = lv.nearTrigger(p.x, p.z, new Set()); // 이미 본 것도 다시 볼 수 있음
  if (tr) { const isNew = hud.showTerm(tr.term, G.def.id); G.lastTerm = tr.term; if (isNew) audio.newCard(); else audio.card(); score.add(isNew ? 'termNew' : 'termAgain', TERMS[tr.term].ko); G.fired.add(tr.term); checkGate(); }
}
function beginShrink() {
  const def = G.def; const next = def.next ? findLevel(def.next) : G.seq[G.idx + 1];
  G.state = 'shrink'; G.player.frozen = true;
  const ov = $('shrink-overlay'); ov.classList.remove('hidden'); ov.classList.remove('active'); void ov.offsetWidth; ov.classList.add('active');
  const f = def.shrink || 1; const isEnter = def.chapter === 'prologue' && !def.shrink;
  ov.querySelector('.shrink-text').textContent = isEnter ? t('shrink.enter') : t('shrink.text'); ov.querySelector('.shrink-factor').textContent = !next ? 'THE FLOOR' : ((isEnter || def.chapter === 'hbm' || (next && next.chapter === 'hbm')) ? next.name.en : '×' + fmtNum(f));
  if (!isEnter && def.chapter !== 'hbm') G.totalShrink *= f; if (def.chapter !== 'prologue' && def.chapter !== 'hbm') G.levelsDone++;
  const left = items.remaining(), got = items.total() - left;
  score.add('stage', t('score.stage'), { combo: false, scale: 1 + got / Math.max(1, items.total()) }); // 코인을 많이 먹었으면 보너스
  const spent = (performance.now() - G.levelStart) / 1000;
  if (spent < G.par) { const sec = Math.round(G.par - spent); score.add('timeBonus', t('score.timeBonus') + ' ' + formatTime(spent), { combo: false, scale: sec }); } // 목표 안에 통과하면 남은 초만큼
  if (!isEnter) audio.shrink();
  // 카메라 돌진 연출
  const startDist = rig.dist; let tt = 0;
  const anim = () => { tt += 0.016; if (rig.mode === 'third') rig.dist = Math.max(0.4, startDist - tt * 4); camera.fov = BASE_FOV + tt * 30; camera.updateProjectionMatrix(); if (tt < 1.25) requestAnimationFrame(anim); };
  anim();
  setTimeout(() => {
    rig.dist = startDist; camera.fov = BASE_FOV; camera.updateProjectionMatrix();
    if (!next) { endGame(); return; }
    if (def.next) loadLevel(def.next); else loadLevel(G.idx + 1); G.player.frozen = false; G.state = 'play';
  }, 1300);
  setTimeout(() => ov.classList.add('hidden'), 2300);
}
function fmtNum(n) { return Number.isInteger(n) ? n.toLocaleString() : String(n); }
function endGame() {
  G.state = 'ending'; leaveGame(); $('shrink-overlay').classList.add('hidden');
  G.elapsed = (performance.now() - G.startTime) / 1000;
  const last = G.seq[G.seq.length - 1] || LEVELS[LEVELS.length - 1];
  score.save();
  const rows = [[t('ending.score'), score.value.toLocaleString()], [t('ending.best'), score.best.toLocaleString()], [t('ending.maxCombo'), '×' + Math.min(8, 1 + score.maxCombo * 0.5).toFixed(1)], [t('ending.coins'), String(score.stats.coins)], [t('ending.people'), String(score.stats.people)], [t('ending.tricks'), String(score.stats.tricks)], [t('ending.gpu'), G.gpu.name], [t('ending.char'), L(G.char.name)], [t('ending.levels'), String(G.levelsDone)], [t('ending.terms'), hud.found.size + ' / ' + Object.keys(TERMS).length], [t('ending.shrink'), '×' + Math.round(G.totalShrink).toLocaleString()], [t('ending.height'), last.heightM ? fmtLen(last.heightM) : '—'], [t('ending.time'), formatTime(G.elapsed)]];
  $('ending-stats').innerHTML = rows.map(([k, v]) => `<span class="k">${k}</span><span class="v">${v}</span>`).join('');
  $('ending-quote').textContent = t('ending.quote');
  const r = score.rank(); $('ending-rank').className = 'rank-badge rank-' + r; $('ending-rank').textContent = r;
  $('ending-final').textContent = score.value.toLocaleString() + ' P';
  showScreen('ending-screen');
}
function saveShareCard() {
  const cv = $('share-canvas'); const ctx = cv.getContext('2d'); const W = cv.width, H = cv.height;
  const grd = ctx.createLinearGradient(0, 0, W, H); grd.addColorStop(0, '#04070f'); grd.addColorStop(1, '#0b2a12'); ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#76b900'; ctx.lineWidth = 6; ctx.strokeRect(20, 20, W - 40, H - 40);
  ctx.fillStyle = '#76b900'; ctx.font = '700 28px Orbitron, sans-serif'; ctx.fillText('GPU DESCENT · INTO THE SILICON', 60, 80);
  ctx.fillStyle = '#fff'; ctx.font = '900 64px Orbitron, "Noto Sans KR", sans-serif'; ctx.fillText(LANG === 'ko' ? '바닥에 도착했다' : 'I REACHED THE FLOOR', 60, 170);
  ctx.font = '400 30px "Noto Sans KR", sans-serif'; ctx.fillStyle = '#cfe6ff';
  const lines = [`${G.gpu.name} · ${L(G.char.name)}`, `${t('ending.score')}: ${score.value.toLocaleString()} P  (${score.rank()})`, `${t('ending.shrink')}: ×${Math.round(G.totalShrink).toLocaleString()}`, `${t('ending.height')}: ${(G.seq[G.seq.length - 1] || {}).heightM ? fmtLen(G.seq[G.seq.length - 1].heightM) : '—'}`, `${t('ending.terms')}: ${hud.found.size}`, `${t('ending.time')}: ${formatTime(G.elapsed)}`];
  lines.forEach((l, i) => ctx.fillText(l, 60, 250 + i * 50));
  ctx.fillStyle = '#ffd166'; ctx.font = '400 22px "Noto Sans KR", sans-serif'; ctx.fillText(LANG === 'ko' ? '실제 NVIDIA GPU 구조 · 화이트페이퍼/논문 기반' : 'Real NVIDIA GPU structure · from whitepapers & papers', 60, H - 60);
  const a = document.createElement('a'); a.download = 'gpu-descent-result.png'; a.href = cv.toDataURL('image/png'); a.click(); hud.narrateNow(t('share.saved'), { who: 'SYSTEM', dur: 2 });
}
function enterSide(targetId) {
  const next = findLevel(targetId); if (!next) return;
  G.state = 'shrink'; G.player.frozen = true; audio.gateOpen();
  const ov = $('shrink-overlay'); ov.classList.remove('hidden'); ov.classList.remove('active'); void ov.offsetWidth; ov.classList.add('active');
  ov.querySelector('.shrink-text').textContent = t('shrink.enter'); ov.querySelector('.shrink-factor').textContent = next.name.en;
  setTimeout(() => { loadLevel(targetId); G.player.frozen = false; G.state = 'play'; }, 1300);
  setTimeout(() => ov.classList.add('hidden'), 2300);
}
// ---------- 오토 모드: 용어를 모두 방문한 뒤 게이트로 내려간다 ----------
function setAuto(v) { G.auto = !!v; $('auto-btn').classList.toggle('on', G.auto); hud.narrateNow(G.auto ? t('auto.on') : t('auto.off'), { who: 'AUTO', dur: 2 }); if (!G.auto) { G.input.x = 0; G.input.y = 0; G.input.jet = false; } }
function autoStep(dt) {
  if (!G.auto || G.state !== 'play' || !G.level) return;
  const lv = G.level, p = G.player; const inp = G.input;
  if (G.autoWait > 0) { G.autoWait -= dt; inp.x = 0; inp.y = 0; inp.run = false; return; }
  // 목표: 아직 안 본 용어 트리거 중 가장 가까운 것, 없으면 게이트
  let target = null, tr = null, bd = Infinity;
  for (const g of lv.triggers) { if (G.fired.has(g.term)) continue; const d = Math.hypot(g.x - p.pos.x, g.z - p.pos.z); if (d < bd) { bd = d; tr = g; } }
  if (tr) target = { x: tr.x, z: tr.z, r: tr.r * 0.9 };
  else { // 용어를 다 봤으면 가까운 코인을 줍고, 코인도 없으면 게이트로
    let cb = 26, cp = null;
    for (const [cx2, cz2] of items.points()) { const d = Math.hypot(cx2 - p.pos.x, cz2 - p.pos.z); if (d < cb) { cb = d; cp = [cx2, cz2]; } }
    target = cp ? { x: cp[0], z: cp[1], r: 1.6 } : { x: lv.gatePos.x, z: lv.gatePos.z, r: 3.5 };
  }
  const dx = target.x - p.pos.x, dz = target.z - p.pos.z; const dist = Math.hypot(dx, dz);
  if (dist <= target.r) {
    inp.x = 0; inp.y = 0; inp.run = false;
    if (tr) { G.fired.add(tr.term); const isNew = hud.showTerm(tr.term, G.def.id); G.lastTerm = tr.term; if (isNew) audio.newCard(); else audio.card(); checkGate(); G.autoWait = 3.2; }
    else if (lv.gateOpen) { G.autoWait = 1.5; beginShrink(); }
    else { G.autoWait = 1; }
    return;
  }
  // 카메라를 목표 쪽으로 돌리고, 카메라 기준 입력으로 변환
  const want = Math.atan2(dx, dz); rig.yaw += Math.atan2(Math.sin(want - rig.yaw), Math.cos(want - rig.yaw)) * Math.min(1, dt * 3);
  const ux = dx / dist, uz = dz / dist; const fx = Math.sin(rig.yaw), fz = Math.cos(rig.yaw), rx = -Math.cos(rig.yaw), rz = Math.sin(rig.yaw);
  inp.y = ux * fx + uz * fz; inp.x = ux * rx + uz * rz; inp.run = dist > 8;
  // 막힘 감지: 0.8초 동안 거의 못 움직이면 점프 → 옆걸음 → 제트팩 순으로 시도
  if (G.autoLast) { const moved = Math.hypot(p.pos.x - G.autoLast.x, p.pos.z - G.autoLast.z); G.autoStuck = moved < 0.2 * dt ? G.autoStuck + dt : Math.max(0, G.autoStuck - dt * 0.5); }
  G.autoLast = { x: p.pos.x, z: p.pos.z };
  if (G.autoSide > 0) { G.autoSide -= dt; inp.x = Math.sign(G.autoSideDir || 1); }
  if (G.autoJet > 0) { G.autoJet -= dt; inp.jet = true; }
  if (G.autoStuck > 0.8) { G.autoStuck = 0; G.autoTries = (G.autoTries || 0) + 1; if (G.autoTries % 3 === 1) inp.jump = true; else if (G.autoTries % 3 === 2) { G.autoSide = 0.7; G.autoSideDir = Math.random() < 0.5 ? -1 : 1; } else { G.autoJet = 1.4; } }
}

/** 빌런 제거 세레머니: 슬로모션 + 화면 연출 + 팡파르 + 환호 자세 */
function killCeremony(kind = 'softError', nameKey = 'villain.name') {
  const monster = kind === 'monster';
  const gained = score.add(monster ? 'monsterKill' : 'villainKill', monster ? t('score.monsterKill') : t('score.kill'));
  if (monster) audio.monsterDie();
  audio.victory(); rig.shake = monster ? 0.9 : 0.7; G.slowmo = 0.9;
  G.player.cheer(2.0);
  const el = $('kill-cel'); el.classList.remove('hidden', 'out'); void el.offsetWidth;
  el.querySelector('.kc-title').textContent = monster ? t('cel.titleMonster') : t('cel.title');
  el.querySelector('.kc-sub').textContent = monster ? t('cel.subMonster', { name: t(nameKey) }) : t('cel.sub');
  el.querySelector('.kc-score').textContent = '+' + gained.toLocaleString();
  clearTimeout(G.celTimer);
  G.celTimer = setTimeout(() => { el.classList.add('out'); setTimeout(() => el.classList.add('hidden'), 500); }, 1700);
  if (monster) hud.narrateNow(t('villain.monsterKilled', { name: t(nameKey) }), { who: 'SYSTEM', dur: 3 });
  else hud.narrateNow(L(pickLine(KILL, KILL, G.def.id, G.def.chapter)), { who: 'ECC', dur: 3 });
}

/** 빌런 체력 줄: 살아 있는 빌런마다 한 줄씩 보여 준다 */
let villainHudRows = 0;
function renderVillainHud(states) {
  const wrap = $('villain-hud');
  const alive = states.filter((s) => !s.dead);
  if (!alive.length) { wrap.classList.add('hidden'); return; }
  if (villainHudRows !== states.length) { // 층이 바뀌었을 때만 줄을 다시 만든다
    wrap.innerHTML = states.map((s) => `<div class="vh-row ${s.kind}" data-kind="${s.kind}"><span class="vh-name">⚠ <span class="vh-label"></span></span><div class="vh-bar"><div class="vh-fill"></div></div></div>`).join('');
    villainHudRows = states.length;
  }
  wrap.classList.remove('hidden');
  const rows = wrap.children;
  states.forEach((s, i) => {
    const row = rows[i]; if (!row) return;
    row.classList.toggle('hidden', s.dead);
    // 20260913 jwjeong 떠다니는 빌런은 이름표를 붙이지 않는다. "소프트 에러" 라는 용어가 화면에 떠 있어도
    // 게임 중에는 읽히지 않고, 같은 내용은 맞을 때 지식 말풍선으로 더 잘 전달된다. 괴물 이름은 그대로 둔다.
    const label = row.querySelector('.vh-label');
    const name = s.kind === 'monster' ? t(s.nameKey) : '';
    if (label.textContent !== name) label.textContent = name;
    const w = (s.hp / s.maxHp * 100) + '%', fill = row.querySelector('.vh-fill');
    if (fill.style.width !== w) fill.style.width = w;
  });
}

/** 미사일 재장전 게이지. 꽉 차면 색과 문구가 바뀌어 "지금 쏠 수 있다" 를 알린다. */
let missileWasReady = false;
function renderMissileHud(charge) {
  const el = $('missile-hud'); if (!el) return;
  el.classList.remove('hidden');
  const ready = charge >= 1;
  el.querySelector('.ms-fill').style.width = (charge * 100).toFixed(0) + '%';
  if (ready !== missileWasReady) {
    missileWasReady = ready;
    el.classList.toggle('ready', ready);
    el.querySelector('.ms-label').textContent = t(ready ? 'missile.ready' : 'missile.charging');
  }
}

/**
 * 주먹. 0.9초 안에 이어 치면 "주먹 주먹" 연타가 되고, 세 번째 타에 세게 들어간다.
 * 20260913 jwjeong 연타가 끊기는 기준(0.9초)을 바꾸면 마무리 일격이 잘 안 나온다. 쿨다운(0.3초)과 함께 봐야 한다.
 */
let punchChain = 0, punchChainAt = 0;
function doPunch(p) {
  const now = performance.now();
  punchChain = (now - punchChainAt < 900) ? punchChain + 1 : 1;
  punchChainAt = now;
  const finisher = punchChain % 3 === 0;          // 3타째가 마무리
  const power = finisher ? 2.4 : 1;
  const r = combat.punch(p, power);
  if (!r) return;                                 // 아직 쿨다운
  p.swing();
  if (!r.hit) { audio.punchMiss(); punchChain = 0; return; }
  if (finisher) { audio.punchHit(); audio.gaugeBreak(); rig.shake = 0.8; G.slowmo = Math.max(G.slowmo || 0, 0.35); }
  else { audio.punchHit(); rig.shake = r.kind === 'monster' ? 0.5 : 0.35; }
  if (r.killed) { punchChain = 0; killCeremony(r.kind, r.nameKey); return; }
  const key = r.kind === 'monster' ? 'monsterPunch' : 'villainPunch';
  score.add(key, t('score.punch'), { scale: finisher ? 2 : 1 });
  if (punchChain >= 2) audio.comboUp(punchChain);  // 이어 칠수록 소리가 올라간다
}

function flashHurt() { const el = $('hurt-flash'); el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); }

// ---------- 코인에 담긴 지식 ----------
let knTimer = 0, knLast = '';
function showKnowledge(html, opt = {}) {
  // 코인은 같은 문장이 연달아 뜨면 지겨우므로 막는다. 피격은 표에서 이미 다음 것을 꺼내 오므로 막지 않는다.
  if (!opt.hurt && html === knLast) return;
  knLast = html;
  const el = $('knowledge'); el.classList.remove('hidden', 'out');
  el.classList.toggle('hurt', !!opt.hurt);
  // 반도체 일반(프롤로그)과 GPU 고유 구조(하강)를 헷갈리지 않게 챕터를 함께 적는다
  const chap = t('chapter.' + (G.def?.chapter || 'descent'));
  el.querySelector('.kn-head').innerHTML = (opt.hurt ? t('coin.hitLearned') : ('\u{1F4A1} ' + t('coin.learned'))) + ' <span class="kn-chap">' + chap + '</span>';
  el.querySelector('.kn-text').innerHTML = html;
  if (opt.hurt) audio.factPop(); else audio.learn();
  clearTimeout(knTimer);
  knTimer = setTimeout(() => { el.classList.add('out'); setTimeout(() => el.classList.add('hidden'), 500); }, opt.hurt ? 5200 : 4200);
}

// ---------- 음악 플레이리스트 위젯 ----------
function renderMusicWidget() {
  const w = $('music-widget'); if (!audio.hasMusic) { w.classList.add('hidden'); return; }
  w.classList.remove('hidden');
  $('music-cur').textContent = audio.trackTitle || t('music.now');
  const ul = $('music-items'); ul.innerHTML = '';
  for (const e of audio.entries()) {
    const li = document.createElement('li');
    const missing = audio.tracks.get(e.file) === null;
    li.className = (audio.currentFile === e.file ? 'current ' : '') + (missing ? 'missing' : '');
    li.innerHTML = `<span>${e.main ? '★ ' : ''}${esc(e.title || e.file)}${missing ? ' ' + t('music.none') : ''}</span><span class="lv">${(e.levels || []).slice(0, 4).join(' ')}${(e.levels || []).length > 4 ? '…' : ''}</span>`;
    if (!missing) li.addEventListener('click', (ev) => { ev.stopPropagation(); audio.init(); audio.pick(e.file); });
    ul.appendChild(li);
  }
  $('music-auto').classList.toggle('on', !audio.pinned);
}
audio.onTrack = () => renderMusicWidget();
audio.onBlocked = () => $('enter-gate').classList.remove('hidden');
$('music-toggle').addEventListener('click', (e) => { e.stopPropagation(); audio.init(); $('top-menu-list').classList.add('hidden'); $('music-list').classList.toggle('hidden'); renderMusicWidget(); });
$('music-auto').addEventListener('click', (e) => { e.stopPropagation(); audio.init(); audio.pick(null); renderMusicWidget(); });
window.addEventListener('pointerdown', (e) => { if (!e.target.closest('#music-widget')) $('music-list').classList.add('hidden'); });

// 사이트에 들어오면 메인 테마를 바로 튼다. 브라우저가 자동재생을 막으면 안내를 띄우고 첫 조작에서 시작한다.
(function startMusic() {
  const gate = $('enter-gate');
  const unlock = () => { gate.classList.add('hidden'); audio.init(); window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
  window.addEventListener('pointerdown', unlock); window.addEventListener('keydown', unlock);
  audio.ready.then(() => { audio.playFor('title').then(renderMusicWidget); audio.probeAll().then(renderMusicWidget); });
})();

// ---------- 영상 모달 ----------
function openPerson(person) {
  if (!G.metPeople.has(person.id)) { G.metPeople.add(person.id); score.add('person', t('score.person', { name: L(person.name) })); audio.newCard(); }
  if (!person.video) return;
  score.add('video', t('score.video'), { combo: false }); openVideo(person.video, { title: L(person.name), meta: t('video.about', { name: L(person.name), years: person.years || '', role: L(person.role) }) + (person.quote ? ` — “${L(person.quote)}”` : '') }); }
function openVideo(v, meta = {}) {
  if ((!v || !v.id) && !(meta.photos && meta.photos.length) && !(meta.links && meta.links.length) && !meta.meta) return; audio.init();
  if (G.state === 'play') G.prevState = 'play'; G.state = 'video'; G.keys = {}; G.touchMove = null;
  const m = $('video-modal'); m.classList.remove('hidden');
  m.querySelector('.vm-title').textContent = meta.title || (v && v.title) || '';
  const metaTxt = meta.html ? (meta.meta || '') : esc(meta.meta || '');
  m.querySelector('.vm-meta').innerHTML = v ? `<b>${esc(v.title)}</b> · ${esc(v.channel || '')}${v.min ? ` · ${v.min} min` : ''}${metaTxt ? `<br>${metaTxt}` : ''}` : metaTxt;
  const ph = m.querySelector('.vm-photos'); ph.innerHTML = '';
  for (const p of meta.photos || []) { const f = document.createElement('figure'); f.innerHTML = `<img src="${p.url}" alt="" loading="lazy"><figcaption>${esc(L(p.caption || ''))}${p.credit ? ` — ${esc(p.credit)}` : ''}${p.license ? ` (${esc(p.license)})` : ''}${p.page ? ` <a href="${p.page}" target="_blank" rel="noopener">↗</a>` : ''}</figcaption>`; ph.appendChild(f); }
  const lk = m.querySelector('.vm-links'); lk.innerHTML = '';
  // 임베드가 막히는 영상도 있으므로, 유튜브에서 바로 여는 링크를 항상 맨 앞에 놓는다
  const links = [...(v && v.id ? [{ href: ytUrl(v.id), label: t('video.open'), yt: true }] : []), ...(meta.links || [])];
  for (const l of links) { const a = document.createElement('a'); a.href = l.href; a.target = '_blank'; a.rel = 'noopener'; a.className = l.yt ? 'yt' : ''; a.textContent = (l.yt ? '▶ ' : '') + l.label + ' ↗'; lk.appendChild(a); }
  m.querySelector('.vm-frame').classList.toggle('hidden', !v);
  m.querySelector('.vm-note').style.display = v ? '' : 'none';
  const list = m.querySelector('.vm-list'); list.innerHTML = '';
  for (const alt of meta.list || []) {
    const row = document.createElement('span'); row.className = 'vm-item' + (v && alt.id === v.id ? ' on' : '');
    const bt = document.createElement('button'); bt.textContent = '▶ ' + alt.title + (alt.min ? ` (${alt.min}m)` : ''); bt.className = v && alt.id === v.id ? 'on' : '';
    bt.addEventListener('click', () => openVideo(alt, meta)); row.appendChild(bt);
    if (alt.id) { const a = document.createElement('a'); a.href = ytUrl(alt.id); a.target = '_blank'; a.rel = 'noopener'; a.title = t('video.open'); a.textContent = '↗'; row.appendChild(a); }
    list.appendChild(row);
  }
  $('vm-iframe').src = v ? `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=${LANG}&hl=${LANG}` : 'about:blank';
  if (audio.music) audio.music.pause();
}
function closeVideo() { const m = $('video-modal'); if (m.classList.contains('hidden')) return; m.classList.add('hidden'); $('vm-iframe').src = 'about:blank'; if (G.state === 'video') G.state = G.prevState || 'play'; if (audio.music && audio.enabled) audio.music.play().catch(() => {}); }
function esc(s) { return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
$('auto-btn').addEventListener('click', (e) => { e.stopPropagation(); audio.init(); setAuto(!G.auto); });
$('vm-close').addEventListener('click', closeVideo);
$('video-modal').addEventListener('pointerdown', (e) => { if (e.target === $('video-modal')) closeVideo(); });

function renderMenu() {
  const ul = $('menu-levels'); ul.innerHTML = '';
  const rows = []; G.seq.forEach((lv, i) => { rows.push([lv, i]); if (lv.id === 'L1' && G.gpu.hbmSites) HBM_LEVELS.forEach((h) => rows.push([h, h.id])); });
  rows.forEach(([lv, i]) => { const li = document.createElement('li'); const marks = (lv.terms || []).filter((k) => TERMS[k]).slice(0, 4).map((k) => LANG === 'ko' ? TERMS[k].ko : TERMS[k].en).join(' · '); li.innerHTML = `<div class="ml-name">${typeof i === 'string' ? '↳ ' : ''}${lv.id} · ${L(lv.name)}</div>${marks ? `<div class="ml-marks">${marks}</div>` : ''}`; li.className = (G.def && lv.id === G.def.id) ? 'current' : ''; li.addEventListener('click', () => { $('top-menu-list').classList.add('hidden'); if (G.state !== 'play') return; loadLevel(i); }); ul.appendChild(li); });
}

// ---------- URL 파라미터 자동 시작 (?level=L5&gpu=h100&char=sara&view=first) ----------
(function autostart() {
  const q = new URLSearchParams(location.search);
  if (q.get('screen') === 'select') { G.state = 'select'; showScreen('select-screen'); renderSelect(); return; }
  if (!q.has('level') && !q.has('start')) return;
  const gpu = GPUS.find((g) => g.id === q.get('gpu')); if (gpu) G.gpu = gpu;
  const ch = CHARACTERS.find((c) => c.id === q.get('char')); if (ch) G.char = ch;
  if (q.get('view') === 'first' || q.get('view') === 'third') G.view = q.get('view');
  if (q.get('auto') === '1') G.auto = true;
  const lv = q.get('level'); G.mode = lv && lv.startsWith('P') ? 'prologue' : (q.get('mode') === 'prologue' ? 'prologue' : 'descent');
  if ((lv && lv.startsWith('A')) || q.get('theme') === 'ai') G.theme = 'ai';
  startGame();
  if (lv) { const idx = G.seq.findIndex((l) => l.id === lv); if (idx > 0) loadLevel(idx); else if (idx < 0 && findLevel(lv)) loadLevel(lv); }
})();

// ---------- 루프 ----------
function loop() {
  requestAnimationFrame(loop);
  let dt = Math.min(0.05, clock.getDelta());
  if (G.state === 'play' || G.state === 'shrink') {
    if (G.slowmo > 0) { G.slowmo -= dt; dt *= 0.35; }
    G.dtLast = dt;
    readInput();
    if (G.state === 'play') autoStep(dt);
    const p = G.player, lv = G.level;
    if (G.state === 'play' && !$('codex').classList.contains('hidden')) { G.input.x = 0; G.input.y = 0; }
    const wasGround = p.onGround; const wantJump = G.input.jump;
    p.update(dt, G.input, rig.yaw);
    if (wantJump && !p.onGround && wasGround) audio.jump();
    if (p.moving && p.onGround) { G.stepT += dt * (p.running ? 3.6 : 2.4); if (G.stepT > 1) { G.stepT = 0; audio.step(); } }
    lv.update(dt, p.pos);
    npcs.update(dt, p.pos);
    // 수집물: 코인·부스트 패드
    for (const ev of items.update(dt, p)) {
      if (ev.type === 'coin') {
        const before = score.combo;
        score.add('coin', t('score.coin'));
        audio.coin(score.combo); if (score.combo > before && score.combo % 3 === 0) audio.comboUp(score.combo);
        if (ev.fact) showKnowledge(ev.fact);
      }
      else if (ev.type === 'boost') { p.pushBoost(ev.dir); score.add('boost', t('score.boost'), { combo: false }); audio.gateOpen(); rig.shake = 0.25; }
    }
    // 사격·주먹과 빌런
    if (G.input.fire) { G.input.fire = false; if (combat.playerShoot(p)) audio.shoot(); }
    // 미사일: 재장전이 끝났을 때만 나간다. 못 쏘면 짧은 거절음으로 알려 준다.
    if (G.input.missile) {
      G.input.missile = false;
      if (combat.playerMissile(p)) { audio.missileFire(); rig.shake = 0.3; p.swing?.(); }
      else audio.deny();
    }
    if (G.input.punch) { G.input.punch = false; doPunch(p); }
    for (const ev of combat.update(dt, p)) {
      const near = ev.dist != null ? Math.max(0, 1 - ev.dist / 42) : 1; // 멀리 있는 소리는 작게
      if (ev.type === 'hit') { const mon = ev.kind === 'monster'; score.add(mon ? 'monsterHit' : 'villainHit', t(mon ? 'score.monsterHit' : 'score.hit'), { combo: false }); audio.enemyHit(ev.kind); }
      else if (ev.type === 'kill') { if (ev.byMissile) score.add('missileKill', t('score.missileKill'), { combo: false }); killCeremony(ev.kind, ev.nameKey); }
      else if (ev.type === 'hurt') {
        score.combo = 0; score.render(); flashHurt(); rig.shake = ev.kind === 'monster' ? 0.6 : 0.4;
        if (ev.kind === 'monster') { audio.monsterSwipe(1); audio.punchHit(); hud.narrateNow(t('villain.clawHurt'), { who: 'ALERT', dur: 2.8, hint: true }); }
        else { audio.deny(); hud.narrateNow(L(pickLine(HURT, HURT_CHAPTER, G.def.id, G.def.chapter)), { who: 'ALERT', dur: 2.8, hint: true }); }
        // 20260913 jwjeong 맞을 때마다 그 층의 지식을 하나씩 띄운다. 같은 층이라도 맞을 때마다 다음 것으로 넘어간다.
        showKnowledge(L(nextFact(G.def.id, G.def.chapter)), { hurt: true });
      }
      else if (ev.type === 'missileHit') {
        // 게이지가 남았다: 크게 깎였다는 표시로 화면을 흔들고 점수를 준다
        score.add('missileHit', t('score.missileHit'));
        rig.shake = 0.5;
        if (ev.hp <= 1) audio.gaugeBreak(); // 한 방 남았다는 신호
      }
      else if (ev.type === 'missileBoom') { audio.missileBoom(1); rig.shake = Math.max(rig.shake, 0.75); G.slowmo = Math.max(G.slowmo || 0, 0.25); }
      else if (ev.type === 'missileFly') audio.missileFly(Math.max(0.15, 1 - ev.dist / 60));
      else if (ev.type === 'missileReady') audio.missileReady();
      else if (ev.type === 'enemyFire') audio.enemyFire(near);
      else if (ev.type === 'monsterStep') audio.monsterStep(near * near, ev.run);
      else if (ev.type === 'monsterRoar') audio.monsterRoar(near, ev.charge);
      else if (ev.type === 'monsterAttack') audio.monsterWindup(near);
      else if (ev.type === 'monsterSwipe') audio.monsterSwipe(near);
      else if (ev.type === 'respawn') {
        audio.alarm();
        if (ev.kind === 'monster') hud.narrateNow(t('villain.monsterSpawn', { name: t(ev.nameKey) }), { who: 'ALERT', dur: 3.4, hint: true });
        else hud.narrateNow(t('villain.spawn'), { who: 'ALERT', dur: 3, hint: true });
      }
    }
    renderVillainHud(combat.states());
    renderMissileHud(combat.missileCharge());
    // 경과 시간
    { const el = (performance.now() - G.levelStart) / 1000; $('timer-now').textContent = formatTime(el);
      $('timer-par').textContent = t('timer.par', { t: formatTime(G.par) });
      $('timer-hud').classList.toggle('over', el > G.par); }
    // 스케이트 트릭 판정
    const tk = p.takeTrick();
    if (tk) {
      const deg = Math.round(tk.deg / 180) * 180;
      const kind = deg >= 720 ? 'trick720' : deg >= 360 ? 'trick360' : 'trick180';
      score.add(kind, t('score.trick', { deg }));
      if (tk.air > 0.5) score.add('airtime', null, { combo: false, scale: Math.round(tk.air * 10) });
      audio.newCard(); rig.shake = 0.3;
    }
    score.update(dt);
    if (G.clones.length) updateClones();
    rig.update(dt, p);
    if (G.state === 'play') { const tf = BASE_FOV + (p.running ? 6 : 0); if (Math.abs(camera.fov - tf) > 0.05) { camera.fov += (tf - camera.fov) * Math.min(1, dt * 4); camera.updateProjectionMatrix(); } }
    hud.update(dt);
    hud.minimap(lv, p, rig.yaw, items.points());
    $('hud-coins').textContent = t('hud.coins', { n: items.total() - items.remaining(), total: items.total() });
    // 연료 게이지: 제트팩을 아직 한 번도 쓰지 않았다면 계속 보여 주어 그런 기능이 있다는 사실을 알린다
    { const fb = $('fuel-bar'); fb.style.width = (p.fuel * 100).toFixed(0) + '%'; fb.parentElement.classList.toggle('low', p.fuel < 0.25); $('fuel-wrap').classList.toggle('hidden', G.jetUsed && p.fuel >= 0.999 && !p.jetOn); }
    // 공중에 떠 있는 동안 F 안내: 실제로 제트팩을 쓰면 사라지고, 누적 10초를 채우면 더 띄우지 않는다
    if (p.jetOn) { G.jetUsed = true; $('jet-tip').classList.add('hidden'); }
    else if (!G.jetUsed && G.jetTipT > 0 && !p.onGround && G.state === 'play') { G.jetTipT -= dt; $('jet-tip').classList.remove('hidden'); }
    else $('jet-tip').classList.add('hidden');
    // 근접 안내
    const tr = lv.nearTrigger(p.pos.x, p.pos.z, new Set());
    const nearGate = p.pos.distanceTo(lv.gatePos) < 4.5; const nearNpc = npcs.nearest(p.pos);
    const nearSide = lv.sideGatePos && p.pos.distanceTo(lv.sideGatePos) < 4.5;
    const nearBoard = lv.boardPos && p.pos.distanceTo(lv.boardPos) < 9 && G.def.boardInfo && G.def.boardInfo.video;
    if (nearNpc) hud.interact(t('hud.talk', { name: L(nearNpc.person.name) }));
    else if (nearBoard) hud.interact(t('hud.board'));
    else if (nearSide) hud.interact(t('hud.sideGate', { name: L(G.def.sideGate.label) }));
    else if (nearGate) hud.interact(lv.gateOpen ? ((G.def.chapter === 'prologue' && !G.def.shrink) ? t('hud.exitGate') : t('hud.gate', { f: fmtNum(G.def.shrink || 1) })) : t('hud.gateLocked', { n: Math.max(1, (G.def.gate?.required ?? Math.min(3, G.levelTerms.length)) - hud.updateTermCount(G.levelTerms)) }));
    else if (tr) { hud.interact(t('hud.read') + ': ' + (tr.label ? L(tr.label) : TERMS[tr.term]?.en || '')); if (!G.fired.has(tr.term) && G.char.autoRead) { interact(); } }
    else hud.interact(null);
    // 자동 카드: 처음 근접 시 자동 팝업 (E 없이도 배우게)
    if (tr && !G.fired.has(tr.term) && Math.hypot(tr.x - p.pos.x, tr.z - p.pos.z) < tr.r * 0.55) { G.fired.add(tr.term); const isNew = hud.showTerm(tr.term, G.def.id); G.lastTerm = tr.term; if (isNew) audio.newCard(); else audio.card(); score.add(isNew ? 'termNew' : 'termAgain', TERMS[tr.term].ko); checkGate(); }
    // 패킷 통과 감지
    if (lv.packet) { const d = lv.packet.group.position.distanceTo(p.pos); if (d < 1.6 && !G.packetNear) { G.packetNear = true; G.packetHits++; audio.packet(); score.add('packet', L(G.def.packetLabel || { ko: '프레임 데이터', en: 'FRAME DATA' })); if (G.def.packetHint && G.packetHits === 1) hud.narrate(L(G.def.packetHint), { hint: true }); } else if (d > 2.5) G.packetNear = false; }
    // 게이트 힌트 타이머
    if (G.hintT > 0) { G.hintT -= dt; if (G.hintT <= 0 && !lv.gateOpen) hud.narrate(t('astra.gateHint'), { hint: true }); }
  }
  renderer.render(scene, camera);
}
loop();
