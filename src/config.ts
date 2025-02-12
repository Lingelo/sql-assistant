interface Config {
    modelFilPath: string,
    iaModelName: string,
    logLevel: 'info' | 'debug' | 'warn' | 'error',
}

export const config: Config = {
    modelFilPath: process.env.MODEL_PATH ?? '',
    iaModelName: process.env.IA_MODEL_NAME ?? '',
    logLevel: (process.env.LOG_LEVEL as 'info' | 'debug' | 'warn' | 'error') ?? 'info'
}
