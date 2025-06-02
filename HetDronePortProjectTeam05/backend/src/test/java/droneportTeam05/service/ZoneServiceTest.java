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

import droneportTeam05.domain.zones.Point;
import droneportTeam05.domain.zones.Zone;
import droneportTeam05.repository.ZoneRepository;
import droneportTeam05.util.ServiceException;

@ExtendWith(MockitoExtension.class)
class ZoneServiceTest {

    @Mock
    private ZoneRepository zoneRepository;

    @InjectMocks
    private ZoneService zoneService;

    private Zone zone;
    private List<Point> path;

    @BeforeEach
    void setUp() {
        path = Arrays.asList(
            new Point(51.0, 4.0),
            new Point(51.1, 4.1),
            new Point(51.2, 4.2)
        );
        zone = new Zone("TestZone", path, 100.0);
    }

    @Test
    void getAllZones_ReturnsListOfZones() {
        List<Zone> expectedZones = Arrays.asList(zone);
        when(zoneRepository.findAll()).thenReturn(expectedZones);

        List<Zone> result = zoneService.getAllZones();

        assertEquals(1, result.size());
        assertEquals("TestZone", result.get(0).getName());
        verify(zoneRepository).findAll();
    }

    @Test
    void createZone_ReturnsSavedZone() {
        when(zoneRepository.save(zone)).thenReturn(zone);

        Zone result = zoneService.createZone(zone);

        assertEquals("TestZone", result.getName());
        assertEquals(3, result.getPath().size());
        verify(zoneRepository).save(zone);
    }

    @Test
    void updateZone_WhenZoneExists_ReturnsUpdatedZone() throws ServiceException {
        Zone updatedZone = new Zone("UpdatedZone", path, 100.0);
        
        when(zoneRepository.findByName("TestZone")).thenReturn(zone);
        when(zoneRepository.save(any(Zone.class))).thenReturn(zone);

        Zone result = zoneService.updateZone("TestZone", updatedZone);

        assertNotNull(result);
        verify(zoneRepository).findByName("TestZone");
        verify(zoneRepository).save(any(Zone.class));
    }

    @Test
    void updateZone_WhenZoneDoesNotExist_ThrowsServiceException() {
        when(zoneRepository.findByName("NonExistent")).thenReturn(null);

        ServiceException exception = assertThrows(ServiceException.class, 
            () -> zoneService.updateZone("NonExistent", zone));
        
        assertEquals("Zone", exception.getField());
        assertEquals("Zone does not exist", exception.getMessage());
    }

    @Test
    void deleteZone_WhenZoneExists_ReturnsSuccessMessage() throws ServiceException {
        when(zoneRepository.findByName("TestZone")).thenReturn(zone);

        String result = zoneService.deleteZone("TestZone");

        assertEquals("Zone deleted successfully", result);
        verify(zoneRepository).delete(zone);
    }

    @Test
    void deleteZone_WhenZoneDoesNotExist_ThrowsServiceException() {
        when(zoneRepository.findByName("NonExistent")).thenReturn(null);

        ServiceException exception = assertThrows(ServiceException.class, 
            () -> zoneService.deleteZone("NonExistent"));
        
        assertEquals("Zone", exception.getField());
        assertEquals("Zone does not exist", exception.getMessage());
    }
}