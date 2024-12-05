import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { log } from 'console';
import Joi from 'joi';


const prisma = new PrismaClient();
const SALTOS_BCRYPT = process.env.SALTOS_BCRYPT;
const SALTOS = parseInt(SALTOS_BCRYPT);


const createUserSchema = Joi.object({
    nombre: Joi.string().required(),
    contraseña: Joi.string().required(),
    correo: Joi.string().email().required()
});

const getUserByIdSchema = Joi.object({
    id: Joi.number().required()
});

const create = async (req, res) => {
    try {
        const { error, value } = createUserSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
            });
        }

        const { nombre, contraseña, correo } = value;

        const usuarioEncontrado = await prisma.usuario.findFirst({
            where: {
                email: correo
            }
        });

        if (usuarioEncontrado) {
            return res.status(409).json({
                message: "El usuario ya existe"
            });
        }

 
        

        const hashedPassword = await bcrypt.hash(contraseña, SALTOS);

        await prisma.usuario.create({
            data: {
                name: nombre,
                password: hashedPassword,
                email: correo
            }
        });

        return res.status(201).json({
            message: "Usuario creado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear usuario"
        });
    } finally {
        await prisma.$disconnect();
    }
};

const getUserById = async(req,res) => {
try {
    const {error,value} = getUserByIdSchema.validate(req.params)
    if (error) {
        return res.status(400).json({
            message: "Datos de entrada inválidos",
        });
    }
    const {id} = value;
    const usuario = await prisma.usuario.findUnique({
        where: {
            id: id
        },
        select: {
            name: true,
            email: true
        }
    });
    
    return res.status(201).json({
        message: "Usuario encontrado exitosamente",
        usuario :usuario
    });
} catch (error) {
    console.log(error)
    return res.status(500).json({
        message: "Error al obtener usuario",
    });
}
}

export default {
    create,
    getUserById
};
