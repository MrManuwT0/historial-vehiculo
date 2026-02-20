async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase();
    if (!plate) return;

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        const data = await response.json();
        
        // Manejar Array o Objeto
        const v = Array.isArray(data) ? data[0] : data;

        // Función para evitar el "0" o "N/D"
        const validar = (val) => (val && val !== "0" && val !== 0) ? val : "---";

        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (validar(v.MARCA || v.marca || v.Make)).toUpperCase();
        document.getElementById('resModel').innerText = (validar(v.MODELO || v.modelo || v.Model)).toUpperCase();
        document.getElementById('resYear').innerText = validar(v.FECHA_MATRICULACION || v.fecha_matriculacion || v.RegistrationYear);
        document.getElementById('resFuel').innerText = (validar(v.TYMOTOR || v.combustible || v.FuelType)).toUpperCase();
        
        // CORRECCIÓN VERSIÓN MOTOR
        document.getElementById('resEngine').innerText = (validar(v.TPMOTOR || v.motor || v.EngineSize || v.CARROCERIA)).toUpperCase();

        // CORRECCIÓN POTENCIA DINÁMICA
        const pRaw = v.KWs || v.potencia || v.HorsePower || 0;
        if (pRaw && pRaw != 0) {
            const num = parseFloat(pRaw);
            // Si es menor a 400 asumimos que son KWs y convertimos, si no, son CVs directos
            const cv = (num < 400) ? Math.round(num * 1.35962) : Math.round(num);
            document.getElementById('resPower').innerText = `${cv} CV`;
        } else {
            document.getElementById('resPower').innerText = "VER INFORME";
        }

    } catch (err) {
        alert("Error de conexión con el servidor.");
    } finally {
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('resultsContent').classList.remove('hidden');
    }
}
