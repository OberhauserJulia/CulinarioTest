import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnfCXU0zuLxH02SFhx0o8FCmCS6SDI6Po",
  authDomain: "culinario-3494f.firebaseapp.com",
  projectId: "culinario-3494f",
  storageBucket: "culinario-3494f.appspot.com",
  messagingSenderId: "925316235170",
  appId: "1:925316235170:web:e50deae93060d0fe4bbcfb",
  measurementId: "G-PZNXT8C4T7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {

//   apiKey: "AIzaSyCnfCXU0zuLxH02SFhx0o8FCmCS6SDI6Po",

//   authDomain: "culinario-3494f.firebaseapp.com",

//   projectId: "culinario-3494f",

//   storageBucket: "culinario-3494f.firebasestorage.app",

//   messagingSenderId: "925316235170",

//   appId: "1:925316235170:web:e50deae93060d0fe4bbcfb",

//   measurementId: "G-PZNXT8C4T7"

// };

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export default app;