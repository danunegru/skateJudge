package skatejudge.service;

import org.springframework.stereotype.Service;
import java.util.*;

import skatejudge.entity.Bewertung;
import skatejudge.repository.BewertungRepository;

@Service
public class BewertungsService {

    private final BewertungRepository bewertungRepository;

    public BewertungsService(BewertungRepository bewertungRepository) {
        this.bewertungRepository = bewertungRepository;
    }

    public double berechneEndwertung(Long pruefungId, Long prueflingId, Long richterId) {
        List<Object[]> summen = bewertungRepository.summeProRichter(pruefungId, prueflingId, richterId);

        if (summen.isEmpty()) {
            return 0.0;
        }

        double gesamt = 0.0;
        for (Object[] row : summen) {
            Double summeProRichter = ((Number) row[1]).doubleValue();
            gesamt += summeProRichter;
        }

        return gesamt;
    }

        public Bewertung createBewertung(Bewertung bewertung) {
        return bewertungRepository.save(bewertung);
    }
}
