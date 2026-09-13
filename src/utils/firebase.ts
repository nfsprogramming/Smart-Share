
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    initializeFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    deleteDoc
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Solve connection issues by avoiding gRPC-web
});
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, storage, auth, app, googleProvider };

// Helper to save card (with user association)
export const saveCardToFirebase = async (cardData: any) => {
    try {
        const user = auth.currentUser;

        // Ensure we associate with user if logged in
        const dataToSave = {
            ...cardData,
            userId: user?.uid || cardData.userId || null,
            updatedAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "cards", cardData.id), dataToSave);
        return dataToSave;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

// Helper to get card
export const getCardFromFirebase = async (id: string) => {
    const docRef = doc(db, "cards", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
};

// Helper to get all cards for current user
export const getUserCardsFromFirebase = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.warn("No user logged in");
            return [];
        }

        const cardsRef = collection(db, "cards");
        const q = query(cardsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const cards: any[] = [];
        querySnapshot.forEach((doc) => {
            cards.push({ id: doc.id, ...doc.data() });
        });

        return cards;
    } catch (e) {
        console.error("Error fetching user cards:", e);
        return [];
    }
};

// Helper to delete card
export const deleteCardFromFirebase = async (id: string) => {
    try {
        await deleteDoc(doc(db, "cards", id));
        return true;
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw e;
    }
};

// Helper to update views
export const updateCardViews = async (id: string) => {
    const cardRef = doc(db, "cards", id);
    // This requires the document to exist
    try {
        const docSnap = await getDoc(cardRef);
        if (docSnap.exists()) {
            const currentViews = docSnap.data().views || 0;
            await updateDoc(cardRef, {
                views: currentViews + 1
            });
        }
    } catch (e) {
        console.error("Error updating stats", e);
    }
}

// Helper to get card by username
export const getCardByUsername = async (username: string) => {
    try {
        const cardsRef = collection(db, "cards");
        const q = query(cardsRef, where("username", "==", username.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (e) {
        console.error("Error fetching card by username:", e);
        return null;
    }
};

// Helper to save contact submission
export const saveContactSubmission = async (submissionData: any) => {
    try {
        const newRef = doc(collection(db, "contacts"));
        await setDoc(newRef, {
            ...submissionData,
            id: newRef.id,
            createdAt: new Date().toISOString()
        });
        return newRef.id;
    } catch (e) {
        console.error("Error saving contact:", e);
        throw e;
    }
};

// Helper to get contact submissions for a user's cards
export const getContactSubmissions = async (userId: string) => {
    // Note: requires knowing which cards belong to user, or saving userId on contact
    // For simplicity, we'll assume contacts have a cardOwnerId
    try {
        const contactsRef = collection(db, "contacts");
        const q = query(contactsRef, where("cardOwnerId", "==", userId));
        const querySnapshot = await getDocs(q);

        const contacts: any[] = [];
        querySnapshot.forEach((doc) => {
            contacts.push({ id: doc.id, ...doc.data() });
        });
        return contacts;
    } catch (e) {
        console.error("Error fetching contacts:", e);
        return [];
    }
};

// Helper to log analytics events
export const logAnalyticsEvent = async (eventData: any) => {
    try {
        const newRef = doc(collection(db, "analyticsEvents"));
        await setDoc(newRef, {
            ...eventData,
            id: newRef.id,
            timestamp: new Date().toISOString()
        });
        return true;
    } catch (e) {
        console.error("Error logging analytics:", e);
        // Don't throw, analytics shouldn't break the app
        return false;
    }
};

// Helper to get analytics events for a card
export const getCardAnalyticsEvents = async (cardId: string) => {
    try {
        const eventsRef = collection(db, "analyticsEvents");
        const q = query(eventsRef, where("cardId", "==", cardId));
        const querySnapshot = await getDocs(q);

        const events: any[] = [];
        querySnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by timestamp descending (newest first) client-side to avoid needing a composite index in Firestore initially
        return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
        console.error("Error fetching analytics events:", e);
        return [];
    }
};
