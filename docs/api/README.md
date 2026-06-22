# Documentation des API REST

Base URL : `http://localhost:3000/api`

## Authentification

Les routes protégées attendent un en-tête :
`Authorization: Bearer <jeton JWT>`

---

### POST /auth/inscription
Crée un compte utilisateur.

**Corps**
```json
{ "nom": "string", "courriel": "string", "motDePasse": "string" }
```
**Réponse 201**
```json
{ "token": "string", "utilisateur": { "id": "...", "nom": "..." } }
```
**Erreurs** : 400 (champs manquants), 409 (courriel déjà utilisé)

---

### POST /auth/connexion
Authentifie un utilisateur et renvoie un jeton.

---

### GET /restaurants
Liste les restaurants disponibles. Filtres : `?categorie=pizza`.

---

### GET /restaurants/:id/plats
Liste les plats d'un restaurant.

---

### POST /commandes
Crée une commande (route protégée).

**Corps**
```json
{ "restaurantId": "...", "plats": [ { "platId": "...", "quantite": 1, "options": [] } ], "adresseLivraison": "..." }
```

---

### GET /commandes/:id
Renvoie le détail et le statut d'une commande.

---

### POST /avis
Enregistre une note et un commentaire pour une commande livrée.

```json
{ "commandeId": "...", "note": 5, "commentaire": "..." }
```
