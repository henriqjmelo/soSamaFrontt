import { Button } from "../components/Button";
import { Input } from "../components/Input";
import psicologa from "../assets/psicologa.png";
import psicologaDark from "../assets/psicologa-dark.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { CustomError } from "@/types/errorTypes";
import { useTheme } from "@/hooks/use-theme";

type errorProps = {
  name?: string;
  email?: string;
  password?: string;
};
function SignUp() {
  const { toast } = useToast();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<errorProps>({});
  const [isLoading, setIsLoading] = useState(false);

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    // Remove name from errors
    setErrors((prev) => ({ ...prev, name: "" }));
  }

  function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    // Remove Email from errors
    setErrors((prev) => ({ ...prev, email: "" }));
  }

  function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    // Remove Password from errors
    setErrors((prev) => ({ ...prev, password: "" }));
  }

  function validate() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let result = true;

    if (name.length < 3) {
      result = false;
      setErrors((prev) => ({
        ...prev,
        name: "O nome deve conter pelo menos 3 caracteres!",
      }));
    }

    if (!emailRegex.test(email)) {
      result = false;
      setErrors((prev) => ({
        ...prev,
        email: "O email deve ser preenchido corretamente!",
      }));
    }

    if (password.length < 3) {
      result = false;
      setErrors((prev) => ({
        ...prev,
        password: "A senha deve conter pelo menos 3 caracteres!",
      }));
    }
    return result;
  }

  async function handleCreateClick() {
    if (validate()) {
      setIsLoading(true);
      try {
        await api.post("users", { name, email, password });
        toast({
          title: "Success",
          description: "User created with success",
          variant: "success",
        });
        // Redirect to login page
        navigate("/");
      } catch (error) {
        console.log(error);
        const typedError = error as CustomError;
        const errorMessage = typedError.response?.data?.message;

        toast({
          title: "Error",
          description: errorMessage,
          variant: "error",
        });
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12">
      <div className="hidden lg:col-span-8 lg:flex justify-center">
        <img
          src={theme === "light" ? psicologa : psicologaDark}
          alt="Psicologa"
        />
      </div>
      <div
        id="loginForm"
        className="col-span-1 lg:col-span-4 lg:flex lg:justify-center lg:shadow-left lg:z-10 p-4 mt-10 lg:mt-0 bg-custom-background-primary-light dark:bg-custom-background-primary-dark"
      >
        <form className="flex flex-col w-full gap-5 px-4 py-10 justify-center items-center">
          <h2 className="font-bold text-3xl text-custom-primary-light dark:text-custom-primary-dark">
            Create your account
          </h2>
          <Input
            name="name"
            label="Name"
            type="text"
            value={name}
            onChange={onNameChange}
            error={errors.name && errors.name}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={onEmailChange}
            error={errors.email && errors.email}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            error={errors.password && errors.password}
          />
          <Button
            type="button"
            title="Create"
            variant="primary"
            onClick={handleCreateClick}
            isLoading={isLoading}
          />

          <Link
            to="/"
            className="w-full p-4 cursor-pointer text-center text-custom-text-primary-light font-medium text-lg bg-custom-secondary-light dark:bg-custom-secondary-dark hover:bg-custom-secondary-light/90 dark:hover:bg-custom-secondary-dark/90 rounded-xl"
          >
            Back
          </Link>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
