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
      console.log("resData, status", resData, status);
      if (status == 200) {
        toast.success("You will be navigated to Home page in 2 seconds!", {
          position: "top-center",
          duration: 2000,
          style: {
            background: "black",
            color: "#fff",
            width: "fit-center",
          },
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
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginComponent}
        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
