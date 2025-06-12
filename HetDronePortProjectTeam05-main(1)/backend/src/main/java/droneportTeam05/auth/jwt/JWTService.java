package droneportTeam05.auth.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import droneportTeam05.domain.Admin;
import droneportTeam05.repository.AdminRepository;
import droneportTeam05.util.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
public class JWTService {
    
    private static final Logger logger = LoggerFactory.getLogger(JWTService.class);
    private static final String ROLE_CLAIM = "role";
    private static final String USER_ID_CLAIM = "user_id";
    private static final String ISSUER = "droneport-api";
    
    private final Algorithm algorithm;
    private final JWTVerifier verifier;
    private final AdminRepository adminRepository;
    private final long tokenExpirationHours = 8;

    public JWTService(@Value("${token.secret.key}") String secretKey, 
                     AdminRepository adminRepository) {
        
        if (secretKey == null || secretKey.length() < 32) {
            throw new IllegalArgumentException("JWT secret key must be at least 32 characters");
        }
        
        this.adminRepository = adminRepository;
        this.algorithm = Algorithm.HMAC256(secretKey);
        this.verifier = JWT.require(this.algorithm)
                .withIssuer(ISSUER)
                .build();
    }

    public String createToken(Admin admin) {
        Instant now = Instant.now();
        Instant expiration = now.plus(tokenExpirationHours, ChronoUnit.HOURS);
        
        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(admin.getUsername())
                .withClaim(ROLE_CLAIM, "ADMIN")
                .withClaim(USER_ID_CLAIM, admin.getId())
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(expiration))
                .sign(this.algorithm);
    }

    public TokenValidationResult verifyToken(String token) throws ServiceException {
        try {
            DecodedJWT decodedJWT = verifier.verify(token);
            
            String username = decodedJWT.getSubject();
            Long userId = decodedJWT.getClaim(USER_ID_CLAIM).asLong();
            String role = decodedJWT.getClaim(ROLE_CLAIM).asString();
            
            if (username == null || userId == null || !"ADMIN".equals(role)) {
                throw new ServiceException("token", "Invalid token claims");
            }
            
            // Verify user still exists and is valid
            Admin admin = adminRepository.findByUsername(username);
            if (admin == null || !admin.getId().equals(userId)) {
                throw new ServiceException("token", "Token user no longer valid");
            }
            
            if (!admin.getEnabled()) {
                throw new ServiceException("token", "Account disabled");
            }
            
            if (!admin.getAccountNonLocked()) {
                throw new ServiceException("token", "Account locked");
            }
            
            return new TokenValidationResult(true, username, userId, role, admin);
            
        } catch (TokenExpiredException e) {
            logger.warn("Token expired: {}", e.getMessage());
            throw new ServiceException("token", "Token has expired");
        } catch (JWTVerificationException e) {
            logger.warn("Token verification failed: {}", e.getMessage());
            throw new ServiceException("token", "Token verification failed");
        }
    }

    public String getSubjectFromToken(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);
            return jwt.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Failed to decode token", e);
        }
    }

public UserDetails loadUserBySubject(String subject) throws ServiceException {
    Admin admin = adminRepository.findByUsername(subject);
    if (admin == null) {
        throw new ServiceException("user", "User not found");
    }
    
    // Create UserDetails with available builder methods
    return User.builder()
            .username(admin.getUsername())
            .password("") // Empty password for JWT authentication
            .authorities("ROLE_ADMIN")
            .disabled(!admin.getEnabled())
            .accountLocked(!admin.getAccountNonLocked())
            .build();
}
    
    public static class TokenValidationResult {
        private final boolean valid;
        private final String username;
        private final Long userId;
        private final String role;
        private final Admin admin;
        
        public TokenValidationResult(boolean valid, String username, Long userId, String role, Admin admin) {
            this.valid = valid;
            this.username = username;
            this.userId = userId;
            this.role = role;
            this.admin = admin;
        }
        
        // Getters
        public boolean isValid() { return valid; }
        public String getUsername() { return username; }
        public Long getUserId() { return userId; }
        public String getRole() { return role; }
        public Admin getAdmin() { return admin; }
    }
}