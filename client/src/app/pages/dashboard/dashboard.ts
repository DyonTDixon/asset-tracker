import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset.models';

export interface DashboardAsset extends Asset {
  categoryName?: string;
  status?: 'Active' | 'Expiring Soon' | 'Expired' | 'Lifetime';
  daysRemaining?: number;
  activationDeadline?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private assetService = inject(AssetService);

  searchQuery = signal<string>('');
  selectedFilter = signal<string>('All');
  filterPills = ['All', 'Active', 'Expiring Soon', 'Expired', 'Lifetime'];

  // Mock initial dataset matching the Figma dashboard layout
  assets = signal<DashboardAsset[]>([
    {
      id: 1,
      name: 'Sony WH-1000XM5',
      brand: 'Sony',
      model: 'WH-1000XM5',
      serialNumber: 'SN-48213-X',
      purchasePrice: 349,
      categoryName: 'Electronics',
      status: 'Active',
      daysRemaining: 87
    },
    {
      id: 2,
      name: 'MacBook Pro 16"',
      brand: 'Apple',
      model: 'M3 Max',
      serialNumber: 'SN-55831-M',
      purchasePrice: 2899,
      categoryName: 'Electronics',
      status: 'Active',
      daysRemaining: 301,
      activationDeadline: 'Aug 15, 2026'
    },
    {
      id: 3,
      name: 'KitchenAid Stand Mixer',
      brand: 'KitchenAid',
      model: 'Artisan 5-Qt',
      serialNumber: 'SN-90211-A',
      purchasePrice: 429,
      categoryName: 'Appliances',
      status: 'Lifetime',
      daysRemaining: 0
    },
    {
      id: 4,
      name: 'Vitamix A3500',
      brand: 'Vitamix',
      model: 'Ascent A3500',
      serialNumber: 'SN-22190-V',
      purchasePrice: 549,
      categoryName: 'Appliances',
      status: 'Active',
      daysRemaining: 150
    },
    {
      id: 5,
      name: 'Peloton Bike+',
      brand: 'Peloton',
      model: 'Bike+',
      serialNumber: 'SN-77211-P',
      purchasePrice: 2495,
      categoryName: 'Fitness',
      status: 'Expiring Soon',
      daysRemaining: 12
    },
    {
      id: 6,
      name: 'Garmin Fenix 7',
      brand: 'Garmin',
      model: 'Fenix 7 Solar',
      serialNumber: 'SN-33100-G',
      purchasePrice: 699,
      categoryName: 'Fitness',
      status: 'Expiring Soon',
      daysRemaining: 18
    }
  ]);

  // Dynamic KPI calculations
  totalLoggedAssets = computed(() => this.assets().length);
  totalFinancialValue = computed(() => 
    this.assets().reduce((acc, a) => acc + (a.purchasePrice || 0), 0)
  );
  activeWarranties = computed(() => 
    this.assets().filter(a => a.status === 'Active' || a.status === 'Lifetime').length
  );
  expiringSoonCount = computed(() => 
    this.assets().filter(a => a.status === 'Expiring Soon').length
  );

  // Expiring items for the right-hand widget
  expiringAssets = computed(() => 
    this.assets()
      .filter(a => (a.daysRemaining ?? 0) > 0 && (a.daysRemaining ?? 0) <= 30)
      .sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0))
  );

  // Grouped assets for the central feed
  categories = computed(() => {
    const map = new Map<string, DashboardAsset[]>();
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.selectedFilter();

    this.assets().forEach(item => {
      const matchesSearch = !query || 
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        (item.serialNumber && item.serialNumber.toLowerCase().includes(query));

      const matchesFilter = filter === 'All' || item.status === filter;

      if (matchesSearch && matchesFilter) {
        const cat = item.categoryName || 'Other';
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat)!.push(item);
      }
    });

    return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
  });

  ngOnInit(): void {
    // Optionally fetch live entries from backend API
    this.assetService.getAssets().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Merge API results with mock state when live data exists
        }
      },
      error: () => {}
    });
  }

  setFilter(filter: string): void {
    this.selectedFilter.set(filter);
  }
}