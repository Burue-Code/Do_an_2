package com.example.movierecommendation.common.util;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

/**
 * Tiện ích xử lý file theo tech stack.
 * Mở rộng: LocalFileStorageService, S3FileStorageService.
 */
public final class FileUtils {

    private FileUtils() {
    }

    public static String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    public static String sanitizeFilename(String filename) {
        if (filename == null) return "";
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    public static Optional<String> getContentType(Path path) {
        try {
            return Optional.ofNullable(Files.probeContentType(path));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
