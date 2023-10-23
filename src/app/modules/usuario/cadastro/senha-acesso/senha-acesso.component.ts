import { Component, OnInit } from '@angular/core';
import {Usuario} from "../../../../resources/models/UsuarioModel";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UsuarioService} from "../../../../resources/services/usuario.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {LoginService} from "../../../../resources/services/login.service";

@Component({
    selector: 'app-senha-acesso',
    templateUrl: './senha-acesso.component.html',
    styleUrls: ['./senha-acesso.component.scss']
})
export class SenhaAcessoComponent implements OnInit {

    public formulario: any;
    public model: Usuario = new Usuario();
    nu_cpf_edicao: any = '';
    menuTexto = 'Novo Usuário';
    hide = true;
    eh_senha_diferente= false;
    superUser: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private usuarioService: UsuarioService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private loginService: LoginService) { }

    ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.nu_cpf_edicao = params['nu_cpf'];
        });

        const userData = this.loginService.getUserData();
        this.superUser = userData.superuser;

        if( this.nu_cpf_edicao == undefined ){
            this.router.navigate(['cadastro-usuario']);

            this.snackBar.open('É necessário informar os dados do usuário.', '', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
            });
        }

        if( this.nu_cpf_edicao ){
            this.menuTexto = 'Editar Usuário'
            this.getUsuarioByCpf();
        }

        this.formulario = new FormGroup({
            tx_senha: new FormControl('', [Validators.required]),
            tx_senha_confirma: new FormControl('', [Validators.required])
        });
    }

    async getUsuarioByCpf(){
        let retorno = await this.usuarioService.getById(this.nu_cpf_edicao);
        //console.log(retorno);
        this.model = retorno;
        //this.formulario.value = retorno;
    }

    get tx_senha(){
        return this.formulario.get('tx_senha')!;
    }

    get tx_senha_confirma(){
        return this.formulario.get('tx_senha_confirma')!;
    }

    voltar(){
        this.router.navigate(['usuario'], {queryParams: {nu_cpf: this.nu_cpf_edicao}});
    }

    async onSubmit(){
        this.eh_senha_diferente = false;
        if( this.formulario.value.tx_senha != this.formulario.value.tx_senha_confirma ){
            this.eh_senha_diferente = true;
        }
        console.log(this.formulario.value, this.eh_senha_diferente);
        this.spinner.show();
        if( this.formulario.status == 'VALID' && !this.eh_senha_diferente){
            let retorno = [];
            let msg = '';
            if( this.nu_cpf_edicao ){
                this.formulario.value.nu_cpf = this.nu_cpf_edicao;
                //console.log(this.formulario.value);
                retorno = await this.usuarioService.senhaAcesso(this.formulario.value);
                msg = 'Dados atualizado com sucesso!';
            }
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

    linkCadastro(url: any){
        this.router.navigate([url], { queryParams: { nu_cpf: this.nu_cpf_edicao } });
    }
}
