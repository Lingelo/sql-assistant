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

    protected constructor() {
        this.openai = new OpenAI(
            {
                baseURL: config.ai.host,
                apiKey: config.ai.apiKey
            }
        )
    }

    protected abstract handleResponse(message: ChatCompletionsAPI.ChatCompletionMessage): Promise<void>

    public pushToContext(message: OpenAI.Chat.Completions.ChatCompletionMessageParam): void {
        this.context.push(message)
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
