package skatejudge.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"pruefung_id", "pruefling_id", "element_id", "richter_id"})
})
@Data
public class Bewertung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bewertung_id;

    @ManyToOne
    @JoinColumn(name = "pruefung_id", nullable = false)
    private Pruefung pruefung;

    @ManyToOne
    @JoinColumn(name = "pruefling_id", nullable = false)
    private Pruefling pruefling;

    @ManyToOne
    @JoinColumn(name = "element_id", nullable = false)
    private Element element;

    @ManyToOne
    @JoinColumn(name = "richter_id", nullable = false)
    private Wertungsrichter richter;

    private Double punkte;
}

