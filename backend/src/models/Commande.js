// Schéma de la collection commandes
const mongoose = require("mongoose");

const schemaCommande = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  plats: [
    {
      platId: { type: mongoose.Schema.Types.ObjectId, ref: "Plat" },
      quantite: { type: Number, default: 1 },
      options: [String]
    }
  ],
  total: { type: Number, required: true },
  statut: {
    type: String,
    enum: ["en attente", "en préparation", "en route", "livrée"],
    default: "en attente"
  },
  adresseLivraison: { type: String },
  dateCommande: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Commande", schemaCommande);
