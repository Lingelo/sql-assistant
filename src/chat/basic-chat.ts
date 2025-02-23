import {Chat} from "./chat";
import {readModelAsString} from "../utils/models";
import {config} from "../config";
import * as ChatCompletionsAPI from "openai/src/resources/chat/completions";
import kleur from "kleur";

export class BasicChat extends Chat {
    constructor() {
        super()
        this.context.push({
            role: 'system',
            content: `Tu es un assistant qui permet de convertir des phrases en des requêtes sql en te basant uniquement sur le model suivant : ${readModelAsString()}.
    Le dialect SQL est ${config.dataBase.dialect}.
    Tu réponds par une requête SQL quand tu détectes l'intention d'écrire une requête.
    Sinon tu réponds par une phrase.`,
        })
        delete this.tools
    }

    async handleResponse(message: ChatCompletionsAPI.ChatCompletionMessage): Promise<void> {
        console.log(kleur.green(`${message.content}\n`))
    }
}
