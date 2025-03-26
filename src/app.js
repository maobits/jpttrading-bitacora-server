import express from "express";
import bodyParser from "body-parser";
import { config } from "./config/env.js";
import cors from "cors";
import fs from "fs";
import https from "https";
import positionsRoutes from "./modules/positions/positions.routes.js";
import yfinanceRoutes from "./modules/yfinance/yfinance.routes.js"; // Ruta para yfinance
import { validateApiKey } from "./middleware/auth.js";

const app = express();
const isProduction = false; // Cambiar a true para producción

// Middleware
app.use(bodyParser.json());

// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(
  cors({
    origin: "*", // Permite solicitudes desde cualquier origen
    methods: ["GET", "POST", "PATCH", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"], // Encabezados permitidos
  })
);

// Validar la clave de API en todas las rutas
app.use(validateApiKey);

// Rutas
app.use("/api/positions", positionsRoutes); // Rutas para las posiciones
app.use("/api/yfinance", yfinanceRoutes); // Rutas para los servicios de Yahoo Finance

// Ruta principal para verificar el estado del servidor
app.get("/", (req, res) => {
  res.json({
    message: "Servidor funcionando correctamente",
    environment: isProduction ? "Producción" : "Desarrollo",
    endpoints: {
      positions: "/api/positions",
      yfinance: "/api/yfinance",
    },
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salió mal, inténtalo de nuevo." });
});

const PORT = config.port || 3000;
const HOST = "0.0.0.0"; // Escuchar en todas las interfaces de red, incluyendo la IP pública

if (isProduction) {
  // Cargar certificados SSL solo en producción
  const sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/ttrading.shop/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/ttrading.shop/fullchain.pem"),
  };

  https.createServer(sslOptions, app).listen(PORT, HOST, () => {
    console.log(`🚀 Servidor ejecutándose en https://ttrading.shop:${PORT}`);
  });
} else {
  // Servidor HTTP en desarrollo
  app.listen(PORT, HOST, () => {
    console.log(
      `🚀 Servidor en modo desarrollo ejecutándose en http://localhost:${PORT}`
    );
  });
}
