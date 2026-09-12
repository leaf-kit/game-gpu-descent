// 카메라: 3인칭 추적(툼레이더식 어깨 너머) / 1인칭 / 조감
import * as THREE from 'three';
import { PLAYER_H } from './player.js?v=20260913002818';

export class CameraRig {
  constructor(camera) {
    this.camera = camera; this.mode = 'third'; // third | first | top
    this.yaw = 0; this.pitch = 0.24; this.dist = 7.0; // 넓고 여유 있는 앵글
    this.swayT = 0;
    this.pos = new THREE.Vector3(); this.look = new THREE.Vector3(); this.tmp = new THREE.Vector3();
    this.shake = 0; this.init = false; this.colliders = []; this.introT = 0; this.introDur = 3.2; this.levelSize = 60;
  }
  setMode(m) { this.mode = m; this.init = false; }
  startIntro(size) { this.levelSize = size; this.introT = this.introDur; this.init = false; }
  cycle() { this.mode = this.mode === 'third' ? 'first' : this.mode === 'first' ? 'top' : 'third'; this.init = false; return this.mode; }
  rotate(dx, dy) { this.yaw -= dx * 0.0045; this.pitch = Math.max(-0.5, Math.min(1.25, this.pitch + dy * 0.0035)); }
  zoom(d) { this.dist = Math.max(2.4, Math.min(14, this.dist + d)); }
  update(dt, player) {
    const p = player.pos; const cam = this.camera;
    let target, lookAt;
    if (this.mode === 'first') {
      // 1인칭: 눈 높이. yaw는 카메라 yaw → 플레이어 yaw도 카메라 따라감
      player.yaw = this.yaw;
      const eye = new THREE.Vector3(p.x, p.y + PLAYER_H * 0.92, p.z);
      const dir = new THREE.Vector3(Math.sin(this.yaw) * Math.cos(this.pitch), -Math.sin(this.pitch), Math.cos(this.yaw) * Math.cos(this.pitch));
      target = eye; lookAt = eye.clone().add(dir);
      player.setVisible(false);
    } else if (this.mode === 'top') {
      target = new THREE.Vector3(p.x - Math.sin(this.yaw) * 4, p.y + 26, p.z - Math.cos(this.yaw) * 4);
      lookAt = new THREE.Vector3(p.x, p.y, p.z);
      player.setVisible(true);
    } else {
      const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
      const off = new THREE.Vector3(-Math.sin(this.yaw) * cp * this.dist, sp * this.dist + 1.9, -Math.cos(this.yaw) * cp * this.dist);
      // 어깨 너머(약간 오른쪽) — 화면 왼쪽이 넓게 열리도록
      const side = new THREE.Vector3(-Math.cos(this.yaw), 0, Math.sin(this.yaw)).multiplyScalar(0.7); // 우측 어깨 너머 (R = F × up)
      target = new THREE.Vector3(p.x, p.y, p.z).add(off).add(side);
      lookAt = new THREE.Vector3(p.x, p.y + PLAYER_H * 0.85, p.z).add(side);
      // 카메라가 상자 안으로 들어가지 않게: 시선 상 가장 가까운 충돌 지점까지 당김
      const d = target.clone().sub(lookAt); const L = d.length(); d.normalize();
      const ray = new THREE.Ray(lookAt, d); const box = new THREE.Box3(); const hit = new THREE.Vector3(); let best = L;
      for (const c of this.colliders) { box.min.copy(c.min).subScalar(0.2); box.max.copy(c.max).addScalar(0.2); if (box.containsPoint(lookAt)) continue; if (ray.intersectBox(box, hit)) { const t = hit.distanceTo(lookAt); if (t < best) best = t; } }
      if (best < L) target = lookAt.clone().add(d.multiplyScalar(Math.max(1.0, best - 0.15)));
      if (target.y < p.y + 0.4) target.y = p.y + 0.4;
      player.setVisible(true);
    }
    // 층 진입 오프닝: 상공에서 전체를 보여주며 플레이어에게 내려온다
    if (this.introT > 0 && this.mode !== 'top') {
      this.introT -= dt; const a = Math.max(0, this.introT / this.introDur); const e = a * a * (3 - 2 * a);
      const S = this.levelSize; const over = new THREE.Vector3(p.x * 0.2, S * 0.9 + 12, p.z * 0.2 + S * 0.9); const lookO = new THREE.Vector3(0, 0, -S * 0.15);
      target = target.clone().lerp(over, e); lookAt = lookAt.clone().lerp(lookO, e);
      if (!this.init) { this.pos.copy(target); this.look.copy(lookAt); this.init = true; }
      this.pos.lerp(target, Math.min(1, dt * 6)); this.look.lerp(lookAt, Math.min(1, dt * 6)); cam.position.copy(this.pos); cam.lookAt(this.look); return;
    }
    if (!this.init) { this.pos.copy(target); this.look.copy(lookAt); this.init = true; }
    // 느긋한 추적: 위치는 천천히, 시선은 조금 더 빠르게 따라와 항해하듯 흐른다
    const k = this.mode === 'first' ? 1 : Math.min(1, dt * 5.5);
    this.pos.lerp(target, k); this.look.lerp(lookAt, this.mode === 'first' ? 1 : Math.min(1, dt * 8));
    cam.position.copy(this.pos);
    if (this.mode === 'third') { this.swayT += dt; cam.position.y += Math.sin(this.swayT * 0.7) * 0.035; cam.position.x += Math.sin(this.swayT * 0.45) * 0.02; } // 숨 쉬듯 미세한 흔들림
    if (this.shake > 0) { cam.position.x += (Math.random() - 0.5) * this.shake; cam.position.y += (Math.random() - 0.5) * this.shake; this.shake *= 0.9; if (this.shake < 0.005) this.shake = 0; }
    cam.lookAt(this.look);
  }
}
