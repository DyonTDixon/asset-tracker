package com.ledger.server.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "warranties")
public class Warranty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false, unique = true)
    private Asset asset;

    @Enumerated(EnumType.STRING)
    @Column(name = "warranty_type", nullable = false)
    private WarrantyType warrantyType;

    @Column(name = "duration_months")
    private Integer durationMonths;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(name = "provider_name", length = 100)
    private String providerName;

    @Column(name = "requires_activation")
    private Boolean requiresActivation = false;

    @Column(name = "activation_deadline")
    private LocalDate activationDeadline;

    public Warranty() {}

    // Getters and Setters for Warranties

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Asset getAsset() { return asset; }
    public void setAsset(Asset asset) { this.asset = asset; }

    public WarrantyType getWarrantyType() { return warrantyType; }
    public void setWarrantyType(WarrantyType warrantyType) { this.warrantyType = warrantyType; }

    public Integer getDurationMonths() { return durationMonths; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }

    public LocalDate getExpirationDate() { return expirationDate; }
    public void setExpirationDate(LocalDate expirationDate) { this.expirationDate = expirationDate; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public Boolean getRequiresActivation() { return requiresActivation; }
    public void setRequiresActivation(Boolean requiresActivation) { this.requiresActivation = requiresActivation; }

    public LocalDate getActivationDeadline() { return activationDeadline; }
    public void setActivationDeadline(LocalDate activationDeadline) { this.activationDeadline = activationDeadline; }
}
