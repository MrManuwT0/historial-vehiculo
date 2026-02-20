const RENDER_URL = "https://api-historial-vehiculo.onrender.com";

async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase().replace(/[-\s]/g, "");
    
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        // ACTUALIZADO: Hemos añadido /api/ antes de /consulta/
        const url = `${RENDER_URL}/api/consulta/${plate}`;
        console.log("Conectando a:", url);

        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "404");
        }

        const data = await response.json();
        const d = data.data || data;

        // Pintar datos
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || d.brand || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---").toUpperCase();
        document.getElementById('resYear').innerText = d.year || (d.fecha_matriculacion ? d.fecha_matriculacion.split("/")[2] : "---");
        document.getElementById('resPower').innerText = (d.potencia || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || "---") + " CC";

        document.getElementById('resDescription').innerText = "LOCALIZADO";
        document.getElementById('resDescription').style.color = "white";

    } catch (err) {
        console.error("Error en búsqueda:", err.message);
        document.getElementById('resPlate').innerText = "ERROR";
        document.getElementById('resDescription').innerText = "NO ENCONTRADO";
        document.getElementById('resDescription').style.color = "#ff4444";
    } finally {
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}
