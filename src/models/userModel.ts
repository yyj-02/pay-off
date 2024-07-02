import { doc, getDoc, setDoc } from "firebase/firestore";

import { User } from "@/types/user";
import { db } from "@/lib/firebase";

const addUser = async (uid: string, user: User): Promise<void> => {
  await setDoc(doc(db, "users", uid), user);
};

const getUser = async (uid: string): Promise<User | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user: ", error);
    return null;
  }
};

const updateUserPhoneNumber = async (
  uid: string,
  phoneNumber: string
): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { phoneNumber }, { merge: true });
    console.log(`User with UID ${uid} updated successfully.`);
  } catch (error) {
    console.error("Error updating user: ", error);
  }
};

export { addUser, getUser, updateUserPhoneNumber };
