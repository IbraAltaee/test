package droneportTeam05.domain.risk;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class GroundRiskBufferTest {

    @Test
    public void testForParachute_ValidValues() {
        // Act
        GroundRiskBuffer grb = GroundRiskBuffer.forParachute(5, 10, 3);
        
        // Assert
        assertEquals(TerminationType.PARACHUTE, grb.getTermination());
        assertEquals(5, grb.getTimeToOpenParachute());
        assertEquals(10, grb.getMaxPermissibleWindSpeed());
        assertEquals(3, grb.getRateOfDescent());
    }
    
    @Test
    public void testForParachute_InvalidTimeToOpen() {
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            GroundRiskBuffer.forParachute(2, 10, 3);
        });
        
        assertTrue(exception.getMessage().contains("Time to open parachute must be non-negative"));
    }
    
    @Test
    public void testForGliding() {
        // Act
        GroundRiskBuffer grb = GroundRiskBuffer.forGliding(20);
        
        // Assert
        assertEquals(TerminationType.OFF_GLIDING, grb.getTermination());
        assertEquals(20, grb.getGlideRatio());
    }
    
    @Test
    public void testForBallistic() {
        // Act
        GroundRiskBuffer grb = GroundRiskBuffer.forBallistic();
        
        // Assert
        assertEquals(TerminationType.BALLISTIC_APPROACH, grb.getTermination());
    }
    
    @Test
    public void testForSimplified() {
        // Act
        GroundRiskBuffer grb = GroundRiskBuffer.forSimplified();
        
        // Assert
        assertEquals(TerminationType.SIMPLIFIED_APPROACH, grb.getTermination());
    }
    
    @Test
    public void testForPowerOffNoGlide() {
        // Act
        GroundRiskBuffer grb = GroundRiskBuffer.forPowerOffNoGlide();
        
        // Assert
        assertEquals(TerminationType.OFF_NO_GLIDING, grb.getTermination());
    }
}