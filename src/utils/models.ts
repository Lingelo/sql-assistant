import * as fs from 'fs'
import * as path from 'path'
import {config} from "../config"
import {logger} from "./logger"

export function readModelAsString(): string {
    try {
        if(!config.dataBase.modelFilePath) {
            throw new Error("Le chemin vers le fichier de modèle SQL n'est pas renseigné dans les variables d'environnement.")
        }
        return fs.readFileSync(path.resolve(config.dataBase.modelFilePath), 'utf-8')
    } catch (err) {
        logger.error(`Une érreur s'est produite en lisant le fichier SQL : ${(err as Error).message}`)
        throw err
    }
}
