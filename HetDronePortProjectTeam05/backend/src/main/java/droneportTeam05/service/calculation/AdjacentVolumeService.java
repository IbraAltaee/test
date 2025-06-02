package droneportTeam05.service.calculation;

import org.springframework.stereotype.Service;

import droneportTeam05.domain.volume.AdjacentVolume;

@Service
public class AdjacentVolumeService {

    public AdjacentVolume calculateAdjacentVolume(double maxOperationalSpeed, double minVerticalDimension)
    {
        double adjacentVolumeLateral = 120 * maxOperationalSpeed;
        double adjacentVolumeVertical = minVerticalDimension + 150;
        return new AdjacentVolume(adjacentVolumeLateral, adjacentVolumeVertical);
    }
    
}
