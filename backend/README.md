# Backend — API de livraison de repas

Serveur Node.js / Express, base MongoDB, temps réel via Socket.IO.

## Démarrage
```bash
npm install
cp .env.example .env
npm run dev
```

## Structure
```
src/
├── index.js          point d'entrée du serveur
├── config/db.js      connexion à MongoDB
├── models/           schémas Mongoose
├── routes/           définition des routes REST
├── controllers/      logique des routes
└── middleware/       authentification, etc.
```
