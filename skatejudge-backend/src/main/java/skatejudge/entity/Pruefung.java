package skatejudge.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "pruefungen")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Pruefung {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private long id;

    private String title;

    // @OneToMany(mappedBy = "pruefung", cascade = CascadeType.ALL, orphanRemoval = true)
    // private Set<Element> elemente = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "veranstaltung_id", nullable = false)
    @JsonBackReference
    private Veranstaltung veranstaltung;

    @ManyToMany
        @JoinTable(
            name = "pruefling_pruefung",
            joinColumns = @JoinColumn(name = "pruefling_id"),
            inverseJoinColumns = @JoinColumn(name = "pruefung_id") )
    private List<Pruefling> prueflinge = new ArrayList<>();



}
