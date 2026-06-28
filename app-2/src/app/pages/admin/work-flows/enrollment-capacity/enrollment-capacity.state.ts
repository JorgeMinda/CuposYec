// src/app/pages/admin/work-flows/enrollment-capacity/enrollment-capacity.state.ts

// --- CATÁLOGO GENÉRICO (usado por academicPeriod, parallel, workday, type, etc.) ---
export interface CatalogueInterface {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isVisible?: boolean;
  parentId?: string | null;
  code: string;
  description?: string;
  name: string;
  required?: boolean;
  sort?: number;
  type: string;
}

// --- CARRERA ---
export interface CareerInterface {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isVisible?: boolean;
  isEnabled?: boolean;
  institutionId: string;
  modalityId: string;
  stateId?: string;
  typeId?: string;
  acronym: string;
  code: string;
  codeSniese?: string;
  degree: string;
  name: string;
  shortName: string;
  resolutionNumber?: string;
}

// --- DISTRIBUCIÓN DE DOCENTES ---
export interface TeacherDistributionInterface {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  parallelId: string;
  schoolPeriodId: string;
  subjectId: string;
  teacherId?: string | null;
  workdayId: string;
  capacity?: number;
  hours?: number;
  parallel?: CatalogueInterface;
  workday?: CatalogueInterface;
  subject?: { id: string; name: string; [key: string]: any };
  schoolPeriod?: { id: string; name: string; [key: string]: any };
  teacher?: any;
  name?: string; // calculado en el store: "{materia} - Paralelo {x} - {jornada}"
}

// --- AULA ---
export interface ClassroomInterface {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  stateId: string;
  typeId: string;
  capacity: number;
  code: string;
  name: string;
  location: string;
}

// --- INTERFAZ PLANA PARA EL FORMULARIO (SELECTS) ---
export interface EnrollmentCapacityFormData {
  careerId: string | null;
  teacherDistributionId: string | null;
  academicPeriodId: string | null;
}

// --- INTERFAZ PARA LA MATRIZ (Datos crudos de la DB) ---
export interface CapacityRawInterface {
  id: string;
  teacherDistribution?: { id: string; name: string };
  career?: { id: string; name: string };
  academicPeriod?: CatalogueInterface;
  parallel?: CatalogueInterface;
  workday?: CatalogueInterface;
  classroom?: ClassroomInterface;
  classroomId?: string | null;
  capacity: number;
  studentsCount?: number;
}

// --- INTERFACES PARA LA VISTA MATRIZ ---
export interface CellInterface {
  id: string;
  horario: string;
  paralelo: string;
  cupoMaximo: number;
  estudiantesContados: number;
  colorSemaforo: 'verde' | 'naranja' | 'rojo';
  aulaNombre?: string;
  classroomId?: string | null;
  cuposDisponibles?: number;
}

export interface BlockInterface {
  horarioNombre: string;
  celdas: CellInterface[];
}

export interface RowInterface {
  jornadaId: string;
  jornadaNombre: string;
  bloquesHorarios: BlockInterface[];
}

// --- ESTADO GLOBAL DEL STORE ---
export interface EnrollmentCapacityState {
  // Estado del formulario de selección
  formState: EnrollmentCapacityFormData;
  // Catálogos
  careers: CareerInterface[];
  teacherDistributions: TeacherDistributionInterface[];
  academicPeriods: CatalogueInterface[];
  classrooms: ClassroomInterface[];
  parallels: CatalogueInterface[];
  workdays: CatalogueInterface[];
  // Datos para la matriz
  capacitiesRaw: CapacityRawInterface[];
}

export const INITIAL_ENROLLMENT_CAPACITY_STATE: EnrollmentCapacityState = {
  formState: {
    careerId: null,
    teacherDistributionId: null,
    academicPeriodId: null,
  },
  careers: [],
  teacherDistributions: [],
  academicPeriods: [],
  classrooms: [],
  parallels: [],
  workdays: [],
  capacitiesRaw: [],
};