package droneportTeam05.auth;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import droneportTeam05.auth.DTO.LoginRequest;
import droneportTeam05.domain.Admin;
import droneportTeam05.service.AdminService;
import droneportTeam05.util.ServiceException;

@WebMvcTest(AuthenticationController.class)
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminService adminService;

    @Autowired
    private ObjectMapper objectMapper;

    private LoginRequest loginRequest;
    private Admin admin;

    @BeforeEach
    void setUp() {
        loginRequest = new LoginRequest("testuser", "testpassword");
        admin = new Admin("testuser", "hashedpassword");
        admin.setId(1L);
    }

    @Test
    void login_WithValidCredentials_ReturnsTokenAndUsername() throws Exception {
        String token = "jwt-token";
        when(adminService.findByUsername("testuser")).thenReturn(admin);
        when(adminService.authenticateAdmin(any(Admin.class))).thenReturn(token);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.token").value(token));
    }

    @Test
    void login_WithInvalidCredentials_ReturnsForbidden() throws Exception {
        when(adminService.findByUsername("testuser")).thenReturn(admin);
        when(adminService.authenticateAdmin(any(Admin.class)))
                .thenThrow(new ServiceException("message", "Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void login_WithNonExistentUser_ReturnsForbidden() throws Exception {
        when(adminService.findByUsername("testuser"))
                .thenThrow(new ServiceException("Admin", "username not found"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.Admin").value("username not found"));
    }
}