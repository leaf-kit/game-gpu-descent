// 절차 생성 구조물 빌더. 각 빌더는 { group, colliders[] } 를 반환한다. colliders 는 THREE.Box3.
import * as THREE from 'three';
import { L, L2 } from './i18n.js?v=20260913002818';

const matCache = new Map();
export function mat(color, opt = {}) {
  const key = color + '|' + JSON.stringify(opt);
  if (matCache.has(key)) return matCache.get(key);
  const m = new THREE.MeshStandardMaterial({ color, roughness: opt.rough ?? 0.6, metalness: opt.metal ?? 0.2, emissive: opt.emissive ?? 0x000000, emissiveIntensity: opt.ei ?? 1, transparent: !!opt.opacity, opacity: opt.opacity ?? 1, side: opt.double ? THREE.DoubleSide : THREE.FrontSide, flatShading: !!opt.flat });
  matCache.set(key, m); return m;
}

/** 텍스트 라벨 스프라이트(두 언어) */
export function makeLabel(text, sub, opt = {}) {
  const c = document.createElement('canvas'); const ctx = c.getContext('2d');
  const fs = opt.fontSize || 44; const pad = 18;
  ctx.font = `700 ${fs}px Orbitron, "Noto Sans KR", sans-serif`;
  const w1 = ctx.measureText(text).width; ctx.font = `500 ${fs * 0.62}px "Noto Sans KR", sans-serif`; const w2 = sub ? ctx.measureText(sub).width : 0;
  c.width = Math.ceil(Math.max(w1, w2) + pad * 2); c.height = sub ? Math.ceil(fs * 1.9 + pad) : Math.ceil(fs * 1.3 + pad);
  ctx.fillStyle = opt.bg || 'rgba(2,8,20,0.72)'; roundRect(ctx, 0, 0, c.width, c.height, 12); ctx.fill();
  ctx.strokeStyle = opt.border || 'rgba(118,185,0,0.8)'; ctx.lineWidth = 3; roundRect(ctx, 2, 2, c.width - 4, c.height - 4, 10); ctx.stroke();
  ctx.fillStyle = opt.color || '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.font = `700 ${fs}px Orbitron, "Noto Sans KR", sans-serif`; ctx.fillText(text, c.width / 2, pad * 0.5);
  if (sub) { ctx.font = `500 ${fs * 0.62}px "Noto Sans KR", sans-serif`; ctx.fillStyle = opt.subColor || '#b9d8ff'; ctx.fillText(sub, c.width / 2, pad * 0.5 + fs * 1.1); }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.minFilter = THREE.LinearFilter;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: opt.depthTest ?? true, depthWrite: false }));
  const s = opt.scale || 1; sp.scale.set(c.width / 150 * s, c.height / 150 * s, 1);
  sp.userData.isLabel = true;
  return sp;
}
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); }

function box3(x, y, z, w, h, d) { return new THREE.Box3(new THREE.Vector3(x - w / 2, y, z - d / 2), new THREE.Vector3(x + w / 2, y + h, z + d / 2)); }

// ---------- 반복 동작(애니메이션) 헬퍼 ----------
// 각 빌더는 선택적으로 anim(tm, dt) 함수를 돌려주며, Level.update 가 매 프레임 호출한다.
// 용어 카드로만 읽는 대신 구조물이 '무슨 일을 하는지' 스스로 보여주기 위한 장치.
const dotGeo = new THREE.SphereGeometry(1, 8, 6);
/** 자체 재질을 가진 발광 점 (데이터·전자·신호) */
function glowDot(color, r = 0.2, opacity = 0.95) { const m = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false })); m.scale.setScalar(r); return m; }
/** 발광 막대/판 (스캔라인, 데이터 펄스) */
function glowBar(color, w, h, d, opacity = 0.8) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false })); }
const frac = (x) => x - Math.floor(x);


/** 국가 코드 → 국기 이모지·국가명 */
export const COUNTRIES = {
  US: { flag: '🇺🇸', ko: '미국', en: 'USA' }, KR: { flag: '🇰🇷', ko: '대한민국', en: 'South Korea' }, TW: { flag: '🇹🇼', ko: '대만', en: 'Taiwan' }, JP: { flag: '🇯🇵', ko: '일본', en: 'Japan' },
  NL: { flag: '🇳🇱', ko: '네덜란드', en: 'Netherlands' }, DE: { flag: '🇩🇪', ko: '독일', en: 'Germany' }, CN: { flag: '🇨🇳', ko: '중국', en: 'China' }, NO: { flag: '🇳🇴', ko: '노르웨이', en: 'Norway' },
  BE: { flag: '🇧🇪', ko: '벨기에', en: 'Belgium' }, FR: { flag: '🇫🇷', ko: '프랑스', en: 'France' }, ES: { flag: '🇪🇸', ko: '스페인', en: 'Spain' }, IT: { flag: '🇮🇹', ko: '이탈리아', en: 'Italy' },
  CH: { flag: '🇨🇭', ko: '스위스', en: 'Switzerland' }, CA: { flag: '🇨🇦', ko: '캐나다', en: 'Canada' }, IL: { flag: '🇮🇱', ko: '이스라엘', en: 'Israel' }, IN: { flag: '🇮🇳', ko: '인도', en: 'India' }, GB: { flag: '🇬🇧', ko: '영국', en: 'UK' }, AT: { flag: '🇦🇹', ko: '오스트리아', en: 'Austria' }, SG: { flag: '🇸🇬', ko: '싱가포르', en: 'Singapore' },
};
/** 회사 워드마크 + 국기 + 역할을 그린 간판 텍스처. 상표 이미지 대신 브랜드 색과 글자체로 표현한다. */
function logoTexture(brand, country, role, color, textColor) {
  const c = document.createElement('canvas'); c.width = 640; c.height = 360; const ctx = c.getContext('2d');
  const cc = COUNTRIES[country] || { flag: '', ko: country, en: country };
  ctx.fillStyle = '#0a0f18'; ctx.fillRect(0, 0, 640, 360);
  ctx.fillStyle = color; ctx.fillRect(0, 0, 640, 200);
  ctx.fillStyle = textColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let fs = 88; ctx.font = `900 ${fs}px Orbitron, "Noto Sans KR", sans-serif`; while (ctx.measureText(brand).width > 580 && fs > 30) { fs -= 4; ctx.font = `900 ${fs}px Orbitron, "Noto Sans KR", sans-serif`; }
  ctx.fillText(brand, 320, 100);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 46px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Noto Sans KR", sans-serif';
  ctx.fillText(`${cc.flag}  ${L({ ko: cc.ko, en: cc.en })}`, 320, 245);
  ctx.fillStyle = '#b9d8ff'; ctx.font = '500 32px "Noto Sans KR", sans-serif'; ctx.fillText(L(role), 320, 310);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 6; ctx.strokeRect(3, 3, 634, 354);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; return tex;
}


