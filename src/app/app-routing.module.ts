import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./modules/auth/login/login.component";
import {AlterarSenhaComponent} from "./modules/auth/alterar-senha/alterar-senha.component";
import {CofreSenhaComponent} from "./modules/auth/cofre-senha/cofre-senha.component";

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    {path: 'login', component: LoginComponent},
    {path: 'alterar-senha', component: AlterarSenhaComponent},
    {path: 'cofre-senha', component: CofreSenhaComponent}
    //{path: 'dashboard', loadChildren: () => import('./layout/default/default.module').then(m => m.DefaultModule)},
    /*{
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    }*/
    /*{
        path: 'dashboard', component: DefaultComponent,
        children: [
            {
                path: '',
                component: DashboardComponent
            }
        ]
    }*/
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
