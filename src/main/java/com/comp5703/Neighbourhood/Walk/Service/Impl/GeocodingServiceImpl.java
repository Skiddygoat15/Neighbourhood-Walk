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
    private static final String API_KEY = "AIzaSyCckyaBJIn_YdEaWxLpcGtMvbn3D3y_dLQ";  // 替换为你的 Google API Key

    public Map<String, Object> getGeocode(String address) throws Exception {
        // 创建 RestTemplate 来发送 HTTP 请求
        RestTemplate restTemplate = new RestTemplate();

        // 确保 address 未被手动编码，检查输出地址格式
        System.out.println("Address before encoding: " + address);

        // 对地址参数进行编码，确保特殊字符（如空格）被正确处理
        String encodedAddress = UriUtils.encodeQueryParam(address, StandardCharsets.UTF_8);

        // 构建 URL，使用 .toUri() 来避免 RestTemplate 自动再次编码
        URI url = UriComponentsBuilder.fromHttpUrl(GOOGLE_GEOCODE_API_URL)
                .queryParam("address", encodedAddress)  // 使用手动编码后的地址
                .queryParam("key", API_KEY)
                .queryParam("language", "en")
                .build(true)  // 这里 build(true) 确保参数不再编码
                .toUri();

        System.out.println("Final URL: " + url);  // 打印最终生成的URL

        // 尝试直接将响应映射为 Map 类型
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        // 打印响应以便调试
        System.out.println(response);

        ResponseEntity<String> response1 = restTemplate.getForEntity(url, String.class);
        System.out.println("Status Code: " + response1.getStatusCodeValue());
        System.out.println("Response Body: " + response1.getBody());

        // 检查响应状态
        if (response != null && "OK".equals(response.get("status"))) {
            // 检查地址是否在澳大利亚
            Map<String, Object> result = (Map<String, Object>) ((List<Object>) response.get("results")).get(0);
            List<Map<String, Object>> addressComponents = (List<Map<String, Object>>) result.get("address_components");

            // 遍历 address_components 查找 country 信息
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

            // 如果地址不在澳大利亚，抛出异常
            if (!isAustralia) {
                throw new Exception("Input address is not in Australia.");
            }

            return response;  // 返回地理编码结果
        } else if (response != null && !"OK".equals(response.get("status"))) {
            throw new Exception("Input address is not in Australia or is invalid.");
        }

        throw new Exception("Failed to get geocoding data.");
    }
}
