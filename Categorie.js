const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema(
  {
    cat: {
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
      required: true,
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
  }
);

categorieSchema.index(
  { restaurant: 1, cat: 1 },
  { unique: true }
);

module.exports = mongoose.model("Categorie", categorieSchema);
