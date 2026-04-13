/**
 * INFOMATRICULA - Script de Consulta de Vehículos
 * Versión: Carbon Edition Elite (Actualizado)
 */

async function consultarVehiculo() {
    const input = document.getElementById('plateInput');
    const plate = input.value.trim().toUpperCase();
    
    // Validación básica
    if (!plate) {
        alert("Por favor, introduce una matrícula válida.");
        return;
    }

    // Estado visual: Cargando
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');

    try {
        // Llamada a la API
        const response = await fetch(`https://api-historial-vehiculo.onrender.com/${plate}`);
        
        if (!response.ok) throw new Error("Vehículo no encontrado");

        const data = await response.json();
        const v = Array.isArray(data) ? data[0] : data;

        // --- Lógica de Procesamiento de Datos ---

        // Función de limpieza para datos nulos o vacíos
        const fix = (val) => (val && val !== "0" && val !== 0 && val !== "null") ? val : "---";

        // 1. Datos principales
        document.getElementById('resPlate').innerText = plate;
        document.getElementById('resMake').innerText = fix(v.MARCA || v.marca).toUpperCase();
        document.getElementById('resModel').innerText = fix(v.MODELO || v.modelo).toUpperCase();
        document.getElementById('resYear').innerText = fix(v.FECHA_MATRICULACION || v.fecha_matriculacion);
        document.getElementById('resFuel').innerText = fix(v.TYMOTOR || v.combustible).toUpperCase();
        
        // 2. Datos Avanzados
        document.getElementById('resDrive').innerText = fix(v.TRACCION || v.traccion).toUpperCase();
        document.getElementById('resBody').innerText = fix(v.CARROCERIA || v.carroceria).toUpperCase();
        document.getElementById('resEngine').innerText = fix(v.MOTOR || v.TPMOTOR || "VER FICHA TÉCNICA").toUpperCase();

        // 3. Cálculo dinámico de Potencia (KW a CV)
        const pRaw = v.KWs || v.potencia || 0;
        if (pRaw && pRaw != 0) {
            const num = parseFloat(pRaw);
            // Si el número es bajo (KW), convertimos. Si es muy alto, probablemente ya venga en CV.
            const cv = (num < 450) ? Math.round(num * 1.35962) : Math.round(num);
            document.getElementById('resPower').innerText = `${cv} CV`;
        } else {
            document.getElementById('resPower').innerText = "---";
        }

        // 4. Pie de certificado / VIN
        const descElement = document.getElementById('resDescription');
        if (v.VIN && v.VIN !== "0") {
            descElement.innerText = `Nº BASTIDOR (VIN): ${v.VIN}`;
            descElement.classList.remove('tracking-[4px]'); // Menos tracking para que quepa el VIN largo
        } else {
            descElement.innerText = "CERTIFICADO DE DATOS OFICIAL";
            descElement.classList.add('tracking-[4px]');
        }

        // --- Finalización y Visualización ---

        // Mostrar el contenedor de resultados
        document.getElementById('resultsContent').classList.remove('hidden');

        // REFRESCAR ADSENSE: 
        // Esto fuerza a Google a revisar si hay huecos de anuncios nuevos que rellenar 
        // ahora que el contenido ha aparecido.
        (adsbygoogle = window.adsbygoogle || []).push({});

    } catch (err) {
        console.error("Error en la consulta:", err);
        alert("No se han encontrado datos para esa matrícula o el servidor no responde.");
    } finally {
        // Quitar el loader independientemente de si hubo error o no
        document.getElementById('loader').classList.add('hidden');
    }
}

// Permitir buscar al presionar "Enter" en el input
document.getElementById('plateInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        consultarVehiculo();
    }
});
