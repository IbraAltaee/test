"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { useAuth } from "@/providers/AuthProvider";
import AuthService from "@/services/AuthService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const CreateAdminForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState<String | null>();
  const [passwordError, setPasswordError] = useState<String | null>();
  const [confirmPasswordError, setConfirmPasswordError] =
    useState<String | null>();
  const router = useRouter();
  const { token } = useAuth();
  const { auth } = useTranslations();

  const clearErrors = () => {
    setUsernameError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
  };

  const validate = (): boolean => {
    let result = true;

    if (!username || username.trim() === "") {
      setUsernameError(auth("usernameCannotBeEmpty"));
      result = false;
    }

    if (!password || password.trim() === "") {
      setPasswordError(auth("passwordCannotBeEmpty"));
      result = false;
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      setConfirmPasswordError(auth("confirmPasswordCannotBeEmpty"));
      result = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(auth("passwordsDoNotMatch"));
      result = false;
    }

    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!validate()) {
      return;
    }
    if (!token) return;

    const adminData: any = {
      username: username,
      password: password,
    };

    try {
      const response = await AuthService.CreateAdmin(adminData, token);

      if (!response.ok) {
        toast.error(auth("usernameAlreadyExists"));
        return;
      }

      toast.success(auth("adminCreatedSuccessfully"), {
        autoClose: 2000,
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error(auth("errorCreatingAdmin"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {auth("createAdmin")}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {auth("username")}
          <span className="text-red-500">*</span>:
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded"
        />
        {usernameError && (
          <p className="text-red-500 text-sm mt-1">{usernameError}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {auth("password")}
          <span className="text-red-500">*</span>:
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded"
        />
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {auth("confirmPassword")}
          <span className="text-red-500">*</span>:
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded"
        />
        {confirmPasswordError && (
          <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {auth("createAdmin")}
      </button>
    </form>
  );
};

export default CreateAdminForm;