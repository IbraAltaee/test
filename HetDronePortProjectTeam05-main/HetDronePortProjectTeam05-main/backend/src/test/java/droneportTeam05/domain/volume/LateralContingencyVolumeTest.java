package droneportTeam05.domain.volume;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class LateralContingencyVolumeTest {

    @Test
    public void testConstructor() {
        // Act
        LateralContingencyVolume lcv = new LateralContingencyVolume(ContingencyManoeuvre.STOPPING);
        
        // Assert
        assertEquals(ContingencyManoeuvre.STOPPING, lcv.getContingencyManoeuvre());
        assertEquals(30, lcv.getRollAngle()); 
        assertEquals(45, lcv.getPitchAngle()); 
        assertEquals(0, lcv.getTimeToOpenParachute()); 
    }
    
    @Test
    public void testForStopping() {
        // Act
        LateralContingencyVolume lcv = LateralContingencyVolume.forStopping(60);
        
        // Assert
        assertEquals(ContingencyManoeuvre.STOPPING, lcv.getContingencyManoeuvre());
        assertEquals(60, lcv.getPitchAngle());
    }
    
    @Test
    public void testForTurn180() {
        // Act
        LateralContingencyVolume lcv = LateralContingencyVolume.forTurn180(45);
        
        // Assert
        assertEquals(ContingencyManoeuvre.TURN_180, lcv.getContingencyManoeuvre());
        assertEquals(45, lcv.getRollAngle());
    }
    
    @Test
    public void testForParachute() {
        // Act
        LateralContingencyVolume lcv = LateralContingencyVolume.forParachute(5);
        
        // Assert
        assertEquals(ContingencyManoeuvre.PARACHUTE_TERMINATION, lcv.getContingencyManoeuvre());
        assertEquals(5, lcv.getTimeToOpenParachute());
    }
    
    @Test
    public void testSetLateralExtension() {
        // Arrange
        LateralContingencyVolume lcv = new LateralContingencyVolume(ContingencyManoeuvre.STOPPING);
        
        // Act
        lcv.setLateralExtension(50.5);
        
        // Assert
        assertEquals(50.5, lcv.getLateralExtension());
    }
}