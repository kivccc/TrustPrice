package com.tp.backend.domain;

public class Product {
    private String name;
    private String manufacturer;
    private double averagePrice;
    private String surveyDate;

    public Product(String name, String manufacturer, double averagePrice, String surveyDate) {
        this.name = name;
        this.manufacturer = manufacturer;
        this.averagePrice = averagePrice;
        this.surveyDate = surveyDate;
    }

    public String getName() {
        return name;
    }

    public double getAveragePrice() {
        return averagePrice;
    }
}
