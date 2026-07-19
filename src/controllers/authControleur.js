// Logique d'authentification
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Utilisateur = require("../models/Utilisateur");

function creerJeton(utilisateur) {
  return jwt.sign(
    {
      id: utilisateur._id,
      role: utilisateur.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

async function inscription(requete, reponse) {
  try {
    const { nom, courriel, motDePasse, role = "client" } = requete.body;

    if (!nom || !courriel || !motDePasse) {
      return reponse.status(400).json({ message: "Champs obligatoires manquants" });
    }

    if (!["client", "restaurant"].includes(role)) {
      return reponse.status(400).json({ message: "Rôle invalide" });
    }

    const courrielNormalise = courriel.toLowerCase().trim();
    const existe = await Utilisateur.findOne({ courriel: courrielNormalise });

    if (existe) {
      return reponse.status(409).json({ message: "Courriel déjà utilisé" });
    }

    const motDePasseHache = await bcrypt.hash(motDePasse, 10);
    const utilisateur = await Utilisateur.create({
      nom: nom.trim(),
      courriel: courrielNormalise,
      motDePasse: motDePasseHache,
      role
    });

    const jeton = creerJeton(utilisateur);

    return reponse.status(201).json({
      token: jeton,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        courriel: utilisateur.courriel,
        role: utilisateur.role
      }
    });
  } catch (erreur) {
    console.error("Erreur inscription :", erreur);
    return reponse.status(500).json({ message: "Erreur lors de l'inscription" });
  }
}

async function connexion(requete, reponse) {
  try {
    const { courriel, motDePasse } = requete.body;

    if (!courriel || !motDePasse) {
      return reponse.status(400).json({ message: "Courriel et mot de passe obligatoires" });
    }

    const utilisateur = await Utilisateur.findOne({
      courriel: courriel.toLowerCase().trim()
    });

    if (!utilisateur) {
      return reponse.status(401).json({ message: "Identifiants invalides" });
    }

    const valide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!valide) {
      return reponse.status(401).json({ message: "Identifiants invalides" });
    }

    const jeton = creerJeton(utilisateur);

    return reponse.json({
      token: jeton,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        courriel: utilisateur.courriel,
        role: utilisateur.role
      }
    });
  } catch (erreur) {
    console.error("Erreur connexion :", erreur);
    return reponse.status(500).json({ message: "Erreur lors de la connexion" });
  }
}

module.exports = { inscription, connexion };
