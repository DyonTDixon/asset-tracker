import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssetService } from '../../services/asset.service';
import { Asset, Warranty, WarrantyType } from '../../models/asset.models';
import type { DashboardAsset } from '../../pages/dashboard/dashboard';

type WarrantyOption = 'Manufacturer' | 'Extended' | 'Lifetime';

// UI pill label -> value expected by the server's WarrantyType enum
const WARRANTY_TYPE_MAP: Record<WarrantyOption, WarrantyType> = {
  Manufacturer: 'MANUFACTURER',
  Extended: 'EXTENDED',
  Lifetime: 'LIFETIME'
};

const EXPIRING_SOON_DAYS = 30;
const DEFAULT_WARRANTY_MONTHS = 12;

@Component({
  selector: 'app-add-asset-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-asset-modals.html',
  styleUrls: ['./add-asset-modals.css']
})
export class AddAssetModalComponent {
  private fb = inject(FormBuilder);
  private assetService = inject(AssetService);

  @Output() close = new EventEmitter<void>();
  @Output() assetCreated = new EventEmitter<DashboardAsset>();

  isSubmitting = signal(false);
  selectedWarrantyType = signal<WarrantyOption>('Manufacturer');
  selectedFileName = signal<string | null>(null);
  // Kept for a future document-upload endpoint (Document entity); not part of the asset POST body.
  selectedFile = signal<File | null>(null);

  assetForm = this.fb.group({
    name: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    serialNumber: [''],
    categoryName: ['Electronics', Validators.required],
    purchasePrice: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    purchaseDate: ['', Validators.required],
    warrantyDuration: new FormControl<number | null>(DEFAULT_WARRANTY_MONTHS, Validators.min(1)),
    expirationDate: [''],
    requiresActivation: [false],
    activationDeadline: ['']
  });

  setWarrantyType(type: WarrantyOption): void {
    this.selectedWarrantyType.set(type);

    // Lifetime warranties have no duration or expiration. Use control.disable()
    // rather than [disabled] in the template so the form state stays in sync.
    const { warrantyDuration, expirationDate } = this.assetForm.controls;
    if (type === 'Lifetime') {
      warrantyDuration.disable();
      expirationDate.disable();
    } else {
      warrantyDuration.enable();
      expirationDate.enable();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
      this.selectedFileName.set(input.files[0].name);
    }
  }

  dismiss(): void {
    this.close.emit();
  }

  save(): void {
    if (this.assetForm.invalid) {
      this.assetForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formVal = this.assetForm.getRawValue();
    const warranty = this.buildWarranty(formVal);

    const newAssetPayload: Asset = {
      name: formVal.name!,
      brand: formVal.brand!,
      model: formVal.model!,
      serialNumber: formVal.serialNumber || undefined,
      category: { name: formVal.categoryName! },
      purchasePrice: Number(formVal.purchasePrice),
      purchaseDate: formVal.purchaseDate!,
      warranty
    };

    // Send to backend REST endpoint POST /api/v1/assets
    this.assetService.createAsset(newAssetPayload).subscribe({
      next: (saved) => {
        this.isSubmitting.set(false);
        const savedWarranty = saved.warranty ?? warranty;
        const { status, daysRemaining } = this.computeWarrantyStatus(savedWarranty);

        this.assetCreated.emit({
          ...saved,
          warranty: savedWarranty,
          categoryName: saved.category?.name ?? formVal.categoryName!,
          status,
          daysRemaining,
          activationDeadline: savedWarranty.activationDeadline || undefined
        });
        this.dismiss();
      },
      error: (err) => {
        console.error('Error saving asset:', err);
        this.isSubmitting.set(false);
      }
    });
  }

  private buildWarranty(formVal: ReturnType<typeof this.assetForm.getRawValue>): Warranty {
    const warrantyType = WARRANTY_TYPE_MAP[this.selectedWarrantyType()];
    const requiresActivation = !!formVal.requiresActivation;
    const activationDeadline =
      requiresActivation && formVal.activationDeadline ? formVal.activationDeadline : undefined;

    if (warrantyType === 'LIFETIME') {
      return { warrantyType, requiresActivation, activationDeadline };
    }

    const durationMonths = formVal.warrantyDuration ? Number(formVal.warrantyDuration) : undefined;
    // An explicit expiration date wins; otherwise derive it from purchase date + duration.
    const expirationDate =
      formVal.expirationDate ||
      (durationMonths && formVal.purchaseDate
        ? this.addMonths(formVal.purchaseDate, durationMonths)
        : undefined);

    return { warrantyType, durationMonths, expirationDate, requiresActivation, activationDeadline };
  }

  private computeWarrantyStatus(warranty: Warranty): {
    status: NonNullable<DashboardAsset['status']>;
    daysRemaining: number;
  } {
    if (warranty.warrantyType === 'LIFETIME') {
      return { status: 'Lifetime', daysRemaining: 0 };
    }
    if (!warranty.expirationDate) {
      return { status: 'Active', daysRemaining: 0 };
    }

    const [y, m, d] = warranty.expirationDate.split('-').map(Number);
    const now = new Date();
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const daysRemaining = Math.round((Date.UTC(y, m - 1, d) - today) / 86_400_000);

    if (daysRemaining < 0) return { status: 'Expired', daysRemaining };
    if (daysRemaining <= EXPIRING_SOON_DAYS) return { status: 'Expiring Soon', daysRemaining };
    return { status: 'Active', daysRemaining };
  }

  /** Adds calendar months to a YYYY-MM-DD string, clamping to the end of shorter months. */
  private addMonths(isoDate: string, months: number): string {
    const [y, m, d] = isoDate.split('-').map(Number);
    const target = new Date(Date.UTC(y, m - 1 + months, 1));
    const lastDay = new Date(
      Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)
    ).getUTCDate();
    target.setUTCDate(Math.min(d, lastDay));
    return target.toISOString().slice(0, 10);
  }
}
