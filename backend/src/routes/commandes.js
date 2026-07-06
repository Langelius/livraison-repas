// Routes des commandes
const express = require("express");
const routeur = express.Router();
const verifierJeton = require("../middleware/auth");
const controleurCommandes = require("../controllers/commandesController");

routeur.post("/", verifierJeton, controleurCommandes.creerCommande);
routeur.get("/:id", verifierJeton, controleurCommandes.obtenirCommande);

module.exports = routeur;
