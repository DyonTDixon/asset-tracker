import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset.models';

@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'app-assets',
  styleUrl: './assets.css',
  templateUrl: './assets.html',
})
export class AssetsComponent implements OnInit {
  private assetService = inject(AssetService);

  assets = signal<Asset[]>([]);
  errorMessage = signal<string | null>(null);

  newAsset: Asset = {
    name: '',
    brand: '',
    model: '',
    purchasePrice: 0
  };

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.assetService.getAssets().subscribe({
      next: (data) => this.assets.set(data),
      error: (err) => this.errorMessage.set('Failed to connect to backend:' + err.message)
    });
  }

  addAsset(): void {
    if (!this.newAsset.name.trim()) return;

    this.assetService.createAsset(this.newAsset).subscribe({
      next: (saved) => {
        this.assets.update((items) => [...items, saved]);
        this.newAsset = { name: '', brand: '', model: '', purchasePrice: 0 };
      },
      error: (err) => this.errorMessage.set('Failed to save asset: ' + err.message)
    });
  }
}
