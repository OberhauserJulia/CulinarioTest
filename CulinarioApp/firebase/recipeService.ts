import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';
import { RecipeType } from '../context/RecipeContext';

const COLLECTION_NAME = 'recipes';

// Alle Rezepte abrufen
export const getAllRecipes = async (): Promise<RecipeType[]> => {
  try {
    const recipesCollection = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(recipesCollection);
    const recipes: RecipeType[] = [];
    
    snapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
      const data = docSnap.data();
      recipes.push({
        id: docSnap.id,
        name: data.name,
        image: data.image,
        category: data.category,
        ovensettings: data.ovensettings,
        source: data.source,
        ingredients: data.ingredients || [],
        preparationSteps: data.preparationSteps || [],
      });
    });
    
    return recipes;
  } catch (error) {
    console.error('Fehler beim Abrufen der Rezepte:', error);
    throw error;
  }
};

// Rezept nach ID abrufen
export const getRecipeById = async (id: string): Promise<RecipeType | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        image: data.image,
        category: data.category,
        ovensettings: data.ovensettings,
        source: data.source,
        ingredients: data.ingredients || [],
        preparationSteps: data.preparationSteps || [],
      };
    }
    
    return null;
  } catch (error) {
    console.error('Fehler beim Abrufen des Rezepts:', error);
    throw error;
  }
};

// Neues Rezept hinzufügen
export const addRecipe = async (recipe: Omit<RecipeType, 'id'>): Promise<string> => {
  try {
    const recipesCollection = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(recipesCollection, {
      name: recipe.name,
      image: recipe.image,
      category: recipe.category,
      ovensettings: recipe.ovensettings,
      source: recipe.source,
      ingredients: recipe.ingredients,
      preparationSteps: recipe.preparationSteps,
      createdAt: new Date(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Rezepts:', error);
    throw error;
  }
};

// Rezept aktualisieren
export const updateRecipe = async (id: string, recipe: Partial<RecipeType>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...recipe,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Rezepts:', error);
    throw error;
  }
};

// Rezept löschen
export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Fehler beim Löschen des Rezepts:', error);
    throw error;
  }
};

// Rezepte nach Kategorie filtern
export const getRecipesByCategory = async (category: string): Promise<RecipeType[]> => {
  try {
    const recipesCollection = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(recipesCollection);
    const recipes: RecipeType[] = [];
    
    snapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
      const data = docSnap.data();
      if (category === 'Alle' || data.category === category) {
        recipes.push({
          id: docSnap.id,
          name: data.name,
          image: data.image,
          category: data.category,
          ovensettings: data.ovensettings,
          source: data.source,
          ingredients: data.ingredients || [],
          preparationSteps: data.preparationSteps || [],
        });
      }
    });
    
    return recipes;
  } catch (error) {
    console.error('Fehler beim Filtern der Rezepte:', error);
    throw error;
  }
};

// Rezepte nach Namen suchen
export const searchRecipes = async (searchQuery: string): Promise<RecipeType[]> => {
  try {
    const recipesCollection = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(recipesCollection);
    const recipes: RecipeType[] = [];
    
    snapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
      const data = docSnap.data();
      if (data.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        recipes.push({
          id: docSnap.id,
          name: data.name,
          image: data.image,
          category: data.category,
          ovensettings: data.ovensettings,
          source: data.source,
          ingredients: data.ingredients || [],
          preparationSteps: data.preparationSteps || [],
        });
      }
    });
    
    return recipes;
  } catch (error) {
    console.error('Fehler beim Suchen der Rezepte:', error);
    throw error;
  }
};
