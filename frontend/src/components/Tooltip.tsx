import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip as ShadToolTip,
  TooltipContent,
} from "./ui/tooltip";

type ToolTipProps = {
  message: string;
  children: React.ReactNode;
};

export function ToolTip({ message, children }: ToolTipProps) {
  return (
    <TooltipProvider>
      <ShadToolTip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </ShadToolTip>
    </TooltipProvider>
  );
}
