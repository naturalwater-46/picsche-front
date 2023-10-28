import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';  // Storage用の関数をインポート
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';  // Authentication用の関数をインポート


const firebaseConfig = {
    apiKey: "AIzaSyCB2CS8PcN6ASJmKNLX9aIwsJ3xewxVV9c",
    authDomain: "picsche.firebaseapp.com",
    projectId: "picsche",
    storageBucket: "picsche.appspot.com",
    messagingSenderId: "599028921736",
    appId: "1:599028921736:web:cac690cb7d652e29a5f63d",
    measurementId: "G-Z2CVPRLJQR"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);  // Storageサービスを初期化
const auth = getAuth(app);  // Authサービスを初期化
const googleProvider = new GoogleAuthProvider();

export { 
    db, collection, addDoc, storage, ref, uploadBytes, getDownloadURL, 
    auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword 
  }; 