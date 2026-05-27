# Déploiement Frontend sur Netlify

1. Créez un site sur Netlify et connectez votre dépôt Git.
2. Sélectionnez le dossier `frontend` comme répertoire de base du projet.
3. Configurez les paramètres de build :
   - Build command : `npm run build`
   - Publish directory : `dist`
4. Ajoutez une variable d’environnement :
   - `VITE_API_URL` avec l’URL publique de votre backend (par exemple `https://mon-backend.railway.app/api`).
5. Déployez le site. Netlify exécutera `npm install` puis `npm run build`.
6. Vérifiez l’URL du site Netlify pour vous assurer que l’application charge et se connecte au backend.

### Remarques
- Netlify sert uniquement le frontend ; l’API backend doit être accessible en HTTPS.
- Si vous modifiez `VITE_API_URL`, réexpliquez les variables d’environnement et redéployez.
- Assurez-vous que votre backend autorise les requêtes CORS depuis l’URL Netlify.
