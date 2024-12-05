import express from 'express';
const foodRouter = express.Router();
import verificarJwt from '../middlewares/jwt.js';
import Food from '../controllers/foodController.js';
import foodController from '../controllers/foodController.js';
import { handleConcurrent } from '../middlewares/concurrent.js';

/**
 * @swagger
 * tags:
 *   name: Foods
 *   description: Operaciones relacionadas con alimentos
 */

/**
 * @swagger
 * /alimentos:
 *   post:
 *     tags: [Foods]
 *     summary: Añadir un nuevo alimento
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
 *               precio:
 *                 type: number
 *               cantidad:
 *                 type: number
 *               fechaInicial:
 *                 type: string
 *                 format: date
 *               fechaFinal:
 *                 type: string
 *                 format: date
 *             example:
 *               nombre: Pollo
 *               precio: 10
 *               cantidad: 100
 *               fechaInicial: "2024-07-04"
 *               fechaFinal: "2024-07-10"
 *     responses:
 *       201:
 *         description: Alimento añadido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Alimento añadido correctamente"
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
 *                   example: "precio debe ser un número"
 *       500:
 *         description: Ocurrió un error al añadir el alimento
 */

/**
 * @swagger
 * /alimentos/{id}:
 *   put:
 *     tags: [Foods]
 *     summary: Actualizar un alimento existente por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del alimento a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaFinal:
 *                 type: string
 *                 format: date
 *             example:
 *               fechaFinal: "2024-07-15"
 *     responses:
 *       200:
 *         description: Alimento actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Alimento actualizado correctamente"
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
 *                   example: "fechaFinal debe estar en formato ISO 8601"
 *       500:
 *         description: Ocurrió un error al actualizar el alimento
 */

/**
 * @swagger
 * /alimentos/{id}:
 *   delete:
 *     tags: [Foods]
 *     summary: Eliminar un alimento existente por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del alimento a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alimento eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Alimento eliminado correctamente"
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
 *         description: Ocurrió un error al eliminar el alimento
 */

/**
 * @swagger
 * /alimentos:
 *   get:
 *     tags: [Foods]
 *     summary: Obtener todos los alimentos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alimentos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lista de alimentos obtenida correctamente"
 *                 alimentos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Pollo"
 *                       precio:
 *                         type: number
 *                         example: 10
 *                       cantidad:
 *                         type: number
 *                         example: 100
 *                       fechaInicial:
 *                         type: string
 *                         format: date
 *                         example: "2024-07-04"
 *                       fechaFinal:
 *                         type: string
 *                         format: date
 *                         example: "2024-07-10"
 *       500:
 *         description: Ocurrió un error al obtener la lista de alimentos
 */

/**
 * @swagger
 * /alimentos/{id}:
 *   get:
 *     tags: [Foods]
 *     summary: Obtener un alimento por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del alimento a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alimento obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Alimento obtenido correctamente"
 *                 alimento:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Pollo"
 *                     precio:
 *                       type: number
 *                       example: 10
 *                     cantidad:
 *                       type: number
 *                       example: 100
 *                     fechaInicial:
 *                       type: string
 *                       format: date
 *                       example: "2024-07-04"
 *                     fechaFinal:
 *                       type: string
 *                       format: date
 *                       example: "2024-07-10"
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
 *         description: Ocurrió un error al obtener el alimento
 */


foodRouter.post('/', handleConcurrent(foodController.addFood));
foodRouter.put('/:id', handleConcurrent(foodController.updateFood));
foodRouter.delete('/:id', handleConcurrent(foodController.deleteFood));
foodRouter.get('/', handleConcurrent(foodController.getAllFood));
foodRouter.get('/:id', handleConcurrent(foodController.getById));

export default foodRouter;
