import {sequelize} from "../utils/data-base.config";
import { QueryTypes } from 'sequelize';

export interface ExecuteQueries {
    execute: (query: string) => Promise<string>
}

export function executeQueryFactory(): ExecuteQueries {

    async function execute(query: string): Promise<string> {
        const [results]
         = await sequelize.query(query, {
            type: QueryTypes.SELECT

        })
        return results as unknown as string;
    }

    return {
        execute
    }
}
