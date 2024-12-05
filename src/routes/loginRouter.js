import express from 'express';
const loginRouter = express.Router();
import Login from '../controllers/loginController.js';

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 example: usuario@example.com
 *               contraseña:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Acceso correcto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acceso correcto
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       400:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credenciales incorrectas!
 *       500:
 *         description: Ocurrió un error al validar credenciales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ocurrió un error al validar credenciales.
 *                 error:
 *                   type: string
 *                   example: Error message here
 */
loginRouter.post('/', Login);

export default loginRouter;
