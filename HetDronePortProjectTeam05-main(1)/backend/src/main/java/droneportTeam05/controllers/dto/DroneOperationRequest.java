package droneportTeam05.controllers.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.geography.FlightGeography;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;

@Setter
@Getter
@NoArgsConstructor
public class DroneOperationRequest {
    private UAV uav;
    private LateralContingencyVolume lateralCV;
    private VerticalContingencyVolume verticalCV;
    private GroundRiskBuffer grb;
    private FlightGeography flightGeography;

    
    public DroneOperationRequest(UAV uav, LateralContingencyVolume lateralCV, VerticalContingencyVolume verticalCV, 
                                GroundRiskBuffer grb, FlightGeography flightGeography, double groundVisibility) {
        this.uav = uav;
        this.lateralCV = lateralCV;
        this.verticalCV = verticalCV;
        this.grb = grb;
        this.flightGeography = flightGeography;
    }
    
    public static class Builder {
        private final DroneOperationRequest request = new DroneOperationRequest();
        
        public Builder uav(UAV uav) {
            request.uav = uav;
            return this;
        }
        
        public Builder lateralCV(LateralContingencyVolume lateralCV) {
            request.lateralCV = lateralCV;
            return this;
        }
        
        public Builder verticalCV(VerticalContingencyVolume verticalCV) {
            request.verticalCV = verticalCV;
            return this;
        }
        
        public Builder grb(GroundRiskBuffer grb) {
            request.grb = grb;
            return this;
        }
        
        public Builder flightGeography(FlightGeography flightGeography) {
            request.flightGeography = flightGeography;
            return this;
        }

        public DroneOperationRequest build() {
            validateRequest(request);
            return request;
        }
        
        private void validateRequest(DroneOperationRequest request) {
            if (request.uav == null) {
                throw new IllegalArgumentException("UAV specification is required");
            }
            if (request.lateralCV == null) {
                throw new IllegalArgumentException("Lateral contingency volume configuration is required");
            }
            if (request.verticalCV == null) {
                throw new IllegalArgumentException("Vertical contingency volume configuration is required");
            }
            if (request.grb == null) {
                throw new IllegalArgumentException("Ground risk buffer configuration is required");
            }
            if (request.flightGeography.getHeightFlightGeo() <= 0) {
                throw new IllegalArgumentException("Flight height must be positive");
            }
        }
    }
    
    public static Builder builder() {
        return new Builder();
    }
}