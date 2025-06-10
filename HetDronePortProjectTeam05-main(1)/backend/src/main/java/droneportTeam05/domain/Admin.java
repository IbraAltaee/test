package droneportTeam05.domain;

import jakarta.persistence.*;

import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Getter;

@Getter
@Setter
@Entity
@Table(name = "admin")
@NoArgsConstructor
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "password")
    private String password;

    @Column(name = "username", unique = true)
    private String username;

    public Admin(String username, String password) {
        this.username = username;
        this.password = password;
    }
}