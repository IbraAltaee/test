package droneportTeam05.service.calculation;

import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.risk.GroundRiskBuffer;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import droneportTeam05.domain.volume.ContingencyManoeuvre;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class GroundRiskBufferServiceTest {
    
    private GroundRiskBufferService service;
    
    @BeforeEach
    public void setup() {
        service = new GroundRiskBufferService();
    }
    
    @Test
    public void testCalculateGroundRiskBuffer_Ballistic() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        VerticalContingencyVolume verticalCV = new VerticalContingencyVolume(ContingencyManoeuvre.ENERGY_CONVERSION);
        verticalCV.setMinVerticalDimension(100);
        
        // Act
        GroundRiskBuffer result = service.calculateGroundRiskBuffer(uav, grb, verticalCV);
        
        // Assert - formula: V0 * sqrt(2 * hcv / g) + 0.5 * CD
        double expected = 10 * Math.sqrt(2 * 100 / 9.81) + 0.5 * 2;
        assertEquals(expected, result.getMinLateralDimension(), 0.01);
    }
    
    @Test
    public void testCalculateGroundRiskBuffer_BallisticInvalidType() {
        // Arrange
        UAV uav = new UAV(UAVType.FIXEDWING, 30, 3, "barometric", 3, 3, 1, 1);
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        VerticalContingencyVolume verticalCV = new VerticalContingencyVolume(ContingencyManoeuvre.CIRCULAR_PATH);
        verticalCV.setMinVerticalDimension(150);
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            service.calculateGroundRiskBuffer(uav, grb, verticalCV);
        });
        
        assertTrue(exception.getMessage().contains("Ballistic approach only allowed for multirotors and rotorcrafts"));
    }
    
    @Test
    public void testCalculateGroundRiskBuffer_Parachute() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        GroundRiskBuffer grb = GroundRiskBuffer.forParachute(5, 5, 3);
        VerticalContingencyVolume verticalCV = new VerticalContingencyVolume(ContingencyManoeuvre.ENERGY_CONVERSION);
        verticalCV.setMinVerticalDimension(100);
        
        // Act
        GroundRiskBuffer result = service.calculateGroundRiskBuffer(uav, grb, verticalCV);
        
        // Assert - formula: V0 * t + vWind * (hcv / vz)
        double expected = (10 * 5) + (5 * ((double)100 / 3));
        assertEquals(expected, result.getMinLateralDimension());
    }
    
    @Test
    public void testCalculateGroundRiskBuffer_ParachuteInvalidWindSpeed() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        GroundRiskBuffer grb = GroundRiskBuffer.forParachute(5, 2, 3);
        VerticalContingencyVolume verticalCV = new VerticalContingencyVolume(ContingencyManoeuvre.ENERGY_CONVERSION);
        verticalCV.setMinVerticalDimension(100);
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            service.calculateGroundRiskBuffer(uav, grb, verticalCV);
        });
        
        assertTrue(exception.getMessage().contains("Wind speed below 3 m/s not considered realistic"));
    }
    
    @Test
    public void testCalculateGroundRiskBuffer_Gliding() {
        // Arrange
        UAV uav = new UAV(UAVType.FIXEDWING, 30, 3, "barometric", 3, 3, 1, 1);
        GroundRiskBuffer grb = GroundRiskBuffer.forGliding(20);
        VerticalContingencyVolume verticalCV = new VerticalContingencyVolume(ContingencyManoeuvre.CIRCULAR_PATH);
        verticalCV.setMinVerticalDimension(150);
        
        // Act
        GroundRiskBuffer result = service.calculateGroundRiskBuffer(uav, grb, verticalCV);
        
        // Assert - formula: hcv / epsilon
        double expected = 150 / (1.0/20);
        assertEquals(expected, result.getMinLateralDimension(), 0.01);
    }
    
    @Test
    public void testCalculateGroundRiskBuffer_SimplifiedApproach() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        GroundRiskBuffer grb = GroundRiskBuffer.forSimplified();
        VerticalContingencyVolume verticalCV = new VerticalContingencyVolume(ContingencyManoeuvre.ENERGY_CONVERSION);
        verticalCV.setMinVerticalDimension(100);
        
        // Act
        GroundRiskBuffer result = service.calculateGroundRiskBuffer(uav, grb, verticalCV);
        
        // Assert - formula: hcv + 0.5 * CD
        double expected = 100 + 0.5 * 2;
        assertEquals(expected, result.getMinLateralDimension(), 0.01);
    }
    
    @Test
    public void testCalculateGroundRiskBuffer_PowerOffNoGliding() {
        // Arrange
        UAV uav = new UAV(UAVType.FIXEDWING, 30, 3, "barometric", 3, 3, 1, 1);
        GroundRiskBuffer grb = GroundRiskBuffer.forPowerOffNoGlide();
        VerticalContingencyVolume verticalCV = new VerticalContingencyVolume(ContingencyManoeuvre.CIRCULAR_PATH);
        verticalCV.setMinVerticalDimension(150);
        
        // Act
        GroundRiskBuffer result = service.calculateGroundRiskBuffer(uav, grb, verticalCV);
        
        // Assert - formula: hcv + 0.5 * CD (same as simplified)
        double expected = 150 + 0.5 * 3;
        assertEquals(expected, result.getMinLateralDimension(), 0.01);
    }
}