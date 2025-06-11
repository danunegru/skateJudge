package skatejudge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import skatejudge.entity.Pruefung;

@Repository
public interface PruefungRepository extends JpaRepository<Pruefung, Long> {
}
