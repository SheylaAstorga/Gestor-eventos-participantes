const API_URL = "http://localhost:3000";

const selecEvento = document.getElementById("selecEvento");
const selecParticipante = document.getElementById("selecParticipante");
const filtroEvento = document.getElementById("filtroEvento");
const filtroEstado = document.getElementById("filtroEstado");
const tablaInscripciones = document.getElementById("tabla-inscripciones");
const btnGuardar = document.getElementById("btnGuardarInscripcion");

let eventos = [];
let participantes = [];

document.addEventListener("DOMContentLoaded", async () => {
    await cargarDatosIniciales();
    await mostrarInscripciones();

    btnGuardar.addEventListener("click", crearInscripcion);
    filtroEvento.addEventListener("change", mostrarInscripciones);
    filtroEstado.addEventListener("change", mostrarInscripciones);
});

async function cargarDatosIniciales() {
    const respuestaEventos = await axios.get(`${API_URL}/eventos`);
    const respuestaParticipantes = await axios.get(`${API_URL}/participantes`);

    eventos = respuestaEventos.data;
    participantes = respuestaParticipantes.data;

    cargarSelectEventos();
    cargarSelectParticipantes();
}

function cargarSelectEventos() {
    selecEvento.innerHTML = "";
    filtroEvento.innerHTML = "";

    const opcionModal = document.createElement("option");
    opcionModal.value = "";
    opcionModal.textContent = "Seleccione un evento";
    selecEvento.appendChild(opcionModal);

    const opcionFiltro = document.createElement("option");
    opcionFiltro.value = "";
    opcionFiltro.textContent = "Todos los eventos";
    filtroEvento.appendChild(opcionFiltro);

    eventos.forEach(evento => {
        const optionModal = document.createElement("option");
        optionModal.value = evento.id;
        optionModal.textContent = evento.nombre;
        selecEvento.appendChild(optionModal);

        const optionFiltro = document.createElement("option");
        optionFiltro.value = evento.id;
        optionFiltro.textContent = evento.nombre;
        filtroEvento.appendChild(optionFiltro);
    });
}

function cargarSelectParticipantes() {
    selecParticipante.innerHTML = "";

    const opcion = document.createElement("option");
    opcion.value = "";
    opcion.textContent = "Seleccione un participante";
    selecParticipante.appendChild(opcion);

    participantes.forEach(participante => {
        const option = document.createElement("option");
        option.value = participante.id;
        option.textContent = participante.nombre;
        selecParticipante.appendChild(option);
    });
}
