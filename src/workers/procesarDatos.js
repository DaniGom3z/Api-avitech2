import { parentPort, workerData } from 'worker_threads';
import mysql from 'mysql2/promise';

// Función para calcular la temperatura futura basada en los últimos 3 registros
async function calcularTemperaturaFutura(temperaturaActual) {
    try {
        // Obtener los datos históricos de la base de datos
        const temperaturasHistoricas = await obtenerTemperaturasHistoricas();

        // Verificar si hay al menos 3 mediciones
        if (temperaturasHistoricas.length >= 3) {
            const ultimaTemperatura = temperaturasHistoricas[0].temperatura_promedio;
            const penultimaTemperatura = temperaturasHistoricas[1].temperatura_promedio;
            const antepenultimaTemperatura = temperaturasHistoricas[2].temperatura_promedio;

            // Calcular las tasas de cambio entre las últimas tres temperaturas
            const tasaCambioUltimaPenultima = ultimaTemperatura - penultimaTemperatura;
            const tasaCambioPenultimaAntepenultima = penultimaTemperatura - antepenultimaTemperatura;

            // Promediar las tasas de cambio
            const tasaCambioPromedio = (tasaCambioUltimaPenultima + tasaCambioPenultimaAntepenultima) / 2;

            // Si la tasa de cambio promedio es un valor numérico válido
            if (!isNaN(tasaCambioPromedio)) {
                // Estimar la temperatura dentro de 6 horas
                const temperaturaFutura = temperaturaActual + tasaCambioPromedio * 6; // Estimación en 6 horas
                return temperaturaFutura;
            } else {
                console.error('La tasa de cambio no es válida');
                return temperaturaActual; // Si la tasa de cambio no es válida, devolvemos la temperatura actual
            }
        } else {
            console.warn('No hay suficientes datos históricos para calcular la temperatura futura');
            return temperaturaActual; // Si no hay suficientes datos históricos, devolvemos la temperatura actual
        }
    } catch (error) {
        console.error('Error al calcular la temperatura futura:', error);
        return temperaturaActual; // En caso de error, devolvemos la temperatura actual
    }
}

// Función para obtener las temperaturas históricas
async function obtenerTemperaturasHistoricas() {
    const connection = await mysql.createConnection({
        host: 'localhost',    
        user: 'root',         
        password: 'danigomez123',  
        database: 'integrador',  
    });

    try {
        // Obtener las últimas tres temperaturas registradas
        const [rows] = await connection.execute(
            'SELECT temperatura_promedio FROM datos_sensor ORDER BY timestamp DESC LIMIT 3'
        );
        return rows;
    } catch (error) {
        console.error('Error al obtener las temperaturas históricas:', error);
        return [];
    } finally {
        await connection.end();
    }
}

// Función para procesar los datos simulados
async function procesarDatos(datos) {
    const temperaturaActual = datos.dht11.temperatura;
    const humedadPromedio = datos.dht11.humedad;
    const aguaRestante = datos.ultrasonico.agua;
    const comidaRestante = datos.ultrasonico.comida;

    // Calcular la temperatura dentro de 6 horas basada en datos históricos
    const temperaturaFutura = await calcularTemperaturaFutura(temperaturaActual);

    const resultado = {
        temperaturaPromedio: temperaturaActual,
        temperaturaFutura,
        humedadPromedio,
        aguaRestante,
        comidaRestante,
        timestamp: new Date(),
    };

    // Guardar los datos en la base de datos
    await guardarEnBaseDeDatos(resultado);

    return resultado;
}

// Función para guardar los datos en MySQL
async function guardarEnBaseDeDatos(datos) {
    const connection = await mysql.createConnection({
        host: 'localhost',    
        user: 'root',         
        password: 'danigomez123',  
        database: 'integrador',  
    });

    try {
        // Consulta SQL para insertar los datos
        const query = `
            INSERT INTO datos_sensor (temperatura_promedio, temperatura_futura, humedad_promedio, agua_restante, comida_restante, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        // Ejecutar la consulta
        await connection.execute(query, [
            datos.temperaturaPromedio,
            datos.temperaturaFutura,
            datos.humedadPromedio,
            datos.aguaRestante,
            datos.comidaRestante,
            datos.timestamp,
        ]);

        console.log('Datos guardados en la base de datos');
    } catch (error) {
        console.error('Error al guardar los datos:', error);
    } finally {
        await connection.end();
    }
}

// Procesar los datos y enviar el resultado de vuelta
procesarDatos(workerData)
    .then(resultado => {
        parentPort.postMessage(resultado);
    })
    .catch(error => {
        console.error('Error al procesar los datos:', error);
    });
