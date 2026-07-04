import { View, Text, FlatList, Pressable, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const restaurants = [
  {
    id: "1",
    nom: "Pizza Express",
    image: "https://picsum.photos/400/200?random=1",
    note: "⭐ 4.8",
    delai: "20-30 min",
  },
  {
    id: "2",
    nom: "Burger House",
    image: "https://picsum.photos/400/200?random=2",
    note: "⭐ 4.6",
    delai: "15-25 min",
  },
  {
    id: "3",
    nom: "Sushi Time",
    image: "https://picsum.photos/400/200?random=3",
    note: "⭐ 4.9",
    delai: "30-40 min",
  },
];

export default function Restaurants() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Restaurants</Text>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.carte}
            onPress={() => router.push(`/restaurant/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.nom}>{item.nom}</Text>
              <Text>{item.note}</Text>
              <Text>{item.delai}</Text>
            </View>
          </Pressable>
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
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    padding: 12,
  },
  nom: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
});