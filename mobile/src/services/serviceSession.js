// Stockage local de la session (jeton JWT et utilisateur connecté)
import AsyncStorage from "@react-native-async-storage/async-storage";

const CLE_JETON = "jeton";
const CLE_UTILISATEUR = "utilisateur";

export async function sauvegarderSession(jeton, utilisateur) {
  await AsyncStorage.setItem(CLE_JETON, jeton);
  await AsyncStorage.setItem(CLE_UTILISATEUR, JSON.stringify(utilisateur));
}

export async function obtenirJeton() {
  return AsyncStorage.getItem(CLE_JETON);
}

export async function obtenirUtilisateur() {
  const valeur = await AsyncStorage.getItem(CLE_UTILISATEUR);
  if (!valeur) {
    return null;
  }
  return JSON.parse(valeur);
}

// La déconnexion invalide la session côté client en effaçant le jeton
export async function effacerSession() {
  await AsyncStorage.removeItem(CLE_JETON);
  await AsyncStorage.removeItem(CLE_UTILISATEUR);
}
