import { DefaultContainer } from "@/components/DefaultContainer";
import { Table } from "@/components/Table";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

import { TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";

type Patient = {
  id: number;
  name: string;
  date_of_birth: Date;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  whatsapp?: string;
  phone?: string;
  description?: string;
};

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await api.get("/patients");

        const formattedResponse = response.data.map((patient: Patient) => {
          patient.date_of_birth = new Date(patient.date_of_birth);
          return patient;
        });

        console.log(formattedResponse);
        setPatients(formattedResponse);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPatients();
  }, []);
  return (
    <DefaultContainer page="Pacientes">
      <div className="col-span-1 row-span-12 lg:col-span-10 p-4 lg:p-8">
        <Card
          className="relative"
          title="Pacientes"
          description="Listagem de todos os pacientes"
        >
          <Link
            to="/patient"
            className="absolute right-5 top-5 bg-custom-secondary-light hover:bg-custom-primary-light dark:hover:bg-custom-primary-dark p-2 rounded-lg text-custom-text-primary-light dark:bg-custom-secondary-dark dark:text-custom-text-primary-dark"
          >
            Novo Paciente
          </Link>
          <Table headers={["Nome", "Data de Nascimento", "Ações"]}>
            {patients.length > 0 &&
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>
                    {patient.date_of_birth.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/patient/${patient.id}`}>
                      <FaEdit className="text-lg text-custom-warning-light dark:text-custom-warning-dark" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </Table>
        </Card>
      </div>
    </DefaultContainer>
  );
}
