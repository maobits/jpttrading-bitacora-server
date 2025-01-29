import { config } from '../../config/env.js';

export const validateToken = (req, res, next) => {
    const clientToken = req.headers['authorization']; // Se espera un encabezado Authorization

    if (!clientToken) {
        return res.status(401).json({
            code: 'TOKEN_MISSING',
            message: 'El token de autorización es requerido.',
        });
    }

    if (clientToken !== config.baserowToken) {
        return res.status(403).json({
            code: 'TOKEN_INVALID',
            message: 'El token de autorización es inválido.',
        });
    }

    // Si el token es válido
    res.status(200).json({
        code: 'TOKEN_VALID',
        message: 'El token es válido.',
    });
};
