const mongoose = require("mongoose");
const Produit = require("../models/Produit");

console.log("Type Produit :", typeof Produit);
console.log("Produit :", Produit);
console.log("Type Produit.create :", typeof Produit.create);
const Restaurant = require("../models/Restaurant");

const obtenirUtilisateurId = (requete) => {
  return requete.utilisateur?.id || requete.user?.id;
};

const obtenirRestaurantProprietaire = async (requete) => {
  const utilisateurId = obtenirUtilisateurId(requete);

  if (!utilisateurId) {
    return null;
  }

  return Restaurant.findOne({
    proprietaireId: utilisateurId,
    actif: true,
  });
};

// POST /api/produits

const creerProduit = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const {
      nom,
      description,
      categorieId,
      prix,
      image,
      variantes,
      options,
      disponible,
    } = requete.body;

    if (!nom || !categorie || prix === undefined) {
      return reponse.status(400).json({
        message: "Le nom, la catégorie et le prix sont obligatoires",
      });
    }

    if (Number(prix) < 0) {
      return reponse.status(400).json({
        message: "Le prix ne peut pas être négatif",
      });
    }

    // Vérifier que la catégorie appartient au restaurant connecté
    const categorieExiste = await Categorie.findOne({
      _id: categorieId,
      restaurantId: restaurant._id,
    });
    if (!categorieExiste) {
      return reponse.status(404).json({
        message: "Catégorie introuvable pour ce restaurant",
      });
    }

    const produit = await Produit.create({
      restaurantId: restaurant._id,
      nom,
      description,
      categorieId,
      prix: Number(prix),
      stock: stock !== undefined ? Number(stock) : 0,
      seuilAlerte: seuilAlerte !== undefined ? Number(seuilAlerte) : 5,
      image,
      variantes,
      options,
      disponible,
    });

    return reponse.status(201).json({
      message: "Produit créé avec succès",
      produit,
    });
  } catch (erreur) {
    console.error("Erreur création produit :", erreur);

    if (erreur.name === "CastError") {
      return reponse.status(400).json({
        message: "Identifiant de catégorie invalide",
      });
    }

    if (erreur.name === "ValidationError") {
      return reponse.status(400).json({
        message: erreur.message,
      });
    }

    return reponse.status(500).json({
      message: "Erreur lors de la création du produit",
    });
  }
};

const modifierStock = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const { stock } = requete.body;

    if (stock === undefined || Number(stock) < 0) {
      return reponse.status(400).json({
        message: "Le stock doit être un nombre positif ou égal à zéro",
      });
    }

    const produit = await Produit.findOneAndUpdate(
      {
        _id: requete.params.id,
        restaurantId: restaurant._id,
      },
      {
        stock: Number(stock),
        disponible: Number(stock) > 0,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!produit) {
      return reponse.status(404).json({
        message: "Produit introuvable",
      });
    }

    return reponse.status(200).json({
      message: "Stock modifié avec succès",
      produit,
    });
  } catch (erreur) {
    console.error("Erreur modification stock :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la modification du stock",
    });
  }
};

// GET /api/produits/mes-produits

const listerProduits = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const produits = await Produit.find({
      restaurantId: restaurant._id,
    })
      .populate("categorieId", "nom")
      .sort({ createdAt: -1 });

    return reponse.status(200).json(produits);
  } catch (erreur) {
    console.error("Erreur liste produits :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la récupération des produits",
    });
  }
};

const obtenirMesProduits = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const produits = await Produit.find({
      restaurantId: restaurant._id,
      actif: true,
    }).sort({
      createdAt: -1,
    });

    return reponse.status(200).json(produits);
  } catch (erreur) {
    console.error("Erreur récupération produits :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la récupération des produits",
    });
  }
};

// GET /api/produits/restaurant/:restaurantId
const obtenirProduitsRestaurant = async (requete, reponse) => {
  try {
    const { restaurantId } = requete.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return reponse.status(400).json({
        message: "Identifiant de restaurant invalide",
      });
    }

    const produits = await Produit.find({
      restaurantId,
      actif: true,
      disponible: true,
    }).sort({
      categorie: 1,
      nom: 1,
    });

    return reponse.status(200).json(produits);
  } catch (erreur) {
    console.error("Erreur récupération catalogue :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la récupération du catalogue",
    });
  }
};

// GET /api/produits/:id
const obtenirProduit = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    const produit = await Produit.findOne({
      _id: requete.params.id,
      restaurantId: restaurant._id,
    }).populate("categorieId", "nom");

    if (!produit) {
      return reponse.status(404).json({
        message: "Produit introuvable",
      });
    }

    return reponse.status(200).json(produit);
  } catch (erreur) {
    console.error(erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la récupération du produit",
    });
  }
};

// PUT /api/produits/:id
const modifierProduit = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    const produit = await Produit.findOne({
      _id: requete.params.id,
      restaurantId: restaurant._id,
    });

    if (!produit) {
      return reponse.status(404).json({
        message: "Produit introuvable",
      });
    }

    if (requete.body.categorieId) {
      const categorie = await Categorie.findOne({
        _id: requete.body.categorieId,
        restaurantId: restaurant._id,
      });

      if (!categorie) {
        return reponse.status(404).json({
          message: "Catégorie introuvable",
        });
      }
    }

    Object.assign(produit, requete.body);

    await produit.save();

    return reponse.status(200).json({
      message: "Produit modifié avec succès",
      produit,
    });
  } catch (erreur) {
    console.error(erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la modification",
    });
  }
};

// PATCH /api/produits/:id/disponibilite
const changerDisponibiliteProduit = async (requete, reponse) => {
  try {
    const { id } = requete.params;
    const { disponible } = requete.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reponse.status(400).json({
        message: "Identifiant de produit invalide",
      });
    }

    if (typeof disponible !== "boolean") {
      return reponse.status(400).json({
        message: "Le champ disponible doit être vrai ou faux",
      });
    }

    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const produit = await Produit.findOneAndUpdate(
      {
        _id: id,
        restaurantId: restaurant._id,
        actif: true,
      },
      {
        disponible,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!produit) {
      return reponse.status(404).json({
        message: "Produit introuvable ou non autorisé",
      });
    }

    return reponse.status(200).json(produit);
  } catch (erreur) {
    console.error("Erreur disponibilité produit :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors du changement de disponibilité",
    });
  }
};

// DELETE /api/produits/:id
const supprimerProduit = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    const produit = await Produit.findOneAndDelete({
      _id: requete.params.id,
      restaurantId: restaurant._id,
    });

    if (!produit) {
      return reponse.status(404).json({
        message: "Produit introuvable",
      });
    }

    return reponse.status(200).json({
      message: "Produit supprimé avec succès",
    });
  } catch (erreur) {
    console.error(erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la suppression",
    });
  }
};
module.exports = {
  creerProduit,
  listerProduits,
  obtenirMesProduits,
  obtenirProduitsRestaurant,
  obtenirProduit,
  modifierProduit,
  changerDisponibiliteProduit,
  supprimerProduit,
  modifierStock,
};
