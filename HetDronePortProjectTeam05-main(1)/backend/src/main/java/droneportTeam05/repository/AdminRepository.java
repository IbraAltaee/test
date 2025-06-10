package droneportTeam05.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import droneportTeam05.domain.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    List<Admin> findAll();
    Admin findByUsername(String username);
    boolean existsByUsername(String username);
}
