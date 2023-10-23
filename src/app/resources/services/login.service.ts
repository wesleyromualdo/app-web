import { Injectable } from '@angular/core';
import {LoginModel, LoginResponseModel} from "../models/LoginModel";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { URL } from 'src/app/resources/util/constants';
import { TOKEN_AUTH } from 'src/app/resources/util/constants';
import { USER_DATA } from 'src/app/resources/util/constants';
import jwtDecode from "jwt-decode";
import {Usuario} from "../models/UsuarioModel";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    $userData: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(private http: HttpClient) {}

    protected headers() {
        const httpOptions = {
            'Authorization': 'Bearer ' + this.getAuthorizationToken(),
            'Content-Type': 'application/json',
        }
        return  {
            headers: new HttpHeaders(httpOptions)
        };
    }

    public efetuarLogin(login: any): Observable<LoginResponseModel>{
        let url = `${URL}/login`;
        const retorno = this.http.post<LoginResponseModel>(url, login);
        return retorno
    }

    public verificarLogin(): Observable<Usuario>{

        const header = this.headers();

        let url = `${URL}/me`;
        const retorno = this.http.post<Usuario>(url, Usuario, header);
        return retorno
    }

    public getAuthorizationToken(): any {
        return localStorage.getItem(TOKEN_AUTH);
    }

    public clearAuthorizationToken(): void {
        localStorage.removeItem(TOKEN_AUTH);
        this.removeUserData();
    }

    public resetAuthorizationToken(token: string): void {
        localStorage.setItem(TOKEN_AUTH, token);
        this.removeUserData()
    }

    public removeUserData(): void {
        this.$userData.next({});
        localStorage.removeItem(USER_DATA);
    }

    public getUserData() {
        const userData = localStorage.getItem(USER_DATA);
        //JSON.parse(JSON.stringify(userData))
        return new Usuario(userData);
    }

    public setUserData(data: Usuario) {
        if (data) {
            const userData = JSON.stringify(data);
            localStorage.setItem(USER_DATA, userData);
            this.$userData.next(data);
        }
    }

    public setUser() {
        this.$userData.next(this.getUserData());
    }

    public getTokenExpirationDate(token: any ): Date | null{
        const decoded: any = jwtDecode(token);

        if( decoded.expira === undefined ){
            return null;
        }

        const date = new Date(decoded.expira);
       // console.log(date, decoded.expira);
        //date.setUTCSeconds(50);

        return date;
    }

    public isTokenExpired(): boolean{
        const token = this.getAuthorizationToken();

        if( !token ){
            return true;
        }

        const date = this.getTokenExpirationDate(token);

        if( date === undefined ){
            return false;
        }
        // @ts-ignore
        return !(date.valueOf() > new Date().valueOf());
    }

    public isUserLoggedIn(){
        const token = this.getAuthorizationToken();

        if( !token ){
            return false;
        } else if( this.isTokenExpired() ){
            return false;
        }

        return true;
    }
}
