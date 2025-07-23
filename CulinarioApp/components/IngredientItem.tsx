import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { IngredientType } from '../context/RecipeContext';
import { ingredients } from '../data/ingredients';

interface IngredientItemProps {
  ingredient: IngredientType;
  servings?: number;
}

export default function IngredientItem({ ingredient, servings = 1 }: IngredientItemProps) {
  // Berechne die angepasste Menge basierend auf der Portionsanzahl
  const adjustedAmount = ingredient.amount * servings;

  // Funktion zum Rendern des Bildes
  const getIngredientImage = () => {
    // Zuerst versuchen, das Bild basierend auf dem Namen aus der ingredients.ts zu finden
    const foundIngredient = ingredients.find(ing => 
      ing.name.toLowerCase() === ingredient.name.toLowerCase()
    );
    
    if (foundIngredient) {
      return <Image style={styles.image} source={foundIngredient.image} />;
    }
    
    // Falls in ingredient.image eine URI vorhanden ist, diese verwenden
    if (ingredient.image) {
      return <Image style={styles.image} source={{ uri: ingredient.image }} />;
    }
    
    // Fallback-Bild verwenden
    return <Image style={styles.image} source={require('../assets/ingredientImages/milkproducts/butter.png')} />;
  };

  return (
    <View style={styles.container}>
        <View style={styles.ingedientContainer}>
            <View style={styles.imageContainer}>
                {getIngredientImage()}
            </View>
            <Text style={styles.textBody}> {ingredient.name} </Text>
        </View>
        <Text style={styles.textBody}> {adjustedAmount} {ingredient.unit} </Text>
    </View>
  );
}
 
const styles = StyleSheet.create({ 

    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    ingedientContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },

    imageContainer: {
        height: 27.5,
        width: 27.5,
        padding: 6,
        backgroundColor: '#222222',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        height: 20,
        width: 20,
    },

    textBody: {
        color: '#FFFFFF',
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 'medium',
        lineHeight: 25,
    },
});