// js/participantes.js
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
                <td><button class="btn btn-sm btn-warning">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarParticipante(${participante.id})">Eliminar</button>
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


























const eliminarParticipante = async(id) =>{
  
}


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
          <button class="btn btn-sm btn-warning">Editar</button>
          <button class="btn btn-sm btn-danger">Eliminar</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  });
