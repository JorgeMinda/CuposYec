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

  readonly state = signal<EnrollmentCapacityState>(this.loadFromStorage());

  // --- ALIAS EXACTOS PARA TU COMPONENTE ---
  readonly formState = computed(() => this.state().formState);
  readonly academicPeriodId = computed(() => this.state().formState.academicPeriodId);

  readonly careers = computed<CareerInterface[]>(() => this.state().careers);
  readonly teacherDistributions = computed<TeacherDistributionInterface[]>(() => this.state().teacherDistributions);
  readonly academicPeriods = computed<CatalogueInterface[]>(() => this.state().academicPeriods);
  readonly classrooms = computed<ClassroomInterface[]>(() => this.state().classrooms);
  readonly parallels = computed<CatalogueInterface[]>(() => this.state().parallels);
  readonly workdays = computed<CatalogueInterface[]>(() => this.state().workdays);
  readonly capacitiesRaw = computed<CapacityRawInterface[]>(() => this.state().capacitiesRaw);

  // --- MÉTODO QUE TU COMPONENTE ESPERA ---
  updateFormState(
    newFormState: Partial<EnrollmentCapacityState['formState']>
  ): void {
    this.state.update((s) => ({
      ...s,
      formState: {
        ...s.formState,
        ...newFormState,
      },
    }));
  }

  private loadFromStorage(): EnrollmentCapacityState {
    const stored = sessionStorage.getItem(FORM_STATE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_ENROLLMENT_CAPACITY_STATE;
  }

  loadInitialData(): void {
    this.loadCatalogues();
    this.loadClassrooms();
  }

  loadCatalogues() {
    this.httpService.findCatalogues().subscribe({
      next: (data: any) => {
        this.state.update((s) => ({
          ...s,
          careers: data.careers || [],
          teacherDistributions: (data.teacherDistributions || []).map((td: any) => ({
            ...td,
            name: `${td.subject?.name ?? 'Sin materia'} - Paralelo ${td.parallel?.name ?? '?'} - ${td.workday?.name ?? 'Sin jornada'}`
          })),
          academicPeriods: data.academicPeriods || [],
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
      next: (data: ClassroomInterface[]) => {
        this.state.update((s) => ({
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
      next: (data: CapacityRawInterface[]) => {
        this.state.update((s) => ({
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