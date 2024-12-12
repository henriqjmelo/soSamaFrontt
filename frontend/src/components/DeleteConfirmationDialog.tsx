import { cn } from "@/lib/utils";
import { Button } from "./Button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import { useState } from "react";

type DeleteConfirmationDialogProps = {
  message: string;
  handleRemoveFunction: () => void;
  customTrigger?: React.ReactNode;
};

export function DeleteConfirmationDialog({
  message,
  handleRemoveFunction,
  customTrigger,
}: DeleteConfirmationDialogProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger
        onClick={() => setIsModalOpen(true)}
        className={cn("w-2/3")}
      >
        {customTrigger || <Button title="Remover" variant="delete" />}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "bg-custom-background-primary-light dark:bg-custom-background-primary-dark"
        )}
      >
        <DialogHeader>
          <DialogTitle className={cn("text-lg text-custom-text-primary-dark")}>
            {message}
          </DialogTitle>
          <DialogDescription>Esta ação não pode ser desfeita</DialogDescription>
        </DialogHeader>
        <div className="w-full flex gap-1">
          <Button
            title="Remover"
            variant="delete"
            onClick={handleRemoveFunction}
            className="w-2/3"
          />
          <DialogClose className="w-1/3">
            <Button title="Cancelar" variant="secondary" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
