import { View, Text } from "react-native";

export default function Panier() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 28 }}>
        🛒 Panier
      </Text>

      <Text>Le panier sera développé à l'étape suivante.</Text>
    </View>
  );
}