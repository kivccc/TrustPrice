package com.tp.backend.controller;


import com.tp.backend.domain.Product;
import com.tp.backend.repository.ProductRepository;
import com.tp.backend.service.ProductService;
import com.tp.backend.service.VisionApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final VisionApiService visionApiService;

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name) {
        log.info("검색어 : {}", name);
        return productService.searchByName(name);
    }

    @PostMapping("/search-by-image")
    public ResponseEntity<Map<String, Object>> searchProductsByImage(@RequestParam("image") MultipartFile imageFile) {
        Map<String, Object> response = new HashMap<>();
        String extractedText = null;
        List<Product> products = Collections.emptyList();

        if (imageFile.isEmpty()) {
            response.put("error", "이미지 파일이 비어 있습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Vision API 서비스 호출하여 텍스트 추출
            extractedText = visionApiService.extractFromImage(imageFile);
            log.info("Vision API 추출 텍스트: {}", extractedText);
            response.put("extractedText", extractedText);

            // 추출된 텍스트가 있으면 상품 검색
            if (extractedText != null && !extractedText.trim().isEmpty()) {
                String query = extractedText.trim();
                products = productService.searchByOcrText(query);
                log.info("이미지 검색 결과 {}개 (검색어: '{}')", products.size(), query);
            } else {
                log.info("추출된 텍스트가 없어 상품 검색을 건너뜀");
                response.put("extractedText", null); // 명시적으로 null 설정
            }
            response.put("products", products);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Vision API 처리 오류 또는 파일 오류", e);
            String errorMessage = e.getMessage() != null && e.getMessage().contains("Vision API")
                    ? "이미지 분석 중 오류가 발생했습니다."
                    : "이미지 파일을 처리하는 중 오류가 발생했습니다.";
            response.put("error", errorMessage);
            response.put("extractedText", null);
            response.put("products", Collections.emptyList());
            //return ResponseEntity.ok(response); // 예: 오류 발생 시 빈 결과 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            log.error("이미지 검색 중 알 수 없는 오류", e);
            response.put("error", "상품 검색 중 알 수 없는 오류가 발생했습니다.");
            response.put("extractedText", null);
            response.put("products", Collections.emptyList());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
