import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import { ImagePlus } from 'lucide-react-native';
import { ingredients } from '../data/ingredients';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { List } from 'react-native-paper';

// Imports Compponents
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { RecipeContext } from '../context/RecipeContext';
import SmallButton from '../components/SmallButton';
import InputFieldSteps from '../components/InputFieldSteps';



export default function CookingModeScreen() {
    const { addRecipe } = useContext(RecipeContext);
    const [image, setImage] = useState<string | null>(null); // Für die Anzeige (Picker-URI)
    const [webAsset, setWebAsset] = useState<any | null>(null); // Für Web: Asset-Objekt mit File
    const [savedImageUri, setSavedImageUri] = useState<string | null>(null); // Für die Speicherung (kopierte URI)
    const [steps, setSteps] = useState<{ text: string, stepNumber: number }[]>([{ text: "", stepNumber: 1 }]);
    const [ingredientsList, setIngredientsList] = useState<{
        input: string,
        amount: string,
        ingredient: string,
        foundIngredient?: { id: number | string, name: string, image: any } | null,
        isEditing?: boolean,
        uniqueKey?: string
    }[]>([{ input: "", amount: "", ingredient: "", foundIngredient: null, isEditing: true, uniqueKey: `init-${Date.now()}` }]);
    // NEU: Zutaten pro Schritt (Array mit Arrays von Ingredient-Objekten)
    const [stepIngredients, setStepIngredients] = useState<{ id: string, name: string, amount: string }[][]>([[]]);

    // Neue States für alle Inputs
    const [recipeName, setRecipeName] = useState("");
    const [category, setCategory] = useState("");
    const [miscAmount, setMiscAmount] = useState("");
    const [ovenSetting, setOvenSetting] = useState("");
    const [source, setSource] = useState("");

    const [expanded, setExpanded] = React.useState(true);

    // Kategorie Dropdown State
    const [showDropdown, setShowDropdown] = useState(false);
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [categoryOptions, setCategoryOptions] = useState(["Vorspeise", "Hauptspeise", "Nachspeise"]);

    function handleAddCategory() {
        if (newCategory.trim() && !categoryOptions.includes(newCategory.trim())) {
            setCategoryOptions([...categoryOptions, newCategory.trim()]);
            setCategory(newCategory.trim());
        }
        setShowCategoryInput(false);
        setShowDropdown(false);
        setNewCategory("");
    }

    // Alle Eingaben zurücksetzen, wenn der Screen neu geladen/geöffnet wird
    useFocusEffect(
        React.useCallback(() => {
            setImage(null);
            setSteps([{ text: "", stepNumber: 1 }]);
            setIngredientsList([{ input: "", amount: "", ingredient: "", foundIngredient: null, isEditing: true }]);
            setStepIngredients([[]]);
            setRecipeName("");
            setCategory("");
            setMiscAmount("");
            setOvenSetting("");
            setSource("");
        }, [])
    );

    // Bild auswählen und lokal speichern
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            const selectedAsset = result.assets[0];
            setImage(selectedAsset.uri); // image URI für Vorschau
            if (Platform.OS === 'web') {
                setWebAsset(selectedAsset); // Asset enthält das File-Objekt
            } else {
                setWebAsset(null);
            }
        }
    };

    const uploadImageToCloudinary = async (imageUri: string, webAssetObj?: any) => {
        const data = new FormData();
        if (Platform.OS === 'web' && webAssetObj) {
            // Web: File-Objekt direkt anhängen (Asset selbst ist das File)
            data.append('file', webAssetObj);
        } else {
            // Mobile: als Base64
            const base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            data.append('file', `data:image/jpeg;base64,${base64}`);
        }
        data.append('upload_preset', 'RecipeImages');

        const res = await fetch(`https://api.cloudinary.com/v1_1/ddwxwy7j0/image/upload`, {
            method: 'POST',
            body: data,
        });

        const json = await res.json();
        if (!json.secure_url) {
            throw new Error(json.error?.message || 'Cloudinary Upload fehlgeschlagen');
        }
        // Die Transformation (z.B. Höhe 360px) erfolgt über die URL beim Anzeigen:
        // Beispiel: https://res.cloudinary.com/<cloudname>/image/upload/h_360/<public_id>.jpg
        // json.secure_url ist z.B. https://res.cloudinary.com/ddwxwy7j0/image/upload/v1234567890/abc.jpg
        // Um das Bild mit Höhe 360px zu laden, ersetze '/upload/' durch '/upload/h_360/'
        const resizedUrl = json.secure_url.replace('/upload/', '/upload/h_360/');
        return resizedUrl;
    };

    const saveImageUrlToFirestore = async (recipeId: string, imageUrl: string) => {
        const firestore = getFirestore();
        const recipeRef = doc(firestore, 'recipes', recipeId);
        await updateDoc(recipeRef, { imageUrl });
    };



    // Funktion zum Verarbeiten der Zutaten-Eingabe
    // Nur ein Eingabefeld für Menge und Zutat
    const handleIngredientInputChange = (index: number, value: string) => {
        const updatedIngredients = [...ingredientsList];
        updatedIngredients[index].input = value;
        setIngredientsList(updatedIngredients);
    };

    // Beim Speichern: Trennen und prüfen
    const handleSaveIngredient = async (index: number) => {
        const updatedIngredients = [...ingredientsList];
        const input = updatedIngredients[index].input.trim();
        let found = null;
        let foundName = "";
        for (const ing of ingredients) {
            if (input.toLowerCase().endsWith(ing.name.toLowerCase())) {
                found = ing;
                foundName = ing.name;
                break;
            }
        }
        if (found) {
            const amount = input.slice(0, input.toLowerCase().lastIndexOf(foundName.toLowerCase())).trim();
            updatedIngredients[index].amount = amount;
            updatedIngredients[index].ingredient = foundName;
            // Eindeutige ID für bekannte Zutaten
            updatedIngredients[index].uniqueKey = `known-${found.id}`;
            updatedIngredients[index].foundIngredient = found;
            updatedIngredients[index].isEditing = false;
        } else {
            // Ghost-Bild und Name speichern
            const ghostImage = require('../assets/ingredientImages/ghost.png');
            // Versuche, Menge und Name zu trennen (z.B. "2 EL NeueZutat")
            const match = input.match(/^(.*?)([a-zA-ZäöüÄÖÜß\s]+)$/);
            let amount = "";
            let name = input;
            if (match) {
                amount = match[1].trim();
                name = match[2].trim();
            }
            updatedIngredients[index].amount = amount;
            updatedIngredients[index].ingredient = name;
            // Eindeutige ID für neue Zutaten
            if (!updatedIngredients[index].uniqueKey) {
                updatedIngredients[index].uniqueKey = `custom-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
            }
            updatedIngredients[index].foundIngredient = { id: updatedIngredients[index].uniqueKey, name, image: ghostImage };
            updatedIngredients[index].isEditing = false;
            // AsyncStorage: neue Zutat speichern
            try {
                const stored = await AsyncStorage.getItem('customIngredients');
                let customIngredients = stored ? JSON.parse(stored) : [];
                if (!customIngredients.find((z: any) => z.name.toLowerCase() === name.toLowerCase())) {
                    customIngredients.push({ name, image: 'ghost' });
                    await AsyncStorage.setItem('customIngredients', JSON.stringify(customIngredients));
                }
            } catch (e) {
                console.log('Fehler beim Speichern neuer Zutat:', e);
            }
        }
        setIngredientsList(updatedIngredients);
    };

    // Umschalten zwischen Ansicht und Editiermodus
    const handleToggleEdit = (index: number, edit: boolean) => {
        const updatedIngredients = [...ingredientsList];
        updatedIngredients[index].isEditing = edit;
        setIngredientsList(updatedIngredients);
    };


    // Schritt hinzufügen und stepIngredients mit leerem Array erweitern
    const addStep = () => {
        setSteps(prev => [...prev, { text: "", stepNumber: prev.length + 1 }]);
        setStepIngredients(prev => [...prev, []]);
    };

    const addIngredient = () => {
        setIngredientsList([...ingredientsList, { input: "", amount: "", ingredient: "", foundIngredient: null, isEditing: true }]);
    };

    // Hilfsfunktion: Zutatenmengen für einen Schritt berechnen (verbleibend)
    function getAvailableIngredientsForStep(stepIdx: number) {
        // Alle Zutaten aus Zutatenliste (gesamt)
        const allIngredients = ingredientsList
            .filter(ing => ing.ingredient && ing.foundIngredient)
            .map(ing => ({
                id: ing.ingredient,
                name: ing.ingredient,
                amount: ing.amount // kann leer sein
            }));

        // Map: Zutat -> Gesamtmenge (als Zahl + Einheit)
        const totalMap = new Map();
        allIngredients.forEach(ing => {
            // Versuche Menge zu parsen (z.B. "2 EL")
            const match = ing.amount.match(/([\d,.]+)/);
            const value = match ? parseFloat(match[1].replace(',', '.')) : 0;
            const unit = ing.amount.replace(/^[\d,.]+\s*/, '');
            totalMap.set(ing.name, { value, unit });
        });

        // Map: Zutat -> bereits verwendete Menge in allen anderen Schritten (außer dem aktuellen)
        const usedMap = new Map();
        for (let i = 0; i < stepIngredients.length; i++) {
            if (i === stepIdx) continue;
            (stepIngredients[i] || []).forEach(ing => {
                const match = ing.amount.match(/([\d,.]+)/);
                const value = match ? parseFloat(match[1].replace(',', '.')) : 0;
                const prev = usedMap.get(ing.name) || 0;
                usedMap.set(ing.name, prev + value);
            });
        }

        // Verfügbare Zutaten berechnen (Restmenge = Gesamtmenge - Summe aller anderen Schritte)
        return allIngredients.map(ing => {
            if (!ing.amount || ing.amount.trim() === "") {
                // Zutaten ohne amount einfach durchreichen
                return {
                    id: ing.name,
                    name: ing.name,
                    amount: ""
                };
            }
            const total = totalMap.get(ing.name);
            const used = usedMap.get(ing.name) || 0;
            const available = Math.max(0, total.value - used);
            return {
                id: ing.name,
                name: ing.name,
                amount: available > 0 ? `${available % 1 === 0 ? available : available.toFixed(1)}${total.unit ? ' ' + total.unit : ''}`.trim() : `0${total.unit ? ' ' + total.unit : ''}`
            };
        });
    }

    // Callback für InputFieldSteps, um gewählte Zutaten pro Schritt zu speichern
    function handleStepIngredientsChange(stepIdx: number, selected: { id: string, name: string, amount: string }[]) {
        setStepIngredients(prev => {
            const copy = [...prev];
            copy[stepIdx] = selected;
            return copy;
        });
    }

    // Hilfsfunktion: Zutaten für das Rezept-Objekt aufbereiten
    function buildIngredientsForRecipe() {
        // ingredientsList: [{ amount, ingredient, foundIngredient }]
        return ingredientsList
            .filter(ing => ing.amount && ing.ingredient && ing.foundIngredient)
            .map(ing => {
                // Versuche Menge und Einheit zu trennen
                const match = ing.amount.match(/([\d,.]+)/);
                const value = match ? parseFloat(match[1].replace(',', '.')) : 0;
                const unit = ing.amount.replace(/^[\d,.]+\s*/, '');
                return {
                    name: ing.ingredient,
                    image: ing.foundIngredient?.image || null,
                    amount: value,
                    unit: unit,
                };
            });
    }

    // Hilfsfunktion: Schritte für das Rezept-Objekt aufbereiten
    function buildPreparationSteps() {
        return steps.map((step, idx) => ({
            stepNumber: step.stepNumber,
            description: step.text,
            ingredients: (stepIngredients[idx] || []).map(ing => {
                // Versuche Menge und Einheit zu trennen
                const match = ing.amount.match(/([\d,.]+)/);
                const value = match ? parseFloat(match[1].replace(',', '.')) : 0;
                const unit = ing.amount.replace(/^[\d,.]+\s*/, '');
                // Bild aus globaler Liste suchen
                const found = ingredients.find(i => i.name.toLowerCase() === ing.name.toLowerCase());
                return {
                    name: ing.name,
                    image: found ? found.image : null,
                    amount: value,
                    unit: unit,
                };
            })
        }));
    }

    // Rezept speichern
    async function handleSaveRecipe() {
        if (!recipeName.trim()) {
            alert('Bitte gib einen Rezeptnamen ein.');
            return;
        }
        if (buildIngredientsForRecipe().length === 0) {
            alert('Bitte gib mindestens eine Zutat ein.');
            return;
        }
        let imageUrl = '';
        try {
            if (savedImageUri) {
                // Bereits gespeicherte Cloudinary-URL verwenden
                imageUrl = savedImageUri;
            } else if (image) {
                // Bild zu Cloudinary hochladen und URL holen
                imageUrl = await uploadImageToCloudinary(image, webAsset?.file || webAsset);
                setSavedImageUri(imageUrl);
            } else {
                imageUrl = require('../assets/recipeImages/marry-me-gnocchi.jpg');
            }
            if (!imageUrl || typeof imageUrl !== 'string') {
                alert('Bild-Upload fehlgeschlagen!');
                return;
            }
        } catch (error) {
            console.log('Fehler beim Hochladen des Bildes zu Cloudinary:', error);
            alert('Fehler beim Hochladen des Bildes: ' + ((error as any)?.message || error));
            return;
        }
        try {
            // Rezept speichern
            // addRecipe gibt vermutlich keine Referenz zurück, daher Firestore-Update nur, wenn imageUrl ein String ist und recipeName als ID genutzt werden kann
            await addRecipe({
                name: recipeName,
                image: imageUrl,
                category: category,
                ovensettings: ovenSetting,
                source: source,
                ingredients: buildIngredientsForRecipe(),
                preparationSteps: buildPreparationSteps(),
            });
            // Bild-URL in Firestore speichern, falls addRecipe nicht schon erledigt
            // Falls du eine echte Rezept-ID hast, nutze diese hier statt recipeName!
            if (imageUrl && typeof imageUrl === 'string' && recipeName) {
                await saveImageUrlToFirestore(recipeName, imageUrl);
            }
            console.log('Rezept gespeichert:', recipeName, imageUrl);
            alert('Rezept erfolgreich gespeichert!');
            // Optional: Felder zurücksetzen
            setImage(null);
            setSavedImageUri(null);
            setSteps([{ text: '', stepNumber: 1 }]);
            setIngredientsList([{ input: '', amount: '', ingredient: '', foundIngredient: null, isEditing: true }]);
            setStepIngredients([[]]);
            setRecipeName('');
            setCategory('');
            setMiscAmount('');
            setOvenSetting('');
            setSource('');
        } catch (err) {
            alert('Fehler beim Speichern des Rezepts.');
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            
            {/* Top Bar */}
            <View className="flex-row justify-between items-center pb-6">
                <Text style={styles.textH1}> Rezept hinzufügen </Text>
                <SmallButton save={true} onPress={handleSaveRecipe} />
            </View>
            
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.inputContainer}>
                    {/* Image */}
                    <TouchableOpacity
                        onPress={pickImage}
                        className="flex flex-col gap-3 h-[149px] w-full bg-lightbackground border border-primary border-dashed rounded-[15px] items-center justify-center">
                        {image ? (
                            <Image source={{ uri: image }} resizeMode="contain" className="w-full h-full" />
                        ) : (<>
                            <ImagePlus size={50} color="#66A182" />
                            <Text className="text-primary font-robotoMedium">Foto hinzufügen</Text>
                        </>)}
                    </TouchableOpacity>

                    {/* Rezeptname */}
                    <View className="flex-col gap-3">
                        <Text style={styles.textH2}> Rezeptname </Text>
                        <TextInput
                            placeholder='Rezeptname eingeben'
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            textColor="#FFFFFF"
                            placeholderTextColor="#FFFFFF80"
                            value={recipeName}
                            onChangeText={setRecipeName}
                            style={{
                                backgroundColor: '#222222',
                                color: '#FFFFFF',
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                                borderBottomRightRadius: 15,
                                borderBottomLeftRadius: 15,
                                fontFamily: 'Roboto-Medium',
                                fontSize: 16,
                                lineHeight: 25
                            }}
                        />
                    </View>

                    {/* Zusätzlich */}
                    <View className="flex-col gap-3">
                        <Text style={styles.textH2}> Sonstiges </Text>

                        {/* Kategorie Dropdown */}
                        <View className="w-full">
                            <View>
                                {showCategoryInput ? (
                                    <View style={{ flexDirection: 'row', height: 55, alignItems: 'center', backgroundColor: '#222222', borderRadius: 15 }}>
                                        <TextInput
                                            placeholder='Neue Kategorie eingeben'
                                            underlineColor="transparent"
                                            activeUnderlineColor="transparent"
                                            textColor="#FFFFFF"
                                            placeholderTextColor="#FFFFFF80"
                                            value={newCategory}
                                            onChangeText={setNewCategory}
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: '#FFFFFF',
                                                fontFamily: 'Roboto-Medium',
                                                fontSize: 16,
                                                flex: 1,
                                                lineHeight: 25,
                                            }}
                                        />
                                        <TouchableOpacity onPress={handleAddCategory} style={{ marginLeft: 8 }}>
                                            <Text style={{ color: '#66A182', fontWeight: 'bold', fontSize: 18 }}>✓</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => setShowDropdown(!showDropdown)}
                                        style={{
                                            backgroundColor: '#222222',
                                            borderRadius: 15,
                                            padding: 12,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Text style={{ color: category ? '#FFFFFF' : '#FFFFFF80', fontFamily: 'Roboto-Medium', fontSize: 16 }}>
                                            {category || 'Kategorie auswählen'}
                                        </Text>
                                        <Text style={{ color: '#66A182', fontSize: 18 }}>{showDropdown ? '▲' : '▼'}</Text>
                                    </TouchableOpacity>
                                )}
                                {showDropdown && !showCategoryInput && (
                                    <View style={{ backgroundColor: '#222222', borderRadius: 15, marginTop: 4, overflow: 'hidden' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowDropdown(false);
                                                setShowCategoryInput(true);
                                            }}
                                            style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#333' }}
                                        >
                                            <Text style={{ color: '#66A182', fontFamily: 'Roboto-Medium', fontSize: 16 }}>+ Kategorie hinzufügen</Text>
                                        </TouchableOpacity>
                                        {categoryOptions.map((option, idx) => (
                                            <TouchableOpacity
                                                key={option}
                                                onPress={() => {
                                                    setCategory(option);
                                                    setShowDropdown(false);
                                                }}
                                                style={{ padding: 12, borderBottomWidth: idx < categoryOptions.length - 1 ? 1 : 0, borderBottomColor: '#333' }}
                                            >
                                                <Text style={{ color: '#FFFFFF', fontFamily: 'Roboto-Medium', fontSize: 16 }}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>

                        <TextInput
                            placeholder='Menge'
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            textColor="#FFFFFF"
                            placeholderTextColor="#FFFFFF80"
                            value={miscAmount}
                            onChangeText={setMiscAmount}
                            style={{
                                backgroundColor: '#222222',
                                color: '#FFFFFF',
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                                borderBottomRightRadius: 15,
                                borderBottomLeftRadius: 15,
                                fontFamily: 'Roboto-Medium',
                                fontSize: 16,
                                lineHeight: 25,
                                flex: 1,
                            }}
                        />
                        <TextInput
                            placeholder='Ofeneinstellung'
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            textColor="#FFFFFF"
                            placeholderTextColor="#FFFFFF80"
                            value={ovenSetting}
                            onChangeText={setOvenSetting}
                            style={{
                                backgroundColor: '#222222',
                                color: '#FFFFFF',
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                                borderBottomRightRadius: 15,
                                borderBottomLeftRadius: 15,
                                fontFamily: 'Roboto-Medium',
                                fontSize: 16,
                                lineHeight: 25,
                            }}
                        />
                        <TextInput
                            placeholder='Quelle'
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            textColor="#FFFFFF"
                            placeholderTextColor="#FFFFFF80"
                            value={source}
                            onChangeText={setSource}
                            style={{
                                backgroundColor: '#222222',
                                color: '#FFFFFF',
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                                borderBottomRightRadius: 15,
                                borderBottomLeftRadius: 15,
                                fontFamily: 'Roboto-Medium',
                                fontSize: 16,
                                lineHeight: 25,
                            }}
                        />
                    </View>
                    
                    {/* Zutaten */}
                    <View style={styles.topBarInput}>
                        <Text style={styles.textH2}> Zutaten </Text>
                        <SmallButton plus={true} onPress={addIngredient} />
                    </View>
                    
                    {/* Zutatenliste */}
                    {ingredientsList.map((ingredient, index) => {
                        // Eindeutigen Key pro Zutat verwenden
                        const key = ingredient.uniqueKey || (ingredient.foundIngredient && ingredient.foundIngredient.id) || `fallback-${index}`;
                        return (
                            <View key={key}>
                                {ingredient.foundIngredient && !ingredient.isEditing ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => handleToggleEdit(index, true)}
                                        className="flex flex-row items-center gap-[12px] bg-lightbackground w-full h-[55px] p-[12px] rounded-[15px]"
                                    >
                                        <View className="bg-darkbackground h-[33.5px] w-[33.5px] rounded-[5px] flex items-center justify-center">
                                            <Image
                                                source={ingredient.foundIngredient.image}
                                                style={{ height: 27.5, width: 27.5 }}
                                            />
                                        </View>
                                        <Text style={styles.text}>
                                            {ingredient.amount ? `${ingredient.amount} ` : ''}{ingredient.foundIngredient.name}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View className="flex-row gap-3 w-full">
                                        <TextInput
                                            placeholder='Menge und Zutat, z.B. "2 EL Butter"'
                                            underlineColor="transparent"
                                            activeUnderlineColor="transparent"
                                            textColor="#FFFFFF"
                                            placeholderTextColor="#FFFFFF80"
                                            value={ingredient.input}
                                            onChangeText={(value) => handleIngredientInputChange(index, value)}
                                            style={{
                                                backgroundColor: '#222222',
                                                color: '#FFFFFF',
                                                borderTopLeftRadius: 15,
                                                borderTopRightRadius: 15,
                                                borderBottomRightRadius: 15,
                                                borderBottomLeftRadius: 15,
                                                fontFamily: 'Roboto-Medium',
                                                fontSize: 16,
                                                lineHeight: 25,
                                                flex: 1,
                                            }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => handleSaveIngredient(index)}
                                            style={{ marginLeft: 8, justifyContent: 'center' }}
                                        >
                                            <Text style={{ color: '#66A182', fontWeight: 'bold', fontSize: 18 }}>✓</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        );
                    })}

                    {/* Zubereitungsschritte */}
                    <View style={styles.topBarInput}>
                        <Text style={styles.textH2}> Zubereitungsschritte </ Text>
                        <SmallButton plus={true} onPress={addStep} />
                    </View>
                    {steps.map((step, index) => (
                        <InputFieldSteps
                            key={index}
                            stepNumber={step.stepNumber}
                            placeholder="Zubereitungsschritt beschreiben"
                            description={step.text}
                            onDescriptionChange={text => {
                                setSteps(prev => {
                                    const copy = [...prev];
                                    copy[index] = { ...copy[index], text };
                                    return copy;
                                });
                            }}
                            ingredients={getAvailableIngredientsForStep(index)}
                            onIngredientsChange={selected => handleStepIngredientsChange(index, selected)}
                        />
                    ))}
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 68,
        backgroundColor: '#161616',
        paddingHorizontal: 24,
    },

    scrollContainer: {
        flexDirection: 'column',
        gap: 24,
        backgroundColor: '#161616',
        paddingTop: 24,
        paddingBottom: 114,
    },

    topBarInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    inputContainer: {
        flexDirection: 'column',
        gap: 24,
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

    text: {
        color: '#FFFFFF',
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 'medium',
        textAlign: 'center',
    },

    textH1: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat',
        fontSize: 24,
        fontWeight: 'bold',
    },

    textH2: {
        color: '#66A182',
        fontFamily: 'Montserrat',
        fontSize: 18,
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