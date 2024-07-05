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

const Withdraw = () => {
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
    { name: "Top Up", url: "/topup", current: false },
    { name: "Withdraw", url: "/withdraw", current: true },
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

  const handleWithdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDisabled(true);

    if (uid) {
      const withdrawTransaction: Transaction = {
        from: uid,
        to: null,
        amount,
        type: "withdraw",
        createdAt: Date.now(),
      };

      try {
        const userObj = await getUser(uid);
        if (userObj?.balance === undefined || userObj?.balance < amount) {
          throw new Error("Insufficient balance");
        }

        await addTransaction(withdrawTransaction);
        await updateBalance(uid, amount, "dec");

        toast({
          variant: "default",
          title: "Withdrawal successful",
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
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
        <h1 className="text-3xl font-semibold">Withdraw</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <form onSubmit={handleWithdraw}>
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
              Withdraw
            </Button>
          </div>
        </form>
      </div>
    </Dashboard>
  );
};

export { Withdraw };
