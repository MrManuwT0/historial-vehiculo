async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase();
    if (!plate) return;

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        const data = await response.json();

        // Mapeo dinámico según la API
        const d = data.data || data;

        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || d.Make || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.Model || "---").toUpperCase();
        document.getElementById('resYear').innerText = d.fecha_matriculacion || d.RegistrationYear || "---";
        document.getElementById('resPower').innerText = (d.potencia || d.HorsePower || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || d.FuelType || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || d.EngineSize || "---") + " CC";
        
        document.getElementById('resultsContent').classList.remove('hidden');
    } catch (err) {
        alert("Error de conexión con el servidor.");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}
