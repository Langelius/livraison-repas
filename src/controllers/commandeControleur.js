const Commande = require("../models/Commande");
const Produit = require("../models/Produit");
const Restaurant = require("../models/Restaurant");
//const { obtenirRestaurantProprietaire } = require("../utils/restaurant");

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

const obtenirUtilisateurId = (requete) => {
  return requete.utilisateur?.id || requete.user?.id;
};

const creerCommande = async (requete, reponse) => {
  try {
    const {
      clientId,
      restaurantId,
      produits,
      adresseLivraison,
      telephone,
      noteClient = "",
    } = requete.body;

    console.log("BODY REÇU :", requete.body);
    console.log("UTILISATEUR CONNECTÉ :", requete.utilisateur);

    if (
      !clientId ||
      !restaurantId ||
      !Array.isArray(produits) ||
      produits.length === 0 ||
      !adresseLivraison ||
      !telephone
    ) {
      return reponse.status(400).json({
        message: "Tous les champs obligatoires doivent être remplis",
      });
    }

    let montantTotal = 0;
    const lignesCommande = [];

    for (const item of produits) {
      const produit = await Produit.findOne({
        _id: item.produitId,
        restaurantId,
      });

      if (!produit) {
        return reponse.status(404).json({
          message: `Produit introuvable : ${item.produitId}`,
        });
      }

      const quantite = Number(item.quantite);

      if (!Number.isInteger(quantite) || quantite < 1) {
        return reponse.status(400).json({
          message: "La quantité doit être un nombre entier supérieur à zéro",
        });
      }

      if (produit.stock < quantite) {
        return reponse.status(400).json({
          message: `Stock insuffisant pour le produit ${produit.nom}`,
        });
      }

      const sousTotal = produit.prix * quantite;
      montantTotal += sousTotal;

      lignesCommande.push({
        produitId: produit._id,
        nom: produit.nom,
        prix: produit.prix,
        quantite,
        sousTotal,
      });
    }

    const commande = await Commande.create({
      clientId,
      restaurantId,
      produits: lignesCommande,
      montantTotal,
      adresseLivraison,
      telephone,
      noteClient,
    });

    return reponse.status(201).json({
      message: "Commande créée avec succès",
      commande,
    });
  } catch (erreur) {
    console.error("Erreur création commande :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la création de la commande",
      erreur: erreur.message,
    });
  }
};

const listerCommandesRestaurant = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const commandes = await Commande.find({
      restaurantId: restaurant._id,
    })
      .populate("clientId", "nom email telephone")
      .populate("produits.produitId", "nom prix")
      .sort({ createdAt: -1 });

    return reponse.status(200).json(commandes);
  } catch (erreur) {
    console.error("Erreur récupération commandes :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la récupération des commandes",
    });
  }
};

const obtenirCommande = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const commande = await Commande.findOne({
      _id: requete.params.id,
      restaurantId: restaurant._id,
    }).populate("clientId", "nom email telephone");

    if (!commande) {
      return reponse.status(404).json({
        message: "Commande introuvable",
      });
    }

    return reponse.status(200).json(commande);
  } catch (erreur) {
    console.error("Erreur récupération commande :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la récupération de la commande",
    });
  }
};

const modifierStatutCommande = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const { statut } = requete.body;

    const statutsAutorises = [
      "EN_ATTENTE",
      "ACCEPTEE",
      "EN_PREPARATION",
      "PRETE",
      "ANNULEE",
      "LIVREE",
    ];

    if (!statutsAutorises.includes(statut)) {
      return reponse.status(400).json({
        message: "Statut invalide",
      });
    }

    const commande = await Commande.findOneAndUpdate(
      {
        _id: requete.params.id,
        restaurantId: restaurant._id,
      },
      {
        statut,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!commande) {
      return reponse.status(404).json({
        message: "Commande introuvable",
      });
    }

    return reponse.status(200).json({
      message: "Statut modifié avec succès",
      commande,
    });
  } catch (erreur) {
    console.error("Erreur modification statut :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la modification du statut",
    });
  }
};

const supprimerCommande = async (requete, reponse) => {
  try {
    const restaurant = await obtenirRestaurantProprietaire(requete);

    if (!restaurant) {
      return reponse.status(404).json({
        message: "Aucun restaurant associé à cet utilisateur",
      });
    }

    const commande = await Commande.findOneAndDelete({
      _id: requete.params.id,
      restaurantId: restaurant._id,
    });

    if (!commande) {
      return reponse.status(404).json({
        message: "Commande introuvable",
      });
    }

    return reponse.status(200).json({
      message: "Commande supprimée avec succès",
    });
  } catch (erreur) {
    console.error("Erreur suppression commande :", erreur);

    return reponse.status(500).json({
      message: "Erreur lors de la suppression de la commande",
    });
  }
};

module.exports = {
  creerCommande,
  listerCommandesRestaurant,
  obtenirCommande,
  modifierStatutCommande,
  supprimerCommande,
};
