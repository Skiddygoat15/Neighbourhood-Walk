package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Service.IdAnalyzerService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/identity")
public class IdentityController {

    @Autowired
    private IdAnalyzerService idAnalyzerService;

    @PostMapping("/verify")
    public String verifyIdentity(@RequestBody IdentityRequest identityRequest) {
        identityRequest.setProfileId("3a9b8f5fb85a438c80311ba81817a1ae");
        return idAnalyzerService.verifyIdentity(
                identityRequest.getDocument(),
                identityRequest.getFace(),
                identityRequest.getProfileId()
        );
    }
}

@Getter
@Setter
class IdentityRequest {
    private String document;
    private String face;
    private String profileId;

    // Getters and setters

}

