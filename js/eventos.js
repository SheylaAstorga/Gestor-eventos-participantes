// API donde se guardan los participantes
const API_URL = "http://localhost:3000/eventos";

const obtenerEventos = async () => {
    try {
        
        const response = await axios.get (API_URL);
        const contenedor = document.getElementById('contenedor-eventos')

        const datos = response.data
        
        datos.forEach (evento => {
            const div = document.createElement("div");
            div.classList.add("evento-card");

            div.innerHTML =`
            <div class ="evento-header">
                <h3>${evento.nombre}</h3>
                <span class="badge bg-success"> ${evento.estado} </span>
            </div>

            <div class="evento-body">
            <p><strong>Fecha:</strong> ${evento.fecha}.</p>
            <p><strong>Lugar:</strong> ${evento.lugar}.</p>
            <p><strong>Capacidad:</strong> ${evento.capacidad} Participantes.</p>
            </div>

            <div class ="evento-footer">
                <button class="btn btn-warning">
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
    };
}


obtenerEventos();


const crearEvento = async () => {

    try {
        const nombre = document.getElementById('input_nombre').value;
        const fecha = document.getElementById('input_fecha').value;
        const lugar = document.getElementById('input_lugar').value;
        const capacidad = document.getElementById('input_capacidad').value;
        const estado = document.getElementById('input_estado').value;

        if (!nombre || !fecha || !lugar || !capacidad || !estado) {
            alert ("Debes completar todos los datos, por favor.")
            return;
        }

        const datosEvento = {
            nombre,
            fecha,
            lugar,
            capacidad,
            estado
        }

        const response = await axios.post(API_URL, datosEvento)
        alert ("El evento fue creado con éxito.")
        
        obtenerEventos()
    
    } catch (error) {
        console.log(error)
    }    
}


//Boton de crear evento que deberia ir al final.

document
    .getElementById("btn_guardar")
    .addEventListener("click", crearEvento);
    


// Delete Eventos    
const eliminarEvento = async (id) => {
    const confirmacion = confirm("¿Estás seguro de que querés eliminar este evento y TODAS sus inscripciones?");
    if (!confirmacion) return;

    try {
        
        const API_INSCRIPCIONES = "http://localhost:3000/inscripciones";
        const responseInscripciones = await axios.get(`${API_INSCRIPCIONES}?eventoId=${id}`);
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