import Footer from '@/components/Footer';
import Header from '@/components/Header';
import CreateAdminForm from '@/components/CreateAdminForm';
import React from 'react';
import { ToastContainer } from 'react-toastify';

const CreateAdminPage: React.FC = () => {
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