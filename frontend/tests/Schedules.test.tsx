import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Schedules from "src/pages/Schedules"; // Componente de agendamentos
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import React from "react";



const mock = new MockAdapter(axios);

describe("Schedules Component", () => {
  it("should load and display schedules", async () => {
    mock.onGet("/schedules").reply(200, [
      {
        id: 1,
        isPresencial: true,
        patient_name: "John Doe",
        schedule_date_time: "2024-12-01T10:00:00Z",
      },
    ]);

    render(<Schedules />);

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("10:00")).toBeInTheDocument();
  });

  it("should handle schedule deletion", async () => {
    mock.onDelete("/schedules/1").reply(204);

    render(<Schedules />);

    const deleteButton = await screen.findByRole("button", { name: /Excluir/i });
    fireEvent.click(deleteButton);

    expect(await screen.findByText("Agendamento excluído com sucesso")).toBeInTheDocument();
  });
});
