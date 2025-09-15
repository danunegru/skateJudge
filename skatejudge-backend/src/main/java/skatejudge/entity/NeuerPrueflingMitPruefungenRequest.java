package skatejudge.entity;

import java.util.List;
import lombok.Data;

@Data
public class NeuerPrueflingMitPruefungenRequest {
    private String vorname;
    private String name;
    private String verein;
    private List<Long> pruefungsIds;
}
