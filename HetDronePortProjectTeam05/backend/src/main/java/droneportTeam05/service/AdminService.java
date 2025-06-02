package droneportTeam05.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import droneportTeam05.auth.jwt.JWTService;
import droneportTeam05.domain.Admin;
import droneportTeam05.repository.AdminRepository;
import droneportTeam05.util.ServiceException;

@Service
public class AdminService {

    @Autowired
    private final AdminRepository adminRepository;
    private final JWTService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;
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

    public String authenticateAdmin(Admin admin) throws ServiceException {
        Admin u = adminRepository.findByUsername(admin.getUsername());

        if (u == null) {
            throw new ServiceException("message", "User not found");
        }

        if (!passwordEncoder.matches(admin.getPassword(), u.getPassword())) {
            throw new ServiceException("message", "Invalid credentials");
        }

        return jwtService.createToken(u.getUsername(), u.getId());
    }

    public Admin getAdminByUsername(String username) throws ServiceException {
        Admin admin = adminRepository.findByUsername(username);
        if (admin == null) {
            throw new ServiceException("Admin", "username not found");
        }
        return admin;
    }
}
