import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UsuarioService} from "../../../resources/services/usuario.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-cofre-senha',
    templateUrl: './cofre-senha.component.html',
    styleUrls: ['./cofre-senha.component.scss']
})
export class CofreSenhaComponent implements OnInit {

    public formulario: any;
    hide = true;
    cliente_id:any
    token:any

    constructor(private router: Router,
                private route: ActivatedRoute,
                private usuarioService: UsuarioService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService) { }

    ngOnInit(){

        this.route.queryParams.subscribe(params => {
            this.cliente_id = params['cliente_id'];
            this.token = params['token'];
        });
        this.formulario = new FormGroup({
            cliente_id: new FormControl(this.cliente_id, []),
            token: new FormControl(this.token, []),
            tx_nome: new FormControl('', [Validators.required]),
            tx_usuario: new FormControl('', [Validators.required]),
            tx_senha: new FormControl('', [Validators.required])
        });
        this.formulario.value.cliente_id = this.cliente_id;
        this.formulario.value.tx_senha = '';
        this.formulario.value.tx_senha_confirma = '';
    }

    async getUsuarioByCpf(){
        /*let retorno = await this.usuarioService.getById(this.username);
        this.model = retorno;*/
    }

    get tx_nome(){
        return this.formulario.get('tx_nome')!;
    }

    get tx_usuario(){
        return this.formulario.get('tx_usuario')!;
    }

    get tx_senha(){
        return this.formulario.get('tx_senha')!;
    }

    voltar(){
        this.router.navigate(['login']);
    }

    async onSubmit(){

        this.formulario.value.tx_nome = this.formulario.value.tx_nome.toUpperCase().replace(/\s/g, "_");

        this.spinner.show();
        if( this.formulario.status == 'VALID'){
            let retorno = [];
            let msg = '';
            this.formulario.value.nu_cpf = this.formulario.value.username;

            retorno = await this.usuarioService.cofresenha(this.formulario.value);
            //console.log(retorno);
            msg = 'Dados cadastro com sucesso!';
            if( retorno && retorno.error && retorno.error.detail ){
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
                window.location.reload();
            }
        }
        this.spinner.hide();
    }

}
