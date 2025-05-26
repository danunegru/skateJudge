package skatejudge;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrueflingRepository extends JpaRepository<Pruefling, Integer> {

}
