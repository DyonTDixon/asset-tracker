// Mirrors com.ledger.server.model.WarrantyType
export type WarrantyType = 'MANUFACTURER' | 'EXTENDED' | 'LIFETIME';

// Mirrors com.ledger.server.model.Category
export interface Category {
  id?: number;
  name: string;
  colorCode?: string;
}

// Mirrors com.ledger.server.model.Warranty
// Dates are ISO-8601 strings (YYYY-MM-DD), matching the server's LocalDate.
export interface Warranty {
  id?: number;
  warrantyType: WarrantyType;
  durationMonths?: number;
  expirationDate?: string;
  providerName?: string;
  requiresActivation?: boolean;
  activationDeadline?: string;
}

// Asset Interface - mirrors com.ledger.server.model.Asset
export interface Asset {
  id?: number;
  name: string;
  brand: string;
  model: string;
  serialNumber?: string;
  category?: Category;
  purchasePrice?: number;
  purchaseDate?: string;
  createdAt?: string;
  warranty?: Warranty;
}
