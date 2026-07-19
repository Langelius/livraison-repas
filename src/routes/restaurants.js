// Routes de gestion des restaurants
const express = require("express");
const routeur = express.Router();
const verifierJeton = require("../middleware/auth");
const verifierRole = require("../middleware/verifierRole");
const controleurRestaurants = require("../controllers/restaurantsControleur");

// Routes privées du propriétaire du restaurant
routeur.post(
  "/",
  verifierJeton,
  verifierRole("restaurant"),
  controleurRestaurants.creerRestaurant,
);

routeur.get(
  "/me",
  verifierJeton,
  verifierRole("restaurant"),
  controleurRestaurants.obtenirMonRestaurant,
);

routeur.put(
  "/me",
  verifierJeton,
  verifierRole("restaurant"),
  controleurRestaurants.modifierMonRestaurant,
);

routeur.patch(
  "/me/statut",
  verifierJeton,
  verifierRole("restaurant"),
  controleurRestaurants.changerStatutOuverture,
);

// Route publique placée après /mon-restaurant
routeur.get("/:id", controleurRestaurants.obtenirRestaurant);

module.exports = routeur;
