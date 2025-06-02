package droneportTeam05.service.calculation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.volume.LateralContingencyVolume;

@Service
public class LateralContingencyVolumeService {
    
    @Autowired
    private ContingencyManoeuvreService contingencyManoeuvreService;
    
    public LateralContingencyVolume calculateLateralContingencyVolume(UAV uav, LateralContingencyVolume lateralCV) {
        double sgps = uav.getGpsInaccuracy();
        double spos = uav.getPositionHoldingError();
        double sk = uav.getMapError();
        double srz = calculateReactionDistance(uav);
        double scm = contingencyManoeuvreService.calculateLateralContingencyManoeuvre(uav, lateralCV);
        
        double totalExtension = sgps + spos + sk + srz + scm;
        lateralCV.setLateralExtension(totalExtension);
        
        return lateralCV;
    }
    
    private double calculateReactionDistance(UAV uav) {
        return uav.getMaxOperationalSpeed() * uav.getResponseTime();
    }
}