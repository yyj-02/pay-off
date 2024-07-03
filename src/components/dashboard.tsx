import { CircleUser, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PhoneNumber } from "./phone-number";
import { QrCode } from "./qr-code";
import logo from "@/assets/logo.png";
import { useState } from "react";

export type Pages = {
  name: string;
  url: string;
  current: boolean;
}[];

type DashboardProps = {
  children: React.ReactNode;
  uid: string | undefined;
  name?: string;
  handleLogout?: () => void;
  pages?: Pages;
  hasPhoneNumber?: boolean;
};

const Dashboard: React.FC<DashboardProps> = ({
  children,
  uid,
  name,
  handleLogout,
  pages = [],
  hasPhoneNumber = false,
}) => {
  const [isPhoneNumberOpen, setIsPhoneNumberOpen] = useState(false);
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <div className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <div className="h-8 w-8">
              <img
                className="h-full w-full aspect-square"
                src={logo}
                alt="Payoff"
              />
            </div>
          </div>
          <p className="text-foreground transition-colors hover:text-foreground text-lg">
            Payoff
          </p>
          {pages.map((page) => (
            <Link
              key={page.url}
              to={page.url}
              className={`${
                page.current ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground shrink-0`}
            >
              {page.name}
            </Link>
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <div className="h-7 w-7">
                  <img
                    className="h-full w-full aspect-square"
                    src={logo}
                    alt="Payoff"
                  />
                </div>
                <span className="sr-only">Payoff</span>
              </div>
              {pages.map((page) => (
                <Link
                  key={page.url}
                  to={page.url}
                  className={`${
                    page.current ? "text-foreground" : "text-muted-foreground"
                  } hover:text-foreground`}
                >
                  {page.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="shrink-0 md:hidden w-7 h-7">
          <img className="h-full w-full" src={logo} alt="Payoff" />
        </div>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full ml-auto"
              >
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {name ? `Hello, ${name}!` : "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsPhoneNumberOpen(true)}>
                My Phone Number
              </DropdownMenuItem>
              {hasPhoneNumber && (
                <DropdownMenuItem onClick={() => setIsQrCodeOpen(true)}>
                  QR Pay
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/5"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        {children}
      </main>
      <PhoneNumber
        isOpen={isPhoneNumberOpen}
        onOpenChange={setIsPhoneNumberOpen}
        uid={uid}
      />
      <QrCode isOpen={isQrCodeOpen} onOpenChange={setIsQrCodeOpen} uid={uid} />
    </div>
  );
};

export { Dashboard };
