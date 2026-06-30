package com.example.realestate.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PropertyRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String type;

    @NotBlank
    @Pattern(regexp = "LANCAMENTO|CONSTRUCAO|PRONTO")
    private String enterpriseCondition;

    @NotNull
    @Min(0)
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer bedrooms;

    @NotNull
    @PositiveOrZero
    private Integer bathrooms;

    @NotNull
    @PositiveOrZero
    private Integer suites;

    @NotNull
    @PositiveOrZero
    private Integer parkingSpaces;

    @NotNull
    @PositiveOrZero
    private BigDecimal totalArea;

    @NotNull
    @PositiveOrZero
    private BigDecimal privateArea;

    @NotBlank
    private String address;

    @NotBlank
    private String brokerName;

    private List<String> imageUrls = new ArrayList<>();

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEnterpriseCondition() {
        return enterpriseCondition;
    }

    public void setEnterpriseCondition(String enterpriseCondition) {
        this.enterpriseCondition = enterpriseCondition;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public Integer getSuites() {
        return suites;
    }

    public void setSuites(Integer suites) {
        this.suites = suites;
    }

    public Integer getParkingSpaces() {
        return parkingSpaces;
    }

    public void setParkingSpaces(Integer parkingSpaces) {
        this.parkingSpaces = parkingSpaces;
    }

    public BigDecimal getTotalArea() {
        return totalArea;
    }

    public void setTotalArea(BigDecimal totalArea) {
        this.totalArea = totalArea;
    }

    public BigDecimal getPrivateArea() {
        return privateArea;
    }

    public void setPrivateArea(BigDecimal privateArea) {
        this.privateArea = privateArea;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getBrokerName() {
        return brokerName;
    }

    public void setBrokerName(String brokerName) {
        this.brokerName = brokerName;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}
