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
