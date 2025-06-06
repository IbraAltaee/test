import Footer from '@/components/Footer';
import Header from '@/components/Header';
import CreateAdminForm from '@/components/CreateAdminForm';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/router';
import { useTranslations } from '@/hooks/useTranslations';

const CreateAdminPage: React.FC = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { token, username } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const { auth } = useTranslations();

    useEffect(() => {
        const checkAuth = () => {
            if (!token || !username) {
                setIsAuthenticated(false);
                toast.error(auth("pleaseLoginToAccess"));

                setTimeout(() => {
                    router.push('/login');
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
            <ToastContainer />
            <Header />
            <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-gray-100">
                <CreateAdminForm />
            </div>
            <footer>
                <Footer />
            </footer>
        </>
    );
};

export default CreateAdminPage;