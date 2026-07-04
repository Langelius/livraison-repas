import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      padding: 20,
    }}>
      <Text style={{
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
      }}>
        Connexion
      </Text>

      <TextInput
        placeholder="Email"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

      <Pressable
        onPress={() => router.push("/restaurants")}
        style={{
          backgroundColor: "#ff6b00",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Se connecter
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/register")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ textAlign: "center", color: "#ff6b00" }}>
          Créer un compte
        </Text>
      </Pressable>
    </View>
  );
}