export type Transaction = {
  from: string | null;
  to: string | null;
  amount: number;
  type: "topup" | "withdraw" | "transfer";
  createdAt: number;
};
