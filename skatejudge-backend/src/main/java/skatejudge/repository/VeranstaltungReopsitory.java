package skatejudge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import skatejudge.entity.Veranstaltung;

public interface VeranstaltungReopsitory extends JpaRepository<Veranstaltung, Long> {
}
