// Point d'entrée du serveur
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const routesAuth = require("./routes/auth");
const routesCommandes = require("./routes/commandes");
const routesRestaurants = require("./routes/restaurants");

const application = express();
application.use(cors());
application.use(express.json());

// Connexion à la base de données
connectDB();

// Routes
application.use("/api/auth", routesAuth);
application.use("/api/commandes", routesCommandes);
application.use("/api/restaurants", routesRestaurants);

application.get("/", (requete, reponse) => {
  reponse.json({ message: "API de livraison de repas — en ligne" });
});

const port = process.env.PORT || 3000;
application.listen(port, () => {
  console.log("Serveur démarré sur le port " + port);
});
