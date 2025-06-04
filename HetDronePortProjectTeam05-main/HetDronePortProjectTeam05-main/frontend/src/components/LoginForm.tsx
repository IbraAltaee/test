"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "react-toastify";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const router = useRouter();

  const validate = (): boolean => {
    let result = true;
    if (!username && username.trim() === "") {
      setError("Username can not be empty");
      result = false;
    }
    if (!password && password.trim() === "") {
      setError("Password can not be empty");
      result = false;
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      return;
    }
    try {
      await login(username, password);
      toast.success("Login successful!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError("Login failed. Check username and password.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
          <span className="text-red-500">*</span>:
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
          <span className="text-red-500">*</span>:
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded"
        />
      </div>
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
