package droneportTeam05.integration;

import droneportTeam05.controllers.DroneController;
import droneportTeam05.domain.Drone;
import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import droneportTeam05.repository.DroneRepository;
import droneportTeam05.service.DroneService;
import droneportTeam05.util.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class DroneManagementIntegrationTest {

    @Autowired
    private DroneController droneController;

    @Autowired
    private DroneService droneService;

    @Autowired
    private DroneRepository droneRepository;

    private Drone testDrone1;
    private Drone testDrone2;
    private Drone testDrone3;

    @BeforeEach
    public void setUp() {
        
        droneRepository.deleteAll();

        
        testDrone1 = createMultirotorDrone("TestDrone1");
        testDrone2 = createFixedWingDrone("TestDrone2");
        testDrone3 = createRotorcraftDrone("TestDrone3");
    }

    private Drone createMultirotorDrone(String name) {
        UAV uav = new UAV(UAVType.MULTIROTOR, 15.0, 2.5, "barometric", 3, 3, 1, 1.5);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(45);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        
        return new Drone(name, uav, lateralCV, verticalCV, grb);
    }

    private Drone createFixedWingDrone(String name) {
        UAV uav = new UAV(UAVType.FIXEDWING, 25.0, 3.0, "GPS-based", 4, 4, 2, 2.0);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forTurn180(30);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forCircularPath();
        GroundRiskBuffer grb = GroundRiskBuffer.forGliding(15.0);
        
        return new Drone(name, uav, lateralCV, verticalCV, grb);
    }

    private Drone createRotorcraftDrone(String name) {
        UAV uav = new UAV(UAVType.ROTORCRAFT, 20.0, 4.0, "barometric", 3, 3, 1, 1.0);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forParachute(5.0);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forParachute(5);
        GroundRiskBuffer grb = GroundRiskBuffer.forParachute(5.0, 8.0, 4.0);
        
        return new Drone(name, uav, lateralCV, verticalCV, grb);
    }

    @Test
    public void testCreateDrone_Multirotor_Success() {
        
        Drone createdDrone = droneController.createDrone(testDrone1);

        
        assertNotNull(createdDrone);
        assertEquals(testDrone1.getName(), createdDrone.getName());
        assertEquals(UAVType.MULTIROTOR, createdDrone.getUav().getType());
        
        
        Drone retrievedDrone = droneRepository.findByName(testDrone1.getName());
        assertNotNull(retrievedDrone);
        assertEquals(testDrone1.getName(), retrievedDrone.getName());
    }

    @Test
    public void testCreateDrone_FixedWing_Success() {
        
        Drone createdDrone = droneController.createDrone(testDrone2);

        
        assertNotNull(createdDrone);
        assertEquals(testDrone2.getName(), createdDrone.getName());
        assertEquals(UAVType.FIXEDWING, createdDrone.getUav().getType());
        assertEquals(25.0, createdDrone.getUav().getMaxOperationalSpeed());
    }

    @Test
    public void testCreateDrone_Rotorcraft_Success() {
        
        Drone createdDrone = droneController.createDrone(testDrone3);

        
        assertNotNull(createdDrone);
        assertEquals(testDrone3.getName(), createdDrone.getName());
        assertEquals(UAVType.ROTORCRAFT, createdDrone.getUav().getType());
        assertEquals(5.0, createdDrone.getLateralContingencyVolume().getTimeToOpenParachute());
        assertEquals(5, createdDrone.getVerticalContingencyVolume().getTimeToOpenParachute());
    }

    @Test
    public void testGetAllDrones() {
        
        droneRepository.save(testDrone1);
        droneRepository.save(testDrone2);
        droneRepository.save(testDrone3);

        
        List<Drone> drones = droneController.getAllDrones();

        
        assertEquals(3, drones.size());
        assertTrue(drones.stream().anyMatch(d -> d.getName().equals("TestDrone1")));
        assertTrue(drones.stream().anyMatch(d -> d.getName().equals("TestDrone2")));
        assertTrue(drones.stream().anyMatch(d -> d.getName().equals("TestDrone3")));
    }

    @Test
    public void testUpdateDrone_Success() throws ServiceException {
        
        Drone savedDrone = droneRepository.save(testDrone1);
        
        
        Drone updatedDrone = createMultirotorDrone("UpdatedTestDrone1");
        updatedDrone.getUav().setMaxOperationalSpeed(18.0);

        
        Drone result = droneController.updateDrone(savedDrone.getName(), updatedDrone);

        
        assertNotNull(result);
        assertEquals("UpdatedTestDrone1", result.getName());
        assertEquals(18.0, result.getUav().getMaxOperationalSpeed());

        
        Drone retrievedDrone = droneRepository.findByName("UpdatedTestDrone1");
        assertNotNull(retrievedDrone);
    }

    @Test
    public void testUpdateDrone_NotFound() {
        
        Drone updatedDrone = createMultirotorDrone("NonExistentDrone");

        
        assertThrows(ServiceException.class, () -> {
            droneController.updateDrone("NonExistentDrone", updatedDrone);
        });
    }

    @Test
    public void testDeleteDrone_Success() throws ServiceException {
        
        Drone savedDrone = droneRepository.save(testDrone1);
        
        
        String result = droneController.deleteDrone(savedDrone.getName());

        
        assertEquals("Drone deleted successfully", result);
        
        
        Drone retrievedDrone = droneRepository.findByName(savedDrone.getName());
        assertNull(retrievedDrone);
    }

    @Test
    public void testDeleteDrone_NotFound() {
        
        assertThrows(ServiceException.class, () -> {
            droneController.deleteDrone("NonExistentDrone");
        });
    }

    @Test
    public void testComplexDroneOperations() throws ServiceException {
        
        Drone createdDrone = droneController.createDrone(testDrone1);
        assertNotNull(createdDrone);

        
        List<Drone> allDrones = droneController.getAllDrones();
        assertEquals(1, allDrones.size());

        
        Drone updatedDrone = createFixedWingDrone("ModifiedDrone");
        
        Drone result = droneController.updateDrone(createdDrone.getName(), updatedDrone);
        assertEquals("ModifiedDrone", result.getName());
        assertEquals(UAVType.FIXEDWING, result.getUav().getType());

        
        Drone retrievedDrone = droneRepository.findByName("ModifiedDrone");
        assertNotNull(retrievedDrone);
        assertEquals(UAVType.FIXEDWING, retrievedDrone.getUav().getType());

        
        String deleteResult = droneController.deleteDrone("ModifiedDrone");
        assertEquals("Drone deleted successfully", deleteResult);

        
        List<Drone> finalDrones = droneController.getAllDrones();
        assertEquals(0, finalDrones.size());
    }

    @Test
    public void testDroneWithParachuteConfiguration() {
        
        Drone parachuteDrone = testDrone3; 
        
        Drone createdDrone = droneController.createDrone(parachuteDrone);
        
        assertNotNull(createdDrone);
        assertEquals(5.0, createdDrone.getLateralContingencyVolume().getTimeToOpenParachute());
        assertEquals(5, createdDrone.getVerticalContingencyVolume().getTimeToOpenParachute());
        assertEquals(5.0, createdDrone.getGroundRiskBuffer().getTimeToOpenParachute());
        assertEquals(8.0, createdDrone.getGroundRiskBuffer().getMaxPermissibleWindSpeed());
        assertEquals(4.0, createdDrone.getGroundRiskBuffer().getRateOfDescent());
    }

    @Test
    public void testDroneWithAdvancedUAVConfiguration() {
        
        UAV advancedUAV = new UAV(UAVType.MULTIROTOR, 12.0, 1.8, "GPS-based", 5, 5, 2, 2.5);
        LateralContingencyVolume lateralCV = LateralContingencyVolume.forStopping(30);
        VerticalContingencyVolume verticalCV = VerticalContingencyVolume.forEnergyConversion();
        GroundRiskBuffer grb = GroundRiskBuffer.forSimplified();
        
        Drone advancedDrone = new Drone("AdvancedDrone", advancedUAV, lateralCV, verticalCV, grb);
        
        Drone createdDrone = droneController.createDrone(advancedDrone);
        
        assertNotNull(createdDrone);
        assertEquals("GPS-based", createdDrone.getUav().getAltitudeMeasurementErrorType());
        assertEquals(4, createdDrone.getUav().getAltitudeMeasurementError()); 
        assertEquals(5, createdDrone.getUav().getGpsInaccuracy());
        assertEquals(5, createdDrone.getUav().getPositionHoldingError());
        assertEquals(2, createdDrone.getUav().getMapError());
        assertEquals(2.5, createdDrone.getUav().getResponseTime());
    }

    @Test
    public void testUpdateDronePartialChanges() throws ServiceException {
        
        Drone savedDrone = droneRepository.save(testDrone1);
        
        
        Drone partialUpdate = createMultirotorDrone(savedDrone.getName());
        partialUpdate.getUav().setMaxOperationalSpeed(22.0);
        partialUpdate.getLateralContingencyVolume().setPitchAngle(60);

        
        Drone result = droneController.updateDrone(savedDrone.getName(), partialUpdate);

        
        assertEquals(22.0, result.getUav().getMaxOperationalSpeed());
        assertEquals(60, result.getLateralContingencyVolume().getPitchAngle());
        
        
        assertEquals(UAVType.MULTIROTOR, result.getUav().getType());
        assertEquals("barometric", result.getUav().getAltitudeMeasurementErrorType());
    }

    @Test
    public void testMultipleDronesOfDifferentTypes() {
        
        Drone multirotor = droneController.createDrone(testDrone1);
        Drone fixedWing = droneController.createDrone(testDrone2);
        Drone rotorcraft = droneController.createDrone(testDrone3);

        
        List<Drone> allDrones = droneController.getAllDrones();
        assertEquals(3, allDrones.size());

        
        assertTrue(allDrones.stream().anyMatch(d -> d.getUav().getType() == UAVType.MULTIROTOR));
        assertTrue(allDrones.stream().anyMatch(d -> d.getUav().getType() == UAVType.FIXEDWING));
        assertTrue(allDrones.stream().anyMatch(d -> d.getUav().getType() == UAVType.ROTORCRAFT));

        
        Drone retrievedMultirotor = allDrones.stream()
                .filter(d -> d.getUav().getType() == UAVType.MULTIROTOR)
                .findFirst().orElse(null);
        assertNotNull(retrievedMultirotor);
        assertEquals(15.0, retrievedMultirotor.getUav().getMaxOperationalSpeed());

        Drone retrievedFixedWing = allDrones.stream()
                .filter(d -> d.getUav().getType() == UAVType.FIXEDWING)
                .findFirst().orElse(null);
        assertNotNull(retrievedFixedWing);
        assertEquals(25.0, retrievedFixedWing.getUav().getMaxOperationalSpeed());
    }
}