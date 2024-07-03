import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getUser } from "@/models/userModel";

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

  useEffect(() => {
    const fetchNumber = async () => {
      if (!uid) return;

      const user = await getUser(uid);
      setNumber(user?.phoneNumber);
    };

    fetchNumber();
  }, [uid]);

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
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2"></div>
            <div className="mt-3 h-[120px]"></div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { PhoneNumber };
