package droneportTeam05.service.calculation;

import org.springframework.stereotype.Service;

import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.VerticalContingencyVolume;

@Service
public class GroundRiskBufferService {
    
    public GroundRiskBuffer calculateGroundRiskBuffer(UAV uav, GroundRiskBuffer grb, VerticalContingencyVolume verticalCV) {
        double sgrb = switch (grb.getTermination()) {
            case BALLISTIC_APPROACH -> calculateBallisticGRB(uav, verticalCV);
            case PARACHUTE -> calculateParachuteGRB(uav, grb, verticalCV);
            case OFF_GLIDING -> calculateGlidingGRB(grb, verticalCV);
            case OFF_NO_GLIDING, SIMPLIFIED_APPROACH -> calculateSimplifiedGRB(uav, verticalCV);
        };

        grb.setMinLateralDimension(sgrb);
        return grb;
    }
    
    private double calculateBallisticGRB(UAV uav, VerticalContingencyVolume verticalCV) {
        validateBallisticApproach(uav);
        
        double v0 = uav.getMaxOperationalSpeed();
        double g = 9.81;
        double hcv = verticalCV.getMinVerticalDimension();
        double cd = uav.getMaxCharacteristicDimension();
        
        return v0 * Math.sqrt(2 * hcv / g) + 0.5 * cd;
    }
    
    private void validateBallisticApproach(UAV uav) {
        if (uav.getType() != UAVType.MULTIROTOR && uav.getType() != UAVType.ROTORCRAFT) {
            throw new IllegalArgumentException("Ballistic approach only allowed for multirotors and rotorcrafts");
        }
    }
    
    private double calculateParachuteGRB(UAV uav, GroundRiskBuffer grb, VerticalContingencyVolume verticalCV) {
        validateParachuteParameters(grb);
        
        double v0 = uav.getMaxOperationalSpeed();
        double t = grb.getTimeToOpenParachute();
        double vWind = grb.getMaxPermissibleWindSpeed();
        double hcv = verticalCV.getMinVerticalDimension();
        double vz = grb.getRateOfDescent();
        
        return v0 * t + vWind * (hcv / vz);
    }
    
    private void validateParachuteParameters(GroundRiskBuffer grb) {
        if (grb.getMaxPermissibleWindSpeed() < 3) {
            throw new IllegalArgumentException("Wind speed below 3 m/s not considered realistic for parachute calculation");
        }
    }
    
    private double calculateGlidingGRB(GroundRiskBuffer grb, VerticalContingencyVolume verticalCV) {
        double hcv = verticalCV.getMinVerticalDimension();
        double epsilon = 1.0 / grb.getGlideRatio();
        
        return hcv / epsilon;
    }
    
    private double calculateSimplifiedGRB(UAV uav, VerticalContingencyVolume verticalCV) {
        double hcv = verticalCV.getMinVerticalDimension();
        double cd = uav.getMaxCharacteristicDimension();
        
        return hcv + 0.5 * cd;
    }
}