async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase();
    
    if (!plate) return alert("Pon una matrícula válida");

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        // LLAMADA AL NODO DE RENDER
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        const result = await response.json();

        // IMPORTANTE: RapidAPI a veces envuelve los datos en un objeto .data
        const info = result.data ? result.data : result;

        if (!info || info.error) {
            throw new Error("No hay datos para esta matrícula");
        }

        // RELLENAR LOS CAMPOS (IDs del HTML Premium Carbon)
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = info.marca || "DESCONOCIDO";
        document.getElementById('resModel').innerText = info.modelo || "---";
        document.getElementById('resPower').innerText = (info.potencia || "---") + " CV";
        document.getElementById('resYear').innerText = info.fecha_matriculacion || "---";
        document.getElementById('resEngine').innerText = (info.cilindrada || "---") + " CC";
        document.getElementById('resFuel').innerText = info.combustible || "---";

        // IMAGEN DINÁMICA
        document.getElementById('vehiclePhoto').src = `https://source.unsplash.com/800x400/?car,${info.marca}`;

        document.getElementById('resultsContent').classList.remove('hidden');

    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}
