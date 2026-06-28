import {Routes} from '@angular/router';
import {MY_ROUTES} from "@routes";

export default [
    {
       path: MY_ROUTES.adminPages.base,
        title: 'Users',
       loadChildren: () =>
    import('./admin/admin.routes').then((m) => m.default),
    },
    {path: '**', redirectTo: '/notfound'}
] as Routes;
