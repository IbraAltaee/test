package droneportTeam05.service.validation;

import org.springframework.stereotype.Service;

import droneportTeam05.controllers.dto.DroneOperationRequest;
import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.risk.TerminationType;
import droneportTeam05.domain.volume.ContingencyManoeuvre;
import droneportTeam05.domain.volume.LateralContingencyVolume;

@Service
public class DroneOperationValidationService {
    
    public void validateDroneOperation(DroneOperationRequest request) {
        validateUAV(request.getUav());
        validateFlightGeography(request);
        validateContingencyVolumes(request);
        validateGroundRiskBuffer(request);
    }
    
    private void validateUAV(UAV uav) {
        if (uav.getMaxOperationalSpeed() <= 0) {
            throw new ValidationException("Speed too low");
        }
        
        if (uav.getMaxCharacteristicDimension() <= 0) {
            throw new ValidationException("Characteristic dimension must be positive");
        }
    }
    
    
    private void validateFlightGeography(DroneOperationRequest request) {
        double minDimension = 3 * request.getUav().getMaxCharacteristicDimension();
        
        if (request.getFlightGeography().getHeightFlightGeo() < minDimension) {
            throw new ValidationException("Flight geometry height must be at least 3×CD");
        }
    }
    
    private void validateContingencyVolumes(DroneOperationRequest request) {
        UAV uav = request.getUav();
        LateralContingencyVolume lateralCV = request.getLateralCV();
        
        if (uav.getType() == UAVType.MULTIROTOR && lateralCV.getContingencyManoeuvre() == ContingencyManoeuvre.TURN_180) {
            throw new ValidationException("TURN_180 manoeuvre not suitable for multirotors");
        }
        
        if (uav.getType() == UAVType.FIXEDWING && lateralCV.getContingencyManoeuvre() == ContingencyManoeuvre.STOPPING) {
            throw new ValidationException("STOPPING manoeuvre not suitable for fixed-wing aircraft");
        }
    }
    
    private void validateGroundRiskBuffer(DroneOperationRequest request) {
        UAV uav = request.getUav();
        GroundRiskBuffer grb = request.getGrb();
        
        if (uav.getType() == UAVType.FIXEDWING && grb.getTermination() == TerminationType.BALLISTIC_APPROACH) {
            throw new ValidationException("Ballistic approach only allowed for multirotors and rotorcrafts");
        }
    }
}

