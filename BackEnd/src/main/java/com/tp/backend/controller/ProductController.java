package com.tp.backend.controller;


import com.tp.backend.domain.Product;
import com.tp.backend.repository.ProductRepository;
import com.tp.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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


    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name) {
        log.info("검색어 : {}", name);
        return productService.searchByName(name);
    }


}
