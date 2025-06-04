package droneportTeam05.controllers.dto;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ValidationResultTest {

    @Test
    public void testBuilder_Valid() {
        // Act
        ValidationResult result = ValidationResult.builder()
                .valid(true)
                .build();
        
        // Assert
        assertTrue(result.isValid());
        assertFalse(result.hasErrors());
        assertFalse(result.hasWarnings());
        assertFalse(result.hasCompatibilityIssues());
    }
    
    @Test
    public void testBuilder_AddError() {
        // Act
        ValidationResult result = ValidationResult.builder()
                .addError("Test error")
                .build();
        
        // Assert
        assertFalse(result.isValid());
        assertTrue(result.hasErrors());
        assertEquals(1, result.getErrors().size());
        assertEquals("Test error", result.getErrors().get(0));
    }
    
    @Test
    public void testBuilder_AddWarning() {
        // Act
        ValidationResult result = ValidationResult.builder()
                .addWarning("Test warning")
                .build();
        
        // Assert
        assertTrue(result.isValid());
        assertTrue(result.hasWarnings());
        assertEquals(1, result.getWarnings().size());
        assertEquals("Test warning", result.getWarnings().get(0));
    }
    
    @Test
    public void testBuilder_AddCompatibilityIssue() {
        // Act
        ValidationResult result = ValidationResult.builder()
                .addCompatibilityIssue("Test issue")
                .build();
        
        // Assert
        assertTrue(result.isValid());
        assertTrue(result.hasCompatibilityIssues());
        assertEquals(1, result.getCompatibilityIssues().size());
        assertEquals("Test issue", result.getCompatibilityIssues().get(0));
    }
    
    @Test
    public void testBuilder_SetErrors() {
        // Arrange
        List<String> errors = Arrays.asList("Error 1", "Error 2");
        
        // Act
        ValidationResult result = ValidationResult.builder()
                .errors(errors)
                .build();
        
        // Assert
        assertFalse(result.isValid());
        assertTrue(result.hasErrors());
        assertEquals(2, result.getErrors().size());
        assertEquals("Error 1", result.getErrors().get(0));
        assertEquals("Error 2", result.getErrors().get(1));
    }
    
    @Test
    public void testBuilder_SetWarnings() {
        // Arrange
        List<String> warnings = Arrays.asList("Warning 1", "Warning 2");
        
        // Act
        ValidationResult result = ValidationResult.builder()
                .warnings(warnings)
                .build();
        
        // Assert
        assertTrue(result.isValid());
        assertTrue(result.hasWarnings());
        assertEquals(2, result.getWarnings().size());
        assertEquals("Warning 1", result.getWarnings().get(0));
        assertEquals("Warning 2", result.getWarnings().get(1));
    }
    
    @Test
    public void testBuilder_SetCompatibilityIssues() {
        // Arrange
        List<String> issues = Arrays.asList("Issue 1", "Issue 2");
        
        // Act
        ValidationResult result = ValidationResult.builder()
                .compatibilityIssues(issues)
                .build();
        
        // Assert
        assertTrue(result.isValid());
        assertTrue(result.hasCompatibilityIssues());
        assertEquals(2, result.getCompatibilityIssues().size());
        assertEquals("Issue 1", result.getCompatibilityIssues().get(0));
        assertEquals("Issue 2", result.getCompatibilityIssues().get(1));
    }
    
    @Test
    public void testStaticFactoryMethods() {
        // Act
        ValidationResult validResult = ValidationResult.valid();
        ValidationResult invalidResult = ValidationResult.invalid("Invalid");
        
        // Assert
        assertTrue(validResult.isValid());
        assertFalse(validResult.hasErrors());
        
        assertFalse(invalidResult.isValid());
        assertTrue(invalidResult.hasErrors());
        assertEquals("Invalid", invalidResult.getErrors().get(0));
    }
    
    @Test
    public void testInstanceMethods() {
        // Arrange
        ValidationResult result = new ValidationResult();
        
        // Act
        result.addError("Error");
        result.addWarning("Warning");
        result.addCompatibilityIssue("Issue");
        
        // Assert
        assertFalse(result.isValid());
        assertTrue(result.hasErrors());
        assertTrue(result.hasWarnings());
        assertTrue(result.hasCompatibilityIssues());
        assertEquals("Error", result.getErrors().get(0));
        assertEquals("Warning", result.getWarnings().get(0));
        assertEquals("Issue", result.getCompatibilityIssues().get(0));
    }
}