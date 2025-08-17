import * as readline from "node:readline"
import kleur from "kleur"
import {sequelize} from "./utils/data-base.config";
import {ChatWithTools} from "./chat/chat-with-tools";
import {config} from "./config";
import {BasicChat} from "./chat/basic-chat";
import {logger} from "./utils/logger";

async function validateEnvironment(): Promise<void> {
    const requiredEnvVars = ['IA_HOST', 'IA_KEY', 'IA_MODEL_NAME'];
    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingVars.length > 0) {
        throw new Error(`Variables d'environnement manquantes: ${missingVars.join(', ')}`);
    }

    if (config.mode === 'tools') {
        const dbRequiredVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
        const missingDbVars = dbRequiredVars.filter(envVar => !process.env[envVar]);
        
        if (missingDbVars.length > 0) {
            throw new Error(`Variables de base de données manquantes: ${missingDbVars.join(', ')}`);
        }
    }
}

async function initializeDatabase(): Promise<void> {
    try {
        await sequelize.authenticate();
        logger.info('Connexion à la base de données établie avec succès');
        await sequelize.sync({ force: false });
        logger.info('Synchronisation de la base de données terminée');
    } catch (error) {
        logger.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    }
}

async function start(): Promise<void> {
    try {
        await validateEnvironment();
        logger.info(`Démarrage en mode: ${config.mode}`);

        if(config.mode === 'tools') {
            await initializeDatabase();
        }

        const chat = config.mode === 'tools' ? new ChatWithTools() : new BasicChat();

        console.log(kleur.green("Bienvenue dans l'assistant SQL, que dois-je traduire ?"));
        const line = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        line.on('SIGINT', () => {
            console.log(kleur.red('Fermeture du programme ...'));
            line.close();
            process.exit(0);
        });

        function handleSystemCommand(command: string): boolean {
            switch (command.toLowerCase()) {
                case '/help':
                    console.log(kleur.cyan(`
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
                    console.log(kleur.green('✅ Historique de conversation vidé'));
                    return true;
                
                case '/context':
                    console.log(kleur.cyan(`📊 Contexte: ${chat.getContextLength()} messages`));
                    return true;
                
                case '/exit':
                    console.log(kleur.green('👋 Au revoir !'));
                    process.exit(0);
                    return true;
                
                default:
                    return false;
            }
        }

        function handleUserInput(): void {
            line.question(kleur.blue('> '), async (answer) => {
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
                        } else {
                            console.log(kleur.yellow('❓ Commande inconnue. Tapez /help pour voir les commandes disponibles.'));
                            handleUserInput();
                            return;
                        }
                    }

                    chat.pushToContext({
                        role: 'user',
                        content: userInput
                    });
                    await chat.createChatCompletion();
                } catch (error) {
                    logger.error('Erreur lors du traitement de l\'entrée utilisateur:', error);
                    console.log(kleur.red('Erreur lors du traitement de votre demande. Veuillez réessayer.'));
                }
                handleUserInput();
            });
        }

        handleUserInput();
    } catch (error) {
        logger.error('Erreur fatale lors du démarrage:', error);
        console.error(kleur.red(`Erreur fatale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`));
        process.exit(1);
    }
}

start()
