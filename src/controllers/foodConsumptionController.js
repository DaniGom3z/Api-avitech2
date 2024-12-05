import { PrismaClient, Prisma } from "@prisma/client";
import Joi from 'joi';


const prisma = new PrismaClient();

const addConsumptionSchema = Joi.object({
    cantidad: Joi.number().required(),
});

const getFoodConsumption = async (req, res) => {
    try {
        const consumoAlimento = await prisma.consumo_de_alimento.findMany({
            select: {
                cantidad: true,
                fecha: true
            },
            orderBy: {
                fecha: 'desc' // Ordenar por fecha descendente
            },
            take: 7
        });

        // Transformamos las fechas y preparamos los datos para las gráficas
        const datosGraficables = consumoAlimento.map(item => ({
            cantidad: item.cantidad,
            fecha: new Date(item.fecha).toISOString(),  // Convertimos a formato ISO string
            timestamp: new Date(item.fecha).getTime()  // También incluimos el timestamp para facilitar el uso
        }));

        return res.status(200).json({
            message: "Lista de consumo de alimento obtenida correctamente",
            data: datosGraficables
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al obtener la lista de Consumo de agua",
        });
    }
};

const postFoodConsumption = async (req,res) =>{
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
        const existingConsumption_alimento  = await prisma.consumo_de_alimento.findFirst({
            where: {
                fecha: {
                    gte: new Date(currentDate.setHours(0, 0, 0, 0)), // Mayor o igual que el inicio del día actual
                    lt: new Date(currentDate.setHours(23, 59, 59, 999)), // Menor que el inicio del día siguiente
                },
            },
        });

        if (existingConsumption_alimento) {
            return res.status(400).json({
                message: "Ya se ingresó el consumo de alimento el dia de hoy",
            });
        }

        const nuevoPeso = await prisma.consumo_de_alimento.create({
            data: {
                cantidad,
                fecha: localISOTime, 
            },
        });

        return res.status(201).json({
            message: "Consumo de alimento añadido correctamente",
        });

    } catch (error) {
        console.error("Error al añadir el consumo de alimento:", error);
        return res.status(500).json({
            message: "Ocurrió un error al añadir el consumo de alimento",
        });   
    }

}

export default {getFoodConsumption,postFoodConsumption}
