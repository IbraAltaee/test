import { UserRequest } from "@/types/auth";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

const CreateAdmin = (admin: UserRequest, token:String) => {
    return fetch(`${API_BASE_URL}/admin/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(admin),
    });
}

const AuthService = {
    CreateAdmin,
};

export default AuthService;