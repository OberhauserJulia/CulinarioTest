import React, { useState } from 'react';
import { ingredients as allIngredientsData } from '../data/ingredients';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import IngredientModal from "./IngredientModal";
import StepIngredientItem from './StepIngredientItem';

interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

interface InputFieldProps {
  stepNumber: number;
  placeholder: string;
  description: string;
  onDescriptionChange: (text: string) => void;
  ingredients: Ingredient[];
  onIngredientsChange?: (selected: Ingredient[]) => void;
}

export default function InputFieldSteps({ stepNumber, placeholder, description, onDescriptionChange, ingredients, onIngredientsChange }: InputFieldProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);

  // Wenn Modal geöffnet wird, setze die aktuelle Auswahl zurück auf die aktuelle Auswahl aus dem Parent (falls gewünscht)
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleSaveIngredients = (ings: Ingredient[]) => {
    setSelectedIngredients(ings);
    if (onIngredientsChange) {
      onIngredientsChange(ings);
    }
    setModalVisible(false);
  };

  return (
    <View className="flex-col gap-6">
      <View className="bg-primary h-[40px] p-[6px] text-center font-robotoMedium items-center justify-center rounded-[5px] self-start">
        <Text className="text-[16px] font-robotoMedium leading-[25px] text-white text-center">{stepNumber}. Schritt</Text>
      </View>
      <View className="flex-1 flex-col w-full items-center">
        <TextInput
          className="bg-lightbackground rounded-[15px] p-[10px] flex-1 w-full"
          placeholder={placeholder}
          placeholderTextColor="#FFFFFF80"
          value={description}
          onChangeText={onDescriptionChange}
          multiline={true}
          style={{
            minHeight: 112,
            fontFamily: 'Roboto-Medium',
            fontSize: 16,
            color: '#FFFFFF',
            lineHeight: 25,
          }}
        />
        
        <View className="h-[1px] w-[90%] bg-primary"/>
        <View className="bg-lightbackground p-3 rounded-[15px] w-full" style={styles.ingredientContainer}>
          <TouchableOpacity style={styles.ingredientItem} onPress={handleOpenModal}>
            <Plus style={styles.image} />
            <Text style={styles.textBody}> Zutat hinzufügen </Text>
          </TouchableOpacity>

          {/* Anzeige der ausgewählten Zutaten für diesen Schritt */}
          {selectedIngredients.map((ing, idx) => {
              // Bild aus globaler ingredients-Liste suchen
              const found = allIngredientsData.find((i: any) => i.name.toLowerCase() === ing.name.toLowerCase());
              // Menge und Einheit parsen
              const amountMatch = ing.amount.match(/([\d,.]+)/);
              const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : 0;
              const unit = ing.amount.replace(/^[\d,.]+\s*/, '');
              return (
                <StepIngredientItem
                  key={ing.id + idx}
                  ingredient={{
                    name: ing.name,
                    amount: amount,
                    unit: unit,
                    image: found ? found.image : undefined
                  }}
                />
              );
            })}

        </View>
      </View>
      <IngredientModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        ingredients={ingredients}
        onSave={handleSaveIngredients}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  ingredientItem: {
    backgroundColor: '#161616',
    borderRadius: 5,
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'flex-start',
    padding: 6,
  },

  image: {
    height: 20,
    width: 20,
    color: 'white',
  },

  ingredientContainer: {
        backgroundColor: '#222222',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

  textBody: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'medium',
    lineHeight: 25,
  },
});