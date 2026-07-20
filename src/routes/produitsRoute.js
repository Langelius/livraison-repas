const express = require("express");
const routeur = express.Router();

const verifierJeton = require("../middleware/auth");
const verifierRole = require("../middleware/verifierRole");
const controleurProduits = require("../controllers/produitsControleur");

routeur.post("/test", (requete, reponse) => {
  reponse.json({
    message: "POST produits fonctionne",
    donnees: requete.body,
  });
});

// Créer un produit
routeur.post(
  "/",
  verifierJeton,
  verifierRole("restaurant"),
  controleurProduits.creerProduit,
);

// Récupérer les produits du restaurant connecté
routeur.get(
  "/mes-produits",
  verifierJeton,
  verifierRole("restaurant"),
  controleurProduits.obtenirMesProduits,
);

// Catalogue public d’un restaurant
routeur.get(
  "/restaurant/:restaurantId",
  controleurProduits.obtenirProduitsRestaurant,
);

// Récupérer un produit
routeur.get("/:id", controleurProduits.obtenirProduit);

// Modifier un produit
routeur.put(
  "/:id",
  verifierJeton,
  verifierRole("restaurant"),
  controleurProduits.modifierProduit,
);

// Changer sa disponibilité
routeur.patch(
  "/:id/disponibilite",
  verifierJeton,
  verifierRole("restaurant"),
  controleurProduits.changerDisponibiliteProduit,
);

// Supprimer logiquement un produit
routeur.delete(
  "/:id",
  verifierJeton,
  verifierRole("restaurant"),
  controleurProduits.supprimerProduit,
);

module.exports = routeur;
