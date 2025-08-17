"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWithTools = void 0;
const config_1 = require("../config");
const models_1 = require("../utils/models");
const kleur_1 = __importDefault(require("kleur"));
const functions_1 = require("../functions");
const chat_1 = require("./chat");
class ChatWithTools extends chat_1.Chat {
    constructor() {
        super();
        this.context.push({
            role: 'system',
            content: `Tu es un assistant qui permet de convertir des phrases en des requêtes sql en te basant uniquement sur le model suivant : ${(0, models_1.readModelAsString)()}.
    Le dialect SQL est ${config_1.config.dataBase.dialect}.
    Tu réponds par une requête SQL quand tu détectes l'intention d'écrire une requête.
    Proposes à l'utilisateur d'exécuter le résultat de la requête si elle est valide.
    Sinon tu réponds par une phrase.`,
        });
        this.tools?.push({
            type: 'function',
            function: {
                name: 'execute_query',
                description: 'Exécute une requête SQL et récupère le résultat.',
                parameters: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'La requête SQL à exécuter',
                        },
                    },
                    required: ['query'],
                    additionalProperties: false,
                },
                strict: true
            },
        });
    }
    async handleResponse(message) {
        if (message.tool_calls && message.tool_calls.length > 0) {
            const toolCall = message.tool_calls[0];
            const functionName = toolCall.function.name;
            const args = toolCall.function.arguments;
            const toolCallId = toolCall.id;
            await this.execute(functionName, toolCallId, args);
        }
        else {
            console.log(kleur_1.default.green(`${message.content}\n`));
        }
    }
    async execute(functionName, toolCallId, args) {
        this.pushToContext({
            role: 'tool',
            content: JSON.stringify(await (0, functions_1.call)(functionName, args)),
            tool_call_id: toolCallId,
        });
        this.pushToContext({
            role: 'user',
            content: 'Affiche le résultat de la requête'
        });
        await this.createChatCompletion('Résultat');
    }
}
exports.ChatWithTools = ChatWithTools;
