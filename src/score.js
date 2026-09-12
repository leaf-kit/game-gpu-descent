// 점수: 무엇을 하면 몇 점인지 한곳에서 정한다. 콤보(연속 획득)와 화면 위로 떠오르는 +점수 표시를 함께 관리한다.
import { t, LANG } from './i18n.js?v=20260913002818';

const $ = (id) => document.getElementById(id);

/** 행동별 기본 점수 */
export const POINTS = {
  termNew: 300,      // 용어 카드를 처음 얻음
  termAgain: 20,     // 이미 아는 용어를 다시 봄
  person: 250,       // 인물을 처음 만남
  video: 100,        // 영상을 열어 봄
  coin: 50,          // 비트 코인
  packet: 120,       // 프레임 데이터와 같이 달림
  boost: 30,         // 부스트 패드
  photo: 80,         // 구조물을 클릭해 실제 사진을 봄
  stage: 1000,       // 스테이지(층) 통과
  trick180: 150,     // 스케이트 180도
  trick360: 400,     // 스케이트 360도
  trick720: 1200,    // 스케이트 720도
  airtime: 8,        // 공중에 머문 시간 0.1초당
  villainHit: 60,    // 소프트 에러 명중 (총)
  villainPunch: 200, // 소프트 에러 명중 (주먹, 가까이 가는 위험 보상)
  villainKill: 2500, // 소프트 에러 제거 (ECC 정정)
  monsterHit: 90,    // 괴물 명중 (총, 체력이 두 배라 한 방의 값도 높다)
  monsterPunch: 320, // 괴물 명중 (주먹, 발톱 사정거리 안으로 들어가는 위험 보상)
  monsterKill: 4000, // 괴물 제거
  missileHit: 220,   // 미사일 명중 (재장전이 길어 한 발의 값이 크다)
  missileKill: 1200, // 미사일로 게이지를 비웠을 때 얹어 주는 보너스
  timeBonus: 20,     // 목표 시간보다 1초 빠를 때마다
};
const COMBO_WINDOW = 4.5; // 이 시간 안에 또 얻으면 콤보가 이어진다
const RANKS = [[60000, 'S'], [40000, 'A'], [25000, 'B'], [12000, 'C'], [0, 'D']];

export class Score {
  constructor() {
    this.value = 0; this.combo = 0; this.comboTimer = 0; this.maxCombo = 0;
    this.stats = { terms: 0, people: 0, coins: 0, stages: 0, tricks: 0, videos: 0, photos: 0, best: 0 };
    this.pops = []; // 떠오르는 +점수 표시
    try { this.best = Number(localStorage.getItem('gd_best') || 0); } catch (_) { this.best = 0; }
    this.el = $('score-value'); this.comboEl = $('combo'); this.popWrap = $('score-pops'); this.bestEl = $('score-best');
    this.render();
  }
  /** 콤보 배수: 1.0 → 최대 8.0 */
  get mult() { return Math.min(8, 1 + this.combo * 0.5); }
  /** kind 에 해당하는 점수를 더한다. label 을 주면 화면에 함께 띄운다. */
  add(kind, label, opt = {}) {
    const base = POINTS[kind] ?? 0; if (!base) return 0;
    const keepCombo = opt.combo !== false;
    if (keepCombo) { this.combo++; this.comboTimer = COMBO_WINDOW; this.maxCombo = Math.max(this.maxCombo, this.combo); }
    const gained = Math.round(base * (keepCombo ? this.mult : 1) * (opt.scale || 1));
    this.value += gained;
    if (kind === 'termNew' || kind === 'termAgain') this.stats.terms++;
    else if (kind === 'person') this.stats.people++;
    else if (kind === 'coin') this.stats.coins++;
    else if (kind === 'stage') this.stats.stages++;
    else if (kind === 'video') this.stats.videos++;
    else if (kind === 'photo') this.stats.photos++;
    else if (kind.startsWith('trick')) this.stats.tricks++;
    this.pop(gained, label, opt.color);
    this.render();
    return gained;
  }
  /** 화면에 +점수 한 줄을 띄운다 */
  pop(n, label, color) {
    if (!this.popWrap) return;
    const d = document.createElement('div'); d.className = 'score-pop';
    if (color) d.style.color = color;
    d.innerHTML = `<b>+${n.toLocaleString()}</b>${label ? ` <span>${label}</span>` : ''}${this.combo > 1 ? ` <i>×${this.mult.toFixed(1)}</i>` : ''}`;
    this.popWrap.prepend(d);
    setTimeout(() => d.remove(), 1600);
    while (this.popWrap.children.length > 6) this.popWrap.lastChild.remove();
  }
  update(dt) {
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) { this.combo = 0; this.render(); }
      else if (this.comboEl) this.comboEl.style.setProperty('--fill', (this.comboTimer / COMBO_WINDOW * 100).toFixed(0) + '%');
    }
  }
  render() {
    if (this.el) this.el.textContent = this.value.toLocaleString();
    if (this.bestEl) this.bestEl.textContent = Math.max(this.best, this.value).toLocaleString();
    if (this.comboEl) {
      this.comboEl.classList.toggle('hidden', this.combo < 2);
      this.comboEl.querySelector('.combo-x').textContent = '×' + this.mult.toFixed(1);
      this.comboEl.querySelector('.combo-n').textContent = t('score.combo', { n: this.combo });
    }
  }
  /** 등급 (S~D) */
  rank() { for (const [min, r] of RANKS) if (this.value >= min) return r; return 'D'; }
  reset() { this.value = 0; this.combo = 0; this.comboTimer = 0; this.maxCombo = 0; this.stats = { terms: 0, people: 0, coins: 0, stages: 0, tricks: 0, videos: 0, photos: 0 }; this.render(); }
  save() { this.best = Math.max(this.best, this.value); try { localStorage.setItem('gd_best', String(this.best)); } catch (_) { /* 무시 */ } }
}
