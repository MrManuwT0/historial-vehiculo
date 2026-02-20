async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    // Limpiamos la matrícula (sin espacios ni guiones como en matriculas.org)
    const plate = plateInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');
    const resDescription = document.getElementById('resDescription');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    // Render como PUENTE INVISIBLE
    const PROXY_URL = "https://api-historial-vehiculo.onrender.com";

    try {
        const response = await fetch(`${PROXY_URL}/${plate}`);
        
        if (!response.ok) throw new Error("MATRÍCULA NO ENCONTRADA");

        const data = await response.json();
        const d = data.data || data;

        // Inyectar datos en la ficha técnica
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || d.brand || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---").toUpperCase();
        
        // Extraer año
        let fecha = d.fecha_matriculacion || d.year || "---";
        const anioMatch = String(fecha).match(/\d{4}/);
        document.getElementById('resYear').innerText = anioMatch ? anioMatch[0] : "---";

        document.getElementById('resPower').innerText = (d.potencia || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || "---") + " CC";

        resDescription.innerText = "VERIFICADO";
        resDescription.style.color = "#2ecc71"; // Verde éxito

    } catch (err) {
        document.getElementById('resPlate').innerText = "ERROR";
        resDescription.innerText = "NO DISPONIBLE";
        resDescription.style.color = "#e74c3c"; // Rojo error
    } finally {
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}
