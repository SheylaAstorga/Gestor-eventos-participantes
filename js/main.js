const API = "http://localhost:3000";

async function obtenerEventos() {
  try {
    const response = await axios.get(`${API}/eventos`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

obtenerEventos();
