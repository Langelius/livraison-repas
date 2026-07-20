// Routes de gestion des restaurants
const express = require("express");
const routeur = express.Router();
const verifierJeton = require("../middleware/auth");
const verifierRole = require("../middleware/verifierRole");
const controleurRestaurants = require("../controllers/restaurantsControleur");

// Routes privées du propriétaire du restaurant

console.log(
  "Contrôleur chargé depuis :",
  require.resolve("../controllers/restaurantsControleur"),
);

console.log("Fonctions exportées :", Object.keys(controleurRestaurants));
console.log(
  "dashboardRestaurant :",
  typeof controleurRestaurants.dashboardRestaurant,
);
console.log("verifierJeton :", typeof verifierJeton);
console.log("verifierRole :", typeof verifierRole);

routeur.get(
  "/dashboard",
  verifierJeton,
  verifierRole("restaurant"),
  controleurRestaurants.dashboardRestaurant,
);

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
