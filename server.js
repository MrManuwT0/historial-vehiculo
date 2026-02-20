async function consultarVehiculo() {
    const input = document.getElementById('plateInput');
    const plate = input.value.trim().toUpperCase().replace(/[-\s]/g, "");
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');
    const desc = document.getElementById('resDescription');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        // Cargamos la configuración desde el JSON
        const configResp = await fetch('config.json');
        const config = await configResp.json();

        // Intentamos el fetch al endpoint principal
        const response = await fetch(`https://${config.api.host}${config.api.endpoints[0]}${plate}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': config.api.key,
                'X-RapidAPI-Host': config.api.host
            }
        });

        const res = await response.json();
        console.log("Respuesta recibida:", res);

        if (!response.ok || res.error || (res.message && res.message.includes("not exist"))) {
            throw new Error("MATRÍCULA NO ENCONTRADA");
        }

        const d = res.data || res;

        // Inyectar datos
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || d.brand || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---").toUpperCase();
        
        let fecha = d.fecha_matriculacion || d.year || "---";
        document.getElementById('resYear').innerText = String(fecha).match(/\d{4}/) ? String(fecha).match(/\d{4}/)[0] : "---";

        document.getElementById('resPower').innerText = (d.potencia || d.cv || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || d.fuel || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || d.cc || "---") + " CC";

        desc.innerText = "LOCALIZADO";
        desc.className = "font-black italic text-2xl text-white";

    } catch (err) {
        console.error("Error:", err.message);
        document.getElementById('resPlate').innerText = "AVISO";
        desc.innerText = err.message;
        desc.className = "font-black italic text-2xl text-red-500";
        
        // Limpiar campos
        ['resMake', 'resModel', 'resYear', 'resPower', 'resFuel', 'resEngine'].forEach(id => {
            document.getElementById(id).innerText = "---";
        });
    } finally {
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}
