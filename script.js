async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase();
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        const data = await response.json();

        // Accedemos al primer objeto del array que me pasaste
        const v = Array.isArray(data) ? data[0] : data;

        // Inyectamos los datos exactos que proporcionaste
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = v.MARCA || "---";
        document.getElementById('resModel').innerText = v.MODELO || "---";
        document.getElementById('resYear').innerText = v.FECHA_MATRICULACION || "---";
        document.getElementById('resPower').innerText = v.KWs ? `${v.KWs} KW (105 CV)` : "---";
        document.getElementById('resFuel').innerText = v.TYMOTOR || "---"; // Ejemplo: Gasóleo
        document.getElementById('resEngine').innerText = v.TPMOTOR || "---"; // Ejemplo: 1.6 TDI
        
        // Usamos el VIN para la descripción técnica
        if(v.VIN) {
            document.getElementById('resDescription').innerText = `Nº BASTIDOR (VIN): ${v.VIN}`;
        }

        // Imagen de fondo (puedes cambiarla por una de un Golf si prefieres)
        document.getElementById('vehiclePhoto').src = `https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80`;

        loader.classList.add('hidden');
        results.classList.remove('hidden');
    } catch (err) {
        alert("Error al conectar con el servidor de datos.");
        loader.classList.add('hidden');
    }
}
