async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase();
    if (!plate) return;

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        const v = await response.json();

        // Mapeo flexible adaptado a la API matriculas-espana1
        document.getElementById('resMake').innerText = v.marca || v.MARCA || "---";
        document.getElementById('resModel').innerText = v.modelo || v.MODELO || "---";
        document.getElementById('resYear').innerText = v.fecha_matriculacion || v.FECHA_MATRICULACION || "---";
        document.getElementById('resFuel').innerText = v.combustible || v.TYMOTOR || "---";
        
        // Conversión de potencia
        const kw = v.KWs || v.potencia || 0;
        document.getElementById('resPower').innerText = kw > 0 ? `${Math.round(kw * 1.36)} CV` : "---";

        document.getElementById('resultsContent').classList.remove('hidden');
    } catch (err) {
        alert("Error al conectar con el servidor.");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}
