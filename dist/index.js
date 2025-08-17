"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("node:readline"));
const kleur_1 = __importDefault(require("kleur"));
const data_base_config_1 = require("./utils/data-base.config");
const chat_with_tools_1 = require("./chat/chat-with-tools");
const config_1 = require("./config");
const basic_chat_1 = require("./chat/basic-chat");
const logger_1 = require("./utils/logger");
async function validateEnvironment() {
    const requiredEnvVars = ['IA_HOST', 'IA_KEY', 'IA_MODEL_NAME'];
    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingVars.length > 0) {
        throw new Error(`Variables d'environnement manquantes: ${missingVars.join(', ')}`);
    }
    if (config_1.config.mode === 'tools') {
        const dbRequiredVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
        const missingDbVars = dbRequiredVars.filter(envVar => !process.env[envVar]);
        if (missingDbVars.length > 0) {
            throw new Error(`Variables de base de données manquantes: ${missingDbVars.join(', ')}`);
        }
    }
}
async function initializeDatabase() {
    try {
        await data_base_config_1.sequelize.authenticate();
        logger_1.logger.info('Connexion à la base de données établie avec succès');
        await data_base_config_1.sequelize.sync({ force: false });
        logger_1.logger.info('Synchronisation de la base de données terminée');
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    }
}
async function start() {
    try {
        await validateEnvironment();
        logger_1.logger.info(`Démarrage en mode: ${config_1.config.mode}`);
        if (config_1.config.mode === 'tools') {
            await initializeDatabase();
        }
        const chat = config_1.config.mode === 'tools' ? new chat_with_tools_1.ChatWithTools() : new basic_chat_1.BasicChat();
        console.log(kleur_1.default.green("Bienvenue dans l'assistant SQL, que dois-je traduire ?"));
        const line = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        line.on('SIGINT', () => {
            console.log(kleur_1.default.red('Fermeture du programme ...'));
            line.close();
            process.exit(0);
        });
        function handleSystemCommand(command) {
            switch (command.toLowerCase()) {
                case '/help':
                    console.log(kleur_1.default.cyan(`
📚 Commandes disponibles:
  /help     - Affiche cette aide
  /clear    - Vide l'historique de conversation
  /context  - Affiche le nombre de messages en contexte
  /exit     - Quitte l'application
  
💡 Utilisation:
  Tapez votre question en français et l'assistant génèrera une requête SQL.
  En mode 'tools', les requêtes peuvent être exécutées automatiquement.
                    `));
                    return true;
                case '/clear':
                    chat.clearContext();
                    console.log(kleur_1.default.green('✅ Historique de conversation vidé'));
                    return true;
                case '/context':
                    console.log(kleur_1.default.cyan(`📊 Contexte: ${chat.getContextLength()} messages`));
                    return true;
                case '/exit':
                    console.log(kleur_1.default.green('👋 Au revoir !'));
                    process.exit(0);
                    return true;
                default:
                    return false;
            }
        }
        function handleUserInput() {
            line.question(kleur_1.default.blue('> '), async (answer) => {
                try {
                    const userInput = answer.toString().trim();
                    if (!userInput) {
                        handleUserInput();
                        return;
                    }
                    // Vérifier si c'est une commande système
                    if (userInput.startsWith('/')) {
                        if (handleSystemCommand(userInput)) {
                            handleUserInput();
                            return;
                        }
                        else {
                            console.log(kleur_1.default.yellow('❓ Commande inconnue. Tapez /help pour voir les commandes disponibles.'));
                            handleUserInput();
                            return;
                        }
                    }
                    chat.pushToContext({
                        role: 'user',
                        content: userInput
                    });
                    await chat.createChatCompletion();
                }
                catch (error) {
                    logger_1.logger.error('Erreur lors du traitement de l\'entrée utilisateur:', error);
                    console.log(kleur_1.default.red('Erreur lors du traitement de votre demande. Veuillez réessayer.'));
                }
                handleUserInput();
            });
        }
        handleUserInput();
    }
    catch (error) {
        logger_1.logger.error('Erreur fatale lors du démarrage:', error);
        console.error(kleur_1.default.red(`Erreur fatale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`));
        process.exit(1);
    }
}
start();
