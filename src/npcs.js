// 인물 NPC: 기술·AI 역사와 관련된 실존 인물이 층 안을 돌아다니며 말을 건다.
// - 말풍선: 본인의 실제 발언(quote), 역할 설명, 이 층의 사실 한 줄, 영상 안내를 번갈아 띄운다.
// - 몸짓: 손 흔들기·가리키기·생각하기·고개 끄덕이기·박수·점프를 섞어 정지해 있지 않게 한다.
// - 가까이 가면 멈춰서 플레이어를 바라보고 인사한다. E 키나 클릭으로 영상이 열린다.
import * as THREE from 'three';
import { buildHumanoid, animateHumanoid } from './player.js?v=20260913002818';
import { makeLabel } from './structures.js?v=20260913002818';
import { L, ytShort } from './i18n.js?v=20260913002818';

const GESTURES = ['wave', 'point', 'think', 'nod', 'clap', 'jump'];
const bubbleCache = new Map();

/** 말풍선 스프라이트용 텍스처 (같은 문장은 재사용). 줄바꿈(\n)으로 나뉜 줄 중 주소 줄은 따로 꾸민다. */
function bubbleTexture(text) {
  if (bubbleCache.has(text)) return bubbleCache.get(text);
  const c = document.createElement('canvas'); const ctx = c.getContext('2d');
  const fs = 30, maxW = 560, pad = 20;
  const bodyFont = `500 ${fs}px "Noto Sans KR", sans-serif`;
  const urlFont = `500 ${fs - 4}px "SF Mono", Menlo, monospace`;
  const isUrl = (s) => s.includes('youtu.be/');
  // 줄바꿈: 문단을 먼저 나누고, 각 문단을 낱말 단위로 감싼다
  const lines = [];
  for (const para of String(text).split('\n')) {
    const url = isUrl(para); ctx.font = url ? urlFont : bodyFont;
    const words = para.split(' '); let cur = '';
    for (const w of words) { const test = cur ? cur + ' ' + w : w; if (ctx.measureText(test).width > maxW && cur) { lines.push({ s: cur, url }); cur = w; } else cur = test; }
    if (cur) lines.push({ s: cur, url });
  }
  const width = Math.min(maxW, Math.max(...lines.map((l) => { ctx.font = l.url ? urlFont : bodyFont; return ctx.measureText(l.s).width; }))) + pad * 2;
  const height = lines.length * (fs * 1.35) + pad * 2 + 16;
  c.width = Math.ceil(width); c.height = Math.ceil(height);
  const r = 16;
  ctx.fillStyle = 'rgba(8,14,26,0.92)';
  ctx.beginPath();
  ctx.moveTo(r, 0); ctx.lineTo(c.width - r, 0); ctx.quadraticCurveTo(c.width, 0, c.width, r);
  ctx.lineTo(c.width, c.height - 16 - r); ctx.quadraticCurveTo(c.width, c.height - 16, c.width - r, c.height - 16);
  ctx.lineTo(c.width / 2 + 12, c.height - 16); ctx.lineTo(c.width / 2, c.height); ctx.lineTo(c.width / 2 - 12, c.height - 16);
  ctx.lineTo(r, c.height - 16); ctx.quadraticCurveTo(0, c.height - 16, 0, c.height - 16 - r);
  ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,209,102,0.85)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  lines.forEach((l, i) => {
    ctx.fillStyle = l.url ? '#9fe0ff' : '#f2f6ff'; ctx.font = l.url ? urlFont : bodyFont;
    ctx.fillText(l.s, c.width / 2, pad + i * (fs * 1.35));
  });
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.minFilter = THREE.LinearFilter;
  const out = { tex, w: c.width, h: c.height };
  if (bubbleCache.size > 300) { const k = bubbleCache.keys().next().value; bubbleCache.get(k).tex.dispose(); bubbleCache.delete(k); } // 텍스처가 무한히 쌓이지 않게
  bubbleCache.set(text, out); return out;
}

