// Client HTTP partagé : ajoute automatiquement le jeton JWT aux requêtes
import axios from "axios";
import { obtenirJeton } from "./serviceSession";

// 10.0.2.2 = localhost de la machine vu depuis l'émulateur Android
const urlBase = "http://10.0.2.2:3000/api";

const clientHttp = axios.create({ baseURL: urlBase });

clientHttp.interceptors.request.use(async (configuration) => {
  const jeton = await obtenirJeton();
  if (jeton) {
    configuration.headers.Authorization = "Bearer " + jeton;
  }
  return configuration;
});

export default clientHttp;
