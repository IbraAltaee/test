package droneportTeam05.controllers;

import droneportTeam05.controllers.dto.DroneOperationRequest;
import droneportTeam05.controllers.dto.DroneOperationResult;
import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.geography.FlightGeography;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import droneportTeam05.service.orchestration.DroneOperationService;
import droneportTeam05.service.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DroneOperationControllerTest {

    @Mock
    private DroneOperationService calculationService;

    @InjectMocks
    private DroneOperationController controller;

    private DroneOperationRequest validRequest;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        
        // Create a valid request for testing
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        FlightGeography flightGeography = new FlightGeography(50, 10, 10);
        
        validRequest = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(lateralCV)
                .verticalCV(verticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
    }
    
    @Test
    public void testCalculateOperation_Success() {
        // Arrange
        DroneOperationResult expectedResult = DroneOperationResult.success();
        when(calculationService.calculateOperation(validRequest)).thenReturn(expectedResult);
        
        // Act
        ResponseEntity<DroneOperationResult> response = controller.calculateOperation(validRequest);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        
        verify(calculationService, times(1)).calculateOperation(validRequest);
    }
    
    @Test
    public void testCalculateOperation_FailedValidation() {
        // Arrange
        when(calculationService.calculateOperation(validRequest))
                .thenThrow(new ValidationException("Validation failed"));
        
        // Act
        ResponseEntity<DroneOperationResult> response = controller.calculateOperation(validRequest);
        
        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Validation failed", response.getBody().getErrorMessage());
        
        verify(calculationService, times(1)).calculateOperation(validRequest);
    }
    
    @Test
    public void testCalculateOperation_InternalError() {
        // Arrange
        when(calculationService.calculateOperation(validRequest))
                .thenThrow(new RuntimeException("Something went wrong"));
        
        // Act
        ResponseEntity<DroneOperationResult> response = controller.calculateOperation(validRequest);
        
        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getErrorMessage().contains("Internal error"));
        
        verify(calculationService, times(1)).calculateOperation(validRequest);
    }
    
    @Test
    public void testCalculateOperation_FailureResult() {
        // Arrange
        DroneOperationResult failureResult = DroneOperationResult.error("Operation failed");
        when(calculationService.calculateOperation(validRequest)).thenReturn(failureResult);
        
        // Act
        ResponseEntity<DroneOperationResult> response = controller.calculateOperation(validRequest);
        
        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Operation failed", response.getBody().getErrorMessage());
        
        verify(calculationService, times(1)).calculateOperation(validRequest);
    }
}