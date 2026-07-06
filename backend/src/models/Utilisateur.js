// Schéma de la collection utilisateurs
const mongoose = require("mongoose");

const schemaUtilisateur = new mongoose.Schema({
  nom: { type: String, required: true },
  courriel: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  adresse: { type: String },
  role: { type: String, enum: ["client", "restaurant"], default: "client" },
  // Réinitialisation du mot de passe : on stocke le hachage du jeton, jamais le jeton lui-même
  jetonReinitialisation: { type: String },
  expirationJetonReinitialisation: { type: Date }
});

module.exports = mongoose.model("Utilisateur", schemaUtilisateur);
