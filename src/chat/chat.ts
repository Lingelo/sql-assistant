import OpenAI from "openai"
import {config} from "../config"
import {readModelAsString} from "../utils/models"
import {createSpinner} from "nanospinner"
import kleur from "kleur"
import * as ChatCompletionsAPI from "openai/src/resources/chat/completions";
import {ChatCompletionTool} from "openai/src/resources/chat/completions";
import {call} from "../functions";

export class Chat {
    private openai: OpenAI
    private context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
        role: 'system',
        content: `Tu es un assistant qui permet de convertir des phrases en des requêtes sql en te basant uniquement sur le model suivant : ${readModelAsString()}.
    Le dialect SQL est ${config.dataBase.dialect}.
    Tu réponds par une requête SQL quand tu détectes l'intention d'écrire une requête.
    Sinon tu réponds par une phrase.`,
    }]


    private tools: Array<ChatCompletionTool> = [
        {
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
        },
    ]


    constructor() {
        this.openai = new OpenAI(
            {
                baseURL: config.ai.host,
                apiKey: config.ai.apiKey
            }
        )
    }

    async createChatCompletion(): Promise<void> {
        const spinner = createSpinner('').start()
        spinner.start()
        const response = await this.openai.chat.completions.create({
            model: config.ai.model,
            messages: this.context,
            temperature: 0,
            tools: this.tools,
        })
        const responseMessage = response.choices[0].message
        this.context.push(responseMessage)

        spinner.success(kleur.bgGreen('Assistant SQL:'))
        await this.handleResponse(responseMessage)


    }

    pushToContext(message: OpenAI.Chat.Completions.ChatCompletionMessageParam): void {
        this.context.push(message)
    }

    private async handleResponse(message: ChatCompletionsAPI.ChatCompletionMessage): Promise<void> {
        if (message.tool_calls) {
            const functionName = message.tool_calls[0].function.name;
            // @ts-ignore
            const query = message.tool_calls[0].function.arguments;
            const toolCallId = message.tool_calls[0].id
            await this.execute(functionName, toolCallId, query)

        } else {
            console.log(kleur.green(`${message.content}\n`))
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
        console.log(kleur.green(`Requête valide! Demandez moi le résultat si vous le voulez\n`))
    }
}
