import express from 'express';
import {
    getAllPositions,
    getPositionById,
    createPosition,
    updatePosition,
    deletePosition,
} from './positions.service.js';
import { validateApiKey } from '../../middleware/auth.js'; // Importa el middleware existente
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const positions = await getAllPositions();
        res.status(200).json(positions);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
