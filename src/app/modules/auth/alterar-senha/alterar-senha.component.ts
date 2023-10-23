import { Component, OnInit } from '@angular/core';
import {Usuario} from "../../../resources/models/UsuarioModel";
import {ActivatedRoute, Router} from "@angular/router";
import {UsuarioService} from "../../../resources/services/usuario.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {LoginService} from "../../../resources/services/login.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-alterar-senha',
    templateUrl: './alterar-senha.component.html',
    styleUrls: ['./alterar-senha.component.scss']
})
export class AlterarSenhaComponent implements OnInit {

    public formulario: any;
    hide = true;
    eh_senha_diferente= false;
    nu_cpf:any

    constructor(private router: Router,
                private route: ActivatedRoute,
                private usuarioService: UsuarioService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private loginService: LoginService) { }

    ngOnInit(){

        this.route.queryParams.subscribe(params => {
           this.nu_cpf = params['nu_cpf'];
        });

        this.formulario = new FormGroup({
            username: new FormControl(this.nu_cpf, [Validators.required]),
            tx_senha: new FormControl('', [Validators.required]),
            tx_senha_confirma: new FormControl('', [Validators.required])
        });
        this.formulario.value.username = this.nu_cpf;
        this.formulario.value.tx_senha = '';
        this.formulario.value.tx_senha_confirma = '';
    }

    async getUsuarioByCpf(){
        /*let retorno = await this.usuarioService.getById(this.username);
        this.model = retorno;*/
    }

    get username(){
        return this.formulario.get('username')!;
    }

    get tx_senha(){
        return this.formulario.get('tx_senha')!;
    }

    get tx_senha_confirma(){
        return this.formulario.get('tx_senha_confirma')!;
    }

    voltar(){
        this.router.navigate(['login']);
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
            this.formulario.value.nu_cpf = this.formulario.value.username;

            retorno = await this.usuarioService.esqueciSenhaAcesso(this.formulario.value);
            //console.log(retorno);
            msg = 'Senha de acesso alterada com sucesso!';
            if( retorno.error.detail ){
                this.snackBar.open(retorno.error.detail, '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
            } else {
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
