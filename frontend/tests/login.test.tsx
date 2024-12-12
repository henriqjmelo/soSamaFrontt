import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../Login";
import { useAuth } from "@/hooks/use-auth";

jest.mock("@/hooks/use-auth");

describe("Login Component", () => {
  it("should validate email and password inputs", () => {
    render(<Login />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: /Login/i });

    // Empty form submission
    fireEvent.click(loginButton);

    expect(screen.getByText("O email deve ser preenchido corretamente!")).toBeInTheDocument();
    expect(screen.getByText("A senha deve conter pelo menos 3 caracteres!")).toBeInTheDocument();

    // Fill valid inputs
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.click(loginButton);

    expect(screen.queryByText("O email deve ser preenchido corretamente!")).toBeNull();
    expect(screen.queryByText("A senha deve conter pelo menos 3 caracteres!")).toBeNull();
  });

  it("should call signIn with valid credentials", () => {
    const signInMock = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({ signIn: signInMock });

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "12345" } });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(signInMock).toHaveBeenCalledWith({ email: "test@example.com", password: "12345" });
  });
});
