package skatejudge.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;


public class VeranstaltungRequest {

    @NotBlank(message = "{veranstaltung.name.notblank}")
    public String name;


    @NotNull(message = "{veranstaltung.datum.notnull}")
    @JsonFormat(pattern = "dd.MM.yyyy") // Muss noch bearbeitet !!
    public String datum;       // ISO-Format: "2025-07-15"

    @NotBlank(message = "{veranstaltung.ort.notblank}")
    public String ort;

    @NotNull(message = "{veranstaltung.pruefungIds.notnull}")
    @Size(min = 1, message = "{veranstaltung.pruefungIds.size}")
    public List<Long> pruefungen;  // Liste von Prüfungs-IDs



}
