// 플레이어: 절차 생성 로우폴리 탐험가 + 이동/점프/충돌(AABB 상자 위 올라서기)
import * as THREE from 'three';

export const PLAYER_H = 1.7; // 게임 단위(모든 층에서 주인공은 1.7 단위 키, 세계가 커진다)


// ---- 지오메트리·재질 캐시 ----
// 같은 크기의 상자·구·캡슐과 같은 색의 재질은 인물 수가 늘어도 하나만 만들어 공유한다.
const _geoCache = new Map();
function geo(key, make) { let g = _geoCache.get(key); if (!g) { g = make(); _geoCache.set(key, g); } return g; }
const gBox = (w, h, d) => geo(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d));
const gSph = (r, a = 16, b = 12) => geo(`s${r},${a},${b}`, () => new THREE.SphereGeometry(r, a, b));
const gCap = (r, len, seg = 8) => geo(`c${r},${len},${seg}`, () => new THREE.CapsuleGeometry(r, len, seg, 12));
const gCyl = (a, b, h, seg) => geo(`y${a},${b},${h},${seg}`, () => new THREE.CylinderGeometry(a, b, h, seg));
const gTor = (r, t, a, b, arc) => geo(`t${r},${t},${a},${b},${arc}`, () => new THREE.TorusGeometry(r, t, a, b, arc));
const gSphP = (r, a, b, ps, pl, ts, tl) => geo(`sp${r},${a},${b},${ps},${pl},${ts},${tl}`, () => new THREE.SphereGeometry(r, a, b, ps, pl, ts, tl));
const gCone = (r, h, seg) => geo(`o${r},${h},${seg}`, () => new THREE.ConeGeometry(r, h, seg, 1, true));
const gLathe = (key, pts, seg) => geo(`l${key}`, () => new THREE.LatheGeometry(pts, seg));
const gRound = (w, h, d, r) => geo(`r${w},${h},${d},${r}`, () => roundedBox(w, h, d, r));
const _matCache = new Map();
function matC(color, o = {}) { const k = color + '|' + JSON.stringify(o); let m = _matCache.get(k); if (!m) { m = new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? 0.6, metalness: o.metal ?? 0.05, emissive: o.emissive ?? 0x000000, emissiveIntensity: o.ei ?? 1, side: o.double ? THREE.DoubleSide : THREE.FrontSide }); _matCache.set(k, m); } return m; }

/** 캐릭터 정의로 사람 모양 메시를 절차 생성한다. 둥근 두상·이목구비·헤어스타일·관절 팔다리·손가락·신발까지 포함.
 *  parts: torso, head, armL/armR(어깨 피벗), foreL/foreR(팔꿈치), legL/legR(엉덩이), shinL/shinR(무릎) — 애니메이션과 분신 복제에 쓰인다. */
