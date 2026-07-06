// Appels API d'authentification (inscription, connexion, déconnexion)
import clientHttp from "./clientHttp";
import { sauvegarderSession, effacerSession } from "./serviceSession";

export async function inscrire(nom, courriel, motDePasse) {
  const reponse = await clientHttp.post("/auth/inscription", {
    nom: nom,
    courriel: courriel,
    motDePasse: motDePasse
  });
  await sauvegarderSession(reponse.data.token, reponse.data.utilisateur);
  return reponse.data.utilisateur;
}

export async function connecter(courriel, motDePasse) {
  const reponse = await clientHttp.post("/auth/connexion", {
    courriel: courriel,
    motDePasse: motDePasse
  });
  await sauvegarderSession(reponse.data.token, reponse.data.utilisateur);
  return reponse.data.utilisateur;
}

// Déconnexion sécurisée : le jeton est effacé du stockage local
export async function deconnecter() {
  await effacerSession();
}
