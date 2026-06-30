package com.example.realestate.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Set;

@Component
public class JwtTokenProvider {
    private final Key secretKey;
    private final long expirationMs;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret,
                            @Value("${jwt.expiration-ms}") long expirationMs) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }

    public String createToken(String email, Set<String> roles) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        String rolesString = String.join(",", roles);
        return Jwts.builder()
                .setSubject(email)
                .claim("roles", rolesString)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmail(String token) {
        return getClaims(token).getSubject();
    }

    public Set<String> getRoles(String token) {
        String roles = (String) getClaims(token).get("roles");
        return Set.of(roles.split(","));
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
