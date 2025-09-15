package skatejudge.controller;

import org.springframework.web.bind.annotation.*;

import skatejudge.entity.Bewertung;
import skatejudge.service.BewertungsService;

@RestController
@RequestMapping("/bewertungen")
public class BewertungsController {

    private final BewertungsService bewertungsService;

    public BewertungsController(BewertungsService bewertungsService) {
        this.bewertungsService = bewertungsService;
    }

    @GetMapping("/endwertung")
    public double getEndwertung(
            @RequestParam Long pruefungId,
            @RequestParam Long prueflingId,
            @RequestParam(required = false) Long richterId) {
        return bewertungsService.berechneEndwertung(pruefungId, prueflingId, richterId);
    }

    @PostMapping
    public Bewertung createBewertung(@RequestBody Bewertung bewertung) {
        return bewertungsService.createBewertung(bewertung);
    }
}

