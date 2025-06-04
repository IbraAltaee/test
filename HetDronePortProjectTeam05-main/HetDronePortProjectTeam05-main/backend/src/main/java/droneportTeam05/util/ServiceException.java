package droneportTeam05.util;

import lombok.Getter;

@Getter
public class ServiceException extends Exception {
    private final String field;

    public ServiceException(String field, String message) {
        super(message);
        this.field = field;
    }

}