//Asset Interface
export interface Asset {
  id?: number;
  name: string;
  brand: string;
  model: string;
  serialNumber?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  createdAt?: string;
}
