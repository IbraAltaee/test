package droneportTeam05.service;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import droneportTeam05.auth.jwt.JWTService;
import droneportTeam05.domain.Admin;
import droneportTeam05.repository.AdminRepository;
import droneportTeam05.util.ServiceException;
import droneportTeam05.auth.jwt.JWTService;

@Service
public class AdminService {

    @Autowired
    private final AdminRepository adminRepository;
    private final JWTService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9_]{3,50}$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");


    public AdminService(AdminRepository adminRepository, BCryptPasswordEncoder passwordEncoder, JWTService jwtService) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Admin findByUsername(String username) throws ServiceException {
        if (adminRepository.findByUsername(username) == null)
            throw new ServiceException("Admin", "username not found");
        return adminRepository.findByUsername(username);
    }

    public String authenticateAdmin(Admin loginAdmin) throws ServiceException {
        Admin admin = adminRepository.findByUsername(loginAdmin.getUsername());

        if (admin == null) {
            throw new ServiceException("credentials", "Invalid credentials");
        }

        if (!admin.getEnabled()) {
            throw new ServiceException("account", "Account is disabled");
        }

        if (!admin.getAccountNonLocked()) {
            throw new ServiceException("account", "Account is locked");
        }

        if (!passwordEncoder.matches(loginAdmin.getPassword(), admin.getPassword())) {
            // Increment failed login attempts
            admin.setFailedLoginAttempts(admin.getFailedLoginAttempts() + 1);
            if (admin.getFailedLoginAttempts() >= 5) {
                admin.setAccountNonLocked(false);
            }
            adminRepository.save(admin);
            throw new ServiceException("credentials", "Invalid credentials");
        }

        // Reset failed login attempts on successful login
        admin.setFailedLoginAttempts(0);
        adminRepository.save(admin);

        // FIXED: Pass the entire Admin object
        return jwtService.createToken(admin);
    }

    public Admin getAdminByUsername(String username) throws ServiceException {
        Admin admin = adminRepository.findByUsername(username);
        if (admin == null) {
            throw new ServiceException("Admin", "username not found");
        }
        return admin;
    }

    public Admin validateToken(String token) throws ServiceException {
        JWTService.TokenValidationResult result = jwtService.verifyToken(token);

        if (!result.isValid()) {
            throw new ServiceException("token", "Invalid token");
        }

        Admin admin = result.getAdmin();

        if (!admin.getEnabled()) {
            throw new ServiceException("account", "Account is disabled");
        }

        if (!admin.getAccountNonLocked()) {
            throw new ServiceException("account", "Account is locked");
        }

        return admin;
    }

        public Admin createAdmin(String username, String password, String createdBy) throws ServiceException {
        // Validate input
        validateUsername(username);
        validatePassword(password);
        
        if (adminRepository.existsByUsername(username)) {
            throw new ServiceException("username", "Username already exists");
        }

        Admin admin = new Admin(username, passwordEncoder.encode(password));
        
        Admin savedAdmin = adminRepository.save(admin);
        
        return savedAdmin;
    }
    
    private void validateUsername(String username) throws ServiceException {
        if (username == null || username.trim().isEmpty()) {
            throw new ServiceException("username", "Username cannot be empty");
        }
        
        if (!USERNAME_PATTERN.matcher(username).matches()) {
            throw new ServiceException("username", 
                "Username must be 3-50 characters long and contain only letters, numbers, and underscores");
        }
    }
    
    private void validatePassword(String password) throws ServiceException {
        if (password == null || password.isEmpty()) {
            throw new ServiceException("password", "Password cannot be empty");
        }
        
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            throw new ServiceException("password", 
                "Password must be at least 8 characters long and contain at least one uppercase letter, " +
                "one lowercase letter, one digit, and one special character");
        }
    }
    
    public void unlockAccount(String username) throws ServiceException {
        Admin admin = findByUsername(username);
        admin.setAccountNonLocked(true);
        admin.setFailedLoginAttempts(0);
        adminRepository.save(admin);
    }

}
