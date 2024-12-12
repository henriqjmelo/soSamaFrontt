import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card as ShadCard,
} from "./ui/card";

type CardProps = {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};
export function Card({
  title,
  description = "",
  className = "",
  children,
}: CardProps) {
  return (
    <ShadCard
      className={`bg-custom-background-primary-light dark:bg-custom-background-primary-dark ${className}`}
    >
      <CardHeader>
        <CardTitle className="text-custom-primary-light dark:text-custom-primary-dark">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-custom-secondary-light dark:text-custom-secondary-dark">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </ShadCard>
  );
}
