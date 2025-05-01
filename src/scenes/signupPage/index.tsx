import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";

import axios from "../../api/axios";
import toast from "react-hot-toast";

import "../../styles/scenes/login.css";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [data, setData] = useState<{
    username: string;
    gmail: string;
    password: string;
    confirmPassword: string;
  }>({
    username: "",
    gmail: "",
    password: "",
    confirmPassword: "",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, gmail, password } = data;

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axios.post("/signup", {
        username,
        gmail,
        password,
      });
      toast(response.data.message || "User created successfully");
      setSuccess(response.data.message || "User created successfully");
      setError("");

      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const backendMessage = error.response?.data?.message;

      if (backendMessage === "Email already exists") {
        setError("This email is already registered.");
      } else {
        setError("Error creating user");
      }
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        onSubmit={onSubmit}
      >
        <h2 className="mb-4 text-xl font-semibold">Create an account</h2>
        {error && (
          <Alert color="failure" onDismiss={() => setError("")}>
            {error}
          </Alert>
        )}
        <div className="mb-4">
          <TextInput
            type="text"
            name="username"
            placeholder="Username"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            required={true}
          />
        </div>
        <div className="mb-4">
          <TextInput
            type="email"
            name="gmail"
            placeholder="Email"
            value={data.gmail}
            onChange={(e) => setData({ ...data, gmail: e.target.value })}
            required={true}
          />
        </div>
        <div className="mb-4">
          <TextInput
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required={true}
          />
        </div>
        <div className="mb-4">
          <TextInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={data.confirmPassword}
            onChange={(e) =>
              setData({ ...data, confirmPassword: e.target.value })
            }
            required={true}
          />
        </div>
        {success && <p className="text-green-500">{success}</p>}
        <Button type="submit" gradientDuoTone="purpleToBlue" className="w-full">
          Create account
        </Button>
        <Label className="mt-4 block text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </Label>
      </form>
    </div>
  );
};

export default SignUpPage;
