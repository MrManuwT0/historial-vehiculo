async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase();
    if (!plate) return;

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        const data = await response.json();
        const v = Array.isArray(data) ? data[0] : data;

        const fix = (val) => (val && val !== "0" && val !== 0) ? val : "---";

        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = fix(v.MARCA || v.marca).toUpperCase();
        document.getElementById('resModel').innerText = fix(v.MODELO || v.modelo).toUpperCase();
        document.getElementById('resYear').innerText = fix(v.FECHA_MATRICULACION || v.fecha_matriculacion);
        document.getElementById('resFuel').innerText = fix(v.TYMOTOR || v.combustible).toUpperCase();
        document.getElementById('resDrive').innerText = fix(v.TRACCION || v.traccion).toUpperCase();
        document.getElementById('resBody').innerText = fix(v.CARROCERIA || v.carroceria).toUpperCase();
        document.getElementById('resEngine').innerText = fix(v.MOTOR || v.TPMOTOR || "VER FICHA TÉCNICA").toUpperCase();

        const pRaw = v.KWs || v.potencia || 0;
        document.getElementById('resPower').innerText = (pRaw && pRaw != 0) 
            ? `${Math.round(pRaw * (pRaw < 450 ? 1.35962 : 1))} CV` 
            : "---";

        if (v.VIN) document.getElementById('resDescription').innerText = `Nº BASTIDOR (VIN): ${v.VIN}`;

        document.getElementById('resultsContent').classList.remove('hidden');
    } catch (err) { alert("Error al conectar con el servidor."); } 
    finally { document.getElementById('loader').classList.add('hidden'); }
}
