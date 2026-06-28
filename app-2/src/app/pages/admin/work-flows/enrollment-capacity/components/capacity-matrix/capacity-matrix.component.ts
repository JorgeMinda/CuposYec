// src/app/pages/admin/work-flows/enrollment-capacity/components/capacity-matrix/capacity-matrix.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { EnrollmentCapacityStore } from '../../enrollment-capacity.store';

@Component({
  selector: 'app-capacity-matrix',
  standalone: true,
  imports: [FormsModule, DialogModule, InputTextModule, ButtonModule, ChartModule],
  template: `<div></div>` 
})
export class CapacityMatrixComponent {
  protected readonly store = inject(EnrollmentCapacityStore);
  
  readonly chartOptions = signal({
    cutout: '78%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  });
}