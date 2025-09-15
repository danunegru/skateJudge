package skatejudge.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

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
    private List<Pruefung> pruefungen = new ArrayList<>();

    public Pruefling() {}

    public Pruefling(String name, String vorname, String verein) {
        this.name = name;
        this.vorname = vorname;
        this.verein = verein;
    }
}
