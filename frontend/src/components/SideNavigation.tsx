import { IoMenuSharp } from "react-icons/io5";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Navigation } from "./Navigation";

export function SideNavigation() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <IoMenuSharp className="text-3xl text-custom-primary-light dark:text-custom-primary-dark" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-custom-background-primary-light w-[40%]"
      >
        <Navigation />
      </SheetContent>
    </Sheet>
  );
}
