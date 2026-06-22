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
├── App.js            point d'entrée de l'application
└── src/
    ├── ecrans/       écrans (accueil, menu, panier, suivi…)
    ├── composants/   composants réutilisables
    ├── services/     appels API et Socket.IO
    └── modeles/      modèles de données
```
