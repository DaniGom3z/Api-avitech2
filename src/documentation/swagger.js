import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Configuración para obtener __dirname en módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Metadata
const options = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: 'Avitech API',
            version: '1.0.0'
        },
        components: {
            securitySchemes: {
                bearerAuth: {  
                    type: "apiKey",
                    name: "Token",
                    in: "header",
                },
            },
        },
    },
    apis: [
        path.resolve(__dirname, "../routes/foodConsumptionRouter.js"),
        path.resolve(__dirname, "../routes/foodRouter.js"),
        path.resolve(__dirname, "../routes/loginRouter.js"),
        path.resolve(__dirname, "../routes/profitsRouter.js"),
        path.resolve(__dirname, "../routes/userRouter.js"),
        path.resolve(__dirname, "../routes/vaccinesRouter.js"),
        path.resolve(__dirname, "../routes/waterConsumptionRouter.js"),
        path.resolve(__dirname, "../routes/weightRouter.js")
    ]
}

// Docs in JSON
const swaggerSpec = swaggerJSDoc(options);

// Function to setup
const swaggerDocs = (app, port) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  console.log(`Version 1 docs are available at http://localhost:${port}/docs`);
};

export { swaggerDocs };
