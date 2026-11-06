// Coherencia código-contrato: las rutas que implementa el servidor deben ser
// exactamente las que documenta api/openapi.yaml.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const leer = (...partes) => fs.readFileSync(path.join(__dirname, '..', ...partes), 'utf8');

const contrato = leer('api', 'openapi.yaml');
const servidor = leer('src', 'api', 'servidor.js');

const rutasDelContrato = [...contrato.matchAll(/^ {2}(\/[^:\s]*):/gm)].map((m) => m[1]);
const rutasDelServidor = [
  ...servidor.matchAll(/pathname === '(\/[^']*)'/g)].map((m) => m[1]);
if (/\\\/turnos\\\/\(\\d\+\)/.test(servidor)) rutasDelServidor.push('/turnos/{id}');

test('el contrato documenta exactamente las rutas del servidor', () => {
  const unicas = (lista) => [...new Set(lista)].sort();
  assert.deepEqual(unicas(rutasDelContrato), unicas(rutasDelServidor));
});
