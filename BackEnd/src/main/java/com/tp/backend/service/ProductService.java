package com.tp.backend.service;

import com.tp.backend.domain.Product;
import com.tp.backend.repository.ProductRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.similarity.FuzzyScore;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final FuzzyScore fuzzy = new FuzzyScore(Locale.ENGLISH);


    public List<Product> searchByName(String query) {
        String lowerQuery = query.toLowerCase();

        List<ProductWithScore> scoredProducts = productRepository.findAll().stream()
                .map(p -> {
                    boolean matchKorean = p.getName().toLowerCase().contains(lowerQuery);
                    int maxScore = Arrays.stream(p.getRoman_name().split(" "))
                            .mapToInt(word -> fuzzy.fuzzyScore(word.toLowerCase(), lowerQuery))
                            .max().orElse(0);

                    int totalScore = matchKorean ? 100 + maxScore : maxScore;

                    return new ProductWithScore(p, totalScore);
                })
                .filter(ps -> ps.score > 0)
                .sorted(Comparator.comparingInt(ProductWithScore::getScore).reversed())
                .limit(5)
                .collect(Collectors.toList());

        return scoredProducts.stream()
                .map(ProductWithScore::getProduct)
                .collect(Collectors.toList());
    }

    public List<Product> searchByOcrText(String ocrText) {
        if (ocrText == null || ocrText.trim().isEmpty()) {
            return List.of();
        }
        // OCR 결과에서 공백을 제거하고 소문자로 변환
        String continuousOcrText = ocrText.replaceAll("\\s+", "").toLowerCase();

        List<ProductWithScore> scoredProducts = productRepository.findAll().stream()
                .map(p -> {
                    // DB 상품명(한글, 로마자)에서 특수문자/공백 기준으로 단어 토큰 추출
                    String[] nameTokens = p.getName().toLowerCase()
                            .replaceAll("[()]", " ").trim().split("\\s+");
                    String[] romanNameTokens = p.getRoman_name().toLowerCase()
                            .replaceAll("[()]", " ").trim().split("\\s+");

                    // 두 토큰 배열을 합침
                    String[] allTokens = Stream.concat(Arrays.stream(nameTokens), Arrays.stream(romanNameTokens))
                            .distinct() // 중복 제거
                            .toArray(String[]::new);

                    int score = 0;
                    // 각 토큰이 공백 없는 OCR 텍스트에 포함되는지 확인
                    for (String token : allTokens) {
                        if (token.length() < 2) continue; // 1글자 단어는 무시 (정확도 향상)
                        if (continuousOcrText.contains(token)) {
                            // 일치하는 단어의 길이만큼 점수 부여 (긴 단어에 가중치)
                            score += token.length();
                        }
                    }

                    return new ProductWithScore(p, score);
                })
                .filter(ps -> ps.getScore() > 0)
                .sorted(Comparator.comparingInt(ProductWithScore::getScore).reversed())
                .limit(5)
                .collect(Collectors.toList());

        return scoredProducts.stream()
                .map(ProductWithScore::getProduct)
                .collect(Collectors.toList());
    }


    @Getter
    private static class ProductWithScore {
        private final Product product;
        private final int score;

        public ProductWithScore(Product product, int score) {
            this.product = product;
            this.score = score;
        }
    }

}
