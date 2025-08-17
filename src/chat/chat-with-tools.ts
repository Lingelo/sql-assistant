import {config} from "../config"
import {readModelAsString} from "../utils/models"
import kleur from "kleur"
import * as ChatCompletionsAPI from "openai/src/resources/chat/completions";
import {call} from "../functions";
import {Chat} from "./chat";

export class ChatWithTools extends Chat {

    constructor() {
        super()
        this.context.push({
            role: 'system',
            content: `Tu es un assistant qui permet de convertir des phrases en des requêtes sql en te basant uniquement sur le model suivant : ${readModelAsString()}.
    Le dialect SQL est ${config.dataBase.dialect}.
    Tu réponds par une requête SQL quand tu détectes l'intention d'écrire une requête.
    Proposes à l'utilisateur d'exécuter le résultat de la requête si elle est valide.
    Sinon tu réponds par une phrase.`,
        })
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
        })
    }

    async handleResponse(message: ChatCompletionsAPI.ChatCompletionMessage): Promise<void> {
        if (message.tool_calls && message.tool_calls.length > 0) {
            const toolCall = message.tool_calls[0];
            const functionName = toolCall.function.name;
            const args = toolCall.function.arguments;
            const toolCallId = toolCall.id;
            await this.execute(functionName, toolCallId, args);
        } else {
            console.log(kleur.green(`${message.content}\n`));
        }
    }

    private async execute(functionName: string, toolCallId: string, args: string): Promise<void> {

        this.pushToContext(
            {
                role: 'tool',
                content: JSON.stringify(await call(functionName, args)),
                tool_call_id: toolCallId,
            }
        )

        this.pushToContext(
            {
                role: 'user',
                content: 'Affiche le résultat de la requête'
            }
        )

        await this.createChatCompletion('Résultat')
    }
}
