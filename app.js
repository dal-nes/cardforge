'use strict';
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const para = s => String(s || '').trim();

/* ============================================================
   ДАННЫЕ
   ============================================================ */
function hexToRgba(hex,a){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

const PALETTES = [
 {name:'Nocturne Aurora', bg:'#080b16', panel:'rgba(148,163,216,.06)', line:'rgba(148,163,216,.18)', teal:'#6fe3d0', violet:'#a08bfd', amber:'#f2b56b', txt:'#e9edf7', mut:'#939cb4', gT:'rgba(111,227,208,.20)', gV:'rgba(160,139,253,.22)', gA:'rgba(242,181,107,.10)'},
 {name:'Gothic Noir', bg:'#0d0a0c', panel:'rgba(190,120,130,.05)', line:'rgba(216,164,148,.20)', teal:'#e8c07a', violet:'#c94f5d', amber:'#f0e6d2', txt:'#f2ece4', mut:'#a3968a', gT:'rgba(232,192,122,.14)', gV:'rgba(201,79,93,.20)', gA:'rgba(240,230,210,.07)'},
 {name:'Acid Cyberpunk', bg:'#07070f', panel:'rgba(255,62,138,.05)', line:'rgba(122,240,255,.22)', teal:'#7af0ff', violet:'#ff3e8a', amber:'#ffe14d', txt:'#eef7ff', mut:'#8fa3b8', gT:'rgba(122,240,255,.16)', gV:'rgba(255,62,138,.20)', gA:'rgba(255,225,77,.08)'},
 {name:'Faded Pastoral', bg:'#11150f', panel:'rgba(168,186,140,.06)', line:'rgba(197,183,142,.22)', teal:'#a8ba8c', violet:'#c5b78e', amber:'#d9a066', txt:'#f0eee2', mut:'#9aa08b', gT:'rgba(168,186,140,.16)', gV:'rgba(197,183,142,.16)', gA:'rgba(217,160,102,.09)'},
 {name:'Deep Abyss', bg:'#041014', panel:'rgba(96,165,180,.06)', line:'rgba(140,200,214,.20)', teal:'#8cc8d6', violet:'#4f7fae', amber:'#e8d9a0', txt:'#e6f2f4', mut:'#87a0a8', gT:'rgba(140,200,214,.15)', gV:'rgba(79,127,174,.22)', gA:'rgba(232,217,160,.07)'},
 {name:'Royal Decadence', bg:'#120a1c', panel:'rgba(178,132,220,.06)', line:'rgba(205,168,240,.20)', teal:'#d0a8f0', violet:'#8a5cd6', amber:'#f0c060', txt:'#f2eafa', mut:'#a294b8', gT:'rgba(208,168,240,.15)', gV:'rgba(138,92,214,.22)', gA:'rgba(240,192,96,.08)'},
 {name:'Ember Dusk', bg:'#150d08', panel:'rgba(230,140,80,.05)', line:'rgba(240,180,120,.22)', teal:'#f0b878', violet:'#c85a3a', amber:'#ffe0b0', txt:'#f7ede2', mut:'#b09a86', gT:'rgba(240,184,120,.14)', gV:'rgba(200,90,58,.20)', gA:'rgba(255,224,176,.08)'},
 {name:'Arctic Bureau', bg:'#0a1016', panel:'rgba(150,180,205,.06)', line:'rgba(170,200,222,.20)', teal:'#a8d0e8', violet:'#5f7fa8', amber:'#e0c890', txt:'#eaf2f8', mut:'#93a6b5', gT:'rgba(168,208,232,.14)', gV:'rgba(95,127,168,.20)', gA:'rgba(224,200,144,.07)'},
 {name:'macOS Dark', bg:'#1d1d1f', panel:'rgba(120,120,128,.08)', line:'rgba(120,120,128,.22)', teal:'#0a84ff', violet:'#bf5af2', amber:'#ff9f0a', txt:'#f5f5f7', mut:'#8e8e93', gT:'rgba(10,132,255,.14)', gV:'rgba(191,90,242,.14)', gA:'rgba(255,159,10,.10)'},
 {name:'RPG Parchment', bg:'#14100a', panel:'rgba(180,140,80,.06)', line:'rgba(200,170,100,.22)', teal:'#c8aa6e', violet:'#a67c52', amber:'#f0c75e', txt:'#f0e6d2', mut:'#a09b8c', gT:'rgba(200,170,110,.14)', gV:'rgba(166,124,82,.16)', gA:'rgba(240,199,94,.10)'}
];
const FONTPAIRS = [
 {name:'Fraunces + Manrope', url:'family=Fraunces:ital,wght@0,500;0,700;1,500&family=Manrope:wght@400;600;800', disp:"'Fraunces',Georgia,serif", text:"'Manrope','Segoe UI',Arial,sans-serif"},
 {name:'Playfair Display + Inter', url:'family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Inter:wght@400;600;800', disp:"'Playfair Display',Georgia,serif", text:"'Inter','Segoe UI',Arial,sans-serif"},
 {name:'Cormorant Garamond + Jost', url:'family=Cormorant+Garamond:ital,wght@0,600;1,500&family=Jost:wght@400;600', disp:"'Cormorant Garamond',Georgia,serif", text:"'Jost','Segoe UI',Arial,sans-serif"},
 {name:'Libre Baskerville + Space Grotesk', url:'family=Libre+Baskerville:ital@0;1&family=Space+Grotesk:wght@400;700', disp:"'Libre Baskerville',Georgia,serif", text:"'Space Grotesk','Segoe UI',Arial,sans-serif"},
 {name:'Cinzel + Nunito', url:'family=Cinzel:wght@600;800&family=Nunito:wght@400;700;800', disp:"'Cinzel',Georgia,serif", text:"'Nunito','Segoe UI',Arial,sans-serif"},
 {name:'Marcellus + Karla', url:'family=Marcellus&family=Karla:ital,wght@0,400;0,700;1,400', disp:"'Marcellus',Georgia,serif", text:"'Karla','Segoe UI',Arial,sans-serif"},
 {name:'Orbitron + Rajdhani (sci-fi)', url:'family=Orbitron:wght@600;800&family=Rajdhani:wght@500;700', disp:"'Orbitron',Arial,sans-serif", text:"'Rajdhani','Segoe UI',Arial,sans-serif"}
];
const MOTIFS = ['aurora','scanlines','embers','grain','halo'];
const MOTIF_NAMES = {aurora:'Северное сияние', scanlines:'Сканлайны', embers:'Пепел и искры', grain:'Бумажное зерно', halo:'Орнаментальные кольца'};
const MOODS = [
 ['холодная роскошь','всё важное сказано шёпотом'],
 ['деревенская нежность','трещины по штукатурке и тёплый хлеб'],
 ['запах озона и старой бумаги','последняя страница дневника'],
 ['неоновая тоска','вывески отражаются в лужах'],
 ['военная сдержанность','каждый жест отточен, каждое слово — патрон'],
 ['бальная манерность','за веером — расчёт, за улыбкой — долг'],
 ['солёный ветер и ржавчина','верёвки поют, когда меняется ветер'],
 ['больничная белизна','тишина, которую не хочется нарушать'],
 ['пепельная меланхолия','красиво горит то, что уже нельзя спасти']
];
const RADII = [
 {name:'Мягкая романтика', card:'24px', fig:'18px', acc:'16px', chip:'20px'},
 {name:'Строгая сталь', card:'8px', fig:'6px', acc:'4px', chip:'4px'},
 {name:'Смешанная', card:'22px', fig:'8px', acc:'18px', chip:'6px'}
];

const TRACKER_DEFS = [
  {id:'affection', icon:'❤️', name:'Affection / relationship meter', mode:'visible', desc:'Numeric bar. Milestone events log to EVENT MEMORY.'},
  {id:'suspicion', icon:'🔍', name:'Suspicion / trust meter', mode:'visible', desc:'Inconsistencies logged to EVENT MEMORY for soft recall.'},
  {id:'tension', icon:'⚡', name:'Tension meter', mode:'visible', desc:'Unresolved tension carries forward across scene breaks.'},
  {id:'resource', icon:'💰', name:'Resource / currency tracker', mode:'visible', desc:'Items consumed on use. Good for heist, RPG, survival.'},
  {id:'time', icon:'🕐', name:'Time / countdown tracker', mode:'visible', desc:'Time + location + optional countdown. Pairs with time skip engine.'},
  {id:'datetime', icon:'📅', name:'Time / date / location display', mode:'visible', desc:'Displays at top of every response. 12-hour format. Updates on every time or location change.'},
  {id:'intrigue', icon:'🧠', name:'Hidden intrigue tracker', mode:'hidden', desc:'How intriguing the character finds {{user}}. Surfaces through dialogue texture only.'},
  {id:'rivalry', icon:'😤', name:'Hidden rivalry / jealousy tracker', mode:'hidden', desc:'Multi-character triangular dynamics. Jealousy decays; memory of events does not.'},
  {id:'guard', icon:'🛡️', name:'Hidden guard / vulnerability tracker', mode:'hidden', desc:'Emotional availability. Drop-moments logged to EVENT MEMORY.'},
  {id:'danger', icon:'⚠️', name:'Hidden danger / threat tracker', mode:'hidden', desc:'Scene stakes and pacing. Consequences persist until resolved in-scene.'},
  {id:'relationship', icon:'🔓', name:'Hidden relationship stage tracker', mode:'hidden', desc:'Stage tracked silently — no notifications, no display. For fully immersive bots.'},
  {id:'affection_h', icon:'❤️', name:'Affection — hidden', mode:'immersive', desc:'Warmth and distance shown through behaviour only. No meter.'},
  {id:'suspicion_h', icon:'🔍', name:'Suspicion — hidden', mode:'immersive', desc:'Wariness and openness govern tone only. No meter.'},
  {id:'tension_h', icon:'⚡', name:'Tension — hidden', mode:'immersive', desc:'Escalation and rupture thresholds active. No meter.'},
  {id:'resource_h', icon:'💰', name:'Resource — hidden', mode:'immersive', desc:'Loss tracked internally. Characters notice absence through narration only.'},
  {id:'time_h', icon:'🕐', name:'Time / countdown — hidden', mode:'immersive', desc:'Time and countdown tracked in CORE MEMORY. Urgency surfaces through narration only.'},
  {id:'datetime_h', icon:'📅', name:'Time / date / location — hidden', mode:'immersive', desc:'Tracked in CORE MEMORY. Surfaces through environmental anchors and soft recall only.'},
  {id:'reputation', icon:'👑', name:'Reputation / fame tracker', mode:'extra', desc:'How the world sees the character. Affects NPC reactions and available choices.'},
  {id:'sanity', icon:'🌀', name:'Sanity / stress tracker', mode:'extra', desc:'Mental state under pressure. Hallucinations, paranoia, or clarity thresholds.'},
  {id:'corruption', icon:'🖤', name:'Corruption / morality tracker', mode:'extra', desc:'Moral decay or redemption arc. Affects choices and endings.'},
  {id:'loyalty', icon:'⚔️', name:'Loyalty / faction tracker', mode:'extra', desc:'Faction standing and betrayals. Shifts alliances and unlocks content.'}
];

/* ============================================================
   ДИЗАЙН
   ============================================================ */
let design = null;
function getPaletteSource(){
  const sel = $('#paletteSelect').value;
  if(sel === 'custom'){
    const pick = k => ($(`[data-pal="${k}"]`)?.value) || '#000000';
    const p = pick;
    return {
      name:'Custom', bg:p('bg'), panel:hexToRgba(p('panel'),0.06), line:hexToRgba(p('line'),0.22),
      teal:p('teal'), violet:p('violet'), amber:p('amber'), txt:p('txt'), mut:p('mut'),
      gT:hexToRgba(p('teal'),0.14), gV:hexToRgba(p('violet'),0.16), gA:hexToRgba(p('amber'),0.10)
    };
  }
  if(sel === 'macos') return PALETTES.find(x=>x.name==='macOS Dark');
  if(sel === 'rpg') return PALETTES.find(x=>x.name==='RPG Parchment');
  return PALETTES[Math.floor(Math.random()*PALETTES.length)];
}
function randomDesign(){
  return {
    palette: getPaletteSource(),
    fonts: FONTPAIRS[Math.floor(Math.random()*FONTPAIRS.length)],
    motif: MOTIFS[Math.floor(Math.random()*MOTIFS.length)],
    mood: MOODS[Math.floor(Math.random()*MOODS.length)],
    radius: RADII[Math.floor(Math.random()*RADII.length)]
  };
}

function motifCSS(motif, scope, sfx, p, cardSel){
  if(motif === 'scanlines') return `
${scope}.nx-aurora{display:none}
${cardSel}::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.028) 0 1px,transparent 1px 3px),radial-gradient(120% 90% at 50% 0%,transparent 55%,rgba(0,0,0,.42));mix-blend-mode:overlay}`;
  if(motif === 'grain') return `
${scope}.nx-aurora{display:none}
${cardSel}::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;opacity:.55;background-image:radial-gradient(rgba(255,255,255,.05) .6px,transparent .7px),radial-gradient(rgba(0,0,0,.16) .6px,transparent .7px);background-size:3px 3px,5px 5px;background-position:0 0,1px 2px}`;
  if(motif === 'embers') return `
${scope}.nx-aurora{position:absolute;inset:0;pointer-events:none;overflow:hidden}
${scope}.nx-aurora i{position:absolute;bottom:-12px;width:6px;height:6px;border-radius:50%;filter:blur(.6px);opacity:0;animation:nxEmber${sfx} 9s linear infinite}
${scope}.nx-aurora i:nth-child(1){left:14%;background:${p.teal};box-shadow:0 0 12px 3px ${p.gT}}
${scope}.nx-aurora i:nth-child(2){left:54%;background:${p.violet};box-shadow:0 0 12px 3px ${p.gV};animation-delay:3.2s;width:4px;height:4px}
${scope}.nx-aurora i:nth-child(3){left:83%;background:${p.amber};box-shadow:0 0 12px 3px ${p.gA};animation-delay:6.1s}
@keyframes nxEmber${sfx}{0%{transform:translateY(0);opacity:0}8%{opacity:.9}100%{transform:translateY(-620px);opacity:0}}`;
  if(motif === 'halo') return `
${scope}.nx-aurora{position:absolute;inset:0;pointer-events:none;overflow:hidden}
${scope}.nx-aurora i{position:absolute;border-radius:50%;filter:none;opacity:.55}
${scope}.nx-aurora i:nth-child(1){width:560px;height:560px;top:-290px;left:50%;margin-left:-280px;background:transparent;border:1px dashed ${p.line};animation:nxHalo${sfx} 40s linear infinite}
${scope}.nx-aurora i:nth-child(2){width:420px;height:420px;top:-220px;left:50%;margin-left:-210px;background:transparent;border:1px solid ${p.line};animation:nxHalo${sfx} 28s linear infinite reverse}
${scope}.nx-aurora i:nth-child(3){width:340px;height:340px;top:-150px;left:50%;margin-left:-170px;background:${p.gV};filter:blur(80px);opacity:.5}
@keyframes nxHalo${sfx}{to{transform:rotate(360deg)}}`;
  return `
${scope}.nx-aurora{position:absolute;inset:0;pointer-events:none;overflow:hidden}
${scope}.nx-aurora i{position:absolute;border-radius:50%;filter:blur(70px);opacity:.55;animation:nxFloat${sfx} 12s ease-in-out infinite}
${scope}.nx-aurora i:nth-child(1){width:340px;height:340px;top:-120px;left:-90px;background:${p.gT}}
${scope}.nx-aurora i:nth-child(2){width:300px;height:300px;top:-60px;right:-80px;background:${p.gV};animation-delay:3s}
${scope}.nx-aurora i:nth-child(3){width:380px;height:380px;bottom:-160px;left:28%;background:${p.gA};animation-delay:6s}
@keyframes nxFloat${sfx}{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(26px) scale(1.06)}}`;
}

/* ============================================================
   ШАБЛОНИЗАТОР
   ============================================================ */
function renderTemplate(html, data){
  let out = html;
  out = out.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (m, key, inner) => para(data[key]) ? inner : '');
  out = out.replace(/{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g, (m, key, inner) => {
    const arr = data[key];
    if(!Array.isArray(arr) || !arr.length) return '';
    return arr.map((item,i) => inner.replace(/{{item}}/g, esc(item)).replace(/{{index}}/g, i)).join('');
  });
  out = out.replace(/{{(\w+)}}/g, (m, key) => esc(data[key] ?? ''));
  return out;
}

function makeTemplateData(d, block){
  const data = {...d};
  const tags = d.tags || [];
  data.tagsHtml = tags.map((t,i) => `<span class="nx-tag${i<2?' nx-hot':''}">${esc(t)}</span>`).join(' ');
  data.tagsList = tags.join(', ');
  data.coverImg = para(d.coverUrl) ? `<img src="${d.coverUrl}" alt="${esc(d.coverCap||d.charName)}">` : '';
  data.photo1Img = para(d.photo1) ? `<img src="${d.photo1}" alt="${esc(d.photo1cap||'photo')}">` : '';
  data.photo2Img = para(d.photo2) ? `<img src="${d.photo2}" alt="${esc(d.photo2cap||'photo')}">` : '';
  data.photo3Img = para(d.photo3) ? `<img src="${d.photo3}" alt="${esc(d.photo3cap||'scene')}">` : '';
  data.hasAudio = !!(para(d.audioUrl) && para(d.trackName));
  data.hasCover = !!para(d.coverUrl);
  data.hasPhoto1 = !!para(d.photo1);
  data.hasPhoto2 = !!para(d.photo2);
  data.hasPhoto3 = !!para(d.photo3);
  data.hasChar2 = !!para(d.char2Name);
  data.hasMech = !!(para(d.mechText) || Object.keys(getEnabledTrackers(d)).length);
  data.trackerText = buildTrackerBlock(d);
  data.mechanics = para(d.mechText) || data.trackerText || '';
  return data;
}

/* ============================================================
   HTML БЛОК A — ОПИСАНИЕ
   ============================================================ */
function buildBlockA(d, design){
  const p = design.palette, f = design.fonts, r = design.radius, D = f.disp, T = f.text;
  const motif = motifCSS(design.motif, '', 'A', p, '.nx-card');
  const tags = (d.tags || []).slice(0, 10);

  const tagsHtml = tags.length ? `
      <div class="nx-tags">
${tags.map((t,i)=>`        <span class="nx-tag${i<2?' nx-hot':''}">${esc(t)}</span>`).join('\n')}
      </div>` : '';

  const coverHtml = d.coverUrl ? `
      <figure class="nx-cover nx-rv" data-cap="${esc(d.coverCap)}">
        <img src="${d.coverUrl}" alt="${esc(d.charName)}">
        <figcaption class="nx-cap">${esc(d.coverCap)}</figcaption>
      </figure>` : '';

  const mechAcc = (para(d.mechText) || buildTrackerBlock(d)) ? `
        <div class="nx-acc">
          <button class="nx-acc-head" type="button"><span class="nx-ico">⚙</span>Mechanics<span class="nx-chev">▸</span></button>
          <div class="nx-acc-body"><div class="nx-acc-inner">
            ${para(d.mechText)?`<p>${esc(d.mechText)}</p>`:''}
            ${buildTrackerBlock(d)?`<pre style="white-space:pre-wrap;font-size:12.5px;line-height:1.7;margin-top:10px">${esc(buildTrackerBlock(d))}</pre>`:''}
          </div></div>
        </div>` : '';

  const char2Acc = para(d.char2Name) ? `
        <div class="nx-acc">
          <button class="nx-acc-head" type="button"><span class="nx-ico">👥</span>${esc(d.char2Name)}<span class="nx-chev">▸</span></button>
          <div class="nx-acc-body"><div class="nx-acc-inner">
            <div class="nx-chips">${para(d.char2Age)?`<span>${esc(d.char2Age)}</span>`:''}${para(d.char2Role)?`<span>${esc(d.char2Role)}</span>`:''}</div>
            ${para(d.char2Appearance)?`<p><b>Внешность:</b> ${esc(d.char2Appearance)}</p>`:''}
            ${para(d.char2Personality)?`<p><b>Характер:</b> ${esc(d.char2Personality)}</p>`:''}
            ${para(d.char2Backstory)?`<p><b>История:</b> ${esc(d.char2Backstory)}</p>`:''}
            ${para(d.char2Connection)?`<p><b>Связь с {{user}}:</b> ${esc(d.char2Connection)}</p>`:''}
            ${para(d.char2SpeechManner)?`<p><b>Речь:</b> ${esc(d.char2SpeechManner)}</p>`:''}
            ${para(d.char2Goal)?`<p><b>Цель:</b> ${esc(d.char2Goal)}</p>`:''}
            ${para(d.char2Conflict)?`<p><b>Конфликт:</b> ${esc(d.char2Conflict)}</p>`:''}
            ${para(d.char2RelationToUser)?`<p><b>Отношение к {{user}}:</b> ${esc(d.char2RelationToUser)}</p>`:''}
          </div></div>
        </div>` : '';

  const polars = [ [d.photo1, d.photo1cap], [d.photo2, d.photo2cap] ].filter(x => para(x[0]));
  const polarHtml = polars.length ? `
      <div class="nx-polar-row nx-rv">
${polars.map(x=>`        <div class="nx-polar" data-cap="${esc(x[1])}"><span class="nx-tape"></span><span class="nx-ph"><img src="${x[0]}" alt=""></span><span class="nx-pcap">${esc(x[1])}</span></div>`).join('\n')}
      </div>` : '';

  const deckHtml = (para(d.audioUrl) && para(d.trackName)) ? `
      <div class="nx-deck-wrap nx-rv">
        <div class="nx-deck" id="nxDeck">
          <div class="nx-cov"><img src="${d.coverUrl || ''}" alt="cover"></div>
          <div class="nx-ctl">
            <div class="nx-trk">${esc(d.trackName)}<small>${esc(d.trackSub)}</small></div>
            <div class="nx-btns">
              <button class="nx-pbtn" id="nxPlay" type="button">▶</button>
              <div class="nx-prog" id="nxProg"><i id="nxBar"></i></div>
            </div>
            <div class="nx-time" id="nxTime">0:00 / 0:00</div>
          </div>
        </div>
        <audio id="nxAudio" src="${d.audioUrl}" preload="metadata"></audio>
      </div>` : '';

  return `<html-box>
<link href="https://fonts.googleapis.com/css2?${f.url}&display=swap" rel="stylesheet">
<style>
.nx-card{--nx-bg:${p.bg};--nx-panel:${p.panel};--nx-line:${p.line};--nx-teal:${p.teal};--nx-violet:${p.violet};--nx-amber:${p.amber};--nx-txt:${p.txt};--nx-mut:${p.mut};position:relative;max-width:680px;margin:0 auto;padding:0 0 24px;background:radial-gradient(900px 420px at 12% -6%,${p.gT},transparent 60%),radial-gradient(800px 420px at 92% 8%,${p.gV},transparent 55%),radial-gradient(700px 500px at 50% 112%,${p.gA},transparent 60%),var(--nx-bg);border:1px solid var(--nx-line);border-radius:${r.card};overflow:hidden;font-family:${T};color:var(--nx-txt);line-height:1.65;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.nx-card *{box-sizing:border-box;margin:0;padding:0}
${motif}
.nx-hero{position:relative;z-index:1;text-align:center;padding:36px 26px 18px}
.nx-kicker{font-size:10.5px;letter-spacing:3px;text-transform:uppercase;color:var(--nx-teal);margin-bottom:12px}
.nx-title{font-family:${D};font-weight:700;font-size:clamp(24px,5.4vw,34px);line-height:1.15;color:#fff;text-shadow:0 0 24px ${p.gV}}
.nx-sub{margin-top:10px;font-family:${D};font-style:italic;font-size:clamp(15px,3.6vw,18px);color:${p.mut}}
.nx-by{margin-top:12px;font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:var(--nx-mut)}
.nx-by b{color:var(--nx-amber)}
.nx-tags{position:relative;z-index:1;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:4px 22px 18px}
.nx-tag{font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:${p.txt};background:${p.panel};border:1px solid var(--nx-line);padding:5px 12px;border-radius:${r.chip};transition:.3s}
.nx-tag:hover{border-color:var(--nx-teal);color:var(--nx-teal);box-shadow:0 0 14px ${p.gT}}
.nx-tag.nx-hot{background:${p.gA};border-color:${p.amber};color:var(--nx-amber)}
.nx-cover{position:relative;z-index:1;margin:0 22px 8px;border-radius:${r.fig};overflow:hidden;border:1px solid var(--nx-line);box-shadow:0 18px 46px rgba(0,0,0,.55),0 0 30px ${p.gV};cursor:zoom-in}
.nx-cover img{width:100%;display:block;filter:saturate(1.06) contrast(1.03)}
.nx-cover::after{content:"⤢";position:absolute;right:12px;bottom:12px;width:36px;height:36px;border-radius:50%;background:rgba(8,11,22,.7);border:1px solid var(--nx-teal);color:var(--nx-teal);display:grid;place-items:center;font-size:15px;opacity:0;transition:.3s;backdrop-filter:blur(3px)}
.nx-cover:hover::after{opacity:1}
.nx-cover .nx-cap{position:absolute;left:0;right:0;bottom:0;padding:26px 16px 12px;background:linear-gradient(transparent,rgba(0,0,0,.85));font-family:${D};font-style:italic;font-size:14px;color:${p.txt}}
.nx-sec{position:relative;z-index:1;padding:20px 24px 4px}
.nx-sec h3{display:flex;align-items:center;gap:10px;font-size:12px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:var(--nx-teal);margin-bottom:14px}
.nx-sec h3::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,var(--nx-line),transparent)}
.nx-sec p{font-size:14px;line-height:1.78;color:${p.txt};margin-bottom:12px;text-align:justify;opacity:.92}
.nx-sec p b{color:var(--nx-teal)}
.nx-hand{font-family:${D};font-style:italic;font-size:15px;color:var(--nx-violet)}
.nx-dossier{position:relative;z-index:1;padding:6px 24px 4px}
.nx-acc{border:1px solid var(--nx-line);border-radius:${r.acc};background:var(--nx-panel);margin-bottom:10px;overflow:hidden;backdrop-filter:blur(4px)}
.nx-acc-head{width:100%;display:flex;align-items:center;gap:12px;padding:14px 18px;background:none;border:0;color:var(--nx-txt);font-family:${T};font-weight:800;font-size:12px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;text-align:left}
.nx-acc-head .nx-ico{flex:0 0 auto;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:13px;background:linear-gradient(135deg,${p.gT},${p.gV});border:1px solid var(--nx-line)}
.nx-acc-head .nx-chev{margin-left:auto;color:var(--nx-teal);font-size:12px;transition:transform .4s}
.nx-acc.nx-on .nx-chev{transform:rotate(90deg)}
.nx-acc.nx-on{border-color:${p.teal};box-shadow:0 0 24px ${p.gT}}
.nx-acc-body{max-height:0;overflow:hidden;transition:max-height .6s cubic-bezier(.4,0,.2,1)}
.nx-acc.nx-on .nx-acc-body{max-height:1800px}
.nx-acc-inner{padding:2px 18px 16px;font-size:13.5px;line-height:1.75;color:${p.txt};opacity:.92}
.nx-acc-inner p{margin-bottom:10px}
.nx-acc-inner b{color:var(--nx-teal)}
.nx-quote{border-left:2px solid var(--nx-violet);padding:8px 14px;margin:12px 0;font-family:${D};font-style:italic;font-size:15px;color:${p.txt};background:${p.gV};border-radius:0 10px 10px 0}
.nx-chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px}
.nx-chips span{font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:var(--nx-teal);background:${p.gT};border:1px solid ${p.teal};padding:4px 10px;border-radius:${r.chip}}
.nx-polar-row{position:relative;z-index:1;display:flex;gap:14px;justify-content:center;flex-wrap:wrap;padding:8px 24px 6px}
.nx-polar{width:44%;background:#f2eefb;padding:8px 8px 26px;border-radius:6px;box-shadow:0 14px 32px rgba(0,0,0,.55);position:relative;transform:rotate(-2.4deg);transition:transform .35s ease,box-shadow .35s ease;cursor:zoom-in}
.nx-polar:nth-child(2n){transform:rotate(2deg)}
.nx-polar:hover{transform:rotate(0) scale(1.05);box-shadow:0 22px 46px rgba(0,0,0,.7),0 0 0 1px ${p.teal};z-index:3}
.nx-polar .nx-tape{position:absolute;top:-10px;left:50%;transform:translateX(-50%) rotate(-4deg);width:62px;height:19px;background:${p.gV};box-shadow:0 2px 5px rgba(0,0,0,.3)}
.nx-polar .nx-ph{display:block;width:100%;aspect-ratio:1/1;border-radius:3px;overflow:hidden;background:linear-gradient(135deg,#171b2e,#0d101f)}
.nx-polar .nx-ph img{width:100%;height:100%;object-fit:cover;display:block}
.nx-polar .nx-pcap{position:absolute;bottom:5px;left:0;right:0;text-align:center;font-family:${D};font-style:italic;font-size:12.5px;color:#5a5273}
.nx-deck-wrap{position:relative;z-index:1;margin:16px 24px 4px;background:linear-gradient(180deg,${p.panel},transparent);border:1px solid var(--nx-line);border-radius:${r.fig};padding:14px;backdrop-filter:blur(4px)}
.nx-deck{display:flex;gap:14px;align-items:center}
.nx-deck .nx-cov{flex:0 0 88px;width:88px;height:88px;border-radius:12px;overflow:hidden;border:1px solid var(--nx-line);box-shadow:0 8px 22px rgba(0,0,0,.6);background:#0c0f1d}
.nx-deck .nx-cov img{width:100%;height:100%;object-fit:cover;display:block}
.nx-deck.nx-playing .nx-cov img{animation:nxPulseA 3s infinite ease-in-out}
@keyframes nxPulseA{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.nx-deck .nx-ctl{flex:1;min-width:0}
.nx-trk{font-family:${D};font-size:17px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nx-trk small{display:block;font-family:${T};font-size:9.5px;letter-spacing:2px;text-transform:uppercase;color:var(--nx-mut);margin-top:2px}
.nx-btns{display:flex;align-items:center;gap:10px;margin-top:10px}
.nx-pbtn{width:38px;height:38px;border-radius:50%;border:1px solid var(--nx-line);background:${p.panel};color:var(--nx-teal);font-size:14px;cursor:pointer;transition:.25s;display:grid;place-items:center}
.nx-pbtn:hover{box-shadow:0 0 16px ${p.gT}}
.nx-pbtn.nx-on{background:linear-gradient(135deg,var(--nx-teal),var(--nx-violet));color:${p.bg};box-shadow:0 0 22px ${p.gT}}
.nx-prog{flex:1;height:6px;background:rgba(0,0,0,.5);border-radius:3px;overflow:hidden;border:1px solid var(--nx-line);cursor:pointer}
.nx-prog i{display:block;height:100%;width:0%;background:linear-gradient(90deg,var(--nx-teal),var(--nx-violet));box-shadow:0 0 8px ${p.gV};transition:width .15s linear;pointer-events:none}
.nx-time{font-size:10px;color:var(--nx-mut);font-variant-numeric:tabular-nums;margin-top:8px}
.nx-foot{position:relative;z-index:1;text-align:center;padding:22px 24px 0;font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:var(--nx-mut)}
.nx-foot b{color:var(--nx-amber)}
.nx-foot .nx-dot{color:var(--nx-teal);margin:0 6px}
.nx-lb{position:fixed;inset:0;z-index:9999;background:rgba(4,6,14,.93);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .35s ease;cursor:zoom-out}
.nx-lb.nx-show{opacity:1;pointer-events:auto}
.nx-lb img{max-width:92vw;max-height:84vh;border-radius:14px;border:1px solid ${p.teal};box-shadow:0 0 60px ${p.gV},0 30px 80px rgba(0,0,0,.8);transform:scale(.92);transition:transform .35s ease}
.nx-lb.nx-show img{transform:scale(1)}
.nx-lb-close{position:absolute;top:18px;right:22px;width:44px;height:44px;border-radius:50%;border:1px solid ${p.teal};background:rgba(8,11,22,.72);color:var(--nx-teal);font-size:17px;cursor:pointer;display:grid;place-items:center;transition:.25s;z-index:2}
.nx-lb-close:hover{background:var(--nx-violet);color:#fff}
.nx-lb-cap{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-family:${D};font-style:italic;font-size:18px;color:var(--nx-teal)}
.nx-rv{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}
.nx-rv.nx-in{opacity:1;transform:none}
</style>

<div class="nx-card" id="nxDesc">
  <div class="nx-aurora"><i></i><i></i><i></i></div>

  <div class="nx-hero">
    <div class="nx-kicker">${esc(d.worldTag)} · character card</div>
    <h1 class="nx-title">${esc(d.cardTitle)}</h1>
    <div class="nx-sub">${esc(d.hookLine)}</div>
    <div class="nx-by">Created by <b>${esc(d.creator)}</b></div>
  </div>
${tagsHtml}
${coverHtml}
  <div class="nx-sec nx-rv">
    <h3>The Story</h3>
    <p>${esc(d.descP1)}</p>
    <p>${esc(d.descP2)}</p>
    <p class="nx-hand">${esc(d.atmosphere)}</p>
  </div>

  <div class="nx-dossier nx-rv">
    <div class="nx-acc nx-on">
      <button class="nx-acc-head" type="button"><span class="nx-ico">✦</span>Appearance<span class="nx-chev">▸</span></button>
      <div class="nx-acc-body"><div class="nx-acc-inner">
        <div class="nx-chips">${para(d.age)?`<span>${esc(d.age)}</span>`:''}${para(d.role)?`<span>${esc(d.role)}</span>`:''}${para(d.occupation)?`<span>${esc(d.occupation)}</span>`:''}</div>
        <p>${esc(d.appearance)}</p>
      </div></div>
    </div>
    <div class="nx-acc">
      <button class="nx-acc-head" type="button"><span class="nx-ico">❖</span>Personality<span class="nx-chev">▸</span></button>
      <div class="nx-acc-body"><div class="nx-acc-inner">
        <p>${esc(d.personality)}</p>
        ${para(d.quote)?`<div class="nx-quote">${esc(d.quote)}</div>`:''}
      </div></div>
    </div>
    <div class="nx-acc">
      <button class="nx-acc-head" type="button"><span class="nx-ico">✧</span>Backstory<span class="nx-chev">▸</span></button>
      <div class="nx-acc-body"><div class="nx-acc-inner">
        <p>${esc(d.backstory)}</p>
      </div></div>
    </div>
    <div class="nx-acc">
      <button class="nx-acc-head" type="button"><span class="nx-ico">♡</span>Bond with {{user}}<span class="nx-chev">▸</span></button>
      <div class="nx-acc-body"><div class="nx-acc-inner">
        <p>${esc(d.connection)}</p>
      </div></div>
    </div>
    ${char2Acc}
    ${mechAcc}
  </div>
${polarHtml}
${deckHtml}
  <div class="nx-foot nx-rv">Created by <b>${esc(d.creator)}</b><span class="nx-dot">✦</span>All characters are 18+</div>
</div>

<div class="nx-lb" id="nxLb">
  <button class="nx-lb-close" id="nxLbClose" type="button">✕</button>
  <img id="nxLbImg" src="" alt="">
  <div class="nx-lb-cap" id="nxLbCap"></div>
</div>

<script>
(function(){
  var root=document.getElementById('nxDesc');if(!root)return;
  root.querySelectorAll('.nx-acc-head').forEach(function(h){
    h.addEventListener('click',function(){
      var item=h.parentElement,wasOpen=item.classList.contains('nx-on');
      root.querySelectorAll('.nx-acc.nx-on').forEach(function(o){o.classList.remove('nx-on');});
      if(!wasOpen)item.classList.add('nx-on');
    });
  });
  var rv=root.querySelectorAll('.nx-rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('nx-in');io.unobserve(e.target);}});},{threshold:.1});
    rv.forEach(function(el){io.observe(el);});
  }else{rv.forEach(function(el){el.classList.add('nx-in');});}
  var deck=document.getElementById('nxDeck'),aud=document.getElementById('nxAudio');
  if(deck&&aud){
    var playBtn=document.getElementById('nxPlay'),prog=document.getElementById('nxProg'),
        bar=document.getElementById('nxBar'),timeEl=document.getElementById('nxTime');
    function fmt(s){if(!isFinite(s))return"0:00";s=Math.floor(s);return Math.floor(s/60)+":"+String(s%60).padStart(2,'0');}
    playBtn.addEventListener('click',function(){if(aud.paused){aud.play();}else{aud.pause();}});
    prog.addEventListener('click',function(e){
      var r=prog.getBoundingClientRect();
      if(aud.duration)aud.currentTime=((e.clientX-r.left)/r.width)*aud.duration;
    });
    aud.addEventListener('play',function(){deck.classList.add('nx-playing');playBtn.textContent='❚❚';playBtn.classList.add('nx-on');});
    aud.addEventListener('pause',function(){deck.classList.remove('nx-playing');playBtn.textContent='▶';playBtn.classList.remove('nx-on');});
    aud.addEventListener('loadedmetadata',function(){timeEl.textContent='0:00 / '+fmt(aud.duration);});
    aud.addEventListener('timeupdate',function(){if(aud.duration){bar.style.width=(aud.currentTime/aud.duration*100)+'%';timeEl.textContent=fmt(aud.currentTime)+' / '+fmt(aud.duration);}});
  }
  var ov=document.getElementById('nxLb'),li=document.getElementById('nxLbImg'),lc=document.getElementById('nxLbCap');
  root.querySelectorAll('.nx-cover, .nx-polar').forEach(function(el){
    el.addEventListener('click',function(){
      var img=el.querySelector('img');if(!img)return;
      li.src=img.src;lc.textContent=el.getAttribute('data-cap')||'';
      ov.classList.add('nx-show');
    });
  });
  function closeLb(){ov.classList.remove('nx-show');}
  document.getElementById('nxLbClose').addEventListener('click',function(e){e.stopPropagation();closeLb();});
  ov.addEventListener('click',function(e){if(e.target===ov)closeLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLb();});
})();
</script>
</html-box>`;
}

/* ============================================================
   HTML БЛОК B — ОТКРЫТИЕ СЦЕНЫ
   ============================================================ */
function buildBlockB(d, design){
  const p = design.palette, f = design.fonts, r = design.radius, D = f.disp, T = f.text;
  const motif = motifCSS(design.motif, '.nx-open ', 'B', p, '.nx-open');

  const chips = [d.timeSc, d.placeSc, d.weatherSc].filter(para);
  const chipsHtml = chips.length ? `
  <div class="nx-scene">
${chips.map(c=>`    <span class="nx-chip">${esc(c)}</span>`).join('\n')}
  </div>` : '';

  const thinkHtml = para(d.mono) ? `\n  <div class="nx-think nx-rv2">${esc(d.mono)}</div>` : '';
  const frameHtml = para(d.photo3) ? `
  <figure class="nx-frame nx-rv2">
    <img src="${d.photo3}" alt="">
    <figcaption>${esc(d.photo3cap)}</figcaption>
  </figure>` : '';
  const flashHtml = (para(d.flashLabel) || para(d.flashText)) ? `
  <div class="nx-flash nx-rv2"><b>${esc(d.flashLabel)}</b>${esc(d.flashText)}</div>` : '';
  const altHtml = (para(d.secondSpeaker) && para(d.dlg2)) ? `
  <div class="nx-say nx-alt nx-rv2" data-name="${esc(d.secondSpeaker)}">${esc(d.dlg2)}</div>` : '';
  const narr2Html = para(d.narr2) ? `\n  <div class="nx-narr nx-rv2">${esc(d.narr2)}</div>` : '';
  const dlg3Html = para(d.dlg3) ? `\n  <div class="nx-say nx-rv2" data-name="${esc(d.charName)}">${esc(d.dlg3)}</div>` : '';

  return `<html-box>
<link href="https://fonts.googleapis.com/css2?${f.url}&display=swap" rel="stylesheet">
<style>
.nx-open{--nx-bg:${p.bg};--nx-panel:${p.panel};--nx-line:${p.line};--nx-teal:${p.teal};--nx-violet:${p.violet};--nx-amber:${p.amber};--nx-txt:${p.txt};--nx-mut:${p.mut};position:relative;max-width:680px;margin:0 auto;padding:0 0 24px;background:radial-gradient(900px 420px at 12% -6%,${p.gT},transparent 60%),radial-gradient(800px 420px at 92% 8%,${p.gV},transparent 55%),radial-gradient(700px 500px at 50% 112%,${p.gA},transparent 60%),var(--nx-bg);border:1px solid var(--nx-line);border-radius:${r.card};overflow:hidden;font-family:${T};color:var(--nx-txt);line-height:1.7;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.nx-open *{box-sizing:border-box;margin:0;padding:0}
${motif}
.nx-ohero{position:relative;z-index:1;text-align:center;padding:34px 26px 14px}
.nx-okicker{font-size:10.5px;letter-spacing:3px;text-transform:uppercase;color:var(--nx-violet);margin-bottom:10px}
.nx-otitle{font-family:${D};font-weight:700;font-size:clamp(22px,5vw,30px);line-height:1.15;color:#fff;text-shadow:0 0 24px ${p.gT}}
.nx-osub{margin-top:8px;font-family:${D};font-style:italic;font-size:15px;color:${p.mut}}
.nx-oby{margin-top:10px;font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:var(--nx-mut)}
.nx-oby b{color:var(--nx-amber)}
.nx-scene{position:relative;z-index:1;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:4px 22px 18px}
.nx-chip{font-size:10.5px;letter-spacing:1.6px;text-transform:uppercase;color:var(--nx-teal);background:${p.gT};border:1px solid ${p.teal};padding:5px 12px;border-radius:${r.chip}}
.nx-narr{position:relative;z-index:1;margin:0 22px 14px;padding:12px 16px;border-left:2px solid var(--nx-teal);border-image:linear-gradient(180deg,var(--nx-teal),var(--nx-violet)) 1;background:${p.panel};border-radius:0 12px 12px 0;font-size:14.5px;color:${p.txt};opacity:.93;text-align:justify}
.nx-narr em{color:var(--nx-mut)}
.nx-say{position:relative;z-index:1;margin:0 22px 14px;padding:14px 16px 12px;background:linear-gradient(160deg,${p.gV},${p.gT});border:1px solid ${p.violet};border-radius:4px ${r.acc} ${r.acc} ${r.acc};font-family:${D};font-size:16px;line-height:1.6;color:${p.txt};box-shadow:0 8px 24px rgba(0,0,0,.35)}
.nx-say::before{content:attr(data-name);display:block;font-family:${T};font-weight:800;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--nx-violet);margin-bottom:6px}
.nx-say.nx-alt{background:linear-gradient(160deg,${p.gA},transparent);border-color:${p.amber};border-radius:${r.acc} 4px ${r.acc} ${r.acc};margin-left:44px}
.nx-say.nx-alt::before{color:var(--nx-amber)}
.nx-think{position:relative;z-index:1;margin:0 46px 14px;text-align:center;font-style:italic;font-size:13.5px;color:var(--nx-mut)}
.nx-think::before,.nx-think::after{content:"—";color:${p.line};margin:0 8px}
.nx-flash{position:relative;z-index:1;margin:0 22px 14px;padding:14px 16px;border:1px dashed ${p.amber};border-radius:${r.acc};background:${p.gA};font-size:13.5px;color:${p.txt};opacity:.95}
.nx-flash b{display:block;font-family:${T};font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:var(--nx-amber);margin-bottom:6px}
.nx-frame{position:relative;z-index:1;margin:18px 22px;text-align:center}
.nx-frame img{max-width:100%;border-radius:${r.fig};border:1px solid var(--nx-line);box-shadow:0 12px 32px rgba(0,0,0,.5);cursor:zoom-in;display:block}
.nx-frame figcaption{margin-top:8px;font-size:10.5px;letter-spacing:1.8px;text-transform:uppercase;color:var(--nx-mut)}
.nx-div{position:relative;z-index:1;height:1px;background:linear-gradient(90deg,transparent,var(--nx-violet),transparent);margin:26px 40px;opacity:.55}
.nx-end{position:relative;z-index:1;margin:6px 26px 4px;text-align:center;font-family:${D};font-style:italic;font-size:16px;color:var(--nx-teal)}
.nx-ofoot{position:relative;z-index:1;text-align:center;padding:20px 24px 0;font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:var(--nx-mut)}
.nx-ofoot b{color:var(--nx-amber)}
.nx-lb2{position:fixed;inset:0;z-index:9999;background:rgba(4,6,14,.93);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .35s ease;cursor:zoom-out}
.nx-lb2.nx-show{opacity:1;pointer-events:auto}
.nx-lb2 img{max-width:92vw;max-height:84vh;border-radius:14px;border:1px solid ${p.violet};box-shadow:0 0 60px ${p.gV},0 30px 80px rgba(0,0,0,.8);transform:scale(.92);transition:transform .35s ease}
.nx-lb2.nx-show img{transform:scale(1)}
.nx-lb2-close{position:absolute;top:18px;right:22px;width:44px;height:44px;border-radius:50%;border:1px solid ${p.violet};background:rgba(8,11,22,.72);color:var(--nx-violet);font-size:17px;cursor:pointer;display:grid;place-items:center;transition:.25s;z-index:2}
.nx-lb2-close:hover{background:var(--nx-teal);color:${p.bg}}
.nx-lb2-cap{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-family:${D};font-style:italic;font-size:18px;color:var(--nx-violet)}
.nx-rv2{opacity:0;transform:translateY(18px);transition:opacity .7s ease,transform .7s ease}
.nx-rv2.nx-in{opacity:1;transform:none}
</style>

<div class="nx-open" id="nxOpen">
  <div class="nx-aurora"><i></i><i></i><i></i></div>

  <div class="nx-ohero">
    <div class="nx-okicker">opening scene</div>
    <h1 class="nx-otitle">${esc(d.cardTitle)}</h1>
    <div class="nx-osub">${esc(d.sceneSub || d.hookLine)}</div>
    <div class="nx-oby">Created by <b>${esc(d.creator)}</b></div>
  </div>
${chipsHtml}
  <div class="nx-narr nx-rv2">${esc(d.narr1)}</div>

  <div class="nx-say nx-rv2" data-name="${esc(d.charName)}">${esc(d.dlg1)}</div>
${narr2Html}
${thinkHtml}
${frameHtml}
${flashHtml}
${altHtml}
${dlg3Html}
  <div class="nx-div"></div>

  <div class="nx-end nx-rv2">${esc(d.finalHook)}</div>

  <div class="nx-ofoot">Created by <b>${esc(d.creator)}</b></div>
</div>

<div class="nx-lb2" id="nxLb2">
  <button class="nx-lb2-close" id="nxLb2Close" type="button">✕</button>
  <img id="nxLb2Img" src="" alt="">
  <div class="nx-lb2-cap" id="nxLb2Cap"></div>
</div>

<script>
(function(){
  var root=document.getElementById('nxOpen');if(!root)return;
  var rv=root.querySelectorAll('.nx-rv2');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('nx-in');io.unobserve(e.target);}});},{threshold:.1});
    rv.forEach(function(el){io.observe(el);});
  }else{rv.forEach(function(el){el.classList.add('nx-in');});}
  var ov=document.getElementById('nxLb2'),li=document.getElementById('nxLb2Img'),lc=document.getElementById('nxLb2Cap');
  root.querySelectorAll('.nx-frame').forEach(function(el){
    el.addEventListener('click',function(){
      var img=el.querySelector('img');if(!img)return;
      var cap=el.querySelector('figcaption');
      li.src=img.src;lc.textContent=cap?cap.textContent:'';
      ov.classList.add('nx-show');
    });
  });
  function closeLb(){ov.classList.remove('nx-show');}
  document.getElementById('nxLb2Close').addEventListener('click',function(e){e.stopPropagation();closeLb();});
  ov.addEventListener('click',function(e){if(e.target===ov)closeLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLb();});
})();
</script>
</html-box>`;
}

/* ============================================================
   ТЕКСТОВАЯ КАРТОЧКА (Блоки 0–8)
   ============================================================ */
function getEnabledTrackers(d){
  const out = {};
  for(const t of TRACKER_DEFS){
    const key = `tracker_${t.id}_enabled`;
    if(d[key] === true || d[key] === 'on' || d[key] === 'true') out[t.id] = t;
  }
  return out;
}

function buildTrackerBlock(d){
  const enabled = getEnabledTrackers(d);
  const ids = Object.keys(enabled);
  if(!ids.length) return '';
  const lines = [];
  for(const id of ids){
    const t = enabled[id];
    const rules = para(d[`tracker_${id}_rules`]);
    lines.push(`${t.icon} ${t.name}${rules?'\nRules: '+rules:''}`);
  }
  return lines.join('\n\n');
}

function buildCardText(d){
  const B = [];
  const line = '='.repeat(46);

  B.push({t:'Блок 0 · Теги', x:(d.tags||[]).map(t=>'#'+t.replace(/\s+/g,'_')).join(' ') || '—'});
  B.push({t:'Блок 1 · Название', x:para(d.cardTitle) || '—'});
  B.push({t:'Блок 2 · Описание', x:[para(d.descP1), para(d.descP2), para(d.atmosphere)&&('*'+d.atmosphere.trim()+'*')].filter(Boolean).join('\n\n') || '—'});

  const scene = [];
  const meta = [d.timeSc, d.dateSc, d.placeSc, d.weatherSc].filter(para).join(' | ');
  if(meta) scene.push('*[' + meta + ']*');
  if(para(d.narr1)) scene.push(d.narr1.trim());
  if(para(d.dlg1)) scene.push('*' + d.charName + ':* "' + d.dlg1.trim() + '"');
  if(para(d.narr2)) scene.push(d.narr2.trim());
  if(para(d.mono)) scene.push('*...' + d.mono.trim() + '...*');
  if(para(d.flashText)) scene.push('~(' + (d.flashLabel ? d.flashLabel + '. ' : '') + d.flashText.trim() + ')~');
  if(para(d.dlg2) && para(d.secondSpeaker)) scene.push('*' + d.secondSpeaker + ':* "' + d.dlg2.trim() + '"');
  if(para(d.dlg3)) scene.push('*' + d.charName + ':* "' + d.dlg3.trim() + '"');
  if(para(d.finalHook)) scene.push(d.finalHook.trim());
  B.push({t:'Блок 3 · Открытие сцены', x:scene.join('\n\n') || '—'});

  const lore = [];
  const add = (k,v)=>{ if(para(v)) lore.push(k + ': ' + v.trim()); };
  add('Name', d.charName); add('Age', d.age); add('Role', d.role); add('World', d.worldTag);
  if(para(d.appearance)) lore.push('Appearance:\n' + d.appearance.trim());
  if(para(d.personality)) lore.push('Character:\n' + d.personality.trim());
  const speech = [];
  if(para(d.speechManner)) speech.push('Manner: ' + d.speechManner.trim());
  if(para(d.speechBehavior)) speech.push('Behavior:\n' + d.speechBehavior.trim());
  if(para(d.thinkingErrors)) speech.push('Thinking errors:\n' + d.thinkingErrors.trim());
  if(speech.length) lore.push('Speech style:\n' + speech.join('\n'));
  add('History', d.backstory); add('NSFW', d.nsfwText); add('Connection with {{user}}', d.connection);
  const mot = [];
  add2(mot,'Goal', d.goal); add2(mot,'Conflict', d.conflict); add2(mot,'Attitude to {{user}}', d.relationToUser);
  if(mot.length) lore.push('Motivation:\n' + mot.join('\n'));
  const hab = [];
  add2(hab,'Likes', d.likes); add2(hab,'Dislikes', d.dislikes);
  if(para(d.catchphrases)) hab.push('Catchphrases: ' + d.catchphrases.trim());
  add2(hab,'Filler words', d.phrases);
  if(hab.length) lore.push('Habits:\n' + hab.join('\n'));
  B.push({t:'Блок 4 · Фон (полный профиль)', x:lore.join('\n\n') || '—'});

  // Второй персонаж
  if(para(d.char2Name)){
    const c2 = [];
    add('Name', d.char2Name); add('Age', d.char2Age); add('Role', d.char2Role);
    if(para(d.char2Appearance)) c2.push('Appearance:\n' + d.char2Appearance.trim());
    if(para(d.char2Personality)) c2.push('Character:\n' + d.char2Personality.trim());
    if(para(d.char2Backstory)) c2.push('History:\n' + d.char2Backstory.trim());
    if(para(d.char2Connection)) c2.push('Connection with {{user}}:\n' + d.char2Connection.trim());
    if(para(d.char2SpeechManner)) c2.push('Speech manner:\n' + d.char2SpeechManner.trim());
    add('Goal', d.char2Goal); add('Conflict', d.char2Conflict);
    if(para(d.char2RelationToUser)) c2.push('Attitude to {{user}}:\n' + d.char2RelationToUser.trim());
    B.push({t:'Блок 4 · Второй персонаж', x:c2.join('\n\n')});
  }

  // Медиа в карточке
  const media = [];
  if(para(d.coverUrl)) media.push(`![${esc(d.coverCap || 'Cover')}](${d.coverUrl})`);
  if(para(d.photo1)) media.push(`![${esc(d.photo1cap || 'Photo 1')}](${d.photo1})`);
  if(para(d.photo2)) media.push(`![${esc(d.photo2cap || 'Photo 2')}](${d.photo2})`);
  if(para(d.photo3)) media.push(`![${esc(d.photo3cap || 'Scene frame')}](${d.photo3})`);
  if(media.length) B.push({t:'Блок 4 · Медиа', x:media.join('\n')});

  // Механика и трекеры
  const mech = [];
  if(para(d.mechText)) mech.push(d.mechText.trim());
  const trk = buildTrackerBlock(d);
  if(trk) mech.push(trk);
  if(mech.length) B.push({t:'Блок 5 · Механика и трекеры', x:mech.join('\n\n')});

  if(para(d.dlgExamples)) B.push({t:'Блок 6 · Примеры диалогов', x:d.dlgExamples.trim()});

  const rules = [
    'Длина: длинные, подробные. Детализация: высокая.',
    'Формат реплик: *Имя {{char}}:* "диалог." *действие*',
    'Повествование в *...*, диалоги в "...". Примеры и сцена — в консольном окне ~() чтобы звёздочки не уходили в курсив.',
    'Хронология в начале каждого сообщения: *[чч:мм | дд месяц гггг, день недели | Место | Погода, температура]*',
    para(d.extraRules) && 'Дополнительно: ' + d.extraRules.trim()
  ].filter(Boolean);
  B.push({t:'Блок 7 · Настройка ответа', x:rules.join('\n')});

  if(para(d.authorNotes)) B.push({t:'Блок 8 · Примечание автора', x:d.authorNotes.trim()});

  return B.map(b => line + '\n' + b.t.toUpperCase() + '\n' + line + '\n' + b.x).join('\n\n');
}
function add2(arr,k,v){ if(para(v)) arr.push(k + ': ' + v.trim()); }

/* ============================================================
   ПРОМПТЫ ДЛЯ ИЗОБРАЖЕНИЙ
   ============================================================ */
const STYLE_DEFAULT = 'Premium semi-realistic anime game artwork, mature adult character, beautiful natural anatomy, expressive face, detailed eyes, detailed hair with individual strands, soft smooth skin rendering, clean linework, polished digital painting, cinematic lighting, soft shadows, rich natural colors, subtle depth of field, high detail, sharp focus, clear readable silhouette';
const NEG_DEFAULT = 'lowres, bad anatomy, bad hands, missing fingers, extra fingers, mutated hands, poorly drawn face, bad proportions, gross proportions, crossed eyes, ugly, blurry, watermark, signature, text, logo, cropped, worst quality, jpeg artifacts, duplicate, morbid, out of frame, extra limbs, deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4, easynegative, ng_deepnegative, child, loli, underage, teen, minor, aged down';

function buildPrompts(d){
  const sig = para(d.genderAge) || 'adult character (fix the visual signature in the form)';
  const outfit = para(d.outfitDesc);
  const style = para(d.styleAnchor) || STYLE_DEFAULT;
  const neg = (para(d.negBase) || NEG_DEFAULT);
  const name = para(d.charName) || 'Character';
  const P = [];

  const CHAR = `[CHARACTER]\n${sig}`;
  const OUT = outfit ? `\n[OUTFIT]\nWearing ${outfit}` : '';
  const blocks = (...b) => b.filter(Boolean).join('\n');
  const pic = (n, title, ru, content, negAdd) => {
    const pos = content.replace(/\n+/g,' ').trim() + ', ' + style + '.';
    const negFull = neg + (negAdd ? ', ' + negAdd : '');
    return `\n🖼 #${n} — ${title} (${ru})\n\n${content}\n\nPositive: <${pos}>\nNegative: <${negFull}>`;
  };

  /* Режим 1: пак на персонажа */
  P.push(pic(1, `${name} — portrait`, 'визитка, нейтральное выражение',
    blocks(CHAR, OUT, `\n[EXPRESSION & POSE]\ncalm neutral expression, direct gaze at viewer, head slightly tilted, shoulders relaxed\n[COMPOSITION]\nVertical portrait, close-up, face clearly visible, natural perspective, softly blurred background related to character`)));
  P.push(pic(2, `${name} — signature gesture`, 'характерный жест из карточки',
    blocks(CHAR, OUT, `\n[EXPRESSION & POSE]\nfocused quiet expression, signature habitual gesture mid-motion, eyes lowered then glancing up\n[COMPOSITION]\nVertical portrait, medium shot, three-quarter angle, hands in frame, background related to character`)));
  P.push(pic(3, `${name} — cold anger`, 'эмоциональный диапазон: холод',
    blocks(CHAR, OUT, `\n[EXPRESSION & POSE]\ncold restrained anger, narrowed eyes, jaw set, stillness of someone about to act\n[COMPOSITION]\nVertical portrait, medium shot, low angle, dramatic rim lighting`)));
  P.push(pic(4, `${name} — unguarded softness`, 'эмоциональный диапазон: нежность',
    blocks(CHAR, OUT, `\n[EXPRESSION & POSE]\nvulnerable unguarded softness, slight sincere smile, eyes warm and open, relaxed posture\n[COMPOSITION]\nVertical portrait, medium shot, warm intimate lighting, shallow depth of field`)));
  P.push(pic(5, `${name} — in their world`, 'атмосферная сцена в локации',
    blocks(CHAR, OUT, `\n[LOCATION]\n${para(d.placeSc) || 'a place tied to the character'}, atmospheric light, dust motes in light shafts, lived-in details\n[EXPRESSION & POSE]\nnatural candid pose mid-routine, unaware of viewer\n[COMPOSITION]\nVertical, wide environmental shot, character small in frame, storytelling composition`)));
  if(outfit){
    P.push(pic(6, `${name} — outfit detail`, 'чтение образа',
      blocks(CHAR, `\n[OUTFIT]\nWearing ${outfit}\n[EXPRESSION & POSE]\nstanding naturally, clothing details clearly readable, fabric fit visible\n[COMPOSITION]\nVertical portrait, full-body or three-quarter shot, clean neutral background`)));
  }

  /* Режим 2: кадры открытия 1:1 по тексту */
  let n = P.length;
  if(para(d.narr1)){
    n++;
    P.push(pic(n, 'Scene — establishing', 'обстановка: ' + (para(d.placeSc)||'место сцены'),
      blocks(`[LOCATION]\n${para(d.placeSc) || 'scene location'}, ${para(d.timeSc)||''} ${para(d.weatherSc)||''}, key objects and atmosphere straight from the opening narration: ${d.narr1.trim().slice(0,220)}`, `\n[COMPOSITION]\nVertical, wide establishing shot, empty or with distant figure, cinematic lighting`)));
  }
  if(para(d.dlg1)){
    n++;
    P.push(pic(n, `Scene — ${name} speaks`, 'появление + ключевая реплика',
      blocks(CHAR, OUT, `\n[SCENE]\n${name} mid-scene from the opening: ${d.dlg1.trim().slice(0,200)}, location: ${para(d.placeSc)||'as per card'}, dramatic light matching the moment`, `\n[COMPOSITION]\nVertical, medium shot, character clearly visible, background softly readable`)));
  }
  if(para(d.dlg3)){
    n++;
    P.push(pic(n, 'Scene — final beat', 'финальный акцент сцены',
      blocks(CHAR, OUT, `\n[EXPRESSION & POSE]\ntension of the closing beat: ${d.finalHook ? d.finalHook.trim().slice(0,200) : d.dlg3.trim().slice(0,200)}\n[COMPOSITION]\nVertical, medium shot, shallow depth of field, light focused on face`)));
  }

  /* Режим 3: локации */
  const locs = para(d.locationsList) ? d.locationsList.split('\n').map(s=>s.trim()).filter(Boolean) : [];
  locs.forEach(loc => {
    n++;
    P.push(pic(n, `Location — ${loc}`, 'режим 3: реестр локаций',
      blocks(`[LOCATION]\n${loc}, architecture and materials fitting the world (${para(d.worldTag)||'as per card'}), 3-5 key objects creating identity, atmosphere and light matching the scene mood, no people`, `\n[COMPOSITION]\nVertical, wide shot, environmental, natural perspective, high detail`)));
  });

  /* Режим 4: NSFW */
  if(document.getElementById('nsfwPrompts').checked){
    n++;
    P.push(pic(n, `${name} — intimate 1`, 'режим 4: чувственный портрет',
      blocks(CHAR, OUT, `\n[EXPRESSION & POSE]\nsensual intimate scene, flushed skin, parted lips, aroused expression, body language open and inviting\n[COMPOSITION]\nVertical, medium shot, intimate warm lighting, tasteful explicit framing`), ' extra objects, cluttered frame, bad anatomy, deformed genitals, fused limbs, censored'));
    n++;
    P.push(pic(n, `${name} — intimate 2`, 'режим 4: продолжение прогрессии',
      blocks(CHAR, `\n[EXPRESSION & POSE]\nexplicit intimate moment consistent with the character's nsfw profile: ${para(d.nsfwText) ? d.nsfwText.trim().slice(0,180) : 'as per card'}, emotional eye contact, skin sheen\n[COMPOSITION]\nVertical, close-up to medium, intimate lighting, explicit but technically precise`), ' extra objects, cluttered frame, bad anatomy, deformed genitals, fused limbs, censored'));
  }

  /* Режим 5: предметы */
  const items = para(d.itemsList) ? d.itemsList.split('\n').map(s=>s.trim()).filter(Boolean) : [];
  items.forEach(it => {
    n++;
    P.push(pic(n, `Item — ${it}`, 'режим 5: артефакт',
      blocks(`[ITEM]\n${it}, material and condition matching the world (${para(d.worldTag)||'as per card'}), key details, signs of use, scale relative to a hand, neutral contextual background`, `\n[COMPOSITION]\nVertical, close-up, object in focus, soft contextual background`)));
  });

  return 'FIXED VISUAL SIGNATURE (repeat verbatim in every prompt):\n' + sig +
    '\n\n' + P.join('\n').trim();
}

/* ============================================================
   МАКЕТЫ
   ============================================================ */
function getTemplates(){
  try{ return JSON.parse(localStorage.getItem('cardforge-templates') || '{}'); }
  catch(e){ return {}; }
}
function saveTemplates(tpls){ localStorage.setItem('cardforge-templates', JSON.stringify(tpls)); }
function populateTemplateSelects(){
  const tpls = getTemplates();
  const sA = $('#templateA'), sB = $('#templateB');
  const oldA = sA.value, oldB = sB.value;
  sA.innerHTML = '<option value="__default">Default A (встроенный)</option>';
  sB.innerHTML = '<option value="__default">Default B (встроенный)</option>';
  Object.keys(tpls).forEach(name => {
    sA.add(new Option(name, name));
    sB.add(new Option(name, name));
  });
  if([...sA.options].some(o=>o.value===oldA)) sA.value = oldA;
  if([...sB.options].some(o=>o.value===oldB)) sB.value = oldB;
}

/* ============================================================
   СБОР ДАННЫХ + ВАЛИДАЦИЯ
   ============================================================ */
function collectData(){
  const d = {};
  $$('[data-f]').forEach(el => d[el.dataset.f] = el.value);
  d.tags = $$('#tagCloud input:checked').map(i => i.value).slice(0, 10);
  d.jsonFiles = {};
  $$('[data-json]').forEach(t => { if(t.value.trim()) d.jsonFiles[t.dataset.json] = t.value; });
  // трекеры
  $$('.tracker').forEach(tr => {
    const id = tr.dataset.tracker;
    const cb = tr.querySelector('input[type=checkbox]');
    d[`tracker_${id}_enabled`] = cb ? cb.checked : false;
  });
  return d;
}

function validate(){
  const required = ['creator','cardTitle','charName','descP1'];
  let ok = true;
  required.forEach(key => {
    const el = $(`[data-f="${key}"]`);
    const fld = el?.closest('.fld');
    if(!para(el?.value)){ fld?.classList.add('missing'); ok = false; }
    else { fld?.classList.remove('missing'); }
  });
  return ok;
}

/* ============================================================
   РЕНДЕР
   ============================================================ */
let currentTab = 'card';
let previewOn = false;
let lastOutputs = {};

function renderConcept(){
  const p = design.palette;
  $('#cMood').innerHTML = '«' + design.mood[0] + '»<em>' + design.mood[1] + '</em>';
  $('#cPalette').textContent = p.name;
  $('#cSwatches').innerHTML = [p.bg, p.teal, p.violet, p.amber, p.txt, p.mut]
    .map(c => `<span class="sw" style="background:${c}" title="${c}"></span>`).join('');
  $('#cFonts').textContent = design.fonts.name;
  $('#cMotif').textContent = MOTIF_NAMES[design.motif];
  $('#cRadius').textContent = design.radius.name;
  const card = $('#conceptCard');
  card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
}

function blockHtml(title, text, extra){
  return `<div class="out-block"><div class="ob-head"><b>${esc(title)}</b>${extra||''}<button class="mini" data-copy>копировать</button></div><pre class="code">${esc(text)}</pre></div>`;
}

function render(){
  const d = collectData();
  const body = $('#outBody');
  const status = $('#outStatus');
  lastOutputs = {};

  if(currentTab === 'card'){
    const text = buildCardText(d);
    lastOutputs.card = text;
    const re = /(БЛОК \d[^\n]*)\n={46}\n([\s\S]*?)(?=\n\nБЛОК \d|\s*$)/g;
    const parts = []; let m;
    while((m = re.exec(text)) !== null) parts.push({t:m[1], x:m[2].trim()});
    body.innerHTML = parts.length
      ? parts.map(p => blockHtml(p.t, p.x)).join('')
      : '<div class="empty"><b>Карточка пустая</b>Заполни хотя бы Основное и Персонажа</div>';
    status.textContent = parts.length + ' блоков · ' + text.length + ' символов';
  }

  if(currentTab === 'htmlA' || currentTab === 'htmlB'){
    const key = currentTab;
    const tplSel = key === 'htmlA' ? $('#templateA') : $('#templateB');
    const tplName = tplSel.value;
    let code;
    if(tplName === '__default'){
      code = key === 'htmlA' ? buildBlockA(d, design) : buildBlockB(d, design);
    } else {
      const tpls = getTemplates();
      const tpl = tpls[tplName];
      if(!tpl) code = '<!-- Макет не найден -->';
      else {
        const data = makeTemplateData(d, key === 'htmlA' ? 'A' : 'B');
        code = renderTemplate(tpl.html, data);
      }
    }
    lastOutputs[key] = code;
    let html = blockHtml(key === 'htmlA' ? 'Блок A — Описание' : 'Блок B — Открытие', code);
    if(previewOn){
      html = `<div class="pv-wrap"><div class="pv-head">Предпросмотр<button class="mini" id="pvRefresh" style="margin-left:auto">обновить</button></div><iframe class="pv-frame" id="pvFrame"></iframe></div>` + html;
    }
    body.innerHTML = html;
    if(previewOn) setTimeout(() => { const f = $('#pvFrame'); if(f) f.srcdoc = code; }, 30);
    status.textContent = code.length + ' символов · ' + design.palette.name + ' · ' + MOTIF_NAMES[design.motif];
  }

  if(currentTab === 'json'){
    const files = Object.entries(d.jsonFiles);
    if(!files.length){
      body.innerHTML = '<div class="empty"><b>Нет файлов</b>Вставь JSON в раздел «JSON-файлы подгрузочной памяти»</div>';
      status.textContent = '0 файлов';
    } else {
      let okCount = 0;
      body.innerHTML = files.map(([name, content]) => {
        let pretty = content, err = '';
        try {
          const parsed = JSON.parse(content);
          pretty = JSON.stringify(parsed, null, 2);
          if(!parsed.entries || !Array.isArray(parsed.entries)) err = 'нет массива entries';
          else okCount++;
          lastOutputs['json:'+name] = pretty;
        } catch(e){ err = 'ошибка JSON: ' + e.message; }
        return `<div class="out-block"><div class="ob-head"><b>📄 ${esc(name)}</b>${err?`<span class="err">${esc(err)}</span>`:`<span class="out-status">✓ валиден</span>`}<button class="mini" data-copy>копировать</button></div><pre class="code sm">${esc(pretty)}</pre></div>`;
      }).join('');
      status.textContent = okCount + ' / ' + files.length + ' файлов валидно';
    }
  }

  if(currentTab === 'prompts'){
    const text = buildPrompts(d);
    lastOutputs.prompts = text;
    body.innerHTML = blockHtml('Пак промптов для изображений', text);
    status.textContent = (text.match(/🖼 #/g) || []).length + ' промптов';
  }

  $$('#outBody [data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.out-block').querySelector('pre');
      copyText(pre.textContent, btn);
    });
  });
  const pvBtn = $('#pvRefresh');
  if(pvBtn) pvBtn.addEventListener('click', () => { const f = $('#pvFrame'); if(f) f.srcdoc = lastOutputs[currentTab] || ''; });
  saveState();
}

