package droneportTeam05.controllers.dto;


import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.geography.FlightGeography;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.AdjacentVolume;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class DroneOperationResult {
    private UAV uav;
    private LateralContingencyVolume lateralCV;
    private VerticalContingencyVolume verticalCV;
    private GroundRiskBuffer grb;
    private AdjacentVolume adjacentVolume;
    private FlightGeography flightGeography;

    private double totalOperationalVolumeSize;

    private boolean success;
    private String errorMessage;
    private List<String> warnings;
    
    private LocalDateTime calculationTimestamp;
    private long calculationTimeMs;
    private ValidationResult validationResult;
    
    public DroneOperationResult() {
        this.calculationTimestamp = LocalDateTime.now();
        this.warnings = new ArrayList<>();
        this.success = true;
    }
    
    public static class Builder {
        private DroneOperationResult result = new DroneOperationResult();
        
        public Builder uav(UAV uav) {
            result.uav = uav;
            return this;
        }
        
        public Builder lateralCV(LateralContingencyVolume lateralCV) {
            result.lateralCV = lateralCV;
            return this;
        }
        
        public Builder verticalCV(VerticalContingencyVolume verticalCV) {
            result.verticalCV = verticalCV;
            return this;
        }
        
        public Builder grb(GroundRiskBuffer grb) {
            result.grb = grb;
            return this;
        }
        
        
        public Builder flightGeography(FlightGeography flightGeography) {
            result.flightGeography = flightGeography;
            return this;
        }

        public Builder adjacentVolume(AdjacentVolume adjacentVolume) {
            result.adjacentVolume = adjacentVolume;
            return this;
        }
        
        public Builder totalOperationalVolumeSize(double size) {
            result.totalOperationalVolumeSize = size;
            return this;
        }
        
        public Builder calculationTimeMs(long timeMs) {
            result.calculationTimeMs = timeMs;
            return this;
        }
        
        public Builder validationResult(ValidationResult validationResult) {
            result.validationResult = validationResult;
            return this;
        }
        
        public Builder addWarning(String warning) {
            result.warnings.add(warning);
            return this;
        }
        
        public Builder errorMessage(String errorMessage) {
            result.errorMessage = errorMessage;
            result.success = false;
            return this;
        }
        
        public DroneOperationResult build() {
            return result;
        }
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static DroneOperationResult error(String message) {
        return builder()
            .errorMessage(message)
            .build();
    }
    
    public static DroneOperationResult error(String message, Throwable cause) {
        return builder()
            .errorMessage(message + ": " + cause.getMessage())
            .build();
    }
    
    public static DroneOperationResult success() {
        return new DroneOperationResult();
    }
    
    public boolean hasWarnings() {
        return !warnings.isEmpty();
    }
    
    public double getContingencyVolumeExtension() {
        if (lateralCV != null && verticalCV != null) {
            return Math.max(lateralCV.getLateralExtension(), verticalCV.getMinVerticalDimension());
        }
        return 0.0;
    }

}