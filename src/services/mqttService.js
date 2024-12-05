import mqtt from 'mqtt';
import { procesarEnWorker } from './workerService.js';

const initMqttClient = () => {
    const BROKER = process.env.MQTT_BROKER || 'mqtt://localhost';
    const TOPICO = 'avitech/sensores';

    const cliente = mqtt.connect(BROKER);

    cliente.on('connect', () => {
        console.log('Conectado al broker MQTT');
        cliente.subscribe(TOPICO, (err) => {
            if (!err) {
                console.log(`Suscrito al tópico: ${TOPICO}`);
            } else {
                console.error('Error al suscribirse:', err);
            }
        });
    });

    cliente.on('message', async (topic, message) => {
        try {
            const datos = JSON.parse(message.toString());
            console.log(`Mensaje recibido en ${topic}:`, datos);

            const resultado = await procesarEnWorker(datos);
            console.log('Resultado del procesamiento:', resultado);
        } catch (error) {
            console.error('Error procesando mensaje:', error);
        }
    });
};

export { initMqttClient };
