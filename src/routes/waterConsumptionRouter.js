import express from 'express';
const waterConsumptionRouter = express.Router();
import verificarJwt from '../middlewares/jwt.js';
import Water from '../controllers/waterConsumptionController.js';

/**
 * @swagger
 * /consumo_agua:
 *   get:
 *     tags:
 *       - Water Consumption
 *     summary: Obtener la lista de consumo de agua
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de consumo de agua obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lista de consumo de agua obtenida correctamente"
 *                 Consumo_de_agua:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       cantidad:
 *                         type: number
 *                         example: 15.5
 *                       fecha:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-03T00:00:00.000Z"
 *       500:
 *         description: Ocurrió un error al obtener la lista de consumo de agua
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ocurrió un error al obtener la lista de consumo de agua"
 *   post:
 *     tags:
 *       - Water Consumption
 *     summary: Registro de consumo de agua
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: number
 *                 example: 15.5
 *     responses:
 *       201:
 *         description: Consumo de agua añadido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Consumo de agua añadido correctamente"
 *       400:
 *         description: Datos de entrada inválidos o ya se ingresó el consumo de agua el día de hoy
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
 *                   example: "Cantidad es requerida"
 *       500:
 *         description: Ocurrió un error al añadir el consumo de agua
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ocurrió un error al añadir el consumo de agua"
 */

waterConsumptionRouter.get('/', verificarJwt, Water.getWaterConsumption);
waterConsumptionRouter.post('/', verificarJwt, Water.postWaterConsumption);

export default waterConsumptionRouter;
