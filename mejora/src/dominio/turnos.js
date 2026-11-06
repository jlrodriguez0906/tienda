// Lógica de negocio de "Turnos en línea". No conoce HTTP: solo reglas y datos en memoria.
const HORARIOS = ['09:00', '10:00', '11:00', '12:00'];

function crearAgenda() {
  const turnos = [];
  let siguienteId = 1;

  function listar() {
    return turnos.map((t) => ({ ...t }));
  }

  function horariosLibres() {
    const ocupados = turnos.filter((t) => t.estado === 'activo').map((t) => t.hora);
    return HORARIOS.filter((h) => !ocupados.includes(h));
  }

  function reservar(nombre, hora) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      throw new Error('El nombre es obligatorio');
    }
    if (!HORARIOS.includes(hora)) {
      throw new Error('Horario no válido');
    }
    if (!horariosLibres().includes(hora)) {
      throw new Error('El horario ya está reservado');
    }
    const turno = {
      id: siguienteId++,
      nombre: nombre.trim(),
      hora,
      estado: 'activo',
      codigo: 'T-' + hora.replace(':', '')
    };
    turnos.push(turno);
    return { ...turno };
  }

  function cancelar(id) {
    const turno = turnos.find((t) => t.id === id);
    if (!turno) {
      throw new Error('Turno no encontrado');
    }
    turno.estado = 'cancelado';
    return { ...turno };
  }

  function resumen() {
    const activos = turnos.filter((t) => t.estado === 'activo').length;
    return {
      total: turnos.length,
      activos,
      cancelados: turnos.length - activos,
      libres: HORARIOS.length - activos
    };
  }

  return { listar, horariosLibres, reservar, cancelar, resumen };
}

module.exports = { crearAgenda, HORARIOS };
