import { ApiClient } from "@/utils/apiClient";
import { UserRequest } from "@/types/auth";

const AuthService = {
  async createAdmin(admin: UserRequest): Promise<any> {
    return ApiClient.post("/admin/create", admin);
  }
};

export default AuthService;