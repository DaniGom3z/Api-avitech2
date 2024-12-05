import { Server } from 'socket.io';
import mqtt from 'mqtt';

const initMqttSocketService = (server) => {
    // Configurar Socket.IO
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    // Conectar al broker MQTT
    const BROKER = 'mqtt://localhost';
    const TOPICO = 'avitech/sensores';
    const mqttClient = mqtt.connect(BROKER);

    mqttClient.on('connect', () => {
        console.log('Conectado al broker MQTT');
        mqttClient.subscribe(TOPICO, (err) => {
            if (err) {
                console.error('Error al suscribirse al tópico:', err);
            } else {
                console.log(`Suscrito al tópico: ${TOPICO}`);
            }
        });
    });

    mqttClient.on('message', (topic, message) => {
        try {
            const datos = JSON.parse(message.toString());
            console.log(`Datos recibidos en ${topic}:`, datos);

            // Emitir datos al frontend
            io.emit('sensorData', datos);
        } catch (error) {
            console.error('Error al procesar el mensaje:', error);
        }
    });

    // Manejar conexiones de clientes
    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });
};

export { initMqttSocketService };
