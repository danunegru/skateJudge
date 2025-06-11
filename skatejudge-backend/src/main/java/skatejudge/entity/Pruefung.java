package skatejudge.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "pruefungen")
@Data
public class Pruefung {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;


    public Pruefung() {}

    public Pruefung(String name) {
        this.name = name;
    }
}
