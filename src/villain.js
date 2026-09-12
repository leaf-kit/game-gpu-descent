// 빌런과 전투. 빌런은 두 종류이고, 둘 다 실제로 존재하는 고장·오류 현상을 캐릭터로 만든 것이다.
//  1) softError — 떠다니는 팔면체. "소프트 에러(비트 플립)": 우주선이 만든 전하 구름이 비트를 뒤집는 현상. 원거리에서 총알을 쏜다.
//  2) monster   — 사람 모양 괴물. AI 층에서는 "환각(hallucination)", 그 밖의 층에서는 "열폭주(thermal runaway)"를 형상화했다.
//                 걸어서 쫓아오고 발톱으로 근접 공격을 한다. 체력이 더 많고, 주먹으로 때리면 이득이 크다.
// 플레이어의 사격은 "ECC 정정"에 해당한다. 어느 쪽에 맞아도 게임 오버는 없고, 콤보가 끊기고 화면이 흔들릴 뿐이다.
import * as THREE from 'three';
import { buildHumanoid, animateHumanoid } from './player.js?v=20260913002818';

const BULLET_GEO = new THREE.SphereGeometry(0.28, 8, 6);
// 미사일 설정: 재장전 2.4초, 직격 3칸 + 폭발 반경 안 2칸. 빌런 게이지(softError 5 / monster 9)를 두세 방에 비우는 값이다.
const MISSILE_RELOAD = 2.4;
const MISSILE_DIRECT = 3;
const MISSILE_SPLASH = 2;
const MISSILE_BLAST_R = 7;
const PLAYER_BULLET_MAT = new THREE.MeshBasicMaterial({ color: 0x76b900 });
const ENEMY_BULLET_MAT = new THREE.MeshBasicMaterial({ color: 0xff4466 });

/** 괴물 몸체: 사람 모양 메시에 뿔·발광 눈·이빨·등 가시·발톱·꼬리를 덧붙인다. */
function buildMonster(mobile) {
  const g = buildHumanoid({
    skin: 0x7a2a3c, suit: 0x2a1030, suit2: 0x140a1c, hair: 0x180610,
    eye: 0xff3355, shoe: 0x0c0610, accent: 0xff2244, hairStyle: 'buzz',
  });
  const parts = g.userData.parts;
  const M = (color, ei = 0) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.15, emissive: ei ? color : 0x000000, emissiveIntensity: ei, flatShading: true });
  const bone = M(0xe8dcc8), horn = M(0x2a1a20), glowEye = M(0xff2b3d, 2.6), spike = M(0x3a1626);
  const put = (geo, mat, parent, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = !mobile; parent.add(m); return m; };

  // 뿔 두 개 (머리 위에서 뒤로 휘어진다)
  for (const sx of [-1, 1]) {
    const h = put(new THREE.ConeGeometry(0.055, 0.3, 6), horn, parts.head, sx * 0.085, 0.24, -0.02);
    h.rotation.z = sx * -0.45; h.rotation.x = -0.35;
    put(new THREE.ConeGeometry(0.03, 0.14, 5), bone, parts.head, sx * 0.13, 0.36, -0.09).rotation.z = sx * -0.7;
  }
  // 붉게 빛나는 눈 (사람 눈 위에 덮는다). 맞을 때 더 밝아지도록 재질을 따로 기억한다.
  parts.meyeMat = glowEye;
  for (const sx of [-1, 1]) put(new THREE.SphereGeometry(0.034, 10, 8), glowEye, parts.head, sx * 0.047, 0.126, 0.111);
  // 아래로 뻗은 이빨
  for (let i = 0; i < 6; i++) {
    const tx = (i - 2.5) * 0.017;
    put(new THREE.ConeGeometry(0.009, 0.04, 4), bone, parts.head, tx, 0.035, 0.105).rotation.x = Math.PI;
    if (i % 2 === 0) put(new THREE.ConeGeometry(0.008, 0.032, 4), bone, parts.head, tx, 0.072, 0.104);
  }
  // 등 가시 (척추를 따라 위로 커진다)
  for (let i = 0; i < 5; i++) {
    const s = put(new THREE.ConeGeometry(0.035 + i * 0.008, 0.13 + i * 0.04, 5), spike, parts.torso, 0, 0.12 + i * 0.1, -0.15);
    s.rotation.x = 0.9;
  }
  // 발톱 (손가락 끝에서 앞으로 뻗는다)
  for (const [hand, sx] of [[parts.handL, -1], [parts.handR, 1]]) {
    for (let i = 0; i < 3; i++) {
      const c = put(new THREE.ConeGeometry(0.011, 0.09, 4), bone, hand, (i - 1) * 0.024, -0.12, 0.03);
      c.rotation.x = 1.15; c.rotation.z = sx * 0.1;
    }
  }
  // 꼬리 (허리 뒤에서 흔들린다)
  const tail = new THREE.Group(); tail.position.set(0, 0.08, -0.16); parts.torso.add(tail); parts.mtail = tail;
  let seg = tail;
  for (let i = 0; i < 4; i++) {
    const n = new THREE.Group(); n.position.z = -0.16; seg.add(n);
    put(new THREE.CapsuleGeometry(0.055 - i * 0.01, 0.12, 5, 8), M(0x50202e), seg, 0, 0, -0.08).rotation.x = Math.PI / 2;
    seg = n;
  }
  put(new THREE.ConeGeometry(0.04, 0.16, 5), bone, seg, 0, 0, -0.06).rotation.x = -Math.PI / 2;
  if (!mobile) { const lit = new THREE.PointLight(0xff3355, 9, 14, 2); lit.position.set(0, 1.3, 0.2); g.add(lit); parts.mlight = lit; }
  return g;
}

