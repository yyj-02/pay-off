import { Dashboard, Pages } from "@/components/dashboard";
import { getUser, getUserNameOrPhoneNumberById } from "@/models/userModel";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";
import { auth } from "@/lib/firebase";
import { formatDate } from "@/lib/utils";
import { getAllTransactions } from "@/models/transactionModel";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [uid, setUid] = useState<string | undefined>();
  const [hasPhoneNumber, setHasPhoneNumber] = useState<boolean>(true);
  const [name, setName] = useState<string | undefined>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isPhoneNumberOpen, setIsPhoneNumberOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUid(user.uid);

        const fetchUser = async () => {
          const userObj = await getUser(user.uid);
          setName(userObj?.name);
          setHasPhoneNumber(!!userObj?.phoneNumber);
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

  const [idToName, setIdToName] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchNames = async () => {
      const cleanedTransactions = transactions.filter(
        (transaction) => transaction.to
      );
      const ids = cleanedTransactions.map((transaction) => transaction.to!);
      const names = await Promise.all(
        ids.map((id) => getUserNameOrPhoneNumberById(id))
      );
      const idToName: Record<string, string> = {};
      ids.forEach((id, index) => {
        idToName[id] = names[index];
      });
      setIdToName(idToName);
    };
    fetchNames();
  }, [transactions]);

  if (!uid) return null;
  return (
    <Dashboard
      uid={uid}
      name={name}
      handleLogout={handleLogout}
      pages={pages}
      hasPhoneNumber={hasPhoneNumber}
      openPhoneNumber={isPhoneNumberOpen}
      onChangePhoneNumberOpen={setIsPhoneNumberOpen}
    >
      {hasPhoneNumber || (
        <>
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">
              Add a phone number to start 🙌
            </h1>
            <Button
              onClick={() => setIsPhoneNumberOpen(true)}
              className="w-full md:w-fit mt-4"
            >
              Add Phone Number
            </Button>
          </div>
        </>
      )}
      {(transactions.length !== 0 || hasPhoneNumber) && (
        <>
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Transactions</h1>
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[500px_1fr] lg:grid-cols-[750px_1fr]">
            <div className="grid gap-4 text-sm">
              {transactions.length === 0 && <p>No transactions yet 😌</p>}
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
                    <span>
                      You transfer ${transaction.amount} to{" "}
                      {transaction.to ? idToName[transaction.to] : "someone"} on{" "}
                      {formatDate(transaction.createdAt)}
                    </span>
                  ) : null}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </Dashboard>
  );
};

export { Home };
