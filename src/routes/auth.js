// Routes d'authentification
const express = require("express");
const routeur = express.Router();
const controleurAuth = require("../controllers/authControleur");

routeur.post("/inscription", controleurAuth.inscription);
routeur.post("/connexion", controleurAuth.connexion);

module.exports = routeur;
