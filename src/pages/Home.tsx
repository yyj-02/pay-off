import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dashboard, Pages } from "@/components/dashboard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUser, getUserNameOrPhoneNumberById } from "@/models/userModel";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";
import { User } from "@/types/user";
import { auth } from "@/lib/firebase";
import { formatDate } from "@/lib/utils";
import { getAllTransactions } from "@/models/transactionModel";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [uid, setUid] = useState<string | undefined>();
  const [user, setUser] = useState<User | null>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isPhoneNumberOpen, setIsPhoneNumberOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUid(user.uid);

        const fetchUser = async () => {
          const userObj = await getUser(user.uid);
          setUser(userObj);
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

  const [idToName, setIdToName] = useState<
    Record<
      string,
      { name: string | undefined; phoneNumber: string | null | undefined }
    >
  >({});

  useEffect(() => {
    const fetchNames = async () => {
      setIsLoading(true);
      const ids = transactions
        .flatMap((transaction) => [transaction.to!, transaction.from!])
        .filter(Boolean);

      const namesAndPhoneNumbers = await Promise.all(
        ids.map((id) => getUserNameOrPhoneNumberById(id))
      );
      const idToName: Record<
        string,
        { name: string | undefined; phoneNumber: string | null | undefined }
      > = {};
      ids.forEach((id, index) => {
        idToName[id] = namesAndPhoneNumbers[index];
      });
      setIdToName(idToName);
      setIsLoading(false);
    };
    fetchNames();
  }, [transactions]);

  if (!uid) return null;
  return (
    <Dashboard
      uid={uid}
      name={user?.name}
      handleLogout={handleLogout}
      pages={pages}
      hasPhoneNumber={user?.phoneNumber !== null}
      openPhoneNumber={isPhoneNumberOpen}
      onChangePhoneNumberOpen={setIsPhoneNumberOpen}
    >
      {user?.phoneNumber === null && (
        <>
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="pb-2 text-3xl font-semibold">
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
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <Card>
          <CardContent>
            <p className="pt-6 pb-3">Your Balance</p>
            <p className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              ${user?.balance}
            </p>
          </CardContent>
        </Card>
      </div>
      {(transactions.length !== 0 || user?.phoneNumber !== null) && (
        <>
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h2 className="border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
              Transactions
            </h2>
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[500px_1fr] lg:grid-cols-[750px_1fr]">
            <div className="grid gap-4 text-sm">
              {transactions.length === 0 && <p>No transactions yet 😌</p>}
              {isLoading ||
                transactions.map((transaction) => (
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
                      transaction.to === uid ? (
                        <span>
                          <Tooltip>
                            <TooltipTrigger>
                              {idToName[transaction.from!]?.name || "Someone"}
                            </TooltipTrigger>
                            <TooltipContent>
                              {idToName[transaction.from!]?.phoneNumber ||
                                "Number not found"}
                            </TooltipContent>
                          </Tooltip>
                          transfer ${transaction.amount} to you on{" "}
                          {formatDate(transaction.createdAt)}
                        </span>
                      ) : (
                        <span>
                          You transfer ${transaction.amount} to{" "}
                          <Tooltip>
                            <TooltipTrigger>
                              {idToName[transaction.to!]?.name || "someone"}
                            </TooltipTrigger>
                            <TooltipContent>
                              {idToName[transaction.to!]?.phoneNumber ||
                                "Number not found"}
                            </TooltipContent>
                          </Tooltip>{" "}
                          on {formatDate(transaction.createdAt)}
                        </span>
                      )
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
