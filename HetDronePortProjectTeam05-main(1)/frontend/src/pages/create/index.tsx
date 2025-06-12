"use client";

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import CreateAdminForm from '@/components/CreateAdminForm';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/router';
import { useTranslations } from '@/hooks/useTranslations';
import Head from 'next/head';

const SecureCreateAdminPage: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();
    const { auth } = useTranslations();

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

    if (!isAuthenticated) {
        router.push('/login');
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <ToastContainer />
                <div className="text-center">
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <Head>
            <title>UAV Zone Guidance Tool</title>
        </Head>
            <ToastContainer />
            <Header />
            <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-gray-100">
                <CreateAdminForm />
            </div>
            <Footer />
        </>
    );
};

export default SecureCreateAdminPage;