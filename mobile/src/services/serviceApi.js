// Service d'appel à l'API REST
import clientHttp from "./clientHttp";
import Plat from "../modeles/plat";

export async function obtenirPlats(restaurantId) {
  const reponse = await clientHttp.get(`/restaurants/${restaurantId}/plats`);

  // Boucle explicite pour construire la liste
  const plats = [];
  for (let i = 0; i < reponse.data.length; i++) {
    plats.push(Plat.depuisJson(reponse.data[i]));
  }
  return plats;
}
