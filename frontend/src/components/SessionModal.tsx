import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./Input";
import { useState } from "react";
import { Button } from "./Button";
import { ToggleGroup } from "./ToggleGroup";
import { api } from "@/services/api";
import { toast } from "./ui/use-toast";

interface SessionModalProps {
    customTrigger: React.ReactNode;
    scheduleId: number;
    patientId: number | undefined; // Garantir que seja opcional para depuração
    patientName: string;
    onSave: () => void;
}

export function SessionModal({
    customTrigger,
    scheduleId,
    patientId,
    patientName,
    onSave,
}: SessionModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientAttended, setPatientAttended] = useState("false");
    const [paymentMade, setPaymentMade] = useState("false");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [notes, setNotes] = useState("");

    const formatCurrency = (value: string) => {
        const numericValue = parseFloat(value.replace(/[^0-9]/g, "")) / 100;
        if (isNaN(numericValue)) return "";
        return numericValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const handlePaymentAmountChange = (value: string) => {
        setPaymentAmount(formatCurrency(value));
    };

    const handleSave = async () => {
        if (!patientId) {
          toast({
            title: "Erro",
            description: "ID do paciente não encontrado. Tente novamente.",
            variant: "error",
          });
          return;
        }
      
        try {
          await api.post(`/patients/${patientId}/sessions`, {
            date: new Date().toISOString(),
            attended: patientAttended === "true",
            paymentMade: paymentMade === "true",
            paymentAmount: paymentMade === "true" ? parseFloat(paymentAmount.replace(/[^0-9.,]/g, '').replace(',', '.')) : null,
            notes,
          });
      
          toast({
            title: "Sessão salva com sucesso",
            variant: "success",
          });
      
          setIsModalOpen(false);
          onSave();
        } catch (error) {
          console.error("Erro ao salvar sessão:", error);
          toast({
            title: "Erro",
            description: "Não foi possível salvar a sessão. Tente novamente mais tarde.",
            variant: "error",
          });
        }
      };
      

    const handlePatientAttendedChange = (value: string) => {
        setPatientAttended(value);
        if (value === "false") {
            setPaymentMade("false");
            setPaymentAmount("");
        }
    };

    const handlePaymentMadeChange = (value: string) => {
        setPaymentMade(value);
        if (value === "false") {
            setPaymentAmount("");
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            {customTrigger ? (
                <DialogTrigger onClick={() => setIsModalOpen(true)}>
                    {customTrigger}
                </DialogTrigger>
            ) : (
                <DialogTrigger
                    className="hover:bg-custom-primary-light hover:dark:bg-custom-primary-dark text-custom-primary-light hover:text-custom-background-primary-light p-2 rounded-lg transition-all flex items-center gap-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    Adicionar Sessão
                </DialogTrigger>
            )}
            <DialogContent className="bg-custom-background-primary-light dark:bg-custom-background-primary-dark">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-custom-primary-light dark:text-custom-primary-dark">
                        Sessão de {patientName}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Cliente compareceu?
                        </label>
                        <ToggleGroup
                            buttons={[
                                { name: "Sim", value: "true" },
                                { name: "Não", value: "false" },
                            ]}
                            defaultValue={patientAttended}
                            onSelectionChange={handlePatientAttendedChange}
                        />
                    </div>
                    {patientAttended === "true" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cliente fez o pagamento?
                            </label>
                            <ToggleGroup
                                buttons={[
                                    { name: "Sim", value: "true" },
                                    { name: "Não", value: "false" },
                                ]}
                                defaultValue={paymentMade}
                                onSelectionChange={handlePaymentMadeChange}
                            />
                            {paymentMade === "true" && (
                                <Input
                                    label="Valor do Pagamento"
                                    placeholder="R$ 0,00"
                                    value={paymentAmount}
                                    onChange={(e) =>
                                        handlePaymentAmountChange(e.target.value)
                                    }
                                />
                            )}
                        </div>
                    )}
                    <Input
                        label="Anotações"
                        placeholder="Adicione informações relevantes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <Button title="Salvar" variant="primary" onClick={handleSave} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