/** 괴물 자세 보정: 사람 걷기 위에 웅크린 상체·늘어진 팔·꼬리 흔들기를 덮어쓴다. */
function poseMonster(p, t, atk) {
  p.torso.rotation.x += 0.42;                    // 상체를 앞으로 숙인다
  p.head.rotation.x = 0.25 + Math.sin(t * 0.6) * 0.05;
  p.armL.rotation.z += 0.35; p.armR.rotation.z -= 0.35; // 팔을 몸에서 떼어 벌린다
  p.foreL.rotation.x -= 0.5; p.foreR.rotation.x -= 0.5;
  if (p.mtail) { p.mtail.rotation.y = Math.sin(t * 0.9) * 0.5; p.mtail.rotation.x = -0.25 + Math.sin(t * 1.3) * 0.15; }
  if (atk > 0) {                                  // 공격 동작: 두 팔을 치켜들었다가 내리친다
    const u = Math.min(1, Math.max(0, atk));
    const up = Math.sin(u * Math.PI) ;
    p.armL.rotation.x = -2.2 * up; p.armR.rotation.x = -2.2 * up;
    p.foreL.rotation.x = -0.4; p.foreR.rotation.x = -0.4;
    p.torso.rotation.x = 0.42 - up * 0.5; p.head.rotation.x = -0.2 * up;
  }
}

export class Combat {
  constructor(scene) {
    this.scene = scene; this.villains = []; this.shots = []; this.t = 0;
    this.cool = 0;          // 플레이어 사격 쿨다운
    this.punchCool = 0;     // 주먹 쿨다운
    // 20260913 jwjeong 미사일: 한 방이 크게 아픈 대신 재장전이 길다. 총(0.28초)과 역할을 나눈다.
    this.missiles = [];
    this.missileCool = 0;
    this.missileReload = MISSILE_RELOAD;
    this.bursts = [];       // 제거 시 터지는 파편
    this.events = [];       // 바깥에서 가져가는 이벤트 (hit, kill, hurt)
  }
  /** 예전 코드 호환: 첫 번째 빌런(소프트 에러)을 가리킨다 */
  get villain() { return this.villains[0] || null; }

  /** 층에 빌런을 놓는다: 떠다니는 빌런 한 마리 + 괴물 한 마리. 위치는 층마다 무작위다. */
  spawn(level, floorAt, opt = {}) {
    this.clear();
    const size = level.size;
    const chapter = (level.def && level.def.chapter) || '';
    // 20260913 jwjeong 자리를 고정해 두면 두 번째 방문부터 어디 있는지 알아 버려서 긴장이 없다.
    // 대신 플레이어가 내려서는 자리와 게이트 근처는 피한다. 들어오자마자 맞으면 억울하다.
    const avoid = [];
    const sp = (level.def && level.def.spawn) || level.spawn;
    if (sp) avoid.push({ x: sp[0], z: sp[1], r: size * 0.42 });
    const gp = level.def && level.def.gate && level.def.gate.pos;
    if (gp) avoid.push({ x: gp[0], z: gp[1], r: size * 0.22 });
    const a1 = this.pickSpot(size, avoid);
    avoid.push({ x: a1.x, z: a1.z, r: size * 0.3 }); // 둘이 한자리에 겹치지 않게
    const a2 = this.pickSpot(size, avoid);
    this.villains.push(this.spawnSoftError(a1.x, a1.z, floorAt, size));
    this.villains.push(this.spawnMonster(a2.x, a2.z, floorAt, size, chapter, !!opt.mobile));
    return this.villains;
  }

