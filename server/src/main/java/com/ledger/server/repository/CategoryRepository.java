package com.ledger.server.repository;

import com.ledger.server.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

//Interacts with the categories table to populate frontend dropdowns, category badges, and hex color codes.

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
}
