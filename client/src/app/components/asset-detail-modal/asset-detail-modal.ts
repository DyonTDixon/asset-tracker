import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssetService } from '../../services/asset.service';
import { DashboardAsset } from '../../pages/dashboard/dashboard';

@Component({
  selector: 'app-asset-detail-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './asset-detail-modal.html',
  styleUrls: ['./asset-detail-modal.css']
})
export class AssetDetailModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private assetService = inject(AssetService);

  @Input({ required: true }) asset!: DashboardAsset;
  @Output() close = new EventEmitter<void>();
  @Output() assetUpdated = new EventEmitter<DashboardAsset>();
  @Output() assetDeleted = new EventEmitter<number>();

  isEditMode = signal(false);
  isSubmitting = signal(false);
  selectedWarrantyType = signal<'Manufacturer' | 'Extended' | 'Lifetime'>('Manufacturer');

  editForm = this.fb.group({
    name: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    serialNumber: [''],
    categoryName: ['Electronics', Validators.required],
    purchasePrice: [0, [Validators.required, Validators.min(0)]],
    purchaseDate: ['', Validators.required],
    warrantyDuration: [12],
    expirationDate: [''],
    requiresActivation: [false]
  });

  ngOnInit(): void {
    this.initEditForm();
  }

  initEditForm(): void {
    this.editForm.patchValue({
      name: this.asset.name,
      brand: this.asset.brand,
      model: this.asset.model,
      serialNumber: this.asset.serialNumber || '',
      categoryName: this.asset.categoryName || 'Electronics',
      purchasePrice: this.asset.purchasePrice || 0,
      purchaseDate: this.asset.purchaseDate || '2026-04-10',
      warrantyDuration: 12,
      expirationDate: '2028-11-21'
    });
  }

  switchToEdit(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    this.isEditMode.set(false);
  }

  dismiss(): void {
    this.close.emit();
  }

  setWarrantyType(type: 'Manufacturer' | 'Extended' | 'Lifetime'): void {
    this.selectedWarrantyType.set(type);
  }

  onDelete(): void {
    if (!this.asset.id) return;
    if (confirm(`Are you sure you want to delete ${this.asset.name}?`)) {
      this.assetService.deleteAsset(this.asset.id).subscribe({
        next: () => {
          this.assetDeleted.emit(this.asset.id!);
          this.dismiss();
        },
        error: (err) => console.error('Failed to delete asset', err)
      });
    }
  }

  onSave(): void {
    if (this.editForm.invalid || !this.asset.id) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.editForm.value;

    const payload = {
      name: formVal.name!,
      brand: formVal.brand!,
      model: formVal.model!,
      serialNumber: formVal.serialNumber || undefined,
      purchasePrice: Number(formVal.purchasePrice),
      purchaseDate: formVal.purchaseDate!
    };

    this.assetService.updateAsset(this.asset.id, payload).subscribe({
      next: (updated) => {
        this.isSubmitting.set(false);
        const merged: DashboardAsset = {
          ...this.asset,
          ...updated,
          categoryName: formVal.categoryName!,
          status: this.selectedWarrantyType() === 'Lifetime' ? 'Lifetime' : 'Active'
        };
        this.assetUpdated.emit(merged);
        this.dismiss();
      },
      error: (err) => {
        console.error('Failed to update asset', err);
        this.isSubmitting.set(false);
      }
    });
  }
}