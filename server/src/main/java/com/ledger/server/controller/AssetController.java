package com.ledger.server.controller;

import com.ledger.server.model.Asset;
import com.ledger.server.model.Category;
import com.ledger.server.model.User;
import com.ledger.server.repository.AssetRepository;
import com.ledger.server.repository.CategoryRepository;
import com.ledger.server.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assets")
@CrossOrigin(origins = "http://localhost:4200")
// Ready for Angular to serve as the public HTTP entry point (REST API)
public class AssetController {

    // Placeholder owner used until authentication is wired up (the login page is not connected yet).
    private static final String DEMO_USER_EMAIL = "demo@ledger.local";

    private final AssetRepository assetRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public AssetController(AssetRepository assetRepository,
                           CategoryRepository categoryRepository,
                           UserRepository userRepository) {
        this.assetRepository = assetRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    // GET /api/v1/assets
    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        List<Asset> assets = assetRepository.findAll();
        return ResponseEntity.ok(assets);
    }

    // POST /api/v1/assets
    @PostMapping
    @Transactional
    public ResponseEntity<Asset> createAsset(@RequestBody Asset asset) {
        validate(asset);

        // Never let the client choose the primary key or the owner
        asset.setId(null);
        asset.setUser(resolveOwner());
        asset.setCategory(resolveCategory(asset.getCategory()));

        if (asset.getWarranty() != null) {
            if (asset.getWarranty().getWarrantyType() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Warranty type is required");
            }
            asset.getWarranty().setId(null);
            // Makes sure the warranty's back-reference (asset_id) is set so the cascade persists it
            asset.setWarranty(asset.getWarranty());
        }

        Asset savedAsset = assetRepository.save(asset);
        return new ResponseEntity<>(savedAsset, HttpStatus.CREATED);
    }

    private void validate(Asset asset) {
        if (isBlank(asset.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Asset name is required");
        }
        if (isBlank(asset.getBrand())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Brand is required");
        }
        if (asset.getPurchasePrice() == null || asset.getPurchasePrice().signum() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A non-negative purchase price is required");
        }
        if (asset.getPurchaseDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Purchase date is required");
        }
        if (asset.getCategory() == null || isBlank(asset.getCategory().getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category is required");
        }
    }

    // Looks the category up by name, creating it if it doesn't exist yet
    private Category resolveCategory(Category requested) {
        String name = requested.getName().trim();
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(new Category(name, null)));
    }

    // Uses the first existing user, or creates a non-loginable demo user if the table is empty
    private User resolveOwner() {
        return userRepository.findAll().stream().findFirst()
                .orElseGet(() -> userRepository.save(new User("Demo User", DEMO_USER_EMAIL, "!")));
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
