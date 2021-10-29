import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDQj7SmRnPA0YPIN0XQiiZYkl-HEW8hxj0",
    authDomain: "person-generate.firebaseapp.com",
    projectId: "person-generate",
    storageBucket: "person-generate.appspot.com",
    messagingSenderId: "624431971734",
    appId: "1:624431971734:web:ab94395284bcd5ee7531b7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

