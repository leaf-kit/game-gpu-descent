// 층에 뿌려지는 수집물: 비트 코인(점수), 부스트 패드(가속), 램프(스케이트 점프대).
// 데이터 경로(프레임이 흐르는 길)를 따라 코인을 놓아, 따라 달리면 자연스럽게 공부가 되도록 한다.
import * as THREE from 'three';

const coinGeo = new THREE.OctahedronGeometry(0.42, 0);
const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffa500, emissiveIntensity: 1.1, metalness: 0.6, roughness: 0.25 });
const haloGeo = new THREE.SphereGeometry(0.75, 10, 8);
const haloMat = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.16, depthWrite: false });
const padGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.25, 24);
const padMat = new THREE.MeshStandardMaterial({ color: 0x5ee0ff, emissive: 0x5ee0ff, emissiveIntensity: 1.0, roughness: 0.3 });
const arrowGeo = new THREE.ConeGeometry(0.6, 1.4, 4);

export class ItemField {
  constructor(scene) { this.scene = scene; this.group = null; this.coins = []; this.pads = []; this.ramps = []; this.t = 0; }

  /** 레벨에 코인·부스트 패드·램프를 뿌린다. floorAt: (x,z,y) → 바닥 높이, facts: 코인에 담을 지식 조각 */
  spawn(level, floorAt, opt = {}) {
    const facts = opt.facts && opt.facts.length ? opt.facts : [];
    let factIdx = 0;
    this.clear();
    const g = new THREE.Group(); this.scene.add(g); this.group = g;
    const size = level.size; const rnd = mulberry(level.def.id.length * 977 + size);
    const put = (x, z) => {
      const y = floorAt(x, z, 40) + 1.1;
      const m = new THREE.Mesh(coinGeo, coinMat); m.position.set(x, y, z); g.add(m);
      const h = new THREE.Mesh(haloGeo, haloMat); h.position.copy(m.position); g.add(h);
      const fact = facts.length ? facts[factIdx++ % facts.length] : null;
      this.coins.push({ mesh: m, halo: h, x, y, z, taken: false, ph: rnd() * 6, fact });
    };
    // 1) 데이터 경로를 따라 줄줄이
    const curve = level.curves && level.curves[0];
    if (curve) { const n = opt.pathCoins ?? 26; for (let i = 0; i < n; i++) { const p = curve.getPointAt(i / n); put(p.x, p.z); } }
    // 2) 층 전체에 흩뿌리기 (구조물 위에 얹히는 것도 허용 → 올라가서 먹는 재미)
    const n2 = opt.scatterCoins ?? 22;
    for (let i = 0; i < n2; i++) { const a = rnd() * Math.PI * 2, r = (0.25 + rnd() * 0.7) * size; put(Math.cos(a) * r, Math.sin(a) * r * 0.8); }
    // 3) 부스트 패드
    const n3 = opt.pads ?? 4;
    for (let i = 0; i < n3; i++) {
      const a = (i / n3) * Math.PI * 2 + 0.5, r = size * 0.55;
      const x = Math.cos(a) * r, z = Math.sin(a) * r * 0.8; const y = floorAt(x, z, 40);
      const m = new THREE.Mesh(padGeo, padMat); m.position.set(x, y + 0.12, z); g.add(m);
      const ar = new THREE.Mesh(arrowGeo, padMat); ar.position.set(x, y + 0.8, z); ar.rotation.x = -Math.PI / 2; ar.rotation.z = -a; g.add(ar);
      this.pads.push({ mesh: m, arrow: ar, x, y, z, cool: 0, dir: a });
    }
    // 4) 스케이트 램프 (점프대): 낮은 경사 상자 두 개
    const n4 = opt.ramps ?? 3;
    for (let i = 0; i < n4; i++) {
      const a = (i / n4) * Math.PI * 2 + 1.2, r = size * 0.35;
      const x = Math.cos(a) * r, z = Math.sin(a) * r * 0.8; const y = floorAt(x, z, 40);
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(7, 1.6, 5), new THREE.MeshStandardMaterial({ color: 0x2a3a5a, emissive: 0x0a2a4a, emissiveIntensity: 0.5, roughness: 0.5 }));
      ramp.position.set(x, y + 0.8, z); ramp.rotation.y = a; ramp.rotation.z = 0.28; g.add(ramp);
      const lip = new THREE.Mesh(new THREE.BoxGeometry(7, 0.2, 0.5), padMat); lip.position.set(x, y + 1.8, z); lip.rotation.y = a; g.add(lip);
      this.ramps.push({ mesh: ramp, x, y, z, r: 4.2, boost: 1 });
    }
    return { coins: this.coins.length, pads: this.pads.length, ramps: this.ramps.length };
  }

  /** 매 프레임: 회전·부유 + 플레이어와의 접촉 판정. 이벤트 배열을 돌려준다. */
  update(dt, player) {
    this.t += dt; const ev = [];
    const px = player.pos.x, py = player.pos.y, pz = player.pos.z;
    for (const c of this.coins) {
      if (c.taken) continue;
      c.mesh.rotation.y += dt * 2.4; c.mesh.rotation.x += dt * 1.1;
      const bob = Math.sin(this.t * 2.2 + c.ph) * 0.18;
      c.mesh.position.y = c.y + bob; c.halo.position.y = c.y + bob;
      c.halo.scale.setScalar(1 + Math.sin(this.t * 3 + c.ph) * 0.12);
      if (Math.abs(c.x - px) < 1.9 && Math.abs(c.z - pz) < 1.9 && Math.abs(c.y - py) < 2.6) {
        c.taken = true; c.mesh.visible = false; c.halo.visible = false; ev.push({ type: 'coin', fact: c.fact });
      }
    }
    for (const p of this.pads) {
      p.mesh.rotation.y += dt * 1.2; p.arrow.position.y = p.y + 0.8 + Math.sin(this.t * 4) * 0.15;
      if (p.cool > 0) { p.cool -= dt; p.mesh.material = padMat; continue; }
      if (Math.hypot(p.x - px, p.z - pz) < 2.6 && Math.abs(p.y - py) < 2.2) { p.cool = 2.5; ev.push({ type: 'boost', dir: p.dir }); }
    }
    return ev;
  }
  /** 남은 코인 수 */
  remaining() { return this.coins.filter((c) => !c.taken).length; }
  total() { return this.coins.length; }
  /** 미니맵용 좌표 */
  points() { return this.coins.filter((c) => !c.taken).map((c) => [c.x, c.z]); }
  clear() {
    if (this.group) { this.scene.remove(this.group); this.group.traverse((o) => { if (o.geometry && o.geometry !== coinGeo && o.geometry !== haloGeo && o.geometry !== padGeo && o.geometry !== arrowGeo) o.geometry.dispose(); }); }
    this.group = null; this.coins = []; this.pads = []; this.ramps = [];
  }
}

/** 같은 층이면 같은 배치가 나오도록 하는 작은 난수기 */
function mulberry(seed) {
  let a = seed >>> 0;
  return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
