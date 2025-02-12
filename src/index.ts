import OpenAI from 'openai';
import {readModelAsString} from "./utils/models";
import {config} from "./config";

const openai = new OpenAI(
    {
        baseURL: 'http://localhost:11434/v1',
        apiKey: 'ollama'
    }
);

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
    role: 'system',
    content: 'Tu es un assistant qui permet de convertir des phrases en des requêtes sql en te basant uniquement sur le model suivant : ' + readModelAsString()
}]

async function createChatCompletion() {
    const response = await openai.chat.completions.create({
        model: config.iaModelName,
        messages: context
    })
    const responseMessage = response.choices[0].message;
    context.push(responseMessage)

    console.log(`${response.choices[0].message.role}:\n${response.choices[0].message.content}\n`);

}

console.log("Bienvenue dans l'assistant SQL, que puis-je faire pour toi ?")
console.log("> ")

process.stdin.addListener('data', async function (input) {
    const userInput = input.toString().trim();
    context.push({
        role: 'user',
        content: userInput
    })
    await createChatCompletion();
    process.stdout.write('> ');
})


