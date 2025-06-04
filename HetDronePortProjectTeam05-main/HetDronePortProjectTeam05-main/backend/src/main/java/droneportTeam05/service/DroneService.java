package droneportTeam05.service;

import droneportTeam05.domain.Drone;
import droneportTeam05.repository.DroneRepository;
import droneportTeam05.util.ServiceException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DroneService {

    @Autowired
    private final DroneRepository droneRepository;

    public DroneService(DroneRepository droneRepository) {
        this.droneRepository = droneRepository;
    }

    public List<Drone> getAllDrones() {
        return droneRepository.findAll();
    }

    public Drone createDrone(Drone drone) {
        return droneRepository.save(drone);
    }

    @Transactional
    public Drone updateDrone(String name, Drone drone) throws ServiceException {
        Drone existingDrone = droneRepository.findByName(name);
        if (existingDrone == null) {
            throw new ServiceException("Drone", "Drone does not exist");
        }

        existingDrone.setName(drone.getName());


        if (drone.getUav() != null) {
            drone.getUav().setId(existingDrone.getUav().getId());
            existingDrone.setUav(drone.getUav());
        }

        if (drone.getLateralContingencyVolume() != null) {
            drone.getLateralContingencyVolume().setId(existingDrone.getLateralContingencyVolume().getId());
            existingDrone.setLateralContingencyVolume(drone.getLateralContingencyVolume());
        }

        if (drone.getVerticalContingencyVolume() != null) {
            drone.getVerticalContingencyVolume().setId(existingDrone.getVerticalContingencyVolume().getId());
            existingDrone.setVerticalContingencyVolume(drone.getVerticalContingencyVolume());
        }

        if (drone.getGroundRiskBuffer() != null) {
            drone.getGroundRiskBuffer().setId(existingDrone.getGroundRiskBuffer().getId());
            existingDrone.setGroundRiskBuffer(drone.getGroundRiskBuffer());
        }

        return droneRepository.save(existingDrone);
    }


    public String deleteDrone(String name) throws ServiceException {
        Drone drone = droneRepository.findByName(name);
        if (drone == null) {
            throw new ServiceException("Drone", "Drone does not exist");
        }
        droneRepository.delete(drone);
        return "Drone deleted successfully";
    }
}
