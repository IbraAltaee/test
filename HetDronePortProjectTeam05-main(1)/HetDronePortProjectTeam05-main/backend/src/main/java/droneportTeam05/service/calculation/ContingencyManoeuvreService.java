package droneportTeam05.service.calculation;

import org.springframework.stereotype.Service;

import droneportTeam05.domain.aircraft.UAV;
import droneportTeam05.domain.volume.LateralContingencyVolume;
import droneportTeam05.domain.volume.VerticalContingencyVolume;

@Service
public class ContingencyManoeuvreService {
    
    public double calculateLateralContingencyManoeuvre(UAV uav, LateralContingencyVolume lateralCV) {
        double v0 = uav.getMaxOperationalSpeed();
        double g = 9.81;

        return switch (lateralCV.getContingencyManoeuvre()) {
            case STOPPING ->
                // For multirotors: SCM = V0²/(2g*tan(pitch))
                    (v0 * v0) / (2 * g * Math.tan(Math.toRadians(lateralCV.getPitchAngle())));
            case TURN_180 ->
                // For fixed-wing: SCM = V0²/(g*tan(roll))
                    (v0 * v0) / (g * Math.tan(Math.toRadians(lateralCV.getRollAngle())));
            case PARACHUTE_TERMINATION ->
                // SCM = V0 * t
                    v0 * lateralCV.getTimeToOpenParachute();
            default ->
                    throw new IllegalStateException("Unknown contingency manoeuvre: " + lateralCV.getContingencyManoeuvre());
        };
    }
    
    public double calculateVerticalContingencyManoeuvre(UAV uav, VerticalContingencyVolume verticalCV) {
        double v0 = uav.getMaxOperationalSpeed();
        double g = 9.81;

        return switch (verticalCV.getContingencyManoeuvre()) {
            case ENERGY_CONVERSION ->
                // Convert forward kinetic energy to potential energy
                    0.5 * (v0 * v0) / g;
            case CIRCULAR_PATH ->
                // HCM = V0²/g * 0.3
                    (v0 * v0) / g * 0.3;
            case PARACHUTE_TERMINATION ->
                // Exit FG with 45° pitch angle
                    v0 * verticalCV.getTimeToOpenParachute() * 0.7;
            default ->
                    throw new IllegalStateException("Unknown contingency manoeuvre: " + verticalCV.getContingencyManoeuvre());
        };
    }
}