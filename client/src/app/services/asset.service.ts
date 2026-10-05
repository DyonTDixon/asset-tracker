import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asset } from '../models/asset.models';

@Injectable({
  providedIn: 'root'
})

export class AssetService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/assets';

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.apiUrl);
  }

  createAsset(asset: Asset): Observable<Asset> {
    return this.http.post<Asset>(this.apiUrl, asset);
  }

  updateAsset(id: number, asset: Asset): Observable<Asset> {
    return this.http.put<Asset>(`${this.apiUrl}/${id}`, asset);
  }

  deleteAsset(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}