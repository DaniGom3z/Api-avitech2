import express from 'express';
const vaccinesRouter = express.Router();
import verificarJwt from '../middlewares/jwt.js';
import Vaccines from '../controllers/vaccinesController.js';

/**
 * @swagger
 * /vacunas:
 *   post:
 *     tags:
 *       - Vaccines
 *     summary: Añadir una nueva vacuna
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Vacuna A"
 *               precio:
 *                 type: number
 *                 example: 25.5
 *               cantidad:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Vacuna añadida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vacuna añadida correctamente"
 *       400:
 *         description: Datos de entrada inválidos o vacuna ya existente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos de entrada inválidos"
 *       500:
 *         description: Ocurrió un error al añadir la vacuna
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ocurrió un error al añadir la vacuna"
 */

/**
 * @swagger
 * /vacunas:
 *   get:
 *     tags:
 *       - Vaccines
 *     summary: Obtener la lista de todas las vacunas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vacunas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lista de vacunas obtenida correctamente"
 *                 vacunas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Vacuna A"
 *                       precio:
 *                         type: number
 *                         example: 25.5
 *                       cantidad:
 *                         type: number
 *                         example: 100
 *       500:
 *         description: Ocurrió un error al obtener la lista de vacunas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ocurrió un error al obtener la lista de vacunas"
 */

/**
 * @swagger
 * /vacunas/{id}:
 *   delete:
 *     tags:
 *       - Vaccines
 *     summary: Eliminar una vacuna por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la vacuna a eliminar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Vacuna eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vacuna eliminada correctamente"
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
 *       500:
 *         description: Ocurrió un error al eliminar la vacuna
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ocurrió un error al eliminar la vacuna"
 */

vaccinesRouter.post('/', verificarJwt, Vaccines.addVaccine);
vaccinesRouter.delete('/:id', verificarJwt, Vaccines.deleteVaccine);
vaccinesRouter.get('/', verificarJwt, Vaccines.getAllVaccines);

export default vaccinesRouter;
