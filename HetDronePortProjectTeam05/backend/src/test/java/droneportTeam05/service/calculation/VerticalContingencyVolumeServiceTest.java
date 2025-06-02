package droneportTeam05.service.calculation;

import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.volume.VerticalContingencyVolume;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class VerticalContingencyVolumeServiceTest {
    
    @Mock
    private ContingencyManoeuvreService contingencyManoeuvreService;
    
    @InjectMocks
    private VerticalContingencyVolumeService service;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testCalculateVerticalContingencyVolume() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 3, 3, 1, 2);
        VerticalContingencyVolume vcv = VerticalContingencyVolume.forEnergyConversion();
        double flightHeight = 100;
        
        when(contingencyManoeuvreService.calculateVerticalContingencyManoeuvre(uav, vcv))
                .thenReturn(5.0);
        
        // Act
        VerticalContingencyVolume result = service.calculateVerticalContingencyVolume(uav, vcv, flightHeight);
        
        // Assert
        // Formula: hfg + hbaro + hrz + hcm
        double expected = 100 + 1 + 14 + 5;
        assertEquals(expected, result.getMinVerticalDimension(), 0.01);
        assertEquals(5.0, result.getHeightContingencyManoeuvre(), 0.01);
        assertSame(vcv, result);
        
        verify(contingencyManoeuvreService).calculateVerticalContingencyManoeuvre(uav, vcv);
    }
    
    @Test
    public void testCalculateVerticalContingencyVolume_GpsBased() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "GPS-based", 3, 3, 1, 2);
        VerticalContingencyVolume vcv = VerticalContingencyVolume.forEnergyConversion();
        double flightHeight = 100;
        
        when(contingencyManoeuvreService.calculateVerticalContingencyManoeuvre(uav, vcv))
                .thenReturn(5.0);
        
        // Act
        VerticalContingencyVolume result = service.calculateVerticalContingencyVolume(uav, vcv, flightHeight);
        
        // Assert
        // Formula: hfg + hbaro + hrz + hcm
        double expected = 100 + 4 + 14 + 5;
        assertEquals(expected, result.getMinVerticalDimension(), 0.01);
        assertEquals(5.0, result.getHeightContingencyManoeuvre(), 0.01);
        
        verify(contingencyManoeuvreService).calculateVerticalContingencyManoeuvre(uav, vcv);
    }
    
    @Test
    public void testCalculateResponseHeight() {        
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 15, 2, "barometric", 3, 3, 1, 3);
        VerticalContingencyVolume vcv = VerticalContingencyVolume.forEnergyConversion();
        double flightHeight = 100;
        
        when(contingencyManoeuvreService.calculateVerticalContingencyManoeuvre(uav, vcv))
                .thenReturn(10.0);
        
        // Act
        VerticalContingencyVolume result = service.calculateVerticalContingencyVolume(uav, vcv, flightHeight);
        
        // Assert
        // Formula: hfg + hbaro + hrz + hcm
        double expected = 100 + 1 + 31.5 + 10;
        assertEquals(expected, result.getMinVerticalDimension(), 0.01);
        
        verify(contingencyManoeuvreService).calculateVerticalContingencyManoeuvre(uav, vcv);
    }
}