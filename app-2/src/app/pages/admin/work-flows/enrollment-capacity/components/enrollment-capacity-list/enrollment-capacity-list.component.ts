// src/app/pages/admin/work-flows/enrollment-capacity/components/enrollment-capacity-list/enrollment-capacity-list.component.ts
import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { form, FieldTree, required, SchemaPathTree } from '@angular/forms/signals';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api'; // 👈 1. IMPORTADO MessageService
import { FormRegistryService } from '@utils/services/form-registry.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { EnrollmentCapacityStore } from '../../enrollment-capacity.store';
import { EnrollmentCapacityFormData, RowInterface, CellInterface } from '../../enrollment-capacity.state';
import { EnrollmentCapacityHttpService } from '../../../../services/enrollment-capacity-http.service';

const FORM_STATE_KEY = 'enrollmentCapacityData';

@Component({
    selector: 'app-enrollment-capacity-list',
    standalone: true,
    imports: [FormsModule, Select, LabelDirective, ErrorMessageDirective, Dialog, InputNumber, ConfirmDialog],
    providers: [ConfirmationService], // Mantenemos tu ConfirmationService local
    templateUrl: './enrollment-capacity-list.component.html'
})
export class EnrollmentCapacityListComponent implements OnInit, OnDestroy {
    private readonly _formRegistryService = inject(FormRegistryService);
    private readonly httpService = inject(EnrollmentCapacityHttpService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService); // 👈 2. INYECTADO MessageService
    protected readonly store = inject(EnrollmentCapacityStore);

    protected readonly careers = computed(() => this.store.careers());
    protected readonly teacherDistributions = computed(() => this.store.teacherDistributions());
    protected readonly academicPeriods = computed(() => this.store.academicPeriods());
    protected readonly classrooms = computed(() => this.store.classrooms());
    protected readonly parallels = computed(() => this.store.parallels());
    protected readonly workdays = computed(() => this.store.workdays());

    protected readonly nivelSeleccionadoId = signal<string | null>(null);

    protected readonly nombreNivelActivo = computed(() => {
        const activo = this.academicPeriods().find((n: any) => n.id === this.nivelSeleccionadoId());
        return activo ? activo.name : 'Ninguno';
    });

    protected readonly form$ = signal<EnrollmentCapacityFormData>(this.store.formState());
    protected readonly formData: FieldTree<EnrollmentCapacityFormData> = form(this.form$, (schema) => {
        this.validateForm(schema);
    });

    get careerField() { return this.formData.careerId; }
    get teacherDistributionField() { return this.formData.teacherDistributionId; }

    // --- MATRIZ REAL, derivada de capacitiesRaw + nivel seleccionado ---
    protected readonly matrizJornadas = computed<RowInterface[]>(() => {
        const nivelId = this.nivelSeleccionadoId();
        if (!nivelId) return [];

        const cupos = this.store.capacitiesRaw().filter(
            (c: any) => c.academicPeriodId === nivelId
        );

        const porJornada = new Map<string, RowInterface>();

        for (const cupo of cupos) {
            const workdayId = cupo.workday?.id ?? 'sin-jornada';
            const workdayName = cupo.workday?.name ?? 'Sin jornada';

            if (!porJornada.has(workdayId)) {
                porJornada.set(workdayId, {
                    jornadaId: workdayId,
                    jornadaNombre: workdayName,
                    bloquesHorarios: [{
                        horarioNombre: workdayName,
                        celdas: []
                    }]
                });
            }

            const celda: CellInterface = {
                id: cupo.id,
                horario: workdayName,
                paralelo: cupo.parallel?.name ?? '?',
                cupoMaximo: cupo.capacity ?? 0,
                estudiantesContados: cupo.studentsCount ?? 0,
                colorSemaforo: this.calcularColorSemaforo(cupo.capacity, cupo.studentsCount),
                aulaNombre: cupo.classroom?.name,
                classroomId: cupo.classroomId ?? null,
            };

            porJornada.get(workdayId)!.bloquesHorarios[0].celdas.push(celda);
        }

        return Array.from(porJornada.values());
    });

    // --- ESTADO DEL MODAL DE GESTIÓN DE CUPOS ---
    protected readonly modalVisible = signal(false);
    protected readonly modoEdicion = signal(false);
    protected readonly celdaSeleccionada = signal<CellInterface | null>(null);
    protected readonly capacidadEditada = signal<number>(30);
    protected readonly aulaEditada = signal<string | null>(null);
    protected readonly paraleloNuevo = signal<string | null>(null);
    protected readonly jornadaNueva = signal<string | null>(null);

    constructor() {
        effect(() => {
            this.store.updateFormState(this.form$());
        });
    }

    ngOnInit(): void {
        this._formRegistryService.register('Capacidad de Matrícula', FORM_STATE_KEY, this.formData, this.form$());

        this.store.loadCatalogues();
        this.store.loadClassrooms();

        const savedLevel = this.store.academicPeriodId();
        if (savedLevel) {
            this.nivelSeleccionadoId.set(savedLevel);
        }

        const savedCareerId = this.form$().careerId;
        if (savedCareerId) {
            this.store.loadCapacities(savedCareerId);
        }
    }

