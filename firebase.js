import { initializeApp, getApps } from '@firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDt0dNFeO2u4pY07l2EvXQFkEY1iTIt0ww",
    authDomain: "food-delivery-app-5071a.firebaseapp.com",
    projectId: "food-delivery-app-5071a",
    storageBucket: "food-delivery-app-5071a.appspot.com",
    messagingSenderId: "453833447786",
    appId: "1:453833447786:android:96b1d5bb9359beacc26d13",
    //measurementId: "G-KYEP0L6ERS"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { app };