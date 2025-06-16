package skatejudge.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import skatejudge.entity.Pruefung;
import skatejudge.entity.Veranstaltung;
import skatejudge.entity.VeranstaltungRequest;
import skatejudge.repository.PruefungRepository;
import skatejudge.repository.VeranstaltungRepository;

import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PruefungController {

    private final PruefungRepository pruefungRepository;
    private final VeranstaltungRepository veranstaltungRepository;

    public PruefungController(PruefungRepository pruefungRepository, VeranstaltungRepository veranstaltungRepository) {
        this.pruefungRepository = pruefungRepository;
        this.veranstaltungRepository = veranstaltungRepository;
    }

    @PostMapping("/veranstaltungen")
    public ResponseEntity<String> createVeranstaltung(@RequestBody @Valid VeranstaltungRequest req) {
        Veranstaltung veranstaltung = new Veranstaltung();
        veranstaltung.setName(req.getName());
        veranstaltung.setOrt(req.getOrt());
        veranstaltung.setStartDatum(req.getStartDatum());
        veranstaltung.setEndDatum(req.getEndDatum());
        veranstaltung.setVeranstalter(req.getVeranstalter());

        List<Pruefung> ausgewaehltePruefungen = pruefungRepository.findAllById(req.getPruefungen());
        veranstaltung.setPruefungen(new HashSet<>(ausgewaehltePruefungen));

        veranstaltungRepository.save(veranstaltung);

        return ResponseEntity.ok("Veranstaltung erfolgreich gespeichert.");
    }

    @GetMapping("/veranstaltungen")
    public Iterable<Veranstaltung> findAllVeranstaltungen() {
        return this.veranstaltungRepository.findAll();
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
        this.veranstaltungRepository.deleteById(id);
    }

}
