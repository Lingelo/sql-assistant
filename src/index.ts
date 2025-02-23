import * as readline from "node:readline"
import kleur from "kleur"
import {sequelize} from "./utils/data-base.config";
import {ChatWithTools} from "./chat/chat-with-tools";
import {config} from "./config";
import {BasicChat} from "./chat/basic-chat";

async function start() {

    await sequelize.authenticate()
    await sequelize.sync({ force: false })

    const chat = config.mode === 'tools' ? new ChatWithTools() : new BasicChat()

    console.log(kleur.green("Bienvenue dans l'assistant SQL, que dois-je traduire ?"))
    const line = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    line.on('SIGINT', () => {
        console.log(kleur.red('Fermeture du programme ...'))
        line.close()
        process.exit(0)
    })

    function handleUserInput() {
        line.question(kleur.blue('> '), async (answer) => {
            const userInput = answer.toString().trim()
            chat.pushToContext({
                    role: 'user',
                    content: userInput
                }
            )
            await chat.createChatCompletion()
            handleUserInput()
        })
    }

    handleUserInput()
}

start()
    .then()
    .catch((error) => console.error(`${kleur.red('Erreur inconnue')} ${error}`))
