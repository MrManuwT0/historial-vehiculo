async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase();
    if (!plate) return;

    // Mostrar loader y ocultar resultados previos
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        // Conexión con tu servidor en Render
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        if (!response.ok) throw new Error("Fallo en la conexión");

        const data = await response.json();
        
        // Manejar si la API devuelve un array o un objeto
        const v = Array.isArray(data) ? data[0] : data;

        // Rellenar datos en el HTML
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (v.MARCA || v.marca || v.Make || "---").toUpperCase();
        document.getElementById('resModel').innerText = (v.MODELO || v.modelo || v.Model || "---").toUpperCase();
        document.getElementById('resYear').innerText = v.FECHA_MATRICULACION || v.fecha_matriculacion || v.RegistrationYear || "---";
        document.getElementById('resFuel').innerText = (v.TYMOTOR || v.combustible || v.FuelType || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (v.TPMOTOR || v.motor || v.EngineSize || "---").toUpperCase();
        
        // Cálculo de potencia dinámica (KW a CV)
        const potenciaOriginal = v.KWs || v.potencia || v.HorsePower;
        if (potenciaOriginal) {
            const num = parseFloat(potenciaOriginal);
            // Si detectamos que es KW (valor bajo habitual), convertimos a CV
            const cv = (v.KWs || num < 400) ? Math.round(num * 1.35962) : Math.round(num);
            document.getElementById('resPower').innerText = `${cv} CV`;
        } else {
            document.getElementById('resPower').innerText = "---";
        }

        // Mostrar VIN en el pie de página si existe
        if (v.VIN || v.vin) {
            document.getElementById('resDescription').innerText = `Nº BASTIDOR (VIN): ${v.VIN || v.vin}`;
        }

        // Mostrar sección de resultados
        document.getElementById('resultsContent').classList.remove('hidden');

    } catch (err) {
        console.error(err);
        alert("Error al obtener datos. Asegúrate de que el servidor en Render esté activo.");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}
