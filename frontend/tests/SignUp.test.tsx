import react from {react};
import { render, screen, fireEvent } from "@testing-library/react";
import SignUp from "../SignUp";

describe("SignUp Component", () => {
  it("should validate form inputs", () => {
    render(<SignUp />);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const createButton = screen.getByRole("button", { name: /Create/i });

    fireEvent.click(createButton);

    expect(screen.getByText("O nome deve conter pelo menos 3 caracteres!")).toBeInTheDocument();
    expect(screen.getByText("O email deve ser preenchido corretamente!")).toBeInTheDocument();
    expect(screen.getByText("A senha deve conter pelo menos 3 caracteres!")).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "John" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.click(createButton);

    expect(screen.queryByText("O nome deve conter pelo menos 3 caracteres!")).toBeNull();
    expect(screen.queryByText("O email deve ser preenchido corretamente!")).toBeNull();
    expect(screen.queryByText("A senha deve conter pelo menos 3 caracteres!")).toBeNull();
  });
});
