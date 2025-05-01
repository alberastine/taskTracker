import { Button, Label, TextInput, Checkbox, Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../../api/axios";

// css import
import "../../styles/scenes/login.css";
import { useState } from "react";
// import axios from "axios";

import SignUpPage from "../signupPage";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  const navigate = useNavigate();

  const [data, setData] = useState<{ gmail: string; password: string }>({
    gmail: "",
    password: "",
  });


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { gmail, password } = data;

    try {
      const response = await axios.post("/login", { gmail, password });

      if (response.data.error) {
        toast.error(response.data.error);
        console.log(response.data.error);
      } else {
        setData({ gmail: "", password: "" });
        toast.success("User login successfully");
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
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
        onSubmit={onSubmit}
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
                type="email"
                placeholder="Email"
                required={true}
                value={data.gmail}
                onChange={(e) => setData({ ...data, gmail: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <TextInput
                id="password"
                type="password"
                placeholder="Password"
                required={true}
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
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
            Don't have an account?
            <a onClick={handleSignUp} className="cursor-pointer text-blue-500">
              Create an account
            </a>
          </Label>
        ) : (
          <Label>
            Already have an account?
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
