import yahooFinance from "yahoo-finance2"; // Importar la librería yahoo-finance2
import fs from "fs"; // Importación del módulo fs

const YFinanceService = {
    // Obtener cotización actual
    async getQuote(symbol) {
        try {
            const data = await yahooFinance.quote(symbol);
            return {
                symbol: data.symbol,
                price: data.regularMarketPrice,
                currency: data.currency,
                marketTime: new Date(data.regularMarketTime * 1000).toLocaleString(),
            };
        } catch (error) {
            console.error(`Error al obtener cotización para ${symbol}:`, error.message);
            throw new Error("No se pudo obtener la cotización.");
        }
    },

    // Obtener datos históricos
    async getHistoricalData(symbol, period = "1mo") {
        try {
            // Calcula las fechas basadas en el periodo proporcionado
            const today = new Date();
            const period1 = new Date();

            if (period === "1mo") {
                period1.setMonth(today.getMonth() - 1);
            } else if (period === "3mo") {
                period1.setMonth(today.getMonth() - 3);
            } else if (period === "1y") {
                period1.setFullYear(today.getFullYear() - 1);
            } else {
                throw new Error("Período no soportado. Usa '1mo', '3mo', o '1y'.");
            }

            // Realiza la solicitud con el rango de fechas calculado
            const data = await yahooFinance.historical(symbol, {
                period1: period1.toISOString().split("T")[0], // Fecha inicial en formato "YYYY-MM-DD"
                period2: today.toISOString().split("T")[0], // Fecha final en formato "YYYY-MM-DD"
                interval: "1d", // Intervalo diario
            });

            return data;
        } catch (error) {
            console.error(`Error al obtener datos históricos para ${symbol}:`, error.message);
            throw new Error("No se pudieron obtener los datos históricos.");
        }
    },


    // Buscar activos financieros
    async search(query) {
        try {
            const data = await yahooFinance.search(query);
            return data.quotes;
        } catch (error) {
            console.error(`Error al buscar "${query}":`, error.message);
            throw new Error("No se pudo completar la búsqueda.");
        }
    },



};

export default YFinanceService;
