package com.example.realestate.service;

import com.example.realestate.entity.Favorite;
import com.example.realestate.entity.Property;
import com.example.realestate.entity.User;
import com.example.realestate.repository.FavoriteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;

    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    @Transactional
    public Favorite addFavorite(User user, Property property) {
        return favoriteRepository.findByUserAndProperty(user, property)
                .orElseGet(() -> favoriteRepository.save(new Favorite(user, property)));
    }

    @Transactional
    public void removeFavorite(User user, Property property) {
        favoriteRepository.findByUserAndProperty(user, property)
                .ifPresent(favoriteRepository::delete);
    }

    public List<Favorite> listFavorites(User user) {
        return favoriteRepository.findByUser(user);
    }
}
