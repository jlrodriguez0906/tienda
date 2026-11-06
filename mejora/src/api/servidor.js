// Capa de API: traduce peticiones HTTP a llamadas al dominio y sirve la interfaz web.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { crearAgenda } = require('../dominio/turnos');
const { version } = require('../../package.json');

const CARPETA_PUBLICA = path.join(__dirname, '..', '..', 'public');

// Lista cerrada de archivos de la interfaz: nada fuera de esta lista se puede leer desde el navegador.
const ESTATICOS = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/estilos.css': ['estilos.css', 'text/css; charset=utf-8']
};

function responder(res, estado, cuerpo) {
  res.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(cuerpo));
}

async function servirEstatico(res, archivo, tipo) {
  const contenido = await fs.readFile(path.join(CARPETA_PUBLICA, archivo));
  res.writeHead(200, { 'Content-Type': tipo });
  res.end(contenido);
}

function leerJson(req) {
  return new Promise((resolve, reject) => {
    let datos = '';
    req.on('data', (parte) => { datos += parte; });
    req.on('end', () => {
      try { resolve(datos ? JSON.parse(datos) : {}); } catch { reject(new Error('JSON no válido')); }
    });
  });
}

function crearServidor() {
  const agenda = crearAgenda();

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (req.method === 'GET' && ESTATICOS[url.pathname]) {
        const [archivo, tipo] = ESTATICOS[url.pathname];
        return await servirEstatico(res, archivo, tipo);
      }
      if (req.method === 'GET' && url.pathname === '/salud') {
        // RENDER_GIT_COMMIT lo define Render con el commit desplegado; en local vale "local".
        return responder(res, 200, { estado: 'ok', version, commit: process.env.RENDER_GIT_COMMIT || 'local' });
      }
      if (req.method === 'GET' && url.pathname === '/resumen') {
        return responder(res, 200, agenda.resumen());
      }
      if (req.method === 'GET' && url.pathname === '/turnos') {
        return responder(res, 200, agenda.listar());
      }
      if (req.method === 'GET' && url.pathname === '/horarios') {
        return responder(res, 200, agenda.horariosLibres());
      }
      if (req.method === 'POST' && url.pathname === '/turnos') {
        const { nombre, hora } = await leerJson(req);
        return responder(res, 201, agenda.reservar(nombre, hora));
      }
      const cancelacion = url.pathname.match(/^\/turnos\/(\d+)$/);
      if (req.method === 'DELETE' && cancelacion) {
        return responder(res, 200, agenda.cancelar(Number(cancelacion[1])));
      }
      return responder(res, 404, { error: 'Ruta no encontrada' });
    } catch (error) {
      const estado = error.message === 'Turno no encontrado' ? 404 : 400;
      return responder(res, estado, { error: error.message });
    }
  });
}

module.exports = { crearServidor };
