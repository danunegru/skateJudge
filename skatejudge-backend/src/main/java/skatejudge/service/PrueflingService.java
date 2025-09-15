package skatejudge.service;

import java.util.List;
import org.springframework.stereotype.Service;
import skatejudge.entity.NeuerPrueflingMitPruefungenRequest;
import skatejudge.entity.Pruefling;
import skatejudge.entity.Pruefung;
import skatejudge.repository.PrueflingRepository;
import skatejudge.repository.PruefungRepository;

@Service
public class PrueflingService {

    private final PrueflingRepository prueflingRepository;
    private final PruefungRepository pruefungRepository;

    public PrueflingService(PrueflingRepository prueflingRepository,
                            PruefungRepository pruefungRepository) {
        this.prueflingRepository = prueflingRepository;
        this.pruefungRepository = pruefungRepository;
    }

    public Pruefling erstellePrueflingMitPruefungen(NeuerPrueflingMitPruefungenRequest request) {
        Pruefling pruefling = new Pruefling();
        pruefling.setVorname(request.getVorname());
        pruefling.setName(request.getName());
        pruefling.setVerein(request.getVerein());

        List<Pruefung> pruefungen = pruefungRepository.findAllById(request.getPruefungsIds());
        pruefling.setPruefungen(pruefungen);

        return prueflingRepository.save(pruefling);
    }
}
