const API_URL = "http://localhost:3000";

const selecEvento = document.getElementById("selecEvento");
const selecParticipante = document.getElementById("selecParticipante");
const filtroEvento = document.getElementById("filtroEvento");
const filtroEstado = document.getElementById("filtroEstado");
const tablaInscripciones = document.getElementById("tabla-inscripciones");
const btnGuardar = document.getElementById("btnGuardarInscripcion");
const selecEstadoModal = document.getElementById("estadoInscripcion");

let eventos = [];
let participantes = [];

document.addEventListener("DOMContentLoaded", async () => {
    await cargarDatosIniciales();
    await mostrarInscripciones();

    btnGuardar.addEventListener("click", crearInscripcion);
    filtroEvento.addEventListener("change", mostrarInscripciones);
    filtroEstado.addEventListener("change", mostrarInscripciones);

    const modalElement = document.getElementById('modalInscripcion')
    modalElement.addEventListener('hidden.bs.modal', () =>{
        selecEvento.value = '';
        selecParticipante.value = ''; 
        selecEstadoModal.value = 'Confirmado';

        btnGuardar.textContent = 'Guardar';
        btnGuardar.onclick = null; 
        btnGuardar.removeEventListener("click", crearInscripcion); 
        btnGuardar.addEventListener("click", crearInscripcion);

    })
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

async function crearInscripcion() {
    const eventoId = selecEvento.value;
    const participanteId = selecParticipante.value;

    if (eventoId === "" || participanteId === "") {
        alert("Debe seleccionar un evento y un participante");
        return;
    }

    //Validacion para que solo se puden inscribir a un evento

    try{
        const respuestaValidacion = await axios.get(`${API_URL}/inscripciones?eventoId=${eventoId}&participanteId=${participanteId}`)

        if(respuestaValidacion.data.length > 0){
            alert ('Este participante ya se encuentra inscripto en este evento.')
            return;
        }
    }catch (error){
        console.log('Error al validar duplicados: ', error)
        alert('Hubo un problema al verificar la inscripción')
        return;
    }

    const datos = {
        eventoId: (eventoId),
        participanteId: (participanteId),
        fecha: new Date().toLocaleDateString(),
        estado: selecEstadoModal.value
    };

    await axios.post(`${API_URL}/inscripciones`, datos);

    filtroEvento.value = eventoId;
    filtroEstado.value = "";
    selecEvento.value = "";
    selecParticipante.value = "";

    await mostrarInscripciones();

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalInscripcion"));

    if (modal) {
        modal.hide();
    }
}

async function mostrarInscripciones() {
    const eventoId = filtroEvento.value;
    const estado = filtroEstado.value;

    tablaInscripciones.innerHTML = "";

    let respuesta;

    if (eventoId === "") {
        respuesta = await axios.get(`${API_URL}/inscripciones`);
    } else {
        respuesta = await axios.get(`${API_URL}/inscripciones?eventoId=${Number(eventoId)}`);
    }

    let inscripciones = respuesta.data;

    if (estado !== "") {
        inscripciones = inscripciones.filter(inscripcion => inscripcion.estado === estado);
    }

    inscripciones.forEach(inscripcion => {
        mostrarFilaInscripcion(inscripcion);
    });
}

function mostrarFilaInscripcion(inscripcion) {
    const participante = participantes.find(participante => participante.id == inscripcion.participanteId);
    const evento = eventos.find(evento => evento.id == inscripcion.eventoId);

    const fila = document.createElement("tr");

    const tdParticipante = document.createElement("td");
    tdParticipante.textContent = participante ? participante.nombre : "Sin participante";

    const tdEvento = document.createElement("td");
    tdEvento.textContent = evento ? evento.nombre : "Sin evento";

    const tdFecha = document.createElement("td");
    tdFecha.textContent = inscripcion.fecha;

    const tdEstado = document.createElement("td");
    const badgeEstado = document.createElement("span");
    badgeEstado.textContent = inscripcion.estado;
    badgeEstado.className = obtenerClaseEstado(inscripcion.estado);
    tdEstado.appendChild(badgeEstado);

    const tdAcciones = document.createElement("td");
    tdAcciones.innerHTML = `
    <div class="d-flex gap-2">
        <button type="button" class="btn btn-warning btn-sm" onclick="actualizarAsistencia('${inscripcion.id}')">Editar</button>
        <button type="button" class="btn btn-danger btn-sm" onclick="cancelarInscripcion('${inscripcion.id}')">Eliminar</button>
    </div>
`;

    fila.appendChild(tdParticipante);
    fila.appendChild(tdEvento);
    fila.appendChild(tdFecha);
    fila.appendChild(tdEstado);
    fila.appendChild(tdAcciones);

    tablaInscripciones.appendChild(fila);
}

function obtenerClaseEstado(estado) {
    if (estado === "Confirmado") {
        return "badge bg-success";
    }

    if (estado === "Asistió") {
        return "badge bg-primary";
    }

    if (estado === "Ausente") {
        return "badge bg-danger";
    }

    return "badge bg-secondary";
}

async function actualizarAsistencia(idInscripcion) {
    try {
        
        const respuesta = await axios.get(`${API_URL}/inscripciones/${idInscripcion}`);
        const inscripcion = respuesta.data;
        
        selecEvento.value = inscripcion.eventoId;
        selecParticipante.value = inscripcion.participanteId;
        
        if (selecEstadoModal) {
            selecEstadoModal.value = inscripcion.estado;
        }

        
        btnGuardar.textContent = "Editar";
        btnGuardar.removeEventListener("click", crearInscripcion);
        
        
        btnGuardar.onclick = async () => {
            const eventoIdEdit = selecEvento.value;
            const participanteIdEdit = selecParticipante.value;
            const estadoEdit = selecEstadoModal ? selecEstadoModal.value : "Confirmado";

            
            try {
                const validacion = await axios.get(`${API_URL}/inscripciones?eventoId=${eventoIdEdit}&participanteId=${participanteIdEdit}`);
                const duplicado = validacion.data.find(insc => insc.id !== idInscripcion);

                if (duplicado) {
                    alert('Este participante ya se encuentra inscripto en este evento.');
                    return;
                }
            } catch (error) {
                console.log("Error en la validación:", error);
            }

            try {
                await axios.patch(`${API_URL}/inscripciones/${idInscripcion}`, {
                    eventoId: eventoIdEdit,
                    participanteId: participanteIdEdit,
                    estado: estadoEdit // Ahora sí mandamos el estado nuevo
                });

                
                await mostrarInscripciones();
                
                
                const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalInscripcion"));
                modal.hide();

            } catch (error) {
                console.log("Error al hacer el PATCH:", error);
                alert("Hubo un problema al guardar los cambios en el servidor.");
            }
        };

        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalInscripcion"));
        modal.show();

    } catch (error) {
        console.log("Error al cargar la edición:", error);
        alert("Hubo un error al intentar abrir la inscripción.");
    }
}





//  Eliminar  inscripción 
async function cancelarInscripcion(idInscripcion) {
    const confirmacion = confirm("¿Estás seguro que desea cancelar y eliminar esta inscripción?");
    if (!confirmacion) return; 
    try {
        await axios.delete(`${API_URL}/inscripciones/${idInscripcion}`);
        
        
        await mostrarInscripciones(); 

    } catch (error) {
        console.log("Error al cancelar la inscripción:", error);
        alert("Hubo un error al intentar eliminar la inscripción.");
    }
}
