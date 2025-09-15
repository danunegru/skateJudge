package skatejudge.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

import skatejudge.entity.Pruefung;
import skatejudge.entity.PruefungRequest;
import skatejudge.entity.Veranstaltung;
import skatejudge.entity.VeranstaltungRequest;
import skatejudge.repository.PruefungRepository;
import skatejudge.repository.VeranstaltungRepository;

@Service
public class VeranstaltungsService {

    private final VeranstaltungRepository veranstaltungRepository;
    private final PruefungRepository pruefungRepository;

    public VeranstaltungsService(VeranstaltungRepository veranstaltungRepository,
                                 PruefungRepository pruefungRepository) {
        this.veranstaltungRepository = veranstaltungRepository;
        this.pruefungRepository = pruefungRepository;
    }

    public Veranstaltung createVeranstaltung(VeranstaltungRequest request) {
        Veranstaltung veranstaltung = new Veranstaltung();
        veranstaltung.setName(request.getName());
        veranstaltung.setStartDatum(request.getStartDatum());
        veranstaltung.setEndDatum(request.getEndDatum());
        veranstaltung.setVeranstalter(request.getVeranstalter());
        veranstaltung.setOrt(request.getOrt());

        List<Pruefung> pruefungen = new ArrayList<>();
        if (request.getPruefungen() != null) {
            for (PruefungRequest pReq : request.getPruefungen()) {
                Pruefung pruefung = new Pruefung();
                pruefung.setTitle(pReq.getTitle());
                pruefung.setVeranstaltung(veranstaltung);
                pruefungen.add(pruefung);
            }
        }

        veranstaltung.setPruefungen(pruefungen);

        return veranstaltungRepository.save(veranstaltung);
    }

    public List<Veranstaltung> getAllVeranstaltungen() {
        return veranstaltungRepository.findAll();
    }

    public Veranstaltung getVeranstaltungById(Long id) {
        return veranstaltungRepository.findById(id).orElseThrow(() -> new RuntimeException("Veranstaltung nicht gefunden"));
    }
}