    private validateForm(schema: SchemaPathTree<EnrollmentCapacityFormData>): void {
        required(schema.careerId, { message: 'La carrera es requerida de manera obligatoria' });
        required(schema.teacherDistributionId, { message: 'La distribución de docentes es requerida de manera obligatoria' });
    }

    protected seleccionarNivel(id: string): void {
        this.nivelSeleccionadoId.set(id);
        this.form$.update(prev => ({ ...prev, academicPeriodId: id }));
    }

    protected onCareerChange(careerId: string): void {
        this.form$.update(v => ({ ...v, careerId }));
        if (careerId) {
            this.store.loadCapacities(careerId);
        }
    }

    protected abrirEdicionCupo(celda: CellInterface): void {
        this.modoEdicion.set(true);
        this.celdaSeleccionada.set(celda);
        this.capacidadEditada.set(celda.cupoMaximo);
        this.aulaEditada.set(celda.classroomId ?? null);
        this.modalVisible.set(true);
    }

    protected abrirCreacionCupo(): void {
        if (!this.nivelSeleccionadoId()) return;

        this.modoEdicion.set(false);
        this.celdaSeleccionada.set(null);
        this.capacidadEditada.set(30);
        this.aulaEditada.set(null);
        this.paraleloNuevo.set(null);
        this.jornadaNueva.set(null);
        this.modalVisible.set(true);
    }

    protected cerrarModal(): void {
        this.modalVisible.set(false);
        this.celdaSeleccionada.set(null);
    }

    // --- 🛡️ GUARDAR CUPO MODIFICADO PARA NOTIFICACIONES ---
    protected guardarCupo(): void {
        if (this.modoEdicion()) {
            const celda = this.celdaSeleccionada();
            if (!celda) return;

            this.httpService.update(celda.id, {
                capacity: this.capacidadEditada(),
                classroomId: this.aulaEditada(),
            }).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Cupo actualizado con éxito.', life: 3000 });
                    this.refrescarYCerrar();
                },
                error: (err) => {
                    console.error('Error al guardar el cupo', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error al actualizar',
                        detail: err.error?.message || 'No se pudo actualizar el cupo.',
                        life: 4000
                    });
                },
            });
        } else {
            const careerId = this.form$().careerId;
            const parallelId = this.paraleloNuevo();
            const workdayId = this.jornadaNueva();
            const academicPeriodId = this.nivelSeleccionadoId();

            if (!careerId || !parallelId || !workdayId || !academicPeriodId) {
                this.messageService.add({ severity: 'warn', summary: 'Campos Vacíos', detail: 'Faltan datos obligatorios para crear el cupo' });
                return;
            }

            this.httpService.register({
                careerId,
                parallelId,
                workdayId,
                academicPeriodId,
                classroomId: this.aulaEditada(),
                capacity: this.capacidadEditada(),
            }).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Nuevo cupo registrado con éxito.', life: 3000 });
                    this.refrescarYCerrar();
                },
                error: (err) => {
                    // 🚨 CAPTURA AQUÍ EL ERROR HTTP 409 DE DUPLICADO
                    console.error('Error al crear el cupo', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Conflicto de Planificación',
                        // Extrae el mensaje de NestJS ('Ya existe un registro con...')
                        detail: err.error?.message || 'El paralelo seleccionado ya se encuentra configurado en esta jornada.',
                        life: 5000
                    });
                },
            });
        }
    }

    protected confirmarBorrado(): void {
        const celda = this.celdaSeleccionada();
        if (!celda) return;

        this.confirmationService.confirm({
            header: '¿Eliminar cupo?',
            message: `¿Estás seguro de que deseas eliminar el cupo del Paralelo ${celda.paralelo} - ${celda.horario}? Esta acción no se puede deshacer.`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonProps: { severity: 'danger' },
            rejectButtonProps: { severity: 'secondary', outlined: true },
            accept: () => this.borrarCupo(),
        });
    }

    // --- 🛡️ BORRAR CUPO MODIFICADO PARA NOTIFICACIONES ---
    private borrarCupo(): void {
        const celda = this.celdaSeleccionada();
        if (!celda) return;

        this.httpService.remove(celda.id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'El cupo ha sido eliminado correctamente.', life: 3000 });
                this.refrescarYCerrar();
            },
            error: (err) => {
                console.error('Error al borrar el cupo', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error al eliminar',
                    detail: err.error?.message || 'No se pudo eliminar el cupo.',
                    life: 4000
                });
            },
        });
    }

    private refrescarYCerrar(): void {
        const careerId = this.form$().careerId;
        if (careerId) this.store.loadCapacities(careerId);
        this.cerrarModal();
    }

    private calcularColorSemaforo(capacidad: number | undefined, inscritos: number | undefined): 'verde' | 'naranja' | 'rojo' {
        const cap = capacidad ?? 0;
        const ins = inscritos ?? 0;

        if (cap === 0) return 'rojo';

        const porcentaje = ins / cap;
        if (porcentaje >= 1) return 'rojo';
        if (porcentaje >= 0.8) return 'naranja';
        return 'verde';
    }

    ngOnDestroy(): void {
        this._formRegistryService.unregister(FORM_STATE_KEY);
    }
}