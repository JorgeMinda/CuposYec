// src/app/pages/admin/work-flows/enrollment-capacity/components/enrollment-capacity/enrollment-capacity.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { EnrollmentCapacityListComponent } from '../enrollment-capacity-list/enrollment-capacity-list.component';
import { EnrollmentCapacityStore } from '../../enrollment-capacity.store';

@Component({
  selector: 'app-enrollment-capacity',
  standalone: true,
  imports: [EnrollmentCapacityListComponent],
  templateUrl: './enrollment-capacity.component.html'
})
export class EnrollmentCapacityComponent implements OnInit {
  private readonly store = inject(EnrollmentCapacityStore);

  ngOnInit(): void {
    this.store.loadInitialData();
  }
}