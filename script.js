async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');
    const resDescription = document.getElementById('resDescription');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    // URL raíz de tu servidor en Render
    const RENDER_URL = "https://api-historial-vehiculo.onrender.com";

    try {
        // Llamada directa: URL + / + MATRICULA
        const response = await fetch(`${RENDER_URL}/${plate}`);

        if (response.status === 404) {
            throw new Error("MATRÍCULA NO ENCONTRADA");
        }

        const data = await response.json();
        
        // Si el servidor devuelve un objeto con error (como en tu captura)
        if (data.error) {
            throw new Error(data.error.includes("no existe") ? "ERROR DE RUTA EN SERVER" : data.error);
        }

        const d = data.data || data;

        // Inyectar Datos
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || d.brand || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---").toUpperCase();
        
        let fecha = d.fecha_matriculacion || d.year || "---";
        const anioMatch = String(fecha).match(/\d{4}/);
        document.getElementById('resYear').innerText = anioMatch ? anioMatch[0] : "---";

        document.getElementById('resPower').innerText = (d.potencia || d.cv || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || d.fuel || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || d.cc || "---") + " CC";

        resDescription.innerText = "DOCUMENTO VERIFICADO";
        resDescription.style.color = "white";

    } catch (err) {
        console.error("Fallo:", err.message);
        document.getElementById('resPlate').innerText = "AVISO";
        resDescription.innerText = err.message.toUpperCase();
        resDescription.style.color = "#ff4444";
    } finally {
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}
