package droneportTeam05.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import droneportTeam05.domain.Admin;

import jakarta.annotation.PostConstruct;

@Component
public class DbInitializer {
        @Value("${admin.user}") String username;
        @Value("${admin.password}") String password;

        private final AdminRepository adminRepository;

        public DbInitializer(AdminRepository adminRepository) {
                this.adminRepository = adminRepository;
        }

        @PostConstruct
        public void initialize() {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            
            if (!adminRepository.existsByUsername(username)) {
                Admin admin = new Admin(username, encoder.encode(password));
                adminRepository.save(admin);
            }
        }
}