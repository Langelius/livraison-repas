const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de la catégorie est obligatoire"],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: false,
    },

    image: {
      type: String,
      default: "",
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

// Empêche deux catégories portant le même nom dans un même restaurant
categorieSchema.index({ restaurant: 1, cat: 1 }, { unique: true });

module.exports = mongoose.model("Categorie", categorieSchema);
