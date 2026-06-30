package com.example.realestate.repository;

import com.example.realestate.entity.Favorite;
import com.example.realestate.entity.Property;
import com.example.realestate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    Optional<Favorite> findByUserAndProperty(User user, Property property);
}
