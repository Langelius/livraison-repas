// Logique d'authentification
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Utilisateur = require("../models/Utilisateur");

// Un jeton sans expiration resterait valide pour toujours en cas de vol
const DUREE_DE_VIE_JETON = "24h";

async function inscription(requete, reponse) {
  const { nom, courriel, motDePasse } = requete.body;
  if (!nom || !courriel || !motDePasse) {
    return reponse.status(400).json({ message: "Champs manquants" });
  }

  const existe = await Utilisateur.findOne({ courriel: courriel });
  if (existe) {
    return reponse.status(409).json({ message: "Courriel déjà utilisé" });
  }

  const motDePasseHache = await bcrypt.hash(motDePasse, 10);
  const utilisateur = await Utilisateur.create({
    nom: nom,
    courriel: courriel,
    motDePasse: motDePasseHache
  });

  const jeton = jwt.sign({ id: utilisateur._id }, process.env.JWT_SECRET, {
    expiresIn: DUREE_DE_VIE_JETON
  });
  reponse.status(201).json({
    token: jeton,
    utilisateur: { id: utilisateur._id, nom: utilisateur.nom }
  });
}

async function connexion(requete, reponse) {
  const { courriel, motDePasse } = requete.body;
  const utilisateur = await Utilisateur.findOne({ courriel: courriel });
  if (!utilisateur) {
    return reponse.status(401).json({ message: "Identifiants invalides" });
  }

  const valide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
  if (!valide) {
    return reponse.status(401).json({ message: "Identifiants invalides" });
  }

  const jeton = jwt.sign({ id: utilisateur._id }, process.env.JWT_SECRET, {
    expiresIn: DUREE_DE_VIE_JETON
  });
  reponse.json({ token: jeton, utilisateur: { id: utilisateur._id, nom: utilisateur.nom } });
}

module.exports = { inscription, connexion };
