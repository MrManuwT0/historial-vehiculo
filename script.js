/**
 * Función principal para consultar la matrícula en el servidor de Render
 */
async function consultarVehiculo() {
    const plateInput = document.getElementById('plateInput');
    
    // 1. Limpieza total de la matrícula: Mayúsculas y eliminar cualquier carácter que no sea letra o número
    const plate = plateInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    if (!plate) {
        alert("Por favor, introduce una matrícula válida.");
        return;
    }

    // Elementos de la interfaz (asegúrate de que los IDs coincidan con tu HTML)
    const loader = document.getElementById('loader');
    const results = document.getElementById('resultsContent');
    const resDescription = document.getElementById('resDescription');

    // Mostrar el cargador y ocultar la tarjeta de resultados previa
    loader.classList.remove('hidden');
    results.classList.add('hidden');

    // URL de tu servidor en Render (Configurado para leer en la raíz)
    const RENDER_URL = "https://api-historial-vehiculo.onrender.com";

    try {
        console.log(`[FRONTEND] Solicitando datos para: ${plate}`);
        
        // 2. Petición directa a la raíz: RENDER_URL / MATRICULA
        const response = await fetch(`${RENDER_URL}/${plate}`);

        // Si el servidor devuelve 404, es que la matrícula no existe en la base de datos de RapidAPI
        if (response.status === 404) {
            throw new Error("MATRÍCULA NO ENCONTRADA");
        }

        if (!response.ok) {
            throw new Error("ERROR DE CONEXIÓN CON EL SERVIDOR");
        }

        const data = await response.json();
        
        // Verificamos si el servidor nos envió un mensaje de error manual
        if (data.error) {
            throw new Error(data.error.toUpperCase());
        }

        const d = data.data || data;

        // 3. Inyectar los datos en los contenedores del diseño Premium
        document.getElementById('resPlate').innerText = plate;
        
        // Mapeo de datos técnicos (Marca, Modelo, etc.)
        document.getElementById('resMake').innerText = (d.marca || d.brand || "---").toUpperCase();
        document.getElementById('resModel').innerText = (d.modelo || d.model || "---").toUpperCase();
        
        // Procesar el año de matriculación
        let fecha = d.fecha_matriculacion || d.year || "---";
        const anioMatch = String(fecha).match(/\d{4}/);
        document.getElementById('resYear').innerText = anioMatch ? anioMatch[0] : "---";

        document.getElementById('resPower').innerText = (d.potencia || d.cv || "---") + " CV";
        document.getElementById('resFuel').innerText = (d.combustible || d.fuel || "---").toUpperCase();
        document.getElementById('resEngine').innerText = (d.cilindrada || d.cc || "---") + " CC";

        // Cambiar estilo de la descripción a éxito
        resDescription.innerText = "DOCUMENTO VERIFICADO";
        resDescription.style.color = "white";

    } catch (err) {
        console.error("[FRONTEND ERROR]:", err.message);
        
        // Mostrar el error visualmente en la ficha
        document.getElementById('resPlate').innerText = "AVISO";
        resDescription.innerText = err.message;
        resDescription.style.color = "#ff4444"; // Color rojo para errores

        // Limpiar los campos técnicos
        const campos = ['resMake', 'resModel', 'resYear', 'resPower', 'resFuel', 'resEngine'];
        campos.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = "---";
        });
        
    } finally {
        // Ocultar el cargador y mostrar los resultados (ya sea con datos o con el error)
        loader.classList.add('hidden');
        results.classList.remove('hidden');
    }
}

// Escuchar la tecla Enter para que el usuario no tenga que hacer clic siempre
document.getElementById('plateInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        consultarVehiculo();
    }
});
