'use strict';
const fs = require('fs');
const src = 'C:/Users/NEUTRON/AppData/Local/Temp/claude/D-------rosbars/3b6d96f9-bcb9-4597-b3d8-33ae35222a35/tasks/w0dwztpom.output';
let raw = fs.readFileSync(src, 'utf8').trim();
let data;
try { data = JSON.parse(raw); }
catch (e) {
  const a = raw.indexOf('['), b = raw.lastIndexOf(']');
  data = JSON.parse(raw.slice(a, b + 1));
}
// метки тем по порядку (воркфлоу сохраняет порядок TOPICS)
const LABELS = ['Общие вопросы','Стоимость и оплата','Сроки и порядок','Суд и процесс','Строительная',
  'Оценочная','Криминалистическая','Автотехническая','Экономическая','Инженерная и ЖКХ','Госзакупки',
  'Рецензии','Специальные виды','Организация и эксперты'];
const arr = Array.isArray(data) ? data : (data.result || []);
const grouped = arr.filter(Boolean).map((t, i) => ({ label: LABELS[i] || ('Тема ' + (i + 1)), items: t.items || [] }));
const total = grouped.reduce((n, g) => n + g.items.length, 0);
fs.writeFileSync(__dirname + '/faq.json', JSON.stringify(grouped), 'utf8');
const flat = [];
grouped.forEach(g => g.items.forEach(it => flat.push({ q: it.q, a: it.a, t: g.label })));
fs.writeFileSync(__dirname + '/assets/faq-data.js', 'window.FAQ=' + JSON.stringify(flat) + ';', 'utf8');
console.log('Тем: ' + grouped.length + ', вопросов: ' + total);
grouped.forEach(g => console.log('  ' + g.label + ': ' + g.items.length));
