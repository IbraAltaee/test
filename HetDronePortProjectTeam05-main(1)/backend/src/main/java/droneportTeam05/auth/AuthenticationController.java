package droneportTeam05.auth;


import droneportTeam05.auth.DTO.LoginRequest;
import droneportTeam05.domain.Admin;
import droneportTeam05.service.AdminService;
import droneportTeam05.util.ServiceException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
    private static final String AUTH_COOKIE_NAME = "authToken";
    private static final int COOKIE_MAX_AGE = 8 * 60 * 60; // 8 hours

    private final AdminService adminService;

    public AuthenticationController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest loginRequest, 
                                                   HttpServletRequest request,
                                                   HttpServletResponse response) {
        try {
            String clientIp = getClientIp(request);
            logger.info("Login attempt from IP: {} for username: {}", clientIp, loginRequest.getUsername());
            
            Admin admin = LoginRequest.toAdmin(loginRequest);
            String token = adminService.authenticateAdmin(admin);
            
            // Set HttpOnly cookie
            Cookie authCookie = new Cookie(AUTH_COOKIE_NAME, token);
            authCookie.setHttpOnly(true);  // Cannot be accessed by JavaScript
            authCookie.setSecure(false);   // Set to true in production with HTTPS
            authCookie.setPath("/");
            authCookie.setMaxAge(COOKIE_MAX_AGE);
            // authCookie.setSameSite("Strict"); // Uncomment for production
            response.addCookie(authCookie);
            
            Map<String, Object> result = new HashMap<>();
            result.put("username", admin.getUsername());
            result.put("success", true);
            result.put("message", "Login successful");
            // Note: NO TOKEN in response!
            
            logger.info("Successful login for username: {} from IP: {}", admin.getUsername(), clientIp);
            return ResponseEntity.ok(result);
            
        } catch (ServiceException e) {
            logger.warn("Login failed for username: {} - {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Login failed"));
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateAuth(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "No authentication found", "authenticated", false));
        }
        
        try {
            Admin admin = adminService.validateToken(token);
            
            Map<String, Object> result = new HashMap<>();
            result.put("username", admin.getUsername());
            result.put("authenticated", true);
            result.put("role", "ADMIN");
            
            return ResponseEntity.ok(result);
            
        } catch (ServiceException e) {
            logger.warn("Token validation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage(), "authenticated", false));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, 
                                                    HttpServletResponse response) {
        // Clear the auth cookie
        Cookie authCookie = new Cookie(AUTH_COOKIE_NAME, "");
        authCookie.setHttpOnly(true);
        authCookie.setSecure(false); // Set to true in production
        authCookie.setPath("/");
        authCookie.setMaxAge(0); // Delete cookie
        response.addCookie(authCookie);
        
        String username = "unknown";
        try {
            String token = extractTokenFromRequest(request);
            if (token != null) {
                Admin admin = adminService.validateToken(token);
                username = admin.getUsername();
            }
        } catch (Exception e) {
            // Ignore errors during logout
        }
        
        logger.info("User logged out: {}", username);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
    
    private String extractTokenFromRequest(HttpServletRequest request) {
        // Try Authorization header first (for API calls)
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        
        // Try cookies (for web app)
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (AUTH_COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        
        return null;
    }
    
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}