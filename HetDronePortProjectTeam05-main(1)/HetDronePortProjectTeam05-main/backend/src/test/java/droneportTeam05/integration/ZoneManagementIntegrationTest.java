package droneportTeam05.integration;

import droneportTeam05.controllers.ZoneController;
import droneportTeam05.domain.zones.Point;
import droneportTeam05.domain.zones.Zone;
import droneportTeam05.repository.ZoneRepository;
import droneportTeam05.service.ZoneService;
import droneportTeam05.util.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ZoneManagementIntegrationTest {

    @Autowired
    private ZoneController zoneController;

    @Autowired
    private ZoneService zoneService;

    @Autowired
    private ZoneRepository zoneRepository;

    private Zone testZone1;
    private Zone testZone2;
    private Zone testZone3;

    @BeforeEach
    public void setUp() {
        
        zoneRepository.deleteAll();

        
        testZone1 = createTestZone("TestZone1", createTestPath1(), 100.0);
        testZone2 = createTestZone("TestZone2", createTestPath2(), 150.0);
        testZone3 = createTestZone("TestZone3", createTestPath3(), 200.0);
    }

    private Zone createTestZone(String name, List<Point> path, double maxHeight) {
        Zone zone = new Zone();
        zone.setName(name);
        zone.setPath(new ArrayList<>(path)); 
        zone.setMaxHeight(maxHeight);
        return zone;
    }

    private List<Point> createTestPath1() {
        return Arrays.asList(
                new Point(50.8, 5.15),
                new Point(50.81, 5.19),
                new Point(50.78, 5.26),
                new Point(50.73, 5.26)
        );
    }

    private List<Point> createTestPath2() {
        return Arrays.asList(
                new Point(51.0, 5.0),
                new Point(51.1, 5.1),
                new Point(51.0, 5.2),
                new Point(50.9, 5.1)
        );
    }

    private List<Point> createTestPath3() {
        return Arrays.asList(
                new Point(52.0, 6.0),
                new Point(52.1, 6.1),
                new Point(52.0, 6.2),
                new Point(51.9, 6.1)
        );
    }

    @Test
    public void testCreateZone_Success() {
        
        Zone createdZone = zoneController.createZone(testZone1);

        
        assertNotNull(createdZone);
        assertEquals(testZone1.getName(), createdZone.getName());
        assertEquals(testZone1.getMaxHeight(), createdZone.getMaxHeight());
        assertEquals(testZone1.getPath().size(), createdZone.getPath().size());
        
        
        Zone retrievedZone = zoneRepository.findByName(testZone1.getName());
        assertNotNull(retrievedZone);
        assertEquals(testZone1.getName(), retrievedZone.getName());
    }

    @Test
    public void testGetAllZones() {
        
        zoneRepository.save(testZone1);
        zoneRepository.save(testZone2);
        zoneRepository.save(testZone3);

        
        List<Zone> zones = zoneController.getAllZones();

        
        assertEquals(3, zones.size());
        assertTrue(zones.stream().anyMatch(z -> z.getName().equals("TestZone1")));
        assertTrue(zones.stream().anyMatch(z -> z.getName().equals("TestZone2")));
        assertTrue(zones.stream().anyMatch(z -> z.getName().equals("TestZone3")));
    }

    @Test
    public void testGetZonesGreaterThanMaxHeight() {
        
        zoneRepository.save(testZone1); 
        zoneRepository.save(testZone2); 
        zoneRepository.save(testZone3); 

        
        List<Zone> zones = zoneController.getZonesGreaterThanMaxHeight(125.0);

        
        assertEquals(2, zones.size());
        assertTrue(zones.stream().anyMatch(z -> z.getName().equals("TestZone2")));
        assertTrue(zones.stream().anyMatch(z -> z.getName().equals("TestZone3")));
        assertFalse(zones.stream().anyMatch(z -> z.getName().equals("TestZone1")));
    }

    @Test
    public void testUpdateZone_Success() throws ServiceException {
        
        Zone savedZone = zoneRepository.save(testZone1);
        
        Zone updatedZone = new Zone();
        updatedZone.setName("UpdatedTestZone1");
        updatedZone.setMaxHeight(175.0);
        updatedZone.setPath(new ArrayList<>(createTestPath2()));

        
        Zone result = zoneController.updateZone(savedZone.getName(), updatedZone);

        
        assertNotNull(result);
        assertEquals("UpdatedTestZone1", result.getName());
        assertEquals(175.0, result.getMaxHeight());
        assertEquals(createTestPath2().size(), result.getPath().size());

        
        Zone retrievedZone = zoneRepository.findByName("UpdatedTestZone1");
        assertNotNull(retrievedZone);
        assertEquals("UpdatedTestZone1", retrievedZone.getName());
        assertEquals(175.0, retrievedZone.getMaxHeight());
    }

    @Test
    public void testUpdateZone_NotFound() {
        
        Zone updatedZone = new Zone();
        updatedZone.setName("UpdatedZone");
        updatedZone.setMaxHeight(175.0);
        updatedZone.setPath(new ArrayList<>(createTestPath1()));

        
        assertThrows(ServiceException.class, () -> {
            zoneController.updateZone("NonExistentZone", updatedZone);
        });
    }

    @Test
    public void testDeleteZone_Success() throws ServiceException {
        
        Zone savedZone = zoneRepository.save(testZone1);
        
        
        String result = zoneController.deleteZone(savedZone.getName());

        
        assertEquals("Zone deleted successfully", result);
        
        
        Zone retrievedZone = zoneRepository.findByName(savedZone.getName());
        assertNull(retrievedZone);
    }

    @Test
    public void testDeleteZone_NotFound() {
        
        assertThrows(ServiceException.class, () -> {
            zoneController.deleteZone("NonExistentZone");
        });
    }

    @Test
    public void testComplexZoneOperations() throws ServiceException {
        
        Zone createdZone = zoneController.createZone(testZone1);
        assertNotNull(createdZone);

        
        List<Zone> allZones = zoneController.getAllZones();
        assertEquals(1, allZones.size());

        
        Zone updatedZone = new Zone();
        updatedZone.setName("ModifiedZone");
        updatedZone.setMaxHeight(250.0);
        updatedZone.setPath(new ArrayList<>(createTestPath3()));
        
        Zone result = zoneController.updateZone(createdZone.getName(), updatedZone);
        assertEquals("ModifiedZone", result.getName());
        assertEquals(250.0, result.getMaxHeight());

        
        List<Zone> highZones = zoneController.getZonesGreaterThanMaxHeight(200.0);
        assertEquals(1, highZones.size());
        assertEquals("ModifiedZone", highZones.get(0).getName());

        List<Zone> lowZones = zoneController.getZonesGreaterThanMaxHeight(300.0);
        assertEquals(0, lowZones.size());

        
        String deleteResult = zoneController.deleteZone("ModifiedZone");
        assertEquals("Zone deleted successfully", deleteResult);

        
        List<Zone> finalZones = zoneController.getAllZones();
        assertEquals(0, finalZones.size());
    }

    @Test
    public void testZoneWithMinimalPoints() {
        
        List<Point> minimalPath = Arrays.asList(
                new Point(50.0, 5.0),
                new Point(50.1, 5.0),
                new Point(50.05, 5.1)
        );
        Zone minimalZone = createTestZone("MinimalZone", minimalPath, 100.0);

        
        Zone createdZone = zoneController.createZone(minimalZone);

        
        assertNotNull(createdZone);
        assertEquals(3, createdZone.getPath().size());
        assertEquals("MinimalZone", createdZone.getName());
    }

    @Test
    public void testZoneWithManyPoints() {
        
        List<Point> complexPath = Arrays.asList(
                new Point(50.0, 5.0),
                new Point(50.1, 5.0),
                new Point(50.2, 5.1),
                new Point(50.3, 5.2),
                new Point(50.4, 5.3),
                new Point(50.4, 5.4),
                new Point(50.3, 5.5),
                new Point(50.2, 5.6),
                new Point(50.1, 5.5),
                new Point(50.0, 5.4)
        );
        Zone complexZone = createTestZone("ComplexZone", complexPath, 180.0);

        
        Zone createdZone = zoneController.createZone(complexZone);

        
        assertNotNull(createdZone);
        assertEquals(10, createdZone.getPath().size());
        assertEquals("ComplexZone", createdZone.getName());
        assertEquals(180.0, createdZone.getMaxHeight());
    }

    @Test
    public void testMultipleZonesBoundaryConditions() {
        
        zoneRepository.save(testZone1); 
        zoneRepository.save(testZone2); 
        zoneRepository.save(testZone3); 

        
        List<Zone> zones100 = zoneController.getZonesGreaterThanMaxHeight(100.0);
        assertEquals(2, zones100.size()); 

        List<Zone> zones150 = zoneController.getZonesGreaterThanMaxHeight(150.0);
        assertEquals(1, zones150.size()); 
        assertEquals("TestZone3", zones150.get(0).getName());

        List<Zone> zones200 = zoneController.getZonesGreaterThanMaxHeight(200.0);
        assertEquals(0, zones200.size()); 

        List<Zone> zones50 = zoneController.getZonesGreaterThanMaxHeight(50.0);
        assertEquals(3, zones50.size()); 
    }
}