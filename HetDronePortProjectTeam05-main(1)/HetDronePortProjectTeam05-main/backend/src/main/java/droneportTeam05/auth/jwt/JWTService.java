package droneportTeam05.auth.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import droneportTeam05.util.ServiceException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTService {


    private final Algorithm algorithm;
    private final JWTVerifier verifier;

    public JWTService(@Value("${token.secret.key}") String secretKey) {

        if (secretKey == null || secretKey.isEmpty()) {
            throw new IllegalArgumentException("JWT secret key must not be null or empty");
        }
        this.algorithm = Algorithm.HMAC256(secretKey);
        this.verifier = JWT.require(this.algorithm).build();
    }

    public String createToken(String username, Long id) {
        int timeToExpire = 1000 * 60 * 60 * 24;
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + timeToExpire);
        return JWT.create()
                .withSubject(username)
                .withClaim("username", username)
                .withClaim("id", id)
                .withIssuedAt(now)
                .withExpiresAt(expirationDate)
                .sign(this.algorithm);
    }

    public void verifyToken(String token) throws ServiceException {
        this.verifier.verify(token);

        try {
            JWT.require(this.algorithm)
                    .build()
                    .verify(token);
        } catch (JWTVerificationException e) {
            throw new ServiceException("token", "token.invalid");
        }
    }

    public String getSubjectFromToken(String token) {
        DecodedJWT jwt = JWT.decode(token);
        return jwt.getSubject();
    }


    public UserDetails loadUserBySubject(String subject) {
        return User.withUsername(subject)
                .password("")
                .build();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ MethodArgumentNotValidException.class })
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getFieldErrors().forEach((error) -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}