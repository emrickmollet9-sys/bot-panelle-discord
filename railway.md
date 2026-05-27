# Déploiement Backend sur Railway

1. Créez un projet sur Railway et connectez votre dépôt Git si nécessaire.
2. Ajoutez un service PostgreSQL ou MongoDB selon votre besoin. Pour ce backend, utilisez MongoDB.
3. Dans l’onglet `Variables`, ajoutez :
   - `PORT` avec la valeur `5000` ou laissez vide pour Railway.
   - `MONGO_URI` avec l’URI de connexion MongoDB.
   - `JWT_SECRET` avec une chaîne secrète sécurisée.
4. Déployez le projet. Railway reconnaît automatiquement `package.json` et installe les dépendances.
5. Assurez-vous que le `start` script dans `backend/package.json` est `node server.js`.
6. Si nécessaire, configurez la racine du projet pour pointer sur le dossier `backend` ou utilisez un monorepo Railway avec un service Node.js dédié.
7. Testez l’API via l’URL Railway fournie, par exemple `https://<votre-projet>.railway.app/api/auth`.

### Conseils
- Si vous utilisez un dépôt monorepo, choisissez `backend` comme répertoire racine du service Railway.
- Vérifiez que `MONGO_URI` contient bien le nom de base de données et les identifiants.
- Ne partagez jamais votre secret JWT publiquement.
