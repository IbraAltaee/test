package droneportTeam05.service.orchestration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import droneportTeam05.controllers.dto.DroneOperationRequest;
import droneportTeam05.controllers.dto.DroneOperationResult;
import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.geography.FlightGeography;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.AdjacentVolume;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import droneportTeam05.service.calculation.AdjacentVolumeService;
import droneportTeam05.service.calculation.GroundRiskBufferService;
import droneportTeam05.service.calculation.LateralContingencyVolumeService;
import droneportTeam05.service.calculation.FlightGeographyService;
import droneportTeam05.service.calculation.VerticalContingencyVolumeService;
import droneportTeam05.service.validation.DroneOperationValidationService;

@Service
public class DroneOperationService {
    
    @Autowired
    private LateralContingencyVolumeService lateralCVService;
    
    @Autowired
    private VerticalContingencyVolumeService verticalCVService;
    
    @Autowired
    private GroundRiskBufferService grbService;

    @Autowired
    private FlightGeographyService minFlightDimensionService;

    @Autowired
    private AdjacentVolumeService adjacentVolumeService;
    
    @Autowired
    private DroneOperationValidationService validationService;
    
    public DroneOperationResult calculateOperation(DroneOperationRequest request) {
        validationService.validateDroneOperation(request);
        
        UAV uav = request.getUav();
        LateralContingencyVolume lateralCV = request.getLateralCV();
        VerticalContingencyVolume verticalCV = request.getVerticalCV();
        GroundRiskBuffer grb = request.getGrb();
        double flightHeight = request.getFlightGeography().getHeightFlightGeo();
        
        lateralCV = lateralCVService.calculateLateralContingencyVolume(uav, lateralCV);
        verticalCV = verticalCVService.calculateVerticalContingencyVolume(uav, verticalCV, flightHeight);
        if (lateralCV.getTimeToOpenParachute() != 0) {
            verticalCV.setTimeToOpenParachute(lateralCV.getTimeToOpenParachute());
            grb.setTimeToOpenParachute(lateralCV.getTimeToOpenParachute());
        }

        else if (verticalCV.getTimeToOpenParachute() != 0) grb.setTimeToOpenParachute(verticalCV.getTimeToOpenParachute());
        
        grb = grbService.calculateGroundRiskBuffer(uav, grb, verticalCV);
        FlightGeography minFlightDimension = minFlightDimensionService.calculateMinFlightDimensions(flightHeight, uav.getMaxCharacteristicDimension());
        AdjacentVolume adjacentVolume = adjacentVolumeService.calculateAdjacentVolume(uav.getMaxOperationalSpeed(), verticalCV.getMinVerticalDimension());
        
        return DroneOperationResult.builder()
            .uav(uav)
            .lateralCV(lateralCV)
            .verticalCV(verticalCV)
            .grb(grb)
            .flightGeography(minFlightDimension)
            .adjacentVolume(adjacentVolume)
            .build();
    }
}