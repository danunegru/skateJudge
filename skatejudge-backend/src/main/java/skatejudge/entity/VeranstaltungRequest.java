package skatejudge.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
public class VeranstaltungRequest {

    @NotBlank(message = "{veranstaltung.name.notblank}")
    private String name;

    @NotNull(message = "{veranstaltung.datum.notnull}")
    @JsonFormat(pattern = "dd.MM.yyyy")
    @DateTimeFormat(pattern = "dd.mm.yyyy")
    private LocalDate startDatum;

    @NotNull(message = "{veranstaltung.datum.notnull}")
    @JsonFormat(pattern = "dd.MM.yyyy")
    @DateTimeFormat(pattern = "dd.mm.yyyy")
    private LocalDate endDatum;

    @NotBlank(message = "{veranstaltung.ort.notblank}")
    private String ort;

    @NotNull(message = "{veranstaltung.pruefungIds.notnull}")
    @Size(min = 1, message = "{veranstaltung.pruefungIds.size}")
    private List<PruefungRequest> pruefungen;  // Liste von Prüfungs-IDs


    @NotBlank(message = "{veranstaltung.name.notblank}")
    private String veranstalter;
}
