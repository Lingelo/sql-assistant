import winston from 'winston'
import {config} from "../config"

export const logger = winston.createLogger({
	level: config.logLevel,
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.colorize(),
		winston.format.printf(({ timestamp, level, message }) => {
			return `${timestamp} [${level}]: ${message}`
		})
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: `${new Date().toISOString()}.log`,
		}),
	],
})
