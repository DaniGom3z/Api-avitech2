import express from 'express';
const weightRouter = express.Router();
import verificarJwt from '../middlewares/jwt.js';
import Weight from '../controllers/weightController.js';

/**
 * @swagger
 * /pesos:
 *   post:
 *     tags:
 *       - Weight
 *     summary: Añadir un nuevo peso
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               peso:
 *                 type: number
 *                 example: 3.5
 *               pollosPesados:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Peso añadido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Peso añadido correctamente
 *       400:
 *         description: Datos de entrada inválidos o peso ya registrado para hoy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Datos de entrada inválidos
 *       500:
 *         description: Ocurrió un error al añadir el peso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ocurrió un error al añadir el peso
 */

/**
 * @swagger
 * /pesos:
 *   get:
 *     tags:
 *       - Weight
 *     summary: Obtener la lista de todos los pesos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pesos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lista de pesos obtenida correctamente
 *                 pesos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       peso:
 *                         type: number
 *                         example: 3.5
 *                       fecha:
 *                         type: string
 *                         example: 2023-06-25
 *                       pollosPesados:
 *                         type: number
 *                         example: 10
 *       500:
 *         description: Ocurrió un error al obtener la lista de pesos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ocurrió un error al obtener la lista de pesos
 */

/**
 * @swagger
 * /pesos/{id}:
 *   delete:
 *     tags:
 *       - Weight
 *     summary: Eliminar un peso por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del peso a eliminar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Peso eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Peso eliminado correctamente
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Datos de entrada inválidos
 *       500:
 *         description: Ocurrió un error al eliminar el peso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ocurrió un error al eliminar el peso
 */

weightRouter.post('/', verificarJwt, Weight.addWeight);
weightRouter.delete('/:id', verificarJwt, Weight.deleteWeight);
weightRouter.get('/', verificarJwt, Weight.getAllWeight);

export default weightRouter;
