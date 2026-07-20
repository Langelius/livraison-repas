const mongoose = require("mongoose");
const Categorie = require("../models/Categorie");
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

// POST /api/categories
const creerCategorie = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const { nom, description, image, ordre } = requete.body;

    if (!nom || !nom.trim()) {
      return reponse.status(400).json({
        message: "Le nom de la catégorie est obligatoire",
      });
    }

    const categorieExistante = await Categorie.findOne({
      restaurantId: restaurant._id,
      nom: nom.trim(),
    });

    if (categorieExistante) {
      return reponse.status(409).json({
        message: "Une catégorie portant ce nom existe déjà",
      });
    }

    const categorie = await Categorie.create({
      restaurantId: restaurant._id,
      nom: nom.trim(),
      description,
      image,
      ordre,
    });

    return reponse.status(201).json(categorie);
  } catch (erreur) {
    console.error("Erreur création catégorie :", erreur);

    if (erreur.code === 11000) {
      return reponse.status(409).json({
        message: "Une catégorie portant ce nom existe déjà",
      });
    }

    return reponse.status(500).json({
      message: "Erreur lors de la création de la catégorie",
    });
  }
};

// GET /api/categories/mes-categories
const obtenirMesCategories = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const categories = await Categorie.find({
      restaurantId: restaurant._id,
    }).sort({
      ordre: 1,
      nom: 1,
    });

    return reponse.status(200).json(categories);
  } catch (erreur) {
    console.error("Erreur récupération catégories :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la récupération des catégories",
    });
  }
};

// GET /api/categories/restaurant/:restaurantId
const obtenirCategoriesRestaurant = async (requete, reponse) => {
  try {
    const { restaurantId } = requete.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return reponse.status(400).json({
        message: "Identifiant de restaurant invalide",
      });
    }

    const categories = await Categorie.find({
      restaurantId,
      active: true,
    }).sort({
      ordre: 1,
      nom: 1,
    });

    return reponse.status(200).json(categories);
  } catch (erreur) {
    console.error("Erreur récupération catégories publiques :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la récupération des catégories",
    });
  }
};

// GET /api/categories/:id
const obtenirCategorie = async (requete, reponse) => {
  try {
    const { id } = requete.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reponse.status(400).json({
        message: "Identifiant de catégorie invalide",
      });
    }

    const categorie = await Categorie.findById(id).populate(
      "restaurantId",
      "nom",
    );

    if (!categorie) {
      return reponse.status(404).json({
        message: "Catégorie introuvable",
      });
    }

    return reponse.status(200).json(categorie);
  } catch (erreur) {
    console.error("Erreur récupération catégorie :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la récupération de la catégorie",
    });
  }
};

// PUT /api/categories/:id
const modifierCategorie = async (requete, reponse) => {
  try {
    const { id } = requete.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reponse.status(400).json({
        message: "Identifiant de catégorie invalide",
      });
    }

    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const categorie = await Categorie.findOne({
      _id: id,
      restaurantId: restaurant._id,
    });

    if (!categorie) {
      return reponse.status(404).json({
        message: "Catégorie introuvable ou non autorisée",
      });
    }

    const champsModifiables = [
      "nom",
      "description",
      "image",
      "ordre",
      "active",
    ];

    champsModifiables.forEach((champ) => {
      if (requete.body[champ] !== undefined) {
        categorie[champ] = requete.body[champ];
      }
    });

    await categorie.save();

    return reponse.status(200).json(categorie);
  } catch (erreur) {
    console.error("Erreur modification catégorie :", erreur);

    if (erreur.code === 11000) {
      return reponse.status(409).json({
        message: "Une catégorie portant ce nom existe déjà",
      });
    }

    return reponse.status(500).json({
      message: "Erreur lors de la modification de la catégorie",
    });
  }
};

// PATCH /api/categories/:id/statut
const changerStatutCategorie = async (requete, reponse) => {
  try {
    const { id } = requete.params;
    const { active } = requete.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reponse.status(400).json({
        message: "Identifiant de catégorie invalide",
      });
    }

    if (typeof active !== "boolean") {
      return reponse.status(400).json({
        message: "Le champ active doit être vrai ou faux",
      });
    }

    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const categorie = await Categorie.findOneAndUpdate(
      {
        _id: id,
        restaurantId: restaurant._id,
      },
      {
        active,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!categorie) {
      return reponse.status(404).json({
        message: "Catégorie introuvable ou non autorisée",
      });
    }

    return reponse.status(200).json(categorie);
  } catch (erreur) {
    console.error("Erreur statut catégorie :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors du changement de statut",
    });
  }
};

// DELETE /api/categories/:id
const supprimerCategorie = async (requete, reponse) => {
  try {
    const { id } = requete.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reponse.status(400).json({
        message: "Identifiant de catégorie invalide",
      });
    }

    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const categorie = await Categorie.findOneAndDelete({
      _id: id,
      restaurantId: restaurant._id,
    });

    if (!categorie) {
      return reponse.status(404).json({
        message: "Catégorie introuvable ou non autorisée",
      });
    }

    return reponse.status(200).json({
      message: "Catégorie supprimée avec succès",
    });
  } catch (erreur) {
    console.error("Erreur suppression catégorie :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la suppression de la catégorie",
    });
  }
};

module.exports = {
  creerCategorie,
  obtenirMesCategories,
  obtenirCategoriesRestaurant,
  obtenirCategorie,
  modifierCategorie,
  changerStatutCategorie,
  supprimerCategorie,
};
