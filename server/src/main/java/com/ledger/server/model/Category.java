package com.ledger.server.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "color_code", length = 10)
    private String colorCode;

    public Category() {}

    public Category(String name, String colorCode) {
        this.name = name;
        this.colorCode = colorCode;
    }

    //Getters and Setters for Categories
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getColorCode() {return colorCode;}
    public void setColorCode(String colorCode) {this.colorCode = colorCode;}
}
