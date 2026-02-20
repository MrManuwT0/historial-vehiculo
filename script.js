async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase();
    if (!plate) return;

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        const data = await response.json();

        const v = Array.isArray(data) ? data[0] : data;

        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = v.MARCA || "---";
        document.getElementById('resModel').innerText = v.MODELO || "---";
        document.getElementById('resYear').innerText = v.FECHA_MATRICULACION || "---";
        
        // --- CORRECCIÓN DE POTENCIA DINÁMICA ---
        if (v.KWs) {
            const kw = parseFloat(v.KWs);
            const cv = Math.round(kw * 1.35962); // Conversión exacta de KW a CV
            document.getElementById('resPower').innerText = `${kw} KW (${cv} CV)`;
        } else {
            document.getElementById('resPower').innerText = "---";
        }
        // ---------------------------------------

        document.getElementById('resFuel').innerText = v.TYMOTOR || "---";
        document.getElementById('resEngine').innerText = v.TPMOTOR || "---";
        
        if(v.VIN) {
            document.getElementById('resDescription').innerText = `Nº BASTIDOR (VIN): ${v.VIN}`;
        }

        document.getElementById('resultsContent').classList.remove('hidden');
    } catch (err) {
        alert("Error al obtener datos");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}