/* ---------- копирование / скачивание ---------- */
function copyText(text, btn){
  const done = () => { toast('Скопировано'); if(btn){ btn.textContent = '✓ скопировано'; setTimeout(()=>btn.textContent='копировать', 1200);} };
  if(navigator.clipboard && window.isSecureContext !== false){
    navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text, done));
  } else fallbackCopy(text, done);
}
function fallbackCopy(text, done){
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); done(); }catch(e){ toast('Не удалось скопировать'); }
  document.body.removeChild(ta);
}
function download(name, text){
  const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);
}
let toastTimer;
function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------- состояние ---------- */
function saveState(){
  try{
    const d = collectData();
    d._design = design;
    d._templateA = $('#templateA').value;
    d._templateB = $('#templateB').value;
    d._palette = $('#paletteSelect').value;
    localStorage.setItem('cardforge-state', JSON.stringify(d));
  }catch(e){}
}
function restoreState(){
  try{
    const raw = localStorage.getItem('cardforge-state');
    if(!raw) return;
    const d = JSON.parse(raw);
    $$('[data-f]').forEach(el => { if(d[el.dataset.f] !== undefined) el.value = d[el.dataset.f]; });
    (d.tags || []).forEach(t => { const c = $(`#tagCloud input[value="${CSS.escape(t)}"]`); if(c) c.checked = true; });
    $$('[data-json]').forEach(t => { if(d.jsonFiles && d.jsonFiles[t.dataset.json]) t.value = d.jsonFiles[t.dataset.json]; });
    // трекеры
    $$('.tracker').forEach(tr => {
      const id = tr.dataset.tracker;
      const cb = tr.querySelector('input[type=checkbox]');
      if(cb && d[`tracker_${id}_enabled`]){ cb.checked = true; tr.classList.add('on'); }
    });
    if(d._palette) $('#paletteSelect').value = d._palette;
    if(d._templateA) $('#templateA').value = d._templateA;
    if(d._templateB) $('#templateB').value = d._templateB;
    if(d._design) design = d._design;
    // палитра custom
    if($('#paletteSelect').value === 'custom'){
      $('#palCustom').classList.add('on');
    }
  }catch(e){}
}

