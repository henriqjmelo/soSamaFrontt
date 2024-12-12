import { useTheme } from "@/hooks/use-theme";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  function switchTheme() {
    toggleTheme();
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {theme === "light" ? (
            <button type="button" onClick={switchTheme}>
              <IoMoonOutline className="text-3xl text-sky-500 hover:scale-125 transition-transform" />
            </button>
          ) : (
            <button type="button" onClick={switchTheme}>
              <IoSunnyOutline className="text-3xl text-custom-text-primary-light hover:scale-125 transition-transform" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent>
          {theme === "light" ? (
            <div className="flex gap-1 items-center text-sky-500">
              <IoMoonOutline />
              <p>Dark Theme</p>
            </div>
          ) : (
            <div className="flex gap-1 items-center">
              <IoSunnyOutline />
              <p>Light Theme</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
