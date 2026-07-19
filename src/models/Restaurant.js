// Schéma de la collection restaurants
const mongoose = require("mongoose");

const schemaRestaurant = new mongoose.Schema(
  {
    proprietaireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
      unique: true,
    },
    nom: {
      type: String,
      required: [true, "Le nom du restaurant est obligatoire"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    adresse: {
      rue: {
        type: String,
        required: true,
        trim: true,
      },
      ville: {
        type: String,
        required: true,
        trim: true,
      },
      province: {
        type: String,
        required: true,
        trim: true,
      },
      codePostal: {
        type: String,
        required: true,
        trim: true,
      },
    },
    telephone: {
      type: String,
      required: [true, "Le téléphone est obligatoire"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    estOuvert: {
      type: Boolean,
      default: true,
    },
    actif: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Restaurant", schemaRestaurant);