  /** 층 안의 빈자리 하나. avoid 안에 들어가지 않는 점을 몇 번 뽑아 보고, 못 찾으면 마지막 후보를 쓴다. */
  pickSpot(size, avoid = []) {
    let last = { x: size * 0.45, z: -size * 0.35 };
    for (let i = 0; i < 24; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = size * (0.3 + Math.random() * 0.45);   // 한가운데와 바깥 경계는 비운다
      const c = { x: Math.cos(ang) * rad, z: Math.sin(ang) * rad };
      last = c;
      if (avoid.every((a) => Math.hypot(c.x - a.x, c.z - a.z) > a.r)) return c;
    }
    return last;
  }

  /** 떠다니는 소프트 에러 (원거리 사격) */
  spawnSoftError(x, z, floorAt, size) {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(1.25, 0), new THREE.MeshStandardMaterial({ color: 0x2a0a14, emissive: 0xff2244, emissiveIntensity: 1.1, roughness: 0.3, metalness: 0.4, flatShading: true }));
    g.add(core);
    // 뒤집힌 비트를 상징하는 고리 두 개
    const ringM = new THREE.MeshBasicMaterial({ color: 0xff5577, transparent: true, opacity: 0.75 });
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.08, 8, 32), ringM); g.add(r1);
    const r2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.05, 8, 32), ringM); r2.rotation.x = Math.PI / 2; g.add(r2);
    // 가시
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; const sp = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.0, 5), new THREE.MeshBasicMaterial({ color: 0xff8899 })); sp.position.set(Math.cos(a) * 1.4, Math.sin(a) * 1.4, 0); sp.rotation.z = a - Math.PI / 2; g.add(sp); }
    const light = new THREE.PointLight(0xff3355, 22, 22, 2); g.add(light);
    g.position.set(x, floorAt(x, z, 40) + 3.2, z);
    this.scene.add(g);
    return {
      kind: 'softError', nameKey: 'villain.name', group: g, core, r1, r2, light,
      hp: 5, maxHp: 5, fire: 2.5, hitFlash: 0, dead: false, respawn: 0,
      floorAt, home: new THREE.Vector3(x, 0, z), size, hitY: 0, hitR: 2.2, hover: 3.2,
    };
  }

  /** 걸어서 쫓아오는 괴물 (근접 공격) */
  spawnMonster(x, z, floorAt, size, chapter, mobile) {
    const g = buildMonster(mobile);
    const scale = 1.75;
    g.scale.setScalar(scale);
    g.position.set(x, floorAt(x, z, 40), z);
    this.scene.add(g);
    return {
      kind: 'monster', nameKey: chapter === 'ai' ? 'villain.monsterAi' : 'villain.monsterHw',
      group: g, parts: g.userData.parts, scale,
      hp: 9, maxHp: 9, hitFlash: 0, dead: false, respawn: 0,
      floorAt, home: new THREE.Vector3(x, 0, z), size,
      hitY: 1.5 * scale, hitR: 1.5 * scale, hover: 0,
      yaw: 0, animT: 0, step: 0, atkCool: 2.6, atk: 0, swung: false, landed: false, lunge: 0, lungeCool: 5, roarCool: 3 + Math.random() * 4,
    };
  }

  /** 플레이어가 쏜다 (쿨다운이 지나야 발사) */
  playerShoot(player) {
    if (this.cool > 0) return false;
    this.cool = 0.28;
    const dir = new THREE.Vector3(Math.sin(player.yaw), 0, Math.cos(player.yaw));
    const m = new THREE.Mesh(BULLET_GEO, PLAYER_BULLET_MAT);
    m.position.set(player.pos.x + dir.x * 0.8, player.pos.y + 1.25, player.pos.z + dir.z * 0.8);
    this.scene.add(m);
    this.shots.push({ mesh: m, dir, speed: 46, life: 1.8, from: 'player' });
    return true;
  }

  /** 미사일 한 발을 만든다: 몸통 + 코 + 꼬리 불꽃 */
  buildMissile() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.9, 6, 10), new THREE.MeshStandardMaterial({ color: 0xdfe7ef, roughness: 0.4, metalness: 0.6, emissive: 0x223344, emissiveIntensity: 0.4 }));
    body.rotation.x = Math.PI / 2; g.add(body);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x76b900, emissive: 0x76b900, emissiveIntensity: 1.2 }));
    nose.rotation.x = Math.PI / 2; nose.position.z = 0.72; g.add(nose);
    for (let i = 0; i < 3; i++) { // 꼬리 날개
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.3), new THREE.MeshBasicMaterial({ color: 0x9fb7c9 }));
      const a2 = (i / 3) * Math.PI * 2; fin.position.set(Math.cos(a2) * 0.22, Math.sin(a2) * 0.22, -0.5); fin.rotation.z = a2; g.add(fin);
    }
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.26, 1.1, 8), new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.9, depthWrite: false }));
    flame.rotation.x = -Math.PI / 2; flame.position.z = -1.05; g.add(flame);
    const light = new THREE.PointLight(0xffa040, 16, 16, 2); g.add(light);
    return { group: g, flame, light };
  }

  /** 미사일 발사. 재장전이 끝나야 나가고, 가장 가까운 빌런을 살짝 따라간다. */
  playerMissile(player) {
    if (this.missileCool > 0) return false;
    this.missileCool = this.missileReload;
    const { group, flame, light } = this.buildMissile();
    const dir = new THREE.Vector3(Math.sin(player.yaw), 0, Math.cos(player.yaw));
    group.position.set(player.pos.x + dir.x * 1.1, player.pos.y + 1.15, player.pos.z + dir.z * 1.1);
    this.scene.add(group);
    this.missiles.push({ group, flame, light, dir: dir.clone(), speed: 20, life: 4.2, trail: 0, target: this.nearestVillain(player.pos) });
    return true;
  }

  /** 유도 대상: 살아 있는 빌런 중 가장 가까운 쪽. 없으면 직진한다. */
  nearestVillain(from) {
    let best = null, bestD = 1e9; const c = new THREE.Vector3();
    for (const v of this.villains) {
      if (v.dead) continue;
      this.center(v, c);
      const d = c.distanceTo(from);
      if (d < bestD) { bestD = d; best = v; }
    }
    return best;
  }

  /** 미사일 폭발: 반경 안의 빌런을 모두 깎는다. 직격 대상은 더 크게 깎인다. */
  explode(pos, direct, ev) {
    this.burst(pos);
    const c = new THREE.Vector3();
    for (const v of this.villains) {
      if (v.dead) continue;
      this.center(v, c);
      const d = c.distanceTo(pos);
      if (v !== direct && d > MISSILE_BLAST_R) continue;
      const dmg = v === direct ? MISSILE_DIRECT : MISSILE_SPLASH;
      v.hp -= dmg; v.hitFlash = 1.6;
      if (v.hp <= 0) {
        v.dead = true; v.respawn = v.kind === 'monster' ? 26 : 22; v.group.visible = false;
        this.burst(c);
        ev.push({ type: 'kill', kind: v.kind, nameKey: v.nameKey, byMissile: true });
      } else {
        ev.push({ type: 'missileHit', kind: v.kind, hp: v.hp, maxHp: v.maxHp, dmg });
      }
    }
    ev.push({ type: 'missileBoom', pos: pos.clone() });
  }

  /** 미사일 이동·유도·수명. 벽이 없는 층이라 바닥과 수명으로만 끝난다. */
  updateMissiles(dt, player, ev) {
    const c = new THREE.Vector3();
    for (let i = this.missiles.length - 1; i >= 0; i--) {
      const m = this.missiles[i];
      m.life -= dt;
      m.speed = Math.min(58, m.speed + 62 * dt); // 천천히 나가다 가속한다
      // 유도: 목표가 살아 있으면 진행 방향을 조금씩 튼다 (완전 유도는 너무 쉬워서 약하게 준다)
      if (m.target && !m.target.dead) {
        this.center(m.target, c);
        const want = c.sub(m.group.position).normalize();
        m.dir.lerp(want, Math.min(1, dt * 3.2)).normalize();
      }
      m.group.position.addScaledVector(m.dir, m.speed * dt);
      m.group.lookAt(m.group.position.clone().add(m.dir));
      m.flame.scale.setScalar(0.8 + Math.random() * 0.5);
      m.light.intensity = 14 + Math.random() * 8;
      // 비행음: 0.18초마다 한 번씩만 낸다 (매 프레임 내면 귀가 아프다)
      m.trail += dt;
      if (m.trail > 0.18) { m.trail = 0; ev.push({ type: 'missileFly', dist: m.group.position.distanceTo(player.pos) }); }
      // 명중 판정
      let hit = null;
      for (const v of this.villains) {
        if (v.dead) continue;
        this.center(v, c);
        if (m.group.position.distanceTo(c) < v.hitR + 0.6) { hit = v; break; }
      }
      const ground = m.group.position.y <= 0.3;
      if (hit || ground || m.life <= 0) {
        this.explode(m.group.position.clone(), hit, ev);
        this.scene.remove(m.group); this.missiles.splice(i, 1);
      }
    }
  }

  /** 미사일 재장전 진행도 (0~1). HUD 게이지가 이 값을 쓴다. */
  missileCharge() { return this.missileReload <= 0 ? 1 : 1 - Math.max(0, this.missileCool) / this.missileReload; }

  /** 빌런의 몸 중심 (총알·주먹 판정에 쓴다) */
  center(v, out = new THREE.Vector3()) { return out.set(v.group.position.x, v.group.position.y + v.hitY, v.group.position.z); }

  /** 주먹: 앞쪽 가까운 거리에서 두 배로 아프다. 맞으면 빌런이 뒤로 밀린다. */
  punch(player, power = 1) {
    if (this.punchCool > 0) return null;
    // 연타 중에는 쿨다운을 조금 줄여 "주먹 주먹" 이 끊기지 않게 한다
    this.punchCool = power > 1 ? 0.3 : 0.45;
    const c = new THREE.Vector3();
    const fx = Math.sin(player.yaw), fz = Math.cos(player.yaw);
    let best = null, bestD = 1e9;
    for (const v of this.villains) {
      if (v.dead) continue;
      this.center(v, c);
      const dx = c.x - player.pos.x, dz = c.z - player.pos.z, dy = c.y - (player.pos.y + 1.2);
      const d = Math.hypot(dx, dz);
      const reach = 3.4 + v.hitR;
      const facing = d > 0.01 ? (dx / d) * fx + (dz / d) * fz : 1;
      if (d > reach || Math.abs(dy) > 2.0 + v.hitR || facing < 0.45) continue;
      if (d < bestD) { bestD = d; best = { v, dx, dz, d }; }
    }
    if (!best) return { hit: false };
    const { v, dx, dz, d } = best;
    const dmg = Math.round(2 * power);
    v.hp -= dmg; v.hitFlash = 1.4 * power;
    const kb = (v.kind === 'monster' ? 1.0 : 2.2) * power; // 괴물은 무거워서 잘 밀리지 않는다 (연타로 계속 때릴 수 있다)
    v.group.position.x += (dx / (d || 1)) * kb; v.group.position.z += (dz / (d || 1)) * kb; // 넉백
    if (v.kind === 'monster') { v.atk = 0; v.swung = false; v.atkCool = Math.max(v.atkCool, 0.9); } // 공격 동작이 끊긴다
    if (v.hp <= 0) { this.kill(v); return { hit: true, killed: true, kind: v.kind, nameKey: v.nameKey, power }; }
    return { hit: true, killed: false, kind: v.kind, nameKey: v.nameKey, hp: v.hp, maxHp: v.maxHp, power };
  }
  /** 주먹이 닿을 거리에 빌런이 있는가 (E 키가 상호작용과 주먹 중 무엇을 할지 고르는 기준) */
  villainInReach(player) {
    const c = new THREE.Vector3();
    const fx = Math.sin(player.yaw), fz = Math.cos(player.yaw);
    for (const v of this.villains) {
      if (v.dead) continue;
      this.center(v, c);
      const dx = c.x - player.pos.x, dz = c.z - player.pos.z, dy = c.y - (player.pos.y + 1.2);
      const d = Math.hypot(dx, dz);
      if (d > 3.4 + v.hitR || Math.abs(dy) > 2.0 + v.hitR) continue;
      if (d > 0.01 && ((dx / d) * fx + (dz / d) * fz) < 0.45) continue; // 등 뒤는 안 친다
      return true;
    }
    return false;
  }

  /** 빌런 제거: 파편을 터뜨리고 잠시 뒤 되살아난다 */
  kill(v = this.villains[0]) {
    if (!v || v.dead) return;
    v.dead = true; v.respawn = v.kind === 'monster' ? 26 : 22; v.group.visible = false;
    this.burst(this.center(v));
  }
  /** 파편 폭발 (제거 세레머니용) */
  burst(pos) {
    const n = 90; const geo = new THREE.BufferGeometry();
    const p = new Float32Array(n * 3); const vel = [];
    for (let i = 0; i < n; i++) {
      p[i * 3] = pos.x; p[i * 3 + 1] = pos.y; p[i * 3 + 2] = pos.z;
      const a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1), sp = 6 + Math.random() * 16;
      vel.push(new THREE.Vector3(Math.sin(b) * Math.cos(a) * sp, Math.cos(b) * sp * 0.7 + 4, Math.sin(b) * Math.sin(a) * sp));
    }
    geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffd166, size: 0.6, transparent: true, opacity: 1, depthWrite: false });
    const pts = new THREE.Points(geo, mat); this.scene.add(pts);
    // 고리 충격파
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.22, 8, 32), new THREE.MeshBasicMaterial({ color: 0x76b900, transparent: true, opacity: 0.9 }));
    ring.position.copy(pos); ring.rotation.x = Math.PI / 2; this.scene.add(ring);
    this.bursts.push({ pts, mat, vel, ring, life: 1.6, max: 1.6 });
  }

  update(dt, player) {
    this.t += dt; const ev = [];
    if (this.cool > 0) this.cool -= dt;
    if (this.punchCool > 0) this.punchCool -= dt;
    if (this.missileCool > 0) { const was = this.missileCool; this.missileCool -= dt; if (was > 0 && this.missileCool <= 0) ev.push({ type: 'missileReady' }); }
    // 파편
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i]; b.life -= dt; const u = 1 - b.life / b.max;
      const arr = b.pts.geometry.attributes.position.array;
      for (let k = 0; k < b.vel.length; k++) {
        b.vel[k].y -= 26 * dt;
        arr[k * 3] += b.vel[k].x * dt; arr[k * 3 + 1] += b.vel[k].y * dt; arr[k * 3 + 2] += b.vel[k].z * dt;
      }
      b.pts.geometry.attributes.position.needsUpdate = true;
      b.mat.opacity = Math.max(0, 1 - u);
      b.ring.scale.setScalar(1 + u * 14); b.ring.material.opacity = Math.max(0, 0.9 - u);
      if (b.life <= 0) { this.scene.remove(b.pts); this.scene.remove(b.ring); b.pts.geometry.dispose(); b.mat.dispose(); this.bursts.splice(i, 1); }
    }
    // ---- 빌런 ----
    for (const v of this.villains) {
      if (v.dead) {
        v.respawn -= dt;
        if (v.respawn <= 0) {
          v.dead = false; v.hp = v.maxHp; v.group.visible = true;
          // 되살아날 때도 자리를 다시 뽑는다. 같은 자리에서 계속 나오면 그 앞에 서서 기다리게 된다.
          const spot = this.pickSpot(v.size, [{ x: v.group.position.x, z: v.group.position.z, r: v.size * 0.25 }]);
          v.home.set(spot.x, 0, spot.z);
          v.group.position.set(v.home.x, v.floorAt(v.home.x, v.home.z, 40) + v.hover, v.home.z);
          if (v.kind === 'monster') { v.atk = 0; v.swung = false; v.atkCool = 2.2; v.lunge = 0; v.lungeCool = 5; }
          ev.push({ type: 'respawn', kind: v.kind, nameKey: v.nameKey });
        }
        continue;
      }
      if (v.kind === 'softError') this.updateSoftError(v, dt, player, ev);
      else this.updateMonster(v, dt, player, ev);
    }
    // ---- 총알 ----
    const c = new THREE.Vector3();
    for (let i = this.shots.length - 1; i >= 0; i--) {
      const s = this.shots[i];
      s.mesh.position.addScaledVector(s.dir, s.speed * dt);
      s.life -= dt;
      let gone = s.life <= 0;
      if (!gone && s.from === 'player') {
        for (const v of this.villains) {
          if (v.dead) continue;
          this.center(v, c);
          if (s.mesh.position.distanceTo(c) < v.hitR) {
            v.hp--; v.hitFlash = 1; gone = true;
            if (v.hp <= 0) { this.burst(c); v.dead = true; v.respawn = v.kind === 'monster' ? 26 : 22; v.group.visible = false; ev.push({ type: 'kill', kind: v.kind, nameKey: v.nameKey }); }
            else ev.push({ type: 'hit', kind: v.kind, hp: v.hp, maxHp: v.maxHp });
            break;
          }
        }
      }
      if (!gone && s.from === 'enemy') {
        const p = player.pos;
        if (Math.hypot(s.mesh.position.x - p.x, s.mesh.position.z - p.z) < 1.1 && Math.abs(s.mesh.position.y - (p.y + 0.9)) < 1.5) { gone = true; ev.push({ type: 'hurt', kind: 'softError' }); }
      }
      if (gone) { this.scene.remove(s.mesh); this.shots.splice(i, 1); }
    }
    this.updateMissiles(dt, player, ev);
    return ev;
  }

  /** 소프트 에러: 일정 거리를 유지하며 총알을 쏜다 */
  updateSoftError(v, dt, player, ev) {
    const p = player.pos; const d = Math.hypot(p.x - v.group.position.x, p.z - v.group.position.z);
    // 추격: 너무 가까우면 물러서고, 멀면 다가온다
    const want = d > 9 ? 1 : d < 5 ? -1 : 0;
    if (d < 46 && want !== 0) {
      const ax = (p.x - v.group.position.x) / (d || 1), az = (p.z - v.group.position.z) / (d || 1);
      const sp = 5.4 * want;
      v.group.position.x += ax * sp * dt; v.group.position.z += az * sp * dt;
    }
    const fy = v.floorAt(v.group.position.x, v.group.position.z, 40) + 3.2;
    v.group.position.y += (fy + Math.sin(this.t * 1.6) * 0.5 - v.group.position.y) * Math.min(1, dt * 3);
    v.r1.rotation.z += dt * 1.4; v.r2.rotation.y += dt * 1.9; v.core.rotation.y += dt * 0.9; v.core.rotation.x += dt * 0.5;
    v.light.intensity = 18 + Math.sin(this.t * 6) * 6 + v.hitFlash * 40;
    if (v.hitFlash > 0) v.hitFlash -= dt * 3;
    v.core.material.emissiveIntensity = 1.1 + Math.max(0, v.hitFlash) * 3;
    // 사격
    v.fire -= dt;
    if (v.fire <= 0 && d < 34) {
      v.fire = 2.2 + Math.random() * 1.2;
      const dir = new THREE.Vector3(p.x - v.group.position.x, (p.y + 1.1) - v.group.position.y, p.z - v.group.position.z).normalize();
      const m = new THREE.Mesh(BULLET_GEO, ENEMY_BULLET_MAT); m.scale.setScalar(1.3);
      m.position.copy(v.group.position);
      this.scene.add(m);
      this.shots.push({ mesh: m, dir, speed: 17, life: 3.2, from: 'enemy' });
      ev.push({ type: 'enemyFire', dist: d });
    }
  }

  /** 괴물: 땅을 걸어 쫓아오고, 가까워지면 발톱을 내리친다. 가끔 돌진한다. */
  updateMonster(v, dt, player, ev) {
    const p = player.pos;
    const dx = p.x - v.group.position.x, dz = p.z - v.group.position.z;
    const d = Math.hypot(dx, dz);
    const ax = dx / (d || 1), az = dz / (d || 1);
    const reach = 2.2 + v.hitR;
    if (v.hitFlash > 0) v.hitFlash -= dt * 3;
    if (v.atkCool > 0) v.atkCool -= dt;
    if (v.lungeCool > 0) v.lungeCool -= dt;
    if (v.roarCool > 0) v.roarCool -= dt;

    // 돌진: 중간 거리에서 한 번씩 속도를 올려 달려든다
    if (v.lunge <= 0 && v.lungeCool <= 0 && d > reach && d < 26) { v.lunge = 0.9; v.lungeCool = 7 + Math.random() * 4; ev.push({ type: 'monsterRoar', dist: d, charge: true }); }
    if (v.lunge > 0) v.lunge -= dt;

    // 공격 동작 중에는 제자리에서 팔을 내리친다
    let moving = false;
    if (v.atk > 0) {
      v.atk -= dt / 0.55; // 0.55초 동작
      if (!v.swung && v.atk < 0.5) { // 동작 중간에 판정
        v.swung = true;
        const cd = Math.hypot(p.x - v.group.position.x, p.z - v.group.position.z);
        const dy = Math.abs((p.y + 0.9) - (v.group.position.y + 1.0));
        ev.push({ type: 'monsterSwipe', dist: cd });
        // 예비 동작(0.3초) 동안 물러섰으면 빗나간다. 맞았을 때는 다음 공격까지 더 오래 쉰다.
        if (cd < reach + 0.4 && dy < 3.4) { ev.push({ type: 'hurt', kind: 'monster' }); v.landed = true; }
      }
      if (v.atk <= 0) { v.atk = 0; v.swung = false; v.atkCool = (v.landed ? 2.8 : 1.5) + Math.random() * 0.8; v.landed = false; }
    } else if (d < reach && v.atkCool <= 0) {
      v.atk = 1; v.swung = false; ev.push({ type: 'monsterAttack', dist: d });
    } else if (d < 60 && d > reach * 0.85) {
      const sp = (v.lunge > 0 ? 13.5 : 6.3) * (v.hitFlash > 0.6 ? 0.4 : 1);
      v.group.position.x += ax * sp * dt; v.group.position.z += az * sp * dt;
      moving = true;
      // 발소리: 걸음 주기마다 한 번씩 이벤트를 낸다
      const rate = v.lunge > 0 ? 5.4 : 3.0;
      v.step += dt * rate;
      if (v.step >= 1) { v.step -= 1; ev.push({ type: 'monsterStep', dist: d, run: v.lunge > 0 }); }
    }
    // 가끔 으르렁거린다
    if (v.roarCool <= 0 && d < 45) { v.roarCool = 7 + Math.random() * 6; ev.push({ type: 'monsterRoar', dist: d }); }

    // 땅에 발을 붙이고 플레이어를 바라본다
    const fy = v.floorAt(v.group.position.x, v.group.position.z, 40);
    v.group.position.y += (fy - v.group.position.y) * Math.min(1, dt * 8);
    const want = Math.atan2(ax, az);
    v.yaw += Math.atan2(Math.sin(want - v.yaw), Math.cos(want - v.yaw)) * Math.min(1, dt * 6);
    v.group.rotation.y = v.yaw;
    // 걷기 애니메이션 + 괴물 자세
    const run = v.lunge > 0;
    v.animT += dt * (moving ? (run ? 11 : 6.4) : 1.2);
    animateHumanoid(v.parts, v.animT, moving, run, true, 'none');
    poseMonster(v.parts, v.animT, v.atk);
    if (v.parts.mlight) v.parts.mlight.intensity = 7 + Math.sin(this.t * 5) * 2 + Math.max(0, v.hitFlash) * 22;
    if (v.parts.meyeMat) v.parts.meyeMat.emissiveIntensity = 2.6 + Math.max(0, v.hitFlash) * 6; // 맞으면 눈이 번쩍인다
  }

  /** HUD 표시용: 살아 있는 빌런들의 상태 */
  states() {
    return this.villains.map((v) => ({ kind: v.kind, nameKey: v.nameKey, dead: v.dead, hp: v.hp, maxHp: v.maxHp, respawn: Math.max(0, v.respawn), pos: v.group.position }));
  }
  /** 예전 API 호환: 소프트 에러 하나의 상태 */
  state() {
    const v = this.villains[0]; if (!v) return null;
    return { kind: v.kind, nameKey: v.nameKey, dead: v.dead, hp: v.hp, maxHp: v.maxHp, respawn: Math.max(0, v.respawn), pos: v.group.position };
  }
  clear() {
    for (const v of this.villains) this.scene.remove(v.group);
    for (const s of this.shots) this.scene.remove(s.mesh);
    for (const m of this.missiles) this.scene.remove(m.group);
    for (const b of this.bursts) { this.scene.remove(b.pts); this.scene.remove(b.ring); }
    this.villains = []; this.shots = []; this.missiles = []; this.bursts = []; this.cool = 0; this.punchCool = 0; this.missileCool = 0;
  }
}
