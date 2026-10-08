/* Prototyp: drátěný web, otevírání asistenta, scénář konverzace, přepínač šířky a stavů. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var site = $('#site'), log, panel;
  var S, timers = [];

  var HKEY = 'bscom-ai-historie';
  function loadHistory() { try { return JSON.parse(localStorage.getItem(HKEY) || '[]'); } catch (e) { return []; } }
  function saveHistory() { try { localStorage.setItem(HKEY, JSON.stringify(S.history)); } catch (e) {} }
  function fresh() {
    return { history: S ? S.history : loadHistory(), convId: null, hq: '', open: false, bubbles: S ? S.bubbles : false, wide: false, cart: S ? S.cart : 0, logged: false,
      inCart: S ? S.inCart : new Set(), compare: new Set(), dismissed: new Set(), watch: {}, entries: [], view: 'chat', busy: false, picks: [] };
  }
  S = fresh();

  /* ---------- drátěný web ---------- */
  function renderSite() {
    site.innerHTML =
      '<div class="scroll" id="page">' +
      '<div class="wf-top"><span>bscom.cz</span><span>|</span><span>bsshop.cz</span><span>|</span><span>LOXONE</span></div>' +
      '<header class="wf-head"><div class="wf-logo"><i>bs</i>bscom</div>' +
      '<div class="wf-search"><label class="sr-only" for="wf-q">Hledat zboží</label><input id="wf-q" autocomplete="off" placeholder="Co hledáte? Zkuste třeba: notebook do školy">' + I('search', 22) + '<div class="wf-suggest" id="wf-sug" hidden></div></div>' +
      '<button type="button" class="wf-ai" data-act="open">' + I('aisearch', 22) + '<span>AI asistent</span></button>' +
      '<div class="wf-icons">' + I('user', 24, 'Můj účet') + '<span class="wf-cart" id="wf-cart">' + I('cart', 24, 'Košík') + '<b>' + S.cart + '</b></span><span class="wf-menu">' + I('menu', 26, 'Menu') + '</span></div></header>' +
      '<nav class="wf-nav" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></nav>' +
      '<main class="wf-main">' +
      '<div class="wf-hero"><div class="wf-box" data-label="[hlavní banner]"></div><div class="wf-box" data-label="[vedlejší banner]"></div></div>' +
      '<section class="entry" aria-label="Nákupní asistent"><span class="entry__ico">' + I('spark', 28) + '</span><div><h2>Nevíte, co vybrat? Zeptejte se.</h2><p>Nákupní asistent najde a porovná zboží podle toho, k čemu ho potřebujete.</p></div>' +
      '<div class="chips">' + C.Chip('Notebook do školy', 'open-ask', ' data-q="Hledám notebook do školy do 15 000 Kč"', 'laptop') + C.Chip('Dárek pro dítě do 2 000 Kč', 'open-ask', ' data-q="Hledám lego vhodné pro mou 5letou dceru do 2 000 Kč"', 'gift') + C.Chip('Powerbanka 20 000 mAh', 'open-ask', ' data-q="Nějaká levná powerbanka s kapacitou alespoň 20 000 mAh?"', 'battery') + '</div></section>' +
      '<div class="wf-h" aria-hidden="true"></div>' +
      '<div class="wf-grid" aria-hidden="true">' + [1, 2, 3, 4].map(function () { return '<div class="wf-card"><div class="img"></div><div class="l"></div><div class="l s"></div><div class="row"><span class="p"></span><span class="b"></span></div></div>'; }).join('') + '</div>' +
      '<div class="wf-hero" aria-hidden="true"><div class="wf-box" data-label="[články]" style="min-height:140px"></div><div class="wf-box" data-label="[značky]" style="min-height:140px"></div></div>' +
      '</main><div class="wf-foot" aria-hidden="true"></div></div>' +
      '<button type="button" class="launcher" data-act="open" id="launcher" aria-label="Otevřít nákupního asistenta">' + I('spark', 24) + '<span>Nákupní asistent</span></button>' +
      '<div id="ap-host"></div><div class="toast" id="toast" role="status" hidden></div>';
  }

  /* ---------- panel ---------- */
  function renderPanel() {
    var host = $('#ap-host');
    $('#launcher').hidden = S.open;
    if (!S.open) { host.innerHTML = ''; panel = log = null; return; }
    if (!panel) {
      host.innerHTML = '<section class="ap" id="ap" role="dialog" aria-modal="false" aria-labelledby="ap-t">' +
        '<header class="ap-head">' + C.Avatar(32) + '<div class="ap-title"><b id="ap-t">Nákupní asistent<span class="ai-tag">AI</span></b><small>Odpověď obvykle do 10 s</small></div>' +
        '<button type="button" class="ibtn hist-btn" data-act="history" aria-label="Historie konverzací" title="Historie konverzací">' + I('history', 20) + '</button>' +
        '<button type="button" class="ibtn" data-act="new" aria-label="Nová konverzace" title="Nová konverzace">' + I('newchat', 20) + '</button>' +
        '<button type="button" class="ibtn wide-btn" data-act="wide" aria-label="Rozšířit" title="Rozšířit">' + I('expand', 18) + '</button>' +
        '<button type="button" class="ibtn" data-act="close" aria-label="Zavřít asistenta" title="Zavřít">' + I('close', 20) + '</button></header>' +
        '<div class="ap-log" id="ap-log" aria-live="polite"></div>' +
        '<footer class="ap-foot"><div id="cmpbar-host"></div><form class="composer" id="composer"><label class="sr-only" for="q">Napište dotaz</label><textarea id="q" rows="1" placeholder="Napište, co hledáte…"></textarea><button class="send" type="submit" aria-label="Odeslat" disabled>' + I('spark', 20) + '</button></form>' +
        '<p class="foot-note"><span>AI může chybovat. Ceny a sklad bereme z e-shopu.</span><button type="button" data-act="how">Jak to funguje</button></p></footer></section>';
      panel = $('#ap'); log = $('#ap-log');
      setTimeout(function () { var q = $('#q'); if (q) q.focus(); }, 30);
    }
    panel.classList.toggle('bubbles', S.bubbles);
    panel.classList.toggle('wide', S.wide);
    var wb = panel.querySelector('.wide-btn');
    wb.innerHTML = S.wide ? I('shrink', 18) : I('expand', 18);
    wb.setAttribute('aria-label', S.wide ? 'Zúžit' : 'Rozšířit');
    renderLog();
  }

  function renderLog() {
    if (!log) return;
    if (panel) { panel.classList.toggle('in-history', S.view === 'history'); var hb = panel.querySelector('.hist-btn'); if (hb) hb.setAttribute('aria-pressed', String(S.view === 'history')); }
    if (S.view === 'history') {
      log.innerHTML = C.History(S.history, S.hq, S.convId, hasUser(S.entries));
    } else if (S.view === 'compare') {
      log.innerHTML = C.Compare(Array.from(S.compare), S);
    } else {
      log.innerHTML = S.entries.map(function (e, i) {
        switch (e.t) {
          case 'welcome': return C.Welcome(S.history.slice().sort(function (a, b) { return b.at - a.at; }).filter(function (h) { return h.id !== S.convId; }).slice(0, 2));
          case 'user': return C.UserMessage(e.text);
          case 'clarify': return C.Clarify(e);
          case 'progress': return C.Progress(e);
          case 'answer': return C.Answer(e, i, S);
          case 'notice': return C.Notice(e.kind, e.title, e.text, e.actions);
          case 'handoff': return C.Handoff();
          case 'login': return C.OrderLogin();
          case 'order': return C.Order();
          case 'watch': return C.PriceWatch(e, i);
          case 'ai': return C.AiMessage('<div class="txt"><p>' + e.html + '</p></div>');
        }
        return '';
      }).map(function (h, i) { return '<div class="entry-w" data-i="' + i + '">' + h + '</div>'; }).join('');
    }
    var ch = $('#cmpbar-host'); if (ch) ch.innerHTML = S.view === 'chat' ? C.CompareBar(S.compare.size) : '';
    var btn = $('#composer .send'), q = $('#q');
    if (btn && q) btn.disabled = S.busy || !q.value.trim();
  }
  function scrollEnd() { if (log) requestAnimationFrame(function () { log.scrollTop = log.scrollHeight; }); }
  function push(e) {
    S.entries.push(e); renderLog();
    if (e.t === 'answer' && log) { var el = log.querySelector('[data-i="' + (S.entries.length - 1) + '"]'); if (el) requestAnimationFrame(function () { log.scrollTop = el.offsetTop - 12; }); }
    else scrollEnd();
    return e;
  }
  function pop(t) { for (var i = S.entries.length - 1; i >= 0; i--) if (S.entries[i].t === t) { S.entries.splice(i, 1); break; } }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  var toastT;
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.innerHTML = I('check', 18) + '<span>' + C.esc(msg) + '</span>'; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 2600);
  }
  function cartCount() {
    var c = $('#wf-cart'); if (!c) return;
    c.querySelector('b').textContent = S.cart;
    c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  }

  /* ---------- historie ---------- */
  function hasUser(list) { return list.some(function (e) { return e.t === 'user'; }); }
  function summaryOf(list) {
    for (var i = list.length - 1; i >= 0; i--) {
      var e = list[i];
      if (e.t === 'answer') { var n = e.ids.length; return n + (n === 1 ? ' produkt' : n < 5 ? ' produkty' : ' produktů') + ': ' + e.ids.map(function (id) { return PD.products.find(function (p) { return p.id === id; }).name.split(' ').slice(0, 2).join(' '); }).join(', '); }
      if (e.t === 'handoff') return 'Předáno zákaznické lince';
      if (e.t === 'order' || e.t === 'login') return 'Stav objednávky';
      if (e.t === 'notice') return e.title;
      if (e.t === 'clarify') return 'Rozpracované upřesnění';
    }
    return 'Bez odpovědi';
  }
  function iconOf(list) {
    var u = (list.find(function (e) { return e.t === 'user'; }) || {}).text || '';
    return /notebook/i.test(u) ? 'laptop' : /objedn/i.test(u) ? 'box' : /člověk|reklam/i.test(u) ? 'headset' : /lego|dár/i.test(u) ? 'gift' : 'chat';
  }
  function archive() {
    var list = S.entries.filter(function (e) { return e.t !== 'progress' && e.t !== 'welcome'; });
    if (!hasUser(list)) return false;
    var item = { id: S.convId || ('c' + Date.now()), title: list.find(function (e) { return e.t === 'user'; }).text, summary: summaryOf(list), icon: iconOf(list), at: Date.now(), entries: JSON.parse(JSON.stringify(list)) };
    S.history = [item].concat(S.history.filter(function (h) { return h.id !== item.id; })).slice(0, 30);
    S.convId = item.id;
    saveHistory();
    return true;
  }
  function newChat() {
    clearTimers(); S.busy = false;
    var saved = archive();
    S.entries = [{ t: 'welcome' }]; S.convId = null; S.compare = new Set(); S.dismissed = new Set(); S.view = 'chat';
    renderLog(); if (log) log.scrollTop = 0;
    if (saved) toast('Předchozí konverzace je v historii');
  }
  function openConv(id) {
    if (id === S.convId) { S.view = 'chat'; renderLog(); scrollEnd(); return; }
    clearTimers(); S.busy = false;
    archive();
    var h = S.history.find(function (x) { return x.id === id; }); if (!h) return;
    S.entries = JSON.parse(JSON.stringify(h.entries)); S.convId = id; S.compare = new Set(); S.dismissed = new Set(); S.view = 'chat';
    renderLog(); scrollEnd();
  }

  /* ---------- scénář ---------- */
  function open(q) {
    S.open = true; S.view = 'chat';
    if (!S.entries.length) S.entries.push({ t: 'welcome' });
    renderPanel();
    if (q) ask(q);
  }
  function close() { clearTimers(); S.busy = false; pop('progress'); S.open = false; panel = null; renderPanel(); var l = $('#launcher'); if (l) l.focus(); }

  function ask(text) {
    if (S.busy) return;
    S.view = 'chat';
    push({ t: 'user', text: text });
    var s = text.toLowerCase();
    if (/notebook|laptop/.test(s)) { S.picks = []; later(function () { push({ t: 'clarify', step: 0, picked: null }); }, 450); }
    else if (/objedn/.test(s)) { later(function () { push(S.logged ? { t: 'order' } : { t: 'login' }); }, 450); }
    else if (/reklam|člověk|clovek|operátor|kontakt/.test(s)) { later(function () { push({ t: 'handoff' }); }, 450); }
    else if (/lego|powerbank|sklo|s25|dárek|darek/.test(s)) { run(['Hledám v katalogu', 'Kontroluji sklad'], function () {
      push({ t: 'notice', kind: '', title: 'V prototypu je připravený jen výběr notebooků', text: 'V ostrém provozu by tu byly produktové dlaždice pro tento dotaz.', actions: C.Chip('Ukázat notebooky do školy', 'ask', ' data-q="Hledám notebook do školy do 15 000 Kč"', 'laptop') });
    }); }
    else if (/chyba|error/.test(s)) { run(['Hledám v katalogu'], function () { pushError(text); }); }
    else { run(['Hledám v katalogu', 'Kontroluji sklad'], function () { pushNoResults(text); }); }
  }

  function run(steps, done) {
    S.busy = true;
    var e = push({ t: 'progress', steps: steps, cur: 0 });
    var i = 0;
    (function next() {
      later(function () {
        i++;
        if (i < steps.length) { e.cur = i; renderLog(); scrollEnd(); next(); }
        else { pop('progress'); S.busy = false; done(); }
      }, 800);
    })();
  }

  function answerAll() {
    var use = S.picks[0] != null ? PD.clarify[0].options[S.picks[0]] : null;
    var size = S.picks[1] != null ? PD.clarify[1].options[S.picks[1]] : null;
    var lead = 'Vybral jsem 4 notebooky kolem 15 000 Kč, všechny skladem s doručením cca do 1 dne' + (use ? ' a vhodné pro <b>' + C.esc(use.toLowerCase()) + '</b>' : '') + '.';
    if (size === '14" a lehký') lead += ' Kompaktní 14" displej má repasovaný Dell.';
    if (use === 'Hry' || use === 'Grafika a video') lead += ' Na náročnější ' + (use === 'Hry' ? 'hry' : 'grafiku') + ' ale v tomto rozpočtu počítejte s kompromisy.';
    run(['Hledám notebooky kolem 15 000 Kč', 'Kontroluji sklad a doručení', 'Porovnávám parametry'], function () {
      push({ t: 'answer', intro: lead, ids: ['hp', 'lenovo', 'dell', 'acer'], followups: [
        { id: 'cmp2', label: 'Porovnat první dva' }, { id: 'ram16', label: 'Jen s 16 GB RAM' }, { id: 'cheap', label: 'Levnější varianty' }, { id: 'human', label: 'Poradit se s člověkem' }] });
    });
  }
  function pushNoResults(q) {
    push({ t: 'notice', kind: 'warn', title: 'Pro „' + q + '“ jsem nic nenašel', text: 'Zkuste napsat, k čemu zboží potřebujete, nebo rozpočet. Můžete se také podívat do kategorií.',
      actions: C.Chip('Notebook do školy', 'ask', ' data-q="Hledám notebook do školy do 15 000 Kč"') + C.Chip('Mluvit s člověkem', 'ask', ' data-q="Chci mluvit s člověkem"') });
  }
  function pushError(q) {
    push({ t: 'notice', kind: 'err', title: 'Odpověď se nepodařilo načíst', text: 'Nejspíš vypadlo spojení. Váš dotaz zůstal uložený.',
      actions: '<button type="button" class="btn-s" data-act="retry">' + I('refresh', 16) + 'Zkusit znovu</button>' });
  }

  function follow(id) {
    if (id === 'cmp2') { S.compare = new Set(['hp', 'lenovo']); S.view = 'compare'; renderLog(); log.scrollTop = 0; return; }
    if (id === 'ram16') { push({ t: 'user', text: 'Jen s 16 GB RAM' }); run(['Filtruji podle paměti'], function () {
      push({ t: 'answer', intro: 'Do 15 000 Kč má 16 GB RAM jen <b>repasovaný Dell Latitude 5430</b>, s 24měsíční zárukou.', ids: ['dell'], followups: [{ id: 'all', label: 'Zpět na všechny 4' }, { id: 'watch-hp', label: 'Hlídat cenu HP 250R G9' }] });
    }); return; }
    if (id === 'cheap') { push({ t: 'user', text: 'Levnější varianty' }); run(['Řadím podle ceny'], function () {
      push({ t: 'answer', intro: 'Pod 13 000 Kč jsou tyto dva, seřazené od nejlevnějšího.', ids: ['dell', 'lenovo'], followups: [{ id: 'all', label: 'Zpět na všechny 4' }, { id: 'cmp-cheap', label: 'Porovnat je' }] });
    }); return; }
    if (id === 'cmp-cheap') { S.compare = new Set(['dell', 'lenovo']); S.view = 'compare'; renderLog(); log.scrollTop = 0; return; }
    if (id === 'all') { push({ t: 'user', text: 'Zpět na všechny 4' }); answerAll(); return; }
    if (id === 'human') { ask('Chci mluvit s člověkem'); return; }
    if (id === 'watch-hp') { push({ t: 'watch', id: 'hp' }); return; }
  }

  /* ---------- události ---------- */
  site.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (!el || el.tagName === 'FORM' || (el.tagName === 'INPUT' && el.type === 'checkbox')) return;
    var a = el.dataset.act, id = el.dataset.id, ei = +el.dataset.e;
    if (el.closest('.wf-suggest')) $('#wf-sug').hidden = true;
    switch (a) {
      case 'open': open(); break;
      case 'open-ask': open(el.dataset.q); break;
      case 'close': close(); break;
      case 'new': newChat(); break;
      case 'history': if (S.view !== 'history') archive(); S.view = S.view === 'history' ? 'chat' : 'history'; S.hq = ''; renderLog(); if (log) log.scrollTop = 0; break;
      case 'hist-back': S.view = 'chat'; renderLog(); scrollEnd(); break;
      case 'hist-open': openConv(el.dataset.id); break;
      case 'hist-del': {
        var del = S.history.find(function (h) { return h.id === id; });
        S.history = S.history.filter(function (h) { return h.id !== id; }); saveHistory();
        if (S.convId === id) S.convId = null;
        renderLog(); toast('Konverzace „' + (del ? del.title : '') + '“ smazána'); break;
      }
      case 'wide': S.wide = !S.wide; renderPanel(); break;
      case 'ask': ask(el.dataset.q); break;
      case 'pick': {
        var st = +el.dataset.step, e = S.entries.filter(function (x) { return x.t === 'clarify' && x.step === st; }).pop();
        if (!e || e.picked != null) return;
        e.picked = +el.dataset.i; S.picks[st] = e.picked; renderLog();
        if (st + 1 < PD.clarify.length) later(function () { push({ t: 'clarify', step: st + 1, picked: null }); }, 350);
        else answerAll();
        break;
      }
      case 'skip': { var c = S.entries.filter(function (x) { return x.t === 'clarify'; }).pop(); if (c) c.picked = -1; renderLog(); answerAll(); break; }
      case 'stop': clearTimers(); S.busy = false; pop('progress'); push({ t: 'notice', kind: '', title: 'Zastaveno', text: 'Odpověď jsem nedokončil.', actions: '<button type="button" class="btn-s" data-act="retry">' + I('refresh', 16) + 'Pokračovat</button>' }); break;
      case 'retry': pop('notice'); answerAll(); break;
      case 'cart':
        if (S.inCart.has(id)) { toast('Už je v košíku'); break; }
        S.inCart.add(id); S.cart++; cartCount();
        toast('Přidáno do košíku: ' + PD.products.find(function (p) { return p.id === id; }).name); renderLog(); break;
      case 'dismiss': S.dismissed.add(id); S.compare.delete(id); renderLog(); break;
      case 'undo': S.dismissed.delete(id); renderLog(); break;
      case 'watch': if (S.watch[id]) { toast('Cenu už hlídám'); break; } push({ t: 'watch', id: id }); break;
      case 'follow': follow(el.dataset.f); break;
      case 'rate': { var r = S.entries[ei]; r.rating = r.rating === el.dataset.v ? null : el.dataset.v; r.reason = null; renderLog(); if (r.rating === 'up') toast('Díky za hodnocení'); break; }
      case 'reason': S.entries[ei].reason = el.dataset.r; renderLog(); break;
      case 'copy': copy(log.querySelectorAll('.m-ai')[0] ? stripText(ei) : '', 'Odpověď zkopírována'); break;
      case 'copy-phone': copy(PD.phone, 'Číslo zkopírováno'); break;
      case 'write': toast('V ostrém provozu otevře formulář se shrnutím konverzace'); break;
      case 'login': S.logged = true; pop('login'); push({ t: 'ai', html: 'Přihlášení proběhlo (ukázka).' }); push({ t: 'order' }); break;
      case 'toast': toast(el.dataset.t); break;
      case 'compare-open': if (S.compare.size >= 2) { S.view = 'compare'; renderLog(); log.scrollTop = 0; } break;
      case 'compare-back': S.view = 'chat'; renderLog(); scrollEnd(); break;
      case 'how': push({ t: 'notice', kind: '', title: 'Jak asistent funguje', text: 'Asistent je umělá inteligence. Hledá v katalogu bscom.cz; ceny a dostupnost bere přímo z e-shopu, ne z vlastního odhadu. Může se splést, proto si důležité údaje ověřte na detailu produktu. [Text o zpracování údajů doplní bscom.]' }); break;
    }
  });
  site.addEventListener('change', function (ev) {
    var el = ev.target;
    if (el.dataset && el.dataset.act === 'cmp') {
      var id = el.dataset.id;
      if (el.checked) { if (S.compare.size >= 3) { el.checked = false; toast('Porovnat jde nejvýš 3 produkty'); return; } S.compare.add(id); }
      else S.compare.delete(id);
      renderLog();
    }
  });
  site.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var f = ev.target;
    if (f.id === 'composer') { var q = $('#q'); var v = q.value.trim(); if (!v || S.busy) return; q.value = ''; autosize(q); ask(v); return; }
    if (f.dataset.act === 'watch-save') {
      var e = S.entries[+f.dataset.e], p = PD.products.find(function (x) { return x.id === e.id; });
      var raw = f.querySelector('input').value; e.input = raw;
      var n = parseInt(raw.replace(/\D/g, ''), 10);
      if (!n) e.error = 'Zadejte cílovou cenu v korunách.';
      else if (n >= p.price) e.error = 'Zadejte částku nižší než aktuální cena ' + C.kc(p.price) + '.';
      else { e.error = null; e.done = true; e.target = n; S.watch[e.id] = n; toast('Hlídám cenu'); }
      renderLog();
    }
  });
  site.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.id === 'q') { autosize(t); $('#composer .send').disabled = S.busy || !t.value.trim(); }
    if (t.id === 'hist-q') { S.hq = t.value; var pos = t.selectionStart; renderLog(); var n = $('#hist-q'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } return; }
    if (t.id === 'wf-q') {
      var sug = $('#wf-sug'), v = t.value.trim();
      if (v.length < 3) { sug.hidden = true; return; }
      sug.innerHTML = '<button type="button" class="ask" data-act="open-ask" data-q="' + C.esc(v) + '">' + I('aisearch', 18) + '<span>Zeptat se asistenta: „' + C.esc(v) + '“</span></button>' +
        '<button type="button" class="wire" tabindex="-1">' + I('search', 18) + '<span>[návrhy produktů z našeptávače]</span></button><button type="button" class="wire" tabindex="-1">' + I('search', 18) + '<span>[návrhy kategorií]</span></button>';
      sug.hidden = false;
    }
  });
  site.addEventListener('keydown', function (ev) {
    if (ev.target.id === 'q' && ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); $('#composer').requestSubmit(); }
    if (ev.target.id === 'wf-q' && ev.key === 'Enter') { ev.preventDefault(); var v = ev.target.value.trim(); if (v) { $('#wf-sug').hidden = true; open(v); } }
    if (ev.key === 'Escape' && S.open) close();
  });
  function autosize(t) { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 120) + 'px'; }
  function stripText(i) { var tmp = document.createElement('div'); tmp.innerHTML = S.entries[i].intro; return tmp.textContent; }
  function copy(text, msg) {
    try { navigator.clipboard.writeText(text).then(function () { toast(msg); }, function () { toast(msg + ' (v náhledu nedostupné)'); }); }
    catch (e) { toast(msg + ' (v náhledu nedostupné)'); }
  }

  /* ---------- stavy pro rychlý náhled ---------- */
  var STATES = {
    closed: function () {},
    welcome: function () { S.entries = [{ t: 'welcome' }]; },
    clarify: function () { S.entries = [{ t: 'welcome' }, { t: 'user', text: 'Hledám notebook do školy do 15 000 Kč' }, { t: 'clarify', step: 0, picked: null }]; },
    progress: function () { S.entries = [{ t: 'user', text: 'Hledám notebook do školy do 15 000 Kč' }, { t: 'progress', steps: ['Hledám notebooky kolem 15 000 Kč', 'Kontroluji sklad a doručení', 'Porovnávám parametry'], cur: 2 }]; S.busy = true; },
    answer: function () { S.entries = [{ t: 'user', text: 'Hledám notebook do školy do 15 000 Kč' }, { t: 'answer', intro: 'Vybral jsem 4 notebooky kolem 15 000 Kč, všechny skladem s doručením cca do 1 dne.', ids: ['hp', 'lenovo', 'dell', 'acer'], followups: [{ id: 'cmp2', label: 'Porovnat první dva' }, { id: 'ram16', label: 'Jen s 16 GB RAM' }, { id: 'cheap', label: 'Levnější varianty' }, { id: 'human', label: 'Poradit se s člověkem' }] }]; S.compare = new Set(['hp']); },
    compare: function () { STATES.answer(); S.compare = new Set(['hp', 'lenovo', 'dell']); S.view = 'compare'; },
    watch: function () { STATES.answer(); S.entries.push({ t: 'watch', id: 'hp' }); S.compare = new Set(); },
    empty: function () { S.entries = [{ t: 'user', text: 'vysavač na hrnky' }]; pushNoResults('vysavač na hrnky'); },
    error: function () { S.entries = [{ t: 'user', text: 'Hledám notebook do školy do 15 000 Kč' }]; pushError(); },
    handoff: function () { S.entries = [{ t: 'user', text: 'Chci mluvit s člověkem' }, { t: 'handoff' }]; },
    login: function () { S.entries = [{ t: 'user', text: 'Jaký je stav mé objednávky?' }, { t: 'login' }]; },
    order: function () { S.logged = true; S.entries = [{ t: 'user', text: 'Jaký je stav mé objednávky?' }, { t: 'order' }]; },
    history: function () {
      var now = Date.now(), H = 36e5;
      var ex = [
        { id: 'ex1', title: 'Hledám notebook do školy do 15 000 Kč', icon: 'laptop', at: now - 2 * H, entries: [{ t: 'user', text: 'Hledám notebook do školy do 15 000 Kč' }, { t: 'answer', intro: 'Vybral jsem 4 notebooky kolem 15 000 Kč, všechny skladem s doručením cca do 1 dne.', ids: ['hp', 'lenovo', 'dell', 'acer'], followups: [{ id: 'cmp2', label: 'Porovnat první dva' }, { id: 'ram16', label: 'Jen s 16 GB RAM' }] }] },
        { id: 'ex2', title: 'Jaký je stav mé objednávky?', icon: 'box', at: now - 26 * H, entries: [{ t: 'user', text: 'Jaký je stav mé objednávky?' }, { t: 'login' }] },
        { id: 'ex3', title: 'Chci mluvit s člověkem', icon: 'headset', at: now - 4 * 24 * H, entries: [{ t: 'user', text: 'Chci mluvit s člověkem' }, { t: 'handoff' }] }
      ];
      ex.forEach(function (h) { h.summary = summaryOf(h.entries); });
      S.history = ex.concat(S.history.filter(function (h) { return !/^ex\d/.test(h.id); }));
      S.entries = [{ t: 'welcome' }]; S.view = 'history';
    }
  };
  function setState(k) {
    clearTimers();
    var keep = { bubbles: S.bubbles, cart: S.cart, inCart: S.inCart };
    S = fresh(); S.bubbles = keep.bubbles; S.cart = keep.cart; S.inCart = keep.inCart;
    panel = null;
    if (k !== 'closed') { S.open = true; STATES[k](); }
    renderPanel();
    var last = S.entries[S.entries.length - 1];
    if (last && last.t === 'answer' && log) { var el = log.querySelector('[data-i="' + (S.entries.length - 1) + '"]'); requestAnimationFrame(function () { log.scrollTop = el.offsetTop - 12; }); }
    else scrollEnd();
  }

  /* ---------- lišta: šířka, stav, varianta ---------- */
  var widths = { fit: 0, d: 1362, t: 820, m: 375 }, cur = 'fit';
  function layout() {
    var stage = $('#stage'), wrap = $('#scaler');
    var aw = stage.clientWidth, ah = stage.clientHeight - 52;
    var w = widths[cur] || aw;
    var s = Math.min(1, aw / w);
    site.style.width = w + 'px';
    site.style.height = Math.floor(ah / s) + 'px';
    site.style.transform = s < 1 ? 'scale(' + s + ')' : '';
    site.style.transformOrigin = 'top left';
    wrap.style.width = Math.floor(w * s) + 'px';
    wrap.style.height = Math.floor(ah) + 'px';
    $('#frame-label').textContent = (cur === 'fit' ? 'Přizpůsobeno oknu · ' : '') + w + ' px' + (s < 1 ? ' · měřítko ' + Math.round(s * 100) + ' %' : '');
  }
  $('#widths').addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    cur = b.dataset.w;
    this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    layout();
  });
  $('#state').addEventListener('change', function () { setState(this.value); });
  $('#variant').addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    S.bubbles = b.dataset.v === 'bubbles';
    this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    if (panel) panel.classList.toggle('bubbles', S.bubbles);
  });
  $('#reset').addEventListener('click', function () { S.cart = 0; S.inCart = new Set(); S.history = []; saveHistory(); renderSite(); setState('closed'); $('#state').value = 'closed'; });
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 60); });

  renderSite();
  layout();
  renderPanel();
})();
