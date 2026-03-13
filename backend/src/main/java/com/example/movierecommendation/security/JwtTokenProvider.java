package com.example.movierecommendation.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    private static final String HMAC_ALGO = "HmacSHA256";

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateToken(Authentication authentication) {
        if (authentication == null || !StringUtils.hasText(authentication.getName())) {
            return null;
        }

        String username;
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            username = userDetails.getUsername();
        } else {
            username = authentication.getName();
        }

        long now = Instant.now().getEpochSecond();
        long exp = now + (jwtExpirationMs / 1000);

        Map<String, Object> header = new HashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new HashMap<>();
        payload.put("sub", username);
        payload.put("iat", now);
        payload.put("exp", exp);

        try {
            String headerJson = objectMapper.writeValueAsString(header);
            String payloadJson = objectMapper.writeValueAsString(payload);

            String headerEncoded = base64UrlEncode(headerJson.getBytes(StandardCharsets.UTF_8));
            String payloadEncoded = base64UrlEncode(payloadJson.getBytes(StandardCharsets.UTF_8));

            String unsignedToken = headerEncoded + "." + payloadEncoded;
            String signature = sign(unsignedToken);

            return unsignedToken + "." + signature;
        } catch (Exception ex) {
            return null;
        }
    }

    public String getUsernameFromToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            Map<?, ?> payload = objectMapper.readValue(payloadJson, Map.class);
            Object sub = payload.get("sub");
            return sub != null ? sub.toString() : null;
        } catch (Exception ex) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return false;
            }
            String unsigned = parts[0] + "." + parts[1];
            String expectedSignature = sign(unsigned);
            if (!expectedSignature.equals(parts[2])) {
                return false;
            }

            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            Map<?, ?> payload = objectMapper.readValue(payloadJson, Map.class);
            Object expObj = payload.get("exp");
            if (expObj instanceof Number expNum) {
                long exp = expNum.longValue();
                long now = Instant.now().getEpochSecond();
                return now < exp;
            }
            return false;
        } catch (Exception ex) {
            return false;
        }
    }

    private String sign(String data) throws Exception {
        Mac mac = Mac.getInstance(HMAC_ALGO);
        SecretKeySpec keySpec = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), HMAC_ALGO);
        mac.init(keySpec);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return base64UrlEncode(rawHmac);
    }

    private String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}

