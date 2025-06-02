package droneportTeam05.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import droneportTeam05.auth.jwt.JWTService;
import droneportTeam05.domain.Admin;
import droneportTeam05.repository.AdminRepository;
import droneportTeam05.util.ServiceException;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private JWTService jwtService;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminService adminService;

    private Admin admin;

    @BeforeEach
    void setUp() {
        admin = new Admin("testuser", "hashedpassword");
        admin.setId(1L);
    }

    @Test
    void findByUsername_WhenUserExists_ReturnsAdmin() throws ServiceException {
        when(adminRepository.findByUsername("testuser")).thenReturn(admin);
        
        Admin result = adminService.findByUsername("testuser");

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
    }

    @Test
    void findByUsername_WhenUserDoesNotExist_ThrowsServiceException() {
        when(adminRepository.findByUsername("nonexistent")).thenReturn(null);

        ServiceException exception = assertThrows(ServiceException.class, 
            () -> adminService.findByUsername("nonexistent"));
        
        assertEquals("Admin", exception.getField());
        assertEquals("username not found", exception.getMessage());
    }

    @Test
    void authenticateAdmin_WhenValidCredentials_ReturnsToken() throws ServiceException {
        Admin loginAdmin = new Admin("testuser", "plainpassword");
        String expectedToken = "jwt-token";
        
        when(adminRepository.findByUsername("testuser")).thenReturn(admin);
        when(passwordEncoder.matches("plainpassword", "hashedpassword")).thenReturn(true);
        when(jwtService.createToken("testuser", 1L)).thenReturn(expectedToken);

        String token = adminService.authenticateAdmin(loginAdmin);

        assertEquals(expectedToken, token);
        verify(passwordEncoder).matches("plainpassword", "hashedpassword");
        verify(jwtService).createToken("testuser", 1L);
    }

    @Test
    void authenticateAdmin_WhenUserNotFound_ThrowsServiceException() {
        Admin loginAdmin = new Admin("testuser", "plainpassword");
        when(adminRepository.findByUsername("testuser")).thenReturn(null);

        ServiceException exception = assertThrows(ServiceException.class, 
            () -> adminService.authenticateAdmin(loginAdmin));
        
        assertEquals("message", exception.getField());
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void authenticateAdmin_WhenInvalidPassword_ThrowsServiceException() {
        Admin loginAdmin = new Admin("testuser", "wrongpassword");
        
        when(adminRepository.findByUsername("testuser")).thenReturn(admin);
        when(passwordEncoder.matches("wrongpassword", "hashedpassword")).thenReturn(false);

        ServiceException exception = assertThrows(ServiceException.class, 
            () -> adminService.authenticateAdmin(loginAdmin));
        
        assertEquals("message", exception.getField());
        assertEquals("Invalid credentials", exception.getMessage());
    }
}
