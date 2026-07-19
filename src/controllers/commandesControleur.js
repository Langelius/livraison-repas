// Logique des commandes
const Commande = require("../models/Commande");

async function creerCommande(requete, reponse) {
  const { restaurantId, plats, adresseLivraison } = requete.body;

  // Calcul du total avec une boucle explicite
  let total = 0;
  for (let i = 0; i < plats.length; i++) {
    total = total + (plats[i].prix || 0) * (plats[i].quantite || 1);
  }

  const commande = await Commande.create({
    utilisateurId: requete.utilisateur.id,
    restaurantId: restaurantId,
    plats: plats,
    total: total,
    adresseLivraison: adresseLivraison
  });

  reponse.status(201).json(commande);
}

async function obtenirCommande(requete, reponse) {
  const commande = await Commande.findById(requete.params.id);
  if (!commande) {
    return reponse.status(404).json({ message: "Commande introuvable" });
  }
  reponse.json(commande);
}

module.exports = { creerCommande, obtenirCommande };
