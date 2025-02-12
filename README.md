# Assistant SQL

**Assistant SQL** est un programme interactif en ligne de commande qui convertit des phrases en langage naturel en requêtes SQL. Il utilise une intelligence artificielle pour générer des requêtes adaptées en fonction d'un modèle défini.

---

## Fonctionnalités

- **Conversion en SQL :** Transformez des phrases simples comme *"Liste tous les clients avec un compte actif"* en requêtes SQL prêtes à l'emploi.
- **Chargement de modèle SQL personnalisé :** Vous pouvez fournir un fichier `.sql` décrivant la structure de votre base de données. Ce fichier doit être placé à la racine du projet et sera chargé par la fonction `readModelAsString` pour contextualiser les requêtes.
- **Interface interactive :** Utilisation simple en ligne de commande, avec des retours formatés et colorés.

---

## Prérequis

1. **Yarn** doit être installé sur votre machine.
2. **Node.js** (version 18 ou supérieure).
3. (Optionnel) Un fichier `.sql` décrivant le modèle de base de données, à placer dans la racine du projet.

---

## Installation

1. Clonez le projet sur votre machine locale et accédez au dossier du projet :

   ```bash
   git clone https://votre-repo-url.git
   cd votre-repo
   ```

2. Installez les dépendances avec Yarn :

   ```bash
   yarn install
   ```

3. Si nécessaire, placez un fichier `.sql` contenant la structure de votre base de données à la racine du projet. Ce fichier sera utilisé par l'intelligence artificielle pour produire des requêtes SQL plus adaptées.

---

## Utilisation

1. Lancez le programme avec Yarn :

   ```bash
   yarn start
   ```

2. Interagissez avec l'assistant en entrant vos descriptions en langage naturel. Par exemple :

   ```text
   Bienvenue dans l'assistant SQL, que dois-je traduire ?
   > Sélectionne tous les produits avec un prix supérieur à 100.
   
   Assistant SQL : 
   SELECT * FROM produits WHERE prix > 100;
   ```

3. Répétez les requêtes aussi souvent que nécessaire. Pour quitter, utilisez **Ctrl+C**.

---

## Notes

- Le fichier `.sql` placé à la racine est lu automatiquement pour aider l'IA à comprendre le schéma de votre base de données.
- Par défaut, le programme se connecte à une API OpenAI locale via l'URL `http://localhost:11434/v1`. Assurez-vous que ce service est actif ou modifiez la configuration si nécessaire.

---

## Support

En cas de problème ou pour proposer des améliorations, n'hésitez pas à créer une issue sur le dépôt GitHub du projet.

Bon usage et bonne génération de requêtes SQL ! 🚀
