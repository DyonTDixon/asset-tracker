package com.ledger.server.controller;

import com.ledger.server.model.Asset;
import com.ledger.server.repository.AssetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assets")
@CrossOrigin(origins = "http://localhost:4200")
// Ready for Angular to serve as the public HTTP entry point (REST API)
public class AssetController {

    private AssetRepository assetRepository;

    public AssetController(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    // GET /api/v1/assets
    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        List<Asset> assets = assetRepository.findAll();
        return ResponseEntity.ok(assets);
    }

    // POST /api/v1/assets
    @PostMapping
    public ResponseEntity<Asset> createAsset(@RequestBody Asset asset) {
        Asset savedAsset = assetRepository.save(asset);
        return new ResponseEntity<>(savedAsset, HttpStatus.CREATED);
    }
}
