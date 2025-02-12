import * as fs from 'fs';
import * as path from 'path';
import {config} from "../config";

export function readModelAsString(): string {
    try {
        if(!config.modelFilPath) {
            throw new Error('Model file path is not set');
        }
        return fs.readFileSync(path.resolve(config.modelFilPath), 'utf-8');
    } catch (err) {
        console.error(`Error while reading the SQL file: ${(err as Error).message}`);
        throw err;
    }
}

