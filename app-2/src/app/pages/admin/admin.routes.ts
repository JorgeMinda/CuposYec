import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';

export default [
  {
    path: MY_ROUTES.adminPages.careerRegistration.base,
    title: 'Registro de Carreras',
    loadComponent: () =>
      import(
        './work-flows/career-registration/components/career/career.component'
      ).then((m) => m.CareerComponent),
  },

  {
    path: MY_ROUTES.adminPages.enrollmentCapacity.base,
    children: [
      {
        path: '',
        title: 'Capacidad de Matrícula',
        loadComponent: () =>
          import(
            './work-flows/enrollment-capacity/components/enrollment-capacity/enrollment-capacity.component'
          ).then((m) => m.EnrollmentCapacityComponent),
      },
      {
        path: MY_ROUTES.adminPages.enrollmentCapacity.selectors.base,
        title: 'Selectores',
        loadComponent: () =>
          import(
            './work-flows/enrollment-capacity/components/selectors-data/selectors-data.component'
          ).then((m) => m.SelectorsDataComponent),
      },
      {
        path: MY_ROUTES.adminPages.enrollmentCapacity.matrix.base,
        title: 'Matriz de Capacidad',
        loadComponent: () =>
          import(
            './work-flows/enrollment-capacity/components/capacity-matrix/capacity-matrix.component'
          ).then((m) => m.CapacityMatrixComponent),
      },
    ],
  },
] as Routes;