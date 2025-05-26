package skatejudge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("skatejudge")
@EntityScan("skatejudge")
public class SkateJudgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkateJudgeApplication.class, args);
    }
}
