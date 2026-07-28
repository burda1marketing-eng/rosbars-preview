/* rosbars MVP-прототип — клиентский JS (без сервера, без localStorage). */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML;}

  /* ---- Sticky header shrink ---- */
  var hdr = $('.hdr');
  if (hdr) window.addEventListener('scroll', function () { hdr.classList.toggle('shrink', window.scrollY > 120); }, { passive: true });

  /* ---- Мегаменю «Экспертизы» ---- */
  var megaBtn = $('#mega-btn'), mega = $('#mega');
  if (megaBtn && mega) {
    var wrap = megaBtn.closest('li'), megaTimer;
    function openMega(o){ mega.classList.toggle('open', o); megaBtn.setAttribute('aria-expanded', o?'true':'false'); }
    function schedClose(){ clearTimeout(megaTimer); megaTimer=setTimeout(function(){openMega(false);},200); }
    function cancelClose(){ clearTimeout(megaTimer); }
    [wrap, mega].forEach(function(el){
      el.addEventListener('mouseenter', function(){ cancelClose(); openMega(true); });
      el.addEventListener('mouseleave', schedClose);
    });
    megaBtn.addEventListener('click', function(e){ e.preventDefault(); openMega(!mega.classList.contains('open')); });
    $$('.mega__groups a', mega).forEach(function (b) {
      b.addEventListener('mouseenter', function () { switchGroup(b.getAttribute('data-g')); });
      b.addEventListener('click', function () { switchGroup(b.getAttribute('data-g')); });
    });
    function switchGroup(g){
      $$('.mega__groups a', mega).forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-g')===g); });
      $$('.mega__panel', mega).forEach(function(p){ p.classList.toggle('hide', p.getAttribute('data-g')!==g); });
    }
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') openMega(false); });
  }

  /* ---- Мобильное меню ---- */
  var burger = $('.burger'), mmenu = $('#mmenu');
  if (burger && mmenu) {
    burger.addEventListener('click', function(){ mmenu.classList.add('open'); document.body.style.overflow='hidden'; });
    var mc = $('.mmenu__close', mmenu);
    if (mc) mc.addEventListener('click', function(){ mmenu.classList.remove('open'); document.body.style.overflow=''; });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ mmenu.classList.remove('open'); document.body.style.overflow=''; } });
  }

  /* ---- Переключатель города ---- */
  var CITY = {
    moscow: { name:'Москва', phone:'8 (800) 200-80-35', addr:'119019, Москва, Никитский бульвар, д. 8а' },
    krasnodar: { name:'Краснодар', phone:'8 (800) 200-80-35', addr:'350000, Краснодар, ул. Красная, д. 176 (филиал)' }
  };
  function setCity(key){
    var c = CITY[key]; if(!c) return;
    $$('.js-city-phone').forEach(function(e){ e.textContent=c.phone; if(e.tagName==='A') e.href='tel:'+c.phone.replace(/\D/g,''); });
    $$('.js-city-addr').forEach(function(e){ e.textContent=c.addr; });
    $$('.js-city-name').forEach(function(e){ e.textContent=c.name; });
    $$('[data-city]').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-city')===key); });
    $$('.city-block').forEach(function(bl){ bl.classList.toggle('hl', bl.getAttribute('data-city')===key); });
    var g=$('.geo'); if(g) g.classList.remove('open');
  }
  $$('[data-city]').forEach(function(b){ b.addEventListener('click', function(){ setCity(b.getAttribute('data-city')); }); });
  var geoBtn=$('.geo__btn');
  if(geoBtn){
    geoBtn.addEventListener('click', function(e){ e.stopPropagation(); var g=$('.geo'); var o=g.classList.toggle('open'); geoBtn.setAttribute('aria-expanded', o?'true':'false'); });
    document.addEventListener('click', function(){ var g=$('.geo'); if(g) g.classList.remove('open'); });
  }

  /* ---- Поиск по видам (список ul[data-search]) ---- */
  var searchInput = $('#type-search');
  if (searchInput) {
    var items = $$('[data-search-item]');
    searchInput.addEventListener('input', function(){
      var q = this.value.toLowerCase().replace(/ё/g,'е');
      items.forEach(function(it){
        var t = (it.getAttribute('data-name')||it.textContent).toLowerCase().replace(/ё/g,'е');
        it.style.display = (!q || t.indexOf(q)!==-1) ? '' : 'none';
      });
      $$('[data-search-group]').forEach(function(gr){
        var any = $$('[data-search-item]', gr).some(function(x){ return x.style.display!=='none'; });
        gr.style.display = any ? '' : 'none';
      });
    });
  }

  /* ---- Таблица цен: поиск + фильтр по группе ---- */
  var priceSearch = $('#price-search'), priceGroup = $('#price-group'), priceTable = $('#price-table');
  if (priceTable) {
    function filterPrice(){
      var q = (priceSearch ? priceSearch.value : '').toLowerCase().replace(/ё/g,'е');
      var g = priceGroup ? priceGroup.value : '';
      $$('tbody tr', priceTable).forEach(function(tr){
        if (tr.classList.contains('price-group-row')) return;
        var name = (tr.getAttribute('data-name')||'').toLowerCase().replace(/ё/g,'е');
        var grp = tr.getAttribute('data-group')||'';
        var ok = (!q || name.indexOf(q)!==-1) && (!g || grp===g);
        tr.style.display = ok ? '' : 'none';
      });
    }
    if (priceSearch) priceSearch.addEventListener('input', filterPrice);
    if (priceGroup) priceGroup.addEventListener('change', filterPrice);
  }

  /* ---- Фильтр кейсов (теги) ---- */
  var caseFilter = $('#case-filter');
  if (caseFilter) {
    var active = [];
    var counter = $('#case-count');
    function applyCases(){
      var cards = $$('[data-case]');
      var shown = 0;
      cards.forEach(function(card){
        var tags = (card.getAttribute('data-tags')||'').split('|');
        var ok = active.length===0 || active.some(function(a){ return tags.indexOf(a)!==-1; });
        card.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      if (counter) counter.textContent = shown;
      var empty = $('#case-empty'); if (empty) empty.style.display = shown ? 'none':'block';
    }
    $$('.tag', caseFilter).forEach(function(t){
      t.addEventListener('click', function(){
        var v = t.getAttribute('data-tag');
        var i = active.indexOf(v);
        if (i===-1){ active.push(v); t.classList.add('on'); } else { active.splice(i,1); t.classList.remove('on'); }
        applyCases();
      });
    });
    var reset = $('#case-reset');
    if (reset) reset.addEventListener('click', function(){ active=[]; $$('.tag',caseFilter).forEach(function(t){t.classList.remove('on');}); applyCases(); });
  }

  /* ---- Вкладки формы + предвыбор из URL ---- */
  $$('form[data-request]').forEach(function (f) {
    var tabs = $$('.form-tab', f);
    var scenarioField = $('.js-scenario', f);
    function setTab(val){
      tabs.forEach(function(t){ t.classList.toggle('on', t.getAttribute('data-scenario')===val); });
      if (scenarioField) scenarioField.value = val;
    }
    tabs.forEach(function(t){ t.addEventListener('click', function(){ setTab(t.getAttribute('data-scenario')); }); });
    // preselect from ?scenario= & ?vid=
    var p = new URLSearchParams(location.search);
    if (p.get('scenario')) setTab(p.get('scenario'));
    var vidField = $('.js-vid', f);
    if (vidField && p.get('vid')) { vidField.value = decodeURIComponent(p.get('vid')); }
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var bad = false;
      $$('[required]', f).forEach(function(el){
        var wrap = el.closest('.field');
        var empty = el.type==='checkbox' ? !el.checked : !el.value.trim();
        if (wrap) wrap.classList.toggle('err', empty);
        if (empty) bad = true;
      });
      if (bad) return;
      var ok = $('.form-ok', f);
      if (ok){ ok.classList.add('show'); ok.scrollIntoView({behavior:'smooth',block:'center'}); }
      $$('input,textarea,select,button', f).forEach(function(el){ if(el.type!=='checkbox'&&el.tagName!=='SELECT') el.value=''; if(el.tagName==='BUTTON') el.disabled=true; });
    });
  });

  /* ---- Модальная форма заявки ---- */
  (function(){
    var m=$('#req-modal'); if(!m) return;
    function open(scenario,vid){
      m.hidden=false; document.body.style.overflow='hidden';
      var f=m.querySelector('form');
      if(f&&scenario){ var tb=f.querySelector('.form-tab[data-scenario="'+scenario+'"]'); if(tb) tb.click(); }
      if(f&&vid){ var sel=f.querySelector('.js-vid'); if(sel){ for(var i=0;i<sel.options.length;i++){ if((sel.options[i].text||'').indexOf(vid)!==-1){ sel.selectedIndex=i; break; } } } }
      var inp=f?f.querySelector('input'):null; if(inp) inp.focus();
    }
    function close(){ m.hidden=true; document.body.style.overflow=''; }
    m.addEventListener('click',function(e){ if(e.target===m) close(); });
    var cb=m.querySelector('.modal__close'); if(cb) cb.addEventListener('click',close);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!m.hidden) close(); });
    document.addEventListener('click',function(e){
      var a=e.target.closest?e.target.closest('a[href*="zayavka.html"]'):null;
      if(!a) return;
      e.preventDefault();
      var qs=(a.getAttribute('href').split('?')[1]||'');
      var p=new URLSearchParams(qs);
      var mm=$('#mmenu'); if(mm){ mm.classList.remove('open'); }
      open(p.get('scenario'), p.get('vid')?decodeURIComponent(p.get('vid')):'');
    });
  })();

  /* ---- FAQ: один открыт, первый по умолчанию ---- */
  $$('.faq').forEach(function(faq){
    var items = $$('details', faq);
    if (items[0]) items[0].open = true;
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if (d.open) items.forEach(function(o){ if(o!==d) o.open=false; });
      });
    });
  });

  /* ---- Лайтбокс документов ---- */
  var docs = $$('.doc');
  if (docs.length) {
    var lb = document.createElement('div'); lb.className='lightbox';
    lb.innerHTML='<button class="lb-close" aria-label="Закрыть">×</button><button class="lb-prev" aria-label="Назад">‹</button><img alt="Документ"><button class="lb-next" aria-label="Вперёд">›</button>';
    document.body.appendChild(lb);
    var img=lb.querySelector('img'), srcs=docs.map(function(d){var i=d.querySelector('img');return i?i.src:'';}), idx=0;
    function show(i){idx=(i+srcs.length)%srcs.length;img.src=srcs[idx];}
    function open(i){show(i);lb.classList.add('open');document.body.style.overflow='hidden';}
    function close(){lb.classList.remove('open');document.body.style.overflow='';}
    docs.forEach(function(d,i){d.setAttribute('tabindex','0');d.addEventListener('click',function(){open(i);});d.addEventListener('keydown',function(e){if(e.key==='Enter'){open(i);}});});
    lb.querySelector('.lb-close').addEventListener('click',close);
    lb.querySelector('.lb-prev').addEventListener('click',function(){show(idx-1);});
    lb.querySelector('.lb-next').addEventListener('click',function(){show(idx+1);});
    lb.addEventListener('click',function(e){if(e.target===lb)close();});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1);});
  }

  /* ================= Виджет-помощник (сценарное дерево) ================= */
  var U = window.SITE_BASE || '';
  var TREE = {
    root: { m:'Здравствуйте. Помогу выбрать экспертизу, сориентирую по стоимости и срокам или подскажу, как оспорить чужое заключение. Что вам ближе?',
      o:[
        {t:'Нужна экспертиза для суда', go:'sud'},
        {t:'Не согласен с экспертизой', go:'recenz'},
        {t:'Сколько это стоит', go:'price'},
        {t:'Другой вопрос', go:'other'}
      ]},
    sud: { m:'По какому направлению нужна экспертиза?',
      o:[
        {t:'Строительная (залив, качество работ)', go:'sud_str'},
        {t:'Оценочная (ущерб, стоимость)', go:'sud_oc'},
        {t:'Почерковедческая (подпись)', go:'sud_poch'},
        {t:'Другое направление', go:'sud_other'}
      ]},
    sud_str:{ m:'Строительная экспертиза — от 25 000 ₽, срок от 5 рабочих дней. Например, «Экспертиза причин залива». Открыть страницу или сразу оставить заявку?',
      o:[{t:'Открыть «Причины залива»', link:'prichiny-zaliva.html'},{t:'Все строительные виды', link:'stroitelnaya-ekspertiza.html'},{t:'Оставить заявку', link:'zayavka.html?scenario=sud'}]},
    sud_oc:{ m:'Оценочная экспертиза — от 8 000 ₽, срок от 3 рабочих дней. Определяем стоимость и размер ущерба.',
      o:[{t:'Открыть раздел «Оценочная»', link:'ekspertizy.html'},{t:'Оставить заявку', link:'zayavka.html?scenario=sud'}]},
    sud_poch:{ m:'Почерковедческая экспертиза — от 15 000 ₽, срок 5–10 дней. Устанавливаем исполнителя подписи.',
      o:[{t:'Оставить заявку', link:'zayavka.html?scenario=sud'},{t:'Все виды экспертиз', link:'ekspertizy.html'}]},
    sud_other:{ m:'Направлений больше 60 — они собраны в каталоге. Подобрать вид удобно там, либо оставьте заявку и эксперт поможет с формулировкой.',
      o:[{t:'Каталог экспертиз', link:'ekspertizy.html'},{t:'Оставить заявку', link:'zayavka.html?scenario=sud'}]},
    recenz:{ m:'Чужое заключение можно оспорить рецензией — эксперт разбирает методические нарушения. На какое заключение нужна рецензия?',
      o:[{t:'На строительную', link:'recenzii.html'},{t:'На оценочную', link:'recenzii.html'},{t:'На почерковедческую', link:'recenzii.html'},{t:'Перейти в раздел «Рецензии»', link:'recenzii.html'}]},
    price:{ m:'Стоимость зависит от вида, объёма материалов и сроков. Ориентиры и полная таблица — на странице «Стоимость и сроки».',
      o:[{t:'Открыть таблицу цен', link:'stoimost.html'},{t:'Рассчитать по моей задаче', link:'zayavka.html?scenario=price'}]},
    other:{ m:'Оставьте контакт — эксперт перезвонит в рабочее время (Пн–Сб, 09:00–19:00). Или позвоните 8 (800) 200-80-35, звонок бесплатный.',
      o:[{t:'Оставить заявку', link:'zayavka.html'},{t:'Контакты и адреса', link:'kontakty.html'}]}
  };

  function buildHelper(){
    var fab = document.createElement('button');
    fab.className='hlp-fab'; fab.setAttribute('aria-label','Открыть помощника');
    fab.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 11.5a8.5 8.5 0 01-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1121 11.5z"/><path d="M12 7.3l.9 1.9 2.1.3-1.5 1.5.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.5 2.1-.3z" fill="currentColor" stroke="none"/></svg>AI-консультант';
    var panel=document.createElement('div'); panel.className='hlp-panel'; panel.setAttribute('role','dialog'); panel.setAttribute('aria-label','Помощник');
    panel.innerHTML='<div class="hlp-head"><span class="av"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 11.5a8.5 8.5 0 01-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1121 11.5z"/></svg></span><span><b>AI-консультант</b><span>Помощник центра · на связи</span></span><button class="hlp-close" aria-label="Закрыть">×</button></div><div class="hlp-body" id="hlp-body"></div><div class="hlp-foot"><button class="hlp-back" id="hlp-back" title="В начало" style="flex-shrink:0">↺</button><input id="hlp-input" type="text" placeholder="Задайте вопрос…" autocomplete="off" style="flex:1;height:40px;border:1px solid var(--shellstone);border-radius:20px;padding:0 14px;font-family:var(--sans);font-size:14px"><button id="hlp-send" aria-label="Отправить" style="flex-shrink:0;width:40px;height:40px;border-radius:50%;background:var(--seal-blue);color:#fff;border:none;cursor:pointer">→</button></div>';
    document.body.appendChild(fab); document.body.appendChild(panel);
    var body=$('#hlp-body',panel);
    function scrollB(){ body.scrollTop=body.scrollHeight; }
    if(!document.getElementById('hlp-anim-style')){
      var st=document.createElement('style'); st.id='hlp-anim-style';
      st.textContent='.hlp-typing{align-self:flex-start;background:#fff;border:1px solid rgba(20,40,80,.1);border-radius:14px;border-bottom-left-radius:4px;padding:13px 15px;display:flex;gap:5px;animation:hlpin .25s ease}'
        +'.hlp-typing span{width:7px;height:7px;border-radius:50%;background:#9aa4b2;animation:hlpblink 1.1s infinite}'
        +'.hlp-typing span:nth-child(2){animation-delay:.18s}.hlp-typing span:nth-child(3){animation-delay:.36s}'
        +'@keyframes hlpblink{0%,70%,100%{opacity:.3;transform:translateY(0)}35%{opacity:.95;transform:translateY(-4px)}}'
        +'.hlp-msg{animation:hlpin .28s ease}@keyframes hlpin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'
        +'.hlp-opt{opacity:0;animation:hlpin .3s ease forwards}'
        +'.hlp-fab{position:fixed}.hlp-fab::after{content:"";position:absolute;top:-2px;right:-2px;width:12px;height:12px;border-radius:50%;background:#E5484D;border:2px solid #fff;animation:hlppulse 2.2s infinite}'
        +'@keyframes hlppulse{0%{box-shadow:0 0 0 0 rgba(229,72,77,.5)}70%{box-shadow:0 0 0 9px rgba(229,72,77,0)}100%{box-shadow:0 0 0 0 rgba(229,72,77,0)}}';
      document.head.appendChild(st);
    }
    function user(t){var m=document.createElement('div');m.className='hlp-msg user';m.textContent=t;body.appendChild(m);scrollB();}
    function typing(){var d=document.createElement('div');d.className='hlp-typing';d.innerHTML='<span></span><span></span><span></span>';body.appendChild(d);scrollB();return d;}
    // потоковый вывод: слова проявляются по очереди (как в реальном AI-чате), ссылки/HTML сохраняются
    function streamWords(el, done){
      var walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];
      while(walker.nextNode()) nodes.push(walker.currentNode);
      var spans=[];
      nodes.forEach(function(node){
        if(!node.nodeValue) return;
        var frag=document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function(tok){
          if(tok==='') return;
          if(/^\s+$/.test(tok)){ frag.appendChild(document.createTextNode(tok)); }
          else { var sp=document.createElement('span'); sp.textContent=tok; sp.style.opacity='0'; sp.style.transition='opacity .12s ease'; frag.appendChild(sp); spans.push(sp); }
        });
        if(node.parentNode) node.parentNode.replaceChild(frag,node);
      });
      var i=0;
      (function step(){
        if(i>=spans.length){ if(done) done(); return; }
        spans[i].style.opacity='1'; i++;
        if(i%2===0) scrollB();
        setTimeout(step, 22);
      })();
    }
    function bot(t, cb){
      var ind=typing();
      var plain=String(t).replace(/<[^>]+>/g,'');
      setTimeout(function(){
        ind.remove();
        var m=document.createElement('div');m.className='hlp-msg bot';m.innerHTML=t;body.appendChild(m);scrollB();
        streamWords(m, cb);
      }, Math.min(1200, 420 + plain.length*6));
    }
    function opts(list){
      var w=document.createElement('div');w.className='hlp-opts';
      list.forEach(function(o,idx){
        var b=document.createElement('button');b.className='hlp-opt';b.textContent=o.t;b.style.animationDelay=(idx*60)+'ms';
        b.addEventListener('click',function(){
          user(o.t);
          if(o.link){ bot('Открываю: <a href="'+U+o.link+'">'+esc(o.t)+'</a>'); setTimeout(function(){location.href=U+o.link;},650); }
          else if(o.go){ go(o.go); }
        });
        w.appendChild(b);
      });
      body.appendChild(w);scrollB();
    }
    function go(key){var n=TREE[key];if(!n)return;bot(n.m, function(){ opts(n.o); });}
    var started=false;
    function open(){panel.classList.add('open');fab.style.display='none';if(!started){started=true;go('root');}}
    function close(){panel.classList.remove('open');fab.style.display='flex';}
    // Свободный вопрос → поиск по базе FAQ (window.FAQ)
    function searchFaq(q){
      var t=q.toLowerCase().replace(/ё/g,'е');
      var words=t.split(/[^а-яa-z0-9]+/).filter(function(w){return w.length>3;});
      var best=null, score=0;
      (window.FAQ||[]).forEach(function(item){
        var hay=(item.q+' '+item.a).toLowerCase().replace(/ё/g,'е');
        var s=0; words.forEach(function(w){ if(hay.indexOf(w)!==-1) s++; });
        if(item.q.toLowerCase().replace(/ё/g,'е').indexOf(t)!==-1) s+=4;
        if(s>score){score=s;best=item;}
      });
      return score>0?best:null;
    }
    var input=$('#hlp-input',panel);
    function ask(q){
      user(q);
      var f=searchFaq(q);
      if(f){ bot('<b>'+esc(f.q)+'</b><br><br>'+esc(f.a)+'<br><br><a href="'+U+'faq.html">Все вопросы →</a> · <a href="'+U+'zayavka.html">Оставить заявку</a>'); }
      else { bot('Не нашёл точного ответа. Загляните в <a href="'+U+'faq.html">частые вопросы</a> или оставьте заявку — эксперт ответит. Тел. 8 800 200-80-35.'); }
    }
    fab.addEventListener('click',open);
    $('.hlp-close',panel).addEventListener('click',close);
    $('#hlp-back',panel).addEventListener('click',function(){body.innerHTML='';started=true;go('root');});
    $('#hlp-send',panel).addEventListener('click',function(){var v=input.value.trim();if(!v)return;input.value='';ask(v);});
    input.addEventListener('keydown',function(e){if(e.key==='Enter'){var v=input.value.trim();if(!v)return;input.value='';ask(v);}});
  }
  buildHelper();

  /* ---- Переключатель дизайна (сравнение трёх версий прототипа) ---- */
  (function(){
    try{
      var p = location.pathname;
      var isV2 = /(^|\/)v2\//.test(p), isV3 = /(^|\/)v3\//.test(p);
      var cur = isV2 ? 2 : (isV3 ? 3 : 1);
      var base = (isV2 || isV3) ? '../' : '';
      var file = p.split('/').pop() || 'index.html';
      var targets = [ cur===1?file:base+file, cur===2?file:base+'v2/'+file, cur===3?file:base+'v3/'+file ];
      var names = ['Классический','monday.com','Light blue'];
      var wrap = document.createElement('div');
      wrap.setAttribute('aria-label','Переключатель дизайна прототипа');
      wrap.style.cssText='position:fixed;left:16px;bottom:20px;z-index:120;display:inline-flex;align-items:center;gap:4px;background:#fff;border:1px solid #d9dee6;border-radius:999px;padding:5px 7px 5px 13px;box-shadow:0 8px 28px rgba(6,36,59,.18);font:600 12px/1 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif';
      var lbl=document.createElement('span'); lbl.textContent='Дизайн'; lbl.style.cssText='color:#6B7280;margin-right:5px;letter-spacing:.02em';
      wrap.appendChild(lbl);
      [1,2,3].forEach(function(n,i){
        var cu = (n===cur);
        var el = cu ? document.createElement('span') : document.createElement('a');
        if(!cu){ el.href = targets[i]; }
        el.textContent = n;
        el.title = 'Дизайн '+n+' · '+names[i];
        el.style.cssText='display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;text-decoration:none;transition:background .15s;'+(cu?'background:#06243B;color:#fff;':'color:#1A1A1A;background:#F1F4F8;');
        if(!cu){ el.onmouseenter=function(){el.style.background='#E2E8F0';}; el.onmouseleave=function(){el.style.background='#F1F4F8';}; }
        wrap.appendChild(el);
      });
      document.body.appendChild(wrap);
    }catch(e){}
  })();

  /* ---- Глобальный слой bento-полировки: hover, красные акценты, каскад ---- */
  (function(){
    if(document.getElementById('bento-style')) return;
    var st=document.createElement('style'); st.id='bento-style';
    st.textContent=
      '.dir,.card,.sit,.media-card,.city-block,.case,.expert{will-change:transform}'
      +'.dir:hover,.card:hover,.media-card:hover,.city-block:hover{transform:translateY(-5px) scale(1.012)}'
      +'.dir__ic,.card__ic,.sit__ic{transition:transform .28s cubic-bezier(.2,.8,.2,1)}'
      +'.dir:hover .dir__ic,.card:hover .card__ic,.sit:hover .sit__ic{transform:scale(1.12) rotate(-4deg)}'
      +'.ic{overflow:visible}'
      +'.sit:hover .sit__ar,.card:hover .card__meta .a,.arrow:hover .a,.dir:hover .arrow .a{color:#E5484D}'
      +'.eyebrow::before{content:"";display:inline-block;width:20px;height:2px;background:#D64550;border-radius:2px;margin-right:8px;vertical-align:middle}'
      +'.sec--dark .eyebrow::before{background:#FF6B6B}'
      +'.reveal{opacity:0;transform:translateY(22px);transition:opacity .6s cubic-bezier(.2,.7,.2,1),transform .6s cubic-bezier(.2,.7,.2,1)}'
      +'.reveal.in{opacity:1;transform:none}'
      +'@media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}';
    document.head.appendChild(st);
  })();

  /* ---- Анимация блоков при скролле: каскад карточек + счётчики (bento) ---- */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    $$('main > section').forEach(function (s, i) { if (i >= 1) { s.classList.add('reveal'); io.observe(s); } });
    // каскадное появление карточек внутри сеток
    $$('.dirs > *, .cards > *, .sits > *, .grid-3 > *, .grid-2 > *, .experts > *, .steps > *, .docs > *, .theses > *').forEach(function (el, i) {
      el.classList.add('reveal'); el.style.transitionDelay = ((i % 6) * 55) + 'ms'; io.observe(el);
    });
    // счётчики статистики (count-up)
    var countUp = function (el) {
      var raw = el.textContent.trim(), m = raw.match(/^([\d\s ]+)(.*)$/); if (!m) return;
      var target = parseInt(m[1].replace(/\D/g, ''), 10), suf = m[2] || ''; if (!target) return;
      var grouped = /\d[\s ]\d/.test(raw); // год «2014» — без разделителя; «12 386» — с разделителем
      var fmt = function(n){ return grouped ? n.toLocaleString('ru-RU') : String(n); };
      var dur = 1100, start = null;
      function tick(ts){ if(start===null)start=ts; var pr=Math.min(1,(ts-start)/dur), eased=1-Math.pow(1-pr,3);
        el.textContent=fmt(Math.floor(eased*target))+suf;
        if(pr<1) requestAnimationFrame(tick); else el.textContent=fmt(target)+suf; }
      requestAnimationFrame(tick);
    };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    $$('.stat__n').forEach(function (n) { cio.observe(n); });
  }
})();
