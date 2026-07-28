/* АНО ИЦ «Независимая Экспертиза» — интерактив: меню, галерея, формы, ИИ-помощник */
(function () {
  'use strict';

  /* ---------- Мобильное меню ---------- */
  var burger = document.querySelector('.burger');
  var mnav = document.querySelector('.mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Галерея сертификатов (lightbox) ---------- */
  var certs = Array.prototype.slice.call(document.querySelectorAll('.cert'));
  if (certs.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lightbox__close" aria-label="Закрыть">×</button>' +
      '<button class="lightbox__nav lightbox__prev" aria-label="Предыдущий">‹</button>' +
      '<img alt="Сертификат">' +
      '<button class="lightbox__nav lightbox__next" aria-label="Следующий">›</button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var idx = 0;
    var srcs = certs.map(function (c) {
      var im = c.querySelector('img');
      return im ? (im.getAttribute('data-full') || im.src) : '';
    });
    function show(i) { idx = (i + srcs.length) % srcs.length; lbImg.src = srcs[idx]; }
    function open(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
    certs.forEach(function (c, i) {
      c.addEventListener('click', function () { open(i); });
      c.setAttribute('tabindex', '0');
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
    });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lightbox__next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- Формы заявки ---------- */
  Array.prototype.slice.call(document.querySelectorAll('form[data-request]')).forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = f.querySelector('.form__ok');
      if (ok) { ok.classList.add('show'); }
      f.querySelectorAll('input,textarea,select,button').forEach(function (el) {
        if (el.type !== 'checkbox') el.value = '';
        if (el.tagName === 'BUTTON') el.disabled = true;
      });
      if (ok) ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* ================= ИИ-помощник ================= */
  var BASE = (window.SITE_BASE || '');
  function u(p) { return BASE + p; }

  var KB = [
    { k: ['привет', 'здравств', 'добр', 'hello'], a: 'Здравствуйте. Подскажу по видам экспертиз, срокам и стоимости, помогу оставить заявку. С чего начнём?' },
    { k: ['вид', 'услуг', 'эксперт', 'какие', 'делаете', 'проводите'], a: 'Центр проводит судебные и досудебные экспертизы: строительно-техническую, почерковедческую, оценочную, автотехническую, товароведческую, экономическую, инженерно-техническую и другие. Полный каталог с ценами — на <a href="' + u('uslugi.html') + '">странице «Услуги»</a>.' },
    { k: ['строит', 'ремонт', 'залив', 'смет', 'дефект', 'качество работ'], a: 'Строительно-техническая экспертиза: качество и объём работ, дефекты, сметы, причины залива. Досудебное исследование — от 30 000 ₽. Подробнее: <a href="' + u('uslugi-stroitelnaya.html') + '">строительная экспертиза</a>.' },
    { k: ['почерк', 'подпись', 'подлинн', 'рукопис'], a: 'Почерковедческая экспертиза устанавливает исполнителя подписи или записи. От 15 000 ₽, срок 5–10 дней. Подробнее: <a href="' + u('uslugi-pocherkovedcheskaya.html') + '">почерковедческая экспертиза</a>.' },
    { k: ['оцен', 'стоимость имущест', 'недвижим', 'ущерб', 'кадастр'], a: 'Оценочная экспертиза: рыночная стоимость недвижимости, оборудования, бизнеса, размер ущерба. От 5 000 ₽ за оценку. Подробнее: <a href="' + u('uslugi-ocenochnaya.html') + '">оценочная экспертиза</a>.' },
    { k: ['авто', 'дтп', 'машин', 'трасолог', 'транспорт'], a: 'Автотехническая экспертиза: обстоятельства ДТП, стоимость ремонта, трасология. От 15 000 ₽. Подробнее: <a href="' + u('uslugi-avtotehnicheskaya.html') + '">автотехническая экспертиза</a>.' },
    { k: ['товаровед', 'товар', 'брак', 'соответств'], a: 'Товароведческая экспертиза: качество, соответствие и стоимость товаров. От 15 000 ₽. Подробнее: <a href="' + u('uslugi-tovarovedcheskaya.html') + '">товароведческая экспертиза</a>.' },
    { k: ['эконом', 'бухгалт', 'финанс', 'ущерб бизнес', 'сделк'], a: 'Экономическая (финансово-бухгалтерская) экспертиза: анализ сделок и расчётов, размер ущерба. От 30 000 ₽. Подробнее: <a href="' + u('uslugi-ekonomicheskaya.html') + '">экономическая экспертиза</a>.' },
    { k: ['инженер', 'электр', 'лэп', 'энергоаудит', 'счётчик', 'счетчик', 'оборудован'], a: 'Инженерно-техническая экспертиза: сети и коммуникации, электротехника, промышленное оборудование, энергоаудит. От 25 000 ₽. Подробнее: <a href="' + u('uslugi-inzhenernaya.html') + '">инженерно-техническая экспертиза</a>.' },
    { k: ['цен', 'стоим', 'скольк', 'прайс', 'руб', 'дорог'], a: 'Стоимость зависит от вида экспертизы, числа объектов и сроков. Ориентиры: почерковедческая — от 15 000 ₽, автотехническая — от 15 000 ₽, строительная — от 30 000 ₽. Полный прайс: <a href="' + u('uslugi.html') + '">страница «Услуги»</a>. Точную цену назовёт эксперт после короткой консультации.' },
    { k: ['срок', 'быстр', 'когда готов', 'сколько дел', 'время'], a: 'Срок зависит от вида: почерковедческая — 5–10 дней, строительная и оценочная — 7–15 дней, сложные комплексные — до 20–30 дней. Точный срок фиксируем в договоре.' },
    { k: ['заявк', 'заказ', 'оформ', 'обрат', 'консультац', 'связ'], a: 'Оставьте заявку — эксперт перезвонит, уточнит задачу и оценит стоимость и срок. Форма на <a href="' + u('kontakty.html') + '">странице «Контакты»</a> или звоните 8 800 200-80-35 (бесплатно).' },
    { k: ['суд', 'досудеб', 'разница', 'отлич', 'внесудеб'], a: 'Досудебное исследование заказывает сторона до или вне процесса. Судебная экспертиза назначается определением суда, эксперт предупреждается об ответственности по ст. 307 УК РФ. Проводим оба вида; заключения соответствуют 73-ФЗ.' },
    { k: ['доверя', 'гарант', 'лиценз', 'аккредит', 'надёжн', 'надежн', 'квалификац', 'опыт'], a: '10 лет работы, 12 386 проведённых экспертиз (6 301 судебная), 50 экспертов, член ТПП Москвы. Эксперты аттестованы, заключения принимают суды всех инстанций. Подробнее и сертификаты: <a href="' + u('o-tsentre.html') + '">о центре</a>.' },
    { k: ['рецензи', 'оспор', 'заключение эксперт'], a: 'Делаем рецензии на заключения экспертов сторонних организаций — для оспаривания в суде. Стоимость — от 15 000 ₽. Оставьте заявку, и эксперт оценит перспективы.' },
    { k: ['контакт', 'адрес', 'где наход', 'телефон', 'почта', 'метро', 'время работ', 'график'], a: 'Москва, Никитский бульвар, д. 8а (1 мин от м. Арбатская). Тел.: +7 968 987-87-78, 8 800 200-80-35. Почта: info@rosbars.ru. Пн–Сб, 09:00–19:00. Карта — на <a href="' + u('kontakty.html') + '">странице «Контакты»</a>.' },
    { k: ['кейс', 'пример', 'практик', 'дел'], a: 'Примеры выполненных экспертиз с результатами — в разделе <a href="' + u('keysy.html') + '">«Кейсы»</a>.' }
  ];

  var CHIPS = [
    { t: 'Виды экспертиз', q: 'какие виды экспертиз' },
    { t: 'Стоимость', q: 'сколько стоит' },
    { t: 'Сроки', q: 'какие сроки' },
    { t: 'Оставить заявку', q: 'как оставить заявку' },
    { t: 'Контакты', q: 'контакты и адрес' }
  ];

  function norm(s) { return (s || '').toLowerCase().replace(/ё/g, 'е'); }
  function answer(q) {
    var t = norm(q), best = null, score = 0;
    KB.forEach(function (item) {
      var s = 0;
      item.k.forEach(function (kw) { if (t.indexOf(norm(kw)) !== -1) s += kw.length; });
      if (s > score) { score = s; best = item; }
    });
    if (best) return best.a;
    return 'Уточните, пожалуйста, вопрос — по виду экспертизы, стоимости, срокам или заявке. Либо звоните 8 800 200-80-35, консультация бесплатна.';
  }

  function buildWidget() {
    var fab = document.createElement('button');
    fab.className = 'ai-fab';
    fab.setAttribute('aria-label', 'Открыть консультанта');
    fab.innerHTML = '<span class="dot"></span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.5 8.5 0 01-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1121 11.5z"/></svg>Консультант';

    var panel = document.createElement('div');
    panel.className = 'ai-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Виртуальный консультант');
    panel.innerHTML =
      '<div class="ai-head">' +
        '<span class="av"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg></span>' +
        '<span><b>Виртуальный консультант</b><span class="status">на связи</span></span>' +
        '<button class="ai-close" aria-label="Закрыть">×</button>' +
      '</div>' +
      '<div class="ai-body" id="ai-body"></div>' +
      '<div class="ai-foot"><input id="ai-input" type="text" placeholder="Ваш вопрос…" autocomplete="off"><button id="ai-send" aria-label="Отправить"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12l16-8-6 16-2-6-8-2z"/></svg></button></div>' +
      '<div class="ai-note">Виртуальный помощник. Отвечает на типовые вопросы; точную оценку даёт эксперт.</div>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var body = panel.querySelector('#ai-body');
    var input = panel.querySelector('#ai-input');

    function msg(text, who) {
      var m = document.createElement('div');
      m.className = 'ai-msg ' + who;
      // Bot answers come from a trusted local KB and may contain links (innerHTML).
      // User input is untrusted — insert as plain text to avoid XSS.
      if (who === 'bot') { m.innerHTML = text; } else { m.textContent = text; }
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
    }
    function chips() {
      var wrap = document.createElement('div');
      wrap.className = 'ai-chips';
      CHIPS.forEach(function (c) {
        var b = document.createElement('button');
        b.className = 'ai-chip'; b.textContent = c.t;
        b.addEventListener('click', function () { ask(c.q, c.t); });
        wrap.appendChild(b);
      });
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
    }
    function ask(q, label) {
      msg(label || q, 'user');
      setTimeout(function () { msg(answer(q), 'bot'); }, 250);
    }

    var greeted = false;
    function openPanel() {
      panel.classList.add('open'); fab.style.display = 'none';
      if (!greeted) {
        greeted = true;
        msg('Здравствуйте. Я виртуальный консультант центра «Независимая Экспертиза». Помогу разобраться с видом экспертизы, стоимостью и сроками или оставить заявку.', 'bot');
        chips();
      }
      input.focus();
    }
    function closePanel() { panel.classList.remove('open'); fab.style.display = 'flex'; }

    fab.addEventListener('click', openPanel);
    panel.querySelector('.ai-close').addEventListener('click', closePanel);
    panel.querySelector('#ai-send').addEventListener('click', function () {
      var v = input.value.trim(); if (!v) return; input.value = ''; ask(v);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var v = input.value.trim(); if (!v) return; input.value = ''; ask(v); }
    });
  }
  buildWidget();
})();
