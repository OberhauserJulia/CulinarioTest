import React, { createContext, useState, ReactNode, useEffect } from "react";
import { getAllRecipes, addRecipe as addRecipeToFirebase, updateRecipe, deleteRecipe } from "../firebase/recipeService";

export type RecipeType = {
  id?: string;
  name: string;
  image: string | null;
  category?: string;
  ovensettings?: string;
  source?: string;
  ingredients: IngredientType[];
  preparationSteps: PreparationStepType[];
};

export type IngredientType = {
  image: string | null;
  name: string;
  amount: number;
  unit: string;
};

export type PreparationStepType = {
  stepNumber: number;
  description: string;
  ingredients: IngredientType[];
};

type RecipeContextType = {
  recipes: RecipeType[];
  loading: boolean;
  error: string | null;
  addRecipe: (recipe: Omit<RecipeType, 'id'>) => Promise<void>;
  updateRecipe: (id: string, recipe: Partial<RecipeType>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  loadRecipes: () => Promise<void>;
};

export const RecipeContext = createContext<RecipeContextType>({
  recipes: [],
  loading: false,
  error: null,
  addRecipe: async () => {},
  updateRecipe: async () => {},
  deleteRecipe: async () => {},
  loadRecipes: async () => {},
});

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedRecipes = await getAllRecipes();
      setRecipes(fetchedRecipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Rezepte');
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async (recipe: Omit<RecipeType, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const id = await addRecipeToFirebase(recipe);
      const newRecipe = { ...recipe, id };
      setRecipes((currentRecipes) => [...currentRecipes, newRecipe]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Hinzufügen des Rezepts');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecipe = async (id: string, recipe: Partial<RecipeType>) => {
    try {
      setLoading(true);
      setError(null);
      await updateRecipe(id, recipe);
      setRecipes((currentRecipes) =>
        currentRecipes.map((r) => (r.id === id ? { ...r, ...recipe } : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren des Rezepts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteRecipe(id);
      setRecipes((currentRecipes) => currentRecipes.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen des Rezepts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        loading,
        error,
        addRecipe,
        updateRecipe: handleUpdateRecipe,
        deleteRecipe: handleDeleteRecipe,
        loadRecipes,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};