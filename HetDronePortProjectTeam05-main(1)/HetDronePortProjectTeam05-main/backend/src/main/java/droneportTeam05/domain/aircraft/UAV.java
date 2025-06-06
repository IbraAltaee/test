package droneportTeam05.domain.aircraft;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class UAV {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UAVType type;
    private double maxOperationalSpeed;
    private double maxCharacteristicDimension;
    private String altitudeMeasurementErrorType;
    private int altitudeMeasurementError;
    private int gpsInaccuracy = 3;
    private int positionHoldingError = 3;
    private int mapError = 1;
    private double responseTime = 1;

    public void setAltitudeMeasurementError(String altitudeMeasurementErrorType) {
        this.altitudeMeasurementErrorType = altitudeMeasurementErrorType;
        if (altitudeMeasurementErrorType.equalsIgnoreCase("barometric")) {
            this.altitudeMeasurementError = 1;
        } else if (altitudeMeasurementErrorType.equalsIgnoreCase("GPS-based")) {
            this.altitudeMeasurementError = 4;
        } else {
            throw new IllegalArgumentException("Invalid altitude measurement error type");
        }
    }
    
    public void setAltitudeMeasurementError(int altitudeMeasurementError) {
        if (altitudeMeasurementError < 0) {
            throw new IllegalArgumentException("Altitude measurement error cannot be negative");
        }
        this.altitudeMeasurementError = altitudeMeasurementError;
    }
    
    public UAV(UAVType type, double maxOperationalSpeed, double maxCharacteristicDimension,
               String altitudeMeasurementErrorType, int gpsInaccuracy,
               int positionHoldingError, int mapError, double responseTime) {
        this.type = type;
        this.maxOperationalSpeed = maxOperationalSpeed;
        this.maxCharacteristicDimension = maxCharacteristicDimension;
        this.altitudeMeasurementErrorType = altitudeMeasurementErrorType;
        if (gpsInaccuracy > 0) {
            this.gpsInaccuracy = gpsInaccuracy;
        }
        if (positionHoldingError > 0) {
            this.positionHoldingError = positionHoldingError;
        }
        if (mapError > 0) {
            this.mapError = mapError;
        }
        if (responseTime > 0) {
            this.responseTime = responseTime;
        }
        setAltitudeMeasurementError(altitudeMeasurementErrorType);
    }
}
