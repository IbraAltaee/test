"use client";

import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import AdminDashboard from "@/components/AdminDashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Head from "next/head";

const SecureDashboardPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Show loading while validating with server
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Validating access...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (server validation failed)
  if (!isAuthenticated) {
    router.push("/login");
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Only render dashboard if server confirmed authentication
  return (
    <>
      <Head>
        <title>UAV Zone Guidance Tool</title>
      </Head>
      <ToastContainer position="top-right" autoClose={5000} />
      <Header />
      <AdminDashboard />
      <Footer />
    </>
  );
};

export default SecureDashboardPage;