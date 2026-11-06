const test = require('node:test');
const assert = require('node:assert/strict');
const { crearAgenda } = require('../src/dominio/turnos');
const { crearServidor } = require('../src/api/servidor');

test('resumen cuenta turnos activos, cancelados y horarios libres', () => {
  const agenda = crearAgenda();
  assert.deepEqual(agenda.resumen(), { total: 0, activos: 0, cancelados: 0, libres: 4 });
  const ana = agenda.reservar('Ana', '09:00');
  agenda.reservar('Luis', '10:00');
  agenda.cancelar(ana.id);
  assert.deepEqual(agenda.resumen(), { total: 2, activos: 1, cancelados: 1, libres: 3 });
});

test('GET /resumen responde con el resumen de la agenda', async () => {
  const servidor = crearServidor();
  await new Promise((ok) => servidor.listen(0, ok));
  try {
    const r = await fetch('http://localhost:' + servidor.address().port + '/resumen');
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { total: 0, activos: 0, cancelados: 0, libres: 4 });
  } finally {
    servidor.close();
  }
});
