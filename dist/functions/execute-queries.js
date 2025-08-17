"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQueryFactory = executeQueryFactory;
const data_base_config_1 = require("../utils/data-base.config");
const sequelize_1 = require("sequelize");
const logger_1 = require("../utils/logger");
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
    if (normalizedQuery.startsWith('create'))
        return sequelize_1.QueryTypes.RAW;
    if (normalizedQuery.startsWith('drop'))
        return sequelize_1.QueryTypes.RAW;
    if (normalizedQuery.startsWith('alter'))
        return sequelize_1.QueryTypes.RAW;
    return sequelize_1.QueryTypes.RAW;
}
function validateQuery(query) {
    const trimmed = query.trim();
    if (!trimmed) {
        return { isValid: false, error: 'Requête vide' };
    }
    // Vérifications de sécurité basiques
    const dangerousPatterns = [
        /;\s*(drop|truncate|delete\s+from\s+\w+\s*;)/i,
        /exec\s*\(/i,
        /sp_executesql/i,
        /xp_cmdshell/i
    ];
    for (const pattern of dangerousPatterns) {
        if (pattern.test(trimmed)) {
            return { isValid: false, error: 'Requête potentiellement dangereuse détectée' };
        }
    }
    return { isValid: true };
}
function formatResults(data, queryType) {
    if (!data || data.length === 0) {
        return 'Aucun résultat trouvé.';
    }
    if (queryType === sequelize_1.QueryTypes.SELECT) {
        const headers = Object.keys(data[0]);
        const maxWidths = headers.map(header => Math.max(header.length, ...data.map(row => String(row[header] || '').length)));
        const headerRow = '| ' + headers.map((header, i) => header.padEnd(maxWidths[i])).join(' | ') + ' |';
        const separatorRow = '|' + maxWidths.map(width => '-'.repeat(width + 2)).join('|') + '|';
        const dataRows = data.map(row => '| ' + headers.map((header, i) => String(row[header] || '').padEnd(maxWidths[i])).join(' | ') + ' |');
        return [headerRow, separatorRow, ...dataRows].join('\n');
    }
    return `${data.length} ligne(s) affectée(s).`;
}
function executeQueryFactory() {
    async function execute(query) {
        const startTime = Date.now();
        try {
            const validation = validateQuery(query);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.error
                };
            }
            const queryType = detectQueryType(query);
            logger_1.logger.info(`Exécution d'une requête ${queryType}: ${query.substring(0, 100)}...`);
            const results = await data_base_config_1.sequelize.query(query, { type: queryType });
            const executionTime = Date.now() - startTime;
            let data;
            let rowsAffected;
            if (queryType === sequelize_1.QueryTypes.SELECT) {
                data = results;
            }
            else {
                // Pour INSERT, UPDATE, DELETE, les résultats sont [undefined, metadata]
                data = [];
                rowsAffected = Array.isArray(results[1]) ? results[1].length :
                    results[1]?.affectedRows || 0;
            }
            logger_1.logger.info(`Requête exécutée avec succès en ${executionTime}ms`);
            return {
                success: true,
                data,
                rowsAffected,
                executionTime
            };
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            logger_1.logger.error('Erreur lors de l\'exécution de la requête:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue',
                executionTime
            };
        }
    }
    return { execute };
}