/** 인물이 할 말 목록: 실제 발언 → 역할 → 이 층의 사실 → 영상 안내.
 *  어떤 말풍선이 떠 있든 바로 영상을 찾아갈 수 있도록, 모든 줄 아래에 유튜브 주소를 붙인다. */
function buildLines(p, facts) {
  const out = [];
  if (p.quote) out.push('“' + L(p.quote) + '”');
  const role = L(p.role) || '';
  // 역할 설명을 문장 단위로 자른다. (구형 사파리 호환을 위해 lookbehind 정규식을 쓰지 않는다)
  const sentences = []; let buf = '';
  for (const ch of role) { buf += ch; if (ch === '.' || ch === '。' || ch === '!' || ch === '?') { if (buf.trim().length > 6) sentences.push(buf.trim()); buf = ''; } }
  if (buf.trim().length > 6) sentences.push(buf.trim());
  for (const part of sentences.slice(0, 2)) out.push(part);
  if (p.video) out.push('▶ ' + p.video.title + (p.video.min ? ` (${p.video.min}분)` : ''));
  for (const f of facts.slice(0, 3)) out.push(f);
  const base = out.length ? out : [L(p.name)];
  if (!p.video) return base;
  const link = '\n▶ ' + ytShort(p.video.id);
  return base.map((s) => s + link);
}

