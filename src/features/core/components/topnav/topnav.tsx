import { useAuth } from "@features/auth";
import { useTenantId } from "@shared/selectors/globalSelectors";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { LogOut } from "lucide-react";
import React, { useState } from "react";
import { useUtility } from "../../hooks";
import { bentomenu as Bentomenu } from "../bentomenu/bentomenu";
import { TopnavSkeleton } from "./topnav-skeleton";
import { useUserName } from "@shared/selectors/globalSelectors";
interface topnavProps {
  // Add your props here
}

export const topnav: React.FC<topnavProps> = () => {
  const name = useUserName();
  const [bentoOpen, setBentoOpen] = useState(false);
  const { userProfile, isProfileLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get tenant ID from user profile
  // const tenantId = userProfile?.utility?.tenant?.id;
  const tenantId = useTenantId();

  // Use the utility hook with tenant ID
  const {
    utilities,
    selectedUtility,
    setSelectedUtility,
    loading: utilitiesLoading,
    clearUtility,
  } = useUtility(tenantId);

  // Handle logout with utility cleanup
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Clear utility data on logout
      clearUtility();

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
      .slice(0, 2) // take first two words (e.g., first name and last name)
      .map((n) => n.charAt(0).toUpperCase())
      .join("");

    return initials;
  };

  // Show loading skeleton while data is being fetched
  if (utilitiesLoading || isProfileLoading) {
    return <TopnavSkeleton />;
  }

  return (
    <header className="w-full bg-white shadow-sm flex items-center justify-between px-6 h-16">
      <div className="flex items-center gap-2">
        <button
          className="flex items-center p-1.5 rounded hover:bg-blue-50"
          onClick={() => setBentoOpen(true)}
          aria-label="Open bento menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="5" cy="5" r="2" fill="#111827" />
            <circle cx="14" cy="5" r="2" fill="#111827" />
            <circle cx="23" cy="5" r="2" fill="#111827" />
            <circle cx="5" cy="14" r="2" fill="#111827" />
            <circle cx="14" cy="14" r="2" fill="#111827" />
            <circle cx="23" cy="14" r="2" fill="#111827" />
            <circle cx="5" cy="23" r="2" fill="#111827" />
            <circle cx="14" cy="23" r="2" fill="#111827" />
            <circle cx="23" cy="23" r="2" fill="#111827" />
          </svg>
        </button>
        <span className="text-xl font-bold flex items-center gap-1">
          <span className="text-black">SMART</span>
          <span className="text-blue-600">360</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Utility Selector */}
        <Select
          value={selectedUtility || ""}
          onValueChange={setSelectedUtility}
          disabled={utilities.length === 0}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select utility" />
          </SelectTrigger>
          <SelectContent>
            {utilities.map((utility) => (
              <SelectItem key={utility.id} value={utility.name}>
                {utility.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* User Profile Dropdown */}
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

      <Bentomenu open={bentoOpen} onClose={() => setBentoOpen(false)} />
    </header>
  );
};
