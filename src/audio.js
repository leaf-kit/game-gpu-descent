// 소리: 짧은 효과음(WebAudio 합성)과 배경음악(assets/music/*.mp3)을 다룬다.
// 배경음악은 assets/music/playlist.json 을 읽어, 화면·층 id 에 맞는 곡을 골라 크로스페이드로 바꿔 튼다.
// 예전의 층별 합성 드론(웅웅거리는 지속음)은 듣기 거슬려 제거했다.
const MUSIC_DIR = './assets/music/';

export class AudioManager {
  /** 볼륨 구조: 효과음(sfx) 34 : 배경음(bgm) 72. 20260913 jwjeong 효과음이 음악에 묻혀 타격감이 없어 올렸다. */
  constructor() {
    this.ctx = null; this.enabled = true; this.master = null; this.sfx = null;
    this.vol = { sfx: 0.34, bgm: 0.72 };
    this.playlist = null; this.byLevel = new Map(); this.tracks = new Map(); // file → { file, audio } 또는 null(파일 없음)
    this.current = null; this.currentFile = null; this.pendingId = null; this.started = false; this.hasMusic = false;
    this.fades = new Set(); this.onTrack = null; this.onBlocked = null; this.trackTitle = ''; this.mainFile = 'bgm.mp3';
    this.blocked = false; this.pinned = null; this.pinnedForId = null; // pinned: 목록에서 고른 곡 (그 층에 머무는 동안 유지)
    this.ready = this.loadPlaylist();
  }
  init() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) { /* 효과음만 포기 */ }
      if (this.ctx) {
        this.master = this.ctx.createGain(); this.master.gain.value = 1; this.master.connect(this.ctx.destination);
        this.sfx = this.ctx.createGain(); this.sfx.gain.value = this.vol.sfx; this.sfx.connect(this.master);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    this.started = true;
    // 자동재생이 막혀 있었다면 첫 조작에서 다시 시도한다
    if (this.blocked || (this.current && this.current.paused)) {
      this.blocked = false;
      if (this.current && this.enabled) { this.current.play().catch(() => {}); this.fadeTo(this.current, this.vol.bgm, 0.8); }
      else if (this.pendingId != null) { const id = this.pendingId; this.pendingId = null; this.playFor(id); }
    }
  }
  /** 효과음/배경음 비율 조정 (0~1) */
  setVolumes(sfx, bgm) {
    this.vol.sfx = sfx; this.vol.bgm = bgm;
    if (this.sfx) this.sfx.gain.value = sfx;
    if (this.current) this.current.volume = this.enabled ? bgm : 0;
  }

  // ---------- 배경음악 ----------
  /** playlist.json 을 읽어 "화면·층 id → 곡" 표를 만든다. priority 가 큰 곡이 이긴다. */
  async loadPlaylist() {
    try {
      const r = await fetch(MUSIC_DIR + 'playlist.json', { cache: 'no-store' });
      if (!r.ok) throw new Error('no playlist');
      const d = await r.json();
      this.playlist = d;
      const entries = [];
      if (d.main && d.main.file) entries.push({ ...d.main, priority: d.main.priority ?? -1 });
      for (const t of d.tracks || []) entries.push({ ...t, priority: t.priority ?? 0 });
      for (const e of entries) for (const id of e.levels || []) {
        const prev = this.byLevel.get(id);
        if (!prev || e.priority > prev.priority) this.byLevel.set(id, e);
      }
      this.mainFile = (d.main && d.main.file) || 'bgm.mp3';
      this.hasMusic = entries.length > 0;
    } catch (_) { this.playlist = null; this.hasMusic = false; }
    return this.playlist;
  }
  /** 파일이 실제로 있으면 <audio> 를 만들어 돌려준다. 없으면 null (한 번만 확인하고 기억) */
  async getTrack(file) {
    if (!file) return null;
    if (this.tracks.has(file)) return this.tracks.get(file);
    const url = MUSIC_DIR + encodeURIComponent(file);
    let ok = false;
    try { const r = await fetch(url, { method: 'HEAD' }); ok = r.ok; } catch (_) { ok = false; }
    if (!ok) { this.tracks.set(file, null); return null; }
    const a = new Audio(url); a.loop = true; a.preload = 'none'; a.volume = 0;
    const entry = { file, audio: a };
    this.tracks.set(file, entry); return entry;
  }
  /** 이 id(화면 title/select/ending 또는 층 P1·L5·H1·A3 …)에 맞는 곡으로 바꾼다. */
  async playFor(id) {
    await this.ready;
    if (!this.playlist) return;
    if (this.pinned && id !== this.pinnedForId) this.pinned = null; // 층이 바뀌면 자동 전환으로 되돌린다
    this.pendingId = id;
    if (this.pinned) return; // 같은 층에 머무는 동안은 사용자가 고른 곡을 유지한다
    const e = this.byLevel.get(id);
    const candidates = [];
    if (e) { candidates.push(e.file); for (const f of e.fallback || []) candidates.push(f); }
    candidates.push(this.mainFile);
    let track = null;
    for (const f of candidates) { const t = await this.getTrack(f); if (t) { track = t; break; } }
    if (!track || this.currentFile === track.file) return; // 같은 곡이면 끊지 않고 이어서 재생
    this.currentFile = track.file;
    const old = this.current;
    this.current = track.audio;
    if (old) this.fadeTo(old, 0, 0.9, () => old.pause());
    try { track.audio.currentTime = 0; } catch (_) { /* 아직 로드 전 */ }
    track.audio.volume = 0;
    if (this.enabled) {
      const p = track.audio.play();
      if (p && p.catch) p.catch(() => { this.blocked = true; if (this.onBlocked) this.onBlocked(); }); // 자동재생 차단: 첫 조작에서 재시도
    }
    this.fadeTo(track.audio, this.enabled ? this.vol.bgm : 0, 1.2);
    const meta = this.metaOf(track.file);
    this.trackTitle = (meta && meta.title) || track.file;
    if (this.onTrack) this.onTrack(this.trackTitle);
  }
  /** 목록에서 곡을 직접 고른다(층이 바뀌어도 유지). file 이 없으면 자동 전환으로 되돌린다. */
  async pick(file) {
    if (!file) { this.pinned = null; const id = this.pendingId; this.currentFile = null; if (id != null) await this.playFor(id); return; }
    this.pinned = file; this.pinnedForId = this.pendingId; const t = await this.getTrack(file); if (!t || this.currentFile === file) return;
    this.currentFile = file; const old = this.current; this.current = t.audio;
    if (old) this.fadeTo(old, 0, 0.6, () => old.pause());
    try { t.audio.currentTime = 0; } catch (_) { /* 무시 */ }
    t.audio.volume = 0;
    if (this.enabled) { const p = t.audio.play(); if (p && p.catch) p.catch(() => {}); }
    this.fadeTo(t.audio, this.enabled ? this.vol.bgm : 0, 0.8);
    const meta = this.metaOf(file); this.trackTitle = (meta && meta.title) || file;
    if (this.onTrack) this.onTrack(this.trackTitle);
  }
  /** 모든 곡의 파일 존재 여부를 한 번에 확인한다 (위젯에서 '음원 없음' 표시용) */
  async probeAll() { await this.ready; for (const e of this.entries()) await this.getTrack(e.file); return true; }
  /** 재생 목록(메인 + 트랙) — 위젯용 */
  entries() {
    if (!this.playlist) return [];
    const out = [];
    if (this.playlist.main) out.push({ ...this.playlist.main, main: true });
    for (const t of this.playlist.tracks || []) out.push(t);
    return out;
  }
  metaOf(file) {
    if (!this.playlist) return null;
    if (this.playlist.main && this.playlist.main.file === file) return this.playlist.main;
    return (this.playlist.tracks || []).find((t) => t.file === file) || null;
  }
  /** 볼륨 선형 페이드 (초 단위) */
  fadeTo(audio, target, sec, done) {
    if (!audio) { if (done) done(); return; }
    for (const f of [...this.fades]) if (f.audio === audio) { clearInterval(f.timer); this.fades.delete(f); }
    const from = audio.volume; const steps = Math.max(1, Math.round(sec * 30)); let i = 0;
    const f = { audio, timer: 0 };
    f.timer = setInterval(() => {
      i++; const v = from + (target - from) * (i / steps);
      try { audio.volume = Math.max(0, Math.min(1, v)); } catch (_) { /* 무시 */ }
      if (i >= steps) { clearInterval(f.timer); this.fades.delete(f); if (done) done(); }
    }, 1000 / 30);
    this.fades.add(f);
  }
  stopMusic() { const a = this.current; if (a) this.fadeTo(a, 0, 0.6, () => a.pause()); this.current = null; this.currentFile = null; }
  toggle() {
    this.enabled = !this.enabled;
    if (this.master) this.master.gain.value = this.enabled ? 1 : 0;
    if (this.current) {
      if (this.enabled) { this.current.play().catch(() => {}); this.fadeTo(this.current, this.vol.bgm, 0.4); }
      else { const a = this.current; this.fadeTo(a, 0, 0.3, () => a.pause()); }
    }
    return this.enabled;
  }
  /** 예전 API 호환: 합성 드론은 쓰지 않는다 */
  setAmbient() { }
  stopDrone() { }

  // ---------- 효과음 ----------
  tone(freq, dur, type = 'sine', vol = 0.25, slide = 0) {
    if (!this.ctx || !this.enabled) return; const c = this.ctx; const o = c.createOscillator(); const g = c.createGain(); o.type = type; o.frequency.value = freq; if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), c.currentTime + dur);
    g.gain.setValueAtTime(vol, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur); o.connect(g); g.connect(this.sfx); o.start(); o.stop(c.currentTime + dur + 0.05);
  }
  card() { this.tone(880, 0.12, 'sine', 0.2); setTimeout(() => this.tone(1320, 0.2, 'sine', 0.18), 90); }
  newCard() { this.tone(660, 0.1, 'triangle', 0.2); setTimeout(() => this.tone(990, 0.1, 'triangle', 0.2), 80); setTimeout(() => this.tone(1320, 0.25, 'triangle', 0.2), 160); }
  jump() { this.tone(300, 0.15, 'square', 0.08, 300); }
  step() { this.tone(120 + Math.random() * 40, 0.05, 'triangle', 0.05); }
  gateOpen() { this.tone(440, 0.4, 'sine', 0.2, 440); setTimeout(() => this.tone(660, 0.6, 'sine', 0.2, 660), 200); }
  shrink() { if (!this.ctx || !this.enabled) return; this.tone(1200, 2.0, 'sawtooth', 0.15, -1150); this.tone(200, 2.2, 'sine', 0.2, 2000); }
  deny() { this.tone(200, 0.2, 'square', 0.1, -80); }
  packet() { this.tone(1500, 0.06, 'sine', 0.08); }
  /** 코인 획득: 맑은 두 음 + 반짝임. 콤보가 쌓일수록 음이 올라간다 */
  coin(combo = 0) {
    const step = Math.min(12, combo); const f = 880 * Math.pow(2, step / 12);
    this.tone(f, 0.09, 'triangle', 0.26);
    setTimeout(() => this.tone(f * 1.5, 0.14, 'triangle', 0.22), 55);
    setTimeout(() => this.tone(f * 2, 0.12, 'sine', 0.14), 95);
    setTimeout(() => this.tone(f * 3, 0.09, 'sine', 0.1), 130);
    // 콤보가 붙을수록 위에 반짝이는 배음을 얹는다 (계속 모으고 싶게 만드는 자리)
    if (combo >= 5) setTimeout(() => this.tone(f * 4, 0.08, 'sine', 0.07), 165);
  }
  /** 콤보가 한 단계 올라갈 때의 짧은 상승음 */
  comboUp(n) {
    const f = 520 + Math.min(10, n) * 60;
    this.tone(f, 0.1, 'square', 0.11);
    setTimeout(() => this.tone(f * 1.26, 0.11, 'triangle', 0.12), 55);
    setTimeout(() => this.tone(f * 1.5, 0.16, 'sine', 0.14), 110);
    setTimeout(() => this.tone(f * 2, 0.2, 'sine', 0.09), 165);
  }
  /** 잡음 한 덩이: 필터 종류·중심 주파수·주파수 이동(sweep)을 골라 쓴다 */
  noise(dur = 0.2, o = {}) {
    if (!this.ctx || !this.enabled) return;
    const c = this.ctx; const decay = o.decay ?? 1;
    const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, decay);
    const n = c.createBufferSource(); n.buffer = buf;
    const f = c.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.value = o.freq ?? 900; f.Q.value = o.q ?? 1;
    if (o.sweep) f.frequency.exponentialRampToValueAtTime(Math.max(40, o.sweep), c.currentTime + dur);
    const g = c.createGain(); g.gain.value = o.vol ?? 0.12; g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    n.connect(f); f.connect(g); g.connect(this.sfx); n.start();
  }
  /** 주먹이 빗나갈 때의 바람 소리 */
  punchMiss() { this.noise(0.2, { freq: 900, vol: 0.12 }); }
  /** 주먹이 맞을 때의 묵직한 타격음 */
  punchHit() { this.tone(120, 0.16, 'square', 0.28, -70); setTimeout(() => this.tone(70, 0.22, 'sine', 0.22, -35), 30); this.punchMiss(); }
  /** 총알 명중 */
  bulletHit() { this.tone(420, 0.1, 'square', 0.16, -220); setTimeout(() => this.tone(180, 0.14, 'triangle', 0.12, -80), 45); }
  /** 빌런 제거 세레머니: 상승 아르페지오 + 팡파르 */
  victory() {
    if (!this.ctx || !this.enabled) return;
    const notes = [523, 659, 784, 1047, 1319]; // 도 미 솔 도 미
    notes.forEach((f, i) => setTimeout(() => this.tone(f, 0.26, 'triangle', 0.22), i * 85));
    setTimeout(() => { this.tone(1047, 0.6, 'sine', 0.2); this.tone(1568, 0.6, 'sine', 0.12); }, 470);
    // 폭발 노이즈
    const c = this.ctx; const buf = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate); const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.2);
    const n = c.createBufferSource(); n.buffer = buf; const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1200;
    const g = c.createGain(); g.gain.value = 0.3; g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
    n.connect(f); f.connect(g); g.connect(this.sfx); n.start();
  }
  /** 지식 카드가 뜰 때의 부드러운 알림 */
  learn() { this.tone(660, 0.1, 'sine', 0.14); setTimeout(() => this.tone(990, 0.16, 'sine', 0.12), 80); }
  /** 맞고 배운 지식이 뜰 때: 아픈 소리 뒤에 곧바로 이어지므로 밝고 짧게 낸다 */
  factPop() {
    this.tone(520, 0.07, 'triangle', 0.16);
    setTimeout(() => this.tone(784, 0.09, 'triangle', 0.16), 60);
    setTimeout(() => this.tone(1175, 0.18, 'sine', 0.13), 120);
    setTimeout(() => this.noise(0.14, { freq: 5200, vol: 0.05, q: 0.8 }), 120);
  }

  // ---------- 미사일 ----------
  // 20260913 jwjeong 총(R)보다 무겁게 들려야 한 방의 값어치가 느껴진다. 저음을 깔고 쉬익 소리를 길게 준다.
  /** 발사: 발사관 압력 소리 + 밀려 나가는 저음 */
  missileFire() {
    this.tone(90, 0.3, 'square', 0.3, 60);
    this.noise(0.5, { freq: 500, sweep: 2600, vol: 0.2, q: 0.7, decay: 0.6 });
    setTimeout(() => this.tone(180, 0.5, 'sawtooth', 0.12, 420), 40);
  }
  /** 비행 중 쉬익 소리 (거리에 따라 작아진다) */
  missileFly(v = 1) { this.noise(0.22, { freq: 1400, sweep: 900, vol: 0.06 * v, q: 0.6 }); }
  /** 폭발: 저음 충격 + 넓은 잡음. 화면 흔들림과 함께 쓴다. */
  missileBoom(v = 1) {
    this.tone(70, 0.5, 'square', 0.34 * v, -45);
    this.tone(140, 0.34, 'sawtooth', 0.2 * v, -110);
    this.noise(0.6, { type: 'lowpass', freq: 1800, sweep: 200, vol: 0.3 * v, decay: 1.8 });
    setTimeout(() => this.noise(0.4, { freq: 320, vol: 0.14 * v, decay: 2.4 }), 90);
  }
  /** 재장전 완료: 다시 쏠 수 있다는 신호 */
  missileReady() { this.tone(880, 0.07, 'sine', 0.12); setTimeout(() => this.tone(1320, 0.1, 'sine', 0.1), 70); }
  /** 게이지를 다 깎았을 때 (퇴치 직전 한 박자) */
  gaugeBreak() { this.tone(300, 0.12, 'square', 0.22, -140); setTimeout(() => this.noise(0.3, { freq: 900, sweep: 180, vol: 0.18, decay: 1.6 }), 60); }

  // ---------- 전투 효과음 ----------
  /** 플레이어 사격 (ECC 정정 탄) */
  shoot() { this.tone(1400, 0.07, 'square', 0.1, -600); this.noise(0.08, { freq: 2600, vol: 0.05 }); }
  /** 소프트 에러가 쏘는 소리 */
  enemyFire(v = 1) { this.tone(180, 0.14, 'sawtooth', 0.07 * v, -60); this.noise(0.12, { freq: 420, vol: 0.05 * v }); }
  /** 총알 명중 (빌런 종류에 따라 음높이를 달리한다) */
  enemyHit(kind) {
    if (kind === 'monster') { this.tone(240, 0.12, 'square', 0.18, -120); setTimeout(() => this.tone(130, 0.18, 'sawtooth', 0.14, -50), 40); this.noise(0.14, { freq: 600, vol: 0.1 }); }
    else this.bulletHit();
  }
  /** 괴물 발소리: 멀면 작게 들린다 (v: 0~1) */
  monsterStep(v = 1, run = false) {
    if (v <= 0.04) return;
    this.tone(run ? 74 : 58, 0.13, 'sine', 0.26 * v, -24);
    this.noise(0.1, { type: 'lowpass', freq: 260, vol: 0.1 * v, decay: 2 });
  }
  /** 괴물의 으르렁거림. charge 면 돌진 직전의 높은 포효가 된다. */
  monsterRoar(v = 1, charge = false) {
    if (!this.ctx || !this.enabled || v <= 0.05) return;
    const base = charge ? 150 : 96;
    this.tone(base, charge ? 0.5 : 0.7, 'sawtooth', 0.2 * v, charge ? -60 : -46);
    this.tone(base * 1.5, charge ? 0.42 : 0.6, 'square', 0.07 * v, -40);
    this.noise(charge ? 0.45 : 0.6, { type: 'lowpass', freq: 900, sweep: 220, vol: 0.13 * v, decay: 0.8 });
    if (charge) setTimeout(() => this.tone(base * 2, 0.22, 'sawtooth', 0.1 * v, -180), 220);
  }
  /** 발톱을 치켜드는 예비 동작 (공격 예고) */
  monsterWindup(v = 1) { this.tone(320, 0.22, 'triangle', 0.08 * v, 180); this.noise(0.22, { freq: 500, sweep: 1400, vol: 0.06 * v }); }
  /** 발톱을 내리치는 소리 */
  monsterSwipe(v = 1) { this.noise(0.26, { freq: 1800, sweep: 300, vol: 0.16 * v, q: 1.4 }); setTimeout(() => this.tone(90, 0.16, 'square', 0.16 * v, -40), 90); }
  /** 괴물이 쓰러질 때의 낮게 잦아드는 울음 */
  monsterDie() {
    if (!this.ctx || !this.enabled) return;
    this.tone(190, 1.1, 'sawtooth', 0.22, -160);
    this.tone(95, 1.3, 'square', 0.12, -70);
    this.noise(1.0, { type: 'lowpass', freq: 700, sweep: 120, vol: 0.14, decay: 1.4 });
  }
  /** 빌런이 나타날 때의 경고음 (두 번 삐- 소리) */
  alarm() { this.tone(740, 0.16, 'square', 0.12); setTimeout(() => this.tone(560, 0.22, 'square', 0.12), 200); }
}
