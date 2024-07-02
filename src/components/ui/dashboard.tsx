import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import logo from "@/assets/logo.png";

type DashboardProps = {
  children: React.ReactNode;
  name?: string;
  handleLogout?: () => void;
};

const Dashboard: React.FC<DashboardProps> = ({
  children,
  name,
  handleLogout,
}) => {
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
        </nav>
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
    </div>
  );
};

export { Dashboard };
