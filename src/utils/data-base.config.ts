import {Sequelize} from "sequelize";
import {config} from "../config";

export const sequelize = new Sequelize(
    config.dataBase.database, config.dataBase.username, config.dataBase.password, {
        host: config.dataBase.host,
        dialect: config.dataBase.dialect,
        logging: false,
    }
)
