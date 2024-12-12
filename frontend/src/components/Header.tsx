import { ThemeSwitcher } from "./ThemeSwitcher";
import { Avatar } from "./Avatar";
import { SideNavigation } from "./SideNavigation";

type HeaderProps = {
  page: string;
  className?: string;
};

export function Header({ page, className = "" }: HeaderProps) {
  return (
    <header
      className={`${className} px-4 flex items-center justify-between shadow-lg col-span-1 lg:col-span-10 h-12 lg:col-start-3 lg:bg-custom-background-primary-light lg:dark:bg-custom-background-primary-dark`}
    >
      <SideNavigation />

      <p className="text-xl font-bold text-custom-primary-light dark:text-custom-primary-dark">
        {page}
      </p>
      <div className="flex gap-3 items-center justify-center">
        <div className="pt-1">
          <ThemeSwitcher />
        </div>
        <Avatar />
      </div>
    </header>
  );
}
