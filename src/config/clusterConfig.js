import cluster from 'cluster';
import os from 'os';

const initCluster = () => {
    if (cluster.isPrimary) {
        const numCPUs = os.cpus().length;
        console.log(`Iniciando ${numCPUs} procesos...`);

        // Crear un worker por cada CPU
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} terminó.`);
            cluster.fork(); // Reemplazar el worker caído
        });
    } else {
        import('../../index.js'); // Ejecutar el servidor Express en los workers
    }
};

export { initCluster };
