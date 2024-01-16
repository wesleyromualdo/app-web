import { Component, OnInit } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Usuario} from "../../../../resources/models/UsuarioModel";
import {ActivatedRoute, Router} from "@angular/router";
import {UsuarioService} from "../../../../resources/services/usuario.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {AutomacaoService} from "../../../../resources/services/automacao.service";
import {PerfilService} from "../../../../resources/services/perfil.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../../../resources/services/login.service";

@Component({
    selector: 'app-dados-acesso',
    templateUrl: './dados-acesso.component.html',
    styleUrls: ['./dados-acesso.component.scss']
})
export class DadosAcessoComponent implements OnInit {

    isChecked: boolean = true;
    tx_ativo: string = 'Ativo';
    nu_cpf_edicao: any = '';
    menuTexto = 'Novo Usuário';
    selectionPerfil = new SelectionModel<any>(true, []);
    selectionAutomacao = new SelectionModel<any>(true, []);
    perfil: any;
    automacoes: any;
    perfils: any;
    nenhumRegistro: any;
    nenhumRegistroPerfil: any;
    userData: any;
    superUser: boolean = false;

    public formulario: any;

    public model: Usuario = new Usuario();

    constructor(private router: Router,
                private usuarioService: UsuarioService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private route: ActivatedRoute,
                private automacaoService: AutomacaoService,
                private perfilService: PerfilService,
                private loginService: LoginService) { }

    async ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.nu_cpf_edicao = params['nu_cpf'];
        });

        this.userData = this.loginService.getUserData();
        this.superUser = this.userData.superuser;

        if( this.nu_cpf_edicao == undefined ){
            this.voltar();

            this.snackBar.open('É necessário informar os dados do usuário.', '', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
            });
        }

        this.formulario = new FormGroup({});

        this.automacoes = await this.automacaoService.getAutomacaoByCliente(this.userData.cliente_id);
        if( this.automacoes.status == 0 ){
            this.nenhumRegistro = 'Não foi encontrado nenhum worker vinculado ao cliente!';
        }
        this.perfils = await this.perfilService.pesquisar('', true, 0, 0);
        let perfis: any = [];
        if( this.perfils.status == 0 ){
            this.nenhumRegistroPerfil = 'Não foi encontrado nenhum perfil cadastrado!';
        } else {
            if( !this.superUser ) {
                this.perfils.forEach((perfil: any, index: any) => {
                    if (!perfil.bo_superuser && !this.superUser) {
                        perfis.push(perfil);
                    }
                });
                this.perfils = perfis;
            }
        }

        if( this.nu_cpf_edicao ){
            this.menuTexto = 'Editar Usuário'
            this.getPerfilById();
        }
    }

    async getPerfilById(){
        let retorno = await this.usuarioService.getById(this.nu_cpf_edicao);

        this.model = retorno;
        if( !this.model.bo_status ){
            this.isChecked = false;
            this.tx_ativo = 'Inativo';
        }

        if( retorno.perfil && retorno.perfil.length > 0 ) {
            this.perfils.forEach((item: any) => {
                item.checked = false;

                let p = retorno.perfil.find(function (itp: any) {
                    return itp.id === item.id;
                });

                if (p) {
                    item.checked = true;
                    this.selectionPerfil.toggle(item);
                }
            });
        }

        if( retorno.automacao && retorno.automacao.length > 0 ) {
            this.automacoes.forEach((item: any) => {
                item.checked = false;

                let p = retorno.automacao.find(function (itp: any) {
                    return itp.id === item.id;
                });

                if (p) {
                    item.checked = true;
                    this.selectionAutomacao.toggle(item);
                }
            });
        }
    }

    voltar(){
        this.router.navigate(['cadastro-usuario'], {queryParams: {nu_cpf: this.nu_cpf_edicao}});
    }

    proximo(){
        this.router.navigate(['senha-acesso'], {queryParams: {nu_cpf: this.nu_cpf_edicao}});
    }

    onChangeEventTodos(event: any){
        this.selectionAutomacao = new SelectionModel<any>(true, []);
        this.automacoes.forEach((item: any) => {
            item.checked = event.checked;
            if( event.checked ) {
                this.selectionAutomacao.toggle(item);
            }
        });
    }

    async onSubmit(){
        this.formulario.value.perfil = this.selectionPerfil.selected
        this.formulario.value.automacao = this.selectionAutomacao.selected

        //console.log(this.formulario.value, this.formulario.status);
        this.spinner.show();
        if (this.formulario.status == 'VALID' && this.selectionPerfil.selected.length > 0) {
            let retorno = [];
            let msg = 'Dados de acesso do usuário cadastrado com sucesso!';
            this.formulario.value.nu_cpf = this.nu_cpf_edicao;
            this.formulario.value.cliente_id = this.userData.cliente_id;
            retorno = await this.usuarioService.cadastroDadosAcesso(this.formulario.value);
            //console.log('retorno-acesso ', retorno);
            if (retorno.nu_cpf) {
                this.router.navigate(['dados-acesso'], {queryParams: {nu_cpf: retorno.nu_cpf}});
                this.snackBar.open(msg, '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
                //this.voltar();
            }
        }
        this.spinner.hide();
    }

    onChangeToggle(event: any){
        this.formulario.value.bo_status = event.checked;
    }

    linkCadastro(url: any){
        this.router.navigate([url], { queryParams: { nu_cpf: this.nu_cpf_edicao } });
    }

}
