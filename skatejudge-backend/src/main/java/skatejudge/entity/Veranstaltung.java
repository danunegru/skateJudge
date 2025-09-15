package skatejudge.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@Table(name = "veranstaltungen")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Veranstaltung {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private Long id;

    private String name;
    private String veranstalter;
    private LocalDate startDatum;
    private LocalDate endDatum;
    private String ort;

    @OneToMany(mappedBy = "veranstaltung", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Pruefung> pruefungen = new ArrayList<>();
}
