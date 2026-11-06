// Función de aptitud (fitness function): la decisión de arquitectura (ADR-001)
// "el dominio no depende de la API" se verifica como una prueba automática.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..', 'src');

function archivos(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? archivos(path.join(dir, e.name)) : e.name.endsWith('.js') ? [path.join(dir, e.name)] : []);
}

function imports(archivo) {
  const texto = fs.readFileSync(archivo, 'utf8');
  return [...texto.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
}

test('ADR-001: ningún archivo del dominio importa la capa api', () => {
  const infractores = archivos(path.join(raiz, 'dominio'))
    .filter((a) => imports(a).some((i) => i.includes('api')))
    .map((a) => path.relative(raiz, a));
  assert.deepEqual(infractores, [], 'El dominio no puede depender de la API: ' + infractores.join(', '));
});
