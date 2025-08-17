"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = call;
const execute_queries_1 = require("./execute-queries");
const sequelize_1 = require("sequelize");
const kleur_1 = __importDefault(require("kleur"));
function formatQueryResult(result, query) {
    if (!result.success) {
        return kleur_1.default.red(`❌ Erreur: ${result.error}`);
    }
    const queryType = detectQueryType(query);
    let output = kleur_1.default.green(`✅ Requête exécutée avec succès`);
    if (result.executionTime) {
        output += kleur_1.default.gray(` (${result.executionTime}ms)`);
    }
    output += '\n\n';
    if (queryType === sequelize_1.QueryTypes.SELECT && result.data && result.data.length > 0) {
        output += formatTableResults(result.data);
    }
    else if (result.rowsAffected !== undefined) {
        output += kleur_1.default.cyan(`📊 ${result.rowsAffected} ligne(s) affectée(s)`);
    }
    else if (result.data && result.data.length === 0) {
        output += kleur_1.default.yellow('📭 Aucun résultat trouvé');
    }
    return output;
}
function detectQueryType(query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.startsWith('select'))
        return sequelize_1.QueryTypes.SELECT;
    if (normalizedQuery.startsWith('insert'))
        return sequelize_1.QueryTypes.INSERT;
    if (normalizedQuery.startsWith('update'))
        return sequelize_1.QueryTypes.UPDATE;
    if (normalizedQuery.startsWith('delete'))
        return sequelize_1.QueryTypes.DELETE;
    return sequelize_1.QueryTypes.RAW;
}
function formatTableResults(data) {
    if (!data || data.length === 0)
        return '';
    const headers = Object.keys(data[0]);
    const maxWidths = headers.map(header => Math.max(header.length, ...data.map(row => String(row[header] || '').length)));
    const headerRow = '┌' + maxWidths.map(width => '─'.repeat(width + 2)).join('┬') + '┐\n';
    const titleRow = '│ ' + headers.map((header, i) => kleur_1.default.bold(header.padEnd(maxWidths[i]))).join(' │ ') + ' │\n';
    const separatorRow = '├' + maxWidths.map(width => '─'.repeat(width + 2)).join('┼') + '┤\n';
    const dataRows = data.map(row => '│ ' + headers.map((header, i) => String(row[header] || '').padEnd(maxWidths[i])).join(' │ ') + ' │').join('\n');
    const bottomRow = '\n└' + maxWidths.map(width => '─'.repeat(width + 2)).join('┴') + '┘';
    return kleur_1.default.cyan(headerRow + titleRow + separatorRow) + dataRows + kleur_1.default.cyan(bottomRow);
}
async function call(functionName, args) {
    switch (functionName) {
        case "execute_query":
            const executor = (0, execute_queries_1.executeQueryFactory)();
            const query = JSON.parse(args)["query"];
            const result = await executor.execute(query);
            return formatQueryResult(result, query);
        default:
            throw new Error(`Fonction inconnue : ${functionName}`);
    }
}
