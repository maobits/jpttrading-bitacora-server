import axios from "axios";
import { config } from "../../config/env.js";

const apiClient = axios.create({
  baseURL: `${config.baserowBaseURL}/database/rows/table/${config.tableId}/`,
  headers: {
    Authorization: `Token ${config.baserowToken}`,
    "Content-Type": "application/json",
  },
});

// Obtener todas las posiciones activas
export const getAllActivePositions = async () => {
  console.log("📥 Solicitando todas las posiciones activas...");
  try {
    const response = await apiClient.get(
      "?user_field_names=true&filters=%7B%22filter_type%22%3A%22AND%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22boolean%22%2C%22field%22%3A%22State%22%2C%22value%22%3A%221%22%7D%5D%2C%22groups%22%3A%5B%5D%7D"
    );
    console.log("✅ Posiciones activas obtenidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener posiciones activas:", error);
    throw error;
  }
};

// Obtener todas las posiciones cerradas
export const getAllClosedPositions = async () => {
  console.log("📥 Solicitando todas las posiciones cerradas...");
  try {
    const response = await apiClient.get(
      "?user_field_names=true&filters=%7B%22filter_type%22%3A%22AND%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22boolean%22%2C%22field%22%3A%22State%22%2C%22value%22%3A%220%22%7D%5D%2C%22groups%22%3A%5B%5D%7D"
    );
    console.log("✅ Posiciones cerradas obtenidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener posiciones cerradas:", error);
    throw error;
  }
};

// Obtener todas las posiciones cerradas con filtro de antigüedad en meses
export const getClosedPositionsWithFilter = async (months) => {
  console.log(
    `📥 Solicitando posiciones cerradas (filtro: ${
      months === 13 ? "YTD Q1 (Ene-Mar)" : `últimos ${months} meses`
    })...`
  );

  try {
    const url = `?user_field_names=true&filters=%7B%22filter_type%22%3A%22AND%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22boolean%22%2C%22field%22%3A%22State%22%2C%22value%22%3A%220%22%7D%5D%2C%22groups%22%3A%5B%5D%7D`;

    const response = await apiClient.get(url);
    const allPositions = response.data?.results || [];

    const today = new Date();
    const year = today.getFullYear();
    const monthSet = new Set();

    if (months === 13) {
      // ✅ YTD (Ene-Mar)
      ["01", "02", "03"].forEach((m) => {
        monthSet.add(`${year}-${m}`);
      });
    } else {
      // 🔁 Últimos N meses desde hoy
      for (let i = 0; i < months; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        monthSet.add(key);
      }
    }

    const filtered = allPositions.filter((position) => {
      const closingDate = position.ClosingDate;
      if (!closingDate) return false;

      const dateObj = new Date(closingDate);
      const key = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      return monthSet.has(key);
    });

    console.log(
      `✅ Posiciones filtradas (${filtered.length}) [DEBUG]:`,
      filtered
    );
    return { count: filtered.length, results: filtered };
  } catch (error) {
    console.error(
      "❌ Error al obtener posiciones cerradas con filtro:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Obtener una posición por ID
export const getPositionById = async (rowId) => {
  console.log(`📥 Obteniendo posición con ID: ${rowId}`);
  try {
    const response = await apiClient.get(`${rowId}/?user_field_names=true`);
    console.log("✅ Datos de la posición obtenidos:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al obtener la posición con ID ${rowId}:`, error);
    throw error;
  }
};

// Crear una nueva posición
export const createPosition = async (data) => {
  console.log("📤 Enviando datos para crear una nueva posición:", data);
  try {
    const response = await apiClient.post("?user_field_names=true", data);
    console.log("✅ Posición creada con éxito:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear la posición:", error);
    throw error;
  }
};

// Actualizar una posición existente
export const updatePosition = async (rowId, data) => {
  console.log(
    `📤 Enviando datos para actualizar la posición con ID ${rowId}:`,
    data
  );
  try {
    const response = await apiClient.patch(
      `${rowId}/?user_field_names=true`,
      data
    );
    console.log("✅ Posición actualizada con éxito:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al actualizar la posición con ID ${rowId}:`, error);
    throw error;
  }
};

// Eliminar una posición
export const deletePosition = async (rowId) => {
  console.log(`🗑️ Eliminando la posición con ID ${rowId}...`);
  try {
    await apiClient.delete(`${rowId}/`);
    console.log(`✅ Posición con ID ${rowId} eliminada con éxito.`);
    return { message: "Posición eliminada con éxito" };
  } catch (error) {
    console.error(`❌ Error al eliminar la posición con ID ${rowId}:`, error);
    throw error;
  }
};
