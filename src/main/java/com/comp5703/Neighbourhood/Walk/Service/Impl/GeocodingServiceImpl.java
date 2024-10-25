package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Service.GeocodingService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
public class GeocodingServiceImpl implements GeocodingService {

    private static final String GOOGLE_GEOCODE_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
    private static final String API_KEY = "AIzaSyB0LNcULkVV2QRvCq8hhjfg2_AZAX53QCg";

    public Map<String, Object> getGeocode(String address) throws Exception {
        // Create a RestTemplate to send HTTP requests.
        RestTemplate restTemplate = new RestTemplate();

        System.out.println("Address before encoding: " + address);

        // Encode address parameters to ensure that special characters (such as spaces) are handled correctly
        String encodedAddress = UriUtils.encodeQueryParam(address, StandardCharsets.UTF_8);

        // Construct the URL, using .toUri() to avoid automatic re-encoding by RestTemplate.
        URI url = UriComponentsBuilder.fromHttpUrl(GOOGLE_GEOCODE_API_URL)
                .queryParam("address", encodedAddress)  // Use manually encoded addresses
                .queryParam("key", API_KEY)
                .queryParam("language", "en")
                .build(true)
                .toUri();

        System.out.println("Final URL: " + url);

        // Try to map the response directly to a Map type.
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        System.out.println(response);

        ResponseEntity<String> response1 = restTemplate.getForEntity(url, String.class);
        System.out.println("Status Code: " + response1.getStatusCodeValue());
        System.out.println("Response Body: " + response1.getBody());

        if (response != null && "OK".equals(response.get("status"))) {
            // Check if the address is in Australia
            Map<String, Object> result = (Map<String, Object>) ((List<Object>) response.get("results")).get(0);
            List<Map<String, Object>> addressComponents = (List<Map<String, Object>>) result.get("address_components");

            boolean isAustralia = false;
            for (Map<String, Object> component : addressComponents) {
                List<String> types = (List<String>) component.get("types");
                if (types.contains("country")) {
                    String countryCode = (String) component.get("short_name");
                    if ("AU".equals(countryCode)) {
                        isAustralia = true;
                        break;
                    }
                }
            }

            // Throw an exception if the address is not in Australia
            if (!isAustralia) {
                throw new Exception("Input address is not in Australia.");
            }

            return response;  // Return geocoding results
        } else if (response != null && !"OK".equals(response.get("status"))) {
            throw new Exception("Input address is not in Australia or is invalid.");
        }

        throw new Exception("Failed to get geocoding data.");
    }
}
