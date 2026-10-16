import { yupResolver } from "@hookform/resolvers/yup";
import InputErrorMessage from "../components/InputErrorMessage";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { LOGIN_FORM } from "../Data";
import { loginSchema } from "../Validation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axiosInstance from "../Config/axios.config";
import toast from "react-hot-toast";
import { IErrorResponse } from "../Interfaces";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import { LockIcon, MailIcon } from "../components/ui/Icons";

const fieldIcons = { identifier: <MailIcon />, password: <LockIcon /> };

interface IFormInput {
  identifier: string;
  password: string;
}
const LoginPage = () => {
  // localStorage.clear();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const { status, data: resData } = await axiosInstance.post(
        "/auth/local",
        data,
      );
      if (status == 200) {
        toast.success("You will be navigated to Home page in 2 seconds!", {
          position: "top-center",
          duration: 2000,
        });
      }
      localStorage.setItem("loggedInUser", JSON.stringify(resData));
      setTimeout(() => {
        location.replace("/");
      }, 2000);
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      const errorMessage = errorObj.response?.data?.error?.message;
      toast.error(`${errorMessage}`, {
        position: "top-center",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginComponent = LOGIN_FORM.map((prop, idx) => (
    <div key={idx}>
      <label htmlFor={prop.name} className="mb-1.5 block text-sm font-medium text-slate-300">
        {prop.placeholder}
      </label>
      <Input
        id={prop.name}
        placeholder={prop.type === "password" ? "••••••••" : "you@example.com"}
        icon={fieldIcons[prop.name]}
        hasError={Boolean(errors?.[prop.name])}
        {...register(prop.name, prop.validation)}
        type={prop.type}
      />
      {errors?.[prop.name] && (
        <InputErrorMessage msg={`${errors[prop.name]?.message}`} />
      )}
    </div>
  ));
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to pick up right where you left off."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-aqua hover:text-white">
            Create one
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginComponent}
        <Button fullWidth isLoading={isLoading} className="mt-2">
          Log in
        </Button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
