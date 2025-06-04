package droneportTeam05.service;

import droneportTeam05.domain.Drone;
import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import droneportTeam05.repository.DroneRepository;
import droneportTeam05.util.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DroneServiceTest {

    @Mock
    private DroneRepository droneRepository;

    @InjectMocks
    private DroneService droneService;

    private Drone testDrone;
    private UAV testUAV;
    private LateralContingencyVolume testLateralCV;
    private VerticalContingencyVolume testVerticalCV;
    private GroundRiskBuffer testGRB;

    @BeforeEach
    public void setUp() {
        testUAV = new UAV(UAVType.MULTIROTOR, 15.0, 2.5, "barometric", 3, 3, 1, 1.5);
        testLateralCV = LateralContingencyVolume.forStopping(45);
        testVerticalCV = VerticalContingencyVolume.forEnergyConversion();
        testGRB = GroundRiskBuffer.forBallistic();
        
        testDrone = new Drone("TestDrone", testUAV, testLateralCV, testVerticalCV, testGRB);
    }

    @Test
    public void testGetAllDrones() {
        
        Drone drone1 = new Drone("Drone1", testUAV, testLateralCV, testVerticalCV, testGRB);
        Drone drone2 = new Drone("Drone2", testUAV, testLateralCV, testVerticalCV, testGRB);
        List<Drone> expectedDrones = Arrays.asList(drone1, drone2);
        
        when(droneRepository.findAll()).thenReturn(expectedDrones);

        
        List<Drone> actualDrones = droneService.getAllDrones();

        
        assertEquals(2, actualDrones.size());
        assertEquals(expectedDrones, actualDrones);
        verify(droneRepository, times(1)).findAll();
    }

    @Test
    public void testCreateDrone() {
        
        when(droneRepository.save(any(Drone.class))).thenReturn(testDrone);

        
        Drone createdDrone = droneService.createDrone(testDrone);

        
        assertNotNull(createdDrone);
        assertEquals(testDrone.getName(), createdDrone.getName());
        assertEquals(testDrone.getUav().getType(), createdDrone.getUav().getType());
        verify(droneRepository, times(1)).save(testDrone);
    }

    @Test
    public void testUpdateDrone_Success() throws ServiceException {
        
        String originalName = "OriginalDrone";
        Drone existingDrone = new Drone(originalName, testUAV, testLateralCV, testVerticalCV, testGRB);
        
        
        existingDrone.getUav().setId(1L);
        existingDrone.getLateralContingencyVolume().setId(2L);
        existingDrone.getVerticalContingencyVolume().setId(3L);
        existingDrone.getGroundRiskBuffer().setId(4L);
        
        UAV updatedUAV = new UAV(UAVType.FIXEDWING, 25.0, 3.0, "GPS-based", 4, 4, 2, 2.0);
        LateralContingencyVolume updatedLateralCV = LateralContingencyVolume.forTurn180(30);
        VerticalContingencyVolume updatedVerticalCV = VerticalContingencyVolume.forCircularPath();
        GroundRiskBuffer updatedGRB = GroundRiskBuffer.forGliding(15.0);
        
        Drone updatedDrone = new Drone("UpdatedDrone", updatedUAV, updatedLateralCV, updatedVerticalCV, updatedGRB);
        
        when(droneRepository.findByName(originalName)).thenReturn(existingDrone);
        when(droneRepository.save(any(Drone.class))).thenReturn(updatedDrone);

        
        Drone result = droneService.updateDrone(originalName, updatedDrone);

        
        assertNotNull(result);
        assertEquals(updatedDrone.getName(), result.getName());
        verify(droneRepository, times(1)).findByName(originalName);
        verify(droneRepository, times(1)).save(any(Drone.class));
    }

    @Test
    public void testUpdateDrone_DroneNotFound() {
        
        String nonExistentName = "NonExistentDrone";
        Drone updatedDrone = new Drone("UpdatedDrone", testUAV, testLateralCV, testVerticalCV, testGRB);
        
        when(droneRepository.findByName(nonExistentName)).thenReturn(null);

        
        ServiceException exception = assertThrows(ServiceException.class, () -> {
            droneService.updateDrone(nonExistentName, updatedDrone);
        });
        
        assertEquals("Drone", exception.getField());
        assertEquals("Drone does not exist", exception.getMessage());
        verify(droneRepository, times(1)).findByName(nonExistentName);
        verify(droneRepository, never()).save(any(Drone.class));
    }

    @Test
    public void testUpdateDrone_PreservesEntityIds() throws ServiceException {
        
        String droneName = "ExistingDrone";
        Drone existingDrone = new Drone(droneName, testUAV, testLateralCV, testVerticalCV, testGRB);
        
        
        existingDrone.getUav().setId(10L);
        existingDrone.getLateralContingencyVolume().setId(20L);
        existingDrone.getVerticalContingencyVolume().setId(30L);
        existingDrone.getGroundRiskBuffer().setId(40L);
        
        
        UAV newUAV = new UAV(UAVType.FIXEDWING, 30.0, 4.0, "GPS-based", 5, 5, 3, 3.0);
        LateralContingencyVolume newLateralCV = LateralContingencyVolume.forTurn180(25);
        VerticalContingencyVolume newVerticalCV = VerticalContingencyVolume.forCircularPath();
        GroundRiskBuffer newGRB = GroundRiskBuffer.forGliding(20.0);
        
        Drone updatedDrone = new Drone("UpdatedName", newUAV, newLateralCV, newVerticalCV, newGRB);
        
        when(droneRepository.findByName(droneName)).thenReturn(existingDrone);
        when(droneRepository.save(any(Drone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        
        Drone result = droneService.updateDrone(droneName, updatedDrone);

        
        verify(droneRepository, times(1)).save(argThat(drone -> {
            return result.getUav().getId().equals(10L) &&
                   result.getLateralContingencyVolume().getId().equals(20L) &&
                   result.getVerticalContingencyVolume().getId().equals(30L) &&
                   result.getGroundRiskBuffer().getId().equals(40L);
        }));
    }

    @Test
    public void testDeleteDrone_Success() throws ServiceException {
        
        String droneName = "DroneToDelete";
        Drone existingDrone = new Drone(droneName, testUAV, testLateralCV, testVerticalCV, testGRB);
        
        when(droneRepository.findByName(droneName)).thenReturn(existingDrone);
        doNothing().when(droneRepository).delete(existingDrone);

        
        String result = droneService.deleteDrone(droneName);

        
        assertEquals("Drone deleted successfully", result);
        verify(droneRepository, times(1)).findByName(droneName);
        verify(droneRepository, times(1)).delete(existingDrone);
    }

    @Test
    public void testDeleteDrone_DroneNotFound() {
        
        String nonExistentName = "NonExistentDrone";
        
        when(droneRepository.findByName(nonExistentName)).thenReturn(null);

        
        ServiceException exception = assertThrows(ServiceException.class, () -> {
            droneService.deleteDrone(nonExistentName);
        });
        
        assertEquals("Drone", exception.getField());
        assertEquals("Drone does not exist", exception.getMessage());
        verify(droneRepository, times(1)).findByName(nonExistentName);
        verify(droneRepository, never()).delete(any(Drone.class));
    }

    @Test
    public void testUpdateDrone_WithNullComponents() throws ServiceException {
        
        String droneName = "ExistingDrone";
        Drone existingDrone = new Drone(droneName, testUAV, testLateralCV, testVerticalCV, testGRB);
        
        existingDrone.getUav().setId(1L);
        existingDrone.getLateralContingencyVolume().setId(2L);
        existingDrone.getVerticalContingencyVolume().setId(3L);
        existingDrone.getGroundRiskBuffer().setId(4L);
        
        
        Drone updatedDrone = new Drone("UpdatedName", null, null, null, null);
        
        when(droneRepository.findByName(droneName)).thenReturn(existingDrone);
        when(droneRepository.save(any(Drone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        
        Drone result = droneService.updateDrone(droneName, updatedDrone);

        
        verify(droneRepository, times(1)).save(argThat(drone -> {
            
            return drone.getUav() != null &&
                   drone.getLateralContingencyVolume() != null &&
                   drone.getVerticalContingencyVolume() != null &&
                   drone.getGroundRiskBuffer() != null &&
                   drone.getName().equals("UpdatedName");
        }));
    }

    @Test
    public void testCreateDroneWithComplexConfiguration() {
        
        UAV complexUAV = new UAV(UAVType.ROTORCRAFT, 18.0, 3.5, "GPS-based", 5, 4, 2, 2.5);
        LateralContingencyVolume parachuteLCV = LateralContingencyVolume.forParachute(5.0);
        VerticalContingencyVolume parachuteVCV = VerticalContingencyVolume.forParachute(5);
        GroundRiskBuffer parachuteGRB = GroundRiskBuffer.forParachute(5.0, 10.0, 4.0);
        
        Drone complexDrone = new Drone("ComplexDrone", complexUAV, parachuteLCV, parachuteVCV, parachuteGRB);
        
        when(droneRepository.save(any(Drone.class))).thenReturn(complexDrone);

        
        Drone createdDrone = droneService.createDrone(complexDrone);

        
        assertNotNull(createdDrone);
        assertEquals(UAVType.ROTORCRAFT, createdDrone.getUav().getType());
        assertEquals(5.0, createdDrone.getLateralContingencyVolume().getTimeToOpenParachute());
        assertEquals(5, createdDrone.getVerticalContingencyVolume().getTimeToOpenParachute());
        assertEquals(5.0, createdDrone.getGroundRiskBuffer().getTimeToOpenParachute());
        verify(droneRepository, times(1)).save(complexDrone);
    }

    @Test
    public void testUpdateDronePartialUpdate() throws ServiceException {
        
        String droneName = "PartialUpdateDrone";
        Drone existingDrone = new Drone(droneName, testUAV, testLateralCV, testVerticalCV, testGRB);
        
        existingDrone.getUav().setId(1L);
        existingDrone.getLateralContingencyVolume().setId(2L);
        existingDrone.getVerticalContingencyVolume().setId(3L);
        existingDrone.getGroundRiskBuffer().setId(4L);
        
        
        Drone partialUpdate = new Drone("NewName", testUAV, testLateralCV, testVerticalCV, testGRB);
        
        when(droneRepository.findByName(droneName)).thenReturn(existingDrone);
        when(droneRepository.save(any(Drone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        
        Drone result = droneService.updateDrone(droneName, partialUpdate);

        
        verify(droneRepository, times(1)).save(argThat(drone -> {
            return drone.getName().equals("NewName") &&
                   drone.getUav().getId().equals(1L) && 
                   drone.getUav().getType() == UAVType.MULTIROTOR; 
        }));
    }

    @Test
    public void testRepositoryInteractionPatterns() {
        

        
        List<Drone> mockDrones = Arrays.asList(testDrone);
        when(droneRepository.findAll()).thenReturn(mockDrones);
        
        List<Drone> result = droneService.getAllDrones();
        
        assertEquals(mockDrones, result);
        verify(droneRepository, times(1)).findAll();
        verifyNoMoreInteractions(droneRepository);
    }

    @Test
    public void testCreateDroneWithDifferentUAVTypes() {
        
        
        
        UAV multirotorUAV = new UAV(UAVType.MULTIROTOR, 12.0, 2.0, "barometric", 3, 3, 1, 1.0);
        Drone multirotorDrone = new Drone("Multirotor", multirotorUAV, testLateralCV, testVerticalCV, testGRB);
        
        
        UAV fixedWingUAV = new UAV(UAVType.FIXEDWING, 30.0, 4.0, "GPS-based", 4, 4, 2, 2.0);
        LateralContingencyVolume turn180LCV = LateralContingencyVolume.forTurn180(25);
        VerticalContingencyVolume circularVCV = VerticalContingencyVolume.forCircularPath();
        GroundRiskBuffer glidingGRB = GroundRiskBuffer.forGliding(18.0);
        Drone fixedWingDrone = new Drone("FixedWing", fixedWingUAV, turn180LCV, circularVCV, glidingGRB);
        
        
        UAV rotorcraftUAV = new UAV(UAVType.ROTORCRAFT, 20.0, 3.0, "barometric", 3, 3, 1, 1.5);
        Drone rotorcraftDrone = new Drone("Rotorcraft", rotorcraftUAV, testLateralCV, testVerticalCV, testGRB);

        when(droneRepository.save(any(Drone.class)))
                .thenReturn(multirotorDrone)
                .thenReturn(fixedWingDrone)
                .thenReturn(rotorcraftDrone);

        
        Drone createdMultirotor = droneService.createDrone(multirotorDrone);
        assertEquals(UAVType.MULTIROTOR, createdMultirotor.getUav().getType());
        
        Drone createdFixedWing = droneService.createDrone(fixedWingDrone);
        assertEquals(UAVType.FIXEDWING, createdFixedWing.getUav().getType());
        
        Drone createdRotorcraft = droneService.createDrone(rotorcraftDrone);
        assertEquals(UAVType.ROTORCRAFT, createdRotorcraft.getUav().getType());
        
        verify(droneRepository, times(3)).save(any(Drone.class));
    }
}