import express from 'express';
const profitsRouter = express.Router();
import verificarJwt from '../middlewares/jwt.js';
import Profits from '../controllers/profitsController.js';

/**
 * @swagger
 * /ganancias/{id_alimento}:
 *   get:
 *     tags:
 *       - Profits
 *     summary: Mostrar ganancias de peso para un alimento específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_alimento
 *         in: path
 *         required: true
 *         description: ID del alimento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ganancias de peso obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ganancias de peso obtenidas correctamente"
 *                 nombreAlimento:
 *                   type: string
 *                   example: "Pollo"
 *                 totalGananciaPeso:
 *                   type: number
 *                   example: 5.2
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos de entrada inválidos"
 *                 error:
 *                   type: string
 *                   example: "id_alimento debe ser un número entero"
 *       404:
 *         description: No se encontró el alimento con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No se encontró el alimento con el ID proporcionado"
 *       500:
 *         description: Ocurrió un error al mostrar las ganancias de peso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ocurrió un error al mostrar las ganancias de peso"
 */

profitsRouter.get('/:id_alimento', verificarJwt, Profits.showWeightGains);

export default profitsRouter;
