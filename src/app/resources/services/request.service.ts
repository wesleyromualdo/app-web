import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginService} from "./login.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    constructor(private httpWeb: HttpClient,
                private loginService: LoginService,
                private snackBar: MatSnackBar) { }

    async get(path: string, exibeErro: boolean= true) {
        try {
            const header = this.headers();
            // @ts-ignore
            return this.httpWeb.get(path, header).toPromise().catch(err => {
                return this.mostraErro(err, exibeErro);
            });
        } catch (e) {
            this.mostraErro(e);
            return [];
        }
    }

    downloadFile(path: string) {

        const options:any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/zip',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
                'Access-Control-Allow-Headers': 'origin,X-Requested-With,content-type,accept',
                'Access-Control-Allow-Credentials': 'true',
                'Authorization': 'Bearer ' + this.loginService.getAuthorizationToken(),
                'accept': '*/*'
            }),
            responseType:'arraybuffer'
        };

        return this.httpWeb.get(path, options);
    }

    async getFiles(path: string, exibeErro: boolean= true) {
        try {
            // @ts-ignore
            return this.httpWeb.get(path, this.headersFiles).toPromise().catch(err => {
                return this.mostraErro(err, exibeErro);
            });
        } catch (e) {
            this.mostraErro(e);
            return [];
        }
    }

    async post(path: string, params?: any, json?: boolean) {
        /*let token = '';
        if( params['token'] ){
            token = params['token'];
        }*/
        return this.httpWeb.post(path, params, this.headers()).toPromise().catch(err => {
            this.mostraErro(err);
            return err;
        });
    }

    async postFile(path: string, params?: any, json?: boolean) {
        return this.httpWeb.post(path, params, this.headersFiles()).toPromise().catch(err => {
            this.mostraErro(err);
            return err;
        });
    }

    async put(path: string, params?: any, json?: boolean) {
        return this.httpWeb.put(path, params, this.headers()).toPromise().catch(err => {
            this.mostraErro(err);
            return err;
        });
    }

    async delete(path: string, json?: boolean) {
        return this.httpWeb.delete(path, this.headers()).toPromise().catch(err => {
            this.mostraErro(err);
            return err;
        });
    }

    protected headers(token:any='') {
        const httpOptions = {
            'Authorization': 'Bearer ' + this.loginService.getAuthorizationToken(),
            'Content-Type': 'application/json',
        }

        return  {
            headers: new HttpHeaders(httpOptions)
        };
    }

    protected headersFiles() {
        const httpOptions = {
            'Authorization': 'Bearer ' + this.loginService.getAuthorizationToken(),
            'accept': '*/*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'origin,X-Requested-With,content-type,accept',
            'Access-Control-Allow-Credentials': 'true'
        }

        return  {
            headers: new HttpHeaders(httpOptions)
        };
    }

    protected mostraErro( err: any, exibeErro: boolean = true){
        //console.log('err', err);
        let erro = '';

        if(err.error.detail != undefined){
            if( err.error.detail.includes('Method Not Allowed') ){
                erro = 'Método não permitido. Contate o responsável técnico.'
            } else if( err.error.detail.includes('Not Found') ){
                erro = 'Método não encontrado. Contate o responsável técnico.'
            } else {
                if(err.error.detail.includes('expirou') ){
                    erro = 'Sua sessão expirou. Realize o login novamente';
                    exibeErro = true;
                } else {
                    erro = err.error.detail;
                }
            }
        } else {
            erro = err.message;
        }
        if( Array.isArray(erro) ){
            let message = '';
            erro.forEach(error => {
                let msg = error.msg
                if( error.msg.includes('valid integer') ){
                    msg = `O campo ${error.loc[1]} não é inteiro válido.`;
                    message = message + msg
                } else {
                    message = message + error.loc[1]+' - '+msg
                }
                //console.log(error.loc[1], error.msg);
            });

            erro = message;
        }

        if( exibeErro ) {
            this.snackBar.open(erro, '', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
            });
        }
        return {status: 0, message: erro}
    }
}
