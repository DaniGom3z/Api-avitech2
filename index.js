import appConfig from './src/config/appConfig.js';
import { initCluster } from './src/config/clusterConfig.js';
import { initMqttClient } from './src/services/mqttService.js';
import userRouter from './src/routes/userRouter.js';
import loginRouter from './src/routes/loginRouter.js';
import foodRouter from './src/routes/foodRouter.js';
import vaccinesRouter from './src/routes/vaccinesRouter.js';
import waterConsumptionRouter from './src/routes/waterConsumptionRouter.js';
import foodConsumptionRouter from './src/routes/foodConsumptionRouter.js';
import weightRouter from './src/routes/weightRouter.js';
import profitsRouter from './src/routes/profitsRouter.js';
import { swaggerDocs } from './src/documentation/swagger.js';

const isClusterEnabled = process.env.CLUSTER_ENABLED === 'true';

if (isClusterEnabled) {
    // Configurar y manejar cluster
    initCluster();
} else {
    // Iniciar la aplicación sin cluster
    const app = appConfig();
    const PORT = process.env.PORT || 4000;

    // Rutas de la API
    app.use('/user', userRouter);
    app.use('/login', loginRouter);
    app.use('/alimentos', foodRouter);
    app.use('/vacunas', vaccinesRouter);
    app.use('/consumo_agua', waterConsumptionRouter);
    app.use('/consumo_alimentos', foodConsumptionRouter);
    app.use('/pesos', weightRouter);
    app.use('/ganancias', profitsRouter);

    // Iniciar el servidor
    app.listen(PORT, () => {
        console.log(`Servidor en línea en http://localhost:${PORT}`);
        swaggerDocs(app, PORT);
    });

    // Inicializar MQTT
    initMqttClient();
}
