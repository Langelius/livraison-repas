const mongoose = require("mongoose");

const varianteSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },

    prix: {
      type: Number,
      required: true,
      min: 0,
    },

    disponible: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  },
);

const choixOptionSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },

    prixSupplementaire: {
      type: Number,
      default: 0,
      min: 0,
    },

    disponible: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  },
);

const optionSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },

    obligatoire: {
      type: Boolean,
      default: false,
    },

    choixMultiple: {
      type: Boolean,
      default: false,
    },

    choix: {
      type: [choixOptionSchema],
      default: [],
    },
  },
  {
    _id: true,
  },
);

const produitSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    nom: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    categorie: {
      type: String,
      required: true,
      trim: true,
    },

    prix: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    variantes: {
      type: [varianteSchema],
      default: [],
    },

    options: {
      type: [optionSchema],
      default: [],
    },

    disponible: {
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

produitSchema.index({
  restaurantId: 1,
  categorie: 1,
  disponible: 1,
});

module.exports = mongoose.model("Produit", produitSchema);
