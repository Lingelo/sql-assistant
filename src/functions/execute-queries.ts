import {sequelize} from "../utils/data-base.config";
import { QueryTypes } from 'sequelize';
import {logger} from "../utils/logger";

export interface QueryResult {
    success: boolean;
    data?: any[];
    rowsAffected?: number;
    error?: string;
    executionTime?: number;
}

export interface ExecuteQueries {
    execute: (query: string) => Promise<QueryResult>
}

function detectQueryType(query: string): QueryTypes {
    const normalizedQuery = query.trim().toLowerCase();
    
    if (normalizedQuery.startsWith('select')) return QueryTypes.SELECT;
    if (normalizedQuery.startsWith('insert')) return QueryTypes.INSERT;
    if (normalizedQuery.startsWith('update')) return QueryTypes.UPDATE;
    if (normalizedQuery.startsWith('delete')) return QueryTypes.DELETE;
    if (normalizedQuery.startsWith('create')) return QueryTypes.RAW;
    if (normalizedQuery.startsWith('drop')) return QueryTypes.RAW;
    if (normalizedQuery.startsWith('alter')) return QueryTypes.RAW;
    
    return QueryTypes.RAW;
}

function validateQuery(query: string): { isValid: boolean; error?: string } {
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

function formatResults(data: any[], queryType: QueryTypes): string {
    if (!data || data.length === 0) {
        return 'Aucun résultat trouvé.';
    }

    if (queryType === QueryTypes.SELECT) {
        const headers = Object.keys(data[0]);
        const maxWidths = headers.map(header => 
            Math.max(header.length, ...data.map(row => String(row[header] || '').length))
        );

        const headerRow = '| ' + headers.map((header, i) => 
            header.padEnd(maxWidths[i])
        ).join(' | ') + ' |';
        
        const separatorRow = '|' + maxWidths.map(width => 
            '-'.repeat(width + 2)
        ).join('|') + '|';
        
        const dataRows = data.map(row => 
            '| ' + headers.map((header, i) => 
                String(row[header] || '').padEnd(maxWidths[i])
            ).join(' | ') + ' |'
        );

        return [headerRow, separatorRow, ...dataRows].join('\n');
    }

    return `${data.length} ligne(s) affectée(s).`;
}

export function executeQueryFactory(): ExecuteQueries {
    async function execute(query: string): Promise<QueryResult> {
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
            logger.info(`Exécution d'une requête ${queryType}: ${query.substring(0, 100)}...`);

            const results = await sequelize.query(query, { type: queryType });
            const executionTime = Date.now() - startTime;

            let data: any[];
            let rowsAffected: number | undefined;

            if (queryType === QueryTypes.SELECT) {
                data = results as any[];
            } else {
                // Pour INSERT, UPDATE, DELETE, les résultats sont [undefined, metadata]
                data = [];
                rowsAffected = Array.isArray(results[1]) ? results[1].length : 
                              (results[1] as any)?.affectedRows || 0;
            }

            logger.info(`Requête exécutée avec succès en ${executionTime}ms`);

            return {
                success: true,
                data,
                rowsAffected,
                executionTime
            };

        } catch (error) {
            const executionTime = Date.now() - startTime;
            logger.error('Erreur lors de l\'exécution de la requête:', error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue',
                executionTime
            };
        }
    }

    return { execute };
}
