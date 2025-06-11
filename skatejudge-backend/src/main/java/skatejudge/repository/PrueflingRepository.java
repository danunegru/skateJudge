package skatejudge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import skatejudge.entity.Pruefling;

@Repository
public interface PrueflingRepository extends JpaRepository<Pruefling, Integer> {

}
