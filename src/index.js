// Point d'entrée du serveur

const dns = require("dns");

dns.setServers(["1.1.1.1"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

//const connectDB = require("./config/db");
//const express = require("express");
//const cors = require("cors");
//require("dotenv").config();

const connectDB = require("./config/db");
const routesAuth = require("./routes/auth");
const routesCommandes = require("./routes/commandes");
const routesRestaurants = require("./routes/restaurants");
const produitsRoutes = require("./routes/produitsRoute");
const categoriesRoutes = require("./routes/categoriesRoute");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDB();

// Routes
app.use("/api/auth", routesAuth);
app.use("/api/commandes", routesCommandes);
app.use("/api/restaurants", routesRestaurants);
app.use("/api/produits", produitsRoutes);
app.use("/api/categories", categoriesRoutes);

app.get("/", (requete, reponse) => {
  reponse.json({ message: "API de livraison de repas — en ligne" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Serveur démarré sur le port " + port);
});
