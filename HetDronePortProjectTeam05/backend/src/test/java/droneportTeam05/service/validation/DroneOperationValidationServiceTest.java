package droneportTeam05.service.validation;

import droneportTeam05.controllers.dto.DroneOperationRequest;
import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.geography.FlightGeography;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DroneOperationValidationServiceTest {
    
    private DroneOperationValidationService validationService;
    
    @BeforeEach
    public void setup() {
        validationService = new DroneOperationValidationService();
    }
    
    @Test
    public void testValidateDroneOperation_ValidMultirotor() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(50, 10, 10);
        
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(lateralCV)
                .verticalCV(verticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
        
        // Act & Assert
        assertDoesNotThrow(() -> validationService.validateDroneOperation(request));
    }
    
    @Test
    public void testValidateDroneOperation_ValidFixedWing() {
        // Arrange
        UAV uav = new UAV(UAVType.FIXEDWING, 30, 3, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forTurn180(30);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forCircularPath();
        GroundRiskBuffer grb = GroundRiskBuffer.forGliding(20);
        FlightGeography flightGeography = new FlightGeography(100, 10, 10);
        
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(lateralCV)
                .verticalCV(verticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
        
        // Act & Assert
        assertDoesNotThrow(() -> validationService.validateDroneOperation(request));
    }
    
    @Test
    public void testValidateUAV_InvalidSpeed() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 0, 2, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(50, 10, 10);
        
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(lateralCV)
                .verticalCV(verticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
        
        // Act & Assert
        Exception exception = assertThrows(ValidationException.class, () -> {
            validationService.validateDroneOperation(request);
        });
        
        assertTrue(exception.getMessage().contains("Speed too low"));
    }
    
    @Test
    public void testValidateUAV_InvalidDimension() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 0, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(50, 10, 10);
        
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(lateralCV)
                .verticalCV(verticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
        
        // Act & Assert
        Exception exception = assertThrows(ValidationException.class, () -> {
            validationService.validateDroneOperation(request);
        });
        
        assertTrue(exception.getMessage().contains("Characteristic dimension must be positive"));
    }
    
    @Test
    public void testValidateFlightGeography_TooSmall() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 5, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(10, 10, 10);
        
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(lateralCV)
                .verticalCV(verticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
        
        // Act & Assert
        Exception exception = assertThrows(ValidationException.class, () -> {
            validationService.validateDroneOperation(request);
        });
        
        assertTrue(exception.getMessage().contains("Flight geometry height must be at least 3×CD"));
    }
    
    @Test
    public void testValidateContingencyVolumes_MultirotorWithTurn180() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forTurn180(30);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(50, 10, 10);
        
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(lateralCV)
                .verticalCV(verticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
        
        // Act & Assert
        Exception exception = assertThrows(ValidationException.class, () -> {
            validationService.validateDroneOperation(request);
        });
        
        assertTrue(exception.getMessage().contains("TURN_180 manoeuvre not suitable for multirotors"));
    }
    
    @Test
    public void testValidateContingencyVolumes_FixedWingWithStopping() {
        // Arrange
        UAV uav = new UAV(UAVType.FIXEDWING, 30, 3, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forCircularPath();
        GroundRiskBuffer grb = GroundRiskBuffer.forGliding(20);
        FlightGeography flightGeography = new FlightGeography(100, 10, 10);
        
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(lateralCV)
                .verticalCV(verticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
        
        // Act & Assert
        Exception exception = assertThrows(ValidationException.class, () -> {
            validationService.validateDroneOperation(request);
        });
        
        assertTrue(exception.getMessage().contains("STOPPING manoeuvre not suitable for fixed-wing aircraft"));
    }
    
    @Test
    public void testValidateGroundRiskBuffer_FixedWingWithBallistic() {
        // Arrange
        UAV uav = new UAV(UAVType.FIXEDWING, 30, 3, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forTurn180(30);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forCircularPath();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(100, 10, 10);
        
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(lateralCV)
                .verticalCV(verticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
        
        // Act & Assert
        Exception exception = assertThrows(ValidationException.class, () -> {
            validationService.validateDroneOperation(request);
        });
        
        assertTrue(exception.getMessage().contains("Ballistic approach only allowed for multirotors and rotorcrafts"));
    }
}