/* ---------- события ---------- */
$('#tabs').addEventListener('click', e => {
  const t = e.target.closest('.tab'); if(!t) return;
  $$('.tab').forEach(x => x.classList.remove('on')); t.classList.add('on');
  currentTab = t.dataset.tab; render();
});
$('#btnCopy').addEventListener('click', () => {
  const text = lastOutputs[currentTab];
  if(text) copyText(text); else toast('Нечего копировать');
});
$('#btnDownload').addEventListener('click', () => {
  if(!validate()){ toast('Заполните обязательные поля'); return; }
  const d = collectData();
  const slug = (para(d.cardTitle) || 'character-card').toLowerCase().replace(/[^a-z0-9а-яё]+/gi,'-').replace(/^-+|-+$/g,'') || 'character-card';
  if(currentTab === 'htmlA') download(slug + '-description.html.txt', lastOutputs.htmlA || '');
  else if(currentTab === 'htmlB') download(slug + '-opening.html.txt', lastOutputs.htmlB || '');
  else if(currentTab === 'card') download(slug + '-card.txt', lastOutputs.card || '');
  else if(currentTab === 'prompts') download(slug + '-image-prompts.txt', lastOutputs.prompts || '');
  else if(currentTab === 'json'){
    Object.entries(lastOutputs).filter(([k]) => k.startsWith('json:')).forEach(([k, v]) => download(k.slice(5), v));
  }
  toast('Файл(ы) скачаны');
});
$('#btnPreview').addEventListener('click', () => {
  previewOn = !previewOn;
  $('#btnPreview').classList.toggle('primary', previewOn);
  if(currentTab === 'htmlA' || currentTab === 'htmlB') render();
});
$('#btnDesign').addEventListener('click', () => { design = randomDesign(); renderConcept(); render(); });
$('#tagCloud').addEventListener('change', () => {
  const n = $$('#tagCloud input:checked').length;
  $('#tagCount').textContent = n + ' / 10';
  if(n > 10){ const last = $$('#tagCloud input:checked')[10]; if(last) last.checked = false; toast('Максимум 10 тегов'); }
  render();
});

