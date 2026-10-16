import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/InputErrorMessage";
import { REGISTER_FORM } from "../Data";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../Validation/index.ts";
import axiosInstance from "../Config/axios.config.ts";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../Interfaces/index.ts";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import { LockIcon, MailIcon, UserIcon } from "../components/ui/Icons";

const fieldIcons = { username: <UserIcon />, email: <MailIcon />, password: <LockIcon /> };
const fieldHints = { username: "e.g. osama_dev", email: "you@example.com", password: "At least 6 characters" };
// Renders
interface IFormInput {
  username: string;
  email: string;
  password: string;
}
const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema),
  });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const { status } = await axiosInstance.post("/auth/local/register", data);

      if (status == 200) {
        toast.success("You will be navigated to login page in 2 seconds!", {
          position: "top-center",
          duration: 2000,
        });
      }
      setTimeout(() => {
        navigate("/login");
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
  const renderRegisterComponent = REGISTER_FORM.map((prop, idx) => (
    <div key={idx}>
      <label htmlFor={prop.name} className="mb-1.5 block text-sm font-medium text-slate-300">
        {prop.placeholder}
      </label>
      <Input
        id={prop.name}
        placeholder={fieldHints[prop.name]}
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
      title="Create your account"
      subtitle="Start organizing your tasks in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-aqua hover:text-white">
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterComponent}
        <Button fullWidth isLoading={isLoading} className="mt-2">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
