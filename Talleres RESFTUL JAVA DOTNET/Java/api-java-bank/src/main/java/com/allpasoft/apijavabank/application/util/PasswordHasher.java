package com.allpasoft.apijavabank.application.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class PasswordHasher {
    
    public static String hashPassword(String plainText) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(plainText.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
    
    public static boolean verifyPassword(String plainText, String hashedPassword) {
        String hash = hashPassword(plainText);
        return hash.equals(hashedPassword);
    }
}
