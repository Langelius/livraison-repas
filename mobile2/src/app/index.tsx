import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20
    }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        🍔 Food Delivery
      </Text>

      <Text style={{ marginTop: 10, textAlign: "center" }}>
        Commande tes repas facilement
      </Text>

      <Pressable
        onPress={() => router.push("/login")}
        style={{
          marginTop: 30,
          backgroundColor: "black",
          padding: 15,
          borderRadius: 10
        }}
      >
        <Text style={{ color: "white" }}>Se connecter</Text>
      </Pressable>
    </View>
  );
}