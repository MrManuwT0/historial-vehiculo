async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase().replace(/[-\s]/g, "");
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');
    
    loader.classList.remove('hidden');
    results.classList.add('hidden');

    // PEGA AQUÍ LA URL QUE TE DIO RENDER
    const RENDER_URL = "https://api-historial-vehiculo.onrender.com"; 

    try {
        const response = await fetch(`${RENDER_URL}/consulta/${plate}`);
        const data = await response.json();

        if (!response.ok || data.error) throw new Error("MATRÍCULA NO ENCONTRADA");

        const d = data.data || data;
        
        // Inyectar datos en el HTML
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || d.brand || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---").toUpperCase();
        
        let anio = String(d.fecha_matriculacion || d.year || "---").match(/\d{4}/);
        document.getElementById('resYear').innerText = anio ? anio[0] : "---";
        document.getElementById('resPower').innerText = (d.potencia || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || "---") + " CC";

        document.getElementById('resDescription').innerText = "LOCALIZADO";
        document.getElementById('resDescription').style.color = "white";

    } catch (err) {
        document.getElementById('resPlate').innerText = "AVISO";
        document.getElementById('resDescription').innerText = "NO ENCONTRADO";
        document.getElementById('resDescription').style.color = "#ef4444";
    } finally {
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}
