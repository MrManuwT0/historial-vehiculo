async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase();
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        // Conexión a tu puente de Render
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        
        if (!response.ok) throw new Error("Error en servidor");

        const data = await response.json();
        const d = data.data || data;

        // Inyectar datos
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || "---").toUpperCase();
        document.getElementById('resYear').innerText = d.fecha_matriculacion || "---";
        document.getElementById('resPower').innerText = (d.potencia || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || "---") + " CC";
        document.getElementById('resDescription').innerText = (d.descripcion || "VEHÍCULO IDENTIFICADO").toUpperCase();

        // Imagen de fondo (Unsplash)
        document.getElementById('vehiclePhoto').src = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80`;

        results.classList.remove('hidden');
    } catch (err) {
        alert("FALLO TÉCNICO: Verifica que tu servidor Render esté encendido.");
    } finally {
        loader.classList.add('hidden');
    }
}
