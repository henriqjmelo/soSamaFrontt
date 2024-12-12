import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { BiLogOutCircle } from "react-icons/bi";

export function Avatar() {
  const { signOut } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="cursor-pointer flex items-center justify-center size-7 rounded-full border-2 border-custom-primary-light dark:border-custom-primary-dark">
          <img
            className="size-7 rounded-full"
            src="https://github.com/fredericogrz.png"
            alt="User Avatar"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer hover:font-medium flex items-center gap-2"
          onClick={signOut}
        >
          <BiLogOutCircle className="text-lg" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
