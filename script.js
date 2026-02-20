/**
 * Función principal para consultar la matrícula
 */
async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    
    // 1. Limpieza de la matrícula: Mayúsculas y quitar espacios/guiones
    const plate = plateInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    if (!plate) {
        alert("Por favor, introduce una matrícula válida.");
        return;
    }

    // Elementos de la interfaz
    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');
    const resDescription = document.getElementById('resDescription');

    // Mostrar loader y ocultar resultados previos
    loader.classList.remove('hidden');
    results.classList.add('hidden');

    // URL de tu servidor en Render (apuntando a la raíz)
    const RENDER_URL = "https://api-historial-vehiculo.onrender.com";

    try {
        console.log(`Conectando con el servidor para buscar: ${plate}`);
        
        // 2. Petición directa a la raíz del servidor
        const response = await fetch(`${RENDER_URL}/${plate}`);

        // Si el servidor devuelve 404, es que la matrícula no existe en la base de datos
        if (response.status === 404) {
            throw new Error("MATRÍCULA NO ENCONTRADA");
        }

        if (!response.ok) {
            throw new Error("ERROR DE CONEXIÓN CON EL SERVIDOR");
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);

        // La API de RapidAPI suele devolver los datos dentro de un objeto o directamente
        const d = data.data || data;

        // 3. Inyectar los datos en el HTML
        document.getElementById('resPlate').innerText = plate;
        
        // Mapeo de campos técnicos
        document.getElementById('resMake').innerText = (d.marca || d.brand || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---").toUpperCase();
        
        // Extraer el año (manejando diferentes formatos de fecha)
        let fecha = d.fecha_matriculacion || d.year || "---";
        const anioMatch = String(fecha).match(/\d{4}/);
        document.getElementById('resYear').innerText = anioMatch ? anioMatch[0] : "---";

        document.getElementById('resPower').innerText = (d.potencia || d.cv || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || d.fuel || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || d.cc || "---") + " CC";

        // Estado de éxito
        resDescription.innerText = "DOCUMENTO VERIFICADO";
        resDescription.style.color = "#ffffff";

    } catch (err) {
        console.error("Error en la consulta:", err.message);
        
        // Mostrar error en la interfaz
        document.getElementById('resPlate').innerText = "AVISO";
        resDescription.innerText = err.message;
        resDescription.style.color = "#ef4444"; // Rojo

        // Limpiar campos para evitar datos antiguos
        const campos = ['resMake', 'resModel', 'resYear', 'resPower', 'resFuel', 'resEngine'];
        campos.forEach(id => document.getElementById(id).innerText = "---");
        
    } finally {
        // Ocultar loader y mostrar la tarjeta de resultados (con datos o error)
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}

// Permitir buscar al pulsar "Enter" en el input
document.getElementById('plateInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        consultarVehiculo();
    }
});
