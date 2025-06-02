package droneportTeam05.controllers.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidationResult {
    private boolean valid;
    private List<String> errors;
    private List<String> warnings;
    private List<String> compatibilityIssues;
    
    public ValidationResult() {
        this.errors = new ArrayList<>();
        this.warnings = new ArrayList<>();
        this.compatibilityIssues = new ArrayList<>();
        this.valid = true;
    }
    
    public static class Builder {
        private ValidationResult result = new ValidationResult();
        
        public Builder valid(boolean valid) {
            result.valid = valid;
            return this;
        }
        
        public Builder addError(String error) {
            result.errors.add(error);
            result.valid = false;
            return this;
        }
        
        public Builder addWarning(String warning) {
            result.warnings.add(warning);
            return this;
        }
        
        public Builder addCompatibilityIssue(String issue) {
            result.compatibilityIssues.add(issue);
            return this;
        }
        
        public Builder errors(List<String> errors) {
            result.errors = new ArrayList<>(errors);
            if (!errors.isEmpty()) {
                result.valid = false;
            }
            return this;
        }
        
        public Builder warnings(List<String> warnings) {
            result.warnings = new ArrayList<>(warnings);
            return this;
        }
        
        public Builder compatibilityIssues(List<String> issues) {
            result.compatibilityIssues = new ArrayList<>(issues);
            return this;
        }
        
        public ValidationResult build() {
            return result;
        }
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static ValidationResult valid() {
        return new ValidationResult();
    }
    
    public static ValidationResult invalid(String error) {
        return builder()
            .addError(error)
            .build();
    }
    
    public void addError(String error) {
        this.errors.add(error);
        this.valid = false;
    }
    
    public void addWarning(String warning) {
        this.warnings.add(warning);
    }
    
    public void addCompatibilityIssue(String issue) {
        this.compatibilityIssues.add(issue);
    }
    
    public boolean hasErrors() {
        return !errors.isEmpty();
    }
    
    public boolean hasWarnings() {
        return !warnings.isEmpty();
    }
    
    public boolean hasCompatibilityIssues() {
        return !compatibilityIssues.isEmpty();
    }
}
