import { Card } from "@/components/Card";
import { DefaultContainer } from "@/components/DefaultContainer";
import { Table } from "@/components/Table";
import { TableCell, TableRow } from "@/components/ui/table";
import { FaWhatsapp, FaUserCheck } from "react-icons/fa6";
import { FaUserClock, FaRegTrashAlt } from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { AiOutlineLaptop } from "react-icons/ai";
import { TbNotebook } from "react-icons/tb";
import { ToolTip } from "@/components/Tooltip";
import { format, addDays, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScheduleModal } from "@/components/ScheduleModal";
import { SessionModal } from "@/components/SessionModal";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";

type Paciente = {
  id: number;
  name: string;
};

type Schedule = {
  id: number;
  isPresencial: boolean;
  patient_id: number;
  schedule_date_time: Date;
  patient_name: string;
  patient_whatsapp: string;
};

export default function Schedules() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { toast } = useToast();

  function getDates() {
    const today = new Date();
    const daysArray = eachDayOfInterval({
      start: today,
      end: addDays(today, 30),
    });

    setDates(daysArray);
  }

  function getFormattedDates(date: Date) {
    const isToday =
      format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    const isTomorrow =
      format(date, "yyyy-MM-dd") ===
      format(
        new Date(new Date().setDate(new Date().getDate() + 1)),
        "yyyy-MM-dd"
      );

    let formattedDate = format(date, "d MMMM", { locale: ptBR });
    formattedDate = formattedDate.replace(" ", " de ");
    const dayOfWeek = format(date, "eeee", { locale: ptBR });
    if (isToday) return "Hoje";
    else if (isTomorrow) return "Amanhã";
    else return `${dayOfWeek} - ${formattedDate}`;
  }

  async function fetchSchedules() {
    try {
      const response = await api.get("/schedules");

      const schedules = response.data.map((schedule: Schedule) => ({
        ...schedule,
        schedule_date_time: new Date(schedule.schedule_date_time),
      }));

      setSchedules(schedules);
    } catch (error) {
      console.error(error);
    }
  }

  function handleScheduleSave(isUpdate: boolean) {
    fetchSchedules();

    if (isUpdate)
      toast({
        title: "Success",
        description: "Agendamento alterado com sucesso",
        variant: "success",
      });
    else
      toast({
        title: "Success",
        description: "Agendamento incluído com sucesso",
        variant: "success",
      });
  }

  async function handleScheduleRemove(id: number) {
    try {
      const response = await api.delete(`/schedules/${id}`);

      if (response.status === 204) {
        toast({
          title: "Success",
          description: "Agendamento excluído com sucesso",
          variant: "success",
        });
        fetchSchedules();
      }
    } catch (error) {
      console.error(error);
    }
  }

  function generateWhatsappLink(whatsapp: string, name: string, date: Date) {
    const hora = format(date, "HH:mm");

    let mensagem = "";
    // Se a consulta for hoje
    if (format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"))
      mensagem = `Olá! Aqui é da clínica da Psicóloga Ana Flávia C. Venâncio. Gostaríamos de confirmar a presença do paciente ${name}, para a consulta agendada para hoje, às ${hora}.`;
    else
      mensagem = `Olá! Aqui é da clínica da Psicóloga Ana Flávia C. Venâncio. Gostaríamos de confirmar a presença do paciente ${name}, para a consulta agendada para ${format(
        date,
        "dd/MM/yyyy"
      )}, às ${hora}.`;

    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`;
  }

  const DeleteScheduleButton = (
    <ToolTip message="Excluir agendamento">
      <button type="button">
        <FaRegTrashAlt className="text-xl text-custom-danger-light dark:text-custom-danger-dark" />
      </button>
    </ToolTip>
  );

  const RescheduleButton = (
    <ToolTip message="Re-agendar consulta do paciente">
      <button type="button">
        <FaUserClock className="text-xl text-custom-warning-light" />
      </button>
    </ToolTip>
  );

  useEffect(() => {
    async function fetchPacientes() {
      try {
        const response = await api.get("/patients");
        setPacientes(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getDates();
    fetchPacientes();
    fetchSchedules();
  }, []);
  return (
    <DefaultContainer page="Agendamentos">
      <div className="col-span-1 row-span-11 lg:col-span-10 p-4 lg:p-8">
        <Card title="Agendamentos">
          <div className="flex flex-col gap-2">
            {dates.length > 0 &&
              dates.map((date) => (
                <div>
                  <Table
                    key={String(date)}
                    headers={[getFormattedDates(date)]}
                    headerClassName="font-bold"
                  >
                    {schedules.length > 0 &&
                      schedules.map(
                        (schedule) =>
                          format(schedule.schedule_date_time, "dd-MM-yyyy") ===
                            format(date, "dd-MM-yyyy") && (
                            <TableRow key={schedule.id}>
                              <TableCell className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                  <div className="flex justify-center items-center gap-2">
                                    <p>{schedule.patient_name}</p>
                                    {schedule.isPresencial ? (
                                      <ToolTip message="Atendimento presencial">
                                        <BiBuildingHouse className="text-custom-primary-light dark:text-custom-primary-dark" />
                                      </ToolTip>
                                    ) : (
                                      <ToolTip message="Atendimento online">
                                        <AiOutlineLaptop className="text-custom-warning-light dark:text-custom-warning-dark" />
                                      </ToolTip>
                                    )}
                                  </div>
                                  <p className="text-custom-primary-light dark:text-custom-primary-dark">
                                    {format(
                                      schedule.schedule_date_time,
                                      "HH:mm"
                                    )}
                                  </p>
                                </div>
                                <div className="flex gap-4 items-center">
                                  <ToolTip message="Informações do paciente">
                                    <Link
                                      to={`/patient/${schedule.patient_id}`}
                                      target="_blank"
                                    >
                                      <TbNotebook className="text-2xl text-violet-600 dark:text-violet-400 -mt-1" />
                                    </Link>
                                  </ToolTip>

                                  {/* Botão para abrir modal de sessão */}
                                  <SessionModal
                                    customTrigger={
                                      <ToolTip message="Registrar sessão do paciente">
                                        <button type="button">
                                          <FaUserCheck className="text-xl text-blue-600 dark:text-blue-400" />
                                        </button>
                                      </ToolTip>
                                    }
                                    scheduleId={schedule.id}
                                    patientId={schedule.patient_id}
                                    patientName={schedule.patient_name}
                                    onSave={() => fetchSchedules()}
                                  />

                                  <ToolTip message="Enviar mensagem de confirmação da consulta">
                                    <a
                                      href={generateWhatsappLink(
                                        schedule.patient_whatsapp,
                                        schedule.patient_name,
                                        schedule.schedule_date_time
                                      )}
                                      target="_blank"
                                      className="block -mt-1"
                                    >
                                      <FaWhatsapp className="text-xl text-green-600 dark:text-green-400" />
                                    </a>
                                  </ToolTip>

                                  <DeleteConfirmationDialog
                                    message={`Tem certeza que deseja excluir o agendamento para o paciente ${
                                      schedule.patient_name
                                    }, as ${format(
                                      schedule.schedule_date_time,
                                      "HH:mm"
                                    )}?`}
                                    handleRemoveFunction={() =>
                                      handleScheduleRemove(schedule.id)
                                    }
                                    customTrigger={DeleteScheduleButton}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                      )}
                  </Table>
                  <ScheduleModal
                    defaultDate={date}
                    pacientes={pacientes}
                    onScheduleSave={() => handleScheduleSave(false)}
                  />
                </div>
              ))}
          </div>
        </Card>
      </div>
    </DefaultContainer>
  );
}
