# Assistant SQL 🚀

**Assistant SQL** est un programme interactif en ligne de commande qui convertit des phrases en langage naturel en requêtes SQL. Il utilise une intelligence artificielle 🤖 pour générer des requêtes adaptées en fonction d'un modèle défini, tout en permettant d'exécuter directement les requêtes sur une base de données réelle. 🗄️

---

## 🌟 Fonctionnalités

- **🔍 Conversion en SQL :** Transformez des phrases simples comme *"Liste tous les clients avec un compte actif"* en requêtes SQL prêtes à l'emploi.
- **⚡ Exécution instantanée des requêtes SQL :** L'assistant peut se connecter à une base de données réelle (PostgreSQL, MySQL ou SQLite) pour exécuter directement les requêtes générées et afficher les résultats.
- **📄 Chargement de modèle SQL personnalisé :** Fournissez un fichier `.sql` décrivant la structure de votre base de données pour améliorer la précision et l'adéquation des requêtes générées.
- **🖥️ Interface interactive :** Utilisation simple en ligne de commande avec des retours formatés et colorés.

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

# Base de données
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
```

### 2. Fonctionnalités disponibles :

#### a. 📝 **Génération de requêtes SQL**
Interagissez avec l'assistant en décrivant vos besoins en langage naturel. Par exemple :

```text
Bienvenue dans l'assistant SQL, que dois-je traduire ?
> Sélectionne tous les produits avec un prix supérieur à 100.

Assistant SQL :
SELECT * FROM produits WHERE prix > 100;
```

#### b. ⚡ **Exécution directe des requêtes sur la base de données**
Si votre base de données est correctement configurée dans le fichier `.env`, l'assistant peut exécuter la requête générée et retourner des résultats tels que :

```text
Bienvenue dans l'assistant SQL, que dois-je traduire ?
> Trouve tous les utilisateurs où l'email contient 'example.com'.

Assistant SQL :
SELECT * FROM users WHERE email LIKE '%example.com%';

Exécution des résultats sur la base de données 🕒…
| id | username | email             | created_at          |
|----|----------|-------------------|---------------------|
| 1  | johndoe  | john@example.com  | 2023-01-10 12:00:00|
...
```

---

## 📌 Notes importantes

- Si aucun fichier `.sql` ou modèle de données n'est fourni, l'intelligence artificielle peut encore fonctionner pour des requêtes générales, mais ses performances seront meilleures avec un modèle chargé.
- Lors de l'exécution directe des requêtes SQL ⚠️ :
   - Assurez-vous que la base de données est bien accessible.
   - Limitez les requêtes d'écriture (`INSERT`, `UPDATE`, `DELETE`) si vous travaillez sur un environnement sensible.
- L'assistant prend en charge les bases **PostgreSQL**, **MySQL**, et **SQLite**.

---

## 🤝 Support

Si vous avez des questions, des suggestions ou rencontrez des problèmes, n'hésitez pas à [ouvrir une issue](https://github.com) sur le repo GitHub. Nous sommes là pour vous aider !

✨ Bon usage et profitez de votre assistant SQL ! ✨
