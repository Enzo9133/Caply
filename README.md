# Caply : version Vercel

Accès libre : tes amis ouvrent le lien, sans inscription ni compte. Seul toi as un espace propriétaire, protégé par mot de passe.

## Contenu
- `index.html` : le site (même rendu que sur Claude).
- `api/positions.js` : lit les achats (public) et les enregistre ou les supprime (mot de passe requis).
- `api/login.js` : vérifie ton mot de passe.
- `api/_store.js`, `api/_auth.js` : accès à la base de données et contrôle du mot de passe.
- `package.json` : aucune dépendance à installer.

## Mise en ligne (10 minutes)

1. **Envoyer le code sur Vercel**
   - Depuis un ordinateur : dézippe le dossier, ouvre un terminal dedans et lance `npx vercel`, puis `npx vercel --prod`.
   - Ou via GitHub : crée un dépôt, mets-y ces fichiers, puis sur vercel.com : *Add New… → Project → Import* ce dépôt. Laisse les réglages par défaut (Framework : Other).

2. **Créer la base de données** (gratuit)
   Dans ton projet Vercel : *Storage → Create → Upstash (Redis)* → plan gratuit → *Connect to project*.
   Vercel ajoute tout seul les variables `KV_REST_API_URL` et `KV_REST_API_TOKEN`.

3. **Choisir ton mot de passe**
   *Settings → Environment Variables* → ajoute `ADMIN_PASSWORD` avec un mot de passe long (12 caractères ou plus), pour Production.

4. **Redéployer** : *Deployments → … → Redeploy* (obligatoire après l'ajout des variables).

## Utilisation
- **Lien pour tes amis :** `https://TON-PROJET.vercel.app/`
- **Ton lien :** `https://TON-PROJET.vercel.app/#admin` : le site te demande le mot de passe, puis tu ajoutes tes actions. Le mot de passe est mémorisé sur ton appareil : n'utilise pas un appareil partagé.
- Les achats se mettent à jour toutes les minutes chez tes amis.

## Bon à savoir
- Les achats sont publics : toute personne qui a le lien voit les valeurs et les ISIN. La page demande aux moteurs de recherche de ne pas l'indexer (`noindex`), mais ce n'est pas une protection.
- Pas de statistiques ni de Oui/Non dans cette version.
- Pour changer le mot de passe : modifie `ADMIN_PASSWORD` dans Vercel, puis redéploie.

