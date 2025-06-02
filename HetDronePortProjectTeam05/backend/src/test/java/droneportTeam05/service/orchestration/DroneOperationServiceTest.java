package droneportTeam05.service.orchestration;

import droneportTeam05.controllers.dto.DroneOperationRequest;
import droneportTeam05.controllers.dto.DroneOperationResult;
import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.geography.FlightGeography;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.AdjacentVolume;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import droneportTeam05.service.calculation.*;
import droneportTeam05.service.validation.DroneOperationValidationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DroneOperationServiceTest {

    @Mock
    private LateralContingencyVolumeService lateralCVService;
    
    @Mock
    private VerticalContingencyVolumeService verticalCVService;
    
    @Mock
    private GroundRiskBufferService grbService;
    
    @Mock
    private FlightGeographyService minFlightDimensionService;
    
    @Mock
    private AdjacentVolumeService adjacentVolumeService;
    
    @Mock
    private DroneOperationValidationService validationService;
    
    @InjectMocks
    private DroneOperationService droneOperationService;
    
    private DroneOperationRequest validRequest;
    private UAV uav;
    private LateralContingencyVolume lateralCV;
    private VerticalContingencyVolume verticalCV;
    private GroundRiskBuffer grb;
    private FlightGeography flightGeography;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        
        // Create test objects
        uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        lateralCV = LateralContingencyVolume.forStopping(45);
        verticalCV = VerticalContingencyVolume.forEnergyConversion();
        grb = GroundRiskBuffer.forBallistic();
        flightGeography = new FlightGeography(50, 10, 10);
        
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
        double flightHeight = flightGeography.getHeightFlightGeo();
        
        // Setup mocks
        LateralContingencyVolume calculatedLateralCV = lateralCV;
        calculatedLateralCV.setLateralExtension(20);
        
        VerticalContingencyVolume calculatedVerticalCV = verticalCV;
        calculatedVerticalCV.setMinVerticalDimension(60);
        
        GroundRiskBuffer calculatedGRB = grb;
        calculatedGRB.setMinLateralDimension(40);
        
        FlightGeography calculatedFlightGeography = new FlightGeography(50, 6, 6);
        
        AdjacentVolume adjacentVolume = new AdjacentVolume(1200, 210);
        
        when(lateralCVService.calculateLateralContingencyVolume(uav, lateralCV))
                .thenReturn(calculatedLateralCV);
        when(verticalCVService.calculateVerticalContingencyVolume(uav, verticalCV, flightHeight))
                .thenReturn(calculatedVerticalCV);
        when(grbService.calculateGroundRiskBuffer(uav, grb, calculatedVerticalCV))
                .thenReturn(calculatedGRB);
        when(minFlightDimensionService.calculateMinFlightDimensions(flightHeight, uav.getMaxCharacteristicDimension()))
                .thenReturn(calculatedFlightGeography);
        when(adjacentVolumeService.calculateAdjacentVolume(uav.getMaxOperationalSpeed(), calculatedVerticalCV.getMinVerticalDimension()))
                .thenReturn(adjacentVolume);
        
        // Act
        DroneOperationResult result = droneOperationService.calculateOperation(validRequest);
        
        // Assert
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(uav, result.getUav());
        assertEquals(calculatedLateralCV, result.getLateralCV());
        assertEquals(calculatedVerticalCV, result.getVerticalCV());
        assertEquals(calculatedGRB, result.getGrb());
        assertEquals(calculatedFlightGeography, result.getFlightGeography());
        assertEquals(adjacentVolume, result.getAdjacentVolume());
        
        verify(validationService).validateDroneOperation(validRequest);
        verify(lateralCVService).calculateLateralContingencyVolume(uav, lateralCV);
        verify(verticalCVService).calculateVerticalContingencyVolume(uav, verticalCV, flightHeight);
        verify(grbService).calculateGroundRiskBuffer(uav, grb, calculatedVerticalCV);
        verify(minFlightDimensionService).calculateMinFlightDimensions(flightHeight, uav.getMaxCharacteristicDimension());
        verify(adjacentVolumeService).calculateAdjacentVolume(uav.getMaxOperationalSpeed(), calculatedVerticalCV.getMinVerticalDimension());
    }
    
    @Test
    public void testCalculateOperation_ParachuteTimeSync() {
        // Arrange
        LateralContingencyVolume parachuteLateralCV = LateralContingencyVolume.forParachute(5);
        VerticalContingencyVolume energyVerticalCV = VerticalContingencyVolume.forEnergyConversion();
        
        DroneOperationRequest requestWithParachute = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(parachuteLateralCV)
                .verticalCV(energyVerticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
        
        when(lateralCVService.calculateLateralContingencyVolume(uav, parachuteLateralCV))
                .thenReturn(parachuteLateralCV);
        when(verticalCVService.calculateVerticalContingencyVolume(any(), any(), anyDouble()))
                .thenReturn(energyVerticalCV);
        when(grbService.calculateGroundRiskBuffer(any(), any(), any()))
                .thenReturn(grb);
        when(minFlightDimensionService.calculateMinFlightDimensions(anyDouble(), anyInt()))
                .thenReturn(flightGeography);
        when(adjacentVolumeService.calculateAdjacentVolume(anyInt(), anyDouble()))
                .thenReturn(new AdjacentVolume(1200, 200));
        
        // Act
        DroneOperationResult result = droneOperationService.calculateOperation(requestWithParachute);
        
        // Assert
        assertNotNull(result);
        assertEquals(5, energyVerticalCV.getTimeToOpenParachute());
        assertEquals(5, grb.getTimeToOpenParachute());
    }
    
    @Test
    public void testCalculateOperation_VerticalParachuteTimeSync() {
        // Arrange
        LateralContingencyVolume stoppingLateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume parachuteVerticalCV = VerticalContingencyVolume.forParachute(5);
        
        DroneOperationRequest requestWithParachute = new DroneOperationRequest.Builder()
                .uav(uav)
                .lateralCV(stoppingLateralCV)
                .verticalCV(parachuteVerticalCV)
                .grb(grb)
                .flightGeography(flightGeography)
                .build();
        
        when(lateralCVService.calculateLateralContingencyVolume(uav, stoppingLateralCV))
                .thenReturn(stoppingLateralCV);
        when(verticalCVService.calculateVerticalContingencyVolume(any(), any(), anyDouble()))
                .thenReturn(parachuteVerticalCV);
        when(grbService.calculateGroundRiskBuffer(any(), any(), any()))
                .thenReturn(grb);
        when(minFlightDimensionService.calculateMinFlightDimensions(anyDouble(), anyInt()))
                .thenReturn(flightGeography);
        when(adjacentVolumeService.calculateAdjacentVolume(anyInt(), anyDouble()))
                .thenReturn(new AdjacentVolume(1200, 200));
        
        // Act
        DroneOperationResult result = droneOperationService.calculateOperation(requestWithParachute);
        
        // Assert
        assertNotNull(result);
        assertEquals(5, grb.getTimeToOpenParachute());
    }
}