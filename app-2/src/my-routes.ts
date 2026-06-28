export const MY_ROUTES = {
  // Base
  main: 'main',
  home: '',

  // Layout
  layout: {
    base: 'layout',
  },

  // Error pages
  errorPages: {
    base: 'errors',

    unauthorized: {
      base: '401',
      absolute: '/errors/401',
    },

    forbidden: {
      base: '403',
      absolute: '/errors/403',
    },

    notFound: {
      base: '404',
      absolute: '/errors/404',
    },

    unavailable: {
      base: '503',
      absolute: '/errors/503',
    },
  },

  // Admin
  adminPages: {
    base: 'admin',

    careerRegistration: {
      base: 'career-registration',
      absolute: '/main/admin/career-registration',
    },

    enrollmentCapacity: {
  base: 'enrollment-capacity',
  absolute: '/main/admin/enrollment-capacity',

  selectors: {
    base: 'selectors',
    absolute: '/main/admin/enrollment-capacity/selectors',
  },

  matrix: {
    base: 'matrix',
    absolute: '/main/admin/enrollment-capacity/matrix',
  },
  },

  // Dashboards
  dashboards: {
    base: 'dashboards',
    absolute: '/main/dashboards',
  },
} as const };