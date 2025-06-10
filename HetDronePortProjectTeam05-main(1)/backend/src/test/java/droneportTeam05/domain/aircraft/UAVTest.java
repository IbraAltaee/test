package droneportTeam05.domain.aircraft;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class UAVTest {

    @Test
    public void testConstructor_ValidValues() {
        // Act
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 5, 4, 2, 3);
        
        // Assert
        assertEquals(UAVType.MULTIROTOR, uav.getType());
        assertEquals(10, uav.getMaxOperationalSpeed());
        assertEquals(2, uav.getMaxCharacteristicDimension());
        assertEquals("barometric", uav.getAltitudeMeasurementErrorType());
        assertEquals(1, uav.getAltitudeMeasurementError());
        assertEquals(5, uav.getGpsInaccuracy());
        assertEquals(4, uav.getPositionHoldingError());
        assertEquals(2, uav.getMapError());
        assertEquals(3, uav.getResponseTime());
    }
    
    @Test
    public void testConstructor_DefaultValues() {
        // Act
        UAV uav = new UAV(UAVType.FIXEDWING, 15, 3, "GPS-based", 0, 0, 0, 0);
        
        // Assert
        assertEquals(UAVType.FIXEDWING, uav.getType());
        assertEquals(15, uav.getMaxOperationalSpeed());
        assertEquals(3, uav.getMaxCharacteristicDimension());
        assertEquals("GPS-based", uav.getAltitudeMeasurementErrorType());
        assertEquals(4, uav.getAltitudeMeasurementError());
        assertEquals(3, uav.getGpsInaccuracy());
        assertEquals(3, uav.getPositionHoldingError());
        assertEquals(1, uav.getMapError());
        assertEquals(1, uav.getResponseTime());
    }
    
    @Test
    public void testSetAltitudeMeasurementError_BarometricType() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "GPS-based", 3, 3, 1, 1);
        
        // Act
        uav.setAltitudeMeasurementError("barometric");
        
        // Assert
        assertEquals("barometric", uav.getAltitudeMeasurementErrorType());
        assertEquals(1, uav.getAltitudeMeasurementError());
    }
    
    @Test
    public void testSetAltitudeMeasurementError_GpsBasedType() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        
        // Act
        uav.setAltitudeMeasurementError("GPS-based");
        
        // Assert
        assertEquals("GPS-based", uav.getAltitudeMeasurementErrorType());
        assertEquals(4, uav.getAltitudeMeasurementError());
    }
    
    @Test
    public void testSetAltitudeMeasurementError_InvalidType() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            uav.setAltitudeMeasurementError("invalid");
        });
        
        assertTrue(exception.getMessage().contains("Invalid altitude measurement error type"));
    }
    
    @Test
    public void testSetAltitudeMeasurementError_ValidValue() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        
        // Act
        uav.setAltitudeMeasurementError(5);
        
        // Assert
        assertEquals(5, uav.getAltitudeMeasurementError());
    }
    
    @Test
    public void testSetAltitudeMeasurementError_InvalidValue() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 1);
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            uav.setAltitudeMeasurementError(-1);
        });
        
        assertTrue(exception.getMessage().contains("Altitude measurement error cannot be negative"));
    }
}