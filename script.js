/**
 * Lógica de Consulta de Matrículas
 * Repo: historial-vehiculo
 */

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

    // Configuración API (Directa para evitar errores de carga JSON en local)
    const API_KEY = 'b4b6eb078cmsh025d40281b264c2p19be9ajsn045ec5167bae';
    const API_HOST = 'api-matriculas-espana.p.rapidapi.com';

    try {
        const response = await fetch(`https://${API_HOST}/get/${plate}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            }
        });

        const res = await response.json();
        console.log("Datos oficiales recibidos:", res);

        // Verificamos si la respuesta tiene datos válidos
        // Se adapta tanto a si viene como objeto directo o dentro de .data
        const d = res.data || res;

        if (response.status === 404 || res.error || (res.message && res.message.includes("not exist"))) {
            throw new Error("MATRÍCULA NO ENCONTRADA");
        }

        // ÉXITO: Inyectamos datos en el DOM
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resDescription').innerText = "LOCALIZADO";
        document.getElementById('resDescription').className = "font-black italic uppercase text-3xl text-white";

        document.getElementById('resMake').innerText = (d.marca || d.brand || d.make || "---");
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---");
        
        // Formatear Año
        let fechaRaw = d.fecha_matriculacion || d.year || d.anio || "---";
        const anio = String(fechaRaw).match(/\d{4}/);
        document.getElementById('resYear').innerText = anio ? anio[0] : "---";

        document.getElementById('resPower').innerText = (d.potencia || d.hp || d.cv || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || d.fuel || "---");
        document.getElementById('resEngine').innerText = (d.cilindrada || d.cc || d.engine_cc || "---") + " CC";

    } catch (err) {
        console.error("Error en proceso:", err.message);
        
        // UI de Error
        document.getElementById('resPlate').innerText = "AVISO";
        desc.innerText = err.message;
        desc.className = "font-black italic uppercase text-3xl text-red-500";
        
        // Reset de valores
        const fields = ['resMake', 'resModel', 'resYear', 'resPower', 'resFuel', 'resEngine'];
        fields.forEach(id => document.getElementById(id).innerText = "---");

    } finally {
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}
