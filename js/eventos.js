// API donde se guardan los participantes
const API_URL = "http://localhost:3000/eventos";

let edicionEventoId = null;

const obtenerEventos = async () => {
  try {
    const response = await axios.get(API_URL);
    const contenedor = document.getElementById("contenedor-eventos");
    const mensajeVacio = document.getElementById("sin-eventos");
    const datos = response.data;

    // Mostrar u ocultar mensaje
    if (datos.length === 0) {
      mensajeVacio.style.display = "block";
    } else {
      mensajeVacio.style.display = "none";
    }

    datos.forEach((evento) => {
      const div = document.createElement("div");
      div.classList.add("evento-card");

      div.innerHTML = `
            <div class ="evento-header">
                <h3>${evento.nombre}</h3>
                
            </div>

            <div class="evento-body">
            <p><strong>Fecha:</strong> ${evento.fecha}.</p>
            <p><strong>Lugar:</strong> ${evento.lugar}.</p>
            <p><strong>Capacidad:</strong> ${evento.capacidad} Participantes.</p>
            </div>

            <div class ="evento-footer">
                <button class="btn btn-warning" onclick="prepararEdicion('${evento.id}', '${evento.nombre}', '${evento.fecha}', '${evento.lugar}', '${evento.capacidad}')">
                    Editar
                </button>
                <button class="btn btn-danger" onclick="eliminarEvento('${evento.id}')"> 
                    Eliminar
                </button>
            </div>
            `;

      contenedor.appendChild(div);
    });
  } catch (error) {
    console.log(error);
  }
};

obtenerEventos();

const crearEvento = async () => {
  try {
    const nombre = document.getElementById("input_nombre").value;
    const fecha = document.getElementById("input_fecha").value;
    const lugar = document.getElementById("input_lugar").value;
    const capacidad = document.getElementById("input_capacidad").value;

    if (!nombre || !fecha || !lugar || !capacidad) {
      alert("Debes completar todos los datos, por favor.");
      return;
    }

    const responseEventos = await axios.get(API_URL);
    const eventosExistentes = responseEventos.data;

    const eventoDuplicado = eventosExistentes.some(
      (ev) =>
        ev.nombre.toLowerCase().trim() === nombre.toLowerCase() &&
        ev.fecha === fecha,
    );

    if (eventoDuplicado) {
      alert(
        "Ya existe un evento registrado con ese mismo nombre para esa fecha.",
      );
      return;
    }

    const datosEvento = {
      nombre,
      fecha,
      lugar,
      capacidad,
    };

    const response = await axios.post(API_URL, datosEvento);
    alert("El evento fue creado con éxito.");

    obtenerEventos();
  } catch (error) {
    console.log(error);
  }
};

//Boton de crear evento que deberia ir al final.

document.getElementById("btn_guardar").onclick = crearEvento;

// Delete Eventos
const eliminarEvento = async (id) => {
  const confirmacion = confirm(
    "¿Estás seguro de que querés eliminar este evento y TODAS sus inscripciones?",
  );
  if (!confirmacion) return;

  try {
    const API_INSCRIPCIONES = "http://localhost:3000/inscripciones";
    const responseInscripciones = await axios.get(
      `${API_INSCRIPCIONES}?eventoId=${id}`,
    );
    const inscripcionesDelEvento = responseInscripciones.data;

    for (const inscripcion of inscripcionesDelEvento) {
      await axios.delete(`${API_INSCRIPCIONES}/${inscripcion.id}`);
    }

    const response = await axios.delete(`${API_URL}/${id}`);

    alert("El evento y sus inscripciones fueron eliminados con éxito.");

    obtenerEventos();
  } catch (error) {
    console.log("Error en la eliminación en cascada:", error);
    alert("Hubo un error al intentar eliminar el evento y sus inscripciones.");
  }
};

//Updete Evento

const prepararEdicion = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    const evento = response.data;

    document.getElementById("input_nombre").value = evento.nombre;
    document.getElementById("input_fecha").value = evento.fecha;
    document.getElementById("input_lugar").value = evento.lugar;
    document.getElementById("input_capacidad").value = evento.capacidad;

    edicionEventoId = id;

    const modalElement = document.getElementById("modalEvento");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();

    const botonGuardar = document.getElementById("btn_guardar");
    botonGuardar.textContent = "Editar Evento";

    botonGuardar.onclick = () => editarEvento();
  } catch (error) {
    console.log("Error al preparar la edición:", error);
  }
};

const editarEvento = async () => {
  try {
    const nombre = document.getElementById("input_nombre").value;
    const fecha = document.getElementById("input_fecha").value;
    const lugar = document.getElementById("input_lugar").value;
    const capacidad = document.getElementById("input_capacidad").value;

    if (!nombre || !fecha || !lugar || !capacidad) {
      alert("Debes completar todos los datos, por favor.");
      return;
    }

    const datosEvento = { nombre, fecha, lugar, capacidad };

    if (edicionEventoId) {
      const confirmacion = confirm(
        "¿Estás seguro de que querés guardar los cambios de este evento?",
      );
      if (!confirmacion) return;

      await axios.patch(`${API_URL}/${edicionEventoId}`, datosEvento);
      alert("El evento fue actualizado con éxito.");

      document.getElementById("input_nombre").value = "";
      document.getElementById("input_fecha").value = "";
      document.getElementById("input_lugar").value = "";
      document.getElementById("input_capacidad").value = "";
    }

    const modalElement = document.getElementById("modalEvento");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();

    obtenerEventos();

    const botonGuardar = document.getElementById("btn_guardar");
    botonGuardar.textContent = "Crear Evento";
    botonGuardar.onclick = null;

    edicionEventoId = null;
  } catch (error) {
    console.log("Error al guardar:", error);
    alert("Hubo un error al procesar la solicitud.");
  }
};

const filtrarEventos = () => {
  const textoBusqueda = document
    .getElementById("buscar-evento")
    .value.toLowerCase();

  const tarjetas = document.querySelectorAll(".evento-card");

  tarjetas.forEach((tarjeta) => {
    const textoTarjeta = tarjeta.textContent.toLowerCase();

    if (textoTarjeta.includes(textoBusqueda)) {
      tarjeta.style.display = "block";
    } else {
      tarjeta.style.display = "none";
    }
  });
};
document
  .getElementById("buscar-evento")
  .addEventListener("input", filtrarEventos);
