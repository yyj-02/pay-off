import { Dashboard, Pages } from "@/components/ui/dashboard";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

import { Transaction } from "@/types/transaction";
import { auth } from "@/lib/firebase";
import { formatDate } from "@/lib/utils";
import { getAllTransactions } from "@/models/transactionModel";
import { getUser } from "@/models/userModel";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [name, setName] = useState<string | undefined>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        const fetchUser = async () => {
          const userObj = await getUser(user.uid);
          setName(userObj?.name);
        };

        const fetchTransactions = async () => {
          const transactions = await getAllTransactions(user.uid);
          setTransactions(transactions);
        };

        fetchUser();
        fetchTransactions();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const pages: Pages = [
    { name: "Home", url: "/", current: true },
    { name: "Top Up", url: "/topup", current: false },
    { name: "Withdraw", url: "/withdraw", current: false },
  ];

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast({
          variant: "default",
          title: "Successfully logged out",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: errorMessage,
        });
      });
  };

  return (
    <Dashboard name={name} handleLogout={handleLogout} pages={pages}>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Transactions</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[500px_1fr] lg:grid-cols-[750px_1fr]">
        <div className="grid gap-4 text-sm">
          {transactions.map((transaction) => (
            <p key={transaction.createdAt}>
              {transaction.type === "topup" ? (
                <span className="text-emerald-400">
                  You top up ${transaction.amount} on{" "}
                  {formatDate(transaction.createdAt)}
                </span>
              ) : transaction.type === "withdraw" ? (
                <span className="text-rose-400">
                  You withdraw ${transaction.amount} on{" "}
                  {formatDate(transaction.createdAt)}
                </span>
              ) : transaction.type === "transfer" ? (
                <span>xxx</span>
              ) : null}
            </p>
          ))}
        </div>
      </div>
    </Dashboard>
  );
};

export { Home };
