"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import {useAuth} from "@/providers/AuthProvider";

const CreateAdminForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState<String | null>();
  const [passwordError, setPasswordError] = useState<String | null>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<String | null>();
  const router = useRouter();
  const { token } = useAuth();

  const clearErrors = () => {
    setUsernameError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
  };

  const validate = (): boolean => {
    let result = true;
    
    if (!username || username.trim() === "") {
      setUsernameError("Username can not be empty");
      result = false;
    }
    
    if (!password || password.trim() === "") {
      setPasswordError("Password can not be empty");
      result = false;
    }
    
    if (!confirmPassword || confirmPassword.trim() === "") {
      setConfirmPasswordError("Confirm password can not be empty");
      result = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
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
        toast.error("Username already exists");
        return;
      }

      toast.success("Admin account created successfully!", {
        autoClose: 2000,
      });
      
      setTimeout(() => {
        router.push("/"); 
      }, 2000);
    } catch (error) {
      toast.error("An error occurred while creating the admin account");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Admin</h2>
      
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
        {usernameError && (
          <p className="text-red-500 text-sm mt-1">{usernameError}</p>
        )}
      </div>

      <div className="mb-4">
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
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
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
        Create Admin
      </button>
    </form>
  );
};

export default CreateAdminForm;