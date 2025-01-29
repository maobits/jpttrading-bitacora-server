import { config } from '../config/env.js';

export const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Obtén la API key desde el encabezado

    if (!apiKey) {
        // Devuelve error si no se proporciona la clave
        return res.status(401).json({
            code: 'API_KEY_MISSING',
            message: 'La clave de API es requerida.',
        });
    }

    // Validar si la clave coincide con alguna de las válidas
    const isReadKey = apiKey === config.apiKeyRead;
    const isWriteKey = apiKey === config.apiKeyWrite;

    if (!isReadKey && !isWriteKey) {
        // Devuelve error si la clave no coincide con ninguna
        return res.status(403).json({
            code: 'API_KEY_INVALID',
            message: 'La clave de API proporcionada no es válida.',
        });
    }

    // Si la ruta es POST (escritura) y la clave es solo de lectura
    if (req.method === 'POST' && isReadKey) {
        return res.status(403).json({
            code: 'API_KEY_READ_ONLY',
            message: 'La clave de API no tiene permisos de escritura.',
        });
    }

    // Si todo está correcto, continúa al siguiente middleware o ruta
    next();
};
