package com.tp.backend.repository;

import com.tp.backend.domain.Product;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ProductRepository {
    private final List<Product> products = new ArrayList<>();

    @Value("classpath:preprocessed_data.csv")
    private Resource resource;

    @PostConstruct
    public void init() {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            br.readLine(); // 헤더 스킵
            String line;
            while ((line = br.readLine()) != null) {
                // 정규화
                String[] productData = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                if (productData.length == 4) {
                    String name = productData[0].replace("\"", "");
                    String manufacturer = productData[1].replace("\"", "");
                    double averagePrice = Double.parseDouble(productData[2]);
                    String surveyDate = productData[3];
                    Product product = new Product(name, manufacturer, averagePrice, surveyDate);
                    products.add(product);
                }
            }
        } catch (IOException | NumberFormatException e) {
            // 에러 처리
            e.printStackTrace();
            throw new RuntimeException("Could not initialize ProductRepository", e);
        }
    }

    public List<Product> findByName(String name) {
        return products.stream()
                .filter(product -> product.getName().contains(name))
                .collect(Collectors.toList());
    }
}
