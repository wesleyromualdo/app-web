import { Component, OnInit } from '@angular/core';
import {Usuario} from "../../../resources/models/UsuarioModel";
import {ActivatedRoute, Router} from "@angular/router";
import {UsuarioService} from "../../../resources/services/usuario.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {LoginService} from "../../../resources/services/login.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-editar-senha',
    templateUrl: './editar-senha.component.html',
    styleUrls: ['./editar-senha.component.scss']
})
export class EditarSenhaComponent implements OnInit {

    public formulario: any;
    public model: Usuario = new Usuario();
    hide = true;
    eh_senha_diferente= false;
    userData: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private usuarioService: UsuarioService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private loginService: LoginService) { }

    ngOnInit(){

        this.userData = this.loginService.getUserData();

        this.getUsuarioByCpf();

        this.formulario = new FormGroup({
            tx_senha: new FormControl('', [Validators.required]),
            tx_senha_confirma: new FormControl('', [Validators.required])
        });
    }

    async getUsuarioByCpf(){
        let retorno = await this.usuarioService.getById(this.userData.nu_cpf);
        this.model = retorno;
    }

    get tx_senha(){
        return this.formulario.get('tx_senha')!;
    }

    get tx_senha_confirma(){
        return this.formulario.get('tx_senha_confirma')!;
    }

    voltar(){
        this.router.navigate(['meuperfil']);
    }

    async onSubmit(){
        this.eh_senha_diferente = false;
        if( this.formulario.value.tx_senha != this.formulario.value.tx_senha_confirma ){
            this.eh_senha_diferente = true;
        }

        this.spinner.show();
        if( this.formulario.status == 'VALID' && !this.eh_senha_diferente){
            let retorno = [];
            let msg = '';
            this.formulario.value.nu_cpf = this.userData.nu_cpf;
            retorno = await this.usuarioService.senhaAcesso(this.formulario.value);
            msg = 'Senha alterada com sucesso!';
            //console.log('retorno ', retorno);
            if( retorno.nu_cpf ){
                this.snackBar.open(msg, '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
                this.voltar();
            }
        }
        this.spinner.hide();
    }

}
