import { Worker } from 'worker_threads';
import os from 'os';

class WorkerPool {
    constructor(numWorkers) {
        this.workers = [];
        this.nextWorkerId = 0;
        
        for (let i = 0; i < numWorkers; i++) {
            const worker = new Worker(`
                const { parentPort } = require('worker_threads');
                const { PrismaClient } = require('@prisma/client');
                const prisma = new PrismaClient();

                parentPort.on('message', async (task) => {
                    try {
                        const result = await prisma[task.model][task.operation](...task.args);
                        parentPort.postMessage({ success: true, data: result });
                    } catch (error) {
                        parentPort.postMessage({ success: false, error: error.message });
                    }
                });
            `, { eval: true });
            this.workers.push(worker);
        }
    }

    async executeTask(model, operation, ...args) {
        const worker = this.workers[this.nextWorkerId];
        this.nextWorkerId = (this.nextWorkerId + 1) % this.workers.length;

        return new Promise((resolve, reject) => {
            worker.postMessage({ model, operation, args });
            
            worker.once('message', (result) => {
                if (result.success) {
                    resolve(result.data);
                } else {
                    reject(new Error(result.error));
                }
            });
        });
    }

    closeAll() {
        this.workers.forEach(worker => worker.terminate());
    }
}

export const workerPool = new WorkerPool(Math.max(1, os.cpus().length - 1));