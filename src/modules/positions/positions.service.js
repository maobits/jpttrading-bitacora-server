import axios from 'axios';
import { config } from '../../config/env.js';

const apiClient = axios.create({
    baseURL: `${config.baserowBaseURL}/database/rows/table/${config.tableId}/`,
    headers: {
        Authorization: `Token ${config.baserowToken}`,
        'Content-Type': 'application/json',
    },
});

// Obtener todas las filas
export const getAllPositions = async () => {
    const response = await apiClient.get('?user_field_names=true');
    return response.data;
};

// Obtener una fila por ID
export const getPositionById = async (rowId) => {
    const response = await apiClient.get(`${rowId}/?user_field_names=true`);
    return response.data;
};

// Crear una fila
export const createPosition = async (data) => {
    const response = await apiClient.post('?user_field_names=true', data);
    console.log(data);
    return response.data;
};

// Actualizar una fila
export const updatePosition = async (rowId, data) => {
    const response = await apiClient.patch(`${rowId}/?user_field_names=true`, data);
    return response.data;
};

// Eliminar una fila
export const deletePosition = async (rowId) => {
    await apiClient.delete(`${rowId}/`);
    return { message: 'Posición eliminada con éxito' };
};
