import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UsuarioService} from "../../../../resources/services/usuario.service";
import {Usuario} from "../../../../resources/models/UsuarioModel";
import {ClienteService} from "../../../../resources/services/cliente.service";
import {SelectionModel} from "@angular/cdk/collections";
import {LoginService} from "../../../../resources/services/login.service";

@Component({
    selector: 'app-cadastro-usuario',
    templateUrl: './cadastro-usuario.component.html',
    styleUrls: ['./cadastro-usuario.component.scss']
})
export class CadastroUsuarioComponent implements OnInit {

    isChecked: boolean = true;
    tx_ativo: string = 'Ativo';
    nu_cpf_edicao: any = '';
    menuTexto = 'Novo Usuário';
    clientes: any;
    superUser: boolean = false;
    dataUser: any;
    selection = new SelectionModel<any>(true, []);

    public formulario: FormGroup = new FormGroup({
        nu_cpf: new FormControl('', [Validators.required]),
        tx_nome: new FormControl('', [Validators.required]),
        tx_email: new FormControl('', [Validators.required, Validators.email]),
        bo_status: new FormControl(this.isChecked, [])
    });

    public model: Usuario = new Usuario();

    constructor(private router: Router,
                private usuarioService: UsuarioService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private route: ActivatedRoute,
                private clientePerfil: ClienteService,
                private loginService: LoginService) { }

    async ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.nu_cpf_edicao = params['nu_cpf'];
        });

        this.dataUser = this.loginService.getUserData();
        this.superUser = this.dataUser.superuser;

        this.clientes = await this.clientePerfil.pesquisar();
        //console.log(this.clientes);
        if( this.nu_cpf_edicao ){
            this.menuTexto = 'Editar Usuário'
            this.getUsuarioByCpf();
        }
    }

    async getUsuarioByCpf(){
        let retorno = await this.usuarioService.getById(this.nu_cpf_edicao);
        //console.log(retorno);

        this.model = retorno;
        if( !this.model.bo_status ){
            this.isChecked = false;
            this.tx_ativo = 'Inativo';
        }

        if( retorno.cliente && retorno.cliente.length > 0 ) {
            this.clientes.forEach((item: any) => {
                item.checked = false;

                let cliente = retorno.cliente.find(function (cliente: any) {
                    return cliente.id === item.id;
                });

                if (cliente) {
                    item.checked = true;
                    this.selection.toggle(item);
                }
            });
        }
    }

    get nu_cpf(){
        return this.formulario.get('nu_cpf')!;
    }

    get tx_nome(){
        return this.formulario.get('tx_nome')!;
    }

    get tx_email(){
        return this.formulario.get('tx_email')!;
    }

    voltar(){
        this.router.navigate(['usuario'], {queryParams: {nu_cpf: this.nu_cpf_edicao}});
    }

    proximo(){
        this.router.navigate(['dados-acesso'], {queryParams: {nu_cpf: this.nu_cpf_edicao}});
    }

    async onSubmit(){
        if( this.superUser ) {
            this.formulario.value['cliente'] = this.selection.selected;
        } else {
            this.selection.selected.length = 1;
            this.formulario.value['cliente'] = [{id: this.dataUser.cliente_id}]
        }
        //console.log(this.formulario.value, this.formulario.status, this.selection.selected.length);
        this.spinner.show();
        if( this.formulario.status == 'VALID' && this.selection.selected.length > 0){
            let retorno = [];
            let msg = 'Usuário cadastrado com sucesso!';
            if( this.nu_cpf_edicao ){
                this.formulario.value.nu_cpf = this.nu_cpf_edicao;
                //console.log(this.formulario.value);
                retorno = await this.usuarioService.editar(this.formulario.value);
                msg = 'Usuário atualizado com sucesso!';
            } else {
                retorno = await this.usuarioService.gravar(this.formulario.value);
            }
            //console.log('retorno ', retorno);
            if( retorno.nu_cpf ){
                this.router.navigate(['cadastro-usuario'], { queryParams: { nu_cpf: retorno.nu_cpf } });
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
