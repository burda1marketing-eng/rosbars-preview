/* Генератор кликабельного MVP-прототипа rosbars.ru. node build.js */
'use strict';
const fs = require('fs');
const OUT = __dirname;
const { SITE, PRICE_STAR, GROUPS, MENU, PRICES, svcHref } = require('./data.js');
let FAQ = []; try { FAQ = JSON.parse(fs.readFileSync(OUT + '/faq.json', 'utf8')); } catch (e) {}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const money = n => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';
const li = a => a.map(x => '<li>' + x + '</li>').join('');
const PROTO = 'Прототип. Демонстрационная версия, не является действующим сайтом';

const ICONS = {
  build:'M4 21V8l8-5 8 5v13M9 21v-6h6v6M4 12h16', gavel:'M14 4l6 6-3 3-6-6zM11 9l-7 7 3 3 7-7M14 20h6',
  pen:'M4 20c3-1 5-3 9-9l2 2c-6 6-8 8-9 9zM14 6l3-3 3 3-3 3', coins:'M12 4a8 8 0 100 16 8 8 0 000-16M12 8v8M9.5 10c0-1 1-1.6 2.5-1.6s2.5.8 2.5 1.7c0 2.2-5 1.2-5 3.4 0 .9 1 1.6 2.5 1.6s2.5-.7 2.5-1.7',
  bolt:'M13 3L5 13h6l-1 8 8-10h-6z', gear:'M12 8a4 4 0 100 8 4 4 0 000-8M12 2v3M12 19v3M4 12H1M23 12h-3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
  car:'M5 16l1.5-5.5A2 2 0 018.4 9h7.2a2 2 0 011.9 1.5L19 16M3 16h18v3h-3v-3M6 19v-3', chart:'M4 20h16M6 20V11M11 20V6M16 20v-6M4 9l5-4 4 3 7-5',
  bulb:'M9 18h6M10 21h4M8 13a5 5 0 118 0c-1 1.2-1.5 2-1.5 3h-5c0-1-.5-1.8-1.5-3', chip:'M8 8h8v8H8zM4 9v6M20 9v6M9 4h6M9 20h6M4 9h1M4 15h1M19 9h1M19 15h1',
  plus:'M12 5v14M5 12h14', pin:'M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12zM12 9a2 2 0 100 .01',
  phone:'M5 4h4l2 5-3 2c1 2 3 4 5 5l2-3 5 2v4a1 1 0 01-1 1C10 20 4 14 4 5a1 1 0 011-1', mail:'M3 5h18v14H3zM3 7l9 6 9-6',
  clock:'M12 3a9 9 0 100 18 9 9 0 000-18M12 7v5l3 2', shield:'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6zM9 12l2 2 4-4',
  doc:'M6 3h9l3 3v15H6zM14 3v4h4', search:'M11 4a7 7 0 100 14 7 7 0 000-14M20 20l-4-4'
};
const ic = (k, sz) => `<svg width="${sz||24}" height="${sz||24}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[k]||''}"/></svg>`;

/* ---------- Навигация ---------- */
function megaHTML() {
  const groupsBtns = GROUPS.map((g, i) => `<a href="${g.slug}.html" data-g="${i}"${i === 0 ? ' class="on"' : ''}>${g.name}</a>`).join('');
  const panels = GROUPS.map((g, i) => {
    const links = g.items.map(name => `<a href="${svcHref(name, g.slug)}">${name}</a>`).join('');
    return `<div class="mega__panel${i === 0 ? '' : ' hide'}" data-g="${i}"><h4><a href="${g.slug}.html">${g.name}</a></h4><div class="mega__list">${links}</div></div>`;
  }).join('');
  return `<div id="mega" class="mega"><div class="mega__in"><div class="mega__groups">${groupsBtns}</div>${panels}
    <div class="mega__foot"><a href="ekspertizy.html">Все виды экспертиз →</a><a href="stoimost.html">Стоимость и сроки</a></div></div></div>`;
}
function header(active) {
  const items = MENU.map(m => {
    if (m.mega) return `<li class="${active === m.href ? 'active' : ''}"><button id="mega-btn" aria-haspopup="true" aria-expanded="false">${m.t}</button></li>`;
    const dd = m.sub ? `<div class="dropdown">${m.sub.map(s => `<a href="${s[1]}">${s[0]}</a>`).join('')}</div>` : '';
    return `<li class="${active === m.href ? 'active' : ''}"><a href="${m.href}">${m.t}${m.sub ? '' : ''}</a>${dd}</li>`;
  }).join('');
  return `<header class="hdr">
    <div class="hdr-util"><div class="wrap hdr-util__in">
      <span class="hdr-util__city js-city-addr">${SITE.cities.moscow.addr}</span>
      <div class="hdr-util__r">
        <a class="hdr__phone js-city-phone" href="tel:${SITE.phoneRaw}">${SITE.phone}</a>
        <div class="geo">
          <button class="geo__btn" aria-haspopup="true" aria-expanded="false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg><span class="geo__cur js-city-name">Москва</span><i class="geo__car"></i></button>
          <div class="geo__menu"><button data-city="moscow" class="on">Москва</button><button data-city="krasnodar">Краснодар</button></div>
        </div>
      </div>
    </div></div>
    <div class="wrap hdr__in">
      <a class="brand" href="index.html" aria-label="${esc(SITE.name)}"><img src="assets/logo.png" width="62" height="62" alt="Печать центра"><span class="brand__txt"><span class="brand__name">Независимая экспертиза</span><span class="brand__sub">Исследовательский центр</span></span></a>
      <nav class="menu" aria-label="Главное меню"><ul style="display:flex;gap:16px;list-style:none;margin:0;padding:0">${items}</ul></nav>
      <div class="hdr__right">
        <a class="btn btn--ondark" href="zayavka.html">Оставить заявку</a>
        <button class="burger" aria-label="Меню"><span></span><span></span><span></span></button>
      </div>
    </div>
    ${megaHTML()}
  </header>`;
}
function mmenu() {
  const blocks = MENU.map(m => {
    let subs = '';
    if (m.mega) subs = GROUPS.map(g => `<a href="${g.slug}.html">${g.name}</a>`).join('');
    else if (m.sub) subs = m.sub.map(s => `<a href="${s[1]}">${s[0]}</a>`).join('');
    return `<details><summary>${m.t}</summary>${subs}<a href="${m.href}" style="font-weight:600;color:#fff">Все: ${m.t} →</a></details>`;
  }).join('');
  return `<div id="mmenu" class="mmenu"><div class="mmenu__top"><b style="font-family:var(--display)">Меню</b><button class="mmenu__close" aria-label="Закрыть">×</button></div>
    <div style="padding:4px 20px 12px"><div class="city" role="group" aria-label="Город"><button class="on" data-city="moscow">Москва</button><button data-city="krasnodar">Краснодар</button></div></div>
    ${blocks}
    <div class="mmenu__cta"><a class="btn btn--ondark" style="width:100%" href="zayavka.html">Оставить заявку</a>
    <p style="color:#c9cede;margin-top:14px;font-size:14px">${SITE.phone} · info@rosbars.ru</p></div></div>`;
}
function footer() {
  const svc = GROUPS.slice(0, 6).map(g => `<li><a href="${g.slug}.html">${g.name.split(' —')[0].split(' и ')[0]}</a></li>`).join('');
  return `<footer class="ftr"><div class="wrap"><div class="ftr__grid">
    <div><div class="ftr__brand"><img src="assets/logo.png" width="64" height="64" alt=""><b>${esc(SITE.name)}</b></div>
      <p class="js-city-addr">${SITE.cities.moscow.addr}</p>
      <p><a class="js-city-phone" href="tel:${SITE.phoneRaw}">${SITE.phone}</a> · <a href="mailto:${SITE.email}">${SITE.email}</a><br>Пн–Сб, 09:00–19:00</p></div>
    <div><h5>Стоимость</h5><ul><li><a href="stoimost.html">Сводный прайс</a></li><li><a href="stoimost.html#zavisit">От чего зависит цена</a></li><li><a href="stoimost.html#oplata">Порядок оплаты</a></li><li><a href="zayavka.html">Рассчитать стоимость</a></li></ul></div>
    <div><h5>Экспертизы</h5><ul>${svc}<li><a href="ekspertizy.html">Все виды →</a></li></ul></div>
    <div><h5>Центр</h5><ul><li><a href="organizaciya.html">Об организации</a></li><li><a href="recenzii.html">Рецензии</a></li><li><a href="keysy.html">Кейсы</a></li><li><a href="faq.html">Частые вопросы</a></li><li><a href="kontakty.html">Контакты</a></li></ul></div>
  </div>
  <p class="ftr__note">Информация на сайте носит справочный характер и не является публичной офертой в значении ст. 437 ГК РФ. Точная стоимость и сроки определяются после изучения материалов и фиксируются в договоре.</p>
  <div class="ftr__bot"><span>© ${SITE.year}–2026 ${esc(SITE.name)}. ${SITE.domain}</span><span><a href="politika.html">Политика конфиденциальности</a> · <a href="kontakty.html#rekvizity">Реквизиты</a> · <a href="karta-sayta.html">Карта сайта</a></span></div>
  </div></footer>`;
}
const wave = d => `<div class="wave${d ? ' wave--dark' : ''}" role="presentation"></div>`;
function crumbs(trail) {
  return `<div class="wrap"><nav class="crumbs" aria-label="Хлебные крошки"><ol>${trail.map((c, i) => {
    const last = i === trail.length - 1;
    return `<li>${last ? `<span aria-current="page">${c.t}</span>` : `<a href="${c.href}">${c.t}</a>`}</li>`;
  }).join('')}</ol></nav></div>`;
}
function ctaBand() {
  return `<section class="sec"><div class="wrap"><div style="background:var(--white);border:1px solid var(--shellstone);border-radius:8px;padding:40px 48px;display:flex;justify-content:space-between;align-items:center;gap:32px;flex-wrap:wrap">
    <div><h2>Нужна экспертиза или консультация?</h2><p class="muted" style="margin-top:8px">Опишите задачу — эксперт перезвонит, уточнит вопросы и оценит стоимость и срок.</p></div>
    <div style="display:flex;flex-direction:column;gap:10px"><a class="btn btn--primary btn--lg" href="zayavka.html">Оставить заявку</a><span class="muted js-city-phone">${SITE.phone}</span></div>
  </div></div></section>`;
}
function priceStar() { return `<p class="price-star">* ${PRICE_STAR}</p>`; }
function priceBlock(from, term, vid) {
  var href = 'zayavka.html?scenario=sud' + (vid ? ('&vid=' + encodeURIComponent(vid)) : '');
  return `<section class="sec" id="price"><div class="wrap"><div class="price-block">
    <div><span class="eyebrow">Стоимость и сроки</span><div class="plate__price" style="margin-top:8px">от ${money(from)}</div><div class="plate__meta">${term} · заключение эксперта, 2 экз.</div>${priceStar()}</div>
    <div style="display:flex;flex-direction:column;gap:10px"><a class="btn btn--primary btn--lg" href="${href}">Оставить заявку</a><a class="btn btn--secondary" href="stoimost.html">Все цены и сроки</a></div>
  </div></div></section>`;
}
function modalHTML() {
  return `<div id="req-modal" class="modal" hidden role="dialog" aria-modal="true" aria-label="Оставить заявку"><div class="modal__box">
    <button class="modal__close" aria-label="Закрыть">×</button>
    <span class="eyebrow" style="color:var(--seal-blue)">Заявка на экспертизу</span>
    <h2 style="margin-top:8px">Оставьте заявку — перезвоним</h2>
    <p class="sub">Эксперт свяжется в рабочее время, ответит на вопросы и оценит стоимость. Без спама и звонков роботов.</p>
    ${formHTML('vnesud')}
  </div></div>`;
}

