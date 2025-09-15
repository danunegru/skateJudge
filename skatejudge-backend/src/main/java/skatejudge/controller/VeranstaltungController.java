package skatejudge.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import skatejudge.entity.Veranstaltung;
import skatejudge.entity.VeranstaltungRequest;
import skatejudge.service.VeranstaltungsService;

@RestController
@RequestMapping("/veranstaltungen")
public class VeranstaltungController {

    private final VeranstaltungsService veranstaltungsService;

    public VeranstaltungController(VeranstaltungsService veranstaltungsService) {
        this.veranstaltungsService = veranstaltungsService;
    }

    @PostMapping
    public Veranstaltung createVeranstaltung(@RequestBody VeranstaltungRequest request) {
        return veranstaltungsService.createVeranstaltung(request);
    }

    @GetMapping
    public List<Veranstaltung> getAllVeranstaltungen() {
        return veranstaltungsService.getAllVeranstaltungen();
    }

    @GetMapping("/{id}")
    public Veranstaltung getVeranstaltungById(@PathVariable Long id) {
        return veranstaltungsService.getVeranstaltungById(id);
    }
}

