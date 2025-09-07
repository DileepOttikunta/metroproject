import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { HttpClient } from '@angular/common/http';
import { Regandlogin } from './regandlogin/regandlogin';
export const routes: Routes = [
    {path:'dashb',component:Dashboard},
    {path:'',component:Regandlogin}
];
