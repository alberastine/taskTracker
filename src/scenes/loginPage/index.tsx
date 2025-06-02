import { Button, Label, TextInput, Checkbox, Alert } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "@/context/userContext";
import { useState, useContext } from "react";

import toast from "react-hot-toast";
import axios from "@/api/axios";

import "@/styles/scenes/login.css";

const LoginPage = () => {
  const { fetchUser } = useContext(UserContext);

  const [error, setError] = useState("");

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
        setError("Incorrect email or password");
        toast.error(response.data.error);
      } else {
        await fetchUser();
        setData({ gmail: "", password: "" });
        setError("");
        toast("User login successfully");
        sessionStorage.removeItem("homeActiveWidget");
        navigate("/home", { state: { resetHomeWidget: true } });
      }
    } catch (error) {
      setError("Email or password is incorrect");
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        onSubmit={onSubmit}
      >
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
        <Button type="submit" gradientDuoTone="purpleToBlue" className="w-full">
          Sign in
        </Button>

        <Label className="mt-4 block text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Create an account
          </Link>
        </Label>
      </form>
    </div>
  );
};

export default LoginPage;
