import express from "express";
import YFinanceService from "./yfinance.service.js";

const router = express.Router();

// Ruta para obtener cotización
router.get("/quote/:symbol", async (req, res) => {
    const { symbol } = req.params;
    try {
        const quote = await YFinanceService.getQuote(symbol);
        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener datos históricos
router.get("/historical/:symbol", async (req, res) => {
    const { symbol } = req.params;
    const { period } = req.query; // Ejemplo: "1mo", "3mo", etc.
    try {
        const historicalData = await YFinanceService.getHistoricalData(symbol, period);
        res.status(200).json(historicalData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Ruta para buscar activos financieros
router.get("/search", async (req, res) => {
    const { query } = req.query;
    try {
        const results = await YFinanceService.search(query);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



export default router;
