import { Dashboard, Pages } from "@/components/ui/dashboard";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import { getUser } from "@/models/userModel";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const TopUp = () => {
  const [name, setName] = useState<string | undefined>();
  const [amount, setAmount] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/login");
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userObj = await getUser(user.uid);
        setName(userObj?.name);
      }
    };

    fetchUser();
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

  return (
    <Dashboard name={name} handleLogout={handleLogout} pages={pages}>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Top Up</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <div className="grid gap-4 text-sm">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <CurrencyInput setAmount={setAmount} isDisabled={isDisabled} />
          </div>
          <Button type="submit" className="w-full" disabled={isDisabled}>
            Top Up
          </Button>
        </div>
      </div>
    </Dashboard>
  );
};

export { TopUp };
