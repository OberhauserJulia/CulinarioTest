import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../components/navigation/CombinedNavigator';
import { RecipeType } from '../context/RecipeContext';
import { getRecipeById } from '../firebase/recipeService';

// Imports Components
import SmallButton from '../components/SmallButton';
import BigButton from '../components/BigButton';
import IngredientItem from '../components/IngredientItem';
import StepItem from '../components/StepItem';

type RecipeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Recipe'>;
type RecipeScreenRouteProp = RouteProp<HomeStackParamList, 'Recipe'>;

type Props = {
  navigation: RecipeScreenNavigationProp;
  route: RecipeScreenRouteProp;
};

export default function RecipeScreen({ route }: Props) {
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [servings, setServings] = useState(2); // State für die Portionsanzahl
  const { recipeId } = route.params;

  // Funktionen für Portionsänderung
  const decreaseServings = () => {
    if (servings > 1) {
      setServings(servings - 1);
    }
  };

  const increaseServings = () => {
    setServings(servings + 1);
  };

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedRecipe = await getRecipeById(recipeId);
        setRecipe(fetchedRecipe);
        console.log('Geladenes Rezeptbild:', fetchedRecipe?.image);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden des Rezepts');
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipe();
  }, [recipeId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#161616' }]}>
        <ActivityIndicator size="large" color="#66A182" />
        <Text style={[styles.textH2, { marginTop: 16 }]}>Lade Rezept...</Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#161616' }]}>
        <Text style={[styles.textH2, { color: '#ff6b6b', textAlign: 'center', marginHorizontal: 24 }]}>
          {error || 'Rezept nicht gefunden'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar style="light" />

        <ImageBackground 
          source={recipe.image ? { uri: recipe.image } : require('../assets/recipeImages/marry-me-gnocchi.jpg')} 
          style={styles.imageContainer}
        >

          {/* Top Bar */}
          <View style={styles.topBar}>
            <SmallButton back={true} />
            <SmallButton shoppingCart={true} />
          </View>
        </ImageBackground>

        <View style={styles.recipeContainer}>
          <Image style={{ alignSelf: 'center' }} source={require('../assets/icons/homeIndicator.png')} />
          <Text style={styles.textH1}> {recipe.name} </Text>

          <View style={styles.infoCointainer}>
            <Text style={styles.textH2}>{recipe.source || 'Unbekannt'}</Text>
            <View style={styles.verticalDivider} />
            <Text style={styles.textH2}>{recipe.ovensettings || 'Keine Angabe'}</Text>
          </View>

          {/* Ingredients */}
          <View style={[styles.topBar, { padding: 0, paddingTop: 0 }]}>
            <Text style={[styles.textH2, { color: '#66A182' }]}> Zutaten </Text>

            {/* Amount Counter */}
            <View style={styles.amountCounter}>
              <TouchableOpacity 
                style={styles.amountCounterButton}
                onPress={decreaseServings}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.textH2}> {servings} </Text>
              <TouchableOpacity 
                style={styles.amountCounterButton}
                onPress={increaseServings}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ingredient List */}
          <View style={styles.ingredientList}>
            {recipe.ingredients.map((ingredient, index) => (
              <IngredientItem 
                key={index} 
                ingredient={ingredient} 
                servings={servings} 
              />
            ))}
          </View>

          {/* Divider */}
          <View style={styles.horizontalDivider} />

          {/* Steps */}
          <Text style={[styles.textH2, { color: '#66A182' }]}> Zubereitung </Text>

          {recipe.preparationSteps.map((step, index) => (
            <StepItem 
              key={index} 
              step={step} 
              servings={servings} 
            />
          ))}
        </View>
      </ScrollView>

      {/* Fixed Big Button */}
      <View style={styles.fixedButtonContainer}>
        <BigButton cookingMode={true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },

  scrollContainer: {
    paddingBottom: 60,
    backgroundColor: '#161616',
  },

  imageContainer: {
    width: '100%',
    height: 360,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 68,
  },

  recipeContainer: {
    flex: 1,
    gap: 24,
    padding: 24,
    backgroundColor: '#161616',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: -15,
  },

  infoCointainer: {
    backgroundColor: '#222222',
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
    padding: 12,
    borderRadius: 15,
  },

  amountCounter: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },

  amountCounterButton: {
    backgroundColor: '#222222',
    borderRadius: 5,
    height: 27.5,
    width: 27.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ingredientList: {
    flexDirection: 'column',
    gap: 12,
  },

  horizontalDivider: {
    backgroundColor: '#66A182',
    height: 1,
  },

  verticalDivider: {
    backgroundColor: '#66A182',
    width: 1,
    height: 30,
  },

  textH1: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontSize: 24,
    fontWeight: 'bold',
  },

  textH2: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
  },

  counterButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  fixedButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
  },
});