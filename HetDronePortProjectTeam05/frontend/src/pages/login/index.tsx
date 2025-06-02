import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoginForm from '@/components/LoginForm';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage: React.FC = () => {
    return (
        <>
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
