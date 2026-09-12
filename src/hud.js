// HUD: 층 타이틀, 내레이션 큐, 용어 카드 팝업, 미니맵, 깊이 미터, 도감, 엔딩
import { t, L, L2, LANG, fmtLen, ytUrl, ytShort } from './i18n.js?v=20260913002818';

const $ = (id) => document.getElementById(id);

export class HUD {
  constructor(terms, sources, levels, videos = {}, people = []) {
    this.terms = terms; this.sources = sources; this.levels = levels; this.videos = videos; this.people = people; this.onVideo = null;
    this.found = new Set(); this.narQueue = []; this.narTimer = 0; this.cardTimer = 0; this.titleTimer = 0; this.kid = false; this.showPacket = false;
    this.mm = $('minimap-canvas').getContext('2d');
    try { const saved = JSON.parse(localStorage.getItem('gd_found') || '[]'); for (const k of saved) if (terms[k]) this.found.add(k); } catch (_) { /* 무시 */ }
    $('codex-close').addEventListener('click', () => this.toggleCodex(false));
    document.querySelectorAll('.codex-tabs .ct').forEach((b) => b.addEventListener('click', () => { document.querySelectorAll('.codex-tabs .ct').forEach((x) => x.classList.remove('active')); b.classList.add('active'); this.renderCodex(b.dataset.tab); }));
  }
  show(v) { $('hud').classList.toggle('hidden', !v); }
  /** 층 진입 타이틀 */
  levelTitle(def, heightM) {
    const el = $('level-title'); el.classList.remove('hidden', 'fadeout');
    const kind = def.chapter === 'prologue' ? 'PROLOGUE · ' : def.chapter === 'ai' ? 'STAGE · ' : def.chapter === 'hbm' ? 'BRANCH · ' : 'DEPTH · ';
    el.querySelector('.lt-depth').textContent = kind + def.id;
    el.querySelector('.lt-en').textContent = def.name.en; el.querySelector('.lt-ko').textContent = LANG === 'ko' ? def.name.ko : (def.subtitle ? L(def.subtitle) : '');
    const sub = LANG === 'ko' && def.subtitle ? ' · ' + L(def.subtitle) : '';
    const noScale = def.chapter === 'prologue' || def.chapter === 'ai';
    el.querySelector('.lt-scale').textContent = noScale ? (LANG === 'ko' ? L(def.subtitle || '') : '') : t('hud.scale', { h: fmtLen(heightM) }) + sub;
    this.titleTimer = 4.5;
    $('hud-level').textContent = t('hud.level', { id: def.id, name: L(def.name) });
    $('hud-scale').textContent = (def.chapter === 'prologue' || def.chapter === 'ai') ? L(def.subtitle || '') : t('hud.scale', { h: fmtLen(heightM) });
    $('collected-terms').innerHTML = '';
    this.setObjective(def.objective ? L(def.objective) : '');
  }
  setObjective(txt) { const o = $('hud-objective'); o.textContent = txt ? t('hud.objective', { txt }) : ''; o.style.display = txt ? 'inline-block' : 'none'; }
  updateTermCount(levelTerms) { const n = levelTerms.filter((k) => this.found.has(k)).length; $('hud-terms').textContent = t('hud.terms', { n, total: levelTerms.length }); return n; }
  /** 내레이션(아스트라) 큐 */
  narrate(text, opt = {}) { if (!text) return; this.narQueue.push({ text, who: opt.who || 'ASTRA', dur: opt.dur ?? Math.min(12, 3 + text.length * 0.06), hint: !!opt.hint }); }
  narrateNow(text, opt = {}) { this.narQueue.length = 0; this.narTimer = 0; this.narrate(text, opt); }
  /** 용어 카드 팝업 */
  showTerm(key, levelId) {
    const T = this.terms[key]; if (!T) return false;
    const isNew = !this.found.has(key); this.found.add(key); this.save();
    const c = $('term-card'); c.classList.remove('hidden', 'fadeout');
    c.querySelector('.tc-ko').textContent = T.ko; c.querySelector('.tc-en').textContent = T.en;
    // 쉬운 말 → 비유 → (접었다 펴는) 자세한 설명 순서로 읽게 한다
    const easy = L(T.kid) || L(T.analogy) || shorten(L(T.desc));
    c.querySelector('.tc-easy-text').textContent = easy;
    const an = L(T.analogy || ''); const showAn = an && an !== easy;
    c.querySelector('.tc-analogy').textContent = showAn ? an : ''; c.querySelector('.tc-analogy').style.display = showAn ? '' : 'none';
    c.querySelector('.tc-desc').textContent = L(T.desc);
    const more = c.querySelector('.tc-more'); more.open = false;
    c.querySelector('.tc-fact').textContent = L(T.fact || ''); c.querySelector('.tc-fact').style.display = T.fact ? '' : 'none';
    c.querySelector('.tc-src').textContent = (T.src || []).map((s) => this.sources[s]?.short || s).join(' · ');
    // 용어 카드는 클릭이 통하지 않는 겹침 화면이므로, 주소를 글자로 적어 두고 V 키 안내를 함께 둔다
    const vids = this.videos[key] || []; const tv = c.querySelector('.tc-video');
    tv.innerHTML = vids.length ? `${esc(t('video.hint'))} · ${esc(vids[0].title)}<br><span class="tc-url">${esc(ytShort(vids[0].id))}</span>` : '';
    tv.style.display = vids.length ? '' : 'none';
    this.cardTimer = 6.5;
    if (isNew) { const mini = document.createElement('div'); mini.className = 'mini-term'; mini.textContent = T.en + ' · ' + T.ko; $('collected-terms').prepend(mini); while ($('collected-terms').children.length > 8) $('collected-terms').lastChild.remove(); }
    return isNew;
  }
  save() { try { localStorage.setItem('gd_found', JSON.stringify([...this.found])); } catch (_) { /* 무시 */ } }
  interact(txt) { const p = $('interact-prompt'); if (!txt) { p.classList.add('hidden'); return; } p.classList.remove('hidden'); p.querySelector('span').textContent = txt; }
  depth(idx, total, label) { $('depth-meter').querySelector('.dm-fill').style.height = ((idx + 1) / total * 100).toFixed(1) + '%'; $('depth-meter').querySelector('.dm-label').textContent = label; }
  update(dt) {
    if (this.titleTimer > 0) { this.titleTimer -= dt; if (this.titleTimer <= 0) { $('level-title').classList.add('fadeout'); setTimeout(() => $('level-title').classList.add('hidden'), 800); } }
    if (this.cardTimer > 0) { this.cardTimer -= dt; if (this.cardTimer <= 0) { $('term-card').classList.add('fadeout'); setTimeout(() => { if (this.cardTimer <= 0) $('term-card').classList.add('hidden'); }, 500); } }
    const n = $('narration');
    if (this.narTimer > 0) { this.narTimer -= dt; if (this.narTimer <= 0) n.classList.add('hidden'); }
    else if (this.narQueue.length) { const it = this.narQueue.shift(); n.classList.remove('hidden'); n.classList.toggle('hint', it.hint); n.querySelector('.nar-who').textContent = it.who; n.querySelector('.nar-text').textContent = it.text; this.narTimer = it.dur; }
  }
  /** 미니맵: 층 범위, 트리거(용어), 게이트, 패킷, 플레이어 */
  minimap(level, player, camYaw, coinPts = []) {
    const ctx = this.mm; const W = 180; ctx.clearRect(0, 0, W, W); const s = W / (level.size * 2.2);
    const cx = W / 2, cz = W / 2; const px = player.pos.x, pz = player.pos.z;
    ctx.save(); ctx.translate(cx, cz); ctx.scale(s, s); ctx.translate(-px, -pz);
    ctx.strokeStyle = 'rgba(118,185,0,0.5)'; ctx.lineWidth = 1 / s; ctx.strokeRect(-level.size, -level.size, level.size * 2, level.size * 2);
    if (coinPts.length) { ctx.fillStyle = 'rgba(255,209,102,0.85)'; for (const [cx2, cz2] of coinPts) { ctx.beginPath(); ctx.arc(cx2, cz2, 1.2 / s, 0, 7); ctx.fill(); } }
    for (const tr of level.triggers) { ctx.fillStyle = this.found.has(tr.term) ? 'rgba(255,209,102,0.35)' : '#ffd166'; ctx.beginPath(); ctx.arc(tr.x, tr.z, 2.2 / s, 0, 7); ctx.fill(); }
    ctx.fillStyle = level.gateOpen ? '#5ee0ff' : '#ff5566'; ctx.beginPath(); ctx.arc(level.gatePos.x, level.gatePos.z, 3.5 / s, 0, 7); ctx.fill();
    if (level.sideGatePos) { ctx.fillStyle = '#b56cff'; ctx.beginPath(); ctx.arc(level.sideGatePos.x, level.sideGatePos.z, 3.5 / s, 0, 7); ctx.fill(); }
    if (level.packet) { const p = level.packet.group.position; if (this.showPacket || Math.hypot(p.x - px, p.z - pz) < level.size * 0.6) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.z, 2 / s, 0, 7); ctx.fill(); } }
    ctx.restore();
    ctx.save(); ctx.translate(cx, cz); ctx.rotate(Math.PI - player.yaw); ctx.fillStyle = '#76b900'; ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(4, 5); ctx.lineTo(-4, 5); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  /** 도감 */
  toggleCodex(force) { const c = $('codex'); const open = force ?? c.classList.contains('hidden'); c.classList.toggle('hidden', !open); if (open) this.renderCodex(document.querySelector('.codex-tabs .ct.active')?.dataset.tab || 'terms'); return open; }
  renderCodex(tab) {
    const b = $('codex-body'); b.innerHTML = '';
    if (tab === 'terms') {
      const keys = Object.keys(this.terms); const head = document.createElement('div'); head.style.cssText = 'margin-bottom:8px;color:#ffd166'; head.textContent = t('codex.found', { n: keys.filter((k) => this.found.has(k)).length, total: keys.length }); b.appendChild(head);
      for (const k of keys) { const T = this.terms[k]; const d = document.createElement('div'); d.className = 'cx-term' + (this.found.has(k) ? '' : ' locked'); const lv = this.levels.find((l) => (l.terms || []).includes(k)); const easy = L(T.kid) || L(T.analogy) || shorten(L(T.desc));
        d.innerHTML = `<span class="lvl">${lv ? lv.id : ''}</span><span class="ko">${T.ko}</span><span class="en">${T.en}</span>` +
          (this.found.has(k)
            ? `<div class="easy">${esc(easy)}</div><div class="desc">${esc(L(T.desc))}</div>${T.fact ? `<div class="fact">${esc(L(T.fact))}</div>` : ''}`
            : `<div class="desc">${t('codex.locked')}</div>`);
        const vids = this.videos[k] || []; if (vids.length) { const vw = document.createElement('div'); vw.className = 'vids'; vids.forEach((v) => { const bt = document.createElement('button'); bt.textContent = '▶ ' + v.title + (v.min ? ` (${v.min}m)` : ''); bt.addEventListener('click', () => this.onVideo && this.onVideo(v, { title: t('video.term', { term: T.en }), list: vids, meta: v.why || '' })); vw.appendChild(bt); vw.appendChild(ytLink(v)); }); d.appendChild(vw); }
        b.appendChild(d); }
    } else if (tab === 'people') {
      for (const p of this.people) { const d = document.createElement('div'); d.className = 'cx-person'; d.innerHTML = `<span class="ar">${(p.areas || []).join(' · ')}</span><span class="nm">${esc(L(p.name))}</span><span class="yr">${esc(p.years || '')}</span><div>${esc(L(p.role))}</div>${p.quote ? `<div style="color:#a8e0ff;font-style:italic;margin-top:3px">“${esc(L(p.quote))}”</div>` : ''}`;
        if (p.video) { const vw = document.createElement('div'); vw.className = 'vids'; const bt = document.createElement('button'); bt.textContent = '▶ ' + p.video.title + (p.video.min ? ` (${p.video.min}m)` : ''); bt.addEventListener('click', () => this.onVideo && this.onVideo(p.video, { title: L(p.name), meta: t('video.about', { name: L(p.name), years: p.years || '', role: L(p.role) }) })); vw.appendChild(bt); vw.appendChild(ytLink(p.video)); d.appendChild(vw); }
        b.appendChild(d); }
    } else if (tab === 'levels') {
      for (const lv of this.levels) { const d = document.createElement('div'); d.className = 'cx-level' + ((lv.terms || []).some((k) => this.found.has(k)) ? ' done' : ''); d.innerHTML = `<span class="id">${lv.id}</span><span>${esc(lv.name.en)}</span><span>${esc(lv.name.ko)}</span><span class="sz">${lv.heightM ? fmtLen(lv.heightM) : (lv.subtitle && typeof lv.subtitle !== 'function' ? esc(L(lv.subtitle)) : '')}</span><span class="marks">${(lv.terms || []).filter((k) => this.terms[k]).map((k) => `<b class="${this.found.has(k) ? 'on' : ''}">${esc(LANG === 'ko' ? this.terms[k].ko : this.terms[k].en)}</b>`).join('')}</span>`; b.appendChild(d); }
    } else {
      for (const [id, s] of Object.entries(this.sources)) { const d = document.createElement('div'); d.className = 'cx-src'; d.innerHTML = `<span class="sid">${id}</span><a href="${s.url}" target="_blank" rel="noopener">${esc(s.title)}</a>`; b.appendChild(d); }
    }
  }
}
/** 도감 항목 옆에 붙는 유튜브 바로가기 (모달을 거치지 않고 새 탭에서 연다) */
function ytLink(v) {
  const a = document.createElement('a'); a.className = 'yt-link'; a.href = ytUrl(v.id); a.target = '_blank'; a.rel = 'noopener';
  a.title = t('video.open'); a.textContent = ytShort(v.id) + ' ↗';
  return a;
}
/** 긴 설명에서 첫 문장만 뽑아 쉬운 한 줄로 쓴다 */
function shorten(s) {
  if (!s) return '';
  for (let i = 0; i < s.length; i++) { const ch = s[i]; if (ch === '.' || ch === '!' || ch === '?') return s.slice(0, i + 1); }
  return s.length > 60 ? s.slice(0, 58) + '…' : s;
}
function esc(s) { return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
export function formatTime(s) { const m = Math.floor(s / 60); const r = Math.floor(s % 60); return `${m}:${String(r).padStart(2, '0')}`; }
