import {executeQueryFactory} from "./execute-queries";

export async function call(functionName: string, args: string): Promise<string> {

    switch (functionName) {
        case "execute_query":
            const fct = executeQueryFactory()
            return await fct.execute(JSON.parse(args)["query"])
        default:
            throw new Error(`Fonction inconnue : ${functionName}`)
    }
}
