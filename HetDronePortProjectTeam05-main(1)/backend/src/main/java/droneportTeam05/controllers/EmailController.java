package droneportTeam05.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import droneportTeam05.domain.EmailTemplate;
import droneportTeam05.service.EmailTemplateService;
import droneportTeam05.service.email.MailSenderService;
import jakarta.mail.MessagingException;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/email")
public class EmailController {

    private final EmailTemplateService emailTemplateService;

    @Autowired
    private MailSenderService emailService;

    public EmailController(EmailTemplateService emailTemplateService) {
        this.emailTemplateService = emailTemplateService;
    }
    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(
            @RequestParam("to") String to,
            @RequestParam(value = "file", required = false) List<MultipartFile> files
    ) throws MessagingException, IOException {
        String body = emailTemplateService.getTemplate().getBody();
        String subject = emailTemplateService.getTemplate().getSubject();
        emailService.sendNewMail(to, subject, body, files);
        return ResponseEntity.ok("Email sent successfully");
    }

    @PostMapping("/send-notification")
    public ResponseEntity<String> sendEmailNotification(
            @RequestParam("to") String to,
            @RequestParam("body") String body,
            @RequestParam("subject") String subject,
            @RequestParam(value = "file", required = false) List<MultipartFile> files
    ) throws MessagingException, IOException {
        emailService.sendNewMail(to, subject, body, files);
        return ResponseEntity.ok("Email sent successfully");
    }


    @GetMapping("/template")
    public EmailTemplate getTemplate() {
        return emailTemplateService.getTemplate();
    }

    @PutMapping("/template")
    public String updateTemplate(
            @RequestParam("body") String body,
            @RequestParam("subject") String subject) {
        return emailTemplateService.updateTemplate(subject, body);
    }
}