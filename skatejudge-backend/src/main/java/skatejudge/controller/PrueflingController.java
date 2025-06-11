package skatejudge.controller;

import org.springframework.web.bind.annotation.*;
import skatejudge.repository.PrueflingRepository;
import skatejudge.entity.Pruefling;

@RestController
@RequestMapping("/api")
public class PrueflingController {

    private final PrueflingRepository prueflingRepository;

    public PrueflingController(PrueflingRepository prueflingRepository) {
        this.prueflingRepository = prueflingRepository;
    }

    @GetMapping("/pruefling")
    public Iterable<Pruefling> findAllPrueflinge() {
        return this.prueflingRepository.findAll();
    }

    @PostMapping("/pruefling")
    public Pruefling addOnePruefling(@RequestBody Pruefling pruefling) {
        return this.prueflingRepository.save(pruefling);
    }

    @DeleteMapping("/pruefling/{id}")
    public void deleteOnePruefling(@PathVariable int id) {
        this.prueflingRepository.deleteById(id);
    }
}
