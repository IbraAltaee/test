package droneportTeam05.controllers.dto;

import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.geography.FlightGeography;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DroneOperationRequestTest {

    @Test
    public void testBuilderSuccess() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(50, 10, 10);
        
        // Act
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(lateralCV)
                .verticalCV(verticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
        
        // Assert
        assertNotNull(request);
        assertEquals(uav, request.getUav());
        assertEquals(lateralCV, request.getLateralCV());
        assertEquals(verticalCV, request.getVerticalCV());
        assertEquals(grb, request.getGrb());
        assertEquals(flightGeography, request.getFlightGeography());
    }
    
    @Test
    public void testValidateRequest_MissingUAV() {
        // Arrange
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(50, 10, 10);
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new DroneOperationRequest.Builder()
                    .lateralCV(lateralCV)
                    .verticalCV(verticalCV)
                    .grb(grb)
                    .flightGeography(flightGeography)
                    .build();
        });
        
        assertTrue(exception.getMessage().contains("UAV specification is required"));
    }
    
    @Test
    public void testValidateRequest_MissingLateralCV() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(50, 10, 10);
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new DroneOperationRequest.Builder()
                    .uav(uav)
                    .verticalCV(verticalCV)
                    .grb(grb)
                    .flightGeography(flightGeography)
                    .build();
        });
        
        assertTrue(exception.getMessage().contains("Lateral contingency volume configuration is required"));
    }
    
    @Test
    public void testValidateRequest_MissingVerticalCV() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(50, 10, 10);
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new DroneOperationRequest.Builder()
                    .uav(uav)
                    .lateralCV(lateralCV)
                    .grb(grb)
                    .flightGeography(flightGeography)
                    .build();
        });
        
        assertTrue(exception.getMessage().contains("Vertical contingency volume configuration is required"));
    }
    
    @Test
    public void testValidateRequest_MissingGRB() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        FlightGeography flightGeography = new FlightGeography(50, 10, 10);
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new DroneOperationRequest.Builder()
                    .uav(uav)
                    .lateralCV(lateralCV)
                    .verticalCV(verticalCV)
                    .flightGeography(flightGeography)
                    .build();
        });
        
        assertTrue(exception.getMessage().contains("Ground risk buffer configuration is required"));
    }
    
    @Test
    public void testValidateRequest_InvalidFlightHeight() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
                
        FlightGeography flightGeography = new FlightGeography();
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new DroneOperationRequest.Builder()
                    .uav(uav)
                    .lateralCV(lateralCV)
                    .verticalCV(verticalCV)
                    .grb(grb)
                    .flightGeography(flightGeography)
                    .build();
        });
        
        assertTrue(exception.getMessage().contains("Flight height must be positive"));
    }
}