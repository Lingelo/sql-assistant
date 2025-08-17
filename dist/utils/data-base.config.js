"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
exports.sequelize = new sequelize_1.Sequelize(config_1.config.dataBase.database, config_1.config.dataBase.username, config_1.config.dataBase.password, {
    host: config_1.config.dataBase.host,
    dialect: config_1.config.dataBase.dialect,
    logging: false,
});
