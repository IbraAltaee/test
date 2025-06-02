package droneportTeam05.repository;

import droneportTeam05.domain.Drone;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface DroneRepository extends JpaRepository<Drone, String> {
    Drone findByName(String name);
}
