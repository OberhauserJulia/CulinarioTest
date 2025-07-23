import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCmRpBspsdnqbbgP30i2GV99y3d4rdrdbo",
  authDomain: "culinariorecipeapp.firebaseapp.com",
  projectId: "culinariorecipeapp",
  storageBucket: "culinariorecipeapp.appspot.com",
  messagingSenderId: "1048920261192",
  appId: "1:1048920261192:web:ed3a053bf60523b8878e7d",
  measurementId: "G-PELJH97HJT"
};

let firebaseApp;

if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}


export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export default firebaseApp;

// Hilfsfunktion zum Hochladen eines Bildes in Firebase Storage
export async function uploadImageAsync(uri: string, path: string): Promise<string> {
  try {
    if (!uri || typeof uri !== 'string') {
      throw new Error('Kein gültiger Bild-URI übergeben.');
    }
    if (!uri.startsWith('file://') && !uri.startsWith('content://')) {
      throw new Error('Bild-URI hat kein unterstütztes Format: ' + uri);
    }
    // Hole das Bild als Blob
    let response;
    try {
      response = await fetch(uri);
    } catch (err) {
      console.log('Fehler beim fetch des Bildes:', err, uri);
      throw new Error('Bild konnte nicht geladen werden.');
    }
    let blob;
    try {
      blob = await response.blob();
    } catch (err) {
      console.log('Fehler beim Umwandeln in Blob:', err);
      throw new Error('Bild konnte nicht als Blob verarbeitet werden.');
    }
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.log('uploadImageAsync Fehler:', error);
    throw error;
  }
}
