import React, { useState, useContext, useEffect, useMemo } from "react";
import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "../components/navigation/CombinedNavigator";
import { RecipeContext } from "../context/RecipeContext";

import { Searchbar } from 'react-native-paper';

// Imports Components
import SmallButton from '../components/SmallButton';
import CategoryItem from '../components/CategoryItem';
import RecipeItem from '../components/RecipeItem';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;
type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Alle");
  const [searchQuery, setSearchQuery] = useState('');
  const { recipes, loading, error, loadRecipes } = useContext(RecipeContext);

  // Kategorien dynamisch aus Rezepten extrahieren (wie in AddRecipeScreen)
  const categoryOptions = useMemo(() => {
    const base = ["Vorspeise", "Hauptgericht", "Dessert"];
    // Nur string-Kategorien zulassen, undefined ausschließen
    const recipeCategories = Array.from(new Set(recipes.map(r => r.category).filter((cat): cat is string => typeof cat === 'string' && !!cat)));
    // Basis-Kategorien zuerst, dann neue, ohne Duplikate
    return ["Alle", ...base, ...recipeCategories.filter(cat => !base.includes(cat))];
  }, [recipes]);

  // Filtere Rezepte basierend auf Kategorie und Suchbegriff
  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === "Alle" || recipe.category === selectedCategory;
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  if (loading && recipes.length === 0) {
    return (
      <View className="flex-1 h-full justify-center items-center bg-darkbackground">
        <ActivityIndicator size="large" color="#66A182" />
        <Text className="text-white mt-4">Lade Rezepte...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 h-full flex-col gap-6 bg-darkbackground p-6 pt-[48px]">
      <StatusBar style="light" />

      {/* Filter Bar */}
      <View className="flex-row gap-6">
        <Searchbar
          placeholder="Rezept suchen..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          iconColor="white"
          placeholderTextColor="white"
          inputStyle={{ color: 'white' }}
          style={{ flex: 1, height: 49, padding: 0, borderWidth: 1, borderRadius: 15, borderColor: '#66A182', backgroundColor: '#222222' }}
        />
        <SmallButton settings={true} />
      </View>

      {/* Category Item */}
      <View className="w-full h-auto">
        <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row', gap: 12 }} showsHorizontalScrollIndicator={false}>
          {categoryOptions.map((cat) => (
            <CategoryItem
              key={cat}
              category={cat as string}
              isSelected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat as string)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Recipe List */}
      <ScrollView contentContainerStyle={{ flexDirection: 'column', gap: 24, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {error && (
          <View className="bg-red-500/20 p-4 rounded-lg mb-4">
            <Text className="text-red-300 text-center">{error}</Text>
          </View>
        )}

        {filteredRecipes.length === 0 ? (
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-white text-lg text-center">
              {searchQuery ? 'Keine Rezepte gefunden' : 'Keine Rezepte vorhanden'}
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              {searchQuery ? 'Versuche einen anderen Suchbegriff' : 'Füge dein erstes Rezept hinzu!'}
            </Text>
          </View>
        ) : (
          filteredRecipes
            .filter(recipe => typeof recipe.id === "string" && recipe.id)
            .map((recipe) => (
              <RecipeItem
                key={recipe.id}
                recipe={recipe}
                onPress={() => navigation.navigate("Recipe", { recipeId: recipe.id as string })}
              />
            ))
        )}
      </ScrollView>
    </View>
  );
}