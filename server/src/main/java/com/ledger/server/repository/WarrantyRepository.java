package com.ledger.server.repository;

import com.ledger.server.model.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

//Interfaces with the warranties table to fetch coverage details by asset (findByAssetId) and query expiring items (findByExpirationDateLessThanEqual).

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    Optional<Warranty> findByAssetId(Long assetId);
    List<Warranty> findByExpirationDateLessThanEqual(LocalDate date);
}
