const express = require("express");
const routeur = express.Router();

const verifierJeton = require("../middleware/auth");
const verifierRole = require("../middleware/verifierRole");
const controleurCategories = require("../controllers/categoriesControleur");

routeur.post(
  "/",
  verifierJeton,
  verifierRole("restaurant"),
  controleurCategories.creerCategorie,
);

routeur.get(
  "/mes-categories",
  verifierJeton,
  verifierRole("restaurant"),
  controleurCategories.obtenirMesCategories,
);

routeur.get(
  "/restaurant/:restaurantId",
  controleurCategories.obtenirCategoriesRestaurant,
);

routeur.get("/:id", controleurCategories.obtenirCategorie);

routeur.put(
  "/:id",
  verifierJeton,
  verifierRole("restaurant"),
  controleurCategories.modifierCategorie,
);

routeur.patch(
  "/:id/statut",
  verifierJeton,
  verifierRole("restaurant"),
  controleurCategories.changerStatutCategorie,
);

routeur.delete(
  "/:id",
  verifierJeton,
  verifierRole("restaurant"),
  controleurCategories.supprimerCategorie,
);

module.exports = routeur;
