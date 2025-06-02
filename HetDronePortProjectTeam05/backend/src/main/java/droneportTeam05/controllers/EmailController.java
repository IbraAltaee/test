package droneportTeam05.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import droneportTeam05.service.email.MailSenderService;
import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private MailSenderService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(
            @RequestParam("to") String to,
            @RequestParam("subject") String subject,
            @RequestParam("body") String body,
            @RequestParam(value = "file", required = false) List<MultipartFile> files
    ) throws MessagingException, IOException {
        System.out.println("Sending email to2: " + files);
        emailService.sendNewMail(to, subject, body, files);
        return ResponseEntity.ok("Email sent successfully");
    }
}