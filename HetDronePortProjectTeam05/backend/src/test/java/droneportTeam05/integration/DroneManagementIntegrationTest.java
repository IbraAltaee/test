package droneportTeam05.integration;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import droneportTeam05.domain.Drone;
import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.ContingencyManoeuvre;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import droneportTeam05.repository.DroneRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DroneManagementIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DroneRepository droneRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        droneRepository.deleteAll();
    }

    @Test
    void getAllDrones_WithEmptyDatabase_ReturnsEmptyArray() throws Exception {
        // When & Then - No authentication needed for GET
        mockMvc.perform(get("/api/drones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @Transactional
    void getAllDrones_WithExistingDrones_ReturnsAllDrones() throws Exception {
        // Given - Create test drones directly in database
        Drone drone1 = createValidDrone("TestDrone1");
        Drone drone2 = createValidDrone("TestDrone2");
        droneRepository.save(drone1);
        droneRepository.save(drone2);

        // When & Then
        mockMvc.perform(get("/api/drones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser(username = "mockadmin", roles = "ADMIN")
    @Transactional
    void createDrone_WithAuthentication_CreatesNewDrone() throws Exception {
        // Given
        String droneName = "NewDrone_" + System.currentTimeMillis();
        Drone drone = createValidDrone(droneName);

        // When & Then
        mockMvc.perform(post("/api/drones/admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(drone)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(droneName))
                .andExpect(jsonPath("$.maxFlightAltitude").value(200.0));

        // Verify it's actually saved in database
        Drone savedDrone = droneRepository.findByName(droneName);
        assertNotNull(savedDrone);
        assertEquals(droneName, savedDrone.getName());
    }

    @Test
    void createDrone_WithoutAuthentication_ReturnsForbidden() throws Exception {
        // Given
        Drone drone = createValidDrone("UnauthorizedDrone");

        // When & Then - No @WithMockUser, should be forbidden
        mockMvc.perform(post("/api/drones/admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(drone)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "mockadmin", roles = "ADMIN")
    @Transactional
    void updateDrone_WithValidData_UpdatesExistingDrone() throws Exception {
        // Given - Create original drone
        String droneName = "UpdateDrone_" + System.currentTimeMillis();
        Drone originalDrone = createValidDrone(droneName);
        droneRepository.save(originalDrone);

        // Modify the drone
        originalDrone.setMaxFlightAltitude(300.0);

        // When & Then
        mockMvc.perform(put("/api/drones/admin/" + droneName)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(originalDrone)))
                .andExpect(status().isOk());

        // Verify update in database
        Drone updatedDrone = droneRepository.findByName(droneName);
        assertNotNull(updatedDrone);
        assertEquals(300.0, updatedDrone.getMaxFlightAltitude());
    }

    @Test
    @WithMockUser(username = "mockadmin", roles = "ADMIN")
    @Transactional
    void deleteDrone_WithValidData_DeletesExistingDrone() throws Exception {
        // Given
        String droneName = "DeleteDrone_" + System.currentTimeMillis();
        Drone drone = createValidDrone(droneName);
        droneRepository.save(drone);

        // When & Then
        mockMvc.perform(delete("/api/drones/admin/" + droneName))
                .andExpect(status().isOk())
                .andExpect(content().string("Drone deleted successfully"));

        // Verify deletion in database
        Drone deletedDrone = droneRepository.findByName(droneName);
        assertNull(deletedDrone);
    }

    @Test
    @WithMockUser(username = "mockadmin", roles = "ADMIN")
    @Transactional
    void fullDroneCrudFlow_CreateReadUpdateDelete_Success() throws Exception {
        String droneName = "CrudTestDrone_" + System.currentTimeMillis();
        Drone drone = createValidDrone(droneName);

        // Create
        mockMvc.perform(post("/api/drones/admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(drone)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(droneName));

        // Read - Verify it exists
        mockMvc.perform(get("/api/drones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.name == '" + droneName + "')]").exists());

        // Update
        drone.setMaxFlightAltitude(350.0);
        mockMvc.perform(put("/api/drones/admin/" + droneName)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(drone)))
                .andExpect(status().isOk());

        // Verify update
        Drone updatedDrone = droneRepository.findByName(droneName);
        assertEquals(350.0, updatedDrone.getMaxFlightAltitude());

        // Delete
        mockMvc.perform(delete("/api/drones/admin/" + droneName))
                .andExpect(status().isOk())
                .andExpect(content().string("Drone deleted successfully"));

        // Verify deletion
        Drone deletedDrone = droneRepository.findByName(droneName);
        assertNull(deletedDrone);
    }

    @Test
    void droneOperationsWithoutAuth_AllReturnForbidden() throws Exception {
        // Given
        Drone drone = createValidDrone("UnauthorizedTestDrone");

        // Create without auth
        mockMvc.perform(post("/api/drones/admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(drone)))
                .andExpect(status().isForbidden());

        // Update without auth
        mockMvc.perform(put("/api/drones/admin/somename")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(drone)))
                .andExpect(status().isForbidden());

        // Delete without auth
        mockMvc.perform(delete("/api/drones/admin/somename"))
                .andExpect(status().isForbidden());
    }

    private Drone createValidDrone(String name) {
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 5, 4, 2, 3);

        LateralContingencyVolume lateral = new LateralContingencyVolume(ContingencyManoeuvre.STOPPING);

        
        VerticalContingencyVolume vertical = new VerticalContingencyVolume(ContingencyManoeuvre.ENERGY_CONVERSION);

        
        GroundRiskBuffer ground = GroundRiskBuffer.forParachute(5, 10, 3);

        
        return new Drone(name, uav, lateral, vertical, ground, 200.0);
    }
}
