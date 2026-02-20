async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase();
    if (!plate) return;

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        const data = await response.json();

        // IMPORTANTE: Adaptamos a la estructura de la API
        const info = data.data || data;

        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (info.marca || "---").toUpperCase();
        document.getElementById('resModel').innerText = (info.modelo || "---").toUpperCase();
        document.getElementById('resYear').innerText = info.fecha_matriculacion || "---";
        document.getElementById('resPower').innerText = (info.potencia || "---") + " CV";

        document.getElementById('vehiclePhoto').src = `https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80`;
        document.getElementById('resultsContent').classList.remove('hidden');
    } catch (err) {
        alert("Error en la consulta. Revisa la consola.");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}
