package droneportTeam05.service.calculation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.volume.VerticalContingencyVolume;

@Service
public class VerticalContingencyVolumeService {
    
    @Autowired
    private ContingencyManoeuvreService contingencyManoeuvreService;
    
    public VerticalContingencyVolume calculateVerticalContingencyVolume(UAV uav, VerticalContingencyVolume verticalCV, double flightHeight) {
        double hfg = flightHeight;
        double hbaro = uav.getAltitudeMeasurementError();
        double hrz = calculateResponseHeight(uav);
        double hcm = contingencyManoeuvreService.calculateVerticalContingencyManoeuvre(uav, verticalCV);
        
        verticalCV.setHeightContingencyManoeuvre(hcm);
        double totalExtension = hfg + hbaro + hrz + hcm;
        verticalCV.setMinVerticalDimension(totalExtension);
        verticalCV.setResponseHeight(hrz);
        
        return verticalCV;
    }
    
    private double calculateResponseHeight(UAV uav) {
        return uav.getMaxOperationalSpeed() * 0.7 * uav.getResponseTime();
    }
}
