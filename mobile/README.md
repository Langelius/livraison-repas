# Application mobile — React Native

Interface client de l'application de livraison de repas.

## Démarrage
```bash
npm install
npx react-native run-android   # ou : npx expo start
```

> Astuce : pour un démarrage simplifié sans configuration native, il faudrait
> initialiser le projet avec **Expo** (`npx create-expo-app`) et y déposer le
> contenu de `src/`.

## Structure
```
mobile/
├── App.js            point d'entrée : navigation (connexion → accueil)
└── src/
    ├── ecrans/       écrans (connexion, inscription, accueil, menu…)
    ├── composants/   composants réutilisables
    ├── services/     appels API, session (jeton JWT) et Socket.IO
    └── modeles/      modèles de données
```

## Authentification (Sprint 1)

- `EcranInscription` / `EcranConnexion` appellent l'API `/auth/inscription` et
  `/auth/connexion`.
- Le jeton JWT est conservé avec **AsyncStorage** (`serviceSession.js`) et
  ajouté automatiquement aux requêtes par `clientHttp.js`.
- La déconnexion efface le jeton du stockage local et ramène à l'écran de
  connexion.
