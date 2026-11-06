const test = require('node:test');
const assert = require('node:assert/strict');
const { crearServidor } = require('../src/api/servidor');

async function conServidor(prueba) {
  const servidor = crearServidor();
  await new Promise((ok) => servidor.listen(0, ok));
  const base = 'http://localhost:' + servidor.address().port;
  try { await prueba(base); } finally { servidor.close(); }
}

const json = { 'Content-Type': 'application/json' };

test('POST /turnos crea un turno y responde 201', () => conServidor(async (base) => {
  const r = await fetch(base + '/turnos', { method: 'POST', headers: json, body: JSON.stringify({ nombre: 'Ana', hora: '09:00' }) });
  assert.equal(r.status, 201);
  assert.equal((await r.json()).codigo, 'T-0900');
}));

test('POST /turnos con horario ocupado responde 400', () => conServidor(async (base) => {
  const cuerpo = JSON.stringify({ nombre: 'Ana', hora: '09:00' });
  await fetch(base + '/turnos', { method: 'POST', headers: json, body: cuerpo });
  const r = await fetch(base + '/turnos', { method: 'POST', headers: json, body: cuerpo });
  assert.equal(r.status, 400);
}));

test('GET /horarios lista los horarios libres', () => conServidor(async (base) => {
  const r = await fetch(base + '/horarios');
  assert.deepEqual(await r.json(), ['09:00', '10:00', '11:00', '12:00']);
}));

test('DELETE /turnos/:id cancela y un id inexistente responde 404', () => conServidor(async (base) => {
  await fetch(base + '/turnos', { method: 'POST', headers: json, body: JSON.stringify({ nombre: 'Ana', hora: '10:00' }) });
  assert.equal((await fetch(base + '/turnos/1', { method: 'DELETE' })).status, 200);
  assert.equal((await fetch(base + '/turnos/99', { method: 'DELETE' })).status, 404);
}));

test('GET /turnos lista y una ruta desconocida responde 404', () => conServidor(async (base) => {
  assert.equal((await fetch(base + '/turnos')).status, 200);
  assert.equal((await fetch(base + '/nada')).status, 404);
}));

test('POST con JSON roto responde 400', () => conServidor(async (base) => {
  const r = await fetch(base + '/turnos', { method: 'POST', headers: json, body: '{roto' });
  assert.equal(r.status, 400);
}));

test('GET /salud informa estado, versión y commit', () => conServidor(async (base) => {
  const r = await fetch(base + '/salud');
  const cuerpo = await r.json();
  assert.equal(r.status, 200);
  assert.equal(cuerpo.estado, 'ok');
  assert.equal(cuerpo.version, require('../package.json').version);
  assert.equal(typeof cuerpo.commit, 'string');
}));

test('la interfaz web se sirve desde la raíz', () => conServidor(async (base) => {
  const pagina = await fetch(base + '/');
  assert.equal(pagina.status, 200);
  assert.match(pagina.headers.get('content-type'), /text\/html/);
  assert.match(await pagina.text(), /Turnos en línea/);
  assert.equal((await fetch(base + '/app.js')).status, 200);
  assert.equal((await fetch(base + '/estilos.css')).status, 200);
}));
