package droneportTeam05.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "email_templates")
public class EmailTemplate {
    
    @Id
    private String name;
    
    @Column(name = "subject")
    private String subject;

    @Column(name = "body", columnDefinition = "TEXT", nullable = false)
    private String body;
   
}