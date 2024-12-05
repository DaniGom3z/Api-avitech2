import { PrismaClient } from "@prisma/client";
import Joi from 'joi';

const prisma = new PrismaClient();

const addWeightSchema = Joi.object({
    peso: Joi.number().required(),
    pollosPesados: Joi.number().required()
});

const deleteWeightSchema = Joi.object({
    id: Joi.number().required(),  
});

const addWeight = async (req, res) => {
    try {
        const { error, value } = addWeightSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                error: error.details[0].message
            });
        }

        const { peso ,pollosPesados} = value;

        // Obtener la fecha y hora actual en la zona horaria local
        const currentDate = new Date();
        const timezoneOffset = currentDate.getTimezoneOffset() * 60000;
        const localISOTime = new Date(currentDate - timezoneOffset).toISOString();

        // Obtener solo la fecha en formato YYYY-MM-DD
        const dateOnly = localISOTime.split('T')[0];

        // Verificar si ya existe un registro de peso para la fecha actual
        const existingWeight = await prisma.pesos.findFirst({
            where: {
                fecha: {
                    gte: new Date(currentDate.setHours(0, 0, 0, 0)), // Mayor o igual que el inicio del día actual
                    lt: new Date(currentDate.setHours(23, 59, 59, 999)), // Menor que el inicio del día siguiente
                },
            },
        });

        if (existingWeight) {
            return res.status(400).json({
                message: "Ya se ingresó el peso para hoy",
            });
        }

        // Si no existe un registro para hoy, procede con la inserción
        const nuevoPeso = await prisma.pesos.create({
            data: {
                peso,
                pollosPesados,
                fecha: localISOTime, // Utilizar la fecha obtenida en formato ISO-8601
            },
        });

        return res.status(201).json({
            message: "Peso añadido correctamente",
        });

    } catch (error) {
        console.error("Error al añadir el peso:", error);
        return res.status(500).json({
            message: "Ocurrió un error al añadir el peso",
        });
    }
};

const getAllWeight = async (req, res) => {
    try {
        const pesos = await prisma.pesos.findMany({
            select: {
                id: true,
                peso: true,
                fecha: true,
                pollosPesados:true
            },
        });

        return res.status(200).json({
            message: "Lista de pesos obtenida correctamente",
            pesos: pesos
        });

    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al obtener la lista de pesos",
        });
    }
};

const deleteWeight = async (req, res) => {
    try {
        const { error, value } = deleteWeightSchema.validate(req.params); 
        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                error: error.details[0].message
            });
        }
        
        const { id } = value;

        const pesoEliminado = await prisma.pesos.delete({
            where: { id: id }
        });

        return res.status(200).json({
            message: "Peso eliminado correctamente",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al eliminar el peso",
        });
    }
};

export default {
    addWeight,
    getAllWeight,
    deleteWeight
};
