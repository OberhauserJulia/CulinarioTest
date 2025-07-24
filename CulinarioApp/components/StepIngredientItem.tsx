import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { IngredientType } from '../context/RecipeContext';
import { ingredients } from '../data/ingredients';


interface StepIngredientItemProps {
  ingredient: IngredientType;
  servings?: number;
  originalServings?: number;
}

const StepIngredientItem: React.FC<StepIngredientItemProps> = ({ ingredient, servings = 1, originalServings }) => {
    // Berechne die angepasste Menge basierend auf der Portionsanzahl und Original-Portionen
    const origServings = typeof originalServings === 'number' ? originalServings : (typeof ingredient.originalServings === 'number' ? ingredient.originalServings : 2);
    let adjustedAmount = ingredient.amount;
    if (servings && origServings && servings !== origServings) {
        adjustedAmount = ingredient.amount * (servings / origServings);
    }

    // Funktion zum Rendern des Bildes
    const getIngredientImage = () => {
        // Zuerst versuchen, das Bild basierend auf dem Namen aus der ingredients.ts zu finden
        const foundIngredient = ingredients.find(ing => 
            ing.name.toLowerCase() === ingredient.name.toLowerCase()
        );
        
        if (foundIngredient) {
            return <Image style={styles.image} source={foundIngredient.image} />;
        }
        
        // Fallback-Bild verwenden
        return (
        <Image style={styles.image} source={require('../assets/ingredientImages/ghost.png')} />
        );
    };

    return (
        <View style={styles.ingredientItem}>
            {getIngredientImage()}
            <Text style={styles.textBody}>
                {(ingredient.amount && adjustedAmount !== 0)
                  ? `${Number.isFinite(adjustedAmount) ? (adjustedAmount % 1 === 0 ? adjustedAmount : adjustedAmount.toFixed(2)) : adjustedAmount} ${ingredient.unit} `
                  : ''}{ingredient.name}
            </Text>
        </View>
    );
};

export default StepIngredientItem;


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