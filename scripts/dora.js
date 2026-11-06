// Calcula cinco métricas tipo DORA a partir de data/despliegues.json (datos aproximados).
const fs = require('node:fs');
const datos = JSON.parse(fs.readFileSync(__dirname + '/../data/despliegues.json', 'utf8'));
const horas = (a, b) => (new Date(b) - new Date(a)) / 36e5;
const media = (v) => (v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0);
const d = datos.despliegues;

const tiempoEntrega = media(d.map((x) => horas(x.commit, x.despliegue)));
const semanas = datos.periodoDias / 7;
const fallidos = d.filter((x) => x.fallo);
const recuperacion = media(fallidos.filter((x) => x.recuperado).map((x) => horas(x.despliegue, x.recuperado)));

console.log('Métrica                          Valor');
console.log('Tiempo de entrega de cambios     ' + tiempoEntrega.toFixed(1) + ' h');
console.log('Frecuencia de despliegue         ' + (d.length / semanas).toFixed(1) + ' por semana');
console.log('Tiempo de recuperación           ' + recuperacion.toFixed(1) + ' h');
console.log('Tasa de fallos de cambios        ' + ((fallidos.length / d.length) * 100).toFixed(0) + ' %');
console.log('Tasa de retrabajo                ' + ((d.filter((x) => x.correccion).length / d.length) * 100).toFixed(0) + ' %');
