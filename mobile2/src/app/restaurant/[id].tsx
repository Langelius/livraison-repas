import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DetailRestaurant() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        Restaurant #{id}
      </Text>

      <Text style={{ marginTop: 20 }}>
        Ici nous afficherons le menu des plats.
      </Text>

      <Pressable
        style={{
          marginTop: 30,
          backgroundColor: "#ff6b00",
          padding: 15,
          borderRadius: 8,
        }}
        onPress={() => router.push("/panier")}
      >
        <Text style={{ color: "white" }}>Voir le panier</Text>
      </Pressable>
    </View>
  );
}