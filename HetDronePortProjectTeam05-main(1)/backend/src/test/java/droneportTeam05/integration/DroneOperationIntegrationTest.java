package droneportTeam05.integration;

import droneportTeam05.controllers.DroneOperationController;
import droneportTeam05.controllers.dto.DroneOperationRequest;
import droneportTeam05.controllers.dto.DroneOperationResult;
import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.geography.FlightGeography;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class DroneOperationIntegrationTest {

    @Autowired
    private DroneOperationController droneOperationController;
    
    private UAV multirotorUAV;
    private UAV fixedWingUAV;
    private LateralContingencyVolume stoppingLCV;
    private LateralContingencyVolume turn180LCV;
    private LateralContingencyVolume parachuteLCV;
    private VerticalContingencyVolume energyConversionVCV;
    private VerticalContingencyVolume circularPathVCV;
    private VerticalContingencyVolume parachuteVCV;
    private GroundRiskBuffer ballisticGRB;
    private GroundRiskBuffer parachuteGRB;
    private GroundRiskBuffer glidingGRB;
    private FlightGeography flightGeography;
    
    @BeforeEach
    public void setup() {
        multirotorUAV = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        fixedWingUAV = new UAV(UAVType.FIXEDWING, 30, 3, "barometric", 3, 3, 1, 1);
        
        stoppingLCV = LateralContingencyVolume.forStopping(45);
        turn180LCV = LateralContingencyVolume.forTurn180(30);
        parachuteLCV = LateralContingencyVolume.forParachute(5);
        
        energyConversionVCV = VerticalContingencyVolume.forEnergyConversion();
        circularPathVCV = VerticalContingencyVolume.forCircularPath();
        parachuteVCV = VerticalContingencyVolume.forParachute(5);
        
        ballisticGRB = GroundRiskBuffer.forBallistic();
        parachuteGRB = GroundRiskBuffer.forParachute(5, 10, 3);
        glidingGRB = GroundRiskBuffer.forGliding(20);
        
        flightGeography = new FlightGeography(100, 10, 10);
    }
    
    @Test
    public void testEndToEndMultirotor_Stopping() {
        // Arrange
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(multirotorUAV)
                .lateralCV(stoppingLCV)
                .verticalCV(energyConversionVCV)
                .grb(ballisticGRB)
                .flightGeography(flightGeography)
                .build();
        
        // Act
        ResponseEntity<DroneOperationResult> response = droneOperationController.calculateOperation(request);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        DroneOperationResult result = response.getBody();
        assertNotNull(result);
        assertTrue(result.isSuccess());
        
        double expectedLateralExtension = multirotorUAV.getGpsInaccuracy() + 
                                         multirotorUAV.getPositionHoldingError() + 
                                         multirotorUAV.getMapError() + 
                                         (multirotorUAV.getMaxOperationalSpeed() * multirotorUAV.getResponseTime()) +
                                         ((multirotorUAV.getMaxOperationalSpeed() * multirotorUAV.getMaxOperationalSpeed()) / 
                                          (2 * 9.81 * Math.tan(Math.toRadians(stoppingLCV.getPitchAngle()))));
        
        assertEquals(expectedLateralExtension, result.getLateralCV().getLateralExtension(), 0.1);
        
        double expectedVerticalExtension = flightGeography.getHeightFlightGeo() + 
                                          multirotorUAV.getAltitudeMeasurementError() + 
                                          (multirotorUAV.getMaxOperationalSpeed() * 0.7 * multirotorUAV.getResponseTime()) +
                                          (0.5 * (multirotorUAV.getMaxOperationalSpeed() * multirotorUAV.getMaxOperationalSpeed()) / 9.81);
        
        assertEquals(expectedVerticalExtension, result.getVerticalCV().getMinVerticalDimension(), 0.1);
        
        double expectedGRB = multirotorUAV.getMaxOperationalSpeed() * 
                            Math.sqrt(2 * result.getVerticalCV().getMinVerticalDimension() / 9.81) + 
                            (0.5 * multirotorUAV.getMaxCharacteristicDimension());
        
        assertEquals(expectedGRB, result.getGrb().getMinLateralDimension(), 0.1);
        
        double expectedAdjLateral = 120 * multirotorUAV.getMaxOperationalSpeed();
        double expectedAdjVertical = result.getVerticalCV().getMinVerticalDimension() + 150;
        
        assertEquals(expectedAdjLateral, result.getAdjacentVolume().getLateralInMeter(), 0.1);
        assertEquals(expectedAdjVertical, result.getAdjacentVolume().getVerticalInMeter(), 0.1);
    }
    
    @Test
    public void testEndToEndFixedWing_Turn180() {
        // Arrange
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(fixedWingUAV)
                .lateralCV(turn180LCV)
                .verticalCV(circularPathVCV)
                .grb(glidingGRB)
                .flightGeography(flightGeography)
                .build();
        
        // Act
        ResponseEntity<DroneOperationResult> response = droneOperationController.calculateOperation(request);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        DroneOperationResult result = response.getBody();
        assertNotNull(result);
        assertTrue(result.isSuccess());
        
        double expectedLateralExtension = fixedWingUAV.getGpsInaccuracy() + 
                                         fixedWingUAV.getPositionHoldingError() + 
                                         fixedWingUAV.getMapError() + 
                                         (fixedWingUAV.getMaxOperationalSpeed() * fixedWingUAV.getResponseTime()) +
                                         ((fixedWingUAV.getMaxOperationalSpeed() * fixedWingUAV.getMaxOperationalSpeed()) / 
                                          (9.81 * Math.tan(Math.toRadians(turn180LCV.getRollAngle()))));
        
        assertEquals(expectedLateralExtension, result.getLateralCV().getLateralExtension(), 0.1);
        
        double expectedVerticalExtension = flightGeography.getHeightFlightGeo() + 
                                          fixedWingUAV.getAltitudeMeasurementError() + 
                                          (fixedWingUAV.getMaxOperationalSpeed() * 0.7 * fixedWingUAV.getResponseTime()) +
                                          ((fixedWingUAV.getMaxOperationalSpeed() * fixedWingUAV.getMaxOperationalSpeed()) / 9.81 * 0.3);
        
        assertEquals(expectedVerticalExtension, result.getVerticalCV().getMinVerticalDimension(), 0.1);
        
        double expectedGRB = result.getVerticalCV().getMinVerticalDimension() / (1.0 / glidingGRB.getGlideRatio());
        
        assertEquals(expectedGRB, result.getGrb().getMinLateralDimension(), 0.1);
        
        double expectedAdjLateral = 120 * fixedWingUAV.getMaxOperationalSpeed();
        double expectedAdjVertical = result.getVerticalCV().getMinVerticalDimension() + 150;
        
        assertEquals(expectedAdjLateral, result.getAdjacentVolume().getLateralInMeter(), 0.1);
        assertEquals(expectedAdjVertical, result.getAdjacentVolume().getVerticalInMeter(), 0.1);
    }
    
    @Test
    public void testEndToEndMultirotor_Parachute() {
        // Arrange
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(multirotorUAV)
                .lateralCV(parachuteLCV)
                .verticalCV(energyConversionVCV)
                .grb(parachuteGRB)
                .flightGeography(flightGeography)
                .build();
        
        // Act
        ResponseEntity<DroneOperationResult> response = droneOperationController.calculateOperation(request);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        DroneOperationResult result = response.getBody();
        assertNotNull(result);
        assertTrue(result.isSuccess());
        
        double expectedLateralExtension = multirotorUAV.getGpsInaccuracy() + 
                                         multirotorUAV.getPositionHoldingError() + 
                                         multirotorUAV.getMapError() + 
                                         (multirotorUAV.getMaxOperationalSpeed() * multirotorUAV.getResponseTime()) +
                                         (multirotorUAV.getMaxOperationalSpeed() * parachuteLCV.getTimeToOpenParachute());
        
        assertEquals(expectedLateralExtension, result.getLateralCV().getLateralExtension(), 0.1);
        
        assertEquals(parachuteLCV.getTimeToOpenParachute(), result.getVerticalCV().getTimeToOpenParachute());
        assertEquals(parachuteLCV.getTimeToOpenParachute(), result.getGrb().getTimeToOpenParachute());
        
        double expectedGRB = multirotorUAV.getMaxOperationalSpeed() * parachuteGRB.getTimeToOpenParachute() + 
                            parachuteGRB.getMaxPermissibleWindSpeed() * 
                            (result.getVerticalCV().getMinVerticalDimension() / parachuteGRB.getRateOfDescent());
        
        assertEquals(expectedGRB, result.getGrb().getMinLateralDimension(), 0.1);
    }
    
    @Test
    public void testEndToEndFixedWing_InvalidParachuteTermination() {
        // Arrange
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(fixedWingUAV)
                .lateralCV(turn180LCV)
                .verticalCV(circularPathVCV)
                .grb(ballisticGRB)
                .flightGeography(flightGeography)
                .build();
        
        // Act
        ResponseEntity<DroneOperationResult> response = droneOperationController.calculateOperation(request);
        
        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        DroneOperationResult result = response.getBody();
        assertNotNull(result);
        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessage().contains("Ballistic approach only allowed for multirotors and rotorcrafts"));
    }
    
    @Test
    public void testEndToEndMultirotor_InvalidManoeuvre() {
        // Arrange
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(multirotorUAV)
                .lateralCV(turn180LCV)
                .verticalCV(energyConversionVCV)
                .grb(ballisticGRB)
                .flightGeography(flightGeography)
                .build();
        
        // Act
        ResponseEntity<DroneOperationResult> response = droneOperationController.calculateOperation(request);
        
        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        DroneOperationResult result = response.getBody();
        assertNotNull(result);
        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessage().contains("TURN_180 manoeuvre not suitable for multirotors"));
    }
    
    @Test
    public void testEndToEndFixedWing_InvalidManoeuvre() {
        // Arrange
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(fixedWingUAV)
                .lateralCV(stoppingLCV)
                .verticalCV(circularPathVCV)
                .grb(glidingGRB)
                .flightGeography(flightGeography)
                .build();
        
        // Act
        ResponseEntity<DroneOperationResult> response = droneOperationController.calculateOperation(request);
        
        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        DroneOperationResult result = response.getBody();
        assertNotNull(result);
        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessage().contains("STOPPING manoeuvre not suitable for fixed-wing aircraft"));
    }
    
    @Test
    public void testEndToEndMultirotor_TooSmallFlightGeography() {
        // Arrange
        UAV largeUAV = new UAV(UAVType.MULTIROTOR, 10, 5, "barometric", 3, 3, 1, 1);
        FlightGeography smallFlightGeography = new FlightGeography(10, 10, 10);
        
        DroneOperationRequest request = new DroneOperationRequest.Builder()
                .uav(largeUAV)
                .lateralCV(stoppingLCV)
                .verticalCV(energyConversionVCV)
                .grb(ballisticGRB)
                .flightGeography(smallFlightGeography)
                .build();
        
        // Act
        ResponseEntity<DroneOperationResult> response = droneOperationController.calculateOperation(request);
        
        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        DroneOperationResult result = response.getBody();
        assertNotNull(result);
        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessage().contains("Flight geometry height must be at least 3×CD"));
    }
}