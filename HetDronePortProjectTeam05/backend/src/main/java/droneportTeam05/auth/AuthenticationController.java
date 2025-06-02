package droneportTeam05.auth;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import droneportTeam05.domain.Admin;
import droneportTeam05.service.AdminService;
import droneportTeam05.util.ServiceException;
import droneportTeam05.auth.DTO.LoginRequest;
import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

// @CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AdminService adminService;

    public AuthenticationController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    Map<String, Object> login(@RequestBody LoginRequest u) throws ServiceException {
        Map<String, Object> result = new HashMap<>();
        Admin adminR = LoginRequest.toAdmin(u);

        Admin admin = adminService.findByUsername(adminR.getUsername());
        String token = adminService.authenticateAdmin(adminR);

        result.put("username", admin.getUsername());
        result.put("token", token);

        return result;
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
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