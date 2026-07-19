// Schéma de la collection utilisateurs
const mongoose = require("mongoose");

const schemaUtilisateur = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true
    },
    courriel: {
      type: String,
      required: [true, "Le courriel est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true
    },
    motDePasse: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: 6
    },
    adresse: {
      type: String,
      trim: true,
      default: ""
    },
    role: {
      type: String,
      enum: ["client", "restaurant"],
      default: "client"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Utilisateur", schemaUtilisateur);
