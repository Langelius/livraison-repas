const mongoose = require("mongoose");

const ligneCommandeSchema = new mongoose.Schema(
  {
    produitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
    },

    nom: {
      type: String,
      required: true,
    },

    prix: {
      type: Number,
      required: true,
      min: 0,
    },

    quantite: {
      type: Number,
      required: true,
      min: 1,
    },

    sousTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const commandeSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
      index: true,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    produits: {
      type: [ligneCommandeSchema],
      required: true,
    },

    montantTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    statut: {
      type: String,
      enum: [
        "EN_ATTENTE",
        "ACCEPTEE",
        "EN_PREPARATION",
        "PRETE",
        "ANNULEE",
        "LIVREE",
      ],
      default: "EN_ATTENTE",
    },

    adresseLivraison: {
      type: String,
      required: true,
      trim: true,
    },

    telephone: {
      type: String,
      required: true,
      trim: true,
    },

    noteClient: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Commande", commandeSchema);
