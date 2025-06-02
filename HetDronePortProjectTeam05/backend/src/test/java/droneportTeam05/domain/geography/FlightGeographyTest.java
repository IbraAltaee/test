package droneportTeam05.domain.geography;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class FlightGeographyTest {

    @Test
    public void testConstructor_ValidValues() {
        // Act
        FlightGeography flightGeography = new FlightGeography(50, 10, 15);
        
        // Assert
        assertEquals(50, flightGeography.getHeightFlightGeo());
        assertEquals(10, flightGeography.getMinHeight());
        assertEquals(15, flightGeography.getMinWdith());
    }
    
    @Test
    public void testConstructor_MinimumHeight() {
        // Act
        FlightGeography flightGeography = new FlightGeography(9, 10, 15);
        
        // Assert
        assertEquals(9, flightGeography.getHeightFlightGeo());
        assertEquals(10, flightGeography.getMinHeight());
        assertEquals(15, flightGeography.getMinWdith());
    }
    
    
    @Test
    public void testDefaultConstructor() {
        // Act
        FlightGeography flightGeography = new FlightGeography();
        
        // Assert
        assertEquals(0, flightGeography.getHeightFlightGeo());
        assertEquals(0, flightGeography.getMinHeight());
        assertEquals(0, flightGeography.getMinWdith());
    }
    
    @Test
    public void testSetHeightFlightGeo_Valid() {
        // Arrange
        FlightGeography flightGeography = new FlightGeography();
        
        // Act
        flightGeography.setHeightFlightGeo(20);
        
        // Assert
        assertEquals(20, flightGeography.getHeightFlightGeo());
    }

}