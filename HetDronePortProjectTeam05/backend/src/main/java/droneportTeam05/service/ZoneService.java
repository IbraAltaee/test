package droneportTeam05.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import droneportTeam05.domain.zones.Zone;
import droneportTeam05.repository.ZoneRepository;
import droneportTeam05.util.ServiceException;

@Service
public class ZoneService {
    
    @Autowired
    private final ZoneRepository zoneRepository;
    
    public ZoneService(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    public List<Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    public Zone createZone(Zone zone) {
        return zoneRepository.save(zone);
    }

    public Zone updateZone(String name, Zone zone) throws ServiceException {
        Zone existingZone = zoneRepository.findByName(name);
        if (existingZone == null) {
            throw new ServiceException("Zone", "Zone does not exist");
        }
        existingZone.setName(zone.getName());
        existingZone.setPath(zone.getPath());
        return zoneRepository.save(existingZone);
    }

    public String deleteZone(String name) throws ServiceException {
        Zone zone = zoneRepository.findByName(name);
        if (zone == null) {
            throw new ServiceException("Zone", "Zone does not exist");
        }
        zoneRepository.delete(zone);
        return "Zone deleted successfully";
    }

    public List<Zone> getZonesGreaterThanMaxHeight(double maxHeight) {
        return zoneRepository.findByMaxHeightGreaterThan(maxHeight);
    }

}
