// 레벨 로더: 층 정의(데이터) → 바닥/하늘/조명/구조물/게이트/데이터 패킷 생성
import * as THREE from 'three';
import { buildStructures, mat, makeLabel } from './structures.js?v=20260913002818';
import { L, L2, t } from './i18n.js?v=20260913002818';
import { PHOTOS } from './data/media.js?v=20260913002818';

/** 액자 캡션은 한 줄이라 길면 잘라 쓴다. 자세한 설명은 액자를 눌렀을 때 모달에서 본다. */
function short(text, max = 34) {
  const s = (text || '').split(' - ')[0].split(' — ')[0].trim();
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

/** 바닥 재질: 층 타입별 절차 텍스처 */
function groundTexture(type, palette) {
  const c = document.createElement('canvas'); c.width = c.height = 512; const ctx = c.getContext('2d');
  const base = palette.ground || '#0b1a12'; ctx.fillStyle = base; ctx.fillRect(0, 0, 512, 512);
  const line = palette.groundLine || 'rgba(118,185,0,0.25)';
  if (type === 'pcb') { // PCB 트레이스
    ctx.strokeStyle = line; ctx.lineWidth = 3;
    for (let i = 0; i < 40; i++) { ctx.beginPath(); let x = Math.random() * 512, y = Math.random() * 512; ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { if (Math.random() < 0.5) x = Math.random() * 512; else y = Math.random() * 512; ctx.lineTo(x, y); } ctx.stroke(); }
    ctx.fillStyle = palette.pad || '#c9a24a'; for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc(Math.random() * 512, Math.random() * 512, 4, 0, 7); ctx.fill(); }
  } else if (type === 'silicon' || type === 'grid') { // 격자
    ctx.strokeStyle = line; ctx.lineWidth = 1; const st = type === 'grid' ? 32 : 64;
    for (let i = 0; i <= 512; i += st) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke(); }
    ctx.strokeStyle = palette.groundLine2 || 'rgba(255,255,255,0.05)'; for (let i = 0; i <= 512; i += st / 4) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke(); }
  } else if (type === 'metal') { // 배선 격자
    ctx.strokeStyle = palette.groundLine || 'rgba(230,160,80,0.35)'; ctx.lineWidth = 6; for (let i = 16; i < 512; i += 48) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(230,160,80,0.15)'; for (let i = 16; i < 512; i += 48) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke(); }
  } else if (type === 'dots') { // 원자 격자 바닥
    ctx.fillStyle = palette.groundLine || 'rgba(200,220,255,0.3)'; for (let x = 32; x < 512; x += 64) for (let y = 32; y < 512; y += 64) { ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill(); }
  } else if (type === 'floor') { // 공장 바닥
    ctx.strokeStyle = palette.groundLine || 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2; for (let i = 0; i <= 512; i += 128) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke(); }
    ctx.fillStyle = palette.pad || 'rgba(255,209,102,0.5)'; ctx.fillRect(0, 250, 512, 12);
  }
  const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return tex;
}

