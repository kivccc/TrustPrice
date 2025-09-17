package com.tp.backend.domain;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Product {


    public Product() {}

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String manufacturer;
    private double averagePrice;
    private String surveyDate;
    private String roman_name;

    public Product(String name, String manufacturer, double averagePrice, String surveyDate,String roman_name) {
        this.name = name;
        this.manufacturer = manufacturer;
        this.averagePrice = (int)averagePrice;
        this.surveyDate = surveyDate;
        this.roman_name = roman_name;
    }


}
