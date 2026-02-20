async function consultarVehiculo() {
    const plate = document.getElementById('plateInput').value.trim().toUpperCase();
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        // Petición al túnel de Render
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // Extraer datos (manejando si vienen en .data o raíz)
        const d = data.data || data;

        // Rellenar UI
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || "DESCONOCIDO").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || "S/N").toUpperCase();
        document.getElementById('resYear').innerText = d.fecha_matriculacion || d.year || "---";
        document.getElementById('resPower').innerText = (d.potencia || "---") + " CV";
        document.getElementById('resEngine').innerText = (d.cilindrada || "---") + " CC";
        document.getElementById('resFuel').innerText = (d.combustible || "---").toUpperCase();

        // Foto basada en la marca
        document.getElementById('vehiclePhoto').src = `https://source.unsplash.com/800x400/?car,${d.marca}`;

        results.classList.remove('hidden');
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        loader.classList.add('hidden');
    }
}
