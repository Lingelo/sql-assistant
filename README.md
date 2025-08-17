# Assistant SQL 🚀

**Assistant SQL** est un programme interactif en ligne de commande qui convertit des phrases en langage naturel en requêtes SQL. Il utilise une intelligence artificielle 🤖 pour générer des requêtes adaptées en fonction d'un modèle défini, tout en permettant d'exécuter directement les requêtes sur une base de données réelle. 🗄️

---

## 🌟 Fonctionnalités

- **🔍 Conversion en SQL :** Transformez des phrases simples comme *"Liste tous les clients avec un compte actif"* en requêtes SQL prêtes à l'emploi.
- **⚡ Exécution sécurisée des requêtes :** Exécution directe avec validation de sécurité et formatage élégant des résultats en tableau.
- **📄 Chargement de modèle SQL personnalisé :** Fournissez un fichier `.sql` décrivant la structure de votre base de données pour améliorer la précision et l'adéquation des requêtes générées.
- **🖥️ Interface interactive avancée :** Commandes système, gestion d'erreurs robuste, et retours formatés colorés.
- **🛡️ Sécurité renforcée :** Validation des requêtes, protection contre les injections SQL et gestion des environnements.
- **⚙️ Outils de développement :** Scripts de build, linting, et formatage intégrés.

---

## 📋 Prérequis

1. **🥯 Yarn** doit être installé sur votre machine.
2. **🟢 Node.js** (version 18 ou supérieure).
3. **🗄️ Une base de données** à laquelle l'outil peut se connecter (PostgreSQL, MySQL ou SQLite).
4. *(Optionnel)* Un fichier `.sql` décrivant le modèle de base de données, à placer dans la racine du projet.

---

## ⚙️ Installation

1. **Clonez** le projet sur votre machine locale et accédez au dossier du projet :

   ```bash
   git clone https://votre-repo-url.git
   cd votre-repo
   ```

2. **Installez les dépendances** avec Yarn :

   ```bash
   yarn install
   ```

3. (Optionnel) Placez un fichier `.sql` contenant la structure de votre base de données à la racine du projet. Ce fichier sera utilisé pour adapter les requêtes générées.

---

## 🛠️ Configuration du projet

Le projet utilise un fichier de configuration permettant de spécifier certains paramètres essentiels (💡 intelligence artificielle, 🔒 logs, et ⚡ connexion à la base de données).

📄 **Variables d'environnement à définir dans un fichier `.env` :**

```plaintext
# Configuration AI
IA_HOST=http://localhost:11434/v1
IA_KEY=cle-api
IA_MODEL_NAME=model-name

# Configuration des logs
LOG_LEVEL=info

# Mode d'exécution
MODE=tools  # 'tools' pour exécution BDD, 'chat' pour génération seulement

# Base de données (requis uniquement en mode 'tools')
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=nom_utilisateur
DB_PASSWORD=mot_de_passe
DB_DATABASE=nom_base
MODEL_PATH=./structure.sql
DIALECT=postgres
```

🔧 La configuration définie dans `config.ts` utilise ces variables pour construire le comportement de l'application.

Assurez-vous que les paramètres de la base de données sont corrects pour connecter l'application à votre base réelle.

---

## 🎮 Utilisation

### 1. Lancez l'assistant en ligne de commande 🔥 :

```bash
yarn start
# ou en mode développement
yarn dev
```

### 2. Commandes système disponibles :

```text
/help     - Affiche l'aide des commandes
/clear    - Vide l'historique de conversation
/context  - Affiche le nombre de messages en contexte
/exit     - Quitte l'application
```

### 3. Fonctionnalités principales :

#### a. 📝 **Génération de requêtes SQL**
Interagissez avec l'assistant en décrivant vos besoins en langage naturel :

```text
Bienvenue dans l'assistant SQL, que dois-je traduire ?
> Sélectionne tous les produits avec un prix supérieur à 100.

Assistant SQL :
SELECT * FROM produits WHERE prix > 100;
```

#### b. ⚡ **Exécution sécurisée avec formatage élégant**
En mode `tools`, les requêtes sont exécutées avec validation et formatage :

```text
> Trouve tous les utilisateurs actifs

✅ Requête exécutée avec succès (45ms)

┌─────┬──────────┬───────────────────┬─────────────────────┐
│ id  │ username │ email             │ created_at          │
├─────┼──────────┼───────────────────┼─────────────────────┤
│ 1   │ johndoe  │ john@example.com  │ 2023-01-10 12:00:00│
│ 2   │ janedoe  │ jane@example.com  │ 2023-01-11 08:30:00│
└─────┴──────────┴───────────────────┴─────────────────────┘
```

---

## 🛠️ Scripts de développement

```bash
yarn build          # Compile TypeScript vers /dist
yarn dev            # Mode développement avec ts-node
yarn lint           # Vérifie le code avec ESLint
yarn lint:fix       # Corrige automatiquement les erreurs
yarn format         # Formate le code avec Prettier
yarn format:check   # Vérifie le formatage sans modifier
yarn clean          # Supprime le dossier dist/
```

---

## 🔒 Sécurité et validation

- **Validation des requêtes :** Protection contre les requêtes potentiellement dangereuses
- **Gestion d'erreurs :** Logging détaillé et messages d'erreur informatifs
- **Variables d'environnement :** Validation automatique au démarrage
- **Gestion du contexte :** Limitation intelligente pour éviter la surcharge mémoire
- **Types TypeScript :** Code typé pour une meilleure robustesse

---

## 📌 Notes importantes

- **Modes d'exécution :** 
  - `MODE=chat` : Génération de requêtes uniquement
  - `MODE=tools` : Génération + exécution sécurisée
- **Performance :** Meilleure avec un fichier `.sql` de structure de base
- **Sécurité :** Validation automatique des requêtes dangereuses
- **Support BDD :** PostgreSQL, MySQL, et SQLite

---

## 🤝 Support

Si vous avez des questions, des suggestions ou rencontrez des problèmes, n'hésitez pas à [ouvrir une issue](https://github.com) sur le repo GitHub. Nous sommes là pour vous aider !

✨ Bon usage et profitez de votre assistant SQL amélioré ! ✨