import { Dashboard, Pages } from "@/components/dashboard";
import { getUser, updateBalance } from "@/models/userModel";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Transaction } from "@/types/transaction";
import { addTransaction } from "@/models/transactionModel";
import { auth } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const TopUp = () => {
  const [uid, setUid] = useState<string | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [hasPhoneNumber, setHasPhoneNumber] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState(false);

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

        fetchUser();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const pages: Pages = [
    { name: "Home", url: "/", current: false },
    { name: "Top Up", url: "/topup", current: true },
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

  const handleTopUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDisabled(true);

    if (uid) {
      const topUpTransaction: Transaction = {
        from: null,
        to: uid,
        amount,
        type: "topup",
        createdAt: Date.now(),
      };

      try {
        // Add the transaction to the user's transactions
        // Update the user's balance
        // Notify the user that the top up was successful
        addTransaction(topUpTransaction);
        updateBalance(uid, amount, "inc");

        toast({
          variant: "default",
          title: "Top up successful",
        });

        navigate("/");
      } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: errorMessage,
        });
      } finally {
        setIsDisabled(false);
      }
    }

    setIsDisabled(false);
  };

  if (!uid) return null;
  return (
    <Dashboard
      uid={uid}
      name={name}
      handleLogout={handleLogout}
      pages={pages}
      hasPhoneNumber={hasPhoneNumber}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Top Up</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <form onSubmit={handleTopUp}>
          <div className="grid gap-4 text-sm">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <CurrencyInput setAmount={setAmount} isDisabled={isDisabled} />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isDisabled || amount <= 0}
            >
              Top Up
            </Button>
          </div>
        </form>
      </div>
    </Dashboard>
  );
};

export { TopUp };
