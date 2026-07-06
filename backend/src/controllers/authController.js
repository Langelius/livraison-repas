// Logique d'authentification
const crypto = require("crypto");
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

async function obtenirProfil(requete, reponse) {
  const utilisateur = await Utilisateur.findById(requete.utilisateur.id).select(
    "-motDePasse"
  );
  if (!utilisateur) {
    return reponse.status(404).json({ message: "Utilisateur introuvable" });
  }
  reponse.json({ utilisateur: utilisateur });
}

async function modifierProfil(requete, reponse) {
  const { nom, courriel, adresse } = requete.body;
  if (!nom && !courriel && !adresse) {
    return reponse.status(400).json({ message: "Aucun champ à modifier" });
  }

  // Le courriel doit rester unique dans la collection
  if (courriel) {
    const existe = await Utilisateur.findOne({
      courriel: courriel,
      _id: { $ne: requete.utilisateur.id }
    });
    if (existe) {
      return reponse.status(409).json({ message: "Courriel déjà utilisé" });
    }
  }

  const champs = {};
  if (nom) champs.nom = nom;
  if (courriel) champs.courriel = courriel;
  if (adresse) champs.adresse = adresse;

  const utilisateur = await Utilisateur.findByIdAndUpdate(
    requete.utilisateur.id,
    champs,
    { new: true }
  ).select("-motDePasse");

  if (!utilisateur) {
    return reponse.status(404).json({ message: "Utilisateur introuvable" });
  }
  reponse.json({ utilisateur: utilisateur });
}

async function motDePasseOublie(requete, reponse) {
  const { courriel } = requete.body;
  if (!courriel) {
    return reponse.status(400).json({ message: "Champs manquants" });
  }

  const utilisateur = await Utilisateur.findOne({ courriel: courriel });

  // Réponse identique que le courriel existe ou non, pour ne pas révéler
  // quels comptes sont enregistrés
  const messageGenerique =
    "Si ce courriel est enregistré, un lien de réinitialisation a été envoyé";

  if (!utilisateur) {
    return reponse.json({ message: messageGenerique });
  }

  const jeton = crypto.randomBytes(32).toString("hex");
  utilisateur.jetonReinitialisation = crypto
    .createHash("sha256")
    .update(jeton)
    .digest("hex");
  utilisateur.expirationJetonReinitialisation = new Date(Date.now() + 60 * 60 * 1000);
  await utilisateur.save();

  // Pas de service de courriel dans le cadre du cours : le jeton est renvoyé
  // dans la réponse. En production, il serait envoyé par courriel.
  reponse.json({ message: messageGenerique, jeton: jeton });
}

async function reinitialiserMotDePasse(requete, reponse) {
  const { courriel, jeton, nouveauMotDePasse } = requete.body;
  if (!courriel || !jeton || !nouveauMotDePasse) {
    return reponse.status(400).json({ message: "Champs manquants" });
  }

  const jetonHache = crypto.createHash("sha256").update(jeton).digest("hex");
  const utilisateur = await Utilisateur.findOne({
    courriel: courriel,
    jetonReinitialisation: jetonHache,
    expirationJetonReinitialisation: { $gt: new Date() }
  });

  if (!utilisateur) {
    return reponse.status(400).json({ message: "Jeton invalide ou expiré" });
  }

  utilisateur.motDePasse = await bcrypt.hash(nouveauMotDePasse, 10);
  utilisateur.jetonReinitialisation = undefined;
  utilisateur.expirationJetonReinitialisation = undefined;
  await utilisateur.save();

  reponse.json({ message: "Mot de passe réinitialisé, vous pouvez vous connecter" });
}

module.exports = {
  inscription,
  connexion,
  obtenirProfil,
  modifierProfil,
  motDePasseOublie,
  reinitialiserMotDePasse
};
