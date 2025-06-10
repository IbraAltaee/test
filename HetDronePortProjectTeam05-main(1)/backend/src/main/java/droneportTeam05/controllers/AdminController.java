package droneportTeam05.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import droneportTeam05.auth.DTO.AdminRequest;
import droneportTeam05.domain.Admin;
import droneportTeam05.repository.AdminRepository;
import droneportTeam05.service.AdminService;
import droneportTeam05.util.ServiceException;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @Autowired
    private AdminRepository adminRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/create")
    public String createAdmin(@RequestBody AdminRequest adminRequest) throws ServiceException {
        if (adminRepository.existsByUsername(adminRequest.getUsername())) {
            throw new ServiceException("Admin", "Username already exists");
        }

        Admin admin = new Admin(
                adminRequest.getUsername(),
                passwordEncoder.encode(adminRequest.getPassword())
        );
        adminRepository.save(admin);
        return "Admin created successfully.";
    }

    @GetMapping("/{username}")
    public Admin getAdminByUsername(@PathVariable String username) throws ServiceException {
        return adminService.getAdminByUsername(username);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ ServiceException.class})
    public Map<String, String> handleValidationExceptions(Exception ex) {
        Map<String, String> errors = new HashMap<>();
        if (ex instanceof ServiceException) {
            ServiceException serviceException = (ServiceException) ex;
            errors.put(serviceException.getField(), serviceException.getMessage());
        } else {
            errors.put("error", ex.getMessage());
        }
        return errors;
    }    
}
