// src/app/pages/admin/work-flows/enrollment-capacity/enrollment-capacity.store.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  EnrollmentCapacityState,
  INITIAL_ENROLLMENT_CAPACITY_STATE,
  RowInterface,
  CapacityRawInterface,
  CareerInterface,
  TeacherDistributionInterface,
  CatalogueInterface,
  ClassroomInterface,
} from './enrollment-capacity.state';
import { EnrollmentCapacityHttpService } from '../../services/enrollment-capacity-http.service';

const FORM_STATE_KEY = 'enrollment-capacity-state-v2';

@Injectable({ providedIn: 'root' })
export class EnrollmentCapacityStore {
  private readonly httpService = inject(EnrollmentCapacityHttpService);

  readonly state = signal<any>({
    careers: [],
    teacherDistributions: [],
    academicPeriods: [],
    schoolPeriods: [], // Periodos 2026-I, etc.
    classrooms: [],
    parallels: [],
    workdays: [],
    capacitiesRaw: [],
    formState: { careerId: '', teacherDistributionId: '', academicPeriodId: '' }
  });

  readonly formState = computed(() => this.state().formState);
  readonly academicPeriodId = computed(() => this.state().formState.academicPeriodId);

  readonly careers = computed(() => this.state().careers);
  readonly teacherDistributions = computed(() => this.state().teacherDistributions);
  readonly academicPeriods = computed(() => this.state().academicPeriods);
  readonly schoolPeriods = computed(() => this.state().schoolPeriods); 
  readonly classrooms = computed(() => this.state().classrooms);
  readonly parallels = computed(() => this.state().parallels);
  readonly workdays = computed(() => this.state().workdays);
  readonly capacitiesRaw = computed(() => this.state().capacitiesRaw);

  updateFormState(newFormState: Partial<any>): void {
    this.state.update((s: any) => ({
      ...s,
      formState: {
        ...s.formState,
        ...newFormState,
      },
    }));
  }

  loadInitialData(): void {
    this.loadCatalogues();
    this.loadClassrooms();
  }

  loadCatalogues() {
    this.httpService.findCatalogues().subscribe({
      next: (data: any) => {
        this.state.update((s: any) => ({
          ...s,
          careers: data.careers || [],
          teacherDistributions: (data.teacherDistributions || []).map((td: any) => ({
            ...td,
            name: `${td.subject?.name ?? 'Sin materia'} - Paralelo ${td.parallel?.name ?? '?'} - ${td.workday?.name ?? 'Sin jornada'}`
          })),
          academicPeriods: data.academicPeriods || [],
          schoolPeriods: data.schoolPeriods || [], 
          parallels: data.parallels || [],
          workdays: data.workdays || [],
        }));
      },
      error: (err) => {
        console.error('Error cargando catálogos', err);
      }
    });
  }

  loadClassrooms() {
    this.httpService.findClassrooms().subscribe({
      next: (data: any) => {
        this.state.update((s: any) => ({
          ...s,
          classrooms: data || [],
        }));
      },
      error: (err) => {
        console.error('Error cargando aulas', err);
      }
    });
  }

  loadCapacities(careerId: string) {
    this.httpService.findAll(careerId).subscribe({
      next: (data: any) => {
        this.state.update((s: any) => ({
          ...s,
          capacitiesRaw: data || [],
        }));
      },
      error: (err) => {
        console.error('Error cargando capacities', err);
      }
    });
  }
}