// Point d'entrée du serveur
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connecterBaseDeDonnees = require("./config/db");
const routesAuth = require("./routes/auth");
const routesCommandes = require("./routes/commandes");

const application = express();
application.use(cors());
application.use(express.json());

// Connexion à la base de données
connecterBaseDeDonnees();

// Routes
application.use("/api/auth", routesAuth);
application.use("/api/commandes", routesCommandes);

application.get("/", (requete, reponse) => {
  reponse.json({ message: "API de livraison de repas — en ligne" });
});

const port = process.env.PORT || 3000;
application.listen(port, () => {
  console.log("Serveur démarré sur le port " + port);
});
