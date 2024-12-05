import { PrismaClient, Prisma } from "@prisma/client";
import Joi from 'joi';

const prisma = new PrismaClient();

const addVaccineSchema = Joi.object({
    nombre: Joi.string().required(),
    precio: Joi.number().required(),
    cantidad: Joi.number().required()
});

const deleteVaccineSchema = Joi.object({
    id: Joi.number().required(),  
})

const addVaccine = async (req, res) => {
    try {
        const { error, value } = addVaccineSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                error: error.details[0].message
            });
        }

        const { nombre, precio, cantidad } = value;

        const existingVaccine = await prisma.vacuna.findFirst({
            where: {
                nombre: nombre,
            },
        });

        if (existingVaccine) {
            return res.status(400).json({
                message: "Ya existe una vacuna con este nombre",
            });
        }

        const nuevaVacuna = await prisma.vacuna.create({
            data: {
                nombre,
                precio,
                cantidad,
            },
        });

        return res.status(201).json({
            message: "Vacuna añadida correctamente",
        });

    } catch (error) {
        console.error("Error al añadir la vacuna:", error);
        return res.status(500).json({
            message: "Ocurrió un error al añadir la vacuna",
        });
    }
};

const getAllVaccines = async (req, res) => {
    try {
        const vacunas = await prisma.vacuna.findMany({
            select: {
                id: true,
                nombre: true,
                precio: true,
                cantidad: true,
            },
        });

        return res.status(200).json({
            message: "Lista de vacunas obtenida correctamente",
            vacunas: vacunas
        });

    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al obtener la lista de vacunas",
        });
    }
};

const deleteVaccine = async (req, res) => {
    try {
        const { error, value } = deleteVaccineSchema.validate(req.params); 
        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                error: error.details[0].message
            });
        }
        
        const { id } = value;

        const vacunaEliminada = await prisma.vacuna.delete({
            where: { id: id }
        });

        return res.status(200).json({
            message: "Vacuna eliminada correctamente",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al eliminar la vacuna",
        });
    }
};

export default {
    addVaccine,
    getAllVaccines,
    deleteVaccine
};
