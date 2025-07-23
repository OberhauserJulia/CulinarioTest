import React from "react";
import { RecipeProvider } from "./context/RecipeContext";
import { IngredientProvider } from "./context/IngredientContext";
import { useFonts } from "expo-font";
import TabNavigator from "./components/navigation/CombinedNavigator";
import { NavigationContainer } from "@react-navigation/native";
import "./global.css"


export default function App() {
  const [fontsLoaded] = useFonts({
    "MontserratBold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "RobotoBold": require("./assets/fonts/Roboto-Bold.ttf"),
    "RobotoMedium": require("./assets/fonts/Roboto-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <RecipeProvider>
      <IngredientProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </IngredientProvider>
    </RecipeProvider>
  );
}