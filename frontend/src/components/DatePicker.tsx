import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdOutlineWarning } from "react-icons/md";

type DatePickerProps = {
  label?: string;
  selectedDate?: Date;
  error?: string;
  onDateChange?: (date: Date) => void;
};

export function DatePicker({
  selectedDate,
  onDateChange,
  error,
  label = "Data",
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate);

  function dateChangedEvent(date: Date | undefined) {
    if (onDateChange && date) {
      setDate(date);
      onDateChange(date);
    }
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        className={`${error
            ? "text-custom-danger-light dark:text-custom-danger-dark"
            : "text-custom-primary-light dark:text-custom-primary-dark"
          } font-medium`}
      >
        {label}
      </label>
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            id="date-picker" // Atributo único para o botão de gatilho
            data-testid="date-picker" // Alternativa para testes
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", { locale: ptBR })
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            className={cn("z-30")}
            locale={ptBR}
            mode="single"
            selected={date}
            onSelect={dateChangedEvent}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <div className="flex gap-1 items-center">
          <MdOutlineWarning className="text-custom-danger-light dark:text-custom-danger-dark" />
          <p className="text-sm text-custom-danger-light dark:text-custom-danger-dark">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
