// Point d'entrée de l'application
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EcranAccueil from "./src/ecrans/EcranAccueil";

const Pile = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Pile.Navigator>
        <Pile.Screen
          name="Accueil"
          component={EcranAccueil}
          options={{ title: "Restaurants" }}
        />
      </Pile.Navigator>
    </NavigationContainer>
  );
}