export class Level {
  constructor(def, gpu, scene, renderer) {
    this.def = def; this.gpu = gpu; this.scene = scene; this.objects = []; this.t = 0;
    const pal = def.palette || {};
    scene.background = new THREE.Color(pal.sky ?? 0x04070f);
    scene.fog = new THREE.FogExp2(pal.fog ?? pal.sky ?? 0x04070f, (def.fogDensity ?? 0.012) * 0.35);
    // 조명
    const hemi = new THREE.HemisphereLight(pal.hemiSky ?? 0x9fb7d9, pal.hemiGround ?? 0x111a22, 1.7); scene.add(hemi); this.objects.push(hemi);
    const sun = new THREE.DirectionalLight(pal.sun ?? 0xffffff, (def.sunIntensity ?? 1.6) * 1.25); sun.position.set(40, 70, 30); sun.castShadow = true; const sm = document.documentElement.classList.contains('is-mobile') ? 1024 : 1536; sun.shadow.mapSize.set(sm, sm);
    const sc = sun.shadow.camera; sc.near = 1; sc.far = 260; sc.left = -90; sc.right = 90; sc.top = 90; sc.bottom = -90; sun.shadow.bias = -0.0005;
    scene.add(sun); this.objects.push(sun); this.sun = sun;
    // 바닥
    const size = def.size || 80; this.size = size;
    const tex = groundTexture(def.groundType || 'silicon', pal); tex.repeat.set(size / 8, size / 8);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(size * 2.4, size * 2.4), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, metalness: 0.15, color: 0xffffff }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground); this.objects.push(ground);
    // 경계 벽(보이지 않음) 대신 가장자리 발광선
    const edgeGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(size * 2, size * 2)); const edge = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: pal.accent ?? 0x76b900, transparent: true, opacity: 0.5 })); edge.rotation.x = -Math.PI / 2; edge.position.y = 0.05; scene.add(edge); this.objects.push(edge);
    // 구조물
    const base = typeof def.structures === 'function' ? def.structures(gpu) : def.structures;
    const logos = (typeof def.logos === 'function' ? def.logos(gpu) : def.logos) || [];
    const list = [...base, ...logos.map((l) => ({ type: 'logo', ...l }))];
    const built = buildStructures(list, scene);
    this.colliders = built.colliders; this.triggers = built.triggers; this.objects.push(...built.groups); this.curves = built.curves;
    for (const tr of this.triggers) tr.group?.traverse((o) => { if (o.userData.term == null && !o.userData.isLabel) o.userData.term = tr.term; }); this.animators = built.animators;
    // 스테이지 안내판: 스폰 지점 앞에 세워, 들어오자마자 여기가 어떤 곳인지 읽을 수 있게 한다
    this.spawn = def.spawn || [0, size * 0.75];
    if (def.boardInfo) {
      const b = def.boardInfo; const sx = this.spawn[0], sz = this.spawn[1];
      const toward = Math.atan2(0 - sx, 0 - sz); // 층 가운데를 향하는 방향
      const bx = sx + Math.sin(toward) * 13, bz = sz + Math.cos(toward) * 13;
      const built = buildStructures([{ type: 'board', pos: [bx, bz], rot: toward + Math.PI, size: [17, 9.6], title: b.title, subtitle: b.subtitle, body: b.body, bullets: b.bullets, accent: b.accent, video: b.video, videoCount: b.videoCount, nudge: b.nudge }], scene);
      this.boardPos = new THREE.Vector3(bx, 0, bz);
      this.colliders.push(...built.colliders); this.objects.push(...built.groups); if (built.animators) this.animators.push(...built.animators);
    }
    // 사진 전시: 그 층의 용어에 붙은 실제 사진을 액자로 걸어 둔다 (층마다 3~5점)
    this.buildGallery(def, size, scene);
    // 게이트
    const gp = def.gate?.pos || [0, -size * 0.8]; const gy = def.gateY || 0; this.gatePos = new THREE.Vector3(gp[0], gy, gp[1]);
    this.gate = this.buildGate(gp, pal.accent ?? 0x5ee0ff, def.gate?.label, gy);
    // 보조 게이트(지선 진입): 항상 열려 있고 보라색
    this.sideGate = null; this.sideGatePos = null;
    if (def.sideGate) { const sg = def.sideGate; this.sideGatePos = new THREE.Vector3(sg.pos[0], 0, sg.pos[1]); this.sideGate = this.buildSideGate(sg.pos, sg.label); }
    this.gateOpen = false; this.setGateOpen(false);
    // 데이터 패킷 (프레임 조각) 경로
    this.packet = null; if (this.curves.length) this.buildPacket(this.curves[0]);
    // 배경 파티클
    const mob = document.documentElement.classList.contains('is-mobile');
    this.buildDust(pal.dust ?? 0x5ee0ff, Math.round((def.dustCount ?? 400) * (mob ? 0.4 : 1)), size);
    // 하늘 장식: 위쪽 층의 실루엣(거대 구조) — 간단히 큰 발광 격자 천장
    if (def.ceiling) { const cg = new THREE.GridHelper(size * 3, 24, pal.accent ?? 0x76b900, 0x223344); cg.position.y = def.ceiling; cg.material.transparent = true; cg.material.opacity = 0.25; scene.add(cg); this.objects.push(cg); }
  }
  /**
   * 20260913 jwjeong 층 가장자리에 사진 액자를 건다. 사진은 그 층의 용어에 이미 붙어 있는 것(위키미디어 공개 이미지)을
   * 그대로 쓰므로 층 내용과 어긋나지 않는다. 사진이 없는 용어뿐인 층에서는 아무것도 걸리지 않는다(정상).
   * 액자는 클릭하면 그 용어의 설명 모달이 열린다(구조물과 같은 방식).
   */
  buildGallery(def, size, scene) {
    const terms = def.terms || [];
    // 용어마다 첫 사진을 먼저 한 바퀴 돌고, 모자라면 두 번째 사진을 채운다. 한 용어에 몰리지 않게 하려는 것이다.
    const picks = [];
    for (let round = 0; round < 2 && picks.length < 5; round++) {
      for (const term of terms) {
        if (picks.length >= 5) break;
        const ph = (PHOTOS[term] || [])[round];
        if (ph) picks.push({ term, photo: ph });
      }
    }
    if (!picks.length) return;
    // 배치: 층 가장자리 원을 따라 고르게 두되, 들어서는 자리와 게이트 방향은 비운다
    const spawnA = Math.atan2(this.spawn[0], this.spawn[1]);
    const gateP = def.gate?.pos || [0, -size * 0.8];
    const gateA = Math.atan2(gateP[0], gateP[1]);
    const clear = (ang) => {
      const gap = (a2) => Math.abs(Math.atan2(Math.sin(ang - a2), Math.cos(ang - a2)));
      return gap(spawnA) > 0.5 && gap(gateA) > 0.5;
    };
    const list = []; const radius = size * 0.92;
    let placed = 0;
    for (let i = 0; placed < picks.length && i < picks.length * 4; i++) {
      const ang = (i / (picks.length * 1.6)) * Math.PI * 2 + 0.4;
      if (!clear(ang)) continue;
      const p = picks[placed++];
      const cap = L(p.photo.caption) || '';
      list.push({
        type: 'frame', pos: [Math.sin(ang) * radius, Math.cos(ang) * radius],
        rot: ang + Math.PI,           // 액자가 층 안쪽을 바라보게 돌린다
        size: [9, 6], url: p.photo.url, term: p.term,
        caption: { ko: short(p.photo.caption.ko), en: short(p.photo.caption.en) },
      });
    }
    if (!list.length) return;
    const built = buildStructures(list, scene);
    this.colliders.push(...built.colliders);
    this.objects.push(...built.groups);
    if (built.animators) this.animators.push(...built.animators);
    // 액자도 용어 트리거로 잡아 준다: 가까이 가면 용어 카드가 뜬다
    for (const tr of built.triggers || []) this.triggers.push(tr);
  }

  buildGate([x, z], color, label, gy = 0) {
    const g = new THREE.Group(); g.position.set(x, gy, z);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.22, 12, 48), mat(color, { emissive: color, ei: 1.5 })); ring.position.y = 3; g.add(ring); this.gateRing = ring;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.08, 8, 48), mat(0xffffff, { emissive: 0xffffff, ei: 1 })); ring2.position.y = 3; g.add(ring2); this.gateRing2 = ring2;
    const disc = new THREE.Mesh(new THREE.CircleGeometry(2.4, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.25, side: THREE.DoubleSide })); disc.position.y = 3; g.add(disc); this.gateDisc = disc;
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.6, 80, 12, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false })); beam.position.y = 40; g.add(beam); this.gateBeam = beam;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.8, 0.3, 32), mat(0x0a1220, { emissive: color, ei: 0.25 })); base.position.y = 0.15; g.add(base);
    const lab = makeLabel(L(label || { ko: '게이트', en: 'GATE' }), L2(label || { ko: '게이트', en: 'GATE' }), { border: 'rgba(94,224,255,0.9)' }); lab.position.y = 6.6; g.add(lab); this.gateLabel = lab;
    this.scene.add(g); this.objects.push(g); return g;
  }
  buildSideGate([x, z], label) {
    const color = 0xb56cff; const g = new THREE.Group(); g.position.set(x, 0, z);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.2, 12, 48), mat(color, { emissive: color, ei: 1.6 })); ring.position.y = 2.8; g.add(ring);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(2.0, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22, side: THREE.DoubleSide })); disc.position.y = 2.8; g.add(disc);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.5, 60, 12, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })); beam.position.y = 30; g.add(beam);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.3, 0.3, 32), mat(0x160a26, { emissive: color, ei: 0.3 })); base.position.y = 0.15; g.add(base);
    const lab = makeLabel(L(label || { ko: 'HBM', en: 'HBM' }), L2(label || { ko: 'HBM', en: 'HBM' }), { border: 'rgba(181,108,255,0.9)' }); lab.position.y = 6.2; g.add(lab);
    g.userData.ring = ring; this.scene.add(g); this.objects.push(g); return g;
  }
  setGateOpen(v) { this.gateOpen = v; const c = v ? 0x5ee0ff : 0xff5566; this.gateRing.material = mat(c, { emissive: c, ei: v ? 1.8 : 0.9 }); this.gateDisc.material.color.set(c); this.gateBeam.material.color.set(c); this.gateBeam.material.opacity = v ? 0.22 : 0.06; }
  buildPacket(curve) {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), mat(0xffd166, { emissive: 0xffd166, ei: 2 })); g.add(core);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.2 })); g.add(halo);
    const lt = new THREE.PointLight(0xffd166, 25, 14, 1.8); g.add(lt);
    const lab = makeLabel(L(this.def.packetLabel || { ko: '카메라 프레임 데이터', en: 'CAMERA FRAME DATA' }), L2(this.def.packetLabel || { ko: '카메라 프레임 데이터', en: 'CAMERA FRAME DATA' }), { scale: 0.6, border: 'rgba(255,209,102,0.9)' }); lab.position.y = 1.6; g.add(lab);
    this.scene.add(g); this.objects.push(g); this.packet = { group: g, curve, u: 0.14, speed: this.def.packetSpeed ?? 0.04, core };
  }
  buildDust(color, n, size) {
    const geo = new THREE.BufferGeometry(); const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * size * 2; pos[i * 3 + 1] = Math.random() * 30 + 0.5; pos[i * 3 + 2] = (Math.random() - 0.5) * size * 2; }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color, size: 0.18, transparent: true, opacity: 0.6, depthWrite: false })); this.scene.add(pts); this.objects.push(pts); this.dust = pts;
  }
  update(dt, playerPos) {
    this.t += dt;
    if (this.sideGate) { this.sideGate.userData.ring.rotation.y -= dt * 0.9; this.sideGate.userData.ring.scale.setScalar(1 + Math.sin(this.t * 2.3) * 0.05); }
    if (this.gateRing) { this.gateRing.rotation.y += dt * 0.8; this.gateRing2.rotation.x += dt * 1.3; this.gateRing2.rotation.z += dt * 0.7; this.gateDisc.rotation.z += dt * 0.3; const s = 1 + Math.sin(this.t * 2) * 0.04; this.gateRing.scale.setScalar(s); }
    if (this.packet) { const p = this.packet; p.u = (p.u + dt * p.speed) % 1; const pt = p.curve.getPointAt(p.u); p.group.position.set(pt.x, pt.y + 0.9 + Math.sin(this.t * 4) * 0.15, pt.z); p.core.rotation.y += dt * 3; p.core.rotation.x += dt * 2; }
    if (this.dust) { this.dust.rotation.y += dt * 0.01; }
    for (const a of this.animators) a(this.t, dt); // 구조물 반복 동작
    if (this.sun && playerPos) { this.sun.position.set(playerPos.x + 40, 70, playerPos.z + 30); this.sun.target.position.copy(playerPos); this.sun.target.updateMatrixWorld(); }
  }
  /** 플레이어 근처의 트리거 중 아직 발동되지 않은 것 */
  nearTrigger(x, z, fired) {
    let best = null, bd = Infinity;
    for (const tr of this.triggers) { if (fired.has(tr.term)) continue; const d = Math.hypot(tr.x - x, tr.z - z); if (d < tr.r && d < bd) { bd = d; best = tr; } }
    return best;
  }
  dispose() {
    for (const o of this.objects) { this.scene.remove(o); o.traverse?.((c) => { if (c.geometry) c.geometry.dispose(); if (c.material && c.material.map && c.userData.isLabel) { c.material.map.dispose(); c.material.dispose(); } }); }
    this.objects = [];
  }
}
