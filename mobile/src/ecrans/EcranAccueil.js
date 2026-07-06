// Écran d'accueil : liste des restaurants
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { deconnecter } from "../services/serviceAuth";

export default function EcranAccueil({ navigation }) {
  async function gererDeconnexion() {
    await deconnecter();
    // Retour à la connexion sans possibilité de revenir en arrière
    navigation.reset({ index: 0, routes: [{ name: "Connexion" }] });
  }

  return (
    <View style={styles.conteneur}>
      <Text style={styles.texte}>Liste des restaurants à venir</Text>
      <TouchableOpacity style={styles.bouton} onPress={gererDeconnexion}>
        <Text style={styles.texteBouton}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { flex: 1, justifyContent: "center", alignItems: "center" },
  texte: { fontSize: 16, color: "#2E5F8A" },
  bouton: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#2E5F8A",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  texteBouton: { color: "#2E5F8A", fontWeight: "bold" }
});
