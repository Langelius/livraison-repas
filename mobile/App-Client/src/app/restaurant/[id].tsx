import React from "react";
import {
  View,
 Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const menu = [
  {
    id: "1",
    nom: "🍕 Pizza Margherita",
    prix: 12.99,
  },
  {
    id: "2",
    nom: "🍔 Burger Classic",
    prix: 14.99,
  },
  {
    id: "3",
    nom: "🍟 Frites",
    prix: 4.99,
  },
  {
    id: "4",
    nom: "🥤 Coca-Cola",
    prix: 2.99,
  },
];

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>
        Restaurant #{id}
      </Text>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.carte}>
            <Text style={styles.nom}>{item.nom}</Text>

            <Text style={styles.prix}>
              {item.prix.toFixed(2)} $
            </Text>

            <Pressable
              style={styles.bouton}
              onPress={() => router.push("/panier")}
            >
              <Text style={styles.texteBouton}>
                Ajouter au panier
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },

  titre: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  carte: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  nom: {
    fontSize: 20,
    fontWeight: "bold",
  },

  prix: {
    fontSize: 18,
    marginVertical: 10,
    color: "green",
  },

  bouton: {
    backgroundColor: "#ff6b00",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  texteBouton: {
    color: "white",
    fontWeight: "bold",
  },
});