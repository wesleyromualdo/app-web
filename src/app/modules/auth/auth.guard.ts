import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {LoginService} from "../../resources/services/login.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private loginServices: LoginService,
                private router: Router,
                private snackBar: MatSnackBar) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //console.log('canActivate', this.loginServices.isUserLoggedIn());
        if( this.loginServices.isUserLoggedIn() ){
            return true;
        } else {
            this.snackBar.open('Sua sessão expirou. Realize o login novamente', '', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
            });
            this.router.navigate(['login'])
        }
        return true;
    }

}