export function buildHumanoid(ch) {
  const g = new THREE.Group();
  const skinC = ch.skin ?? 0xf1c9a5;
  const M = (color, o = {}) => matC(color, o);
  const skin = M(skinC, { rough: 0.62 }); const skinShade = M(darken(skinC, 0.86), { rough: 0.7 });
  const suit = M(ch.suit ?? 0x2d6cdf, { rough: 0.72 }); const suit2 = M(ch.suit2 ?? 0x1b2a44, { rough: 0.75 });
  const hairM = M(ch.hair ?? 0x2a1a0e, { rough: 0.55, metal: 0.05 });
  const eyeWhite = M(0xf6f4f0, { rough: 0.3 }); const iris = M(ch.eye ?? 0x3b2a1a, { rough: 0.25 }); const pupil = M(0x050505, { rough: 0.2 });
  const lips = M(darken(skinC, 0.72), { rough: 0.55 }); const shoe = M(ch.shoe ?? 0x1a1a1a, { rough: 0.5, metal: 0.1 });
  const glow = M(ch.accent ?? 0x76b900, { emissive: ch.accent ?? 0x76b900, ei: 0.9 });
  const isBunny = ch.hat === 'bunny'; const bunny = M(0xf2f2f2, { rough: 0.85 }); const glove = M(0xe8f0ff, { rough: 0.5 });
  const parts = {};
  const mesh = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const capsule = (r, len, seg = 8) => gCap(r, len, seg);
  const cloth = isBunny ? bunny : suit, cloth2 = isBunny ? bunny : suit2, handM = isBunny ? glove : skin;

  // ---------- 몸통 (회전체: 골반 → 허리 → 가슴 → 어깨) ----------
  const torsoG = new THREE.Group(); torsoG.position.y = 0.86; g.add(torsoG); parts.torso = torsoG;
  const prof = [[0.16, 0], [0.175, 0.06], [0.15, 0.16], [0.155, 0.26], [0.19, 0.40], [0.205, 0.50], [0.19, 0.56], [0.09, 0.60], [0.06, 0.62]].map(([r, y]) => new THREE.Vector2(r, y));
  const torso = mesh(gLathe('torso', prof, 28), cloth, torsoG); torso.scale.z = 0.66;
  mesh(gSph(0.078), cloth, torsoG, -0.215, 0.53, 0); mesh(gSph(0.078), cloth, torsoG, 0.215, 0.53, 0); // 어깨
  mesh(gTor(0.165, 0.022, 8, 32), cloth2, torsoG, 0, 0.05, 0).rotation.x = Math.PI / 2; // 벨트
  mesh(gBox(0.02, 0.36, 0.012), cloth2, torsoG, 0, 0.36, 0.128); // 지퍼
  mesh(gBox(0.09, 0.07, 0.012), cloth2, torsoG, -0.085, 0.16, 0.118); mesh(gBox(0.09, 0.07, 0.012), cloth2, torsoG, 0.085, 0.16, 0.118); // 주머니
  mesh(gBox(0.075, 0.03, 0.012), glow, torsoG, 0.1, 0.46, 0.13); // 가슴 램프(명찰)
  const collar = mesh(gTor(0.075, 0.022, 8, 24, Math.PI * 1.5), cloth2, torsoG, 0, 0.59, 0.005); collar.rotation.x = Math.PI / 2; collar.rotation.z = Math.PI * 0.75;
  mesh(gCyl(0.052, 0.058, 0.12, 14), skinShade, torsoG, 0, 0.64, -0.005); // 목
  // 배낭
  const pack = mesh(gRound(0.28, 0.34, 0.13, 0.03), cloth2, torsoG, 0, 0.36, -0.16);
  mesh(gBox(0.09, 0.03, 0.012), glow, torsoG, 0.07, 0.48, -0.23);
  const jet = mesh(gCone(0.06, 0.42, 10), M(0x5ee0ff, { emissive: 0x5ee0ff, ei: 2.5, double: true }), torsoG, 0, -0.02, -0.16); jet.rotation.x = Math.PI; jet.visible = false; jet.castShadow = false; parts.jet = jet; const jet2 = mesh(gCone(0.035, 0.28, 8), M(0xffffff, { emissive: 0xffffff, ei: 3, double: true }), jet, 0, 0.05, 0); jet2.castShadow = false;
  mesh(gBox(0.035, 0.3, 0.02), cloth2, torsoG, -0.1, 0.4, 0.09); mesh(gBox(0.035, 0.3, 0.02), cloth2, torsoG, 0.1, 0.4, 0.09); // 배낭 끈

  // ---------- 머리 ----------
  const headG = new THREE.Group(); headG.position.set(0, 1.50, 0); g.add(headG); parts.head = headG;
  const skull = mesh(gSph(0.125, 24, 18), skin, headG, 0, 0.11, 0); skull.scale.set(1, 1.12, 1.02);
  const jaw = mesh(gSph(0.105, 20, 14), skin, headG, 0, 0.045, 0.01); jaw.scale.set(0.93, 0.78, 0.92);
  mesh(gSph(0.03, 10, 8), skin, headG, -0.124, 0.10, -0.01).scale.set(0.45, 1, 0.8); mesh(gSph(0.03, 10, 8), skin, headG, 0.124, 0.10, -0.01).scale.set(0.45, 1, 0.8); // 귀
  for (const sx of [-1, 1]) { // 눈: 흰자 + 홍채 + 동공 + 눈썹 + 눈꺼풀 그늘
    const white = mesh(gSph(0.027, 12, 10), eyeWhite, headG, sx * 0.047, 0.125, 0.104); white.scale.set(1.15, 0.85, 0.7);
    mesh(gSph(0.014, 10, 8), iris, headG, sx * 0.047, 0.125, 0.121).scale.z = 0.5;
    mesh(gSph(0.0065, 8, 6), pupil, headG, sx * 0.047, 0.125, 0.128);
    const lid = mesh(gSphP(0.029, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.45), skinShade, headG, sx * 0.047, 0.129, 0.103); lid.scale.set(1.18, 0.8, 0.75);
    const brow = mesh(gBox(0.05, 0.011, 0.012), hairM, headG, sx * 0.05, 0.168, 0.113); brow.rotation.z = sx * -0.15; brow.rotation.x = -0.35;
  }
  mesh(gSph(0.018, 10, 8), skin, headG, 0, 0.095, 0.128).scale.set(0.8, 1.25, 1); // 코
  mesh(gCyl(0.012, 0.012, 0.03, 8), skinShade, headG, 0, 0.098, 0.12).rotation.x = Math.PI / 2; // 콧등
  const mouth = mesh(gTor(0.024, 0.007, 6, 12, Math.PI), lips, headG, 0, 0.055, 0.112); mouth.rotation.x = Math.PI / 2; mouth.rotation.z = Math.PI; mouth.scale.y = 0.6; // 입
  // 머리카락 / 후드
  const style = ch.hairStyle || 'short';
  if (isBunny) {
    const hood = mesh(gSph(0.15, 18, 14), bunny, headG, 0, 0.1, -0.012); hood.scale.set(1.05, 1.15, 1.05);
    const visor = mesh(gSphP(0.135, 18, 10, Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.28, Math.PI * 0.42), M(0x9fd7ff, { metal: 0.5, rough: 0.15 }), headG, 0, 0.1, 0.01); visor.scale.set(1.05, 1.12, 1.05);
    const mask = mesh(gSph(0.11, 12, 10), bunny, headG, 0, 0.04, 0.03); mask.scale.set(0.9, 0.55, 0.85);
  } else {
    const cap = mesh(gSphP(0.133, 20, 14, 0, Math.PI * 2, 0, style === 'buzz' ? Math.PI * 0.5 : Math.PI * 0.58), hairM, headG, 0, 0.118, -0.01); cap.scale.set(1.03, style === 'buzz' ? 1.0 : 1.08, 1.05); cap.rotation.x = -0.12;
    const fringe = mesh(gSphP(0.128, 14, 10, Math.PI * 0.15, Math.PI * 0.7, Math.PI * 0.22, Math.PI * 0.22), hairM, headG, 0, 0.12, 0.012); fringe.scale.set(1.04, 1.1, 1.06); // 앞머리
    if (style === 'long' || style === 'bob') { const back = mesh(capsule(0.115, style === 'long' ? 0.32 : 0.12, 6), hairM, headG, 0, style === 'long' ? -0.06 : 0.02, -0.05); back.scale.set(1.05, 1, 0.55); for (const sx of [-1, 1]) { const side = mesh(capsule(0.045, style === 'long' ? 0.3 : 0.14, 6), hairM, headG, sx * 0.125, style === 'long' ? -0.03 : 0.03, -0.01); side.scale.z = 1.4; } }
    if (style === 'ponytail') { const tail = mesh(capsule(0.045, 0.3, 6), hairM, headG, 0, -0.02, -0.14); tail.rotation.x = 0.35; const band = mesh(gTor(0.045, 0.012, 6, 14), glow, headG, 0, 0.11, -0.125); band.rotation.x = Math.PI / 2; parts.tail = tail; }
    if (style === 'bun') { mesh(gSph(0.06, 12, 10), hairM, headG, 0, 0.2, -0.1); }
  }
  // 모자·장비
  if (ch.hat === 'cap') { const cr = mesh(gSphP(0.14, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), suit, headG, 0, 0.12, -0.005); cr.scale.set(1.02, 0.95, 1.04); const brim = mesh(geo('brim', () => new THREE.CylinderGeometry(0.15, 0.15, 0.014, 20, 1, false, -Math.PI * 0.5, Math.PI)), suit, headG, 0, 0.125, 0.02); brim.scale.set(1, 1, 1.25); brim.rotation.x = 0.08; }
  else if (ch.hat === 'headset') { const band = mesh(gTor(0.15, 0.014, 8, 20, Math.PI), suit2, headG, 0, 0.13, -0.01); band.rotation.z = 0; for (const sx of [-1, 1]) { const cup = mesh(gCyl(0.045, 0.045, 0.03, 12), suit2, headG, sx * 0.145, 0.095, -0.01); cup.rotation.z = Math.PI / 2; mesh(gCyl(0.03, 0.03, 0.006, 10), glow, headG, sx * 0.165, 0.095, -0.01).rotation.z = Math.PI / 2; } const mic = mesh(gCyl(0.006, 0.006, 0.14, 6), suit2, headG, 0.1, 0.045, 0.09); mic.rotation.z = 0.6; mic.rotation.x = 0.4; }
  else if (ch.hat === 'goggles') { for (const sx of [-1, 1]) { const lens = mesh(gCyl(0.036, 0.036, 0.02, 12), M(0xffd166, { metal: 0.7, rough: 0.25 }), headG, sx * 0.05, 0.215, 0.085); lens.rotation.x = Math.PI / 2 - 0.3; mesh(gCyl(0.028, 0.028, 0.022, 12), M(0x5ee0ff, { metal: 0.3, rough: 0.1, emissive: 0x114455, ei: 0.6 }), headG, sx * 0.05, 0.215, 0.087).rotation.x = Math.PI / 2 - 0.3; } const strap = mesh(gTor(0.135, 0.01, 6, 18), suit2, headG, 0, 0.18, -0.01); strap.rotation.x = Math.PI / 2 + 0.25; }

  // ---------- 팔 (어깨 → 팔꿈치 → 손) ----------
  const arm = (sx) => {
    const sh = new THREE.Group(); sh.position.set(sx * 0.24, 1.37, 0); g.add(sh);
    mesh(capsule(0.05, 0.22), cloth, sh, 0, -0.14, 0);
    const el = new THREE.Group(); el.position.y = -0.29; sh.add(el);
    mesh(capsule(0.043, 0.2), cloth, el, 0, -0.12, 0);
    mesh(gTor(0.045, 0.01, 6, 12), cloth2, el, 0, -0.23, 0).rotation.x = Math.PI / 2; // 소매 끝
    const hand = new THREE.Group(); hand.position.y = -0.26; el.add(hand);
    const palm = mesh(gSph(0.036, 10, 8), handM, hand, 0, -0.03, 0); palm.scale.set(1.05, 1.25, 0.6);
    for (let i = 0; i < 4; i++) { const f = mesh(capsule(0.009, 0.042, 4), handM, hand, (i - 1.5) * 0.019, -0.095, 0.004); f.rotation.x = 0.12; }
    const thumb = mesh(capsule(0.01, 0.036, 4), handM, hand, sx * 0.038, -0.045, 0.015); thumb.rotation.z = sx * -0.7; thumb.rotation.x = 0.3;
    return { sh, el, hand };
  };
  const aL = arm(-1), aR = arm(1); parts.armL = aL.sh; parts.armR = aR.sh; parts.foreL = aL.el; parts.foreR = aR.el; parts.handL = aL.hand; parts.handR = aR.hand;

  // ---------- 다리 (엉덩이 → 무릎 → 신발) ----------
  const leg = (sx) => {
    const hip = new THREE.Group(); hip.position.set(sx * 0.095, 0.88, 0); g.add(hip);
    mesh(capsule(0.078, 0.26), cloth2, hip, 0, -0.2, 0);
    const knee = new THREE.Group(); knee.position.y = -0.4; hip.add(knee);
    mesh(gSph(0.07, 10, 8), cloth2, knee, 0, 0.01, 0.005);
    mesh(capsule(0.06, 0.24), cloth2, knee, 0, -0.18, 0);
    const foot = mesh(gRound(0.11, 0.075, 0.27, 0.03), shoe, knee, 0, -0.40, 0.055);
    mesh(gBox(0.115, 0.02, 0.28), M(0x2b2b2b, { rough: 0.9 }), knee, 0, -0.437, 0.055); // 밑창
    mesh(gBox(0.06, 0.02, 0.02), glow, knee, 0, -0.39, 0.19); // 앞코 라인
    return { hip, knee, foot };
  };
  const lL = leg(-1), lR = leg(1); parts.legL = lL.hip; parts.legR = lR.hip; parts.shinL = lL.knee; parts.shinR = lR.knee;

  g.userData.parts = parts;
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
  return g;
}
/** 스케이트보드: 데크 + 트럭 + 바퀴 4개 (발밑에 붙는다) */
function buildBoard() {
  const g = new THREE.Group(); g.position.y = 0.06; g.rotation.y = Math.PI / 2;
  const deck = new THREE.Mesh(gRound(0.9, 0.05, 0.26, 0.06), matC(0x1b2a4a, { rough: 0.5, metal: 0.2 })); deck.position.y = 0.1; g.add(deck);
  const grip = new THREE.Mesh(gBox(0.84, 0.012, 0.22), matC(0x0c1220, { rough: 1 })); grip.position.y = 0.128; g.add(grip);
  const stripe = new THREE.Mesh(gBox(0.5, 0.014, 0.05), matC(0x76b900, { emissive: 0x76b900, ei: 0.8 })); stripe.position.set(0, 0.075, 0); g.add(stripe);
  for (const sx of [-1, 1]) {
    const truck = new THREE.Mesh(gBox(0.06, 0.05, 0.2), matC(0x9aa4b0, { metal: 0.8, rough: 0.3 })); truck.position.set(sx * 0.28, 0.055, 0); g.add(truck);
    for (const sz of [-1, 1]) {
      const w = new THREE.Mesh(gCyl(0.055, 0.055, 0.05, 10), matC(0xffd166, { rough: 0.4 }));
      w.position.set(sx * 0.28, 0.045, sz * 0.12); w.rotation.x = Math.PI / 2; g.add(w);
    }
  }
  g.traverse((o) => { o.castShadow = false; });
  return g;
}
/** 색을 어둡게 (0~1) */
function darken(hex, k) { const r = ((hex >> 16) & 255) * k, gg = ((hex >> 8) & 255) * k, b = (hex & 255) * k; return (Math.round(r) << 16) | (Math.round(gg) << 8) | Math.round(b); }
/** 모서리가 둥근 상자 (ExtrudeGeometry 기반) */
function roundedBox(w, h, d, r) {
  const shape = new THREE.Shape(); const x = -w / 2, y = -h / 2;
  shape.moveTo(x + r, y); shape.lineTo(x + w - r, y); shape.quadraticCurveTo(x + w, y, x + w, y + r); shape.lineTo(x + w, y + h - r); shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h); shape.lineTo(x + r, y + h); shape.quadraticCurveTo(x, y + h, x, y + h - r); shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: d - r * 2, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 3, curveSegments: 6 }); geo.center(); return geo;
}