document.addEventListener('input', e => {
  if(e.target.matches('[data-f],[data-json]')) render();
});

$('#btnExport').addEventListener('click', () => {
  download('cardforge-state.json', JSON.stringify(collectData(), null, 2));
  toast('Состояние экспортировано');
});
$('#btnImport').addEventListener('click', () => $('#importFile').click());
$('#importFile').addEventListener('change', e => {
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const d = JSON.parse(reader.result);
      $$('[data-f]').forEach(el => { if(d[el.dataset.f] !== undefined) el.value = d[el.dataset.f]; });
      $$('#tagCloud input').forEach(c => c.checked = (d.tags || []).includes(c.value));
      $('#tagCount').textContent = (d.tags || []).length + ' / 10';
      // json fallback — если в корне объекта есть ключи json
      $$('[data-json]').forEach(t => {
        if(d.jsonFiles && d.jsonFiles[t.dataset.json]) t.value = d.jsonFiles[t.dataset.json];
        else if(d[t.dataset.json] && typeof d[t.dataset.json] === 'string') t.value = d[t.dataset.json];
      });
      // трекеры
      $$('.tracker').forEach(tr => {
        const id = tr.dataset.tracker;
        const cb = tr.querySelector('input[type=checkbox]');
        if(cb && d[`tracker_${id}_enabled`]){ cb.checked = true; tr.classList.add('on'); }
        else if(cb){ cb.checked = false; tr.classList.remove('on'); }
      });
      if(d._design) design = d._design;
      if(d._palette){ $('#paletteSelect').value = d._palette; if(d._palette==='custom') $('#palCustom').classList.add('on'); }
      renderConcept(); render(); toast('Импортировано');
    }catch(err){ toast('Ошибка импорта: ' + err.message); }
  };
  reader.readAsText(file);
  e.target.value = '';
});

