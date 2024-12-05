import { Worker } from 'worker_threads';

const procesarEnWorker = (datos) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./src/workers/procesarDatos.js', {
            workerData: datos,
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker finalizó con código ${code}`));
            }
        });
    });
};

export { procesarEnWorker };
