import { workerPool } from '../workers/workerPool.js';
import Joi from 'joi';

// Esquemas de validación
const addFoodSchema = Joi.object({
    nombre: Joi.string().required(),
    precio: Joi.number().required(),
    cantidad: Joi.number().required(),
    fechaInicial: Joi.date().iso(),
    fechaFinal: Joi.date().iso()
});

const updateFoodSchema = Joi.object({
    fechaInicial: Joi.date(),
    fechaFinal: Joi.date().iso(),
});

const deleteFoodSchema = Joi.object({
    id: Joi.number().required(),
});

const getByIdFoodSchema = Joi.object({
    id: Joi.number().required(),
});

// Controladores
const addFood = async (req) => {
    const { error, value } = addFoodSchema.validate(req.body);
    if (error) {
        throw new Error(error.details[0].message);
    }

    const { nombre, precio, cantidad,fechaInicial } = value;

    const existingFood = await workerPool.executeTask('alimentos', 'findFirst', {
        where: { nombre },
    });

    if (existingFood) {
        throw new Error("Ya existe un alimento con este nombre");
    }

    const currentDate = new Date();
    const offset = -currentDate.getTimezoneOffset();
    const createdAt = new Date(currentDate.getTime() + offset * 60 * 1000)
        .toISOString()
        .split('.')[0] + 'Z';

    await workerPool.executeTask('alimentos', 'create', {
        data: {
            nombre,
            precio,
            cantidad,
            createdAt,
            fechaInicial
        },
    });

    return {
        message: "Alimento añadido correctamente",
    };
};

const updateFood = async (req) => {
    const id = parseInt(req.params.id);
    const { error, value } = updateFoodSchema.validate(req.body);
    if (error) {
        throw new Error(error.details[0].message);
    }

    const { fechaInicial, fechaFinal } = value;

    const currentDate = new Date();
    const offset = -currentDate.getTimezoneOffset();
    const updateAt = new Date(currentDate.getTime() + offset * 60 * 1000)
        .toISOString()
        .split('.')[0] + 'Z';

    await workerPool.executeTask('alimentos', 'update', {
        where: { id },
        data: {
            fechaInicial,
            fechaFinal,
            updateAt,
        },
    });

    return {
        message: "Alimento actualizado correctamente",
    };
};

const deleteFood = async (req) => {
    const { error, value } = deleteFoodSchema.validate(req.params);
    if (error) {
        throw new Error(error.details[0].message);
    }

    const { id } = value;

    await workerPool.executeTask('alimentos', 'delete', {
        where: { id },
    });

    return {
        message: "Alimento eliminado correctamente",
    };
};

const getAllFood = async (req) => {
    const alimentos = await workerPool.executeTask('alimentos', 'findMany', {
        select: {
            id: true,
            nombre: true,
            precio: true,
            cantidad: true,
            fechaInicial: true,
            fechaFinal: true,
        },
    });

    return {
        message: "Lista de alimentos obtenida correctamente",
        alimentos,
    };
};

const getById = async (req) => {
    const { error, value } = getByIdFoodSchema.validate(req.params);
    if (error) {
        throw new Error(error.details[0].message);
    }

    const { id } = value;

    const alimento = await workerPool.executeTask('alimentos', 'findUnique', {
        where: { id },
        select: {
            id: true,
            nombre: true,
            precio: true,
            cantidad: true,
            fechaInicial: true,
            fechaFinal: true,
        },
    });

    return {
        message: "Alimento obtenido correctamente",
        alimento,
    };
};

export default {
    addFood,
    updateFood,
    deleteFood,
    getAllFood,
    getById,
};
