import express from 'express';
import {
    getAllActivePositions,
    getAllClosedPositions,
    getClosedPositionsWithFilter,
    getPositionById,
    createPosition,
    updatePosition,
    deletePosition,
} from './positions.service.js';
import { validateApiKey } from '../../middleware/auth.js'; // Importa el middleware existente
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const positions = await getAllActivePositions();
        res.status(200).json(positions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/closed-positions', async (req, res) => {
    try {
        const positions = await getAllClosedPositions();
        res.status(200).json(positions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/closed-positions-with-filter', async (req, res) => {
    try {
        // 🔹 Obtener el número de meses desde los parámetros de consulta
        const { months } = req.query;

        // 🔹 Validar que se haya proporcionado un número de meses válido
        if (!months || isNaN(months) || months <= 0) {
            return res.status(400).json({ error: "El parámetro 'months' es requerido y debe ser un número positivo." });
        }

        console.log(`📥 Solicitando posiciones cerradas de los últimos ${months} meses...`);

        // 🔹 Llamar a la función con el número de meses
        const positions = await getClosedPositionsWithFilter(Number(months));

        res.status(200).json(positions);
    } catch (error) {
        console.error("❌ Error en el endpoint '/closed-positions-with-filter':", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



router.get('/:id', async (req, res) => {
    try {
        const position = await getPositionById(req.params.id);
        res.status(200).json(position);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newPosition = await createPosition(req.body);
        res.status(201).json(newPosition);
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedPosition = await updatePosition(req.params.id, req.body);
        res.status(200).json(updatedPosition);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const message = await deletePosition(req.params.id);
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', validateApiKey, (req, res) => {
    // Si el middleware pasa, la clave de API es válida
    const apiKey = req.headers['x-api-key'];

    return res.status(200).json({
        code: 'API_KEY_VALID',
        message: 'La clave de API es válida.',
        token: apiKey, // Devuelve el token validado
    });
});

export default router;
