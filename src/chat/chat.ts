import OpenAI from "openai";
import {config} from "../config";
import {createSpinner} from "nanospinner";
import kleur from "kleur";
import * as ChatCompletionsAPI from "openai/src/resources/chat/completions";
import {ChatCompletionTool} from "openai/src/resources/chat/completions";

export abstract class Chat {
    protected openai: OpenAI
    protected context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
    protected tools?: Array<ChatCompletionTool> = []
    private readonly maxContextLength = 20
    private readonly maxTokensPerMessage = 4000

    protected constructor() {
        this.openai = new OpenAI(
            {
                baseURL: config.ai.host,
                apiKey: config.ai.apiKey
            }
        )
    }

    protected abstract handleResponse(message: ChatCompletionsAPI.ChatCompletionMessage): Promise<void>

    private trimContext(): void {
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

    public pushToContext(message: OpenAI.Chat.Completions.ChatCompletionMessageParam): void {
        this.context.push(message);
        this.trimContext();
    }

    public clearContext(): void {
        const systemMessage = this.context[0];
        this.context = [systemMessage];
    }

    public getContextLength(): number {
        return this.context.length;
    }

    public async createChatCompletion(loaderText: string = 'Assistant SQL:'): Promise<void> {
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

        spinner.success(kleur.bgGreen(loaderText))
        await this.handleResponse(responseMessage)

    }

}
