package droneportTeam05.domain.volume;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class AdjacentVolumeTest {

    @Test
    public void testConstructor() {
        // Act
        AdjacentVolume adjacentVolume = new AdjacentVolume(1200, 250);
        
        // Assert
        assertEquals(1200, adjacentVolume.getLateralInMeter());
        assertEquals(250, adjacentVolume.getVerticalInMeter());
    }
    
    @Test
    public void testSetters() {
        // Arrange
        AdjacentVolume adjacentVolume = new AdjacentVolume(1000, 200);
        
        // Act
        adjacentVolume.setLateralInMeter(1500);
        adjacentVolume.setVerticalInMeter(300);
        
        // Assert
        assertEquals(1500, adjacentVolume.getLateralInMeter());
        assertEquals(300, adjacentVolume.getVerticalInMeter());
    }
}