// Удаляет из прозы предложения, содержащие цену («₽»). Цена остаётся только на /stoimost
// и в блоке цены внизу страницы услуги. Сокращения (ст., п., г., т. д. …) защищаем от разбиения.
module.exports = function stripPrice(t){
  if(!t) return t;
  var s = String(t);
  var M = String.fromCharCode(1); // временная метка вместо точки сокращения
  var AB = /(^|[\s(«»"„'’ ])(гг|ул|корп|стр|просп|обл|респ|абз|руб|коп|тыс|млн|млрд|напр|табл|рис|каб|оф|пп|пл|пр|др|им|св|см|мн|ст|ч|г|д|к|р|т|е|п)\.(\s| )/gi;
  for(var i=0;i<3;i++){ s = s.replace(AB, function(m,pre,ab,post){ return pre + ab + M + post; }); }
  var parts = s.split(/(?<=[.!?])\s+/).filter(function(x){ return x.indexOf('₽') === -1; });
  s = parts.join(' ').split(M).join('.');
  return s.replace(/\s{2,}/g,' ').replace(/\s+([.,;:])/g,'$1').replace(/\(\s*\)/g,'').trim();
};
