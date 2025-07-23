import React, { createContext, useState, useEffect, ReactNode } from "react";
import { ingredients } from "../data/ingredients";

export type IngredientType = {
  id: string;
  name: string;
  image: string;
};

type IngredientContextType = {
  ingredients: IngredientType[];
  addIngredient: (ingredient: Omit<IngredientType, "id">) => void;
};

export const IngredientContext = createContext<IngredientContextType>({
  ingredients: [],
  addIngredient: () => {},
});

interface IngredientProviderProps {
  children: ReactNode;
}

export const IngredientProvider: React.FC<IngredientProviderProps> = ({ children }) => {
  const [ingredientsList, setIngredientsList] = useState<IngredientType[]>([]);

  useEffect(() => {
    // Lokale Zutaten laden und IDs zu Strings konvertieren
    const convertedIngredients = ingredients.map(ingredient => ({
      ...ingredient,
      id: ingredient.id.toString()
    }));
    setIngredientsList(convertedIngredients);
  }, []);

  const addIngredient = (ingredient: Omit<IngredientType, "id">) => {
    const newIngredient = { ...ingredient, id: Date.now().toString() };
    setIngredientsList((prev) => [...prev, newIngredient]);
  };

  return (
    <IngredientContext.Provider value={{ ingredients: ingredientsList, addIngredient }}>
      {children}
    </IngredientContext.Provider>
  );
};