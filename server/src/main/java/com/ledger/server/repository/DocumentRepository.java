package com.ledger.server.repository;

import com.ledger.server.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    // Fetch all files/receipts attached to a specific asset
    List<Document> findByAssetId(Long assetId);
}