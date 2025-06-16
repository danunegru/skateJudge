package skatejudge.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "prueflinge")
@Data
public class Pruefling {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;


    private String name;
    private String vorname;
    private String verein;

    @ManyToMany
    @JoinTable(
            name = "pruefling_pruefung",
            joinColumns = @JoinColumn(name = "pruefling_id"),
            inverseJoinColumns = @JoinColumn(name = "pruefung_id") )
    private Set<Pruefung> pruefungen = new HashSet<>();

    public Pruefling() {}

    public Pruefling(String name, String vorname, String verein, long a1a, long a1b, long a1c, long a1d) {
        this.name = name;
        this.vorname = vorname;
        this.verein = verein;
    }
}
