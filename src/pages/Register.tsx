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
import { useNavigate } from "react-router-dom";
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
          style: {
            background: "black",
            color: "#fff",
            width: "fit-center",
          },
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
      <Input
        placeholder={prop.placeholder}
        {...register(prop.name, prop.validation)}
        type={prop.type}
      />
      {errors?.[prop.name] && (
        <InputErrorMessage msg={`${errors[prop.name]?.message}`} />
      )}
    </div>
  ));
  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Register to get access!
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterComponent}
        <Button fullWidth isLoading={isLoading}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
