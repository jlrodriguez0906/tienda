// Escáner de secretos mínimo y didáctico (sin dependencias).
// Busca patrones típicos de claves en los archivos versionados. En un proyecto real
// se usan herramientas especializadas (por ejemplo, gitleaks); aquí se muestra la idea.
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');

const PATRONES = [
  { nombre: 'Clave de acceso de AWS', regex: /AKIA[0-9A-Z]{16}/ },
  { nombre: 'Token personal de GitHub', regex: /gh[pousr]_[A-Za-z0-9]{36,}/ },
  { nombre: 'Clave privada', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { nombre: 'Asignación de secreto', regex: /(password|secret|token|api[_-]?key)\s*[:=]\s*['"][^'"\s]{8,}['"]/i }
];
const IGNORAR = ['package-lock.json', 'scripts/escanear-secretos.js'];

const archivos = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
  .split('\n').filter((f) => f && !IGNORAR.includes(f) && fs.existsSync(f));

const hallazgos = [];
for (const archivo of archivos) {
  const lineas = fs.readFileSync(archivo, 'utf8').split('\n');
  lineas.forEach((linea, i) => {
    for (const p of PATRONES) {
      if (p.regex.test(linea)) hallazgos.push(archivo + ':' + (i + 1) + '  ' + p.nombre);
    }
  });
}

if (hallazgos.length > 0) {
  console.error('Se encontraron posibles secretos:');
  hallazgos.forEach((h) => console.error('  ' + h));
  process.exit(1);
}
console.log('Sin secretos detectados en ' + archivos.length + ' archivos.');
