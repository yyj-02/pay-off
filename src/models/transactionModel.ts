import {
  addDoc,
  collection,
  getDocs,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { Transaction } from "@/types/transaction";
import { db } from "@/lib/firebase";

const addTransaction = async (transaction: Transaction): Promise<void> => {
  await addDoc(collection(db, "transactions"), transaction);
};

const getAllTransactions = async (uid: string): Promise<Transaction[]> => {
  const transactionsRef = collection(db, "transactions");
  const q = query(
    transactionsRef,
    or(where("from", "==", uid), where("to", "==", uid)),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Transaction);
};

export { addTransaction, getAllTransactions };
