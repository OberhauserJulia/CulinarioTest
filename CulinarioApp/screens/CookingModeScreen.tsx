import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../components/navigation/CombinedNavigator';
import { RecipeType } from '../context/RecipeContext';
import { getRecipeById } from '../firebase/recipeService';
import SmallButton from '../components/SmallButton';
import BigButton from '../components/BigButton';
import StepIngredientItem from '../components/StepIngredientItem';

type CookingModeScreenRouteProp = RouteProp<HomeStackParamList, 'CookingMode'>;

type Props = {
  route: CookingModeScreenRouteProp;
};

export default function CookingModeScreen({ route }: Props) {
    const { recipeId } = route.params;
    const [recipe, setRecipe] = useState<RecipeType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const loadRecipe = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedRecipe = await getRecipeById(recipeId);
                setRecipe(fetchedRecipe);
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
                <Text style={[styles.textH1, { marginTop: 16 }]}>Lade Rezept...</Text>
            </View>
        );
    }

    if (error || !recipe || !recipe.preparationSteps || recipe.preparationSteps.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#161616' }]}> 
                <Text style={[styles.textH1, { color: '#ff6b6b', textAlign: 'center', marginHorizontal: 24 }]}> {error || 'Keine Schritte gefunden'} </Text>
            </View>
        );
    }

    const step = recipe.preparationSteps[stepIndex];

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <StatusBar style="light" />

                {/* Top Bar */}
                <View style={styles.topBar}>
                    <SmallButton back={true} />
                    <SmallButton dots={true} />
                </View>

                <View style={styles.stepNumber}>
                    <Text style={styles.textH1}>{step.stepNumber}. Schritt</Text>
                </View>

                <Text style={styles.textBody}>{step.description}</Text>

                {step.ingredients && step.ingredients.length > 0 && (
                    <View style={styles.ingredientContainer}>
                        {step.ingredients.map((ingredient, idx) => (
                            <StepIngredientItem key={idx} ingredient={ingredient} />
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Fixed Big Button */}
            <View style={styles.fixedButtonContainer}>
                <BigButton
                    forward={true}
                    onPress={() => setStepIndex((prev) => Math.min(prev + 1, recipe.preparationSteps.length - 1))}
                    disabled={stepIndex === recipe.preparationSteps.length - 1}
                />
                <BigButton
                    back={true}
                    onPress={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={stepIndex === 0}
                />
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
        flex: 1,
        flexDirection: 'column',
        gap: 24,
        backgroundColor: '#161616',
        padding: 24,
        paddingTop: 68,
    },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

    fixedButtonContainer: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        paddingLeft: 24,
        paddingRight: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 24,
        width: '100%',
    },

    textH1: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat',
        fontSize: 24,
        fontWeight: 'bold',
    },

    textBody: {
        color: '#FFFFFF',
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 'medium',
        lineHeight: 25,
    },
});