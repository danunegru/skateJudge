package skatejudge.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "prueflinge")
@Data
public class Pruefling {

    @Id
    @SequenceGenerator(
        name = "pruefling_seq",
        sequenceName = "pruefling_seq",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "pruefling_seq"
    )
    private Long id;


    private String name;
    private String vorname;
    private String verein;

    public Pruefling() {}

    public Pruefling(String name, String vorname, String verein, long a1a, long a1b, long a1c, long a1d) {
        this.name = name;
        this.vorname = vorname;
        this.verein = verein;
    }
}
