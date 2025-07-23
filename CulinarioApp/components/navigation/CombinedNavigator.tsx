import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../../screens/HomeScreen";
import RecipeScreen from "../../screens/RecipeScreen";
import CookingModeScreen from "../../screens/CookingModeScreen";
import SettingsScreen from "../../screens/SettingsScreen";
import AddRecipeScreen from "../../screens/AddRecipeScreen";
import CustomTabBar from "./CustomTabBar";
import ShoppingListScreen from "../../screens/ShoppingListScreen";

export type HomeStackParamList = {
    Home: undefined;
    Recipe: { recipeId: string };
    CookingMode: { recipeId: string };
    Settings: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Recipe" component={RecipeScreen} />
            <Stack.Screen name="CookingMode" component={CookingModeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    );
};

export type TabParamList = {
    Home: undefined;
    AddRecipe: undefined;
    List: undefined;
    ShoppingList: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
    return (
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ 
          headerShown: false
        }}>
        <Tab.Screen name="Home" component={HomeStackNavigator} options={{ title: "Home" }} />
        <Tab.Screen name="AddRecipe" component={AddRecipeScreen} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="ShoppingList" component={ShoppingListScreen} />
      </Tab.Navigator>
    );
  };

export default TabNavigator;