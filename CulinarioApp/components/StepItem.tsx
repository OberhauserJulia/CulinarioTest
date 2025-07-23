import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PreparationStepType } from '../context/RecipeContext';

import StepIngredientItem from './StepIngredientItem';

interface StepItemProps {
  step: PreparationStepType;
  servings?: number;
}

export default function StepItem({ step, servings = 1 }: StepItemProps) {
  return (
    <View style={styles.container}>
        <View style={styles.stepNumber}>
            <Text style={styles.textBody}> {step.stepNumber}. Schritt </Text>
        </View>

        <Text style={styles.textBody}>{step.description}</Text>

        {step.ingredients && step.ingredients.length > 0 && (
          <View style={styles.ingredientContainer}>
            {step.ingredients.map((ingredient, index) => (
              <StepIngredientItem 
                key={`${step.stepNumber}-${index}`} 
                ingredient={ingredient} 
                servings={servings} 
              />
            ))}
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 12,
    },

    stepNumber: {
        backgroundColor: '#66A182',
        padding: 6,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
    },

    ingredientContainer: {
        backgroundColor: '#222222',
        padding: 6,
        borderRadius: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

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