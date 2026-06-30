package com.example.realestate.repository;

import com.example.realestate.entity.Property;
import com.example.realestate.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    @Query("SELECT p FROM Property p WHERE p.active = true " +
        "AND (:type = '' OR LOWER(p.type) = LOWER(:type)) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND (:minBedrooms IS NULL OR p.bedrooms >= :minBedrooms) " +
        "AND (:query = '' OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%'))) ")
    Page<Property> search(@Param("type") String type,
                          @Param("minPrice") BigDecimal minPrice,
                          @Param("maxPrice") BigDecimal maxPrice,
                          @Param("minBedrooms") Integer minBedrooms,
                          @Param("query") String query,
                          Pageable pageable);

    Page<Property> findByOwner(User owner, Pageable pageable);
}