/** 여러 줄 텍스트 패널 텍스처 (스테이지 안내판) */
export function makeBoardCanvas(title, subtitle, body, bullets, accent = '#76b900') {
  const W = 1024, H = 600; const c = document.createElement('canvas'); c.width = W; c.height = H; const ctx = c.getContext('2d');
  const grd = ctx.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, '#0b1524'); grd.addColorStop(1, '#060d18');
  ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = accent; ctx.lineWidth = 8; ctx.strokeRect(4, 4, W - 8, H - 8);
  ctx.fillStyle = accent; ctx.fillRect(0, 0, W, 10);
  const wrap = (text, font, maxW) => { ctx.font = font; const out = []; let line = ''; for (const ch of text) { const test = line + ch; if (ctx.measureText(test).width > maxW && line) { out.push(line); line = ch; } else line = test; } if (line) out.push(line); return out; };
  let y = 70;
  ctx.fillStyle = accent; ctx.font = '700 34px Orbitron, "Noto Sans KR", sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(title, 48, y); y += 52;
  if (subtitle) { ctx.fillStyle = '#b9d8ff'; ctx.font = '500 26px "Noto Sans KR", sans-serif'; for (const l of wrap(subtitle, '500 26px "Noto Sans KR", sans-serif', W - 96).slice(0, 2)) { ctx.fillText(l, 48, y); y += 34; } }
  y += 12; ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(48, y); ctx.lineTo(W - 48, y); ctx.stroke(); y += 36;
  ctx.fillStyle = '#e8eefc'; ctx.font = '400 27px "Noto Sans KR", sans-serif';
  for (const l of wrap(body, '400 27px "Noto Sans KR", sans-serif', W - 96).slice(0, 5)) { if (y > H - 150) break; ctx.fillText(l, 48, y); y += 38; }
  y += 10;
  ctx.font = '500 24px "Noto Sans KR", sans-serif';
  for (const b of (bullets || []).slice(0, 4)) {
    if (y > H - 150) break; // 아래쪽 영상 안내 줄(유튜브 주소 포함) 자리를 비워 둔다
    ctx.fillStyle = '#ffd166'; ctx.fillText('●', 48, y);
    ctx.fillStyle = '#cfe0f5';
    const lines = wrap(b, '500 24px "Noto Sans KR", sans-serif', W - 130);
    ctx.fillText(lines[0], 78, y); y += 32;
    if (lines[1]) { ctx.fillText(lines[1].slice(0, 60), 78, y); y += 32; }
  }
  return c;
}

/** 안내판 캔버스에 "영상 보기" 넛지 줄과 유튜브 주소를 깔아 준다 */
function drawVideoNudge(c, video, nudge, more = 0) {
  const ctx = c.getContext('2d'); const H = c.height, W = c.width;
  const barH = 108, y = H - barH;
  ctx.fillStyle = 'rgba(255,209,102,0.16)'; ctx.fillRect(0, y, W, barH);
  ctx.fillStyle = '#ffd166'; ctx.fillRect(0, y, 6, barH);
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.font = '700 30px "Noto Sans KR", sans-serif'; ctx.fillStyle = '#ffd166';
  ctx.fillText('▶', 26, y + 30);
  ctx.font = '700 25px "Noto Sans KR", sans-serif';
  ctx.fillText(nudge + (more > 0 ? ` (+${more})` : ''), 62, y + 30);
  const clip = (text, font, maxW) => { ctx.font = font; let s = text; while (ctx.measureText(s).width > maxW && s.length > 4) s = s.slice(0, -2); return s === text ? text : s + '…'; };
  ctx.fillStyle = '#e6eefc';
  ctx.fillText(clip(video.title, '400 21px "Noto Sans KR", sans-serif', W - 110), 62, y + 62);
  // 유튜브 주소를 그대로 적어 두면, 화면 밖에서도 주소를 보고 바로 찾아볼 수 있다
  ctx.fillStyle = '#9fe0ff'; ctx.font = '500 20px "SF Mono", Menlo, monospace';
  ctx.fillText(`youtu.be/${video.id}`, 62, y + 88);
}

/** 라벨을 구조물 위에 붙인다 */
function attachLabel(group, s, height) {
  if (!s.label) return;
  const sp = makeLabel(L(s.label), L2(s.label), { scale: s.labelScale || 1 });
  sp.position.set(0, height + 1.2 * (s.labelScale || 1), 0); group.add(sp);
}

