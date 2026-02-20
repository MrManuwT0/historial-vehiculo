async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    const plate = plateInput.value.trim().toUpperCase();
    if (!plate) return;

    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');

    loader.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);

        // Verificamos si la respuesta es correcta (status 200)
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: El servidor no responde correctamente.`);
        }

        const data = await response.json();

        // Si la API devuelve un error interno
        if (data.error) throw new Error(data.error);

        // Mapeo flexible: RapidAPI suele enviar los datos en un objeto 'data'
        const d = data.data || data;

        // Inyectar datos en el HTML Carbon
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = (d.marca || d.brand || "NO DISPONIBLE").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---").toUpperCase();
        document.getElementById('resYear').innerText = d.fecha_matriculacion || d.year || "---";
        document.getElementById('resPower').innerText = (d.potencia || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || "---") + " CC";

        // Foto dinámica basada en la marca
        document.getElementById('vehiclePhoto').src = `https://source.unsplash.com/800x400/?car,${d.marca}`;

        results.classList.remove('hidden');

    } catch (err) {
        console.error(err);
        alert("FALLO EN CONSULTA: " + err.message);
    } finally {
        loader.classList.add('hidden');
    }
}
