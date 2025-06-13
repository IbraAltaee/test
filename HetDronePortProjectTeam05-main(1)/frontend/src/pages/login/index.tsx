import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

const LoginPage: React.FC = () => {
  return (
    <>
        <Head>
            <title>UAV Zone Guidance Tool</title>
        </Head>
      <ToastContainer />
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-gray-100">
        <LoginForm />
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default LoginPage;