/** 사람 메시 공용 애니메이션: 걷기/달리기/점프/대기. NPC 도 같이 쓴다. */
export function animateHumanoid(p, t, walking, running, onGround = true, pose = 'none') {
  if (!p) return;
  if (pose === 'slide') { // 슬라이딩: 뒤로 눕고 다리는 앞으로
    p.torso.position.y = 0.42; p.torso.rotation.x = -1.15; p.torso.rotation.y = 0; p.head.position.y = 0.95; p.head.rotation.y = 0;
    p.legL.rotation.x = -1.35; p.legR.rotation.x = -1.1; p.shinL.rotation.x = 0.2; p.shinR.rotation.x = 0.5;
    p.armL.rotation.x = -0.6; p.armR.rotation.x = 0.4; p.armL.rotation.z = 0.5; p.armR.rotation.z = -0.5; p.foreL.rotation.x = -0.4; p.foreR.rotation.x = -0.4; return;
  }
  if (pose === 'crouch') { // 기어가기: 무릎 굽히고 상체 낮춤
    const s2 = Math.sin(t * 0.8);
    p.torso.position.y = 0.5; p.torso.rotation.x = 0.75; p.torso.rotation.y = walking ? -s2 * 0.08 : 0; p.head.position.y = 1.02; p.head.rotation.y = 0;
    p.legL.rotation.x = -1.3 + (walking ? s2 * 0.3 : 0); p.legR.rotation.x = -1.3 - (walking ? s2 * 0.3 : 0); p.shinL.rotation.x = 1.9; p.shinR.rotation.x = 1.9;
    p.armL.rotation.x = -0.9; p.armR.rotation.x = -0.9; p.armL.rotation.z = 0.2; p.armR.rotation.z = -0.2; p.foreL.rotation.x = -0.9; p.foreR.rotation.x = -0.9; return;
  }
  if (pose === 'jet') { // 제트팩: 팔 벌리고 다리 살짝 굽힘
    p.torso.position.y = 0.86; p.torso.rotation.x = 0.25; p.torso.rotation.y = 0; p.head.position.y = 1.5; p.head.rotation.y = 0;
    p.legL.rotation.x = 0.25; p.legR.rotation.x = 0.1; p.shinL.rotation.x = 0.6; p.shinR.rotation.x = 0.5;
    p.armL.rotation.x = -0.5; p.armR.rotation.x = -0.5; p.armL.rotation.z = 1.1; p.armR.rotation.z = -1.1; p.foreL.rotation.x = -0.3; p.foreR.rotation.x = -0.3; return;
  }
  if (pose === 'punch') { // 주먹: 오른팔을 앞으로 뻗고 몸을 튼다
    const u = Math.min(1, (0.35 - (t % 0.35)) / 0.35);
    p.torso.position.y = 0.86; p.torso.rotation.x = 0.1; p.torso.rotation.y = -0.45; p.head.position.y = 1.5; p.head.rotation.y = 0;
    p.armR.rotation.x = -1.6; p.armR.rotation.z = -0.1; p.foreR.rotation.x = -0.1;
    p.armL.rotation.x = 0.5; p.armL.rotation.z = 0.3; p.foreL.rotation.x = -1.4;
    p.legL.rotation.x = -0.25; p.legR.rotation.x = 0.3; p.shinL.rotation.x = 0.3; p.shinR.rotation.x = 0.2; return;
  }
  if (pose === 'cheer') { // 세레머니: 두 팔을 번쩍 들고 제자리 들썩
    const b = Math.abs(Math.sin(t * 6)) * 0.12;
    p.torso.position.y = 0.86 + b; p.torso.rotation.x = -0.08; p.torso.rotation.y = Math.sin(t * 3) * 0.15;
    p.head.position.y = 1.5 + b; p.head.rotation.y = Math.sin(t * 3) * 0.2; p.head.rotation.x = -0.15;
    p.armL.rotation.x = -2.6; p.armR.rotation.x = -2.6; p.armL.rotation.z = 0.5; p.armR.rotation.z = -0.5;
    p.foreL.rotation.x = -0.2; p.foreR.rotation.x = -0.2;
    p.legL.rotation.x = 0.1; p.legR.rotation.x = -0.1; p.shinL.rotation.x = 0.15; p.shinR.rotation.x = 0.15; return;
  }
  if (pose === 'skate') { // 보드 위: 무릎 굽히고 팔 벌려 균형
    const s3 = Math.sin(t * 0.9);
    p.torso.position.y = 0.78; p.torso.rotation.x = 0.3; p.torso.rotation.y = 0.35;
    p.head.position.y = 1.42; p.head.rotation.y = -0.3;
    p.legL.rotation.x = -0.45; p.legR.rotation.x = 0.3; p.shinL.rotation.x = 0.8; p.shinR.rotation.x = 0.55;
    p.armL.rotation.x = -0.3; p.armR.rotation.x = 0.2; p.armL.rotation.z = 1.0 + s3 * 0.12; p.armR.rotation.z = -0.9 - s3 * 0.12;
    p.foreL.rotation.x = -0.3; p.foreR.rotation.x = -0.3; return;
  }
  if (pose === 'skateAir') { // 공중: 몸을 말고 보드를 잡는다
    p.torso.position.y = 0.8; p.torso.rotation.x = 0.5; p.torso.rotation.y = 0.3;
    p.head.position.y = 1.44; p.head.rotation.y = -0.2;
    p.legL.rotation.x = -0.9; p.legR.rotation.x = -0.7; p.shinL.rotation.x = 1.5; p.shinR.rotation.x = 1.3;
    p.armL.rotation.x = -0.9; p.armR.rotation.x = -0.6; p.armL.rotation.z = 1.3; p.armR.rotation.z = -1.2;
    p.foreL.rotation.x = -1.2; p.foreR.rotation.x = -1.0; return;
  }
  if (pose === 'dash') { // 대시: 앞으로 크게 기울여 돌진
    p.torso.position.y = 0.8; p.torso.rotation.x = 0.55; p.torso.rotation.y = 0; p.head.position.y = 1.44; p.head.rotation.y = 0;
    p.legL.rotation.x = 1.0; p.legR.rotation.x = -0.9; p.shinL.rotation.x = 0.3; p.shinR.rotation.x = 1.2;
    p.armL.rotation.x = 0.9; p.armR.rotation.x = -1.2; p.armL.rotation.z = 0.1; p.armR.rotation.z = -0.1; p.foreL.rotation.x = -0.9; p.foreR.rotation.x = -0.9; return;
  }
  const amp = walking ? (running ? 0.95 : 0.6) : 0.04;
  const s = Math.sin(t), c = Math.cos(t);
  p.legL.rotation.x = s * amp; p.legR.rotation.x = -s * amp;
  p.shinL.rotation.x = walking ? Math.max(0, -s) * amp * 1.1 + 0.05 : 0.05; p.shinR.rotation.x = walking ? Math.max(0, s) * amp * 1.1 + 0.05 : 0.05;
  p.armL.rotation.x = -s * amp * 0.85; p.armR.rotation.x = s * amp * 0.85;
  p.armL.rotation.z = 0.08; p.armR.rotation.z = -0.08;
  p.foreL.rotation.x = -(0.35 + (walking ? Math.max(0, -s) * amp * 0.6 : 0) + (running ? 0.6 : 0)); p.foreR.rotation.x = -(0.35 + (walking ? Math.max(0, s) * amp * 0.6 : 0) + (running ? 0.6 : 0));
  if (!onGround) { p.armL.rotation.x = -2.2; p.armR.rotation.x = -2.2; p.foreL.rotation.x = -0.6; p.foreR.rotation.x = -0.6; p.legL.rotation.x = 0.55; p.legR.rotation.x = -0.25; p.shinL.rotation.x = 0.9; p.shinR.rotation.x = 0.3; }
  const bob = walking ? Math.abs(c) * (running ? 0.045 : 0.028) : 0;
  p.torso.position.y = 0.86 + bob; p.torso.rotation.y = walking ? -s * 0.08 : 0; p.torso.rotation.x = running ? 0.12 : 0;
  p.head.position.y = 1.50 + bob + (walking ? 0 : Math.sin(t * 0.5) * 0.008); p.head.rotation.y = walking ? s * 0.05 : Math.sin(t * 0.3) * 0.08;
  if (p.tail) p.tail.rotation.x = 0.35 + (walking ? Math.abs(c) * 0.25 : 0);
}

