package com.example.realestate.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PropertyResponse {
    private Long id;
    private String title;
    private String description;
    private String type;
    private String enterpriseCondition;
    private BigDecimal price;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer suites;
    private Integer parkingSpaces;
    private BigDecimal totalArea;
    private BigDecimal privateArea;
    private String address;
    private String brokerName;
    private List<String> imageUrls = new ArrayList<>();
    private boolean active;
    private Long ownerId;
    private String ownerEmail;

    public PropertyResponse() {
    }

    public PropertyResponse(Long id, String title, String description, String type, String enterpriseCondition, BigDecimal price, Integer bedrooms,
                            Integer bathrooms, Integer suites, Integer parkingSpaces, BigDecimal totalArea,
                            BigDecimal privateArea, String address, String brokerName, List<String> imageUrls, boolean active,
                            Long ownerId, String ownerEmail) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.enterpriseCondition = enterpriseCondition;
        this.price = price;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.suites = suites;
        this.parkingSpaces = parkingSpaces;
        this.totalArea = totalArea;
        this.privateArea = privateArea;
        this.address = address;
        this.brokerName = brokerName;
        this.imageUrls = imageUrls;
        this.active = active;
        this.ownerId = ownerId;
        this.ownerEmail = ownerEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }
}
