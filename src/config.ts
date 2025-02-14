interface Config {
    iaHost: string,
    iaKey: string,
    modelFilPath: string,
    iaModelName: string,
    logLevel: 'info' | 'debug' | 'warn' | 'error',
    dialect: 'postgres' | 'mysql' | 'sqlite'
}

export const config: Config = {
    iaHost: process.env.IA_HOST ?? '',
    iaKey: process.env.IA_KEY ?? '',
    modelFilPath: process.env.MODEL_PATH ?? '',
    iaModelName: process.env.IA_MODEL_NAME ?? '',
    logLevel: (process.env.LOG_LEVEL as 'info' | 'debug' | 'warn' | 'error') ?? 'info',
    dialect: (process.env.DIALECT as 'postgres' | 'mysql' | 'sqlite') ?? 'postgres'
}
