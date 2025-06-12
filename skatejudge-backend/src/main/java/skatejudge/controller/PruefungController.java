package skatejudge.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import skatejudge.entity.Pruefling;
import skatejudge.entity.Pruefung;
import skatejudge.entity.Veranstaltung;
import skatejudge.entity.VeranstaltungRequest;
import skatejudge.repository.PrueflingRepository;
import skatejudge.repository.PruefungRepository;
import skatejudge.repository.VeranstaltungReopsitory;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PruefungController {

    private final PruefungRepository pruefungRepository;
    private final VeranstaltungReopsitory veranstaltungReopsitory;

    public PruefungController(PruefungRepository pruefungRepository, VeranstaltungReopsitory veranstaltungReopsitory) {
        this.pruefungRepository = pruefungRepository;
        this.veranstaltungReopsitory = veranstaltungReopsitory;
    }

    @PostMapping("/veranstaltungen")
    public ResponseEntity<String> createVeranstaltung(@RequestBody @Valid VeranstaltungRequest req) {
        Veranstaltung veranstaltung = new Veranstaltung();
        veranstaltung.setName(req.name);
        veranstaltung.setOrt(req.ort);
        veranstaltung.setDatum(LocalDate.parse(req.datum));

        List<Pruefung> ausgewaehltePruefungen = pruefungRepository.findAllById(req.pruefungen);
        veranstaltung.setPruefungen(new HashSet<>(ausgewaehltePruefungen));

        veranstaltungReopsitory.save(veranstaltung);

        return ResponseEntity.ok("Veranstaltung erfolgreich gespeichert.");
    }

    @GetMapping("/veranstaltungen")
    public Iterable<Veranstaltung> findAllVeranstaltungen() {
        return this.veranstaltungReopsitory.findAll();
    }


    @PostMapping("/pruefungen")
    public Pruefung addPruefung(@RequestBody Pruefung pruefung) {
        return this.pruefungRepository.save(pruefung);
    }

    @GetMapping("/pruefungen")
    public List<Pruefung> getAllePruefungen() {
        return pruefungRepository.findAll();
    }

    @DeleteMapping("/pruefungen/{id}")
    public void deletePruefung(@PathVariable long id) {
        this.pruefungRepository.deleteById(id);
    }

    @DeleteMapping("/veranstaltungen/{id}")
    public void deleteVeranstaltung(@PathVariable long id) {
        this.veranstaltungReopsitory.deleteById(id);
    }

}
