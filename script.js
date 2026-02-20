async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase();
    if (!plate) return;

    // Mostrar que estamos trabajando
    console.log("Consultando matrícula: " + plate);

    try {
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        const result = await response.json();

        if (result.error) {
            alert("Error del servidor: " + (result.detalles?.message || result.error));
            return;
        }

        // Extraemos los datos (RapidAPI suele enviarlos en .data o raíz)
        const d = result.data || result;

        // ASIGNACIÓN DIRECTA DE DATOS
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = d.marca || d.brand || "NO DISPONIBLE";
        document.getElementById('resModel').innerText = d.modelo || d.model || "---";
        document.getElementById('resYear').innerText = d.fecha_matriculacion || d.year || "---";
        document.getElementById('resPower').innerText = (d.potencia || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || "---") + " CC";

        // Foto dinámica
        const foto = document.getElementById('vehiclePhoto');
        if(foto) foto.src = `https://source.unsplash.com/800x400/?car,${d.marca}`;

        // Mostrar resultados
        document.getElementById('resultsContent').classList.remove('hidden');

    } catch (err) {
        console.error("Fallo total:", err);
        alert("No se pudo conectar con el servidor de Render.");
    }
}
