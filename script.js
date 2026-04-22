async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase();
    if (!plate) return;

    // UI: Mostrar cargando, ocultar resultados
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        // Llamada a tu servidor en Render
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        
        if (!response.ok) throw new Error("Error de conexión");
        
        const data = await response.json();
        // Normalizamos los datos (si la API devuelve un array, tomamos el primero)
        const v = Array.isArray(data) ? data[0] : data;

        // Función auxiliar de limpieza
        const fix = (val) => (val && val !== "0" && val !== 0) ? val : "---";

        // Mapeo a los IDs de tu HTML
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = fix(v.MARCA || v.marca).toUpperCase();
        document.getElementById('resModel').innerText = fix(v.MODELO || v.modelo).toUpperCase();
        document.getElementById('resYear').innerText = fix(v.FECHA_MATRICULACION || v.fecha_matriculacion);
        document.getElementById('resFuel').innerText = fix(v.TYMOTOR || v.combustible).toUpperCase();
        document.getElementById('resDrive').innerText = fix(v.TRACCION || v.traccion).toUpperCase();
        document.getElementById('resBody').innerText = fix(v.CARROCERIA || v.carroceria).toUpperCase();
        document.getElementById('resEngine').innerText = fix(v.MOTOR || v.TPMOTOR || "VER FICHA TÉCNICA").toUpperCase();

        // Cálculo de Potencia
        const pRaw = v.KWs || v.potencia || 0;
        if (pRaw && pRaw != 0) {
            const num = parseFloat(pRaw);
            const cv = (num < 450) ? Math.round(num * 1.35962) : Math.round(num);
            document.getElementById('resPower').innerText = `${cv} CV`;
        } else {
            document.getElementById('resPower').innerText = "---";
        }

        // Descripción / VIN
        document.getElementById('resDescription').innerText = v.VIN ? `Nº BASTIDOR (VIN): ${v.VIN}` : "CERTIFICADO DE DATOS OFICIAL";

        // Mostrar resultados
        document.getElementById('resultsContent').classList.remove('hidden');

    } catch (err) {
        console.error("Error completo:", err);
        alert("No se han encontrado datos o el servidor no responde.");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}
