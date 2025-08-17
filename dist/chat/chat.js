"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = require("../config");
const nanospinner_1 = require("nanospinner");
const kleur_1 = __importDefault(require("kleur"));
class Chat {
    openai;
    context = [];
    tools = [];
    maxContextLength = 20;
    maxTokensPerMessage = 4000;
    constructor() {
        this.openai = new openai_1.default({
            baseURL: config_1.config.ai.host,
            apiKey: config_1.config.ai.apiKey
        });
    }
    trimContext() {
        // Garder toujours le message système (premier message)
        const systemMessage = this.context[0];
        let messagesToKeep = this.context.slice(1);
        // Limiter le nombre de messages
        if (messagesToKeep.length > this.maxContextLength) {
            messagesToKeep = messagesToKeep.slice(-this.maxContextLength);
        }
        // Limiter la taille des messages trop longs
        messagesToKeep = messagesToKeep.map(msg => {
            if (msg.role === 'user' && typeof msg.content === 'string' && msg.content.length > this.maxTokensPerMessage) {
                return {
                    ...msg,
                    content: msg.content.substring(0, this.maxTokensPerMessage) + '... [message tronqué]'
                };
            }
            return msg;
        });
        this.context = [systemMessage, ...messagesToKeep];
    }
    pushToContext(message) {
        this.context.push(message);
        this.trimContext();
    }
    clearContext() {
        const systemMessage = this.context[0];
        this.context = [systemMessage];
    }
    getContextLength() {
        return this.context.length;
    }
    async createChatCompletion(loaderText = 'Assistant SQL:') {
        const spinner = (0, nanospinner_1.createSpinner)('').start();
        spinner.start();
        const response = await this.openai.chat.completions.create({
            model: config_1.config.ai.model,
            messages: this.context,
            temperature: 0,
            tools: this.tools,
        });
        const responseMessage = response.choices[0].message;
        this.context.push(responseMessage);
        spinner.success(kleur_1.default.bgGreen(loaderText));
        await this.handleResponse(responseMessage);
    }
}
exports.Chat = Chat;
