import { Button } from "../components/Button";
import { Input } from "../components/Input";
import psicologa from "../assets/psicologa.png";
import psicologaDark from "../assets/psicologa-dark.png";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

type errorProps = {
  email?: string;
  password?: string;
};

function Login() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<errorProps>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  async function login() {
    if (validate()) {
      setIsLoading(true);
      await signIn({ email, password });
      setIsLoading(false);
    }
  }

  function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    // Remove email from errors
    setErrors((prev) => ({ ...prev, email: "" }));
  }
  function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: "" }));
  }

  function validate() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let result = true;

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

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12">
      <div className="absolute top-5 left-5 z-40">
        <ThemeSwitcher />
      </div>
      <div
        id="loginForm"
        className="col-span-1 lg:col-span-4 lg:flex lg:justify-center lg:shadow-right lg:z-10 p-4 pt-10 lg:pt-0 bg-custom-background-primary-light dark:bg-custom-background-primary-dark"
      >
        <form className="flex flex-col w-full gap-5 px-4 py-10 justify-center items-center">
          <h2 className="font-bold text-3xl text-custom-primary-light dark:text-custom-primary-dark">
            Login
          </h2>
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
            title="Login"
            variant="primary"
            onClick={login}
            isLoading={isLoading}
          />

          <Link
            to="/signup"
            className="w-full p-4 cursor-pointer text-center text-custom-text-primary-light font-medium text-lg bg-custom-secondary-light dark:bg-custom-secondary-dark hover:bg-custom-secondary-light/90 dark:hover:bg-custom-secondary-dark/90 rounded-xl"
          >
            Sign Up
          </Link>
        </form>
      </div>
      <div className="hidden lg:col-span-8 lg:flex justify-center">
        <img
          src={theme === "light" ? psicologa : psicologaDark}
          alt="Imagem de fundo"
        />
      </div>
    </div>
  );
}

export default Login;
