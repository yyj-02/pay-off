import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

import { Dashboard } from "@/components/ui/dashboard";
import { auth } from "@/lib/firebase";
import { getUser } from "@/models/userModel";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [name, setName] = useState<string | undefined>(null);

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
    <Dashboard name={name} handleLogout={handleLogout}>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Transactions</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <div className="grid gap-4 text-sm">
          <p>you paid xxx yyy</p>
          <p>aaa paid you xxx</p>
          <p>you paid xxx xxx</p>
        </div>
      </div>
    </Dashboard>
  );
};

export { Home };
