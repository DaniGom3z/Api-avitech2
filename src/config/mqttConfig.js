import mqtt from 'mqtt';

const mqttConfig = () => {
    const BROKER = process.env.MQTT_BROKER || 'mqtt://localhost';
    const cliente = mqtt.connect(BROKER);

    cliente.on('connect', () => {
        console.log('Conectado al broker MQTT');
    });

    return cliente;
};

export default mqttConfig;
