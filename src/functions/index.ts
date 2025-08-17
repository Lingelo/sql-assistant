import {executeQueryFactory, QueryResult} from "./execute-queries";
import { QueryTypes } from 'sequelize';
import kleur from "kleur";

function formatQueryResult(result: QueryResult, query: string): string {
    if (!result.success) {
        return kleur.red(`❌ Erreur: ${result.error}`);
    }

    const queryType = detectQueryType(query);
    let output = kleur.green(`✅ Requête exécutée avec succès`);
    
    if (result.executionTime) {
        output += kleur.gray(` (${result.executionTime}ms)`);
    }
    
    output += '\n\n';

    if (queryType === QueryTypes.SELECT && result.data && result.data.length > 0) {
        output += formatTableResults(result.data);
    } else if (result.rowsAffected !== undefined) {
        output += kleur.cyan(`📊 ${result.rowsAffected} ligne(s) affectée(s)`);
    } else if (result.data && result.data.length === 0) {
        output += kleur.yellow('📭 Aucun résultat trouvé');
    }

    return output;
}

function detectQueryType(query: string): QueryTypes {
    const normalizedQuery = query.trim().toLowerCase();
    
    if (normalizedQuery.startsWith('select')) return QueryTypes.SELECT;
    if (normalizedQuery.startsWith('insert')) return QueryTypes.INSERT;
    if (normalizedQuery.startsWith('update')) return QueryTypes.UPDATE;
    if (normalizedQuery.startsWith('delete')) return QueryTypes.DELETE;
    
    return QueryTypes.RAW;
}

function formatTableResults(data: any[]): string {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const maxWidths = headers.map(header => 
        Math.max(header.length, ...data.map(row => String(row[header] || '').length))
    );

    const headerRow = '┌' + maxWidths.map(width => 
        '─'.repeat(width + 2)
    ).join('┬') + '┐\n';
    
    const titleRow = '│ ' + headers.map((header, i) => 
        kleur.bold(header.padEnd(maxWidths[i]))
    ).join(' │ ') + ' │\n';
    
    const separatorRow = '├' + maxWidths.map(width => 
        '─'.repeat(width + 2)
    ).join('┼') + '┤\n';
    
    const dataRows = data.map(row => 
        '│ ' + headers.map((header, i) => 
            String(row[header] || '').padEnd(maxWidths[i])
        ).join(' │ ') + ' │'
    ).join('\n');

    const bottomRow = '\n└' + maxWidths.map(width => 
        '─'.repeat(width + 2)
    ).join('┴') + '┘';

    return kleur.cyan(headerRow + titleRow + separatorRow) + dataRows + kleur.cyan(bottomRow);
}

export async function call(functionName: string, args: string): Promise<string> {
    switch (functionName) {
        case "execute_query":
            const executor = executeQueryFactory();
            const query = JSON.parse(args)["query"];
            const result = await executor.execute(query);
            return formatQueryResult(result, query);
        default:
            throw new Error(`Fonction inconnue : ${functionName}`)
    }
}
