async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase();
    if (!plate) return;

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        const data = await response.json();

        // La API puede devolver los datos directamente o dentro de un objeto 'data'
        const info = data.data || data;

        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (info.marca || "---").toUpperCase();
        document.getElementById('resModel').innerText = (info.modelo || "---").toUpperCase();
        document.getElementById('resYear').innerText = info.fecha_matriculacion || "---";
        document.getElementById('resPower').innerText = (info.potencia || "---") + " CV";
        document.getElementById('resFuel').innerText = (info.combustible || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (info.cilindrada || "---") + " CC";

        // Foto aleatoria de coche para el fondo (Unsplash)
        document.getElementById('vehiclePhoto').src = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80`;

        document.getElementById('resultsContent').classList.remove('hidden');
    } catch (err) {
        alert("Error al obtener los datos. Verifica la matrícula.");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}
