package droneportTeam05.service.calculation;

import droneportTeam05.domain.volume.AdjacentVolume;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class AdjacentVolumeServiceTest {
    
    private AdjacentVolumeService service;
    
    @BeforeEach
    public void setup() {
        service = new AdjacentVolumeService();
    }
    
    @Test
    public void testCalculateAdjacentVolume() {
        // Arrange
        int maxOperationalSpeed = 10;
        double minVerticalDimension = 100;
        
        // Act
        AdjacentVolume result = service.calculateAdjacentVolume(maxOperationalSpeed, minVerticalDimension);
        
        // Assert
        // Formula for lateral: 120 * maxOperationalSpeed
        double expectedLateral = 120 * 10;
        assertEquals(expectedLateral, result.getLateralInMeter(), 0.01);
        
        // Formula for vertical: minVerticalDimension + 150
        double expectedVertical = 100 + 150;
        assertEquals(expectedVertical, result.getVerticalInMeter(), 0.01);
    }
    
    @Test
    public void testCalculateAdjacentVolume_ZeroSpeed() {
        // Arrange
        int maxOperationalSpeed = 0;
        double minVerticalDimension = 100;
        
        // Act
        AdjacentVolume result = service.calculateAdjacentVolume(maxOperationalSpeed, minVerticalDimension);
        
        // Assert
        // Formula for lateral: 120 * maxOperationalSpeed
        double expectedLateral = 120 * 0;
        assertEquals(expectedLateral, result.getLateralInMeter(), 0.01);
        
        // Formula for vertical: minVerticalDimension + 150
        double expectedVertical = 100 + 150;
        assertEquals(expectedVertical, result.getVerticalInMeter(), 0.01);
    }
    
    @Test
    public void testCalculateAdjacentVolume_ZeroVerticalDimension() {
        // Arrange
        int maxOperationalSpeed = 10;
        double minVerticalDimension = 0;
        
        // Act
        AdjacentVolume result = service.calculateAdjacentVolume(maxOperationalSpeed, minVerticalDimension);
        
        // Assert
        // Formula for lateral: 120 * maxOperationalSpeed
        double expectedLateral = 120 * 10;
        assertEquals(expectedLateral, result.getLateralInMeter(), 0.01);
        
        // Formula for vertical: minVerticalDimension + 150
        double expectedVertical = 0 + 150;
        assertEquals(expectedVertical, result.getVerticalInMeter(), 0.01);
    }
    
    @Test
    public void testCalculateAdjacentVolume_HighValues() {
        // Arrange
        int maxOperationalSpeed = 30;
        double minVerticalDimension = 500;
        
        // Act
        AdjacentVolume result = service.calculateAdjacentVolume(maxOperationalSpeed, minVerticalDimension);
        
        // Assert
        // Formula for lateral: 120 * maxOperationalSpeed
        double expectedLateral = 120 * 30;
        assertEquals(expectedLateral, result.getLateralInMeter(), 0.01);
        
        // Formula for vertical: minVerticalDimension + 150
        double expectedVertical = 500 + 150;
        assertEquals(expectedVertical, result.getVerticalInMeter(), 0.01);
    }
}