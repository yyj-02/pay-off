import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import React, { useEffect, useState } from "react";
import { getUser, updateUserPhoneNumber } from "@/models/userModel";

import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "@/components/ui/use-toast";

type PhoneNumberProps = {
  uid: string | undefined;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const PhoneNumber: React.FC<PhoneNumberProps> = ({
  uid,
  isOpen,
  onOpenChange,
}) => {
  const [number, setNumber] = useState<string | null | undefined>();
  const [numberInput, setNumberInput] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);

  const fetchNumber = async () => {
    if (!uid) return;

    const user = await getUser(uid);
    setNumber(user?.phoneNumber);
  };

  useEffect(() => {
    fetchNumber();
  }, [uid]);

  const handleButtonClick = async () => {
    if (number) {
      navigator.clipboard.writeText(number);

      toast({
        variant: "default",
        title: "Number copied to clipboard",
      });
    } else if (isValidPhoneNumber(numberInput) && uid) {
      try {
        setIsDisabled(true);
        await updateUserPhoneNumber(uid, numberInput);
        fetchNumber();

        toast({
          variant: "default",
          title: "Phone number updated",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to update phone number",
        });
      } finally {
        setIsDisabled(false);
        setNumberInput("");
      }
    } else {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
      });
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              {number ? "My Phone Number" : "Start transfering money!"}
            </DrawerTitle>
            <DrawerDescription>
              {number
                ? "Use this number to send or receive payments."
                : "Add your phone number to send or receive your first payment."}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div className="h-[120px] flex items-center justify-center">
              {number ? (
                <p className="text-3xl tracking-wide">{number}</p>
              ) : (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <PhoneInput
                    placeholder="Enter a phone number"
                    value={numberInput}
                    onChange={setNumberInput}
                    disabled={isDisabled}
                  />
                </div>
              )}
            </div>
          </div>
          <DrawerFooter>
            {number && (
              <div className="flex align-top justify-center gap-1 text-muted-foreground">
                <Info className="mt-px h-3.5 w-3.5 shrink-0" />
                <p className="text-xs">
                  Email the phone number to{" "}
                  <a
                    href={`mailto:yeohyongjie@outlook.com?subject=SMS Feature Access Request: ${number}`}
                    className="underline"
                  >
                    yeohyongjie@outlook.com
                  </a>{" "}
                  to access the SMS feature. to access the SMS feature.
                </p>
              </div>
            )}
            <Button onClick={handleButtonClick} disabled={isDisabled}>
              {number ? "Copy" : "Submit"}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { PhoneNumber };
