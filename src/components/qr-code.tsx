// @ts-nocheck
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import React, { createRef, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { getUser } from "@/models/userModel";
import html2canvas from "html2canvas";
import logo from "@/assets/logo.png";

type QrCodeProps = {
  uid: string | undefined;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const QrCode: React.FC<QrCodeProps> = ({ uid, isOpen, onOpenChange }) => {
  const [number, setNumber] = useState<string | null | undefined>();
  const [name, setName] = useState<string | null | undefined>();
  const qrRef = createRef();

  const fetchNumber = async () => {
    if (!uid) return;

    const user = await getUser(uid);
    setNumber(user?.phoneNumber);
    setName(user?.name);
  };

  useEffect(() => {
    fetchNumber();
  }, [uid]);

  const smsTemplate = `smsto:+13854692720:[Payoff Transfer]\n\nRecipient:\n${number} ${
    name ? ` (${name})` : ""
  }\n\nAmount:\n$<AMOUNT>`;

  const downloadQr = async () => {
    if (!qrRef.current) return;

    const qrCode = qrRef.current;
    const canvas = await html2canvas(qrCode);
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!number) return null;
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>My Qr Code</DrawerTitle>
            <DrawerDescription>
              Let others scan your QR code to pay you.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div className="h-[120px] flex items-center justify-center">
              <qr-code
                ref={qrRef}
                contents={smsTemplate}
                style={{ height: "190px", width: "190px" }}
              >
                <img src={logo} slot="icon" />
              </qr-code>
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
                  to access the SMS feature
                </p>
              </div>
            )}
            <Button onClick={downloadQr}>Save to album</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { QrCode };
