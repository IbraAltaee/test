package droneportTeam05.service.calculation;

import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ContingencyManoeuvreServiceTest {
    
    private ContingencyManoeuvreService service;
    
    @BeforeEach
    public void setup() {
        service = new ContingencyManoeuvreService();
    }
    
    @Test
    public void testCalculateLateralContingencyManoeuvre_Stopping() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lcv = LateralContingencyVolume.forStopping(45);
        
        // Act
        double result = service.calculateLateralContingencyManoeuvre(uav, lcv);
        
        // Assert - formula: V0²/(2g*tan(pitch))
        double expected = (10 * 10) / (2 * 9.81 * Math.tan(Math.toRadians(45)));
        assertEquals(expected, result, 0.01);
    }
    
    @Test
    public void testCalculateLateralContingencyManoeuvre_Turn180() {
        // Arrange
        UAV uav = new UAV(UAVType.FIXEDWING, 30, 3, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lcv = LateralContingencyVolume.forTurn180(30);
        
        // Act
        double result = service.calculateLateralContingencyManoeuvre(uav, lcv);
        
        // Assert - formula: V0²/(g*tan(roll))
        double expected = (30 * 30) / (9.81 * Math.tan(Math.toRadians(30)));
        assertEquals(expected, result, 0.01);
    }
    
    @Test
    public void testCalculateLateralContingencyManoeuvre_Parachute() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        LateralContingencyVolume lcv = LateralContingencyVolume.forParachute(5);
        
        // Act
        double result = service.calculateLateralContingencyManoeuvre(uav, lcv);
        
        // Assert - formula: V0 * t
        double expected = 10 * 5;
        assertEquals(expected, result, 0.01);
    }
    
    @Test
    public void testCalculateVerticalContingencyManoeuvre_EnergyConversion() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        VerticalContingencyVolume vcv = VerticalContingencyVolume.forEnergyConversion();
        
        // Act
        double result = service.calculateVerticalContingencyManoeuvre(uav, vcv);
        
        // Assert - formula: 0.5 * (V0 * V0) / g
        double expected = 0.5 * (10 * 10) / 9.81;
        assertEquals(expected, result, 0.01);
    }
    
    @Test
    public void testCalculateVerticalContingencyManoeuvre_CircularPath() {
        // Arrange
        UAV uav = new UAV(UAVType.FIXEDWING, 30, 3, "barometric", 3, 3, 1, 1);
        VerticalContingencyVolume vcv = VerticalContingencyVolume.forCircularPath();
        
        // Act
        double result = service.calculateVerticalContingencyManoeuvre(uav, vcv);
        
        // Assert - formula: (V0²/g) * 0.3
        double expected = (30 * 30) / 9.81 * 0.3;
        assertEquals(expected, result, 0.01);
    }
    
    @Test
    public void testCalculateVerticalContingencyManoeuvre_Parachute() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        VerticalContingencyVolume vcv = VerticalContingencyVolume.forParachute(5);
        
        // Act
        double result = service.calculateVerticalContingencyManoeuvre(uav, vcv);
        
        // Assert - formula: V0 * t * 0.7
        double expected = 10 * 5 * 0.7;
        assertEquals(expected, result, 0.01);
    }
}