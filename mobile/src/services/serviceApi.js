// Service d'appel à l'API REST
import axios from "axios";
import Plat from "../modeles/plat";

// 10.0.2.2 = localhost de la machine vu depuis l'émulateur Android
const urlBase = "http://10.0.2.2:3000/api";

export async function obtenirPlats(restaurantId) {
  const reponse = await axios.get(
    `${urlBase}/restaurants/${restaurantId}/plats`
  );

  // Boucle explicite pour construire la liste
  const plats = [];
  for (let i = 0; i < reponse.data.length; i++) {
    plats.push(Plat.depuisJson(reponse.data[i]));
  }
  return plats;
}
