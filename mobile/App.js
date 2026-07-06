// Point d'entrée de l'application
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EcranConnexion from "./src/ecrans/EcranConnexion";
import EcranInscription from "./src/ecrans/EcranInscription";
import EcranAccueil from "./src/ecrans/EcranAccueil";

const Pile = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Pile.Navigator initialRouteName="Connexion">
        <Pile.Screen
          name="Connexion"
          component={EcranConnexion}
          options={{ title: "Connexion" }}
        />
        <Pile.Screen
          name="Inscription"
          component={EcranInscription}
          options={{ title: "Créer un compte" }}
        />
        <Pile.Screen
          name="Accueil"
          component={EcranAccueil}
          options={{ title: "Restaurants" }}
        />
      </Pile.Navigator>
    </NavigationContainer>
  );
}
