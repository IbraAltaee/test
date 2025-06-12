package droneportTeam05.controllers;

import droneportTeam05.auth.DTO.AdminRequest;
import droneportTeam05.domain.Admin;
import droneportTeam05.service.AdminService;
import droneportTeam05.util.ServiceException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createAdmin(@Valid @RequestBody AdminRequest adminRequest, 
                                                         HttpServletRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String createdBy = auth.getName();
            
            // Input validation
            if (adminRequest.getUsername() == null || adminRequest.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username is required"));
            }
            
            if (adminRequest.getPassword() == null || adminRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Password is required"));
            }
            
            // Create admin (AdminService will handle validation)
            adminService.createAdmin(adminRequest.getUsername().trim(), adminRequest.getPassword(), createdBy);
            
            logger.info("Admin created successfully: {} by {}", adminRequest.getUsername(), createdBy);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Admin created successfully"));
                
        } catch (ServiceException e) {
            logger.warn("Failed to create admin: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error creating admin", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create admin"));
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getAdminByUsername(@PathVariable String username) {
        try {
            // Validate username format
            if (!username.matches("^[a-zA-Z0-9_]{1,50}$")) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid username format"));
            }
            
            Admin admin = adminService.getAdminByUsername(username);
            
            // Return safe admin info (exclude sensitive data)
            Map<String, Object> adminInfo = new HashMap<>();
            adminInfo.put("id", admin.getId());
            adminInfo.put("username", admin.getUsername());
            adminInfo.put("enabled", admin.getEnabled());
            adminInfo.put("accountNonLocked", admin.getAccountNonLocked());
            
            return ResponseEntity.ok(adminInfo);
            
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error retrieving admin", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve admin"));
        }
    }
    
    @PostMapping("/unlock/{username}")
    public ResponseEntity<Map<String, String>> unlockAccount(@PathVariable String username) {
        try {
            if (!username.matches("^[a-zA-Z0-9_]{1,50}$")) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid username format"));
            }
            
            adminService.unlockAccount(username);
            
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            logger.info("Account unlocked for: {} by {}", username, auth.getName());
            
            return ResponseEntity.ok(Map.of("message", "Account unlocked successfully"));
            
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error unlocking account", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to unlock account"));
        }
    }
}