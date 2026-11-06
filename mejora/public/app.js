// Interfaz de Turnos en línea: llama a la API del mismo servidor.
const lista = document.getElementById('lista');
const selector = document.getElementById('hora');
const mensaje = document.getElementById('mensaje');

async function pedir(ruta, opciones) {
  const respuesta = await fetch(ruta, opciones);
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || 'Error inesperado');
  }
  return datos;
}

async function cargarHorarios() {
  const horarios = await pedir('/horarios');
  selector.replaceChildren();
  for (const hora of horarios) {
    const opcion = document.createElement('option');
    opcion.value = hora;
    opcion.textContent = hora;
    selector.appendChild(opcion);
  }
}

async function cargarTurnos() {
  const turnos = await pedir('/turnos');
  lista.replaceChildren();
  for (const turno of turnos) {
    const item = document.createElement('li');
    item.className = turno.estado;
    const texto = document.createElement('span');
    texto.textContent = turno.hora + ' · ' + turno.nombre + ' (' + turno.codigo + ')';
    item.appendChild(texto);
    if (turno.estado === 'activo') {
      const boton = document.createElement('button');
      boton.textContent = 'Cancelar';
      boton.addEventListener('click', () => accion(() => pedir('/turnos/' + turno.id, { method: 'DELETE' })));
      item.appendChild(boton);
    }
    lista.appendChild(item);
  }
}

async function cargarResumen() {
  const r = await pedir('/resumen');
  document.getElementById('resumen').textContent =
    'Horarios libres: ' + r.libres + ' · Turnos activos: ' + r.activos + ' · Cancelados: ' + r.cancelados;
}

async function cargarPie() {
  const salud = await pedir('/salud');
  document.getElementById('pie').textContent = 'Versión ' + salud.version + ' · commit ' + salud.commit.slice(0, 7);
}

async function refrescar() {
  await Promise.all([cargarHorarios(), cargarTurnos(), cargarResumen()]);
}

async function accion(operacion) {
  mensaje.textContent = '';
  try {
    await operacion();
    await refrescar();
  } catch (error) {
    mensaje.textContent = error.message;
  }
}

document.getElementById('formulario').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const hora = selector.value;
  accion(() => pedir('/turnos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, hora })
  }));
});

refrescar().then(cargarPie).catch((error) => { mensaje.textContent = error.message; });
