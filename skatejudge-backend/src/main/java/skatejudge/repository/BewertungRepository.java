package skatejudge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import skatejudge.entity.Bewertung;

import java.util.List;

@Repository
public interface BewertungRepository extends JpaRepository<Bewertung, Long> {

    @Query("""
    SELECT b.richter.id, SUM(b.punkte)
    FROM Bewertung b
    WHERE b.pruefung.id = :pruefungId
      AND b.pruefling.id = :prueflingId
      AND b.richter.id = :richterId
    GROUP BY b.richter.id
""")
List<Object[]> summeProRichter(
        @Param("pruefungId") Long pruefungId,
        @Param("prueflingId") Long prueflingId,
        @Param("richterId") Long richterId);

}
