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
    private String veranstalter;
    private LocalDate startDatum;
    private LocalDate endDatum;
    private String ort;

    @OneToMany(mappedBy = "veranstaltung", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Pruefung> pruefungen = new HashSet<>();
}
