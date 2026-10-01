import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

// Renders
interface IFormInput {
  username: string;
  email: string;
  password: string;
}
const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);
  console.log(errors);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Register to get access!
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Username"
          {...register("username", { required: "username is required" })}
        />
        <Input
          placeholder="Email address"
          {...register("email", { required: "email is required" })}
        />
        <Input
          placeholder="Password"
          {...register("password", { required: "password is required" })}
        />

        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
