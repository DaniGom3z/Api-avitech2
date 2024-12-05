import { parentPort, workerData } from 'worker_threads';

// Función para procesar los datos simulados
function procesarDatos(datos) {
    const resultado = {
        temperaturaPromedio: datos.dht11.temperatura,
        humedadPromedio: datos.dht11.humedad,
        aguaRestante: datos.ultrasonico.agua,
        comidaRestante: datos.ultrasonico.comida,
        timestamp: new Date(),
    };

    // Simular procesamiento pesado
    for (let i = 0; i < 1e6; i++) {} // Operación ficticia
    return resultado;
}

// Procesar los datos y enviar el resultado de vuelta
const resultado = procesarDatos(workerData);
parentPort.postMessage(resultado);
