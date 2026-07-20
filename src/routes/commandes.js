const express = require("express");

const controleurCommandes = require("../controllers/commandeControleur");
const authentification = require("../middleware/auth");

const router = express.Router();

router.post("/", authentification, controleurCommandes.creerCommande);

router.get(
  "/restaurant",
  authentification,
  controleurCommandes.listerCommandesRestaurant,
);

router.get("/:id", authentification, controleurCommandes.obtenirCommande);

router.patch(
  "/:id/statut",
  authentification,
  controleurCommandes.modifierStatutCommande,
);

router.delete("/:id", authentification, controleurCommandes.supprimerCommande);

module.exports = router;
