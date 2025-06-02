package droneportTeam05.controllers;

import droneportTeam05.controllers.dto.DroneOperationRequest;
import droneportTeam05.controllers.dto.DroneOperationResult;
import droneportTeam05.service.orchestration.DroneOperationService;
import droneportTeam05.service.validation.ValidationException;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/droneport")
public class DroneOperationController {
    
    private final DroneOperationService calculationService;
    
    public DroneOperationController(DroneOperationService calculationService) {
        this.calculationService = calculationService;
    }
    
    @PostMapping("/calculate")
    public ResponseEntity<DroneOperationResult> calculateOperation(
            @RequestBody DroneOperationRequest request) {
        
        long startTime = System.currentTimeMillis();
        
        try {
            DroneOperationResult result = calculationService.calculateOperation(request);
            result.setCalculationTimeMs(System.currentTimeMillis() - startTime);
            
            if (result.isSuccess()) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
            
        } catch (ValidationException e) {
            DroneOperationResult errorResult = DroneOperationResult.error(e.getMessage());
            errorResult.setCalculationTimeMs(System.currentTimeMillis() - startTime);
            return ResponseEntity.badRequest().body(errorResult);
        } catch (Exception e) {
            DroneOperationResult errorResult = DroneOperationResult.error("Internal error: " + e.getMessage());
            errorResult.setCalculationTimeMs(System.currentTimeMillis() - startTime);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResult);
        }
    }
}