export class Player {
  constructor(scene, ch) {
    this.scene = scene;
    this.mesh = buildHumanoid(ch);
    scene.add(this.mesh);
    this.pos = new THREE.Vector3(0, 0, 0);
    this.vel = new THREE.Vector3();
    this.yaw = 0; // 바라보는 방향(라디안)
    this.onGround = true; this.speedMul = 1; this.animT = 0; this.moving = false; this.running = false;
    this.vx = 0; this.vz = 0; // 부드러운 가감속을 위한 수평 속도
    this.radius = 0.35; this.stepH = 0.55; this.jumpV = 7.5; this.gravity = -22;
    this.colliders = []; this.bounds = 60; this.floorFn = null;
    this.frozen = false; this.tmp = new THREE.Vector3();
    // 액션 상태: 기어가기 토글, 슬라이딩/대시 타이머, 제트팩 연료(0~1)
    this.crouch = false; this.slideT = 0; this.slideDir = 0; this.dashT = 0; this.dashCd = 0; this.fuel = 1; this.jetOn = false; this.pose = 'none'; this.maxJetY = 40;
    // 스케이트보드: 미끄러지듯 빠르게 달리고, 공중에서 돌면 트릭 점수가 난다
    this.skate = false; this.board = buildBoard(); this.board.visible = false; this.mesh.add(this.board);
    this.spin = 0; this.airT = 0; this.lean = 0; this.trick = null; this.boost = 0; this.boostDir = 0;
    this.speed = 0; // 현재 수평 속력 (HUD 표시용)
    this.punchT = 0; this.cheerT = 0; // 주먹 휘두르기 / 제거 세레머니 자세
  }
  /** 스케이트보드 타기/내리기 */
  setSkate(v) { this.skate = v; this.board.visible = v; if (v) this.crouch = false; return this.skate; }
  /** 부스트 패드: 잠깐 확 밀어 준다 */
  pushBoost(dir) { this.boost = 1.6; this.boostDir = dir ?? this.yaw; }
  reset(x, z, yaw = 0) { this.pos.set(x, 0, z); this.vel.set(0, 0, 0); this.vx = 0; this.vz = 0; this.yaw = yaw; this.onGround = true; this.mesh.position.copy(this.pos); this.mesh.rotation.y = yaw; }
  /** 발밑 바닥 높이: 플레이어 XZ를 포함하는 상자 중 (현재 높이 + 스텝) 이하의 가장 높은 윗면 */
  floorAt(x, z, y) {
    let f = this.floorFn ? this.floorFn(x, z) : 0;
    const r = this.radius * 0.6;
    for (const c of this.colliders) {
      if (x + r > c.min.x && x - r < c.max.x && z + r > c.min.z && z - r < c.max.z) {
        if (c.max.y > f && c.max.y <= y + this.stepH + 0.01) f = c.max.y;
      }
    }
    return f;
  }
  /** 옆으로 이동할 때 벽(윗면이 스텝보다 높은 상자)에 막히는지 검사 */
  blocked(x, z, y, h = PLAYER_H * 0.9) {
    const r = this.radius;
    for (const c of this.colliders) {
      if (x + r > c.min.x && x - r < c.max.x && z + r > c.min.z && z - r < c.max.z) {
        if (c.max.y > y + this.stepH && c.min.y < y + h) return c;
      }
    }
    return null;
  }
  update(dt, input, camYaw) {
    if (this.frozen) { this.animate(dt, false); return; }
    // ---- 액션 상태 ----
    if (input.skateToggle) { this.setSkate(!this.skate); input.skateToggle = false; }
    if (input.crouchToggle) { if (!this.skate) this.crouch = !this.crouch; input.crouchToggle = false; if (this.crouch) this.slideT = 0; }
    if (this.dashCd > 0) this.dashCd -= dt;
    if (input.dash && this.dashCd <= 0 && !this.crouch) { this.dashT = 0.32; this.dashCd = this.skate ? 0.8 : 1.1; }
    input.dash = false;
    if (this.dashT > 0) this.dashT -= dt;
    if (this.slideT > 0) this.slideT -= dt;
    if (this.boost > 0) this.boost -= dt;
    // 입력 → 카메라 기준 이동 방향
    let mx = input.x, mz = input.y; // x: 우(+), y: 앞(+)
    const len = Math.hypot(mx, mz); this.moving = len > 0.05;
    if (len > 1) { mx /= len; mz /= len; }
    this.running = !!input.run && this.moving && !this.crouch;
    // 점프 / 슬라이딩 / 올리
    if (input.jump) {
      input.jump = false;
      if (this.onGround) {
        if (this.skate) { this.vel.y = 9.2; this.onGround = false; this.spin = 0; this.airT = 0; }
        else if (this.running && this.slideT <= 0) { this.slideT = 0.75; this.slideDir = this.yaw; }
        else { this.vel.y = this.jumpV * (this.crouch ? 0.6 : 1); this.onGround = false; }
      }
    }
    const sliding = this.slideT > 0, dashing = this.dashT > 0;
    // 속도: 걷기 6.4 / 달리기 12.5 / 스케이트 10.5~19 (기존보다 전반적으로 빠르게)
    let spd = (this.running ? 12.5 : 6.4) * this.speedMul;
    if (this.skate) spd = (this.running ? 19 : 10.5) * this.speedMul;
    if (this.crouch) spd = 2.8 * this.speedMul;
    const fx = Math.sin(camYaw), fz = Math.cos(camYaw);
    const rx = -Math.cos(camYaw), rz = Math.sin(camYaw);
    let tvx = (fx * mz + rx * mx) * spd, tvz = (fz * mz + rz * mx) * spd;
    if (sliding) { const sp = 15 * this.speedMul * Math.max(0.35, this.slideT / 0.75); tvx = Math.sin(this.slideDir) * sp; tvz = Math.cos(this.slideDir) * sp; }
    if (dashing) { const sp = (this.skate ? 24 : 19) * this.speedMul; tvx = Math.sin(this.yaw) * sp; tvz = Math.cos(this.yaw) * sp; }
    if (this.boost > 0) { const sp = 26 * this.speedMul * Math.min(1, this.boost / 0.6); tvx += Math.sin(this.boostDir) * sp; tvz += Math.cos(this.boostDir) * sp; }
    // 가감속: 스케이트는 천천히 붙고 오래 미끄러진다
    let k;
    if (this.skate) k = Math.min(1, dt * (this.moving ? 3.2 : 0.55));
    else k = Math.min(1, dt * ((this.moving || sliding || dashing) ? 14 : 9));
    if (!this.onGround) k *= this.skate ? 0.35 : 0.6; // 공중에서는 방향을 크게 못 바꾼다
    this.vx += (tvx - this.vx) * k; this.vz += (tvz - this.vz) * k;
    if (Math.hypot(this.vx, this.vz) < 0.02) { this.vx = 0; this.vz = 0; }
    const vx = this.vx, vz = this.vz;
    this.speed = Math.hypot(vx, vz);
    // 방향 전환: 스케이트는 천천히 돌고, 공중에서는 A/D 로 회전(트릭)
    if (this.skate && !this.onGround) {
      const turn = (input.x || 0) * dt * 5.2; this.yaw += turn; this.spin += turn; this.airT += dt;
    } else if (this.moving && !sliding) {
      const target = Math.atan2(tvx, tvz); let d = target - this.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
      this.yaw += d * Math.min(1, dt * (this.skate ? 4.5 : 12));
      this.lean += (Math.max(-1, Math.min(1, d * 2)) - this.lean) * Math.min(1, dt * 6);
    } else this.lean += (0 - this.lean) * Math.min(1, dt * 5);
    // 제트팩
    this.jetOn = false;
    if (input.jet) { this.jetOn = true; const low = this.fuel <= 0.001; this.fuel = Math.max(0, this.fuel - dt / 24); this.vel.y = Math.min(this.vel.y + (low ? 24 : 46) * dt, low ? 2.5 : 6.5); this.onGround = false; }
    else this.fuel = Math.min(1, this.fuel + dt / (this.onGround ? 1.2 : 4));
    this.vel.y += (this.jetOn ? this.gravity * 0.35 : this.gravity) * dt;
    if (!this.onGround && !this.jetOn && this.vel.y < 0) this.vel.y = Math.max(this.vel.y, -18);
    // 수평 이동 (축 분리 충돌)
    const h = this.crouch || sliding ? PLAYER_H * 0.5 : PLAYER_H * 0.9;
    let nx = this.pos.x + vx * dt, nz = this.pos.z + vz * dt;
    if (this.blocked(nx, this.pos.z, this.pos.y, h)) { nx = this.pos.x; this.vx *= this.skate ? -0.2 : 0; if (sliding) this.slideT = 0; }
    if (this.blocked(nx, nz, this.pos.y, h)) { nz = this.pos.z; this.vz *= this.skate ? -0.2 : 0; if (sliding) this.slideT = 0; }
    const b = this.bounds; nx = Math.max(-b, Math.min(b, nx)); nz = Math.max(-b, Math.min(b, nz));
    this.pos.x = nx; this.pos.z = nz;
    // 수직
    let ny = this.pos.y + this.vel.y * dt;
    const f = this.floorAt(nx, nz, this.pos.y);
    const wasAir = !this.onGround;
    if (ny <= f) {
      ny = f; this.vel.y = 0;
      if (wasAir && this.skate) { // 착지: 돌아간 각도만큼 트릭 점수
        const deg = Math.abs(this.spin) * 180 / Math.PI;
        if (deg >= 160 && this.airT > 0.25) this.trick = { deg, air: this.airT };
        this.spin = 0; this.airT = 0;
      }
      this.onGround = true;
    } else { this.onGround = false; if (this.skate) this.airT += dt; }
    if (this.jetOn && ny > this.maxJetY) { ny = this.maxJetY; this.vel.y = Math.min(this.vel.y, 0); }
    this.pos.y = ny;
    this.mesh.position.copy(this.pos); this.mesh.rotation.y = this.yaw;
    // 스케이트 보드 기울기
    this.board.rotation.z = -this.lean * 0.5; this.board.rotation.x = this.onGround ? 0 : Math.min(0.5, this.vel.y * -0.03);
    if (this.punchT > 0) this.punchT -= dt;
    if (this.cheerT > 0) this.cheerT -= dt;
    this.pose = this.cheerT > 0 ? 'cheer' : this.punchT > 0 ? 'punch' : this.skate ? (this.onGround ? 'skate' : 'skateAir') : (sliding ? 'slide' : dashing ? 'dash' : this.jetOn ? 'jet' : this.crouch ? 'crouch' : 'none');
    if (this.mesh.userData.parts.jet) this.mesh.userData.parts.jet.visible = this.jetOn;
    this.animate(dt, this.moving || this.speed > 0.6);
  }
  /** 주먹을 휘두르는 자세를 0.35초 동안 취한다 */
  swing() { this.punchT = 0.35; }
  /** 제거 세레머니 자세 */
  cheer(sec = 1.8) { this.cheerT = sec; }
  /** 이번 프레임에 성공한 트릭을 가져가고 비운다 */
  takeTrick() { const t = this.trick; this.trick = null; return t; }
  animate(dt, moving) {
    const rate = this.running ? 11 : 7;
    if (moving && this.onGround) this.animT += dt * rate; else this.animT += dt * 2;
    animateHumanoid(this.mesh.userData.parts, this.animT, moving && this.onGround, this.running, this.onGround, this.pose);
  }
  setVisible(v) { this.mesh.visible = v; }
}
