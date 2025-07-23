import React, { useState, useContext, useEffect } from "react";
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
    <View className="flex-1 h-full flex-col gap-6 bg-darkbackground p-6 pt-[68px]">
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
            <View style={{ flex: 0, flexShrink: 1 }}>
        <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row', gap: 12 }} showsHorizontalScrollIndicator={false}>
          <CategoryItem
            category="Alle"
            isSelected={selectedCategory === "Alle"}
            onPress={() => setSelectedCategory("Alle")}
          />
          <CategoryItem
            category="Vorspeise"
            isSelected={selectedCategory === "Vorspeise"}
            onPress={() => setSelectedCategory("Vorspeise")}
          />
          <CategoryItem
            category="Hauptgericht"
            isSelected={selectedCategory === "Hauptgericht"}
            onPress={() => setSelectedCategory("Hauptgericht")}
          />
          <CategoryItem
            category="Dessert"
            isSelected={selectedCategory === "Dessert"}
            onPress={() => setSelectedCategory("Dessert")}
          />
        </ScrollView>
      </View>

      {/* Recipe List */}
      <ScrollView style={{ flex: 1, flexGrow: 1 }} contentContainerStyle={{ flexDirection: 'column', gap: 24, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
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
          filteredRecipes.map((recipe) => (
            <RecipeItem key={recipe.id} recipe={recipe} />
          ))
        )}
        
        {loading && recipes.length > 0 && (
          <View className="py-4">
            <ActivityIndicator size="small" color="#66A182" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}