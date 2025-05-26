package skatejudge;

import jakarta.persistence.*;
import lombok.Data;

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

    public Pruefling() {}

    public Pruefling(String name, String vorname, String verein, long a1a, long a1b, long a1c, long a1d) {
        this.name = name;
        this.vorname = vorname;
        this.verein = verein;
    }
}
