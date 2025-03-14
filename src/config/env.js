import dotenv from 'dotenv';

dotenv.config();

export const config = {
    baserowToken: process.env.BASEROW_TOKEN || 'XZd3Vf92JgNAn0UMGUM1MoK19TwNeKoT',
    baserowBaseURL: 'https://api.baserow.io/api',
    tableId: 413946, // Cambia este valor si usas otro ID de tabla
    apiKeyWrite: process.env.API_KEY_WRITE || 'cd47f0e1-9a6b-4d52-a7d3-849a84e13a21',
    apiKeyRead: process.env.API_KEY_READ || '12345678-9abc-def0-1234-56789abcdef0',
};
