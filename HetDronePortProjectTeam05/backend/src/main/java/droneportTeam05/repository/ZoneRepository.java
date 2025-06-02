package droneportTeam05.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import droneportTeam05.domain.zones.Zone;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, String> {
    Zone findByName(String name);
    List<Zone> findByMaxHeightGreaterThan(double maxHeight);
}
