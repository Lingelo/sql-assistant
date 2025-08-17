"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicChat = void 0;
const chat_1 = require("./chat");
const models_1 = require("../utils/models");
const config_1 = require("../config");
const kleur_1 = __importDefault(require("kleur"));
class BasicChat extends chat_1.Chat {
    constructor() {
        super();
        this.context.push({
            role: 'system',
            content: `Tu es un assistant qui permet de convertir des phrases en des requêtes sql en te basant uniquement sur le model suivant : ${(0, models_1.readModelAsString)()}.
    Le dialect SQL est ${config_1.config.dataBase.dialect}.
    Tu réponds par une requête SQL quand tu détectes l'intention d'écrire une requête.
    Sinon tu réponds par une phrase.`,
        });
        delete this.tools;
    }
    async handleResponse(message) {
        console.log(kleur_1.default.green(`${message.content}\n`));
    }
}
exports.BasicChat = BasicChat;
