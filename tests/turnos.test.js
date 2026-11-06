const test = require('node:test');
const assert = require('node:assert/strict');
const { crearAgenda } = require('../src/dominio/turnos');

test('reservar un horario libre crea un turno activo con código', () => {
  const agenda = crearAgenda();
  const turno = agenda.reservar('Ana', '09:00');
  assert.equal(turno.estado, 'activo');
  assert.equal(turno.codigo, 'T-0900');
});

test('no permite reservar el mismo horario dos veces', () => {
  const agenda = crearAgenda();
  agenda.reservar('Ana', '10:00');
  assert.throws(() => agenda.reservar('Luis', '10:00'), /ya está reservado/);
});

test('rechaza un horario fuera de la lista', () => {
  const agenda = crearAgenda();
  assert.throws(() => agenda.reservar('Ana', '13:00'), /Horario no válido/);
});

test('rechaza un nombre vacío', () => {
  const agenda = crearAgenda();
  assert.throws(() => agenda.reservar('   ', '09:00'), /nombre es obligatorio/);
});

test('cancelar libera el horario', () => {
  const agenda = crearAgenda();
  const turno = agenda.reservar('Ana', '11:00');
  agenda.cancelar(turno.id);
  assert.ok(agenda.horariosLibres().includes('11:00'));
});

test('cancelar un turno inexistente falla', () => {
  const agenda = crearAgenda();
  assert.throws(() => agenda.cancelar(99), /no encontrado/);
});
