package droneportTeam05.controllers.dto;

import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.geography.FlightGeography;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.AdjacentVolume;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class DroneOperationResultTest {

    @Test
    public void testBuilderSuccess() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(50, 10, 10);
        AdjacentVolume adjacentVolume = new AdjacentVolume(1200, 200);
        ValidationResult validationResult = ValidationResult.valid();
        
        // Act
        DroneOperationResult result = DroneOperationResult.builder()
                .uav(uav)
                .lateralCV(lateralCV)
                .verticalCV(verticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .adjacentVolume(adjacentVolume)
                .totalOperationalVolumeSize(5000)
                .calculationTimeMs(150)
                .validationResult(validationResult)
                .addWarning("Test warning")
                .build();
        
        // Assert
        assertNotNull(result);
        assertEquals(uav, result.getUav());
        assertEquals(lateralCV, result.getLateralCV());
        assertEquals(verticalCV, result.getVerticalCV());
        assertEquals(grb, result.getGrb());
        assertEquals(flightGeography, result.getFlightGeography());
        assertEquals(adjacentVolume, result.getAdjacentVolume());
        assertEquals(5000, result.getTotalOperationalVolumeSize());
        assertEquals(150, result.getCalculationTimeMs());
        assertEquals(validationResult, result.getValidationResult());
        assertTrue(result.hasWarnings());
        assertEquals(1, result.getWarnings().size());
        assertEquals("Test warning", result.getWarnings().get(0));
        assertTrue(result.isSuccess());
    }
    
    @Test
    public void testBuilderError() {
        // Act
        DroneOperationResult result = DroneOperationResult.builder()
                .errorMessage("Test error")
                .build();
        
        // Assert
        assertNotNull(result);
        assertFalse(result.isSuccess());
        assertEquals("Test error", result.getErrorMessage());
    }
    
    @Test
    public void testStaticFactoryMethods() {
        // Act
        DroneOperationResult successResult = DroneOperationResult.success();
        DroneOperationResult errorResult = DroneOperationResult.error("Error message");
        DroneOperationResult errorWithCauseResult = DroneOperationResult.error(
                "Error with cause", new RuntimeException("Cause"));
        
        // Assert
        assertTrue(successResult.isSuccess());
        
        assertFalse(errorResult.isSuccess());
        assertEquals("Error message", errorResult.getErrorMessage());
        
        assertFalse(errorWithCauseResult.isSuccess());
        assertTrue(errorWithCauseResult.getErrorMessage().contains("Error with cause"));
        assertTrue(errorWithCauseResult.getErrorMessage().contains("Cause"));
    }
    
    @Test
    public void testGetContingencyVolumeExtension() {
        // Arrange
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        lateralCV.setLateralExtension(20);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        verticalCV.setMinVerticalDimension(30);
        
        DroneOperationResult result = new DroneOperationResult();
        result.setLateralCV(lateralCV);
        result.setVerticalCV(verticalCV);
        
        // Act
        double extension = result.getContingencyVolumeExtension();
        
        // Assert
        assertEquals(30, extension);
    }
    
    @Test
    public void testGetContingencyVolumeExtension_NullComponents() {
        // Arrange
        DroneOperationResult result = new DroneOperationResult();
        
        // Act
        double extension = result.getContingencyVolumeExtension();
        
        // Assert
        assertEquals(0.0, extension);
    }
    
    @Test
    public void testTimeStamp() {
        // Arrange
        DroneOperationResult result = new DroneOperationResult();
        
        // Assert
        assertNotNull(result.getCalculationTimestamp());
        assertTrue(result.getCalculationTimestamp() instanceof LocalDateTime);
    }
}