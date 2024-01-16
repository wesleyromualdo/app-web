import {Component, HostListener, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {LoginModel} from "../../../resources/models/LoginModel";
import {LoginService} from "../../../resources/services/login.service";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition
} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {UsuarioService} from "../../../resources/services/usuario.service";
import {ModuloService} from "../../../resources/services/modulo.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    hide = true;
    public login: LoginModel | any;

    username = new FormControl('', []);
    password = new FormControl('', []);

    constructor(private loginService: LoginService,
                private snackBar: MatSnackBar,
                private router: Router,
                private spinner: NgxSpinnerService,
                private usuarioService: UsuarioService,
                private moduloService: ModuloService) { }

    ngOnInit(): void {
        this.spinner.show();
        this.login = new LoginModel();
        this.loginService.clearAuthorizationToken();
        this.spinner.hide();
    }

    @HostListener("keydown.enter", ["$event"])
    onEnter(event: KeyboardEvent) {
        this.logar();
    }

    getErrorMessage(campo: any) {
        if (this.username.hasError('required') && campo == 'nu_cpf') {
            return 'Informe o CPF do usuário';
        }
        if (this.password.hasError('required') && campo == 'tx_senha') {
            return 'Informe a SENHA do usuário';
        }
        return '';
    }

    async logar(){
        this.spinner.show();
        var formData: any = new FormData();
        formData.append('username', this.login.username);
        formData.append('password', this.login.password);

        this.loginService.efetuarLogin(formData).subscribe(
        async data => {
            //console.log('data: ', data);
            this.loginService.resetAuthorizationToken(data.access_token);

            let cliente = '';
            const retorno = await this.pegarCliente(data.usuario.nu_cpf);
            console.log(retorno);
            data.usuario.cliente = '';
            data.usuario.cliente_id = 0;
            if( retorno && retorno.length > 0){
                data.usuario.cliente = retorno[0].tx_sigla;
                data.usuario.cliente_id = retorno[0].id;
                data.usuario.nu_worker = retorno[0].nu_worker;
            }
            const perfils = await this.pegarPerfil(data.usuario.nu_cpf);

            let perfil_id = 0;
            data.usuario.perfil_id = 0;
            data.usuario.perfil = '';
            data.usuario.superuser = '';
            if( perfils && perfils.length > 0){
                data.usuario.perfil_id = perfils[0]['id'];
                data.usuario.perfil = perfils[0]['tx_nome'];
                data.usuario.superuser = perfils[0]['bo_superuser'];
                data.usuario.constante_virtual = perfils[0]['constante_virtual'];
                perfil_id = perfils[0]['id'];
            }

            //console.log('data: ', data);
            const moduloUsuario = await this.moduloService.getMenuByPerfil(perfil_id);
            //console.log('moduloUsuario', moduloUsuario, moduloUsuario.length);

            if( moduloUsuario && moduloUsuario.length > 0 ){
                this.loginService.setUserData(data.usuario)
                this.router.navigate([moduloUsuario[0].tx_link]);
            } else {
                this.spinner.hide();
                this.snackBar.open('Não foi cadastrado nenhum módulo para este usuário.', '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
            }
        },
        error =>{
            this.spinner.hide();
            //this.alertMessage.error(error.error.detail)
            console.log(error);
            let retorno = 'Usuário e senha não encontrados';
            if( error.error.detail ){
                retorno = error.error.detail
            }
            if( error.message.includes('Unknown Error') ){
                retorno = 'Não foi possível comunicar com api, provavelmente esteja fora.';
            }

            this.snackBar.open(retorno, '', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
            });
        })
    }

    async pegarCliente( nu_cpf: any){
        const retorno = await this.usuarioService.getClienteByCPF(nu_cpf);
        return retorno;
    }

    async pegarPerfil( nu_cpf: any){
        const retorno = await this.usuarioService.getPerfilByCPF(nu_cpf);
        return retorno;
    }

    alterarSenha(){
        console.log('teste');
        this.router.navigate(['alterar-senha'], { queryParams: { nu_cpf: this.login.username }});
    }

}
