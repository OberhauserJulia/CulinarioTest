# Firebase Integration für CulinarioRecipeApp

## Setup-Anweisungen

### 1. Firebase Projekt erstellen
1. Gehen Sie zur [Firebase Console](https://console.firebase.google.com/)
2. Erstellen Sie ein neues Projekt oder verwenden Sie ein bestehendes
3. Aktivieren Sie Firestore Database in Ihrem Projekt

### 2. Expo-kompatible Firebase-Integration
Diese App verwendet das **Expo-kompatible Firebase v9 SDK** (`firebase` npm package), nicht `@react-native-firebase`.

#### Installierte Dependencies:
```bash
npm install firebase
```

### 3. Konfigurationswerte sind bereits eingerichtet
Die Firebase-Konfiguration ist bereits in `firebase/config.ts` mit Ihren Projektdaten konfiguriert:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyCmRpBspsdnqbbgP30i2GV99y3d4rdrdbo",
  authDomain: "culinariorecipeapp.firebaseapp.com",
  projectId: "culinariorecipeapp",
  storageBucket: "culinariorecipeapp.firebasestorage.app",
  messagingSenderId: "1048920261192",
  appId: "1:1048920261192:web:ed3a053bf60523b8878e7d",
  measurementId: "G-PELJH97HJT"
};
```

### 4. Firestore Sicherheitsregeln
In der Firebase Console unter Firestore > Regeln, verwenden Sie folgende Regeln:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Erlaubt Lesen und Schreiben für alle Benutzer (nur für Entwicklung)
    match /recipes/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Hinweis**: Diese Regeln sind nur für die Entwicklung gedacht. Für die Produktion sollten Sie authentifizierungsbasierte Regeln implementieren.

### 5. App starten
```bash
# Mit Expo
npx expo start
```

**Keine native Konfiguration erforderlich** - Das Firebase v9 SDK funktioniert direkt mit Expo Managed Workflow!

## Funktionen

### Verfügbare Firebase-Services
- **getAllRecipes()**: Alle Rezepte abrufen
- **getRecipeById(id)**: Einzelnes Rezept abrufen
- **addRecipe(recipe)**: Neues Rezept hinzufügen
- **updateRecipe(id, recipe)**: Rezept aktualisieren
- **deleteRecipe(id)**: Rezept löschen
- **getRecipesByCategory(category)**: Rezepte nach Kategorie filtern
- **searchRecipes(query)**: Rezepte nach Namen durchsuchen

### RecipeContext
Der `RecipeContext` wurde erweitert um:
- Loading-States
- Error-Handling
- Automatisches Laden der Rezepte beim App-Start
- Firebase-Integration für alle CRUD-Operationen

### HomeScreen Features
- Anzeige aller Firebase-Rezepte
- Filterung nach Kategorien
- Suchfunktion
- Loading- und Error-States
- Dynamische Rezeptanzeige

## Demo-Daten
Um Testrezepte hinzuzufügen, können Sie das Demo-Script verwenden:

```typescript
import { addDemoRecipes } from './firebase/demoData';

// In einer Komponente oder beim App-Start aufrufen
addDemoRecipes();
```

## Fehlerbehebung

### Häufige Probleme
1. **"Default app not initialized"**: Stellen Sie sicher, dass die Firebase-Konfiguration korrekt ist
2. **"Permission denied"**: Überprüfen Sie die Firestore-Sicherheitsregeln
3. **App stürzt ab**: Stellen Sie sicher, dass alle nativen Dependencies korrekt installiert sind

### Debugging
Aktivieren Sie die Firebase-Debug-Logs:
```typescript
// In config.ts hinzufügen
if (__DEV__) {
  console.log('Firebase Debug Mode aktiviert');
}
```

## Nächste Schritte
1. Firebase Authentication hinzufügen
2. Bildupload mit Firebase Storage implementieren
3. Offline-Support mit Firebase enableNetwork/disableNetwork
4. Push-Benachrichtigungen mit Firebase Cloud Messaging
5. Analytics mit Firebase Analytics
