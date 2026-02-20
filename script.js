async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase();
    if (!plate) return;

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message?.message || "Error en servidor");
        }

        const data = await response.json();
        const d = data.data || data;

        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || "---").toUpperCase();
        document.getElementById('resYear').innerText = d.fecha_matriculacion || "---";
        document.getElementById('resPower').innerText = (d.potencia || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || "---") + " CC";

        // Foto dinámica
        document.getElementById('vehiclePhoto').src = `https://source.unsplash.com/800x600/?car,${d.marca}`;

        document.getElementById('resultsContent').classList.remove('hidden');
    } catch (err) {
        alert("ERROR: " + err.message);
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}
