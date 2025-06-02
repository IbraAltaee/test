package droneportTeam05.domain.volume;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class VerticalContingencyVolumeTest {

    @Test
    public void testConstructor() {
        // Act
        VerticalContingencyVolume vcv = new VerticalContingencyVolume(ContingencyManoeuvre.ENERGY_CONVERSION);
        
        // Assert
        assertEquals(ContingencyManoeuvre.ENERGY_CONVERSION, vcv.getContingencyManoeuvre());
        assertEquals(0, vcv.getResponseHeight()); 
        assertEquals(0, vcv.getTimeToOpenParachute()); 
    }
    
    @Test
    public void testForParachute() {
        // Act
        VerticalContingencyVolume vcv = VerticalContingencyVolume.forParachute(5);
        
        // Assert
        assertEquals(ContingencyManoeuvre.PARACHUTE_TERMINATION, vcv.getContingencyManoeuvre());
        assertEquals(5, vcv.getTimeToOpenParachute());
    }
    
    @Test
    public void testForEnergyConversion() {
        // Act
        VerticalContingencyVolume vcv = VerticalContingencyVolume.forEnergyConversion();
        
        // Assert
        assertEquals(ContingencyManoeuvre.ENERGY_CONVERSION, vcv.getContingencyManoeuvre());
    }
    
    @Test
    public void testForCircularPath() {
        // Act
        VerticalContingencyVolume vcv = VerticalContingencyVolume.forCircularPath();
        
        // Assert
        assertEquals(ContingencyManoeuvre.CIRCULAR_PATH, vcv.getContingencyManoeuvre());
    }
    
    @Test
    public void testSetters() {
        // Arrange
        VerticalContingencyVolume vcv = new VerticalContingencyVolume(ContingencyManoeuvre.ENERGY_CONVERSION);
        
        // Act
        vcv.setTimeToOpenParachute(5);
        vcv.setHeightContingencyManoeuvre(30);
        vcv.setMinVerticalDimension(50);
        
        // Assert
        assertEquals(5, vcv.getTimeToOpenParachute());
        assertEquals(30, vcv.getHeightContingencyManoeuvre());
        assertEquals(50, vcv.getMinVerticalDimension());
    }
}