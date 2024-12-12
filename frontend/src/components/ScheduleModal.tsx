import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./Input";
import { useState } from "react";
import { SelectInput } from "./SelectInput";
import { DatePicker } from "./DatePicker";
import { Button } from "./Button";
import Patient from "@/pages/Patients/Patient";
import { api } from "@/services/api";
import { ToggleGroup } from "./ToggleGroup";
import { format } from "date-fns";

type ScheduleModalProps = {
  defaultDate: Date;
  presenceStatus?: "presencial" | "online";
  pacientes: { id: number; name: string }[];
  updatedPatient?: Patient;
  onScheduleSave?: () => void;
  scheduleId?: number;
  customTrigger?: React.ReactNode;
};

type Patient = {
  id: number;
  name: string;
};

type Error = {
  patient: string;
  data: string;
  hora: string;
};

export function ScheduleModal({
  defaultDate,
  pacientes,
  onScheduleSave,
  scheduleId,
  customTrigger,
  updatedPatient,
  presenceStatus,
}: ScheduleModalProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(
    updatedPatient ?? {
      id: 0,
      name: "",
    }
  );
  const [data, setData] = useState<Date>(defaultDate);
  const [hora, setHora] = useState(
    scheduleId ? format(defaultDate, "HH:mm") : ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presence, setPresence] = useState<"presencial" | "online">(
    presenceStatus ?? "presencial"
  );
  const [errors, setErrors] = useState<Error>({
    patient: "",
    data: "",
    hora: "",
  });

  function handlePatientSelected(value: string, label: string) {
    setErrors((prev) => ({ ...prev, patient: "" }));
    setSelectedPatient({ id: Number(value), name: label });
  }

  function handleDataChange(date: Date) {
    setData(date);
    setErrors((prev) => ({ ...prev, data: "" }));
  }

  function handleHoraChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Implementar validação da hora aqui
    setHora(e.target.value);
    setErrors((prev) => ({ ...prev, hora: "" }));
  }
  function handleModalClose(modalOpen: boolean) {
    if (!modalOpen) {
      setData(defaultDate);
      setErrors({ patient: "", data: "", hora: "" });
      if (!scheduleId) {
        setHora("");
        setSelectedPatient({ id: 0, name: "" });
      }
    }
    setIsModalOpen(modalOpen);
  }

  function validateFields() {
    let isPatientSelected = true;
    let isDateSelected = true;
    let isHourValid = true;
    const hoje = new Date();

    // Valida paciente
    if (!selectedPatient.id) {
      isPatientSelected = false;
      setErrors((prev) => ({ ...prev, patient: "Selecione um paciente" }));
    }
    console.log(typeof data);
    //Valida data
    if (!data) {
      isDateSelected = false;
      setErrors((prev) => ({ ...prev, data: "Selecione a data da consulta" }));
    } else if (data.getDate() < hoje.getDate()) {
      isDateSelected = false;
      setErrors((prev) => ({
        ...prev,
        data: "A data da consulta não pode ser anterior a hoje",
      }));
    }
    // Validar paciente
    // Validar hora
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!hora || !regex.test(hora)) {
      isHourValid = false; // Verifica se a string está vazia ou é null/undefined
      setErrors((prev) => ({ ...prev, hora: "Selecione a hora da consulta" }));
    }

    return isPatientSelected && isDateSelected && isHourValid;
  }

  async function handleCreateScheduleClick() {
    if (!validateFields()) return;
  
    // Extrair horas e minutos da string de horário
    const [hours, minutes] = hora.split(":").map(Number);
  
    // Criar uma nova data com a mesma data e o horário ajustado
    const combinedDateTime = new Date(data);
    combinedDateTime.setHours(hours, minutes, 0, 0);
  
    const patient_id = selectedPatient.id;
    const schedule_dateTime = combinedDateTime;
    const isPresencial = presence === "presencial" ? true : false;
  
    try {
      if (scheduleId) {
        await api.put(`schedules/${scheduleId}`, {
          schedule_dateTime,
          isPresencial,
        });
      } else {
        // Inserir o novo agendamento no banco de dados
        await api.post("schedules", {
          patient_id,
          schedule_dateTime,
          isPresencial,
        });
      }
  
      // Fechar o modal e limpar os dados
      setData(defaultDate);
      if (!scheduleId) setHora("");
      setErrors({ patient: "", data: "", hora: "" });
      setIsModalOpen(false);
  
      if (!scheduleId) setSelectedPatient({ id: 0, name: "" });
      if (onScheduleSave) onScheduleSave();
    } catch (error: any) {
      // Verificar se o erro contém uma resposta da API
      if (error.response) {
        // API retornou um erro com status e dados
        const status = error.response.status;
        const message = error.response.data?.message || "Erro inesperado.";
  
        // Log do erro para depuração
        console.error(
          `Erro ao salvar agendamento: Status ${status}, Message: ${message}`
        );
  
        // Exibir mensagem de erro ao usuário
        alert(
          `Não foi possível salvar o agendamento. Motivo: ${
            message || "Erro desconhecido."
          }`
        );
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta
        console.error("Erro de rede ou servidor não respondeu:", error.request);
        alert(
          "Não foi possível salvar o agendamento. Verifique sua conexão com a internet ou tente novamente mais tarde."
        );
      } else {
        // Erro ao configurar a requisição
        console.error("Erro inesperado:", error.message);
        alert("Ocorreu um erro inesperado. Por favor, tente novamente.");
      }
    }
  }
  

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      {customTrigger ? (
        <DialogTrigger onClick={() => setIsModalOpen(true)}>
          {customTrigger}
        </DialogTrigger>
      ) : (
        <DialogTrigger
          className="hover:bg-custom-primary-light hover:dark:bg-custom-primary-dark text-custom-primary-light hover:text-custom-background-primary-light p-2 rounded-lg transition-all flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="text-lg">+</span>
          Novo Agendamento
        </DialogTrigger>
      )}
      <DialogContent className="bg-custom-background-primary-light dark:bg-custom-background-primary-dark">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-custom-primary-light dark:text-custom-primary-dark">
            {scheduleId ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
        </DialogHeader>
        <form className="w-full flex flex-col gap-2">
          <ToggleGroup
            buttons={[
              { name: "Presencial", value: "presencial" },
              { name: "Online", value: "online" },
            ]}
            defaultValue={presence}
            onSelectionChange={(value) => {
              if (value === "presencial" || value === "online") {
                setPresence(value);
              }
            }}
          />
          <SelectInput
            label="Paciente"
            error={errors.patient}
            selectedLabel={selectedPatient.name}
            placeholder="ex: João da Silva"
            onSelectionChange={handlePatientSelected}
            options={pacientes.map((paciente) => {
              return {
                value: String(paciente.id),
                label: paciente.name,
              };
            })}
            disabled={scheduleId ? true : false}
          />
          <DatePicker
            selectedDate={data}
            onDateChange={handleDataChange}
            error={errors.data}
          />
          <Input
            name="hora"
            mask="99:99"
            label="Hora"
            value={hora}
            placeholder="ex: 14:30"
            onChange={handleHoraChange}
            error={errors.hora}
          />
          <Button
            title="Salvar"
            variant="primary"
            onClick={handleCreateScheduleClick}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
