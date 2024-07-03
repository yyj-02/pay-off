import { doc, getDoc, increment, setDoc } from "firebase/firestore";

import { User } from "@/types/user";
import { db } from "@/lib/firebase";

const addUser = async (uid: string, user: User): Promise<void> => {
  await setDoc(doc(db, "users", uid), user);
};

const getUser = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    console.log("No such document!");
    return null;
  }
};

const updateUserPhoneNumber = async (
  uid: string,
  phoneNumber: string
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { phoneNumber }, { merge: true });
};

const updateBalance = async (
  uid: string,
  amount: number,
  action: "inc" | "dec"
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  if (action === "inc") {
    await setDoc(userRef, { balance: increment(amount) }, { merge: true });
  } else {
    await setDoc(userRef, { balance: increment(-amount) }, { merge: true });
  }
};

export { addUser, getUser, updateUserPhoneNumber, updateBalance };
