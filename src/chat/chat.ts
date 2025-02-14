import OpenAI from "openai"
import {config} from "../config"
import {readModelAsString} from "../utils/models"
import {createSpinner} from "nanospinner"
import kleur from "kleur"

export class Chat {
    private openai: OpenAI
    private context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
        role: 'system',
        content: `Tu es un assistant qui permet de convertir des phrases en des requêtes sql en te basant uniquement sur le model suivant : ${readModelAsString()}.
    Le dialect SQL est ${config.dialect}.
    Tu réponds par une requête SQL quand tu détectes l'intention d'écrire une requête.
    Sinon tu réponds par une phrase.`
    }]

    constructor() {
        this.openai = new OpenAI(
            {
                baseURL: config.iaHost,
                apiKey: config.iaKey
            }
        )
    }

    async createChatCompletion(): Promise<void> {
        const spinner = createSpinner('').start()
        spinner.start()
        const response = await this.openai.chat.completions.create({
            model: config.iaModelName,
            messages: this.context,
            temperature: 0
        })
        const responseMessage = response.choices[0].message
        this.context.push(responseMessage)

        spinner.success(kleur.bgGreen('Assistant SQL:'))
        console.log(kleur.green(`${response.choices[0].message.content}\n`))

    }

    pushToContext(message: OpenAI.Chat.Completions.ChatCompletionMessageParam): void {
        this.context.push(message)
    }
}
