import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { log } from "console";

dotenv.config();

const prisma = new PrismaClient();
const privateKey = process.env.SECRET_KEY;

const login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        const usuarioEncontrado = await prisma.usuario.findFirst({
            where: {
                email: correo
            }
        });

        if (!usuarioEncontrado) {
            return res.status(400).json({
                message: "Credenciales incorrectas!"
            });
        }

        const passwordCorrecto = bcrypt.compareSync(contraseña, usuarioEncontrado.password);
        if (!passwordCorrecto) {
            return res.status(400).json({
                message: "Credenciales incorrectas!",
            });
        }

        const token = jwt.sign(
            { id: usuarioEncontrado.id, email: usuarioEncontrado.email },
            privateKey,
            { 
                
                algorithm: process.env.ALGORITMO,
            }
        );
        
        
        return res.status(200).json({
            message: "Acceso correcto",
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al validar credenciales.",
            error: error.message
        });
    }
};

export default login;
