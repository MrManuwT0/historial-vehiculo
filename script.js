async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    // Usamos Render como puente invisible
    const PROXY_URL = "https://api-historial-vehiculo.onrender.com";

    try {
        const response = await fetch(`${PROXY_URL}/${plate}`);
        
        if (!response.ok) throw new Error("MATRÍCULA NO ENCONTRADA");

        const data = await response.json();
        const d = data.data || data;

        // Rellenar la ficha técnica
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
        document.getElementById('resPlate').innerText = "AVISO";
        document.getElementById('resDescription').innerText = "NO ENCONTRADO";
        document.getElementById('resDescription').style.color = "#ff4444";
    } finally {
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}