/* сброс */
$('#btnReset').addEventListener('click', () => {
  if(!confirm('Сбросить ВСЕ поля? Это удалит текущую карточку, шаблоны и настройки.')) return;
  localStorage.removeItem('cardforge-state');
  $$('[data-f]').forEach(el => el.value = '');
  $$('[data-json]').forEach(el => el.value = '');
  $$('#tagCloud input').forEach(c => c.checked = false);
  $$('[data-pal]').forEach(el => el.value = el.getAttribute('value') || '#000000');
  $$('.tracker').forEach(tr => { const cb = tr.querySelector('input[type=checkbox]'); if(cb) cb.checked = false; tr.classList.remove('on'); });
  $('#tagCount').textContent = '0 / 10';
  $('#templateA').value = '__default'; $('#templateB').value = '__default';
  $('#paletteSelect').value = 'random'; $('#palCustom').classList.remove('on');
  design = randomDesign();
  renderConcept(); render();
  toast('Все настройки сброшены');
});

/* палитра */
$('#paletteSelect').addEventListener('change', () => {
  const sel = $('#paletteSelect').value;
  $('#palCustom').classList.toggle('on', sel === 'custom');
  if(sel !== 'custom'){ design = randomDesign(); }
  else { design = {palette:getPaletteSource(), fonts:design.fonts, motif:design.motif, mood:design.mood, radius:design.radius}; }
  renderConcept(); render();
});
$$('[data-pal]').forEach(el => el.addEventListener('input', () => {
  if($('#paletteSelect').value === 'custom'){
    design = {palette:getPaletteSource(), fonts:design.fonts, motif:design.motif, mood:design.mood, radius:design.radius};
    renderConcept(); render();
  }
}));

