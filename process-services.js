'use strict';
const fs = require('fs');
const { SERVICES_ALL } = require('./data.js');
const src = 'C:/Users/NEUTRON/AppData/Local/Temp/claude/D-------rosbars/3b6d96f9-bcb9-4597-b3d8-33ae35222a35/tasks/whq6ki52n.output';
let raw = fs.readFileSync(src, 'utf8').trim();
let data; try { data = JSON.parse(raw); } catch (e) { const a = raw.indexOf('['), b = raw.lastIndexOf(']'); data = JSON.parse(raw.slice(a, b + 1)); }
const arr = Array.isArray(data) ? data : (data.result || []);
const out = {};
let n = 0;
arr.filter(Boolean).forEach(batch => {
  (batch.items || []).forEach(it => {
    if (it && it.name) { out[it.name] = { h1: it.h1, meta: it.meta, answer: it.answer, when: it.when, questions: it.questions, norms: it.norms, caseText: it.caseText, faq: it.faq }; n++; }
  });
});
fs.writeFileSync(__dirname + '/services-content.json', JSON.stringify(out), 'utf8');
// match check
const need = SERVICES_ALL.filter(s => !s.custom);
const matched = need.filter(s => out[s.name]);
const missing = need.filter(s => !out[s.name]);
console.log('Контент-объектов: ' + n + ', уникальных имён: ' + Object.keys(out).length);
console.log('Услуг без custom: ' + need.length + ', с контентом: ' + matched.length + ', БЕЗ контента: ' + missing.length);
if (missing.length) console.log('НЕ СОПОСТАВЛЕНЫ: ' + missing.map(s => s.name).join(' | '));
