async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase().replace(/[-\s]/g, "");
    
    if (!plate) {
        alert("Por favor, introduce una matrícula.");
        return;
    }

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');
    const desc = document.getElementById('resDescription');

    // Reset visual
    loader.classList.remove('hidden');
    results.classList.add('hidden');

    // URL de tu servidor en Render (Verificada)
    const RENDER_URL = "https://api-historial-vehiculo.onrender.com";

    try {
        console.log("Enviando petición a Render para matrícula:", plate);
        
        const response = await fetch(`${RENDER_URL}/consulta/${plate}`);
        
        if (!response.ok) {
            throw new Error("El servidor no respondió correctamente");
        }

        const data = await response.json();
        console.log("Datos recibidos del servidor:", data);

        // La API a veces devuelve los datos en data.data o directamente en data
        const d = data.data || data;

        if (data.error || !d || Object.keys(d).length === 0) {
            throw new Error("MATRÍCULA NO ENCONTRADA");
        }

        // --- INYECCIÓN DE DATOS ---
        document.getElementById('resPlate').innerText = plate;
        
        // Mapeo de campos (ajustado a los nombres comunes de la API)
        document.getElementById('resMake').innerText = (d.marca || d.brand || d.make || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---").toUpperCase();
        
        // Año (limpiando formatos raros)
        let fechaRaw = d.fecha_matriculacion || d.year || d.anio || "---";
        let anio = String(fechaRaw).match(/\d{4}/) ? String(fechaRaw).match(/\d{4}/)[0] : "---";
        document.getElementById('resYear').innerText = anio;

        document.getElementById('resPower').innerText = (d.potencia || d.hp || d.cv || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || d.fuel || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || d.cc || d.engine_cc || "---") + " CC";

        desc.innerText = "LOCALIZADO";
        desc.style.color = "#ffffff";

    } catch (err) {
        console.error("Error detallado:", err);
        document.getElementById('resPlate').innerText = "AVISO";
        desc.innerText = err.message === "MATRÍCULA NO ENCONTRADA" ? "NO ENCONTRADO" : "ERROR DE CONEXIÓN";
        desc.style.color = "#ef4444";
        
        // Limpiar campos
        ['resMake', 'resModel', 'resYear', 'resPower', 'resFuel', 'resEngine'].forEach(id => {
            document.getElementById(id).innerText = "---";
        });
    } finally {
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}
