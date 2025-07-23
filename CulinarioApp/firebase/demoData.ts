// Demo-Script zum Hinzufügen von Testrezepten
// Dieses Script können Sie ausführen, um Beispielrezepte zu Firebase hinzuzufügen

import { addRecipe } from '../firebase/recipeService';
import { RecipeType } from '../context/RecipeContext';

const demoRecipes: Omit<RecipeType, 'id'>[] = [
  {
    name: "Marry Me Gnocchi",
    image: null,
    category: "Hauptgericht",
    ovensettings: "180°C Umluft",
    source: "Eigenes Rezept",
    ingredients: [
      {
        image: null,
        name: "Gnocchi",
        amount: 500,
        unit: "g"
      },
      {
        image: null,
        name: "Tofu",
        amount: 1,
        unit: "Packung"
      },
      {
        image: null,
        name: "getrocknete Tomaten",
        amount: 130,
        unit: "g"
      },
      {
        image: null,
        name: "Spinat",
        amount: 2,
        unit: "Handvoll"
      },
      {
        image: null,
        name: "Parmesan",
        amount: 40,
        unit: "g"
      },
      {
        image: null,
        name: "Sahne",
        amount: 120,
        unit: "ml"
      },
      {
        image: null,
        name: "Butter",
        amount: 28,
        unit: "g"
      },
      {
        image: null,
        name: "Knoblauchzehen",
        amount: 4,
        unit: "Stück"
      },
      {
        image: null,
        name: "Salz",
        amount: 0.25,
        unit: "TL"
      },
      {
        image: null,
        name: "Pfeffer",
        amount: 0.25,
        unit: "TL"
      },
      {
        image: null,
        name: "Gemüsebrühe",
        amount: 473,
        unit: "ml"
      }
    ],
    preparationSteps: [
      {
        stepNumber: 1,
        description: "In einer großen Pfanne oder einem Topf die Butter bei mittlerer Hitze schmelzen. Knoblauch, Oregano, Chiliflocken, geräuchertes Paprikapulver, Salz und Pfeffer dazugeben und etwa 2 Minuten anbraten, bis es aromatisch duftet. Die vegane Wurst hineinbröseln und 5–10 Minuten anbraten, bis sie schön gebräunt ist.",
        ingredients: [
          {
            image: null,
            name: "Tofu",
            amount: 1,
            unit: "Packung"
          },
          {
            image: null,
            name: "Butter",
            amount: 28,
            unit: "g"
          },
          {
            image: null,
            name: "Knoblauchzehen",
            amount: 4,
            unit: "Stück"
          },
          {
            image: null,
            name: "Salz",
            amount: 0.25,
            unit: "TL"
          },
          {
            image: null,
            name: "Pfeffer",
            amount: 0.25,
            unit: "TL"
          },
        ]
      },
      {
        stepNumber: 2,
        description: "Die getrockneten Tomaten und die Gemüsebrühe einrühren. Zum Köcheln bringen. Dann die Gnocchi hinzufügen, abdecken und 2–4 Minuten garen, bis sie weich sind.",
        ingredients: [
          {
            image: null,
            name: "getrocknete Tomaten",
            amount: 130,
            unit: "g"
          },
          {
            image: null,
            name: "Gemüsebrühe",
            amount: 473,
            unit: "ml"
          },
          {
            image: null,
            name: "Gnocchi",
            amount: 500,
            unit: "g"
          }
        ]
      },
      {
        stepNumber: 3,
        description: "Vom Herd nehmen. Spinat unterrühren, bis er zusammenfällt. Danach Sahne, Parmesan und Basilikum unterrühren.",
        ingredients: [
          {
            image: null,
            name: "Spinat",
            amount: 2,
            unit: "Handvoll"
          },
          {
            image: null,
            name: "Parmesan",
            amount: 40,
            unit: "g"
          },
          {
            image: null,
            name: "Sahne",
            amount: 120,
            unit: "ml"
          }
        ]
      }
    ]
  },
];

// Funktion zum Hinzufügen aller Demo-Rezepte
export const addDemoRecipes = async () => {
  try {
    console.log('Beginne mit dem Hinzufügen der Demo-Rezepte...');

    for (const recipe of demoRecipes) {
      const id = await addRecipe(recipe);
      console.log(`✅ Rezept "${recipe.name}" hinzugefügt mit ID: ${id}`);
    }

    console.log('🎉 Alle Demo-Rezepte wurden erfolgreich hinzugefügt!');
  } catch (error) {
    console.error('❌ Fehler beim Hinzufügen der Demo-Rezepte:', error);
  }
};

// Kommentieren Sie diese Zeile aus, um die Demo-Rezepte hinzuzufügen:
addDemoRecipes();