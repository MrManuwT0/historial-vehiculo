async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        // Render actúa como el puente hacia RapidAPI
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        
        if (!response.ok) throw new Error("No encontrado");

        const json = await response.json();
        const data = json.data || json;

        // Mapeo de datos en la interfaz Carbon
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (data.marca || "DESCONOCIDO").toUpperCase();
        document.getElementById('resModel').innerText = (data.modelo || "S/N").toUpperCase();
        document.getElementById('resPower').innerText = (data.potencia || "---") + " CV";
        document.getElementById('resFuel').innerText = (data.combustible || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (data.cilindrada || "---") + " CC";
        
        const fecha = data.fecha_matriculacion || "";
        const anio = fecha.match(/\d{4}/);
        document.getElementById('resYear').innerText = anio ? anio[0] : "---";

        // FOTO DINÁMICA: Usamos la marca para buscar una foto de catálogo
        document.getElementById('vehiclePhoto').src = `https://source.unsplash.com/800x600/?car,${data.marca}`;

        results.classList.remove('hidden');
    } catch (err) {
        alert("Matrícula no encontrada en la base de datos.");
    } finally {
        loader.classList.add('hidden');
    }
}
