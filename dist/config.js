"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    ai: {
        host: process.env.IA_HOST ?? '',
        apiKey: process.env.IA_KEY ?? '',
        model: process.env.IA_MODEL_NAME ?? '',
    },
    logs: {
        level: process.env.LOG_LEVEL ?? 'info',
    },
    dataBase: {
        host: process.env.DB_HOST ?? '',
        port: parseInt(process.env.DB_PORT ?? '0', 10),
        username: process.env.DB_USERNAME ?? '',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_DATABASE ?? '',
        modelFilePath: process.env.MODEL_PATH ?? '',
        dialect: process.env.DIALECT ?? 'postgres',
    },
    mode: process.env.MODE ?? 'chat'
};