export const BUILDERS = {
  /** 단순 상자 */
  box(s) {
    const [w, h, d] = s.size; const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(s.color ?? 0x334466, s.mat || {}));
    m.position.y = h / 2; m.castShadow = true; m.receiveShadow = true; g.add(m);
    if (s.edges) { const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: s.edges })); e.position.y = h / 2; g.add(e); }
    if (s.top) { const t = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, 0.06, d * 0.96), mat(s.top, { emissive: s.top, ei: 0.5 })); t.position.y = h + 0.03; g.add(t); }
    attachLabel(g, s, h);
    let anim = null;
    if (s.term || s.top || s.anim) { // 데이터 펄스: 윗면을 가로질러 흐르는 빛 띠 (처리 중임을 표현)
      const bar = glowBar(s.top || s.edges || 0x5ee0ff, w * 0.9, 0.08, Math.min(0.6, d * 0.08)); bar.position.y = h + 0.1; g.add(bar);
      const ph = Math.random() * 10, period = 2.2 + Math.random() * 1.2;
      anim = (tm) => { const u = frac((tm + ph) / period); bar.position.z = (u - 0.5) * d * 0.9; bar.material.opacity = Math.sin(u * Math.PI) * 0.8; };
    }
    return { group: g, colliders: s.solid === false ? [] : [box3(0, 0, 0, w, h, d)], anim };
  },
  /** 적층 탑 (HBM 스택, 배선층 등) */
  tower(s) {
    const [w, h, d] = s.size; const n = s.layers || 8; const g = new THREE.Group(); const lh = h / n; const layers = [];
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, lh * 0.8, d), mat(i === 0 && s.baseColor ? s.baseColor : (s.color ?? 0x556677), s.mat || {}));
      m.position.y = i * lh + lh * 0.4; m.castShadow = true; g.add(m); layers.push(m);
      if (s.gapColor) { const gm = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, lh * 0.2, d * 0.9), mat(s.gapColor, { emissive: s.gapColor, ei: 0.6 })); gm.position.y = i * lh + lh * 0.9; g.add(gm); }
    }
    if (s.pillars) { // TSV 기둥
      const pm = mat(s.pillars, { emissive: s.pillars, ei: 0.4, metal: 0.8 });
      for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * w, 0.05 * w, h, 6), pm); c.position.set((i - 2.5) * w * 0.14, h / 2, (j - 2.5) * d * 0.14); g.add(c); }
    }
    attachLabel(g, s, h);
    // 비트가 TSV를 타고 층층이 올라간다: 지나는 층이 살짝 부푼다
    const col = s.gapColor || s.pillars || 0x5ee0ff; const dots = [];
    for (let k = 0; k < 3; k++) { const dd = glowDot(col, Math.min(0.35, w * 0.08)); dd.position.set((k - 1) * w * 0.28, 0, d * 0.52); g.add(dd); dots.push(dd); }
    const anim = (tm) => {
      const ys = dots.map((dd, k) => { const u = frac(tm * 0.35 + k / 3); dd.position.y = u * h; dd.material.opacity = Math.sin(u * Math.PI); return u * h; });
      layers.forEach((lm, i) => { const cy = i * lh + lh * 0.4; let a = 0; for (const y of ys) a = Math.max(a, 1 - Math.abs(y - cy) / lh); lm.scale.x = lm.scale.z = 1 + Math.max(0, a) * 0.06; });
    };
    return { group: g, colliders: [box3(0, 0, 0, w, h, d)], anim };
  },
  /** 바닥 구획(플로어플랜): cells = [{x,z,w,d,color,label,term,h}] */
  grid(s) {
    const g = new THREE.Group(); const cols = []; const triggers = []; const tops = [];
    for (const c of s.cells) {
      const h = c.h ?? s.cellH ?? 0.6;
      const m = new THREE.Mesh(new THREE.BoxGeometry(c.w, h, c.d), mat(c.color ?? s.color ?? 0x2b4a6a, { rough: 0.7, metal: 0.3 }));
      m.position.set(c.x, h / 2, c.z); m.receiveShadow = true; m.castShadow = true; g.add(m);
      // 구획 활동 표시: 작업이 구획을 옮겨 다니듯 윗면이 차례로 밝아진다
      const tp = new THREE.Mesh(new THREE.PlaneGeometry(c.w * 0.96, c.d * 0.96), new THREE.MeshBasicMaterial({ color: s.edge ?? 0x76b900, transparent: true, opacity: 0.08, depthWrite: false }));
      tp.rotation.x = -Math.PI / 2; tp.position.set(c.x, h + 0.04, c.z); g.add(tp); tops.push(tp);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: s.edge ?? 0x76b900, transparent: true, opacity: 0.6 })); e.position.copy(m.position); g.add(e);
      if (c.term) { m.userData.term = c.term; e.userData.term = c.term; }
      if (c.label) { const sp = makeLabel(L(c.label), L2(c.label), { scale: c.labelScale || s.labelScale || 0.8 }); sp.position.set(c.x, h + 1.4, c.z); g.add(sp); }
      if (c.solid !== false && h > 0.5) cols.push(box3(c.x, 0, c.z, c.w, h, c.d));
      if (c.term) triggers.push({ x: c.x, z: c.z, r: Math.max(c.w, c.d) / 2 + 1.5, term: c.term, label: c.label });
    }
    const anim = (tm) => { tops.forEach((tp, i) => { tp.material.opacity = 0.04 + 0.28 * Math.max(0, Math.sin(tm * 1.6 + i * 0.9)); }); };
    return { group: g, colliders: cols, triggers, anim };
  },
  /** 원기둥 (TSV, 비아, 기둥) */
  cylinder(s) {
    const [r, h] = s.size; const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * (s.taper ?? 1), h, s.seg || 12), mat(s.color ?? 0xb87333, s.mat || { metal: 0.8, rough: 0.35 }));
    m.position.y = h / 2; m.castShadow = true; g.add(m);
    attachLabel(g, s, h);
    // 신호 링이 기둥을 타고 올라간다 (비아/TSV를 지나는 신호)
    const col = s.glow ?? ((s.mat && s.mat.emissive) || (s.color ?? 0x5ee0ff));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 1.12, Math.max(0.03, r * 0.08), 6, 24), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8, depthWrite: false }));
    ring.rotation.x = Math.PI / 2; g.add(ring); const ph = Math.random() * 3;
    const anim = (tm) => { const u = frac((tm + ph) * 0.5); ring.position.y = u * h; ring.material.opacity = Math.sin(u * Math.PI) * 0.85; };
    return { group: g, colliders: s.solid === false ? [] : [box3(0, 0, 0, r * 1.6, h, r * 1.6)], anim };
  },
  /** 관/배선: path = [[x,y,z],...] 를 따라 튜브 */
  pipe(s) {
    const pts = s.path.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', s.tension ?? 0.1);
    const geo = new THREE.TubeGeometry(curve, Math.max(8, pts.length * 6), s.radius ?? 0.3, 8, false);
    const m = new THREE.Mesh(geo, mat(s.color ?? 0xd08a3c, s.mat || { metal: 0.9, rough: 0.3, emissive: s.glow ?? 0x000000, ei: 0.5 }));
    const g = new THREE.Group(); g.add(m); if (s.label) { const sp = makeLabel(L(s.label), L2(s.label), { scale: s.labelScale || 0.8 }); const mid = curve.getPoint(0.5); sp.position.set(mid.x, mid.y + 1.2, mid.z); g.add(sp); }
    // 관 속을 흐르는 신호 점 3개
    const dots = []; const col = s.glow || s.color || 0xd08a3c;
    for (let k = 0; k < 3; k++) { const dd = glowDot(col, (s.radius ?? 0.3) * 0.9); g.add(dd); dots.push(dd); }
    const anim = (tm) => { dots.forEach((dd, k) => { dd.position.copy(curve.getPointAt(frac(tm * 0.18 + k / 3))); }); };
    return { group: g, colliders: [], anim };
  },
  /** 구 (원자, 전자) */
  sphere(s) {
    const g = new THREE.Group(); const r = s.size[0];
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), mat(s.color ?? 0xffffff, s.mat || { rough: 0.4, emissive: s.glow ?? 0x000000, ei: 0.6 }));
    m.position.y = s.y ?? r; m.castShadow = true; g.add(m); attachLabel(g, s, (s.y ?? r) + r);
    // 전자 2개가 궤도를 돌고, 구는 천천히 숨 쉰다
    const orb = new THREE.Group(); orb.position.y = m.position.y; g.add(orb);
    const e1 = glowDot(0x9fd7ff, r * 0.14), e2 = glowDot(0x9fd7ff, r * 0.14); orb.add(e1); orb.add(e2); const R = r * 1.5, y0 = s.y ?? r;
    const anim = (tm) => {
      e1.position.set(Math.cos(tm * 2.2) * R, Math.sin(tm * 2.2) * R * 0.35, Math.sin(tm * 2.2) * R);
      e2.position.set(Math.cos(tm * 1.7 + 2) * R * 0.9, -Math.sin(tm * 1.7 + 2) * R * 0.5, Math.sin(tm * 1.7 + 2) * R * 0.9);
      m.position.y = y0 + Math.sin(tm * 1.3) * r * 0.06; orb.position.y = m.position.y;
    };
    return { group: g, colliders: s.solid === false ? [] : [box3(0, 0, 0, r * 1.5, (s.y ?? r) + r, r * 1.5)], anim };
  },
  /** 3D 격자 (실리콘 결정): n×n×n 원자 + 결합 막대 */
  lattice(s) {
    const g = new THREE.Group(); const n = s.n || 5; const a = s.spacing || 4; const r = s.radius || 0.55;
    const atomM = mat(s.color ?? 0xdde6ff, { rough: 0.3, metal: 0.1, emissive: 0x334466, ei: 0.4 });
    const dopM = mat(s.dopant ?? 0xff5577, { emissive: 0xff2255, ei: 0.8 });
    const bondM = mat(0x88aaff, { emissive: 0x3355aa, ei: 0.6, opacity: 0.7 });
    const sph = new THREE.SphereGeometry(r, 14, 10); const cols = []; const y0 = s.y0 ?? r;
    const dopants = new Set((s.dopants || []).map((d) => d.join(',')));
    // 다이아몬드 입방 격자를 단순화: 두 개의 FCC 부격자 (실제 구조 비유). 게임 가독성을 위해 간격 확대.
    const positions = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < (s.ny || 2); j++) for (let k = 0; k < n; k++) {
      positions.push([(i - (n - 1) / 2) * a, y0 + j * a, (k - (n - 1) / 2) * a, `${i},${j},${k}`]);
      if (i < n - 1 && k < n - 1) positions.push([(i - (n - 1) / 2) * a + a / 2, y0 + j * a + a / 2, (k - (n - 1) / 2) * a + a / 2, `${i}.5,${j}.5,${k}.5`]);
    }
    const atoms = []; let dopIdx = -1;
    for (const [x, y, z, key] of positions) {
      const isD = dopants.has(key); const m = new THREE.Mesh(sph, isD ? dopM : atomM); m.position.set(x, y, z); m.castShadow = true; g.add(m);
      if (isD && dopIdx < 0) dopIdx = atoms.length; atoms.push({ m, x, y, z, ph: Math.random() * 6.28 });
      if (y <= y0 + 0.01) cols.push(box3(x, 0, z, r * 1.6, y + r, r * 1.6));
      if (isD && s.dopantLabel) { const sp = makeLabel(L(s.dopantLabel), L2(s.dopantLabel), { scale: 0.7 }); sp.position.set(x, y + r + 1, z); g.add(sp); }
    }
    // 결합: 인접 원자 (거리 ≈ a*sqrt(3)/2 인 두 부격자 사이)
    const dMax = a * 0.9; const cylG = new THREE.CylinderGeometry(0.08, 0.08, 1, 6);
    for (let p = 0; p < positions.length; p++) for (let q = p + 1; q < positions.length; q++) {
      const A = positions[p], B = positions[q]; const dx = B[0] - A[0], dy = B[1] - A[1], dz = B[2] - A[2]; const d = Math.hypot(dx, dy, dz);
      if (d > dMax || d < a * 0.5) continue;
      const c = new THREE.Mesh(cylG, bondM); c.position.set((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2); c.scale.y = d;
      c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, dy, dz).normalize()); g.add(c);
    }
    attachLabel(g, s, y0 + (s.ny || 2) * a);
    // 열진동: 원자들이 제자리에서 미세하게 떨린다. 자유 전자 하나가 도펀트에서 출발해 이웃 원자 사이를 옮겨 다닌다.
    const el = glowDot(0x5ee0ff, r * 0.35); g.add(el); let from = Math.max(0, dopIdx), to = from, u = 1;
    const neighbors = (i) => { const A = atoms[i]; const out = []; atoms.forEach((B, j) => { if (j !== i && Math.hypot(A.x - B.x, A.y - B.y, A.z - B.z) < a * 0.9) out.push(j); }); return out; };
    const anim = (tm, dt) => {
      for (const at of atoms) at.m.position.set(at.x + Math.sin(tm * 6 + at.ph) * r * 0.12, at.y + Math.sin(tm * 7 + at.ph * 1.3) * r * 0.12, at.z + Math.cos(tm * 5 + at.ph) * r * 0.12);
      u += dt * 1.2; if (u >= 1) { u = 0; from = to; const nb = neighbors(from); to = nb.length ? nb[Math.floor(Math.random() * nb.length)] : Math.floor(Math.random() * atoms.length); }
      el.position.lerpVectors(atoms[from].m.position, atoms[to].m.position, u); el.position.y += Math.sin(u * Math.PI) * r * 0.8;
    };
    return { group: g, colliders: cols, anim };
  },
  /** FinFET: 지느러미(fin) + 감싸는 게이트 + 소스/드레인 */
  finfet(s) {
    const g = new THREE.Group(); const fw = s.finW || 1.2, fh = s.finH || 7, fl = s.finL || 30; const nf = s.fins || 2; const pitch = s.pitch || 5;
    const finM = mat(0x8fb3ff, { rough: 0.35, metal: 0.2, emissive: 0x1a3060, ei: 0.5 });
    const gateM = mat(0xffc857, { rough: 0.3, metal: 0.8, emissive: 0x805a10, ei: 0.35 });
    const oxM = mat(0xff66aa, { emissive: 0xff2288, ei: 0.7, opacity: 0.85 });
    const sdM = mat(0x66ffaa, { emissive: 0x11aa55, ei: 0.5 });
    const cols = []; const gl = s.gateL || 4; const fins = []; const elec = [];
    for (let i = 0; i < nf; i++) {
      const x = (i - (nf - 1) / 2) * pitch;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(fw, fh, fl), finM); fin.position.set(x, fh / 2, 0); fin.castShadow = true; g.add(fin); cols.push(box3(x, 0, 0, fw, fh, fl)); fins.push(fin);
      for (let k = 0; k < 6; k++) { const dd = glowDot(0x66ffaa, fw * 0.35); dd.position.set(x, fh * 0.55, 0); g.add(dd); elec.push({ dd, k }); }
      const sd1 = new THREE.Mesh(new THREE.BoxGeometry(fw * 2.2, fh * 0.9, fl * 0.32), sdM); sd1.position.set(x, fh * 0.5, fl * 0.33); g.add(sd1);
      const sd2 = sd1.clone(); sd2.position.z = -fl * 0.33; g.add(sd2);
      cols.push(box3(x, 0, fl * 0.33, fw * 2.2, fh * 0.9, fl * 0.32), box3(x, 0, -fl * 0.33, fw * 2.2, fh * 0.9, fl * 0.32));
    }
    // 게이트: 모든 fin을 가로질러 감싸는 ㄷ자 구조 = 상자에서 fin 부분은 산화막으로 표시
    const gw = (nf - 1) * pitch + fw + 6;
    const ox = new THREE.Mesh(new THREE.BoxGeometry(gw - 1, fh + 0.5, gl + 0.5), oxM); ox.position.set(0, (fh + 0.5) / 2, 0); g.add(ox);
    const gate = new THREE.Mesh(new THREE.BoxGeometry(gw, fh + 2.5, gl), gateM); gate.position.set(0, (fh + 2.5) / 2 + 0.01, 0); gate.castShadow = true; g.add(gate);
    cols.push(box3(0, 0, 0, gw, fh + 2.5, gl));
    // 라벨들
    const lab = (txt, x, y, z, sc = 0.7) => { const sp = makeLabel(L(txt), L2(txt), { scale: sc }); sp.position.set(x, y, z); g.add(sp); };
    if (s.labels) { const lb = s.labels; lab(lb.gate, 0, fh + 4.5, 0, 0.8); lab(lb.source, 0, fh + 1.5, fl * 0.33 + 3, 0.7); lab(lb.drain, 0, fh + 1.5, -fl * 0.33 - 3, 0.7); lab(lb.fin, -gw / 2 - 3, fh + 0.5, fl * 0.15, 0.6); lab(lb.oxide, gw / 2 + 3, fh / 2, gl, 0.6); }
    // 스위치 동작: 게이트 전압 ON(1)이면 소스→드레인으로 전자가 흐르고, OFF(0)이면 멈춘다
    const gateOn = gateM.clone(); gate.material = gateOn; const finOn = finM.clone(); fins.forEach((f) => { f.material = finOn; });
    const onTxt = { ko: '게이트 ON · 1 · 전류 흐름', en: 'GATE ON · 1 · CURRENT FLOWS' }, offTxt = { ko: '게이트 OFF · 0 · 차단', en: 'GATE OFF · 0 · BLOCKED' };
    const labOn = makeLabel(L(onTxt), L2(onTxt), { scale: 0.7, border: 'rgba(102,255,170,0.9)' }); labOn.position.set(0, fh + 7.5, 0); g.add(labOn);
    const labOff = makeLabel(L(offTxt), L2(offTxt), { scale: 0.7, border: 'rgba(255,102,170,0.9)' }); labOff.position.set(0, fh + 7.5, 0); g.add(labOff);
    const anim = (tm) => {
      const on = frac(tm / 4) < 0.55; gateOn.emissiveIntensity = on ? 1.4 : 0.2; finOn.emissiveIntensity = on ? 1.2 : 0.3; labOn.visible = on; labOff.visible = !on;
      for (const e of elec) { e.dd.visible = on; e.dd.position.z = (0.5 - frac(tm * 0.45 + e.k / 6)) * fl * 0.66; } // 소스(+z) → 드레인(-z)
    };
    return { group: g, colliders: cols, anim };
  },
  /** 세로 벽 안내판 */
  panel(s) {
    const [w, h] = s.size; const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.2), mat(s.color ?? 0x0c1a2e, { emissive: s.glow ?? 0x0a2a44, ei: 0.5 })); m.position.y = h / 2; g.add(m);
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: 0x5ee0ff })); e.position.y = h / 2; g.add(e);
    if (s.label) { const sp = makeLabel(L(s.label), L2(s.label), { scale: s.labelScale || 0.9 }); sp.position.set(0, h + 1, 0); g.add(sp); }
    // 안내판 스캔라인: 표시가 갱신되는 느낌
    const scan = glowBar(0x5ee0ff, w * 0.96, 0.08, 0.06, 0.7); scan.position.z = 0.14; g.add(scan); const ph = Math.random() * 3;
    const anim = (tm) => { const u = frac((tm + ph) * 0.35); scan.position.y = h - u * h; scan.material.opacity = 0.25 + Math.sin(u * Math.PI) * 0.5; };
    return { group: g, colliders: [box3(0, 0, 0, w, h, 0.2)], anim };
  },
  /** 링(토러스) — 코일, 관문 장식 */
  ring(s) {
    const g = new THREE.Group(); const [R, r] = s.size;
    const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 10, 40), mat(s.color ?? 0x5ee0ff, { emissive: s.color ?? 0x5ee0ff, ei: 0.8 })); m.position.y = s.y ?? R + 1; if (s.flat) m.rotation.x = Math.PI / 2; g.add(m);
    attachLabel(g, s, (s.y ?? R + 1) + R);
    const anim = (tm, dt) => { m.rotation.z += dt * 0.5; m.scale.setScalar(1 + Math.sin(tm * 2) * 0.03); }; // 코일이 돌며 맥동
    return { group: g, colliders: [], anim };
  },
  /** 바닥 발광 경로 (데이터 흐름 표시) */
  path(s) {
    const pts = s.path.map((p) => new THREE.Vector3(p[0], (p[2] ?? 0) + 0.08, p[1]));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.2);
    const geo = new THREE.TubeGeometry(curve, pts.length * 8, s.radius ?? 0.12, 6, false);
    const m = new THREE.Mesh(geo, mat(s.color ?? 0x5ee0ff, { emissive: s.color ?? 0x5ee0ff, ei: 1.2, opacity: 0.85 }));
    const g = new THREE.Group(); g.add(m); g.userData.curve = curve;
    // 경로를 따라 흐르는 데이터 점 2개 (프레임 패킷 외에도 흐름 방향이 보이게)
    const dots = []; for (let k = 0; k < 2; k++) { const dd = glowDot(s.color ?? 0x5ee0ff, (s.radius ?? 0.12) * 2.2, 0.9); g.add(dd); dots.push(dd); }
    const anim = (tm) => { dots.forEach((dd, k) => { const pt = curve.getPointAt(frac(tm * 0.12 + k / 2)); dd.position.set(pt.x, pt.y + 0.15, pt.z); }); };
    return { group: g, colliders: [], curve, anim };
  },
  /** 격자무늬 원반(래스터 엔진 광장, 크로스바 등) */
  disc(s) {
    const g = new THREE.Group(); const r = s.size[0]; const h = s.size[1] ?? 0.4;
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 48), mat(s.color ?? 0x1e3a5a, { emissive: s.glow ?? 0x000000, ei: 0.4 })); m.position.y = h / 2; m.receiveShadow = true; g.add(m);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.15, 8, 64), mat(s.rim ?? 0x76b900, { emissive: s.rim ?? 0x76b900, ei: 0.8 })); rim.rotation.x = Math.PI / 2; rim.position.y = h; g.add(rim);
    attachLabel(g, s, h);
    // 레이더처럼 도는 스캔 바 (래스터·크로스바가 구역을 훑는 동작)
    const piv = new THREE.Group(); piv.position.y = h + 0.05; g.add(piv); const sw = glowBar(s.rim ?? 0x76b900, r * 0.98, 0.04, 0.2, 0.75); sw.position.x = r * 0.49; piv.add(sw);
    const anim = (tm, dt) => { piv.rotation.y -= dt * 0.9; };
    return { group: g, colliders: h > 0.5 ? [box3(0, 0, 0, r * 2, h, r * 2)] : [], anim };
  },
  /** 여러 상자를 일렬로 (코어 배열, 스레드 32개 등): count, gap, size */
  row(s) {
    const g = new THREE.Group(); const cols = []; const [w, h, d] = s.size; const n = s.count; const gap = s.gap ?? 0.3; const perRow = s.perRow || n;
    const m0 = mat(s.color ?? 0x3a7bd5, { emissive: s.glow ?? 0x000000, ei: 0.5 }); const items = [];
    for (let i = 0; i < n; i++) {
      const cx = (i % perRow - (perRow - 1) / 2) * (w + gap), cz = (Math.floor(i / perRow) - (Math.ceil(n / perRow) - 1) / 2) * (d + gap);
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), (s.highlight && s.highlight.includes(i)) ? mat(s.hlColor ?? 0xffd166, { emissive: s.hlColor ?? 0xffd166, ei: 0.8 }) : m0); m.position.set(cx, h / 2, cz); m.castShadow = true; g.add(m); items.push(m);
      if (s.solid !== false) cols.push(box3(cx, 0, cz, w, h, d));
    }
    attachLabel(g, s, h);
    // 명령 발행 파도: 스케줄러가 차례로 명령을 내리듯 상자들이 순서대로 들썩인다 (SIMT: 같은 명령을 줄지어 수행)
    const anim = (tm) => { items.forEach((it, i) => { const sc = 1 + Math.max(0, Math.sin(tm * 2.4 - i * 0.3)) * 0.22; it.scale.y = sc; it.position.y = h / 2 * sc; }); };
    return { group: g, colliders: cols, anim };
  },
  /** 점광원 */
  /** 공정 흐름: 재료(입력) → 장치/반응 → 결과물(출력). 무엇이 들어가 무엇이 나오는지 보여 준다.
   *  s.input: [{ label, color, shape }] (shape: chunk | powder | liquid | gas | disc | wafer | bar | ion)
   *  s.machine: { label, color, size:[w,h,d], glow, cond }  cond: 온도·압력 등 조건 라벨
   *  s.output: [{ label, color, shape, waste }]  waste:true 면 부산물(회색 계열, 아래쪽)
   *  s.note: 반응식이나 물리 설명 한 줄
   *  s.span: 입력→출력 전체 폭(기본 26) */
  flow(s) {
    const g = new THREE.Group(); const cols = []; const span = s.span ?? 26;
    const xIn = -span / 2, xMid = 0, xOut = span / 2;
    const mk = (item, x, z, idx) => {
      const c = item.color ?? 0x888888; const sh = item.shape || 'chunk'; const gg = new THREE.Group(); gg.position.set(x, 0, z);
      // 받침대
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.5, 16), mat(0x1a2230, { metal: 0.4, rough: 0.6 })); ped.position.y = 0.25; ped.receiveShadow = true; gg.add(ped);
      let body;
      if (sh === 'powder') { body = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.1, 12), mat(c, { rough: 1 })); body.position.y = 1.05; }
      else if (sh === 'liquid') { body = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.8, 1.2, 16), mat(c, { rough: 0.15, metal: 0.2, emissive: c, ei: 0.25, opacity: 0.9 })); body.position.y = 1.1; }
      else if (sh === 'gas') { body = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 1), mat(c, { rough: 0.2, opacity: 0.45, emissive: c, ei: 0.5 })); body.position.y = 1.5; }
      else if (sh === 'disc' || sh === 'wafer') { body = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, sh === 'wafer' ? 0.08 : 0.3, 32), mat(c, { metal: 0.8, rough: 0.12 })); body.position.y = 0.9; body.rotation.z = 0.25; }
      else if (sh === 'bar') { body = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 3.0, 16), mat(c, { metal: 0.85, rough: 0.25 })); body.position.y = 2.0; }
      else if (sh === 'ion') { body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 12), mat(c, { emissive: c, ei: 1.2 })); body.position.y = 1.4; }
      else { body = new THREE.Mesh(new THREE.DodecahedronGeometry(1.05, 0), mat(c, { rough: 0.85, flat: true })); body.position.y = 1.2; }
      body.castShadow = true; gg.add(body);
      if (item.label) { const sp = makeLabel(L(item.label), L2(item.label), { scale: 0.62, border: item.waste ? 'rgba(140,150,160,0.8)' : 'rgba(94,224,255,0.85)' }); sp.position.y = 3.0; gg.add(sp); }
      g.add(gg); cols.push(box3(x, 0, z, 3, 0.5, 3));
      return { body, sh };
    };
    const ins = (s.input || []).map((it, i) => mk(it, xIn, (i - ((s.input.length - 1) / 2)) * 5, i));
    const outs = (s.output || []).map((it, i) => mk(it, xOut, (i - ((s.output.length - 1) / 2)) * 5, i));
    // 가운데 장치
    const m = s.machine || {}; const [mw, mh, md] = m.size || [8, 6, 8];
    const box = new THREE.Mesh(new THREE.BoxGeometry(mw, mh, md), mat(m.color ?? 0x2a3444, { metal: 0.5, rough: 0.45 }));
    box.position.set(xMid, mh / 2, 0); box.castShadow = true; g.add(box); cols.push(box3(xMid, 0, 0, mw, mh, md));
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), new THREE.LineBasicMaterial({ color: m.glow ?? 0xffa94d })); edge.position.copy(box.position); g.add(edge);
    const core = new THREE.Mesh(new THREE.BoxGeometry(mw * 0.5, mh * 0.25, md * 0.5), mat(m.glow ?? 0xffa94d, { emissive: m.glow ?? 0xffa94d, ei: 1.2 })); core.position.set(xMid, mh * 0.55, 0); g.add(core);
    if (m.label) { const sp = makeLabel(L(m.label), L2(m.label), { scale: 0.8, border: 'rgba(255,169,77,0.9)' }); sp.position.set(xMid, mh + 2.0, 0); g.add(sp); }
    if (m.cond) { const sp = makeLabel(L(m.cond), L2(m.cond), { scale: 0.6, border: 'rgba(255,90,90,0.8)', bg: 'rgba(30,6,6,0.8)' }); sp.position.set(xMid, mh + 0.9, 0); g.add(sp); }
    if (s.note) { const sp = makeLabel(L(s.note), L2(s.note), { scale: 0.66, border: 'rgba(118,185,0,0.9)', bg: 'rgba(6,18,4,0.85)' }); sp.position.set(xMid, 0.9, -md / 2 - 3.2); g.add(sp); }
    // 화살표 리본
    const arrow = (x0, x1, color) => { const len = x1 - x0; const a = new THREE.Mesh(new THREE.BoxGeometry(len * 0.82, 0.08, 0.5), mat(color, { emissive: color, ei: 0.8, opacity: 0.75 })); a.position.set((x0 + x1) / 2, 0.6, 0); g.add(a); const tip = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.1, 4), mat(color, { emissive: color, ei: 0.9 })); tip.position.set(x1 - 1.6, 0.6, 0); tip.rotation.z = -Math.PI / 2; g.add(tip); };
    arrow(xIn + 2, xMid - mw / 2, 0x5ee0ff); arrow(xMid + mw / 2, xOut - 2, s.output?.[0]?.color ?? 0x76b900);
    // 흐르는 알갱이: 재료가 장치로 들어가 결과물로 나온다
    const dotsIn = []; const dotsOut = [];
    for (let i = 0; i < 5; i++) { const d = glowDot(s.input?.[0]?.color ?? 0x5ee0ff, 0.22); g.add(d); dotsIn.push(d); }
    for (let i = 0; i < 5; i++) { const d = glowDot(s.output?.[0]?.color ?? 0x76b900, 0.22); g.add(d); dotsOut.push(d); }
    const anim = (tm, dt) => {
      dotsIn.forEach((d, i) => { const u = frac(tm * 0.22 + i / 5); d.position.set(xIn + 2 + u * (xMid - mw / 2 - xIn - 2), 1.1 + Math.sin(u * Math.PI) * 0.5, 0); d.material.opacity = 0.9; });
      dotsOut.forEach((d, i) => { const u = frac(tm * 0.22 + i / 5); d.position.set(xMid + mw / 2 + u * (xOut - 2 - xMid - mw / 2), 1.1 + Math.sin(u * Math.PI) * 0.5, 0); d.material.opacity = 0.9; });
      core.material.opacity = 1; core.scale.y = 1 + Math.sin(tm * 3) * 0.15;
      ins.forEach((o, i) => { if (o.sh === 'gas') o.body.rotation.y += dt * 0.6; });
      outs.forEach((o, i) => { o.body.rotation.y += dt * (o.sh === 'wafer' || o.sh === 'disc' ? 0.5 : 0.25); });
    };
    return { group: g, colliders: cols, anim };
  },
  /** 스테이지 안내판: 들어오자마자 여기가 어떤 곳인지 읽고 갈 수 있는 큰 판 */
  board(s) {
    const g = new THREE.Group(); const w = s.size?.[0] ?? 16, h = s.size?.[1] ?? 9.4;
    const postH = 1.6;
    for (const sx of [-1, 1]) { const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, postH + h / 2, 10), mat(0x3a4656, { metal: 0.7, rough: 0.4 })); post.position.set(sx * w * 0.38, (postH + h / 2) / 2, 0); post.castShadow = true; g.add(post); }
    const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.5, h + 0.5, 0.3), mat(0x0d1622, { metal: 0.4, rough: 0.6 })); frame.position.y = postH + h / 2; frame.castShadow = true; g.add(frame);
    const canvas = makeBoardCanvas(s.title || '', s.subtitle || '', s.body || '', s.bullets || [], s.accent || '#76b900');
    if (s.video) drawVideoNudge(canvas, s.video, s.nudge || '영상 보기', Math.max(0, (s.videoCount || 1) - 1));
    const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    face.position.set(0, postH + h / 2, 0.17); g.add(face);
    const back = face.clone(); back.position.z = -0.17; back.rotation.y = Math.PI; g.add(back);
    const lamp = new THREE.PointLight(0xffffff, 14, 26, 2); lamp.position.set(0, postH + h + 1.5, 3); g.add(lamp);
    // 반짝이는 테두리: 클릭할 수 있다는 신호
    let glow = null;
    if (s.video) {
      glow = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.9, h + 0.9), new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false }));
      glow.position.set(0, postH + h / 2, -0.05); g.add(glow);
    }
    const anim = (tm) => {
      face.position.y = postH + h / 2 + Math.sin(tm * 0.6) * 0.03; back.position.y = face.position.y; frame.position.y = face.position.y;
      if (glow) { glow.position.y = face.position.y; glow.material.opacity = 0.16 + Math.sin(tm * 2.4) * 0.12; }
    };
    if (s.video) g.traverse((o) => { o.userData.boardVideo = s.video; });
    return { group: g, colliders: [box3(0, 0, 0, w * 0.9, postH + h, 0.8)], anim };
  },
  /** 회사·국가 로고 간판: 기둥 + 양면 간판 */
  logo(s) {
    const g = new THREE.Group(); const w = s.size?.[0] ?? 6, h = (s.size?.[1] ?? 3.4), postH = s.postH ?? 4;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, postH, 10), mat(0x3a4656, { metal: 0.7, rough: 0.4 })); post.position.y = postH / 2; post.castShadow = true; g.add(post);
    const post2 = post.clone(); post.position.x = -w * 0.35; post2.position.x = w * 0.35; g.add(post2);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, h + 0.2, 0.18), mat(0x141a24, { metal: 0.5, rough: 0.5 })); frame.position.y = postH + h / 2; frame.castShadow = true; g.add(frame);
    const tex = logoTexture(s.brand, s.country, s.role || '', s.color || '#1b2a44', s.textColor || '#ffffff');
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); face.position.set(0, postH + h / 2, 0.1); g.add(face);
    const back = face.clone(); back.position.z = -0.1; back.rotation.y = Math.PI; g.add(back);
    const lamp = new THREE.PointLight(0xffffff, 6, 10, 2); lamp.position.set(0, postH + h + 0.4, 1.2); g.add(lamp);
    const anim = (tm) => { face.material.opacity = 1; frame.position.y = postH + h / 2 + Math.sin(tm * 0.8 + w) * 0.02; face.position.y = frame.position.y; back.position.y = frame.position.y; };
    g.traverse((o) => { o.userData.logo = s; });
    return { group: g, colliders: [box3(0, 0, 0, w * 0.8, postH + h, 0.5)], anim };
  },
  /**
   * 20260913 jwjeong 사진 액자: 그 층의 용어에 붙은 실제 사진(위키미디어 공개 이미지)을 전시장처럼 벽에 건다.
   * 이미지는 바깥에서 받아 오므로 실패할 수 있다. 실패해도 빈 액자와 캡션은 남게 두어 자리가 비지 않게 한다.
   * 네트워크가 막힌 곳에서는 회색 판으로 보이는 것이 정상이다.
   */
  frame(s) {
    const g = new THREE.Group();
    const w = s.size?.[0] ?? 9, h = s.size?.[1] ?? 6, postH = s.postH ?? 2.2;
    const woodColor = s.frameColor ?? 0x3a2a1c;
    // 받침 기둥 두 개
    for (const sx of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, postH, 8), mat(woodColor, { rough: 0.8 }));
      post.position.set(sx * (w / 2 - 0.4), postH / 2, 0); post.castShadow = true; g.add(post);
    }
    // 액자 테두리
    const border = new THREE.Mesh(new THREE.BoxGeometry(w + 0.5, h + 0.5, 0.22), mat(woodColor, { rough: 0.7, metal: 0.2 }));
    border.position.y = postH + h / 2; border.castShadow = true; g.add(border);
    const inner = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, h + 0.1, 0.26), mat(0x101820, { rough: 0.9 }));
    inner.position.y = postH + h / 2; g.add(inner);
    // 사진 면 (텍스처가 오기 전에는 어두운 회색)
    const faceMat = new THREE.MeshBasicMaterial({ color: 0x24303c, toneMapped: false });
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), faceMat);
    face.position.set(0, postH + h / 2, 0.15); g.add(face);
    if (s.url) {
      new THREE.TextureLoader().load(
        s.url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
          faceMat.map = tex; faceMat.color.set(0xffffff); faceMat.needsUpdate = true;
          // 원본 비율에 맞춰 사진만 줄인다 (액자 테두리는 그대로 두어 줄이 흐트러지지 않게)
          const ar = (tex.image?.width || 4) / (tex.image?.height || 3);
          const fw = ar >= w / h ? w : h * ar, fh = ar >= w / h ? w / ar : h;
          face.scale.set(fw / w, fh / h, 1);
        },
        undefined,
        () => { /* 이미지를 못 받으면 회색 판 그대로 둔다 */ },
      );
    }
    // 위에서 비추는 전시 조명
    const lampArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.0), mat(0x2a3240, { metal: 0.6 }));
    lampArm.position.set(0, postH + h + 0.45, 0.5); g.add(lampArm);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.4, 10, 1, true), mat(0x1c2430, { rough: 0.6 }));
    shade.position.set(0, postH + h + 0.42, 1.0); shade.rotation.x = 2.5; g.add(shade);
    const lamp = new THREE.SpotLight(0xfff2d0, 22, 18, 0.9, 0.5, 1.4);
    lamp.position.set(0, postH + h + 0.4, 1.2); lamp.target.position.set(0, postH + h / 2, 0);
    g.add(lamp); g.add(lamp.target);
    // 캡션 (작품 설명표)
    if (s.caption) { const cap = makeLabel(L(s.caption), L2(s.caption), { scale: s.captionScale ?? 0.62 }); cap.position.set(0, postH - 0.5, 0.3); g.add(cap); }
    if (s.term) g.traverse((o) => { o.userData.term = s.term; });
    const anim = (tm) => { lamp.intensity = 20 + Math.sin(tm * 1.3 + w) * 3; };
    return { group: g, colliders: [box3(0, 0, 0, w + 0.6, postH + h, 0.6)], anim };
  },
  light(s) { const g = new THREE.Group(); const l = new THREE.PointLight(s.color ?? 0xffffff, s.intensity ?? 40, s.dist ?? 40, 1.6); l.position.y = s.y ?? 6; g.add(l); return { group: g, colliders: [] }; },
};

