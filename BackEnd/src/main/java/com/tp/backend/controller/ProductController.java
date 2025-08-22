package com.tp.backend.controller;

//import com.tp.backend.domain.Product;
import com.tp.backend.repository.ProductRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/search")
    public List<Map<String, Object>> searchProducts(@RequestParam String name) {
        return productRepository.findByName(name).stream()
                .map(product -> {
                    Map<String, Object> productMap = new HashMap<>();
                    productMap.put("name", product.getName());
                    productMap.put("averagePrice", product.getAveragePrice());
                    return productMap;
                })
                .collect(Collectors.toList());
    }
}
