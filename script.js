async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase().replace(/[-\s]/g, "");
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');
    const desc = document.getElementById('resDescription');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    // REEMPLAZA ESTA URL con la que te de Render (ej: https://tu-app.onrender.com)
    const RENDER_URL = "https://tu-proyecto-en-render.onrender.com";

    try {
        const response = await fetch(`${RENDER_URL}/consulta/${plate}`);
        const data = await response.json();

        if (!response.ok || data.error) throw new Error("MATRÍCULA NO ENCONTRADA");

        // Inyectar Datos
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (data.marca || data.brand || "---").toUpperCase();
        document.getElementById('resModel').innerText = (data.modelo || data.model || "---").toUpperCase();
        
        const anio = String(data.fecha_matriculacion || data.year).match(/\d{4}/);
        document.getElementById('resYear').innerText = anio ? anio[0] : "---";
        document.getElementById('resPower').innerText = (data.potencia || "---") + " CV";
        document.getElementById('resFuel').innerText = (data.combustible || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (data.cilindrada || "---") + " CC";

        desc.innerText = "LOCALIZADO";
        desc.className = "font-black italic uppercase text-3xl text-white";

    } catch (err) {
        desc.innerText = err.message;
        desc.className = "font-black italic uppercase text-3xl text-red-500";
    } finally {
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}
