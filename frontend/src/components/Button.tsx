import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  title: string;
  variant: "primary" | "secondary" | "delete";
  className?: string;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  title,
  className = "",
  variant,
  isLoading,
  ...rest
}: ButtonProps) {
  let variantCN = "";
  switch (variant) {
    case "primary":
      variantCN =
        "bg-custom-primary-light dark:bg-custom-primary-dark hover:bg-custom-primary-light/90 dark:hover:bg-custom-primary-dark/90";
      break;
    case "secondary":
      variantCN =
        "bg-custom-secondary-light dark:bg-custom-secondary-dark hover:bg-custom-secondary-light/90 dark:hover:bg-custom-secondary-dark/90";
      break;
    case "delete":
      variantCN =
        "bg-custom-danger-light dark:bg-custom-danger-dark hover:bg-custom-danger-light/90 dark:hover:bg-custom-danger-dark/90";
      break;
  }

  variantCN += " " + className;
  return (
    <button
      type="button"
      className={`${variantCN} flex gap-2 items-center justify-center w-full p-4 text-custom-text-primary-light font-medium text-lg rounded-xl`}
      {...rest}
    >
      {isLoading && (
        <div className="size-5 rounded-full animate-spin border-2 border-custom-text-primary-light/40 border-t-custom-text-primary-light dark:border-custom-text-primary-dark/40 dark:border-t-custom-text-primary-dark"></div>
      )}
      {title}
    </button>
  );
}
