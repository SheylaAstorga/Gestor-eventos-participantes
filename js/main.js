const API = "http://localhost:3000";

const totalEventos = document.getElementById("total-eventos");
const totalParticipantes = document.getElementById("total-participantes");

document.addEventListener("DOMContentLoaded", () => {
    cargarContadores();
});

async function cargarContadores() {
    const respuestaEventos = await axios.get(`${API}/eventos`);
    const respuestaParticipantes = await axios.get(`${API}/participantes`);

    const eventos = respuestaEventos.data;
    const participantes = respuestaParticipantes.data;

    totalEventos.textContent = eventos.length;
    totalParticipantes.textContent = participantes.length;
}
