package com.ledger.server.repository;

import com.ledger.server.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long>{

        //Retrieves the asset belonging to the specific user
        List<Asset> findByUserId(Long userId);

        //Filter the assets by categories for the user
        List<Asset> findByUserIdAndCategoryId(Long userId, Long categoryId);

        //Search the assets by name (case-insensitive)
        List<Asset> findByUserIdAndNameContainingIgnoreCaseOrBrandContainingIgnoreCase(
                Long userId, String name, String brand
        );
}
