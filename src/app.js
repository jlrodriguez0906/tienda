// Punto de entrada: levanta el servidor en el puerto 3000 (o el de la variable PORT).
const { crearServidor } = require('./api/servidor');

const puerto = process.env.PORT || 3000;
crearServidor().listen(puerto, () => {
  console.log('Turnos en línea escuchando en http://localhost:' + puerto);
});
