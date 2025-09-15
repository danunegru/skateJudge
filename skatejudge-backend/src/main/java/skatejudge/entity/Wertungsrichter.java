package skatejudge.entity;

import jakarta.persistence.*;
import lombok.Data;
    
@Entity
@Data
public class Wertungsrichter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long richter_id;

    private String vorname;
    private String nachname;
    private String verband;
}

