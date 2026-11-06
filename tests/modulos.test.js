// Prueba de humo: carga todos los módulos de src/ (excepto el punto de entrada).
// Así la cobertura también cuenta los archivos que todavía no tienen pruebas propias.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..', 'src');

function archivos(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? archivos(path.join(dir, e.name)) : e.name.endsWith('.js') ? [path.join(dir, e.name)] : []);
}

test('todos los módulos de src se cargan sin errores', () => {
  const modulos = archivos(raiz).filter((a) => path.basename(a) !== 'app.js');
  assert.ok(modulos.length >= 2);
  for (const modulo of modulos) {
    assert.doesNotThrow(() => require(modulo), modulo);
  }
});
