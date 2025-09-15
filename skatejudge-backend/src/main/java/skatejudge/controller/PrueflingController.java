package skatejudge.controller;

import org.springframework.web.bind.annotation.*;
import skatejudge.repository.PrueflingRepository;
import skatejudge.service.PrueflingService;
import skatejudge.entity.Pruefling;
import skatejudge.entity.NeuerPrueflingMitPruefungenRequest;

@RestController
@RequestMapping("/prueflinge")
public class PrueflingController {

    private final PrueflingService prueflingService;

    public PrueflingController(PrueflingService prueflingService) {
        this.prueflingService = prueflingService;
    }

    @PostMapping("/mitPruefungen")
    public Pruefling erstellePrueflingMitPruefungen(@RequestBody NeuerPrueflingMitPruefungenRequest request) {
        return this.prueflingService.erstellePrueflingMitPruefungen(request);
    }

    // @GetMapping("/pruefling")
    // public Iterable<Pruefling> findAllPrueflinge() {
    //     return this.prueflingService.findAllPrueflinge();
    // }

    // @PostMapping("/pruefling")
    // public Pruefling addOnePruefling(@RequestBody Pruefling pruefling) {
    //     return this.prueflingService.addOnePruefling(pruefling);
    // }

    // @DeleteMapping("/pruefling/{id}")
    // public void deleteOnePruefling(@PathVariable int id) {
    //     this.prueflingService.deleteOnePruefling(id);
    // }
}
