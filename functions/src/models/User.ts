export type User = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string | null;
  balance: number;
};

const findUserByPhoneNumber = async (
  db: any,
  phoneNumber: string
): Promise<{ id: string; data: User } | null> => {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.where("phoneNumber", "==", phoneNumber).get();
  if (snapshot.empty) {
    return null;
  }

  return { id: snapshot.docs[0].id, data: snapshot.docs[0].data() as User };
};

const updateUserBalance = async (
  db: any,
  id: string,
  newBalance: number
): Promise<void> => {
  const userRef = db.collection("users").doc(id);
  await userRef.update({ balance: newBalance });
};

export { findUserByPhoneNumber, updateUserBalance };
