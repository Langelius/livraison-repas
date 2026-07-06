// Écran de connexion
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { connecter } from "../services/serviceAuth";

export default function EcranConnexion({ navigation }) {
  const [courriel, setCourriel] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function gererConnexion() {
    if (!courriel || !motDePasse) {
      setErreur("Veuillez remplir tous les champs");
      return;
    }

    setErreur("");
    setChargement(true);
    try {
      await connecter(courriel.trim(), motDePasse);
      // On repart d'une pile vide : impossible de revenir à la connexion
      navigation.reset({ index: 0, routes: [{ name: "Accueil" }] });
    } catch (e) {
      if (e.response && e.response.status === 401) {
        setErreur("Courriel ou mot de passe invalide");
      } else {
        setErreur("Connexion impossible, vérifiez le serveur");
      }
    } finally {
      setChargement(false);
    }
  }

  return (
    <View style={styles.conteneur}>
      <Text style={styles.titre}>Connexion</Text>

      {erreur !== "" && <Text style={styles.erreur}>{erreur}</Text>}

      <TextInput
        style={styles.champ}
        placeholder="Courriel"
        autoCapitalize="none"
        keyboardType="email-address"
        value={courriel}
        onChangeText={setCourriel}
      />
      <TextInput
        style={styles.champ}
        placeholder="Mot de passe"
        secureTextEntry
        value={motDePasse}
        onChangeText={setMotDePasse}
      />

      <TouchableOpacity
        style={styles.bouton}
        onPress={gererConnexion}
        disabled={chargement}
      >
        <Text style={styles.texteBouton}>
          {chargement ? "Connexion…" : "Se connecter"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Inscription")}>
        <Text style={styles.lien}>Pas de compte ? Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { flex: 1, justifyContent: "center", padding: 24 },
  titre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E5F8A",
    textAlign: "center",
    marginBottom: 24
  },
  champ: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  bouton: {
    backgroundColor: "#2E5F8A",
    borderRadius: 8,
    padding: 14,
    marginTop: 8
  },
  texteBouton: { color: "#FFFFFF", textAlign: "center", fontWeight: "bold" },
  lien: { color: "#2E5F8A", textAlign: "center", marginTop: 16 },
  erreur: { color: "#B00020", textAlign: "center", marginBottom: 12 }
});
