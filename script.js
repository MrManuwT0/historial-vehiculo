async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase();
    if (!plate) return;

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        // AÑADIDO: Log para ver qué URL estamos llamando
        console.log("Consultando: https://api-historial-vehiculo.onrender.com/" + plate);
        
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // AÑADIDO: Log para ver qué nos llega del servidor
        console.log("Datos recibidos:", data);

        if (!data || (Array.isArray(data) && data.length === 0)) {
            throw new Error("No se encontraron datos");
        }

        const v = Array.isArray(data) ? data[0] : data;

        // ... (resto de tu código de mapeo aquí) ...

        document.getElementById('resultsContent').classList.remove('hidden');

    } catch (err) {
        console.error("Detalle del error:", err);
        alert("Error: " + err.message + ". Revisa la consola (F12) para más detalles.");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}
