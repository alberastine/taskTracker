import { Button, TextInput } from "flowbite-react";

// css import
import "../../styles/scenes/login.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

interface ISignupForm {
  username: string;
  password: string;
}

const SignUpPage = () => {
  const { register, handleSubmit } = useForm<ISignupForm>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (data: ISignupForm) => {
    try {
      const response = await axios.post("/api/signup", data);
      if (response.status === 201) {
        setSuccess("User created successfully");
        setError("");
      }
    } catch (err) {
      setError("Error creating user");
      setSuccess("");
    }
  };

  return (
    <div>
      <form
        className="w-full max-w-sm rounded-lg bg-white "
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="mb-4 text-xl font-semibold">Create an account</h2>
        <div className="mb-4">
          <TextInput
            {...register("username")}
            type="text"
            placeholder="Enter username"
            required={true}
          />
        </div>
        <div className="mb-4">
          <TextInput
            {...register("password")}
            type="password"
            placeholder="Enter password"
            required={true}
          />
        </div>
        <div className="mb-4">
          <TextInput
            {...register("password")}
            type="password"
            placeholder="Enter confirm password"
            required={true}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <Button type="submit" gradientDuoTone="purpleToBlue" className="w-full">
          Creat account
        </Button>
      </form>
    </div>
  );
};

export default SignUpPage;
