import express from 'express';
import verificarJwt from '../middlewares/jwt.js';
import Food from '../controllers/foodConsumptionController.js';

const foodConsumptionRouter = express.Router();

/**
 * @swagger
 * /consumo_alimentos:
 *   get:
 *     tags:
 *       - Food Consumption
 *     summary: Obtener lista de consumo de alimentos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de consumo de alimentos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lista de consumo de alimentos obtenida correctamente
 *                 Consumo_de_alimento:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       id_alimento:
 *                         type: integer
 *                         example: 1
 *                       cantidad:
 *                         type: integer
 *                         example: 100
 *                       fecha:
 *                         type: string
 *                         format: date
 *                         example: 2023-07-01
 *       500:
 *         description: Ocurrió un error al obtener la lista de consumo de alimentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ocurrió un error al obtener la lista de consumo de alimentos
 *   post:
 *     tags:
 *       - Food Consumption
 *     summary: Consumo de alimentos
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
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Consumo de alimento añadido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Consumo de alimento añadido correctamente
 *       400:
 *         description: Datos de entrada inválidos o ya se ingresó el consumo de alimento el día de hoy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Datos de entrada inválidos
 *                 error:
 *                   type: string
 *                   example: Cantidad es requerida
 *       500:
 *         description: Ocurrió un error al añadir el consumo de alimento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ocurrió un error al añadir el consumo de alimento
 */

foodConsumptionRouter.get('/', verificarJwt, Food.getFoodConsumption);
foodConsumptionRouter.post('/', verificarJwt, Food.postFoodConsumption);


export default foodConsumptionRouter;
