// src/app/pages/admin/work-flows/enrollment-capacity/components/selectors-data/selectors-data.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { EnrollmentCapacityStore } from '../../enrollment-capacity.store';

@Component({
  selector: 'app-selectors-data',
  standalone: true,
  imports: [FormsModule, SelectModule],
  template: `<div></div>`
})
export class SelectorsDataComponent {
  protected readonly store = inject(EnrollmentCapacityStore);
}