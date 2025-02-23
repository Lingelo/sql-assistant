interface Config {
    ai : {
        host: string,
        apiKey: string,
        model: string,
    }
    logs: {
        level: 'info' | 'debug' | 'warn' | 'error',
    },
    dataBase: {
        host: string,
        port: number,
        username: string,
        password: string,
        database: string,
        modelFilePath: string
        dialect: 'postgres' | 'mysql' | 'sqlite'
    },
    mode: 'tools' | 'chat'
}

export const config: Config = {
    ai: {
        host: process.env.IA_HOST ?? '',
        apiKey: process.env.IA_KEY ?? '',
        model: process.env.IA_MODEL_NAME ?? '',
    },
    logs: {
        level: (process.env.LOG_LEVEL as 'info' | 'debug' | 'warn' | 'error') ?? 'info',
    },
    dataBase: {
        host: process.env.DB_HOST ?? '',
        port: parseInt(process.env.DB_PORT ?? '0', 10),
        username: process.env.DB_USERNAME ?? '',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_DATABASE ?? '',
        modelFilePath: process.env.MODEL_PATH ?? '',
        dialect: (process.env.DIALECT as 'postgres' | 'mysql' | 'sqlite') ?? 'postgres',
    },
    mode: (process.env.MODE as 'tools' | 'chat') ?? 'chat'

}
