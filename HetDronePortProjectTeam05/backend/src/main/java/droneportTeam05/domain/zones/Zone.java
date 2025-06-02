package droneportTeam05.domain.zones;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Zone {
    
    @Id
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "max_height", nullable = false)
    private double maxHeight;

    @ElementCollection
    @CollectionTable(name = "zone_points", joinColumns = @JoinColumn(name = "zone_name"))
    @OrderColumn(name = "point_order")
    private List<Point> path = new ArrayList<>();


    public Zone(String name, List<Point> path, double maxHeight) {
        this.name = name;
        this.path = path != null ? path : new ArrayList<>();
        this.maxHeight = maxHeight;
    }
}
