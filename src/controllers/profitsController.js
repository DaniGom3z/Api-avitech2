import { PrismaClient } from "@prisma/client";
import Joi from 'joi';

const prisma = new PrismaClient();

const showWeightGains = async (req, res) => {
    try {
        const { id_alimento } = req.params;

        // Validar el ID del alimento
        const schema = Joi.object({
            id_alimento: Joi.number().integer().required(),
        });

        const { error } = schema.validate({ id_alimento });
        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                error: error.details[0].message,
            });
        }

        // Obtener el alimento específico con las fechas asociadas
        const alimento = await prisma.alimentos.findUnique({
            where: {
                id: Number(id_alimento),
            },
            select: {
                nombre: true,
                fechaInicial: true,
                fechaFinal: true,
            },
        });

        if (!alimento) {
            return res.status(404).json({
                message: "No se encontró el alimento con el ID proporcionado",
            });
        }

        // Convertir las fechas a objetos de tipo Date
        const fechaInicialDate = new Date(alimento.fechaInicial);
        const fechaFinalDate = new Date(alimento.fechaFinal);

        // Obtener todos los pesos registrados dentro del rango de fechas del alimento
        const pesos = await prisma.pesos.findMany({
            where: {
                fecha: {
                    gte: fechaInicialDate,
                    lte: fechaFinalDate,
                }
            },
            orderBy: {
                fecha: 'asc'
            },
        });

        // Calcular la ganancia de peso total
        let totalGananciaPeso = 0;
        if (pesos.length > 1) {
            const pesoInicial = pesos[0].peso;
            const pesoFinal = pesos[pesos.length - 1].peso;
            totalGananciaPeso = pesoFinal - pesoInicial;
        }

        return res.status(200).json({
            message: "Ganancias de peso obtenidas correctamente",
            nombreAlimento: alimento.nombre,
            totalGananciaPeso,
        });

    } catch (error) {
        console.error("Error al mostrar ganancias de peso:", error);
        return res.status(500).json({
            message: "Ocurrió un error al mostrar las ganancias de peso",
        });
    }
};

export default {
    showWeightGains
};
