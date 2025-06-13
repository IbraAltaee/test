"use client";

import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useTranslations } from "@/hooks/useTranslations";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, username } = useAuth();
  const { auth } = useTranslations();

  useEffect(() => {
    const checkAuth = () => {
      if (!token || !username) {
        setIsAuthenticated(false);
        toast.error(auth("pleaseLoginToAccess"));
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, token, username, auth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{auth("loadingDashboard")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ToastContainer />
        <div className="text-center">
          <p className="text-gray-600">{auth("redirectingToLogin")}</p>
        </div>
      </div>
    );
  }

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

export default DashboardPage;