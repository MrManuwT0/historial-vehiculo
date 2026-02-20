async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        // Llamada al puente de Render
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        
        if (!response.ok) throw new Error("MATRÍCULA NO ENCONTRADA");

        const data = await response.json();
        const d = data.data || data;

        // Inyectar Datos en UI Carbon
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || "DESCONOCIDO").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || "S/N").toUpperCase();
        document.getElementById('resPower').innerText = (d.potencia || d.cv || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || "---") + " CC";
        
        const fecha = d.fecha_matriculacion || d.year || "";
        const anio = fecha.match(/\d{4}/);
        document.getElementById('resYear').innerText = anio ? anio[0] : "---";

        // Cargar Foto del Vehículo (Unsplash dinámico)
        const photo = document.getElementById('vehiclePhoto');
        photo.src = `https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80`; // Imagen base elegante
        // Intentar buscar por marca si es posible
        photo.src = `https://source.unsplash.com/800x600/?car,${d.marca.toLowerCase()}`;

        results.classList.remove('hidden');

    } catch (err) {
        alert("ERROR: Matrícula no encontrada en la base de datos.");
    } finally {
        loader.classList.add('hidden');
    }
}
