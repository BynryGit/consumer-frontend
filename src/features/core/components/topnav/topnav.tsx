import { useAuth } from "@features/auth/hooks";
import { useUserName } from "@shared/selectors/globalSelectors";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@shared/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import React, { useState } from "react";

interface TopnavProps {
  // Add your props here if needed
}

export const Topnav: React.FC<TopnavProps> = () => {
  const name = useUserName();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (fullName: string): string => {
    if (!fullName) return "";

    const names = fullName.trim().split(" ");
    const initials = names
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join("");

    return initials;
  };

  return (
    <header className="w-full bg-white shadow-sm flex items-center justify-between px-6 h-16">
      <span className="text-xl font-bold flex items-center gap-1">
        <span className="text-black">SMART</span>
        <span className="text-blue-600">360</span>
      </span>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Avatar>
                <AvatarFallback>
                  {name ? getInitials(name) : "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-600"
              asChild
            >
              <AlertDialog>
                <AlertDialogTrigger className="flex w-full items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will end your current session and you'll need to
                      login again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};