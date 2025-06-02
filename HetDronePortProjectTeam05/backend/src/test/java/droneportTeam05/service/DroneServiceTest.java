package droneportTeam05.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import droneportTeam05.domain.Drone;
import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import droneportTeam05.repository.DroneRepository;
import droneportTeam05.util.ServiceException;

@ExtendWith(MockitoExtension.class)
class DroneServiceTest {

    @Mock
    private DroneRepository droneRepository;

    @InjectMocks
    private DroneService droneService;

    private Drone drone;
    private UAV uav;
    private LateralContingencyVolume lateralVolume;
    private VerticalContingencyVolume verticalVolume;
    private GroundRiskBuffer groundRisk;

    @BeforeEach
    void setUp() {
        uav = new UAV();
        uav.setId(1L);
        
        lateralVolume = new LateralContingencyVolume();
        lateralVolume.setId(1L);
        
        verticalVolume = new VerticalContingencyVolume();
        verticalVolume.setId(1L);
        
        groundRisk = new GroundRiskBuffer();
        groundRisk.setId(1L);
        
        drone = new Drone("TestDrone", uav, lateralVolume, verticalVolume, groundRisk, 100.0);
    }

    @Test
    void getAllDrones_ReturnsListOfDrones() {
        List<Drone> expectedDrones = Arrays.asList(drone);
        when(droneRepository.findAll()).thenReturn(expectedDrones);

        List<Drone> result = droneService.getAllDrones();

        assertEquals(1, result.size());
        assertEquals("TestDrone", result.get(0).getName());
        verify(droneRepository).findAll();
    }

    @Test
    void createDrone_ReturnsSavedDrone() {
        when(droneRepository.save(drone)).thenReturn(drone);

        Drone result = droneService.createDrone(drone);

        assertEquals("TestDrone", result.getName());
        verify(droneRepository).save(drone);
    }

    @Test
    void updateDrone_WhenDroneExists_ReturnsUpdatedDrone() throws ServiceException {
        Drone updatedDrone = new Drone("UpdatedDrone", uav, lateralVolume, verticalVolume, groundRisk, 150.0);
        
        when(droneRepository.findByName("TestDrone")).thenReturn(drone);
        when(droneRepository.save(any(Drone.class))).thenReturn(drone);

        Drone result = droneService.updateDrone("TestDrone", updatedDrone);

        assertNotNull(result);
        verify(droneRepository).findByName("TestDrone");
        verify(droneRepository).save(any(Drone.class));
    }

    @Test
    void updateDrone_WhenDroneDoesNotExist_ThrowsServiceException() {
        when(droneRepository.findByName("NonExistent")).thenReturn(null);

        ServiceException exception = assertThrows(ServiceException.class, 
            () -> droneService.updateDrone("NonExistent", drone));
        
        assertEquals("Drone", exception.getField());
        assertEquals("Drone does not exist", exception.getMessage());
    }

    @Test
    void deleteDrone_WhenDroneExists_ReturnsSuccessMessage() throws ServiceException {
        when(droneRepository.findByName("TestDrone")).thenReturn(drone);

        String result = droneService.deleteDrone("TestDrone");

        assertEquals("Drone deleted successfully", result);
        verify(droneRepository).delete(drone);
    }

    @Test
    void deleteDrone_WhenDroneDoesNotExist_ThrowsServiceException() {
        when(droneRepository.findByName("NonExistent")).thenReturn(null);

        ServiceException exception = assertThrows(ServiceException.class, 
            () -> droneService.deleteDrone("NonExistent"));
        
        assertEquals("Drone", exception.getField());
        assertEquals("Drone does not exist", exception.getMessage());
    }
}