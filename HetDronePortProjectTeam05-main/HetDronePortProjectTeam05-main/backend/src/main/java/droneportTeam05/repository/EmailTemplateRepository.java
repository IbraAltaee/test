package droneportTeam05.repository;

import org.springframework.stereotype.Repository;

import droneportTeam05.domain.EmailTemplate;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, String> {
    EmailTemplate findByName(String name);
}