export class NPCManager {
  constructor(scene) { this.scene = scene; this.list = []; this.t = 0; }
  /** 이 층(levelId)에 속한 인물들을 배치한다. bounds: 층 반폭, facts: 이 층의 사실 문장들 */
  load(levelId, people, bounds, avoid = [], facts = []) {
    this.clear();
    const here = people.filter((p) => (p.areas || []).includes(levelId));
    here.forEach((p, i) => {
      const look = { skin: p.look?.skin ?? 0xf1c9a5, hair: p.look?.hair ?? 0x222222, hairStyle: p.look?.hairStyle ?? 'short', suit: p.look?.suit ?? 0x333844, suit2: p.look?.suit2 ?? 0x1a1e28, accent: 0xffd166, eye: p.look?.eye ?? 0x2a1a10, shoe: p.look?.shoe ?? 0x1a1a1a, hat: p.look?.hat || 'none' };
      const mesh = buildHumanoid(look); mesh.traverse((o) => { o.castShadow = false; });
      if (p.look?.glasses) addGlasses(mesh);
      // 배치: 안쪽/바깥쪽 두 겹 원 위에 흩어 놓고, 스폰·게이트 근처는 피한다
      const ringIdx = i % 2; const per = Math.ceil(here.length / 2);
      const a = ((i >> 1) / Math.max(1, per)) * Math.PI * 2 + (ringIdx ? 0.4 : 0) + 0.7;
      const r = bounds * (ringIdx ? 0.62 : 0.38);
      let hx = Math.cos(a) * r, hz = Math.sin(a) * r * 0.75;
      for (const av of avoid) if (Math.hypot(hx - av[0], hz - av[1]) < 8) { hx *= 0.6; hz *= 0.6; }
      mesh.position.set(hx, 0, hz);
      const lab = makeLabel('▶ ' + L(p.name), L(p.role).slice(0, 34), { scale: 0.7, border: 'rgba(255,209,102,0.9)', bg: 'rgba(20,12,2,0.8)' }); lab.position.y = 2.15; mesh.add(lab);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.7, 32), new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; mesh.add(ring);
      const bubble = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, opacity: 0 })); bubble.position.y = 3.0; bubble.visible = false; mesh.add(bubble);
      this.scene.add(mesh);
      this.list.push({
        person: p, mesh, ring, bubble, lines: buildLines(p, facts), lineIdx: Math.floor(Math.random() * 3),
        home: new THREE.Vector3(hx, 0, hz), target: new THREE.Vector3(hx, 0, hz), wait: 1 + Math.random() * 2,
        animT: Math.random() * 6, yaw: a + Math.PI, walking: false, near: false, wasNear: false,
        speakT: 1.5 + Math.random() * 6, speakHold: 0, gesture: null, gestureT: 0, gestureCd: 2 + Math.random() * 6, jumpT: 0,
      });
    });
    return this.list.length;
  }
  say(n, text) {
    const b = bubbleTexture(text);
    n.bubble.material.map = b.tex; n.bubble.material.needsUpdate = true;
    n.bubble.scale.set(b.w / 150, b.h / 150, 1);
    n.bubble.position.y = 2.9 + b.h / 300;
    n.bubble.visible = true; n.bubble.material.opacity = 0; n.speakHold = 4.5 + text.length * 0.035;
  }
  update(dt, playerPos) {
    this.t += dt;
    for (const n of this.list) {
      const m = n.mesh; const d = playerPos ? Math.hypot(playerPos.x - m.position.x, playerPos.z - m.position.z) : 99;
      n.near = d < 3.4;
      // ---- 말하기 ----
      if (n.near && !n.wasNear) { n.gesture = 'wave'; n.gestureT = 1.6; this.say(n, n.lines[n.lineIdx % n.lines.length]); n.lineIdx++; n.speakT = 6; }
      n.wasNear = n.near;
      n.speakT -= dt;
      if (n.speakT <= 0 && n.speakHold <= 0) { this.say(n, n.lines[n.lineIdx % n.lines.length]); n.lineIdx++; n.speakT = (n.near ? 5 : 9) + Math.random() * 7; }
      if (n.speakHold > 0) { n.speakHold -= dt; const o = n.bubble.material; o.opacity = Math.min(1, o.opacity + dt * 4); if (n.speakHold <= 0.6) o.opacity = Math.max(0, o.opacity - dt * 2.2); if (n.speakHold <= 0) n.bubble.visible = false; }
      // ---- 몸짓 ----
      n.gestureCd -= dt;
      if (n.gesture) { n.gestureT -= dt; if (n.gestureT <= 0) { n.gesture = null; n.gestureCd = 3 + Math.random() * 7; } }
      else if (n.gestureCd <= 0 && !n.walking) { n.gesture = GESTURES[Math.floor(Math.random() * GESTURES.length)]; n.gestureT = n.gesture === 'jump' ? 0.9 : 1.8 + Math.random(); if (n.gesture === 'jump') n.jumpT = 0; }
      // ---- 이동 ----
      if (n.near) {
        n.walking = false; const ty = Math.atan2(playerPos.x - m.position.x, playerPos.z - m.position.z); n.yaw += Math.atan2(Math.sin(ty - n.yaw), Math.cos(ty - n.yaw)) * Math.min(1, dt * 8);
        n.ring.material.opacity = 0.7 + Math.sin(this.t * 6) * 0.25; n.ring.scale.setScalar(1.15);
      } else {
        n.ring.material.opacity = 0.35; n.ring.scale.setScalar(1);
        const dx = n.target.x - m.position.x, dz = n.target.z - m.position.z; const dist = Math.hypot(dx, dz);
        if (dist > 0.3 && !n.gesture) { n.walking = true; const ty = Math.atan2(dx, dz); n.yaw += Math.atan2(Math.sin(ty - n.yaw), Math.cos(ty - n.yaw)) * Math.min(1, dt * 5); const sp = 1.35; m.position.x += Math.sin(n.yaw) * sp * dt; m.position.z += Math.cos(n.yaw) * sp * dt; }
        else { n.walking = false; n.wait -= dt; if (n.wait <= 0 && !n.gesture) { const ang = Math.random() * Math.PI * 2, rr = 3 + Math.random() * 6; n.target.set(n.home.x + Math.cos(ang) * rr, 0, n.home.z + Math.sin(ang) * rr); n.wait = 1.5 + Math.random() * 3; } }
      }
      m.rotation.y = n.yaw;
      n.animT += dt * (n.walking ? 6.5 : 2);
      animateHumanoid(m.userData.parts, n.animT, n.walking, false, true);
      // 말하는 동안 고개를 조금 움직이고, 몸짓이 있으면 팔·몸을 덮어쓴다
      const P = m.userData.parts;
      if (n.speakHold > 0) { P.head.rotation.y += Math.sin(this.t * 5 + n.animT) * 0.06; P.head.rotation.x = Math.sin(this.t * 7) * 0.04; }
      m.position.y = 0;
      if (n.gesture) applyGesture(P, n, this.t, m);
    }
  }
  /** 플레이어 근처의 NPC */
  nearest(playerPos, maxD = 3.4) { let best = null, bd = maxD; for (const n of this.list) { const d = Math.hypot(playerPos.x - n.mesh.position.x, playerPos.z - n.mesh.position.z); if (d < bd) { bd = d; best = n; } } return best; }
  /** 화면 클릭 → 레이캐스트로 NPC 찾기. 말풍선과 이름표를 눌러도 영상이 열리도록 스프라이트까지 포함한다. */
  pick(raycaster) { const meshes = []; for (const n of this.list) n.mesh.traverse((o) => { if (o.isMesh || (o.isSprite && o.visible)) { o.userData.npc = n; meshes.push(o); } }); const hit = raycaster.intersectObjects(meshes, false)[0]; return hit ? hit.object.userData.npc : null; }
  clear() { for (const n of this.list) this.scene.remove(n.mesh); this.list = []; }
}

