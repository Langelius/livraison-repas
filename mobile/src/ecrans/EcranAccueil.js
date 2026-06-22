// Écran d'accueil : liste des restaurants
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EcranAccueil() {
  return (
    <View style={styles.conteneur}>
      <Text style={styles.texte}>Liste des restaurants à venir</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { flex: 1, justifyContent: "center", alignItems: "center" },
  texte: { fontSize: 16, color: "#2E5F8A" },
});
