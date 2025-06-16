package skatejudge.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "pruefungen")
@Data
public class Pruefung {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String title;

    @OneToMany(mappedBy = "pruefung", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Element> elemente = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "veranstaltung_id")
    private Veranstaltung veranstaltung;

    @ManyToMany(mappedBy = "pruefungen")
    private Set<Pruefling> prueflinge = new HashSet<>();



}
