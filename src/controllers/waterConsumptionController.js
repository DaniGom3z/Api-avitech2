import { PrismaClient, Prisma } from "@prisma/client";
import Joi from 'joi';


const prisma = new PrismaClient();

const addConsumptionSchema = Joi.object({
    cantidad: Joi.number().required(),
});

const getWaterConsumption = async (req,res) =>{
    try {
        const consumoAgua = await prisma.consumo_de_agua.findMany({
            select: {
                id: true,
                cantidad: true,
                fecha:true
            },
            orderBy: {
                fecha :"desc"
            },
            take: 7
        });

        return res.status(200).json({
            message: "Lista de consumo de agua obtenida correctamente",
            Consumo_de_agua: consumoAgua
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al obtener la lista de Consumo de agua",
        });
    }
}

const postWaterConsumption = async (req,res) =>{
    try {
        const {error,value} = addConsumptionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                error: error.details[0].message
            });
        }
        
        const { cantidad } = value;

        const currentDate = new Date();
        const timezoneOffset = currentDate.getTimezoneOffset() * 60000;
        const localISOTime = new Date(currentDate - timezoneOffset).toISOString();

        // Obtener solo la fecha en formato YYYY-MM-DD
        const dateOnly = localISOTime.split('T')[0];

        // Verificar si ya existe un registro de peso para la fecha actual
        const existingConsumption_alimento  = await prisma.consumo_de_agua.findFirst({
            where: {
                fecha: {
                    gte: new Date(currentDate.setHours(0, 0, 0, 0)), // Mayor o igual que el inicio del día actual
                    lt: new Date(currentDate.setHours(23, 59, 59, 999)), // Menor que el inicio del día siguiente
                },
            },
        });

        if (existingConsumption_alimento) {
            return res.status(400).json({
                message: "Ya se ingresó el consumo de agua el dia de hoy",
            });
        }

        const nuevoPeso = await prisma.consumo_de_agua.create({
            data: {
                cantidad,
                fecha: localISOTime, // Utilizar la fecha obtenida en formato ISO-8601
            },
        });

        return res.status(201).json({
            message: "Consumo de agua añadido correctamente",
        });

    } catch (error) {
        console.error("Error al añadir el consumo de agua:", error);
        return res.status(500).json({
            message: "Ocurrió un error al añadir el consumo de agua",
        });   
    }

}

export default {getWaterConsumption,postWaterConsumption}