function shell(o) {
  return `<!doctype html><html lang="ru"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc || '')}">
<link rel="icon" href="assets/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/styles.css">
</head><body>
${header(o.active || '')}
${mmenu()}
${o.trail ? crumbs(o.trail) : ''}
<main id="main">${o.main}</main>
${footer()}
${modalHTML()}
<a class="skip" href="#main">К содержанию</a>
<script src="assets/faq-data.js"></script>
<script src="assets/app.js"></script>
</body></html>`;
}

/* ================= Экраны ================= */
function dirsCards() {
  return GROUPS.slice(0, 9).map((g, i) => {
    const ex = g.items.slice(0, 3).map(n => `<a href="${svcHref(n, g.slug)}">${n}</a>`).join('');
    return `<article class="dir${i === 0 ? ' dir--wide' : ''}"><div class="dir__ic">${ic(g.ic, 28)}</div><h3><a href="${g.slug}.html">${g.name}</a></h3><div class="dir__count">${g.items.length} видов · от ${money(g.from)}</div><div class="dir__ex">${ex}</div></article>`;
  }).join('');
}
function homePage() {
  const sits = [['Залили квартиру', 'prichiny-zaliva.html'], ['Спор с подрядчиком', 'stroitelnaya-ekspertiza.html'], ['Не согласен с экспертизой', 'recenzii.html'], ['Оспариваю кадастровую стоимость', 'kadastrovaya-stoimost.html'], ['Приёмка по госконтракту', 'goszakupki.html'], ['Наследственный спор', 'ocenochnaya-ekspertiza.html']];
  const priceRows = PRICES.slice(0, 9).map(p => `<tr data-name="${esc(p[0])}" data-group="${p[1]}"><th scope="row" data-l="Вид"><a href="${p[4]}">${p[0]}</a></th><td class="num" data-l="Стоимость">от ${money(p[2])}</td><td data-l="Срок">${p[3]} дн.</td></tr>`).join('');
  const cases = [['Арбитражный суд г. Москвы', 'А40-1234/2025', 'Март 2025', 'Спор о качестве фасадных работ на 1 240 м². Обмеры и поверочные расчёты выявили завышение объёмов.', 'Строительная'], ['Никулинский районный суд', '2-567/2025', 'Февраль 2025', 'Оспаривание подписи в договоре займа на 4,5 млн ₽ по почерковедческому исследованию.', 'Криминалистическая'], ['Краснодарский краевой суд', 'А32-890/2025', 'Январь 2025', 'Реконструкция обстоятельств ДТП по следам и повреждениям при противоречивых показаниях.', 'Транспорт']];
  const main = `
<section class="hero"><div class="wrap"><div class="hero__in">
  <span class="eyebrow" style="color:var(--periwinkle)">АНО · Член ТПП г. Москвы · с 2014 года</span>
  <h1 class="display" style="margin-top:14px">Независимая экспертиза для суда и досудебного урегулирования</h1>
  <p class="hero__sub">Судебные и досудебные экспертизы по 60+ направлениям. Готовим заключения, которые выдерживают проверку в суде. Москва и Краснодар, работаем по всей России.</p>
  <div class="hero__scenarios">
    <a class="btn btn--ondark btn--lg" href="zayavka.html?scenario=sud">Экспертиза по определению суда</a>
    <a class="btn btn--ondark btn--lg" href="zayavka.html?scenario=vnesud">Внесудебное исследование</a>
    <a class="btn btn--ondark btn--lg" href="zayavka.html?scenario=recenz">Рецензия на чужое заключение</a>
  </div>
</div></div></section>
<section class="sec--tight" style="padding-top:56px"><div class="wrap"><div class="stats">
  <div><div class="stat__n tnum">2014</div><div class="stat__l">год основания</div></div>
  <div><div class="stat__n tnum">12 386</div><div class="stat__l">выполненных экспертиз</div></div>
  <div><div class="stat__n tnum">85</div><div class="stat__l">регионов России</div></div>
  <div><div class="stat__n tnum">60+</div><div class="stat__l">видов экспертиз</div></div>
</div></div></section>

<section class="sec"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Направления</span><h2>Экспертизы по группам</h2><p>11 департаментов, более 60 видов. Строительная экспертиза — флагманское направление.</p></div>
  <div class="dirs">${dirsCards()}</div>
  <p class="mt-6"><a class="arrow" href="ekspertizy.html">Все виды экспертиз <span class="a">→</span></a></p>
</div></section>

<section class="sec sec--dark"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">С чего начать</span><h2>Типовые ситуации</h2></div>
  <div class="sits">${sits.map(s => `<a class="sit" href="${s[1]}">${s[0]}</a>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Кейсы</span><h2>Из практики центра</h2></div>
  <div class="cards">${cases.map(c => `<article class="case"><div class="case__head"><b>${c[0]}</b> · дело № ${c[1]} · ${c[2]}</div><p>${c[3]}</p><div class="case__tags"><span class="tag">${c[4]}</span></div></article>`).join('')}</div>
  <p class="mt-6"><a class="arrow" href="keysy.html">Все кейсы <span class="a">→</span></a></p>
</div></section>

<section class="sec"><div class="wrap"><div class="sec-head"><span class="eyebrow">Документы</span><h2>Лицензии и свидетельства</h2></div>
  <div class="docs">${Array.from({length:12},(_,i)=>`<div class="doc"><img src="assets/certificates/doki_${i+1}.jpg" alt="Документ ${i+1}" loading="lazy"></div>`).join('')}</div>
  <p class="mt-4"><a class="arrow" href="organizaciya.html#docs">Все документы центра <span class="a">→</span></a></p>
</div></section>

<section class="sec" style="background:var(--white)"><div class="wrap"><div class="sec-head"><span class="eyebrow">Заявка</span><h2>Оставьте заявку на экспертизу</h2><p>Заполните форму — эксперт свяжется в рабочее время.</p></div>
  ${formHTML('vnesud')}
</div></section>`;
  return shell({ file: 'index.html', title: `${SITE.name} — независимая судебная и досудебная экспертиза в Москве и Краснодаре`, desc: 'Независимый центр судебной и досудебной экспертизы. Строительная, оценочная, криминалистическая, автотехническая и другие экспертизы. 60+ видов, заключения для суда. Москва, Краснодар.', active: 'index.html', main });
}

/* Форма заявки (3 вкладки) */
function formHTML(pre) {
  const opts = GROUPS.map(g => `<option>${g.name}</option>`).join('');
  return `<form class="form" data-request novalidate>
    <input type="hidden" class="js-scenario" value="${pre||'vnesud'}">
    <div class="field"><label for="fn">Имя <span class="req">*</span></label><input id="fn" type="text" required placeholder="Как к вам обращаться"><span class="msg">Укажите имя</span></div>
    <div class="field"><label for="fp">Телефон <span class="req">*</span></label><input id="fp" type="tel" required placeholder="+7 ___ ___-__-__"><span class="msg">Укажите телефон</span></div>
    <div class="field"><label for="fe">E-mail <span class="opt">— необязательно</span></label><input id="fe" type="email" placeholder="you@example.com"></div>
    <div class="field"><label for="fv">Вид экспертизы <span class="opt">— если знаете</span></label><select id="fv" class="js-vid"><option value="">Не знаю / подскажите</option>${opts}</select></div>
    <div class="field"><label for="fm">Кратко о ситуации</label><textarea id="fm" placeholder="Что случилось и что нужно установить"></textarea></div>
    <button class="btn btn--primary btn--lg" type="submit" style="width:100%">Отправить заявку</button>
    <p class="consent-note">Нажимая «Отправить», вы соглашаетесь с <a href="politika.html">политикой конфиденциальности</a>. Демонстрационный прототип — данные не отправляются.</p>
    <div class="or-div"><span>или быстрее</span></div>
    <a class="btn btn--secondary btn--lg" href="https://t.me/${SITE.telegram}" target="_blank" rel="noopener" style="width:100%"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M22 4L2 11l6 2m14-9l-4 15-6-4m10-11L8 13m0 0v6l4-3"/></svg> Написать в Telegram</a>
    <div class="form-ok">Заявка принята. Демонстрационный прототип — данные не отправляются. На боевом сайте эксперт свяжется с вами в рабочее время.</div>
  </form>`;
}

/* Экспертизы — все виды */
function ekspertizyPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Экспертизы' }];
  const toc = GROUPS.map((g, i) => `<a href="#g${i}">${g.name}</a>`).join('');
  const groups = GROUPS.map((g, i) => {
    const items = g.items.map(n => `<a data-search-item data-name="${esc(n)}" href="${svcHref(n, g.slug)}">${n}</a>`).join('');
    return `<div class="ek-group" data-search-group id="g${i}"><h3><a href="${g.slug}.html">${g.name}</a></h3><div class="mega__list" style="margin-top:10px">${items}</div></div>`;
  }).join('');
  const main = `
<section class="sec"><div class="wrap">
  <div class="prose narrow"><h1>Виды экспертиз</h1>
  <div class="answer mt-4">Центр проводит судебные и досудебные экспертизы по 11 направлениям и более чем 60 видам. Выберите нужный вид ниже или воспользуйтесь поиском. На каждой странице — прямой ответ по сути, цена «от», сроки и порядок работы.</div></div>
  <div style="display:grid;grid-template-columns:260px 1fr;gap:40px;margin-top:32px" class="ek-layout">
    <aside class="aside"><input id="type-search" type="search" placeholder="Поиск по видам…" style="width:100%;height:44px;border:1px solid var(--shellstone);border-radius:4px;padding:0 14px;margin-bottom:16px">
      <nav class="ek-toc" style="display:flex;flex-direction:column;gap:4px;font-size:14px">${toc}</nav></aside>
    <div style="display:flex;flex-direction:column;gap:28px">${groups}</div>
  </div>
</div></section>${ctaBand()}`;
  return shell({ file: 'ekspertizy.html', title: `Все виды экспертиз — каталог | ${SITE.name}`, desc: 'Полный каталог судебных и досудебных экспертиз: строительная, оценочная, криминалистическая, инженерная, экономическая и другие — более 60 видов с ценами.', active: 'ekspertizy.html', trail, main });
}

/* Пиллар группы */
function pillarPage(g) {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Экспертизы', href: 'ekspertizy.html' }, { t: g.name.split(' —')[0] }];
  const cards = g.items.map(n => `<a class="card" href="${svcHref(n, g.slug)}" style="text-decoration:none"><h4>${n}</h4><div class="card__meta"><span>от ${money(g.from)}</span><span class="a">Подробнее →</span></div></a>`).join('');
  const faqSub = pickFaq(g.name, 6);
  const main = `
<section class="sec"><div class="wrap"><div class="layout">
  <div>
    <h1>${g.name}</h1>
    <div class="answer mt-4">${g.name} решает споры и задачи, где нужны специальные знания: ${g.desc.toLowerCase()} Проводим досудебные исследования и судебные экспертизы, готовим заключение по 73-ФЗ, пригодное для суда. Стоимость — от ${money(g.from)}, срок обычно от 5 рабочих дней. Точную цену эксперт называет после изучения материалов.</div>
    <div class="prose mt-8">
      <h2>Виды в этой группе</h2>
    </div>
    <div class="cards mt-4">${cards}</div>
    <div class="prose mt-8">
      <h2>Когда назначается</h2>
      <ul>${li(['Досудебное обоснование претензии или иска','Назначение судом по ходатайству стороны','Спор со страховой, подрядчиком или контрагентом','Оценка ущерба и его размера','Проверка чужого заключения (рецензия)'])}</ul>
      <h2>Что вы получите</h2>
      <ul>${li(['Заключение эксперта в 2 экземплярах','Обоснование выводов со ссылками на нормы и методики','Консультацию по формулировке вопросов для суда','При необходимости — участие эксперта в судебном заседании'])}</ul>
    </div>
    <h2 class="mt-8">Частые вопросы</h2>
    ${faqAccordion(faqSub)}
  </div>
  <aside class="aside">${asidePanels(g.from)}</aside>
</div></div></section>${ctaBand()}`;
  return shell({ file: g.slug + '.html', title: `${g.name} — цена и сроки | ${SITE.name}`, desc: `${g.name}: ${g.desc} Досудебно и для суда, от ${money(g.from)}. Заключение для суда, Москва и Краснодар.`, active: 'ekspertizy.html', trail, main });
}
function asidePanels(from) {
  return `<div class="plate"><div class="plate__price">от ${money(from)}</div><div class="plate__meta">срок от 5 рабочих дней · заключение эксперта, 2 экз.</div>${priceStar()}</div>
    <div class="panel"><a class="btn btn--primary" style="width:100%" href="zayavka.html?scenario=sud">Рассчитать стоимость</a></div>
    <div class="panel panel--dark"><h4>Бесплатная консультация</h4><p>Эксперт подскажет вид экспертизы и вопросы.</p><a class="btn btn--ondark" style="width:100%;margin-top:12px" href="tel:${SITE.phoneRaw}">${SITE.phone}</a></div>`;
}

/* Страница вида — эталон (Причины залива) с полным текстом §7 */
function zalivPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Экспертизы', href: 'ekspertizy.html' }, { t: 'Строительная', href: 'stroitelnaya-ekspertiza.html' }, { t: 'Причины залива' }];
  const faqSub = [
    { q: 'Чем экспертиза причин залива отличается от оценки ущерба?', a: 'Экспертиза причин залива устанавливает источник протечки и виновное лицо, а размер ущерба определяет отдельное оценочное исследование. Их часто проводят одновременно: одно отвечает «кто виноват», второе — «на какую сумму».' },
    { q: 'Можно ли провести экспертизу, если следы залива уже устранены?', a: 'Да, но сложнее. Эксперт работает по фотографиям, актам аварийно-диспетчерской службы, записям управляющей компании и проектной документации. Чем больше сохранившихся данных, тем точнее вывод. Осмотр по свежим следам всегда предпочтительнее.' },
    { q: 'Обязательно ли присутствие представителя управляющей компании при осмотре?', a: 'Не обязательно, но желательно. Стороны и УК уведомляются о дате осмотра телеграммой или письмом. Их неявка при надлежащем уведомлении не препятствует исследованию.' },
    { q: 'Что делать, если соседи не пускают эксперта в квартиру?', a: 'При досудебном исследовании доступ обеспечивает заказчик. Если источник в чужой квартире и доступа нет, вопрос решается через суд: в рамках судебной экспертизы доступ обеспечивается определением суда.' },
    { q: 'Возместит ли суд расходы на экспертизу?', a: 'Расходы на судебную экспертизу относятся к судебным издержкам и взыскиваются с проигравшей стороны пропорционально удовлетворённым требованиям (ст. 98 ГПК, ст. 110 АПК). Сохраните договор и платёжные документы.' }
  ];
  const main = `
<section class="sec"><div class="wrap"><div class="layout">
  <div>
    <h1>Экспертиза причин залива квартиры</h1>
    <div class="answer mt-4">Экспертиза причин залива устанавливает источник протечки, причину аварии и лицо, ответственное за её возникновение. Исследование проводится по определению суда или по заявлению собственника, арендатора либо управляющей организации. Эксперт осматривает помещение и инженерные системы, изучает записи аварийно-диспетчерской службы и проектную документацию, определяет направление распространения влаги и разграничивает балансовую принадлежность сетей. Результат — заключение эксперта, пригодное для предъявления в суд. Размер ущерба определяется отдельным оценочным исследованием, которое может проводиться одновременно.</div>
    <div class="prose mt-8">
      <h2>Когда назначается</h2>
      <ul>${li(['Спор с соседями или управляющей компанией о причине залива','Отказ виновной стороны компенсировать ущерб','Спор о принадлежности прорвавшейся трубы к общему имуществу','Страховой случай по заливу','Подготовка иска и обоснование суммы требований'])}</ul>
      <h2>Вопросы, которые ставятся перед экспертом</h2>
      <ul>${li(['Какова причина залива помещения по адресу …?','Какой элемент инженерной системы явился источником протечки?','Относится ли данный элемент к общему имуществу многоквартирного дома?','Имеются ли признаки нарушения правил эксплуатации инженерного оборудования?','Соответствует ли выполненное переустройство инженерных сетей проектной документации?','Имеется ли причинно-следственная связь между выявленными нарушениями и произошедшим заливом?'])}</ul>
      <h2>Что нужно предоставить</h2>
      <ul>${li(['Документы на помещение и доступ для осмотра','Акт о заливе, составленный управляющей компанией','Фотографии и видео последствий','Записи аварийно-диспетчерской службы','Проектную документацию на инженерные сети (при наличии)'])}</ul>
      <h2>Как проходит исследование</h2>
      <ol>${li(['Изучение материалов и документов','Уведомление сторон об осмотре','Осмотр помещения и инженерных систем','Определение источника и направления распространения влаги','Разграничение балансовой принадлежности сетей','Оформление заключения с выводами'])}</ol>
      <h2>Нормативная база</h2>
      <ul>${li(['ЖК РФ ст. 36, 161','Постановление Правительства РФ № 491 от 13.08.2006','СП 30.13330.2020; СП 73.13330.2016','ГОСТ Р 56198-2014','ГПК РФ ст. 79, 86'])}</ul>
    </div>
    <h2 class="mt-8">Эксперт-исполнитель</h2>
    <div class="expert" style="max-width:340px;text-align:left;display:flex;gap:16px;align-items:center">
      <div class="expert__ph" style="margin:0">СВ</div><div><h4>Соколов В. А.</h4><div class="spec">Инженер-строитель, судебный эксперт</div><div class="meta">Стаж 14 лет · более 600 экспертиз</div></div>
    </div>
    <h2 class="mt-8">Частые вопросы</h2>
    ${faqAccordion(faqSub)}
    <div class="panel mt-6" style="border-left:3px solid var(--seal-blue)"><b>Не согласны с чужим заключением по заливу?</b><p class="muted" style="margin-top:6px">Подготовим рецензию с разбором методических нарушений.</p><a class="arrow mt-4" href="recenzii.html">Заказать рецензию <span class="a">→</span></a></div>
    <h2 class="mt-8">Смежные виды</h2>
    <div class="cards">${['Ущерб от залива','Инженерных систем и сетей','Установление виновника залива'].map(n=>`<a class="card" href="stroitelnaya-ekspertiza.html"><h4>${n}</h4><div class="card__meta"><span>от 8 000 ₽</span><span class="a">→</span></div></a>`).join('')}</div>
    <p class="caption muted mt-8">Обновлено: июль 2026</p>
  </div>
  <aside class="aside">
    <div class="plate"><div class="plate__price">от 25 000 ₽</div><div class="plate__meta">от 5 рабочих дней · заключение эксперта, 2 экз.</div>${priceStar()}</div>
    <div class="panel"><a class="btn btn--primary" style="width:100%" href="zayavka.html?scenario=sud&vid=${encodeURIComponent('Экспертиза причин залива')}">Оставить заявку</a></div>
    <div class="panel panel--dark"><h4>Бесплатная консультация</h4><p>Поможем сформулировать вопросы для суда.</p><a class="btn btn--ondark" style="width:100%;margin-top:12px" href="tel:${SITE.phoneRaw}">${SITE.phone}</a></div>
  </aside>
</div></div></section>${ctaBand()}`;
  return shell({ file: 'prichiny-zaliva.html', title: `Экспертиза причин залива квартиры — цена от 25 000 ₽ | ${SITE.name}`, desc: 'Экспертиза причин залива: установление источника протечки и виновного лица. Досудебно и для суда, от 25 000 ₽, от 5 рабочих дней. Заключение для суда.', active: 'ekspertizy.html', trail, main });
}

/* Универсальный шаблон вида (для стандалон-услуг) */
function servicePage(o) {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Экспертизы', href: 'ekspertizy.html' }, { t: o.group, href: o.groupHref }, { t: o.crumb }];
  const main = `
<section class="sec"><div class="wrap"><div class="layout">
  <div>
    <h1>${o.h1}</h1>
    <div class="answer mt-4">${o.answer}</div>
    <div class="prose mt-8">
      <h2>Когда назначается</h2><ul>${li(o.when)}</ul>
      <h2>Вопросы эксперту</h2><ul>${li(o.q)}</ul>
      <h2>Нормативная база</h2><ul>${li(o.norms)}</ul>
    </div>
    <h2 class="mt-8">Частые вопросы</h2>${faqAccordion(o.faq)}
    <h2 class="mt-8">Смежные виды</h2>
    <div class="cards">${o.related.map(r=>`<a class="card" href="${r[1]}"><h4>${r[0]}</h4><div class="card__meta"><span class="a">Подробнее →</span></div></a>`).join('')}</div>
  </div>
  <aside class="aside">
    <div class="plate"><div class="plate__price">от ${money(o.from)}</div><div class="plate__meta">${o.term} · заключение эксперта</div>${priceStar()}</div>
    <div class="panel"><a class="btn btn--primary" style="width:100%" href="zayavka.html?scenario=sud&vid=${encodeURIComponent(o.h1)}">Оставить заявку</a></div>
    <div class="panel panel--dark"><h4>Консультация бесплатна</h4><a class="btn btn--ondark" style="width:100%;margin-top:12px" href="tel:${SITE.phoneRaw}">${SITE.phone}</a></div>
  </aside>
</div></div></section>${ctaBand()}`;
  return shell({ file: o.file, title: `${o.h1} — цена и сроки | ${SITE.name}`, desc: o.desc, active: 'ekspertizy.html', trail, main });
}

/* FAQ helpers */
function faqAccordion(items) {
  return `<div class="faq">${items.map(f => `<details><summary>${esc(f.q)}</summary><div class="a">${esc(f.a)}</div></details>`).join('')}</div>`;
}
function pickFaq(topicHint, n) {
  let pool = [];
  FAQ.forEach(g => { if (topicHint.toLowerCase().indexOf(g.label.toLowerCase().split(' ')[0]) !== -1 || g.label.toLowerCase().indexOf(topicHint.toLowerCase().split(' ')[0]) !== -1) pool = pool.concat(g.items); });
  if (pool.length < n) { const gen = FAQ.find(g => g.label === 'Общие вопросы'); if (gen) pool = pool.concat(gen.items); }
  return pool.slice(0, n);
}

/* Стоимость и сроки */
function stoimostPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Стоимость и сроки' }];
  const groupsUniq = Array.from(new Set(PRICES.map(p => p[1])));
  const rows = PRICES.map(p => `<tr data-name="${esc(p[0])}" data-group="${p[1]}"><th scope="row" data-l="Вид"><a href="${p[4]}">${p[0]}</a></th><td data-l="Группа">${p[1]}</td><td class="num" data-l="Стоимость">от ${money(p[2])}</td><td data-l="Срок">${p[3]} дн.</td></tr>`).join('');
  const opts = groupsUniq.map(g => `<option value="${g}">${g}</option>`).join('');
  const faqSub = (FAQ.find(g => g.label === 'Стоимость и оплата') || { items: [] }).items.slice(0, 6);
  const main = `
<section class="sec"><div class="wrap"><div class="prose narrow"><h1>Стоимость экспертизы и сроки проведения</h1>
  <div class="answer mt-4">Стоимость судебной и досудебной экспертизы в центре начинается от 8 000 ₽ и зависит от вида исследования, объёма материалов, числа вопросов и необходимости выезда. Точную сумму эксперт называет после изучения материалов и фиксирует в договоре — без доплат по ходу работы. Ниже — сводная таблица по всем направлениям с ценой «от» и сроком в рабочих днях.</div></div>
  <div class="tbl-tools mt-8"><input id="price-search" type="search" placeholder="Поиск по названию…"><select id="price-group"><option value="">Все группы</option>${opts}</select></div>
  <div class="tbl-wrap"><table class="price" id="price-table"><thead><tr><th>Вид экспертизы</th><th>Группа</th><th>Стоимость</th><th>Срок</th></tr></thead><tbody>${rows}</tbody></table></div>
  ${priceStar()}
</div></section>
<section class="sec sec--tight" style="background:var(--white)"><div class="wrap">
  <div class="cards" id="zavisit">
    <div class="panel"><h4>От чего зависит стоимость</h4><ul class="prose" style="margin-top:8px">${li(['Число вопросов и объём материалов дела','Необходимость выезда и его удалённость','Сложность объекта исследования','Привлечение лаборатории','Комиссионный или комплексный характер','Срочность'])}</ul></div>
    <div class="panel"><h4>Что входит в стоимость</h4><ul class="prose" style="margin-top:8px">${li(['Исследование по методике','Заключение эксперта в 2 экземплярах','Консультация по формулировке вопросов'])}</ul></div>
    <div class="panel"><h4>Оплачивается отдельно</h4><ul class="prose" style="margin-top:8px">${li(['Выезд за пределы Москвы и области','Дополнительные экземпляры заключения','Участие эксперта в судебном заседании','Лабораторные испытания сверх базового перечня'])}</ul></div>
  </div>
  <div id="oplata" class="mt-8"><h2>Порядок оплаты</h2>
  <div class="cards mt-4">
    <div class="panel"><h4>Физическое лицо</h4><p class="muted mt-4">Счёт или карта, предоплата 100%.</p></div>
    <div class="panel"><h4>Юридическое лицо</h4><p class="muted mt-4">Счёт, договор, закрывающие документы. Возможна постоплата.</p></div>
    <div class="panel"><h4>По определению суда</h4><p class="muted mt-4">Внесение средств на депозитный счёт суда стороной, заявившей ходатайство (ст. 96 ГПК, ст. 108 АПК).</p></div>
  </div></div>
  <div class="answer mt-8"><b>Возмещение расходов.</b> Расходы на назначенную судом экспертизу относятся к судебным издержкам и взыскиваются с проигравшей стороны. При частичном удовлетворении иска — пропорционально удовлетворённым требованиям (ст. 98 ГПК РФ, ст. 110 АПК РФ).</div>
</div></section>
<section class="sec"><div class="wrap"><div class="sec-head"><h2>Частые вопросы о стоимости</h2></div>${faqAccordion(faqSub)}</div></section>
${ctaBand()}`;
  return shell({ file: 'stoimost.html', title: `Стоимость экспертизы и сроки — прайс-лист | ${SITE.name}`, desc: 'Сколько стоит судебная и досудебная экспертиза: сводная таблица цен «от» по всем видам, сроки, от чего зависит стоимость, порядок оплаты и возмещение расходов.', active: '', trail, main });
}

/* Госзакупки */
function goszakupkiPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Госзакупки' }];
  const faqSub = (FAQ.find(g => g.label === 'Госзакупки') || { items: [] }).items.slice(0, 6);
  const main = `
<section class="sec"><div class="wrap"><div class="layout"><div>
  <h1>Экспертиза по госзакупкам (44-ФЗ и 223-ФЗ)</h1>
  <div class="answer mt-4">Экспертиза исполнения государственного контракта подтверждает объём, качество и соответствие выполненных работ условиям контракта, обосновывает приёмку или мотивированный отказ. Проводится для заказчиков и поставщиков по 44-ФЗ и 223-ФЗ, а также при спорах о НМЦК и приёмке. Заключение используется в претензионной работе, в суде и при проверках контролирующих органов.</div>
  <div class="prose mt-8"><h2>По какому закону работаем</h2></div>
  <div class="cards mt-4"><div class="panel"><h4>44-ФЗ</h4><p class="muted mt-4">Контрактная система для государственных и муниципальных нужд: приёмка, объёмы, качество, обоснование отказа.</p></div><div class="panel"><h4>223-ФЗ</h4><p class="muted mt-4">Закупки отдельных видов юрлиц: соответствие результата условиям договора и техническому заданию.</p></div></div>
  <div class="prose mt-8"><h2>Для заказчика</h2><ul>${li(['Обоснование отказа в приёмке','Проверка объёмов и качества по контракту','Экспертиза НМЦК'])}</ul><h2>Для поставщика</h2><ul>${li(['Подтверждение выполненных работ','Оспаривание необоснованного отказа в приёмке','Сопровождение спора с заказчиком'])}</ul></div>
  <h2 class="mt-8">Частые вопросы</h2>${faqAccordion(faqSub)}
  </div><aside class="aside">${asidePanels(35000)}</aside></div></div></section>${ctaBand()}`;
  return shell({ file: 'goszakupki.html', title: `Экспертиза госзакупок 44-ФЗ и 223-ФЗ | ${SITE.name}`, desc: 'Экспертиза исполнения госконтракта по 44-ФЗ и 223-ФЗ: объёмы и качество работ, приёмка и обоснование отказа, НМЦК. Для заказчиков и поставщиков.', active: 'goszakupki.html', trail, main });
}

/* Рецензии */
function recenziiPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Рецензии' }];
  const faqSub = (FAQ.find(g => g.label === 'Рецензии') || { items: [] }).items.slice(0, 6);
  const kinds = [['На строительно-техническую','recenzii.html'],['На оценочную','recenzii.html'],['На почерковедческую','recenzii.html'],['На автотехническую','recenzii.html'],['На инженерно-техническую','recenzii.html'],['На судебно-медицинскую','recenzii.html']];
  const main = `
<section class="sec"><div class="wrap"><div class="layout"><div>
  <h1>Рецензия на заключение эксперта</h1>
  <div class="answer mt-4">Рецензия — это исследование чужого заключения на предмет методических и процессуальных нарушений. Эксперт проверяет применённые методики, полноту исследования, обоснованность выводов и соответствие требованиям 73-ФЗ. Рецензия помогает оспорить экспертизу оппонента, заявить ходатайство о повторной или дополнительной экспертизе и обосновать сомнения перед судом. Стоимость — от 15 000 ₽, срок 3–7 рабочих дней.</div>
  <div class="prose mt-8"><h2>Когда рецензия помогает</h2><ul>${li(['Выводы эксперта противоречат материалам дела','Нарушена методика исследования','Эксперт вышел за пределы своей компетенции','Использованы неактуальные нормы','Не исследованы значимые обстоятельства'])}</ul>
  <h2>Типовые методические нарушения</h2><ul>${li(['Отсутствие описания примененной методики','Необоснованные допущения в расчётах','Игнорирование части исходных данных','Логические разрывы между исследованием и выводами'])}</ul></div>
  <h2 class="mt-8">Рецензии по видам</h2>
  <div class="cards mt-4">${kinds.map(k=>`<a class="card" href="${k[1]}"><h4>${k[0]}</h4><div class="card__meta"><span>от 15 000 ₽</span><span class="a">→</span></div></a>`).join('')}</div>
  <h2 class="mt-8">Частые вопросы</h2>${faqAccordion(faqSub)}
  </div><aside class="aside">
    <div class="plate"><div class="plate__price">от 15 000 ₽</div><div class="plate__meta">3–7 рабочих дней</div>${priceStar()}</div>
    <div class="panel"><a class="btn btn--primary" style="width:100%" href="zayavka.html?scenario=recenz">Заявка на рецензию</a></div>
    <div class="panel panel--dark"><h4>Консультация бесплатна</h4><a class="btn btn--ondark" style="width:100%;margin-top:12px" href="tel:${SITE.phoneRaw}">${SITE.phone}</a></div>
  </aside></div></div></section>${ctaBand()}`;
  return shell({ file: 'recenzii.html', title: `Рецензия на заключение эксперта — оспорить экспертизу | ${SITE.name}`, desc: 'Рецензия на заключение эксперта: разбор методических нарушений для оспаривания экспертизы в суде. От 15 000 ₽, срок 3–7 дней.', active: 'recenzii.html', trail, main });
}

/* Кейсы — архив */
function keysyPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Кейсы' }];
  const cases = [
    ['Арбитражный суд г. Москвы','А40-1234/2025','Март 2025','Спор о качестве и объёме фасадных работ на объекте 1 240 м². Обмеры и поверочные расчёты выявили завышение объёмов на 18%.','Подтверждён ущерб, суд принял заключение.','Строительная'],
    ['Никулинский районный суд','2-567/2025','Февраль 2025','Оспаривание подписи в договоре займа на 4,5 млн ₽. Сравнительное исследование образцов почерка.','Подпись выполнена другим лицом.','Криминалистическая'],
    ['Краснодарский краевой суд','А32-890/2025','Январь 2025','Реконструкция обстоятельств ДТП при противоречивых показаниях сторон по следам и повреждениям.','Установлена вина второго участника.','Транспорт'],
    ['Мосгорсуд','33-4521/2024','Декабрь 2024','Оспаривание кадастровой стоимости земельного участка, завышенной почти вдвое.','Стоимость снижена, налог пересчитан.','Оценочная'],
    ['АС Московской области','А41-778/2025','Февраль 2025','Корпоративный спор о выводе активов через цепочку сделок с аффилированными лицами.','Подтверждён вывод активов, сумма взыскана.','Экономическая'],
    ['Пресненский районный суд','2-990/2025','Март 2025','Установление причины залива и принадлежности прорвавшегося стояка к общему имуществу дома.','Виновной признана управляющая компания.','Строительная']
  ];
  const tags = ['Строительная','Криминалистическая','Транспорт','Оценочная','Экономическая'];
  const main = `
<section class="sec"><div class="wrap">
  <div class="prose narrow"><h1>Выполненные экспертизы</h1><p class="lead mt-4">Примеры из практики по разным направлениям. Детали дел обезличены; номера приведены как в судебных актах.</p></div>
  <div id="case-filter" class="mt-8" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    <span class="small muted">Фильтр:</span>${tags.map(t=>`<button class="tag" data-tag="${t}">${t}</button>`).join('')}
    <button id="case-reset" class="btn--text" style="margin-left:8px">Сбросить</button>
    <span class="small muted" style="margin-left:auto">Найдено: <b id="case-count">${cases.length}</b></span>
  </div>
  <div class="cards mt-6">${cases.map(c=>`<article class="case" data-case data-tags="${c[5]}"><div class="case__head"><b>${c[0]}</b> · дело № ${c[1]} · ${c[2]}</div><p>${c[3]}</p><div class="case__res" style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--shellstone);color:var(--seal-blue);font-weight:600;font-size:14px">${c[4]}</div><div class="case__tags"><span class="tag">${c[5]}</span></div></article>`).join('')}</div>
  <p id="case-empty" style="display:none" class="muted mt-6">По выбранным фильтрам ничего не найдено. Сбросьте фильтры.</p>
</div></section>${ctaBand()}`;
  return shell({ file: 'keysy.html', title: `Кейсы — выполненные экспертизы | ${SITE.name}`, desc: 'Архив выполненных судебных экспертиз центра «Независимая Экспертиза» с фильтром по видам: строительные, криминалистические, оценочные, экономические.', active: '', trail, main });
}

/* Организация */
function organizaciyaPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Организация' }];
  const experts = [['Соколов В. А.','Строительно-техническая','14 лет · 600+ экспертиз','СВ'],['Морозова Е. И.','Оценочная, кадастровая','11 лет · 900+ экспертиз','ЕМ'],['Гаврилов П. С.','Почерковедческая, ТКЭД','16 лет · 1200+ экспертиз','ПГ'],['Титов А. Н.','Автотехническая, трасология','9 лет · 500+ экспертиз','АТ'],['Белова О. В.','Экономическая, финансовая','12 лет · 400+ экспертиз','ОБ'],['Кузнецов Д. М.','Инженерно-техническая','13 лет · 550+ экспертиз','ДК']];
  const faqSub = (FAQ.find(g => g.label === 'Организация и эксперты') || { items: [] }).items.slice(0, 6);
  const main = `
<section class="sec"><div class="wrap"><div class="prose narrow"><h1>О центре «Независимая Экспертиза»</h1>
  <p class="lead mt-4">${SITE.legal} — экспертное учреждение полного цикла. Проводим судебные и досудебные экспертизы, независимые исследования и лабораторные испытания с 2014 года.</p>
  <p>Центр — член Торгово-промышленной палаты г. Москвы. Офисы в Москве и Краснодаре, работаем по всей России. Заключения оформляются по 73-ФЗ и принимаются судами всех инстанций.</p></div>
  <div class="stats mt-8"><div><div class="stat__n tnum">2014</div><div class="stat__l">год основания</div></div><div><div class="stat__n tnum">12 386</div><div class="stat__l">экспертиз</div></div><div><div class="stat__n tnum">85</div><div class="stat__l">регионов</div></div><div><div class="stat__n tnum">50</div><div class="stat__l">экспертов</div></div></div>
</div></section>
<section class="sec sec--tight" id="eksperty" style="background:var(--white)"><div class="wrap"><div class="sec-head"><span class="eyebrow">Команда</span><h2>Эксперты</h2></div>
  <div class="experts">${experts.map(e=>`<div class="expert"><div class="expert__ph">${e[3]}</div><h4>${e[0]}</h4><div class="spec">${e[1]}</div><div class="meta">${e[2]}</div></div>`).join('')}</div>
</div></section>
<section class="sec" id="docs"><div class="wrap"><div class="sec-head"><span class="eyebrow">Документы</span><h2>Лицензии, свидетельства и сертификаты</h2><p>Нажмите на документ, чтобы увеличить.</p></div>
  <div class="docs">${Array.from({length:18},(_,i)=>`<div class="doc"><img src="assets/certificates/doki_${i+1}.jpg" alt="Документ ${i+1}" loading="lazy"></div>`).join('')}</div>
</section>
<section class="sec" id="smi"><div class="wrap"><div class="sec-head"><span class="eyebrow">Мы в СМИ</span><h2>Эксперты центра в медиа</h2><p>Наши специалисты комментируют резонансные споры и объясняют, как экспертиза помогает в суде и досудебном урегулировании.</p></div>
  <div class="cards">${[['ТВ · Москва 24','Апрель 2025','Как оспорить кадастровую стоимость','Эксперт-оценщик разъяснил, когда переоценка недвижимости снижает налог и как подготовить отчёт для суда.','video'],['ТВ · ТВЦ','Февраль 2025','Залив квартиры: кто виноват','Строительный эксперт — об установлении источника протечки и разграничении ответственности с УК.','video'],['РБК','Декабрь 2024','Автотехническая экспертиза после ДТП','О спорах со страховыми и о том, что даёт независимый расчёт стоимости ремонта и УТС.','video'],['Российская газета','Октябрь 2024','Почерк не обманешь','Разбор почерковедческой экспертизы в наследственных спорах и при оспаривании расписок.','read'],['Право.ру','Август 2024','Рецензия на заключение эксперта','Как рецензия помогает оспорить чужую судебную экспертизу и добиться повторной.','read'],['Коммерсантъ FM','Июнь 2024','Экспертиза в арбитраже','О роли независимой экспертизы в корпоративных и строительных спорах бизнеса.','audio']].map(m=>{var cta=m[4]==='read'?'Читать':(m[4]==='audio'?'Слушать':'Смотреть сюжет');var icon=m[4]==='read'?'<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"><path d=\"M6 3h9l3 3v15H6zM14 3v4h4\"/></svg>':'<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M8 5v14l11-7z\"/></svg>';return '<article class=\"media-card\"><div class=\"media-thumb\"><span class=\"media-ic\">'+icon+'</span><span class=\"media-tag\">'+m[0]+'</span></div><div class=\"media-body\"><div class=\"meta\">'+m[1]+'</div><h4>'+m[2]+'</h4><p>'+m[3]+'</p><a class=\"arrow\" href=\"#\">'+cta+' <span class=\"a\">→</span></a></div></article>';}).join('')}</div>
  <p class="caption muted mt-4">Материалы приведены как пример оформления блока. Реальные выступления и публикации добавим на боевом сайте.</p>
</div></section>
<section class="sec sec--tight" id="otzyvy" style="background:var(--white)"><div class="wrap"><div class="sec-head"><span class="eyebrow">Отзывы</span><h2>Отзывы и рекомендации</h2></div>
  <div class="cards">${[['Адвокатское бюро, Москва','Заключение по строительному спору выдержало проверку в апелляции. Эксперт чётко ответил на вопросы суда.'],['Юрдепартамент застройщика','Оперативно провели экспертизу объёмов работ, помогли обосновать позицию по контракту.'],['Частный клиент','Почерковедческая экспертиза помогла оспорить поддельную расписку. Спасибо за подробное заключение.']].map(o=>`<div class="panel"><p>«${o[1]}»</p><p class="small muted mt-4">— ${o[0]}</p></div>`).join('')}</div>
</div></section>
<section class="sec"><div class="wrap"><div class="sec-head"><h2>Частые вопросы</h2></div>${faqAccordion(faqSub)}</div></section>
${ctaBand()}`;
  return shell({ file: 'organizaciya.html', title: `О центре — 12 386 экспертиз, член ТПП Москвы | ${SITE.name}`, desc: 'АНО ИЦ «Независимая Экспертиза»: с 2014 года, 12 386 экспертиз, 50 экспертов, член ТПП Москвы. Эксперты, лицензии и сертификаты, отзывы.', active: 'organizaciya.html', trail, main });
}

/* Контакты */
function kontaktyPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Контакты' }];
  function cityBlock(key) {
    const c = SITE.cities[key];
    return `<div class="city-block${key === 'moscow' ? ' hl' : ''}" data-city="${key}"><h3>${c.name}</h3>
      <div class="contact-row">${ic('pin', 22)}<div><b>Адрес</b><span>${c.addr}<br>${c.metro}</span></div></div>
      <div class="contact-row">${ic('phone', 22)}<div><b>Телефон</b><span><a href="tel:${SITE.phoneRaw}">${c.phone}</a></span></div></div>
      <div class="contact-row">${ic('mail', 22)}<div><b>E-mail</b><span><a href="mailto:${SITE.email}">${SITE.email}</a></span></div></div>
      <div class="contact-row">${ic('clock', 22)}<div><b>Часы работы</b><span>${c.hours}</span></div></div>
      <div class="ph mt-4" style="height:200px">Схема проезда · ${c.name}</div></div>`;
  }
  const main = `
<section class="sec"><div class="wrap"><div class="prose narrow"><h1>Контакты</h1><p class="lead mt-4">Два офиса — в Москве и Краснодаре. Переключатель города в шапке подсвечивает нужный блок. Позвоните или оставьте заявку, консультация бесплатна.</p></div>
  <div class="contact-grid mt-8">${cityBlock('moscow')}${cityBlock('krasnodar')}</div>
  <div id="rekvizity" class="panel mt-8"><h3>Реквизиты</h3><div class="prose mt-4"><p>${SITE.legal}</p><p>ИНН ${SITE.inn} · КПП ${SITE.kpp} · ОГРН ${SITE.ogrn}</p><p>Юридический адрес: 123060, Москва, ул. Маршала Бирюзова, д. 32, к. 1</p><p>Генеральный директор: ${SITE.director}</p><p>Член Торгово-промышленной палаты г. Москвы.</p></div></div>
  <div class="mt-8"><h2>Оставить заявку</h2>${formHTML('vnesud')}</div>
</div></section>`;
  return shell({ file: 'kontakty.html', title: `Контакты — Москва и Краснодар | ${SITE.name}`, desc: 'Контакты центра «Независимая Экспертиза»: офисы в Москве (Никитский бульвар, 8а) и Краснодаре. Телефон 8 800 200-80-35, реквизиты, форма заявки.', active: 'kontakty.html', trail, main });
}

/* Заявка + успех */
function zayavkaPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Оставить заявку' }];
  const main = `<section class="sec"><div class="wrap"><div class="prose narrow"><h1>Оставить заявку</h1><p class="lead mt-4">Выберите сценарий, заполните форму — эксперт свяжется, уточнит вопросы и оценит стоимость и срок. Это демонстрационный прототип: данные не отправляются.</p></div><div class="mt-8" style="max-width:600px">${formHTML('sud')}</div></div></section>`;
  return shell({ file: 'zayavka.html', title: `Оставить заявку на экспертизу | ${SITE.name}`, desc: 'Оставьте заявку на судебную или досудебную экспертизу либо рецензию. Эксперт перезвонит и оценит стоимость и срок.', active: '', trail, main });
}
const INDUSTRIES = [
  { slug:'otrasl-stroitelstvo', name:'Строительство и девелопмент', ic:'build',
    intro:'Застройщикам, подрядчикам и заказчикам экспертиза помогает разрешать споры о качестве и объёме работ, обосновывать приёмку и защищать позицию в суде и в отношениях со страховыми.',
    groups:['stroitelnaya-ekspertiza','ocenochnaya-ekspertiza','inzhenernaya-ekspertiza','sudebnaya-ekspertiza'],
    situations:['Спор с подрядчиком об объёме и качестве работ','Дефекты, трещины и причины разрушений','Раздел объекта недвижимости','Проверка сметы и фактически выполненных работ'] },
  { slug:'otrasl-energetika', name:'Энергетика', ic:'bolt',
    intro:'Энергетическим и сетевым компаниям экспертиза нужна при спорах о технологическом присоединении, потерях в сетях, состоянии оборудования и объёмах потреблённой энергии.',
    groups:['inzhenernaya-ekspertiza','ekspertiza-oborudovaniya','ekonomicheskaya-ekspertiza'],
    situations:['Спор о потерях и потреблении электроэнергии','Состояние ЛЭП, сетей и подстанций','Отказ энергетического оборудования','Энергоаудит и обоснование тарифа'] },
  { slug:'otrasl-mashinostroenie', name:'Машиностроение', ic:'gear',
    intro:'Производственным предприятиям экспертиза помогает при спорах о качестве оборудования и продукции, причинах аварий на производстве и защите патентных прав.',
    groups:['ekspertiza-oborudovaniya','ekspertiza-transporta','patentnaya-ekspertiza'],
    situations:['Отказ или брак промышленного оборудования','Причины аварии на производстве','Соответствие продукции техническим требованиям','Спор о патентных правах'] },
  { slug:'otrasl-transport', name:'Транспорт и логистика', ic:'car',
    intro:'Транспортным и логистическим компаниям экспертиза нужна при ДТП, порче груза, спорах о состоянии техники и стоимости восстановительного ремонта.',
    groups:['ekspertiza-transporta','ocenochnaya-ekspertiza','specialnye-ekspertizy'],
    situations:['Обстоятельства и вина в ДТП','Порча или недостача груза','Стоимость ремонта и утрата товарной стоимости','Техническое состояние транспортного средства'] },
  { slug:'otrasl-it', name:'Информационные технологии', ic:'chip',
    intro:'IT-компаниям и заказчикам ПО экспертиза помогает в спорах о приёмке, качестве и работоспособности программного обеспечения, а также при защите прав на исходный код.',
    groups:['kompyuternaya-ekspertiza','patentnaya-ekspertiza','ekonomicheskaya-ekspertiza'],
    situations:['Спор о приёмке и качестве ПО','Работоспособность и соответствие ТЗ','Права на исходный код','Экспертиза IT-госконтракта'] },
  { slug:'otrasl-gossektor', name:'Государственный сектор', ic:'shield',
    intro:'Государственным заказчикам и поставщикам экспертиза нужна для подтверждения объёмов и качества по контракту, обоснования приёмки или мотивированного отказа по 44-ФЗ и 223-ФЗ.',
    groups:['goszakupki','stroitelnaya-ekspertiza','ekonomicheskaya-ekspertiza'],
    situations:['Обоснование отказа в приёмке','Проверка объёмов и качества по контракту','Экспертиза НМЦК','Сопровождение спора с подрядчиком'] },
  { slug:'otrasl-zhkh', name:'ЖКХ и управление недвижимостью', ic:'build',
    intro:'Управляющим компаниям, ТСЖ и собственникам экспертиза помогает в спорах о состоянии общего имущества, качестве коммунальных услуг и установлении виновника залива.',
    groups:['inzhenernaya-ekspertiza','stroitelnaya-ekspertiza','ocenochnaya-ekspertiza'],
    situations:['Установление виновника залива','Состояние общего имущества МКД','Качество коммунальных услуг','Споры с ресурсоснабжающими организациями'] },
  { slug:'otrasl-finansy', name:'Финансовый сектор', ic:'chart',
    intro:'Банкам, страховым и инвесторам экспертиза нужна при взыскании ущерба, оценке активов, проверке подлинности документов и в делах о банкротстве.',
    groups:['ekonomicheskaya-ekspertiza','ocenochnaya-ekspertiza','kriminalisticheskaya-ekspertiza'],
    situations:['Размер ущерба и задолженности','Оценка залогового имущества','Подлинность подписи и документов','Признаки преднамеренного банкротства'] }
];
function industryPage(ind) {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Отрасли', href: 'otrasli.html' }, { t: ind.name }];
  const cards = ind.groups.map(slug => {
    if (slug === 'goszakupki') return `<a class="card" href="goszakupki.html"><div class="card__ic">${ic('shield', 28)}</div><h4>Экспертиза госзакупок</h4><p>Исполнение контракта по 44-ФЗ и 223-ФЗ, объёмы и качество, приёмка, НМЦК.</p><div class="card__meta"><span>от 35 000 ₽</span><span class="a">Подробнее →</span></div></a>`;
    const g = GROUPS.find(x => x.slug === slug); if (!g) return '';
    return `<a class="card" href="${g.slug}.html"><div class="card__ic">${ic(g.ic, 28)}</div><h4>${g.name}</h4><p>${g.desc}</p><div class="card__meta"><span>от ${money(g.from)}</span><span class="a">Подробнее →</span></div></a>`;
  }).join('');
  const main = `<section class="sec"><div class="wrap"><div class="prose narrow">
    <h1>Экспертиза для отрасли «${ind.name}»</h1>
    <div class="answer mt-4">${ind.intro}</div></div>
  <h2 class="mt-8">Актуальные виды экспертиз</h2>
  <div class="cards mt-4">${cards}</div>
  <div class="prose narrow mt-8"><h2>Типовые ситуации в отрасли</h2><ul>${li(ind.situations)}</ul></div>
</div></section>${ctaBand()}`;
  return shell({ file: ind.slug + '.html', title: `Экспертиза для отрасли «${ind.name}» | ${SITE.name}`, desc: `Судебная и досудебная экспертиза для отрасли «${ind.name}». Релевантные виды экспертиз и типовые споры.`, active: 'otrasli.html', trail, main });
}
function otraslPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Отрасли' }];
  const main = `<section class="sec"><div class="wrap"><div class="prose narrow"><h1>Экспертиза по отраслям</h1><div class="answer mt-4">Для каждой отрасли — свой набор экспертиз и типовых споров. Выберите отрасль, чтобы увидеть релевантные виды исследований и перейти к нужной экспертизе.</div></div>
  <div class="dirs mt-8">${INDUSTRIES.map(i=>`<a class="dir" href="${i.slug}.html" style="text-decoration:none"><div class="dir__ic">${ic(i.ic,28)}</div><h3>${i.name}</h3><div class="dir__ex"><span class="arrow">Экспертизы для отрасли <span class="a">→</span></span></div></a>`).join('')}</div>
</div></section>${ctaBand()}`;
  return shell({ file: 'otrasli.html', title: `Экспертиза по отраслям | ${SITE.name}`, desc: 'Экспертизы по отраслям: строительство, энергетика, машиностроение, транспорт, ИТ, госсектор, ЖКХ, финансы. Релевантные виды экспертиз для каждой отрасли.', active: 'otrasli.html', trail, main });
}

/* FAQ страница */
function faqPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Частые вопросы' }];
  const total = FAQ.reduce((n, g) => n + g.items.length, 0);
  const nav = FAQ.map((g, i) => `<a href="#f${i}">${g.label}</a>`).join('');
  const blocks = FAQ.map((g, i) => `<div id="f${i}" data-search-group style="margin-bottom:32px"><h2>${g.label}</h2><div class="faq mt-4">${g.items.map(f => `<details data-search-item data-name="${esc(f.q)}"><summary>${esc(f.q)}</summary><div class="a">${esc(f.a)}</div></details>`).join('')}</div></div>`).join('');
  const main = `<section class="sec"><div class="wrap"><div class="prose narrow"><h1>Частые вопросы</h1><p class="lead mt-4">${total} вопросов и ответов по видам экспертиз, стоимости, срокам и судебному процессу. Тот же материал использует виджет-помощник.</p></div>
  <div style="display:grid;grid-template-columns:240px 1fr;gap:40px;margin-top:32px" class="ek-layout">
    <aside class="aside"><input id="type-search" type="search" placeholder="Поиск по вопросам…" style="width:100%;height:44px;border:1px solid var(--shellstone);border-radius:4px;padding:0 14px;margin-bottom:16px"><nav style="display:flex;flex-direction:column;gap:4px;font-size:14px">${nav}</nav></aside>
    <div>${blocks}</div>
  </div></div></section>${ctaBand()}`;
  return shell({ file: 'faq.html', title: `Частые вопросы об экспертизе — ${total} ответов | ${SITE.name}`, desc: `${total} ответов на частые вопросы о судебной и досудебной экспертизе: стоимость, сроки, процесс, виды экспертиз.`, active: '', trail, main });
}
function politikaPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Политика конфиденциальности' }];
  const main = `<section class="sec"><div class="wrap"><div class="prose">
    <h1>Политика конфиденциальности</h1>
    <p class="muted mt-4">Демонстрационный прототип — формы на сайте не отправляют данные. Ниже приведена политика, которая будет действовать на боевом сайте rosbars.ru.</p>
    <h2>1. Общие положения</h2>
    <p>Настоящая Политика разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки и защиты персональных данных пользователей сайта rosbars.ru. Оператором персональных данных является ${SITE.legal} (далее — Оператор).</p>
    <h2>2. Какие данные обрабатываются</h2>
    <ul>${li(['Данные, которые вы указываете в форме заявки: имя, номер телефона, адрес электронной почты, описание ситуации.','Технические данные, фиксируемые автоматически: IP-адрес, тип браузера, посещённые страницы, источник перехода, дата и время визита.'])}</ul>
    <p>Технические данные используются для статистики и корректной работы сайта и сами по себе не позволяют идентифицировать конкретное лицо.</p>
    <h2>3. Цели обработки</h2>
    <ul>${li(['Обработка обращения и консультация по услугам центра.','Заключение и исполнение договора на проведение экспертизы.','Информирование о статусе обращения и результатах.'])}</ul>
    <h2>4. Правовые основания</h2>
    <p>Обработка ведётся на основании согласия субъекта персональных данных, выражаемого при отправке формы, а также в целях исполнения договора, стороной которого является субъект персональных данных.</p>
    <h2>5. Cookies и аналитика</h2>
    <p>Сайт использует технические cookies для корректной работы. Для сбора обезличенной статистики может применяться Яндекс Метрика, в том числе Вебвизор с маскированием содержимого полей форм. Отключить сбор можно в настройках браузера.</p>
    <h2>6. Хранение и передача</h2>
    <p>Персональные данные хранятся не дольше, чем этого требуют цели обработки, и не передаются третьим лицам без законных оснований. Обработка данных ведётся на территории Российской Федерации.</p>
    <h2>7. Ваши права</h2>
    <p>Вы вправе запросить сведения об обработке ваших персональных данных, потребовать их уточнения, блокирования или удаления, а также отозвать согласие, направив обращение на ${SITE.email}. Срок ответа на обращение — 10 рабочих дней.</p>
    <h2>8. Изменения политики</h2>
    <p>Оператор вправе вносить изменения в настоящую Политику. Актуальная редакция всегда размещена на этой странице.</p>
    <h2>9. Реквизиты оператора</h2>
    <p>${SITE.legal}<br>ИНН ${SITE.inn} · КПП ${SITE.kpp} · ОГРН ${SITE.ogrn}<br>Юридический адрес: 123060, Москва, ул. Маршала Бирюзова, д. 32, к. 1<br>E-mail: ${SITE.email} · Телефон: ${SITE.phone}<br>Генеральный директор: ${SITE.director}</p>
  </div></div></section>`;
  return shell({ file: 'politika.html', title: `Политика конфиденциальности | ${SITE.name}`, desc: 'Политика обработки персональных данных.', active: '', trail, main });
}
function kartaSaytaPage() {
  const trail = [{ t: 'Главная', href: 'index.html' }, { t: 'Карта сайта' }];
  const secs = MENU.map(m => {
    let subs = m.mega ? GROUPS.map(g => `<li><a href="${g.slug}.html">${g.name}</a></li>`).join('') : (m.sub ? m.sub.map(s => `<li><a href="${s[1]}">${s[0]}</a></li>`).join('') : '');
    return `<div><h3><a href="${m.href}">${m.t}</a></h3><ul class="prose mt-4">${subs}</ul></div>`;
  }).join('');
  const main = `<section class="sec"><div class="wrap"><h1>Карта сайта</h1><div class="cards mt-8">${secs}<div><h3>Ещё</h3><ul class="prose mt-4"><li><a href="stoimost.html">Стоимость и сроки</a></li><li><a href="faq.html">Частые вопросы</a></li><li><a href="keysy.html">Кейсы</a></li><li><a href="zayavka.html">Оставить заявку</a></li><li><a href="politika.html">Политика конфиденциальности</a></li></ul></div></div></div></section>`;
  return shell({ file: 'karta-sayta.html', title: `Карта сайта | ${SITE.name}`, desc: 'Карта сайта.', active: '', trail, main });
}

/* ---------- Стандалон-услуги ---------- */
const STANDALONE_SVC = [
  { file:'pocherkovedcheskaya.html', group:'Криминалистическая', groupHref:'kriminalisticheskaya-ekspertiza.html', crumb:'Почерковедческая', from:15000, term:'5–10 рабочих дней',
    h1:'Почерковедческая экспертиза', desc:'Почерковедческая экспертиза подписи и рукописи: установление исполнителя, подделки, подражания. От 15 000 ₽.',
    answer:'Почерковедческая экспертиза устанавливает исполнителя подписи или рукописной записи, факт подражания и необычные условия выполнения. Назначается по спорам о подлинности договоров, расписок, завещаний и доверенностей. Проводится по оригиналам, при их отсутствии — по копиям с ограничениями. Стоимость — от 15 000 ₽, срок 5–10 рабочих дней.',
    when:['Оспаривание подписи в договоре или расписке','Сомнения в подлинности завещания','Подозрение на подделку или подражание','Наследственные и трудовые споры'],
    q:['Кем выполнена подпись или запись?','Одним или разными лицами выполнены записи?','Выполнена ли подпись с подражанием?','В обычных или необычных условиях сделана запись?'],
    norms:['73-ФЗ «О государственной судебно-экспертной деятельности»','Методики судебного почерковедения (РФЦСЭ Минюста)','ст. 307 УК РФ'],
    faq:(FAQ.find(g=>g.label==='Криминалистическая')||{items:[]}).items.slice(0,5),
    related:[['Давность документа','kriminalisticheskaya-ekspertiza.html'],['Технико-криминалистическая','kriminalisticheskaya-ekspertiza.html'],['Лингвистическая','kriminalisticheskaya-ekspertiza.html']] },
  { file:'kadastrovaya-stoimost.html', group:'Оценочная', groupHref:'ocenochnaya-ekspertiza.html', crumb:'Кадастровая стоимость', from:15000, term:'от 5 рабочих дней',
    h1:'Оспаривание кадастровой стоимости', desc:'Экспертиза для оспаривания кадастровой стоимости недвижимости и земли. Снижение налога, от 15 000 ₽.',
    answer:'Экспертиза определяет рыночную стоимость объекта и сопоставляет её с кадастровой. Когда кадастровая стоимость завышена, она увеличивает налог на имущество и земельный налог. По отчёту стоимость пересматривают через комиссию или суд, а налоговую базу пересчитывают. Стоимость исследования — от 15 000 ₽, срок от 5 рабочих дней.',
    when:['Кадастровая стоимость выше рыночной','Завышенный налог на имущество или землю','Подготовка к оспариванию в суде или комиссии'],
    q:['Какова рыночная стоимость объекта?','Насколько кадастровая стоимость отличается от рыночной?','Имеются ли ошибки в определении кадастровой стоимости?'],
    norms:['135-ФЗ «Об оценочной деятельности»','237-ФЗ «О государственной кадастровой оценке»','Федеральные стандарты оценки (ФСО)'],
    faq:(FAQ.find(g=>g.label==='Оценочная')||{items:[]}).items.slice(0,5),
    related:[['Оценка недвижимости','ocenochnaya-ekspertiza.html'],['Земельные участки','ocenochnaya-ekspertiza.html'],['Ущерб от залива','ocenochnaya-ekspertiza.html']] },
  { file:'avtotehnicheskaya.html', group:'Транспорт', groupHref:'ekspertiza-transporta.html', crumb:'Автотехническая', from:15000, term:'5–12 рабочих дней',
    h1:'Автотехническая и транспортно-трасологическая экспертиза', desc:'Автотехническая экспертиза: обстоятельства ДТП, стоимость ремонта, трасология, УТС. От 15 000 ₽.',
    answer:'Автотехническая экспертиза восстанавливает обстоятельства и механизм ДТП, оценивает техническое состояние автомобиля, стоимость восстановительного ремонта и утрату товарной стоимости. Назначается по спорам о вине, при занижении страховой выплаты и по качеству ремонта. Стоимость — от 15 000 ₽, срок 5–12 рабочих дней.',
    when:['Спор о вине в ДТП','Занижение выплаты страховой','Скрытые повреждения после аварии','Расчёт утраты товарной стоимости'],
    q:['Каков механизм ДТП?','Была ли техническая возможность избежать ДТП?','Какова стоимость восстановительного ремонта?','Соответствуют ли повреждения обстоятельствам?'],
    norms:['73-ФЗ','Методика Минюста 2018 (расчёт по ОСАГО)','Правила дорожного движения РФ'],
    faq:(FAQ.find(g=>g.label==='Автотехническая')||{items:[]}).items.slice(0,5),
    related:[['Оценка автотранспорта','ocenochnaya-ekspertiza.html'],['Кораблестроения','ekspertiza-transporta.html'],['Летательных аппаратов','ekspertiza-transporta.html']] }
];

/* ---------- Сборка ---------- */
const PAGES = [];
PAGES.push({ f: 'index.html', h: homePage() });
PAGES.push({ f: 'ekspertizy.html', h: ekspertizyPage() });
PAGES.push({ f: 'stoimost.html', h: stoimostPage() });
PAGES.push({ f: 'goszakupki.html', h: goszakupkiPage() });
PAGES.push({ f: 'recenzii.html', h: recenziiPage() });
PAGES.push({ f: 'keysy.html', h: keysyPage() });
PAGES.push({ f: 'organizaciya.html', h: organizaciyaPage() });
PAGES.push({ f: 'kontakty.html', h: kontaktyPage() });
PAGES.push({ f: 'zayavka.html', h: zayavkaPage() });
PAGES.push({ f: 'otrasli.html', h: otraslPage() });
PAGES.push({ f: 'faq.html', h: faqPage() });
PAGES.push({ f: 'politika.html', h: politikaPage() });
PAGES.push({ f: 'karta-sayta.html', h: kartaSaytaPage() });
PAGES.push({ f: 'prichiny-zaliva.html', h: zalivPage() });
GROUPS.forEach(g => PAGES.push({ f: g.slug + '.html', h: pillarPage(g) }));
STANDALONE_SVC.forEach(s => PAGES.push({ f: s.file, h: servicePage(s) }));
INDUSTRIES.forEach(ind => PAGES.push({ f: ind.slug + '.html', h: industryPage(ind) }));

// удалить старые страницы прошлой сборки
['uslugi.html','o-tsentre.html','uslugi-stroitelnaya.html','uslugi-pocherkovedcheskaya.html','uslugi-ocenochnaya.html','uslugi-avtotehnicheskaya.html','uslugi-tovarovedcheskaya.html','uslugi-ekonomicheskaya.html','uslugi-zemleustroitelnaya.html','uslugi-pozharno-tehnicheskaya.html'].forEach(f=>{try{fs.unlinkSync(OUT+'/'+f);}catch(e){}});

const seen = {};
PAGES.forEach(p => { if (seen[p.f]) return; seen[p.f] = 1; fs.writeFileSync(require('path').join(OUT, p.f), p.h, 'utf8'); });
console.log('Собрано страниц: ' + Object.keys(seen).length);
Object.keys(seen).forEach(f => console.log('  ' + f));
