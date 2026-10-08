/* Komponenty asistenta – NÁVRH. Každá funkce vrací HTML. Interakce řeší app.js přes data-act.
   Názvy odpovídají tabulce „Dopad na knihovnu“ v dokumentu s nápady. */
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var kc = function (n) { return n.toLocaleString('cs-CZ').replace(/ /g, ' ') + ' Kč'; };
  var C = window.C = { esc: esc, kc: kc };

  /* Avatar – atom */
  C.Avatar = function (size) { return '<span class="av" style="width:' + (size || 28) + 'px;height:' + (size || 28) + 'px">' + I('spark', Math.round((size || 28) * .6)) + '</span>'; };

  /* AiMessage – sekce zprávy asistenta (avatar + obsah) */
  C.AiMessage = function (inner) { return '<div class="m m-ai">' + C.Avatar() + '<div class="body">' + inner + '</div></div>'; };
  C.UserMessage = function (text) { return '<div class="m m-user"><span class="sr-only">Vy: </span><div class="t">' + esc(text) + '</div></div>'; };

  /* SuggestionTile – dlaždice návrhu dotazu */
  C.SuggestionTile = function (s) {
    return '<button type="button" class="tile" data-act="ask" data-q="' + esc(s.q) + '"><span class="ic">' + I(s.icon, 20) + '</span><b>' + esc(s.title) + '</b><small>' + esc(s.sub) + '</small></button>';
  };
  /* SuggestionChips – čipy (rychlé volby, navazující otázky) */
  C.Chip = function (label, act, attrs, icon) {
    return '<button type="button" class="chip" data-act="' + act + '"' + (attrs || '') + '>' + (icon ? I(icon, 16) : '') + esc(label) + '</button>';
  };

  /* Welcome – uvítání s dlaždicemi */
  C.Welcome = function (recent) {
    return C.AiMessage(
      '<div class="welcome txt"><h2>Dobrý den, s čím vám pomohu?</h2><p>Jsem nákupní asistent bscom. Zeptejte se vlastními slovy.</p></div>' +
      '<ul class="can"><li>' + I('check', 16) + 'Najdu a porovnám zboží podle vašich potřeb</li><li>' + I('check', 16) + 'Poradím, na co se při výběru zaměřit</li><li>' + I('check', 16) + 'Zjistím stav objednávky po přihlášení</li></ul>' +
      '<div class="sec-label">Zkuste třeba</div>' +
      '<div class="tiles">' + PD.suggestions.map(C.SuggestionTile).join('') + '</div>' +
      '<div class="chips">' + PD.quick.map(function (q) { return C.Chip(q.label, 'ask', ' data-q="' + esc(q.q) + '"', q.icon); }).join('') + '</div>' +
      (recent && recent.length ? '<div class="sec-label">Pokračovat v konverzaci</div><div class="hist-list">' + recent.map(function (h) { return C.HistoryItem(h, false, true); }).join('') +
        '<button type="button" class="chip ghost" data-act="history">Celá historie</button></div>' : ''));
  };

  /* Historie konverzací */
  C.relTime = function (at) {
    var d = new Date(at), now = new Date(), t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var hm = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
    if (at >= t0) return 'Dnes ' + hm;
    if (at >= t0 - 864e5) return 'Včera ' + hm;
    return d.getDate() + '. ' + (d.getMonth() + 1) + '.';
  };
  C.groupOf = function (at) {
    var now = new Date(), t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    if (at >= t0) return 'Dnes';
    if (at >= t0 - 864e5) return 'Včera';
    if (at >= t0 - 7 * 864e5) return 'Posledních 7 dní';
    return 'Starší';
  };
  C.HistoryItem = function (h, current, compact) {
    return '<div class="hist-item' + (current ? ' is-current' : '') + (compact ? ' compact' : '') + '">' +
      '<button type="button" class="hist-open" data-act="hist-open" data-id="' + h.id + '"><span class="hi-ic">' + I(h.icon || 'chat', 18) + '</span><span class="hi-tx"><b>' + esc(h.title) + '</b><small>' + (current ? 'Právě otevřená · ' : '') + esc(h.summary) + ' · ' + C.relTime(h.at) + '</small></span></button>' +
      (compact ? '' : '<button type="button" class="ibtn" data-act="hist-del" data-id="' + h.id + '" aria-label="Smazat konverzaci ' + esc(h.title) + '" title="Smazat">' + I('trash', 18) + '</button>') + '</div>';
  };
  C.History = function (list, q, curId, canBack) {
    var f = (q || '').trim().toLowerCase();
    var items = list.slice().sort(function (a, b) { return b.at - a.at; }).filter(function (h) { return !f || (h.title + ' ' + h.summary).toLowerCase().indexOf(f) > -1; });
    var groups = [], by = {};
    items.forEach(function (h) { var g = C.groupOf(h.at); if (!by[g]) { by[g] = []; groups.push(g); } by[g].push(h); });
    var body = !list.length
      ? '<div class="hist-empty">' + I('history', 32) + '<b>Zatím tu nejsou žádné konverzace</b><span>Když začnete novou konverzaci, předchozí se uloží sem a můžete se k ní vrátit.</span></div>'
      : !items.length ? '<div class="hist-empty"><b>Nic nenalezeno</b><span>Zkuste jiné slovo.</span></div>'
      : groups.map(function (g) { return '<div class="sec-label">' + g + '</div><div class="hist-list">' + by[g].map(function (h) { return C.HistoryItem(h, h.id === curId); }).join('') + '</div>'; }).join('');
    return '<div class="hist">' +
      '<div class="hist-top">' + (canBack ? '<button type="button" class="btn-s" data-act="hist-back">' + I('back', 16) + 'Zpět</button>' : '') + '<h2>Historie konverzací</h2><button type="button" class="btn-p" style="height:34px;font-size:13px" data-act="new">' + I('newchat', 16) + 'Nová</button></div>' +
      (list.length ? '<div class="field"><label class="sr-only" for="hist-q">Hledat v historii</label><span class="in">' + I('search', 18) + '<input id="hist-q" placeholder="Hledat v konverzacích" value="' + esc(q || '') + '"></span></div>' : '') +
      body +
      '<p class="hist-note">' + I('lock', 14) + 'Historie se ukládá v tomto prohlížeči. Po přihlášení ji uvidíte i na dalších zařízeních.</p></div>';
  };

  /* ClarifyQuestion – upřesňující otázka s volbami */
  C.Clarify = function (e) {
    var step = PD.clarify[e.step];
    var opts = step.options.map(function (o, i) {
      var on = e.picked === i;
      return '<button type="button" class="chip" data-act="pick" data-step="' + e.step + '" data-i="' + i + '" aria-pressed="' + on + '"' + (e.picked != null && !on ? ' disabled' : '') + '>' + (on ? I('check', 16) : '') + esc(o) + '</button>';
    }).join('');
    var pct = Math.round((e.step + 1) / PD.clarify.length * 100);
    return C.AiMessage('<div class="clarify" role="group" aria-label="' + esc(step.q) + '"><span class="step">Upřesnění ' + (e.step + 1) + ' z ' + PD.clarify.length + '</span><div class="bar"><i style="width:' + pct + '%"></i></div><b>' + esc(step.q) + '</b><div class="chips">' + opts +
      (e.picked == null ? C.Chip('Přeskočit', 'skip', '', null).replace('class="chip"', 'class="chip ghost"') : '') + '</div></div>');
  };

  /* ChatProgress – průběh odpovědi */
  C.Progress = function (e) {
    var li = e.steps.map(function (t, i) {
      var st = i < e.cur ? 'done' : i === e.cur ? 'now' : '';
      var mark = st === 'done' ? '<span class="dot" style="color:var(--c-ok)">' + I('check', 16) + '</span>' : st === 'now' ? '<span class="dot"><span class="spin"></span></span>' : '<span class="dot"><i></i></span>';
      return '<li class="' + st + '">' + mark + esc(t) + '</li>';
    }).join('');
    return C.AiMessage('<div class="progress" aria-busy="true"><ol>' + li + '</ol><div class="row"><small style="color:var(--c-muted)">Obvykle do 10 sekund</small><button type="button" class="btn-s" data-act="stop">' + I('stop', 14) + 'Zastavit</button></div></div>' +
      (e.cur >= e.steps.length - 1 ? '<div class="skel" aria-hidden="true"><div></div><div></div></div>' : ''));
  };

  /* ProductImage – kresba místo fotky */
  C.ProductImage = function (p) {
    return '<svg viewBox="0 0 160 110" aria-hidden="true"><rect x="28" y="12" width="104" height="68" rx="6" fill="#2b3640"/><rect x="33" y="17" width="94" height="58" rx="2" fill="' + p.screen + '"/><path d="M33 75 127 17v58Z" fill="#fff" opacity=".12"/><path d="M14 84h132l-8 12H22Z" fill="#9aa7b3"/><rect x="66" y="86" width="28" height="3" rx="1.5" fill="#7c8a97"/></svg>';
  };

  /* ProductCard – produktová dlaždice */
  C.ProductCard = function (p, st) {
    if (st.dismissed) {
      return '<article class="pcard is-dismissed" aria-label="' + esc(p.name) + ' – skryto"><div class="dismissed"><b style="color:var(--c-ink)">' + esc(p.name) + '</b>Skryto. Příště vám ukážu méně podobných.<button type="button" class="btn-s" data-act="undo" data-id="' + p.id + '">Vrátit</button></div></article>';
    }
    return '<article class="pcard' + (st.compare ? ' is-compare' : '') + '" aria-label="' + esc(p.name) + '">' +
      '<span class="tag ' + p.tagKind + '">' + esc(p.tag) + '</span>' +
      '<div class="img">' + C.ProductImage(p) + '</div>' +
      '<div class="in"><a class="nm" href="' + esc(p.href) + '" target="_blank" rel="noopener">' + esc(p.name) + '</a>' +
      '<ul><li>' + esc(p.cpu) + '</li><li>' + p.ram + ' GB RAM · SSD ' + p.ssd + ' GB</li><li>' + esc(p.display) + '</li></ul>' +
      '<div class="stock"><i></i>' + esc(p.stock) + '</div><div class="dlv">' + esc(p.delivery) + '</div>' +
      '<div class="price">' + kc(p.price) + '</div>' +
      '<div class="acts">' + (st.inCart
        ? '<button type="button" class="btn-p in-cart" data-act="cart" data-id="' + p.id + '">' + I('check', 16) + 'V košíku</button>'
        : '<button type="button" class="btn-p" data-act="cart" data-id="' + p.id + '">' + I('cart', 16) + 'Do košíku</button>') + '</div></div>' +
      '<div class="more"><label class="cmp"><input type="checkbox" data-act="cmp" data-id="' + p.id + '"' + (st.compare ? ' checked' : '') + '>Porovnat</label>' +
      '<span><button type="button" class="ibtn" data-act="watch" data-id="' + p.id + '" aria-label="Hlídat cenu" title="Hlídat cenu"' + (st.watched ? ' aria-pressed="true"' : '') + '>' + I('bell', 18) + '</button>' +
      '<button type="button" class="ibtn" data-act="dismiss" data-id="' + p.id + '" aria-label="Nezajímá mě" title="Nezajímá mě">' + I('x', 18) + '</button></span></div></article>';
  };

  /* ProductCarousel */
  C.Carousel = function (ids, S) {
    return '<div class="carousel" role="list">' + ids.map(function (id) {
      var p = PD.products.find(function (x) { return x.id === id; });
      return '<div role="listitem" style="display:contents">' + C.ProductCard(p, { inCart: S.inCart.has(id), compare: S.compare.has(id), dismissed: S.dismissed.has(id), watched: !!S.watch[id] }) + '</div>';
    }).join('') + '</div>';
  };

  /* MessageActions – hodnocení a kopírování */
  C.MessageActions = function (e, idx) {
    var html = '<div class="msg-acts"><button type="button" class="ibtn" data-act="rate" data-v="up" data-e="' + idx + '" aria-label="Užitečná odpověď" aria-pressed="' + (e.rating === 'up') + '">' + I('up', 17) + '</button>' +
      '<button type="button" class="ibtn" data-act="rate" data-v="down" data-e="' + idx + '" aria-label="Neužitečná odpověď" aria-pressed="' + (e.rating === 'down') + '">' + I('down', 17) + '</button>' +
      '<button type="button" class="ibtn" data-act="copy" data-e="' + idx + '" aria-label="Kopírovat odpověď">' + I('copy', 17) + '</button></div>';
    if (e.rating === 'down' && !e.reason) {
      html += '<div class="why">Co nesedí?' + ['Nepřesné informace', 'Nehodí se mi', 'Něco jiného'].map(function (r) { return C.Chip(r, 'reason', ' data-e="' + idx + '" data-r="' + esc(r) + '"'); }).join('') + '</div>';
    } else if (e.reason) {
      html += '<div class="why">Díky, předáme to týmu.</div>';
    }
    return html;
  };

  /* Answer – odpověď s produkty */
  C.Answer = function (e, idx, S) {
    return C.AiMessage('<div class="txt"><p>' + e.intro + '</p></div>' + C.Carousel(e.ids, S) +
      (e.followups && e.followups.length ? '<div class="chips">' + e.followups.map(function (f) { return C.Chip(f.label, 'follow', ' data-f="' + f.id + '"'); }).join('') + '</div>' : '') +
      C.MessageActions(e, idx));
  };

  /* CompareTable – porovnání vedle sebe */
  C.Compare = function (ids, S) {
    var ps = ids.map(function (id) { return PD.products.find(function (x) { return x.id === id; }); });
    var rows = [
      ['Cena', function (p) { return kc(p.price); }, 'min', function (p) { return p.price; }],
      ['Procesor', function (p) { return p.cpu; }],
      ['Operační paměť', function (p) { return p.ram + ' GB'; }, 'max', function (p) { return p.ram; }],
      ['Úložiště', function (p) { return 'SSD ' + p.ssd + ' GB'; }, 'max', function (p) { return p.ssd; }],
      ['Displej', function (p) { return p.display; }],
      ['Systém', function (p) { return p.os; }],
      ['Hmotnost', function (p) { return p.weight; }],
      ['Výbava', function (p) { return p.extra; }],
      ['Dostupnost', function (p) { return p.stock + ', ' + p.delivery; }]
    ];
    var head = '<tr><th scope="col"><span class="sr-only">Parametr</span></th>' + ps.map(function (p) {
      return '<th scope="col">' + esc(p.name) + '<span class="pr">' + kc(p.price) + '</span><button type="button" class="btn-p" style="height:32px;font-size:13px;margin-top:6px" data-act="cart" data-id="' + p.id + '">' + (S.inCart.has(p.id) ? I('check', 14) + 'V košíku' : I('cart', 14) + 'Do košíku') + '</button></th>';
    }).join('') + '</tr>';
    var body = rows.map(function (r) {
      var vals = ps.map(r[1]);
      var diff = vals.some(function (v) { return v !== vals[0]; });
      var best = null;
      if (r[2] && diff) {
        var nums = ps.map(r[3]);
        var b = r[2] === 'min' ? Math.min.apply(null, nums) : Math.max.apply(null, nums);
        best = nums.map(function (n) { return n === b; });
      }
      return '<tr><th scope="row">' + r[0] + '</th>' + vals.map(function (v, i) {
        var cls = best && best[i] ? 'best' : diff ? 'diff' : '';
        return '<td class="' + cls + '">' + esc(v) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="compare"><button type="button" class="btn-s back" data-act="compare-back">' + I('back', 16) + 'Zpět do konverzace</button>' +
      C.AiMessage('<div class="txt"><p><b>Porovnání ' + ps.length + ' notebooků.</b> Zvýrazněné jsou rozdíly, zeleně nejlepší hodnota.</p></div>') +
      '<div class="tblw"><table class="ctable"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>' +
      '<div class="legend"><span><i style="background:var(--c-ok-soft)"></i>nejlepší hodnota</span><span><i style="background:#fffbea"></i>liší se</span></div></div>';
  };

  /* CompareBar */
  C.CompareBar = function (n) {
    return '<div class="cmpbar"' + (n ? '' : ' hidden') + '><span>' + I('compare', 18) + ' Vybráno k porovnání: ' + n + '</span><button type="button" class="btn-p" style="height:32px;font-size:13px" data-act="compare-open"' + (n < 2 ? ' disabled title="Vyberte aspoň 2"' : '') + '>Porovnat</button></div>';
  };

  /* ChatNotice – info, nic nenalezeno, chyba */
  C.Notice = function (kind, title, text, actions) {
    var ic = kind === 'err' ? 'alert' : kind === 'warn' ? 'alert' : 'info';
    return C.AiMessage('<div class="notice ' + (kind || '') + '" role="' + (kind === 'err' ? 'alert' : 'status') + '"><span class="ic">' + I(ic, 20) + '</span><div class="nb"><b>' + esc(title) + '</b><p>' + text + '</p>' + (actions ? '<div class="chips">' + actions + '</div>' : '') + '</div></div>');
  };

  /* HandoffCard – předání člověku */
  C.Handoff = function () {
    return C.AiMessage('<div class="txt"><p>Rád vás spojím s kolegy z bscom. Shrnutí konverzace jim předám, ať nemusíte nic opakovat.</p></div>' +
      '<div class="svc"><div class="hd"><span class="ic">' + I('headset', 20) + '</span><div><b>Zákaznická linka</b><div style="font-size:12.5px;color:var(--c-muted)">' + PD.hours + '</div></div></div>' +
      '<div class="big">' + PD.phone + '</div><div class="chips"><button type="button" class="btn-s" data-act="copy-phone">' + I('copy', 16) + 'Kopírovat číslo</button><button type="button" class="btn-p" data-act="write">Napsat dotaz</button></div></div>');
  };

  /* OrderCard – stav objednávky */
  C.OrderLogin = function () {
    return C.AiMessage('<div class="svc"><div class="hd"><span class="ic">' + I('lock', 20) + '</span><b>Pro stav objednávky se přihlaste</b></div><p style="margin:0;font-size:13px;color:var(--c-ink-2)">Po přihlášení vám ukážu vaše objednávky a kde je zásilka.</p><div><button type="button" class="btn-p" data-act="login">Přihlásit se</button></div></div>');
  };
  C.Order = function () {
    return C.AiMessage('<div class="txt"><p>Tady je vaše poslední objednávka.</p></div><div class="svc"><div class="hd"><span class="ic">' + I('box', 20) + '</span><b>Objednávka [číslo objednávky]</b></div>' +
      '<dl class="kv"><dt>Stav</dt><dd>[stav z e-shopu]</dd><dt>Doručení</dt><dd>[termín]</dd><dt>Dopravce</dt><dd>[dopravce]</dd><dt>Položky</dt><dd>[seznam položek]</dd></dl>' +
      '<div class="chips"><button type="button" class="btn-s" data-act="toast" data-t="V ostrém provozu otevře sledování zásilky u dopravce.">Sledovat zásilku</button><button type="button" class="btn-s" data-act="ask" data-q="Chci reklamovat zboží">Reklamovat</button></div></div>');
  };

  /* PriceWatch – hlídání ceny */
  C.PriceWatch = function (e, idx) {
    var p = PD.products.find(function (x) { return x.id === e.id; });
    if (e.done) {
      return C.AiMessage('<div class="svc"><div class="ok-line">' + I('check', 18) + 'Hlídám cenu</div><p style="margin:0;font-size:13.5px">Napíšu vám e-mailem, až <b>' + esc(p.name) + '</b> zlevní pod <b>' + kc(e.target) + '</b>. Hlídání zrušíte v účtu.</p></div>');
    }
    return C.AiMessage('<form class="svc" data-act="watch-save" data-e="' + idx + '"><div class="hd"><span class="ic">' + I('bell', 20) + '</span><div><b>Hlídat cenu</b><div style="font-size:12.5px;color:var(--c-muted)">' + esc(p.name) + ' · teď ' + kc(p.price) + '</div></div></div>' +
      '<label class="field" for="watch-' + idx + '">Dejte mi vědět, až bude cena pod<span class="in"><input id="watch-' + idx + '" inputmode="numeric" placeholder="např. ' + kc(Math.floor(p.price * 0.9 / 100) * 100).replace(' Kč', '') + '" value="' + (e.input || '') + '"><span>Kč</span></span></label>' +
      (e.error ? '<p style="margin:0;color:var(--c-err);font-size:13px">' + esc(e.error) + '</p>' : '') +
      '<div><button type="submit" class="btn-p">Hlídat cenu</button></div></form>');
  };
})();
