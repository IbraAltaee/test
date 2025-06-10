package droneportTeam05.auth.DTO;

import droneportTeam05.domain.Admin;

public class LoginRequest {
    private String username;
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public static Admin toAdmin(LoginRequest dto) {
        Admin admin = new Admin();

        admin.setUsername(dto.getUsername());
        admin.setPassword(dto.getPassword());

        return admin;
    }
}