/* трекеры */
document.addEventListener('change', e => {
  if(e.target.matches('[data-tog]')){
    const id = e.target.dataset.tog;
    const tr = $(`.tracker[data-tracker="${id}"]`);
    if(tr) tr.classList.toggle('on', e.target.checked);
    render();
  }
});

/* макеты */
populateTemplateSelects();
$('#templateFile').addEventListener('change', e => {
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const tpls = getTemplates();
    const name = file.name.replace(/\.html?$/i,'').replace(/\.txt$/i,'');
    tpls[name] = { html: reader.result, created: Date.now() };
    saveTemplates(tpls);
    populateTemplateSelects();
    $('#templateEditor').value = reader.result;
    toast('Макет загружен: ' + name);
  };
  reader.readAsText(file);
  e.target.value = '';
});
$('#btnSaveTemplate').addEventListener('click', () => {
  const html = $('#templateEditor').value.trim();
  if(!html) { toast('Вставь HTML в редактор'); return; }
  const name = prompt('Название макета:', 'MyTemplate');
  if(!name) return;
  const tpls = getTemplates();
  tpls[name] = { html, created: Date.now() };
  saveTemplates(tpls);
  populateTemplateSelects();
  toast('Макет сохранён: ' + name);
});
$('#btnDeleteTemplate').addEventListener('click', () => {
  const sA = $('#templateA'), sB = $('#templateB');
  const nameA = sA.value, nameB = sB.value;
  if(nameA === '__default' && nameB === '__default') { toast('Нельзя удалить встроенные макеты'); return; }
  if(!confirm('Удалить выбранные пользовательские макеты из списков?')) return;
  const tpls = getTemplates();
  if(nameA !== '__default') delete tpls[nameA];
  if(nameB !== '__default' && nameB !== nameA) delete tpls[nameB];
  saveTemplates(tpls);
  populateTemplateSelects();
  toast('Макет(ы) удалены');
});

/* ---------- старт ---------- */
design = randomDesign();
restoreState();
if(!design || !design.palette) design = randomDesign();
populateTemplateSelects();
renderConcept();
render();