/** 레벨 정의의 structures 배열을 씬에 생성 */
export function buildStructures(list, scene) {
  const colliders = []; const triggers = []; const groups = []; const curves = []; const animators = [];
  for (const s of list) {
    const b = BUILDERS[s.type]; if (!b) { console.warn('unknown structure', s.type); continue; }
    const r = b(s);
    r.group.position.set(s.pos[0], s.y ?? 0, s.pos[1]); if (s.rot) r.group.rotation.y = s.rot;
    scene.add(r.group); groups.push(r.group);
    r.group.updateMatrixWorld(true);
    for (const c of r.colliders) { const wc = c.clone(); if (s.rot) { /* 회전 시 AABB 보정: 회전 사각형의 외접 상자 */ const cx = (c.min.x + c.max.x) / 2, cz = (c.min.z + c.max.z) / 2, hw = (c.max.x - c.min.x) / 2, hd = (c.max.z - c.min.z) / 2; const cos = Math.abs(Math.cos(s.rot)), sin = Math.abs(Math.sin(s.rot)); const nw = hw * cos + hd * sin, nd = hw * sin + hd * cos; const rx = cx * Math.cos(s.rot) + cz * Math.sin(s.rot), rz = -cx * Math.sin(s.rot) + cz * Math.cos(s.rot); wc.min.set(rx - nw, c.min.y, rz - nd); wc.max.set(rx + nw, c.max.y, rz + nd); } wc.min.x += s.pos[0]; wc.max.x += s.pos[0]; wc.min.z += s.pos[1]; wc.max.z += s.pos[1]; wc.min.y += s.y ?? 0; wc.max.y += s.y ?? 0; colliders.push(wc); }
    if (s.term) { const sz = s.size ? Math.max(s.size[0], s.size[2] ?? s.size[0]) : 4; triggers.push({ x: s.pos[0], z: s.pos[1], r: s.triggerR ?? (sz / 2 + 2.2), term: s.term, label: s.label, group: r.group }); }
    if (r.triggers) for (const tr of r.triggers) triggers.push({ ...tr, x: tr.x + s.pos[0], z: tr.z + s.pos[1], group: r.group });
    if (r.curve) curves.push(r.curve);
    if (r.anim && s.anim !== false) animators.push(r.anim); // 구조물 정의에 anim: false 를 주면 정지
  }
  return { colliders, triggers, groups, curves, animators };
}
