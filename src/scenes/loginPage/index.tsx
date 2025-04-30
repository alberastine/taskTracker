import { Button, Label, TextInput, Checkbox, Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";

// css import
import "../../styles/scenes/login.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import SignUpPage from "../signupPage";

interface ILoginForm {
  username: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit } = useForm<ILoginForm>();
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(true);


  const navigate = useNavigate();

  const onSubmit = async (data: ILoginForm) => {
    try {
      const response = await axios.post("/api/login", data);
      if (response.status === 202) {
        navigate("/home");
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  

  const handleSignUp = () => {
    setShowLogin(false);
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        {!showLogin ? (
          <SignUpPage />
        ) : (
          <>
            <h2 className="mb-4 text-xl font-semibold">Login</h2>

            {error && (
              <Alert color="failure" onDismiss={() => setError("")}>
                {error}
              </Alert>
            )}
            <div className="mb-4">
              <TextInput
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register("username")}
                required={true}
              />
            </div>
            <div className="mb-4">
              <TextInput
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                required={true}
              />
            </div>
            <div className="mb-4 flex items-center">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="ml-2">
                Remember me
              </Label>
            </div>
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              className="w-full"
            >
              Sign in
            </Button>
          </>
        )}

        {showLogin === true ? (
          <Label>
            Don't have an account? {""}
            <a onClick={handleSignUp} className="cursor-pointer text-blue-500">
              Create an account
            </a>
          </Label>
        ) : (
          <Label>
            Already have an account? {""}
            <a onClick={handleLogin} className="cursor-pointer text-blue-500">
              Login to an account
            </a>
          </Label>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
