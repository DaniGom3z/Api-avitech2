export const handleConcurrent = (operation) => async (req, res, next) => {
    try {
        const result = await operation(req);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const errorHandler = (error, req, res, next) => {
    console.error(error);
    res.status(500).json({
        message: "Error en la operación",
        error: error.message
    });
};