package com.comp5703.Neighbourhood.Walk.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class IdAnalyzerService {

    @Value("${idanalyzer.api_key}")
    private String apiKey;

    @Value("${idanalyzer.api_url}")
    private String apiUrl;

    public String verifyIdentity(String documentBase64, String faceBase64, String profileId) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-API-KEY", apiKey);
        headers.add("Content-Type", "application/json");

        Map<String, Object> payload = new HashMap<>();
        payload.put("profile", profileId);
        payload.put("document", documentBase64);
        payload.put("face", faceBase64);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, request, String.class);

        return response.getBody();
    }
}
