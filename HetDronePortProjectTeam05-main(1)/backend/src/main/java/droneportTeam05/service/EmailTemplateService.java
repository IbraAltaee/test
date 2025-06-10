package droneportTeam05.service;

import org.springframework.stereotype.Service;

import droneportTeam05.domain.EmailTemplate;
import droneportTeam05.repository.EmailTemplateRepository;

@Service
public class EmailTemplateService {

    private final EmailTemplateRepository emailTemplateRepository;
    
    public EmailTemplateService(EmailTemplateRepository emailTemplateRepository) {
        this.emailTemplateRepository = emailTemplateRepository;
    }
    public EmailTemplate getTemplate() {
        EmailTemplate emailTemplate = emailTemplateRepository.findByName("default");
        return emailTemplate;
    }

    public String updateTemplate(String subject, String body) {
        EmailTemplate emailTemplate = emailTemplateRepository.findByName("default");
        if (emailTemplate == null) {
            emailTemplate = new EmailTemplate("default",subject, body);
        } else {
            emailTemplate.setSubject(subject);
            emailTemplate.setBody(body);
        }
        emailTemplateRepository.save(emailTemplate);
        return "Email template updated successfully";
    }
}
