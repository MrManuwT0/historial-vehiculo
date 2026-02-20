async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase().replace(/[-\s]/g, "");
    
    if (!plate) return;

    // UI Elements
    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');
    const desc = document.getElementById('resDescription');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    // TU URL DE RENDER (Ya comprobada)
    const RENDER_URL = "https://api-historial-vehiculo.onrender.com";

    try {
        // Llamada a tu propio servidor en Render
        const response = await fetch(`${RENDER_URL}/consulta/${plate}`);
        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error("MATRÍCULA NO ENCONTRADA");
        }

        // Si la API devuelve los datos dentro de un objeto 'data'
        const d = data.data || data;

        // Inyectar datos en el HTML Premium
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || d.brand || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---").toUpperCase();
        
        // Extraer solo el año
        let fecha = d.fecha_matriculacion || d.year || "---";
        const anioMatch = String(fecha).match(/\d{4}/);
        document.getElementById('resYear').innerText = anioMatch ? anioMatch[0] : "---";

        document.getElementById('resPower').innerText = (d.potencia || d.cv || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || d.fuel || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || d.cc || "---") + " CC";

        desc.innerText = "LOCALIZADO";
        desc.className = "font-black italic uppercase text-2xl text-white";

    } catch (err) {
        console.error("Error:", err.message);
        document.getElementById('resPlate').innerText = "AVISO";
        desc.innerText = err.message;
        desc.className = "font-black italic uppercase text-2xl text-red-500";
        
        // Limpiar campos en caso de error
        const ids = ['resMake', 'resModel', 'resYear', 'resPower', 'resFuel', 'resEngine'];
        ids.forEach(id => document.getElementById(id).innerText = "---");
    } finally {
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}
