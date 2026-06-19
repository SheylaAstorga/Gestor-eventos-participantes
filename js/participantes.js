// API donde se guardan los participantes
const API_URL = "http://localhost:3000/participantes";

const obtenerParticipantes = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log(response.data);
    const tbody = document.getElementById("tabla-participantes");
    const datos = response.data;
    tbody.textContent = "";
    datos.forEach((participante) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${participante.id}</td>
                <td>${participante.nombre}</td>
                <td>${participante.correo}</td>
                <td>${participante.telefono}</td>
                <td>${participante.eventoId}</td>
                <td><button class="btn btn-sm btn-warning" onclick="editar_participante('${participante.id}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarParticipante('${participante.id}')">Eliminar</button>
                </td>
                `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error al obtener participantes:", error);
  }
};

obtenerParticipantes();

async function crear_participante() {
  // Obtiene el texto escrito en el formulario
  const nombre = document.getElementById("input_nombre").value;
  const correo = document.getElementById("input_correo").value;
  const telefono = document.getElementById("input_telefono").value;

  // Si algun campo esta vacio, muestra una alerta
  if (!nombre || !correo || !telefono) {
    alert("Por favor completá todos los campos.");
    return;
  }

  // Validar correo
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValido.test(correo)) {
    alert("Ingrese un correo electrónico válido.");
    return;
  }

  try {
    // Envia el nuevo participante al servidor y espera confirmacion
    await axios.post(API_URL, { nombre, correo, telefono });
    alert("Participante registrado correctamente");

    obtenerParticipantes();
  } catch (error) {
    // Si hay un error lo muestra en consola y avisa al usuario
    console.error("Error al crear participante:", error);
    alert("Hubo un error al guardar el participante.");
  }
}

// Guarda el id del participante que se va a editar
let id_editar = null;

async function editar_participante(id) {
  // Guarda el id del participante seleccionado
  id_editar = id;

  // Trae los datos del participante
  const respuesta = await axios.get(`${API_URL}/${id}`);
  const participante = respuesta.data;

  // Carga los datos del participante
  document.getElementById("editar_nombre").value = participante.nombre;
  document.getElementById("editar_correo").value = participante.correo;
  document.getElementById("editar_telefono").value = participante.telefono;

  // Abre el formulario para editar
  const modal = new bootstrap.Modal(document.getElementById("modal_editar"));
  modal.show();
}

async function actualizar_participante() {
  //Obtiene los nuevos valores
  const nombre = document.getElementById("editar_nombre").value;
  const correo = document.getElementById("editar_correo").value;
  const telefono = document.getElementById("editar_telefono").value;

  // Nuevamente si algun campo esta vacio, muestra una alerta
  if (!nombre || !correo || !telefono) {
    alert("Por favor completa todos los campos.");
    return;
  }

  try {
    // Envia los datos actualizados al servidor
    await axios.patch(`${API_URL}/${id_editar}`, { nombre, correo, telefono });
    // Carga la tabla con los datos actualizados
    obtenerParticipantes();
  } catch (error) {
    console.error("Error al actualizar participante: ", error);
    alert("hubo un error al actualizar el participante");
  }
}

// Asigna la funcion al boton guardar guardar de editar
document
  .getElementById("btn_actualizar")
  .addEventListener("click", actualizar_participante);

const eliminarParticipante = async (id) => {
  const confirmar = confirm(
    "¿Está seguro de eliminar este participante y todas sus inscripciones?",
  );

  if (!confirmar) return;
  try {
    const API_INSCRIPCIONES = "http://localhost:3000/inscripciones";
    // Buscar las inscripciones del participante
    const responseInscripciones = await axios.get(
      `${API_INSCRIPCIONES}?participanteId=${id}`,
    );
    const inscripcionesDelParticipante = responseInscripciones.data;
    //Eliminar cada inscripciones asociada
    for (const inscripcion of inscripcionesDelParticipante) {
      await axios.delete(`${API_INSCRIPCIONES}/${inscripcion.id}`);
    }
    //eliminar el participante
    const response = await axios.delete(`${API_URL}/${id}`);
    alert("Participante e inscripciones eliminados correctamente");
    obtenerParticipantes();
  } catch (error) {
    console.error("Error al eliminar participante: ", error);
    alert("hubo un error al eliminar el participante");
  }
};

// Busca el boton guardar y le asigna la funcion al hacer click
document
  .getElementById("btn_guardar")
  .addEventListener("click", crear_participante);

// Filtra los participantes a medida que se escribe en el campo de busqueda
document
  .getElementById("buscar-participante")
  .addEventListener("input", async (e) => {
    const texto = e.target.value.toLowerCase();

    const response = await axios.get(API_URL);

    const participantesFiltrados = response.data.filter((participante) =>
      participante.nombre.toLowerCase().includes(texto),
    );

    const tbody = document.getElementById("tabla-participantes");

    tbody.textContent = "";

    participantesFiltrados.forEach((participante) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${participante.id}</td>
        <td>${participante.nombre}</td>
        <td>${participante.correo}</td>
        <td>${participante.telefono}</td>
        <td>-</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editar_participante('${participante.id}')">Editar</button>
          <button class="btn btn-sm btn-danger">Eliminar</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  });
