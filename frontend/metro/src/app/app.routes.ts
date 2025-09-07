import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { HttpClient } from '@angular/common/http';
import { Regandlogin } from './regandlogin/regandlogin';
import { Bookticket } from './bookticket/bookticket';
export const routes: Routes = [
    {path:'',component:Regandlogin},
    {path:'dashb',component:Dashboard},
    {path:'bookticket',component:Bookticket}
];
