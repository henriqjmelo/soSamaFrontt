import { Card } from "@/components/Card";
import { DefaultContainer } from "@/components/DefaultContainer";
import { Input } from "@/components/Input";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { CustomError } from "@/types/errorTypes";
import { useEffect, useState } from "react";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";

interface IFormInputs {
  name: string;
  description?: string;
  dateOfBirth: string;
  phone?: string;
  whatsapp?: string;
}

interface PatientProps {
  id: number;
  name: string;
  date_of_birth: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
}

interface SessionRecord {
  id: number;
  attended: boolean;
  paymentmade: boolean;
  paymentamount: string | null;
  notes: string | null;
  created_at: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório").min(3, "Nome é obrigatório"),
  description: yup.string(),
  dateOfBirth: yup
    .string()
    .required("Data de Nascimento é obrigatória")
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/,
      "Data de Nascimento deve estar no formato DD/MM/YYYY"
    ),
  phone: yup.string(),
  whatsapp: yup.string(),
});

export default function Patient() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientProps | null>(null);
  const [sessions, setSessions] = useState<SessionRecord[]>([]); // Adicionado para armazenar as sessões
  const [isViewing, setIsViewing] = useState(!!id);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      dateOfBirth: "",
      phone: "",
      whatsapp: "",
    },
  });

  const onSubmit = async (data: IFormInputs) => {
    const [day, month, year] = data.dateOfBirth.split("/");
    const phone = data.phone?.replace(/\D/g, "");
    const whatsapp = data.whatsapp?.replace(/\D/g, "");

    const date_of_birth = `${year}-${month}-${day}`;
    try {
      if (id) {
        await api.put(`/patients/${id}`, {
          ...data,
          phone,
          whatsapp,
          date_of_birth,
        });
        toast({
          title: "Success",
          description: "Paciente atualizado com sucesso",
          variant: "success",
        });
      } else {
        await api.post(`/patients`, {
          ...data,
          phone,
          whatsapp,
          date_of_birth,
        });
        toast({
          title: "Success",
          description: "Paciente criado com sucesso",
          variant: "success",
        });
      }
      navigate("/patients");
    } catch (error) {
      console.error(error);
      const typedError = error as CustomError;
      const errorMessage = typedError.response?.data?.message;
      toast({
        title: "Error",
        description: errorMessage || "Erro ao salvar paciente",
        variant: "error",
      });
    }
  };

  async function handleRemove() {
    try {
      await api.delete(`/patients/${id}`);
      toast({
        title: "Success",
        description: "Paciente excluído com sucesso",
        variant: "success",
      });
      navigate("/patients");
    } catch (error) {
      console.error(error);
      const typedError = error as CustomError;
      const errorMessage = typedError.response?.data?.message;
      toast({
        title: "Error",
        description: errorMessage || "Erro ao excluir paciente",
        variant: "error",
      });
    }
  }

  const formatPhone = (phone: string) => {
    return phone && phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");
  };

  const formatDate = (date: string) => {
    return date.split("T")[0].split("-").reverse().join("/");
  };

  useEffect(() => {
    if (!id) {
      setIsViewing(false); // Se não houver ID, está criando um novo paciente
      return;
    }

    async function fetchPatientAndSessions() {
      try {
        // Fetch do paciente
        const patientResponse = await api.get<PatientProps>(`/patients/${id}`);
        setPatient(patientResponse.data);

        setValue("name", patientResponse.data.name);
        setValue("description", patientResponse.data.description || "");
        setValue("dateOfBirth", formatDate(patientResponse.data.date_of_birth));
        setValue("phone", formatPhone(patientResponse.data.phone || ""));
        setValue("whatsapp", formatPhone(patientResponse.data.whatsapp || ""));

        // Fetch das sessões do paciente
        const sessionsResponse = await api.get(`/patients/${id}/sessions`);
        setSessions(sessionsResponse.data || []); // Atualiza o estado de sessões
      } catch (error) {
        console.error(error);
        toast({
          title: "Erro",
          description: "Erro ao carregar as informações do paciente",
          variant: "error",
        });
        navigate("/patients");
      }
    }

    fetchPatientAndSessions();
  }, [id, setValue, toast, navigate]);

  return (
    <DefaultContainer page="Paciente">
      <div className="col-span-1 row-span-12 lg:col-span-10 p-4 lg:p-8">
        <Card
          title={id ? (isViewing ? "Visualização de paciente" : "Atualização de paciente") : "Novo Paciente"}
          description={
            id
              ? isViewing
                ? "Visualize os dados do paciente"
                : "Altere os campos necessários"
              : "Preencha os campos para inserir um novo paciente"
          }
        >
          {isViewing && patient ? (
            <div className="flex flex-col gap-4">
              <p><strong>Nome:</strong> {patient?.name || "Não informado"}</p>
              <p><strong>Descrição:</strong> {patient?.description || "Não informado"}</p>
              <p><strong>Data de Nascimento:</strong> {patient?.date_of_birth ? formatDate(patient.date_of_birth) : "Não informado"}</p>
              <p><strong>Whatsapp:</strong> {patient?.whatsapp ? formatPhone(patient.whatsapp) : "Não informado"}</p>
              <p><strong>Telefone:</strong> {patient?.phone ? formatPhone(patient.phone) : "Não informado"}</p>

              {/* Sessões */}
              <div className="mt-4">
                <h3 className="font-bold text-lg">Sessões:</h3>
                {sessions.length > 0 ? (
                  <ul className="list-disc ml-5">
                    {sessions.map((session) => (
                      <li key={session.id}>
                        <p><strong>Data:</strong> {new Date(session.created_at).toLocaleDateString()}</p>
                        <p><strong>Compareceu:</strong> {session.attended ? "Sim" : "Não"}</p>
                        <p><strong>Pagamento:</strong> {session.paymentmade ? "Sim" : "Não"}</p>
                        <p><strong>Valor:</strong> {session.paymentamount ? `R$ ${session.paymentamount}` : "Não informado"}</p>
                        <p><strong>Notas:</strong> {session.notes || "Sem notas"}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhuma sessão registrada.</p>
                )}
              </div>

              <Button title="Editar" variant="primary" onClick={() => setIsViewing(false)} />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
              <Input
                label="Nome"
                {...register("name")}
                error={errors.name ? errors.name.message : ""}
              />
              <Input label="Descrição" {...register("description")} />
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <Input
                    name="dateOfBirth"
                    label="Data de Nascimento"
                    mask="99/99/9999"
                    placeholder="29/06/1995"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.dateOfBirth ? errors.dateOfBirth.message : ""}
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    name="phone"
                    label="Telefone"
                    mask="+99 (99) 99999-9999"
                    placeholder="+55 17 99111-2233"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.phone ? errors.phone.message : ""}
                  />
                )}
              />
              <Controller
                name="whatsapp"
                control={control}
                render={({ field }) => (
                  <Input
                    name="whatsapp"
                    label="Whatsapp"
                    mask="+99 (99) 99999-9999"
                    placeholder="+55 17 99111-2233"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.whatsapp ? errors.whatsapp.message : ""}
                  />
                )}
              />
              <div className="w-full flex gap-4 items-center justify-center mt-5">
                <Button title={id ? "Salvar" : "Criar"} variant="primary" onClick={handleSubmit(onSubmit)} />
                {id && (
                  <>
                    <Button title="Cancelar" variant="secondary" onClick={() => setIsViewing(true)} />
                    <DeleteConfirmationDialog
                      message={`Tem certeza que deseja remover o paciente ${patient?.name || ""}?`}
                      handleRemoveFunction={handleRemove}
                    />
                  </>
                )}
              </div>
            </form>
          )}
        </Card>
      </div>
    </DefaultContainer>
  );
}
