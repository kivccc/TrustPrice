package com.tp.backend.domain;

public class Product {
    private String name;
    private String manufacturer;
    private int averagePrice;
    private String surveyDate;
    private String roman_name;

    public Product(String name, String manufacturer, double averagePrice, String surveyDate,String roman_name) {
        this.name = name;
        this.manufacturer = manufacturer;
        this.averagePrice = (int)averagePrice;
        this.surveyDate = surveyDate;
        this.roman_name = roman_name;
    }

    public String getName() {
        return name;
    }
    public String getRoman_name() {return roman_name;}

    public double getAveragePrice() {
        return averagePrice;
    }
}
