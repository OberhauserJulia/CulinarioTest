import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { X, ChevronDown, ChevronUp } from 'lucide-react-native';
import BigButton from "./BigButton";

interface Ingredient {
    id: string;
    name: string;
    amount: string;
}

interface IngredientModalProps {
    visible: boolean;
    onClose: () => void;
    ingredients: Ingredient[];
    onSave?: (selected: Ingredient[]) => void;
}


interface SelectedIngredient extends Ingredient {}

const IngredientModal: React.FC<IngredientModalProps> = ({ visible, onClose, ingredients, onSave }) => {
    const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
    const [isListVisible, setIsListVisible] = useState<boolean>(true);

    // Hilfsfunktion zum Parsen der Menge (z.B. "2 EL" -> 2, Einheit: EL)
    function parseAmount(amount: string): { value: number, unit: string } {
        const match = amount.match(/([\d,.]+)\s*(.*)/);
        if (match) {
            return { value: parseFloat(match[1].replace(',', '.')), unit: match[2] };
        }
        return { value: 1, unit: amount };
    }

    function formatAmount(value: number, unit: string): string {
        // Zeige max. eine Nachkommastelle
        return `${value % 1 === 0 ? value : value.toFixed(1)}${unit ? ' ' + unit : ''}`.trim();
    }

    const addIngredient = (ingredient: Ingredient) => {
        setSelectedIngredients((prev: SelectedIngredient[]) => {
            const existing = prev.find((item) => item.id === ingredient.id);
            if (existing) {
                // Optional: Zeige Toast oder ignoriere Mehrfachauswahl
                return prev;
            }
            return [...prev, { ...ingredient }];
        });
    };

    const updateAmount = (id: string, delta: number): void => {
        setSelectedIngredients((prev: SelectedIngredient[]) =>
            prev.map((item: SelectedIngredient) => {
                if (item.id === id) {
                    const { value, unit } = parseAmount(item.amount);
                    // Finde die maximale Menge aus der ingredients-Prop
                    const maxIngredient = ingredients.find(ing => ing.id === id);
                    let maxValue = maxIngredient ? parseAmount(maxIngredient.amount).value : undefined;
                    let newValue = value + delta;
                    if (newValue < 0.1) newValue = 0.1; // Mindestmenge
                    if (maxValue !== undefined && newValue > maxValue) newValue = maxValue;
                    return { ...item, amount: formatAmount(newValue, unit) };
                }
                return item;
            })
        );
    };

    // Zutat aus Auswahl entfernen
    const removeIngredient = (id: string) => {
        setSelectedIngredients((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/50 justify-center items-center p-6">
                <View className="flex-col w-full bg-lightbackground rounded-[15px] p-6 gap-6">
                    <View className="flex flex-row justify-between items-center">
                        <Text className="text-lg font-bold text-primary">Zutaten hinzufügen</Text>
                        <TouchableOpacity className="h-6 w-6 bg-darkbackground items-center justify-center rounded-full" onPress={onClose}>
                            <X size={15} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    {/* Oben: Ausgewählte Zutaten */}
                    <View className="flex-col w-full gap-3">
                        {selectedIngredients.map((item) => (
                            <View key={item.id} className="flex-row gap-3 items-center rounded-lg w-full">
                                <View className="flex-row">
                                    <TouchableOpacity onPress={() => updateAmount(item.id, -1)} className="h-[33.5px] w-[33.5px] items-center justify-center bg-darkbackground rounded-lg">
                                        <Text className="text-white">-</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => updateAmount(item.id, 1)} className="h-[33.5px] w-[33.5px] items-center justify-center bg-darkbackground rounded-lg">
                                        <Text className="text-white">+</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="h-[33.5px] flex-1 justify-center bg-darkbackground rounded-lg">
                                    <Text className="text-white mx-3">{`${item.amount} ${item.name}`}</Text>
                                </View>
                                <TouchableOpacity onPress={() => removeIngredient(item.id)} className="h-[33.5px] w-[33.5px] items-center justify-center ml-2">
                                    <X size={18} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <View className="flex-col w-full gap-3">
                        <TouchableOpacity onPress={() => setIsListVisible(!isListVisible)} className="flex-row justify-between items-center">
                            <Text className="text-sm text-gray-400 mt-3">Wähle die Zutaten aus, die du zum Zubereitungsschritt hinzufügen möchtest.</Text>
                            {isListVisible ? <ChevronUp size={20} color="#FFFFFF" /> : <ChevronDown size={20} color="#FFFFFF" />}
                        </TouchableOpacity>
                        {/* Zutatenliste */}
                        {isListVisible && (
                            <View className="bg-darkbackground p-[6px] rounded-[15px] flex-wrap flex-row gap-3">
                                {ingredients && ingredients.length > 0 ? (
                                    ingredients
                                        .filter((item) => !selectedIngredients.some(sel => sel.id === item.id))
                                        .map((item) => (
                                            <TouchableOpacity key={item.id} className="bg-lightbackground p-3 rounded-lg" style={{ alignSelf: 'flex-start' }} onPress={() => addIngredient(item)}>
                                                <Text className="text-white">{`${item.amount} ${item.name}`}</Text>
                                            </TouchableOpacity>
                                        ))
                                ) : (
                                    <Text className="text-white">Keine Zutaten vorhanden</Text>
                                )}
                            </View>
                        )}
                    </View>
                    <BigButton saveIngredients onPress={() => {
                        if (onSave) onSave(selectedIngredients);
                        onClose();
                    }} />
                </View>
            </View>
        </Modal>
    );
};

export default IngredientModal;