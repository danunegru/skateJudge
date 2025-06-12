package skatejudge.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Table(name = "veranstaltungen")
public class Veranstaltung {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private LocalDate datum;
    private String ort;

    @ManyToMany
    @JoinTable(
            name = "veranstaltung_pruefung",
            joinColumns = @JoinColumn(name = "veranstaltung_id"),
            inverseJoinColumns = @JoinColumn(name = "pruefung_id")
    )
    private Set<Pruefung> pruefungen = new HashSet<>();
}