/** 몸짓: 팔·머리·몸의 회전을 덮어쓴다 */
function applyGesture(P, n, time, mesh) {
  const g = n.gesture; const k = time * 6;
  if (g === 'wave') { P.armR.rotation.z = -2.1; P.armR.rotation.x = -0.2; P.foreR.rotation.x = -0.5 + Math.sin(k * 1.6) * 0.5; P.foreR.rotation.z = Math.sin(k * 1.6) * 0.4; }
  else if (g === 'point') { P.armR.rotation.x = -1.5; P.armR.rotation.z = -0.25; P.foreR.rotation.x = -0.1; P.torso.rotation.y = 0.12; }
  else if (g === 'think') { P.armR.rotation.x = -1.1; P.armR.rotation.z = -0.55; P.foreR.rotation.x = -2.0; P.head.rotation.x = 0.18; P.head.rotation.y = -0.12; }
  else if (g === 'nod') { P.head.rotation.x = Math.sin(k * 1.4) * 0.22; }
  else if (g === 'clap') { const c = Math.abs(Math.sin(k * 1.8)); P.armL.rotation.x = -1.25; P.armR.rotation.x = -1.25; P.armL.rotation.z = 0.55 - c * 0.45; P.armR.rotation.z = -0.55 + c * 0.45; P.foreL.rotation.x = -1.0; P.foreR.rotation.x = -1.0; }
  else if (g === 'jump') { n.jumpT += 0.016; const u = Math.max(0, Math.min(1, n.gestureT / 0.9)); const h = Math.sin((1 - u) * Math.PI) * 0.55; mesh.position.y = h; P.armL.rotation.x = -2.2; P.armR.rotation.x = -2.2; P.legL.rotation.x = 0.4; P.legR.rotation.x = -0.3; P.shinL.rotation.x = 0.9; P.shinR.rotation.x = 0.6; }
}

function addGlasses(mesh) {
  const head = mesh.userData.parts.head; const m = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.3 });
  for (const sx of [-1, 1]) { const rim = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.005, 6, 18), m); rim.position.set(sx * 0.047, 0.125, 0.128); head.add(rim); }
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.005, 0.005), m); bridge.position.set(0, 0.128, 0.128); head.add(bridge);
  for (const sx of [-1, 1]) { const arm = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.005, 0.13), m); arm.position.set(sx * 0.085, 0.125, 0.065); head.add(arm); }
}
