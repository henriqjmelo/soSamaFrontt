import { Header } from "./Header";
import { Navigation } from "./Navigation";

type DefaultContainerProps = {
  children: React.ReactNode;
  page: string;
  className?: string;
};

export function DefaultContainer({
  className = "",
  page,
  children,
}: DefaultContainerProps) {
  return (
    <div
      className={`${
        className
          ? className
          : "min-h-screen w-full bg-custom-background-secondary-light dark:bg-custom-background-secondary-dark grid grid-cols-1 lg:grid-cols-12"
      }`}
    >
      <Header page={page} />
      <aside className="hidden lg:flex lg:col-span-2 lg:row-start-1 lg:row-span-12 z-10 bg-custom-background-primary-light dark:bg-custom-background-primary-dark">
        <Navigation />
      </aside>
      {children}
    </div>
  );
}
