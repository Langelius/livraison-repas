// Routes d'authentification
const express = require("express");
const routeur = express.Router();
const verifierJeton = require("../middleware/auth");
const controleurAuth = require("../controllers/authController");

routeur.post("/inscription", controleurAuth.inscription);
routeur.post("/connexion", controleurAuth.connexion);
routeur.get("/profil", verifierJeton, controleurAuth.obtenirProfil);

module.exports = routeur;
