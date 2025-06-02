package droneportTeam05.service.calculation;

import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.aircraft.UAVType;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class LateralContingencyVolumeServiceTest {
    
    @Mock
    private ContingencyManoeuvreService contingencyManoeuvreService;
    
    @InjectMocks
    private LateralContingencyVolumeService service;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testCalculateLateralContingencyVolume() {
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 10, 2, "barometric", 5, 4, 3, 2);
        LateralContingencyVolume lcv = LateralContingencyVolume.forStopping(45);
        
        when(contingencyManoeuvreService.calculateLateralContingencyManoeuvre(uav, lcv))
                .thenReturn(5.0);
        
        // Act
        LateralContingencyVolume result = service.calculateLateralContingencyVolume(uav, lcv);
        
        // Assert
        // Formula: sgps + spos + sk + srz + scm
        double expected = 5 + 4 + 3 + 20 + 5;
        assertEquals(expected, result.getLateralExtension(), 0.01);
        assertSame(lcv, result);
        
        verify(contingencyManoeuvreService).calculateLateralContingencyManoeuvre(uav, lcv);
    }
    
    @Test
    public void testCalculateReactionDistance() {        
        // Arrange
        UAV uav = new UAV(UAVType.MULTIROTOR, 15, 2, "barometric", 3, 3, 1, 3);
        LateralContingencyVolume lcv = LateralContingencyVolume.forStopping(45);
        
        when(contingencyManoeuvreService.calculateLateralContingencyManoeuvre(uav, lcv))
                .thenReturn(10.0);
        
        // Act
        LateralContingencyVolume result = service.calculateLateralContingencyVolume(uav, lcv);
        
        // Assert
        // Formula: sgps + spos + sk + srz + scm
        double expected = 3 + 3 + 1 + 45 + 10;
        assertEquals(expected, result.getLateralExtension(), 0.01);
        
        verify(contingencyManoeuvreService).calculateLateralContingencyManoeuvre(uav, lcv);
    }
}