import OpenAI from 'openai'
import {readModelAsString} from "./utils/models"
import {config} from "./config"
import * as readline from "node:readline"
import kleur from "kleur"
import {createSpinner} from "nanospinner"


const openai = new OpenAI(
    {
        baseURL: 'http://localhost:11434/v1',
        apiKey: 'ollama'
    }
)

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
    role: 'system',
    content: `Tu es un assistant qui permet de convertir des phrases en des requêtes sql en te basant uniquement sur le model suivant : ${readModelAsString()} tu ne réponds que par une requête sql`
}]

async function createChatCompletion() {
    const spinner = createSpinner('').start()
    spinner.start()
    const response = await openai.chat.completions.create({
        model: config.iaModelName,
        messages: context,
        temperature: 0
    })
    const responseMessage = response.choices[0].message
    context.push(responseMessage)

    spinner.success(kleur.bgGreen('Assistant SQL:'))
    console.log(kleur.green(`${response.choices[0].message.content}\n`))

}

console.log(kleur.green("Bienvenue dans l'assistant SQL, que dois-je traduire ?"))

const line = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function handleUserInput() {
    line.question(kleur.blue('> '), async (answer) => {
        const userInput = answer.toString().trim()
        context.push({
            role: 'user',
            content: userInput
        })
        await createChatCompletion()
        handleUserInput()
    })
}

handleUserInput()

line.on('SIGINT', () => {
    console.log(kleur.red('Fermeture du programme ...'))
    line.close()
    process.exit(0)
})
