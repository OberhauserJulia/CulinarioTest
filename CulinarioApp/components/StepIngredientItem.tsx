import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { IngredientType } from '../context/RecipeContext';
import { ingredients } from '../data/ingredients';

interface StepIngredientItemProps {
  ingredient: IngredientType;
  servings?: number;
}

export default function StepIngredientItem({ ingredient, servings = 1 }: StepIngredientItemProps) {
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
        <View style={styles.ingredientItem}>
            {getIngredientImage()}
            <Text style={styles.textBody}> {adjustedAmount} {ingredient.unit} {ingredient.name} </Text>
        </View>
    );
}

const styles = StyleSheet.create({

    ingredientItem: {
        backgroundColor: '#161616',
        borderRadius: 5,
        flexDirection: 'row',
        gap: 12,
        alignSelf: 'flex-start',
        padding: 6,
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