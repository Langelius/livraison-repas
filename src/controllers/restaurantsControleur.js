// Logique de gestion des restaurants
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");

const Commande = require("../models/Commande");
const Produit = require("../models/Produit");

async function creerRestaurant(requete, reponse) {
  try {
    const { nom, description, adresse, telephone, image } = requete.body;

    if (!nom || !adresse || !telephone) {
      return reponse.status(400).json({
        message: "Le nom, l'adresse et le téléphone sont obligatoires",
      });
    }

    const restaurantExistant = await Restaurant.findOne({
      proprietaireId: requete.utilisateur.id,
    });

    if (restaurantExistant) {
      return reponse.status(409).json({
        message: "Cet utilisateur possède déjà un restaurant",
      });
    }

    const restaurant = await Restaurant.create({
      proprietaireId: requete.utilisateur.id,
      nom,
      description,
      adresse,
      telephone,
      image,
    });

    return reponse.status(201).json(restaurant);
  } catch (erreur) {
    console.error("Erreur création restaurant :", erreur);
    return reponse
      .status(500)
      .json({ message: "Erreur lors de la création du restaurant" });
  }
}

const dashboardRestaurant = async (requete, reponse) => {
  try {
    const restaurant = await Restaurant.findOne({
      proprietaireId: requete.utilisateur.id,
    });

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Restaurant introuvable",
      });
    }

    const nombreProduits = await Produit.countDocuments({
      restaurantId: restaurant._id,
    });

    const commandesEnAttente = await Commande.countDocuments({
      restaurantId: restaurant._id,
      statut: "EN_ATTENTE",
    });

    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    const commandesAujourdHui = await Commande.find({
      restaurantId: restaurant._id,
      createdAt: { $gte: aujourdHui },
    });

    const revenusAujourdHui = commandesAujourdHui.reduce(
      (total, commande) => total + commande.montantTotal,
      0,
    );

    const dernieresCommandes = await Commande.find({
      restaurantId: restaurant._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("montantTotal statut createdAt");

    return reponse.json({
      restaurant: {
        nom: restaurant.nom,
        estOuvert: restaurant.estOuvert,
      },

      statistiques: {
        produits: nombreProduits,
        commandesEnAttente,
        commandesAujourdHui: commandesAujourdHui.length,
        revenusAujourdHui,
      },

      dernieresCommandes,
    });
  } catch (erreur) {
    console.error(erreur);

    return reponse.status(500).json({
      message: "Erreur lors du chargement du tableau de bord",
    });
  }
};

async function obtenirMonRestaurant(requete, reponse) {
  try {
    const restaurant = await Restaurant.findOne({
      proprietaireId: requete.utilisateur.id,
    });

    if (!restaurant) {
      return reponse.status(404).json({ message: "Restaurant introuvable" });
    }

    return reponse.json(restaurant);
  } catch (erreur) {
    console.error("Erreur récupération restaurant :", erreur);
    return reponse
      .status(500)
      .json({ message: "Erreur lors de la récupération du restaurant" });
  }
}

async function obtenirRestaurant(requete, reponse) {
  try {
    if (!mongoose.Types.ObjectId.isValid(requete.params.id)) {
      return reponse
        .status(400)
        .json({ message: "Identifiant de restaurant invalide" });
    }

    const restaurant = await Restaurant.findById(requete.params.id).select(
      "-proprietaireId",
    );

    if (!restaurant || !restaurant.actif) {
      return reponse.status(404).json({ message: "Restaurant introuvable" });
    }

    return reponse.json(restaurant);
  } catch (erreur) {
    console.error("Erreur récupération restaurant public :", erreur);
    return reponse
      .status(500)
      .json({ message: "Erreur lors de la récupération du restaurant" });
  }
}

async function modifierMonRestaurant(requete, reponse) {
  try {
    const champsAutorises = [
      "nom",
      "description",
      "adresse",
      "telephone",
      "image",
      "estOuvert",
    ];

    const modifications = {};
    for (const champ of champsAutorises) {
      if (requete.body[champ] !== undefined) {
        modifications[champ] = requete.body[champ];
      }
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      { proprietaireId: requete.utilisateur.id },
      modifications,
      { new: true, runValidators: true },
    );

    if (!restaurant) {
      return reponse.status(404).json({ message: "Restaurant introuvable" });
    }

    return reponse.json(restaurant);
  } catch (erreur) {
    console.error("Erreur modification restaurant :", erreur);
    return reponse
      .status(500)
      .json({ message: "Erreur lors de la modification du restaurant" });
  }
}

async function changerStatutOuverture(requete, reponse) {
  try {
    const { estOuvert } = requete.body;

    if (typeof estOuvert !== "boolean") {
      return reponse
        .status(400)
        .json({ message: "Le champ estOuvert doit être un booléen" });
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      { proprietaireId: requete.utilisateur.id },
      { estOuvert },
      { new: true, runValidators: true },
    );

    if (!restaurant) {
      return reponse.status(404).json({ message: "Restaurant introuvable" });
    }

    return reponse.json({
      message: estOuvert ? "Restaurant ouvert" : "Restaurant fermé",
      restaurant,
    });
  } catch (erreur) {
    console.error("Erreur changement statut restaurant :", erreur);
    return reponse
      .status(500)
      .json({ message: "Erreur lors du changement de statut" });
  }
}

module.exports.creerRestaurant = creerRestaurant;
module.exports.obtenirMonRestaurant = obtenirMonRestaurant;
module.exports.obtenirRestaurant = obtenirRestaurant;
module.exports.modifierMonRestaurant = modifierMonRestaurant;
module.exports.changerStatutOuverture = changerStatutOuverture;
module.exports.dashboardRestaurant = dashboardRestaurant;
/*
module.exports = {
  creerRestaurant,
  obtenirMonRestaurant,
  obtenirRestaurant,
  modifierMonRestaurant,
  dashboardRestaurant,
  changerStatutOuverture
};
*/
