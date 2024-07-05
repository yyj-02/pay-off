type Transaction = {
  from: string | null;
  to: string | null;
  amount: number;
  type: "topup" | "withdraw" | "transfer";
  createdAt: number;
};

const addTransfer = async (
  db: any,
  id: string,
  sender: string,
  receiver: string,
  amount: number
): Promise<void> => {
  const transferTransaction: Transaction = {
    from: sender,
    to: receiver,
    amount,
    type: "transfer",
    createdAt: Date.now(),
  };

  await db.collection("transactions").doc(id).set(transferTransaction);
};

export {addTransfer};
