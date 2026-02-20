async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');
    const resDescription = document.getElementById('resDescription');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    // Render actuando ÚNICAMENTE como puente
    const PUENTE_URL = "https://api-historial-vehiculo.onrender.com";

    try {
        const response = await fetch(`${PUENTE_URL}/${plate}`);
        
        if (!response.ok) throw new Error("MATRÍCULA NO ENCONTRADA");

        const data = await response.json();
        const d = data.data || data;

        // Inyectar en el HTML
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || d.brand || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---").toUpperCase();
        
        let fecha = d.fecha_matriculacion || d.year || "---";
        const anioMatch = String(fecha).match(/\d{4}/);
        document.getElementById('resYear').innerText = anioMatch ? anioMatch[0] : "---";

        document.getElementById('resPower').innerText = (d.potencia || d.cv || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || d.fuel || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || d.cc || "---") + " CC";

        resDescription.innerText = "LOCALIZADO";
        resDescription.style.color = "white";

    } catch (err) {
        document.getElementById('resPlate').innerText = "ERROR";
        resDescription.innerText = err.message;
        resDescription.style.color = "#ff4444";
    } finally {
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}
