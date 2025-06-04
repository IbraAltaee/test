package droneportTeam05.service.calculation;

import droneportTeam05.domain.geography.FlightGeography;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class FlightGeographyServiceTest {
    
    private FlightGeographyService service;
    
    @BeforeEach
    public void setup() {
        service = new FlightGeographyService();
    }
    
    @Test
    public void testCalculateMinFlightDimensions() {
        // Arrange
        double flightHeight = 50;
        int maxCharacteristicDimension = 2;
        
        // Act
        FlightGeography result = service.calculateMinFlightDimensions(flightHeight, maxCharacteristicDimension);
        
        // Assert
        assertNotNull(result);
        assertEquals(flightHeight, result.getHeightFlightGeo());
        assertEquals(3 * maxCharacteristicDimension, result.getMinHeight());
        assertEquals(3 * maxCharacteristicDimension, result.getMinWdith());
    }
    
    @Test
    public void testCalculateMinFlightDimensions_ZeroDimension() {
        // Arrange
        double flightHeight = 50;
        int maxCharacteristicDimension = 0;
        
        // Act
        FlightGeography result = service.calculateMinFlightDimensions(flightHeight, maxCharacteristicDimension);
        
        // Assert
        assertNotNull(result);
        assertEquals(flightHeight, result.getHeightFlightGeo());
        assertEquals(0, result.getMinHeight());
        assertEquals(0, result.getMinWdith());
    }
    
    @Test
    public void testCalculateMinFlightDimensions_LargeValues() {
        // Arrange
        double flightHeight = 1000;
        int maxCharacteristicDimension = 10;
        
        // Act
        FlightGeography result = service.calculateMinFlightDimensions(flightHeight, maxCharacteristicDimension);
        
        // Assert
        assertNotNull(result);
        assertEquals(flightHeight, result.getHeightFlightGeo());
        assertEquals(30, result.getMinHeight()); 
        assertEquals(30, result.getMinWdith()); 
    }
}