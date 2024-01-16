import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Cliente} from "../../../resources/models/ClienteModel";
import {ClienteService} from "../../../resources/services/cliente.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-novo-cliente',
    templateUrl: './cadastro-cliente.component.html',
    styleUrls: ['./cadastro-cliente.component.scss']
})
export class CadastroClienteComponent implements OnInit {

    isChecked: boolean = true;
    tx_ativo: string = 'Ativo';
    codigo: any = '';
    menuTexto = 'Novo Cliente';

    public formulario: any;

    public cliente: Cliente = new Cliente();

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private clienteService: ClienteService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.codigo = params['id'];
        });

        if( this.codigo ){
            this.menuTexto = 'Editar Cliente';
            this.getClienteById();
        }

        this.formulario = new FormGroup({
            id: new FormControl('', []),
            tx_sigla: new FormControl('', [Validators.required]),
            tx_nome: new FormControl('', [Validators.required]),
            nu_worker: new FormControl('1', []),
            bo_status: new FormControl(this.isChecked, [])
        });
    }

    get tx_nome(){
        return this.formulario.get('tx_nome')!;
    }

    get tx_sigla(){
        return this.formulario.get('tx_sigla')!;
    }

    get nu_worker(){
        return this.formulario.get('nu_worker')!;
    }

    numberOnly(event: any): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    async getClienteById(){
        let retorno = await this.clienteService.getById(this.codigo);
        this.cliente = retorno;
        if( !this.cliente.bo_status ){
            this.isChecked = false;
            this.tx_ativo = 'Inativo';
        }
        this.cliente.nu_worker = (this.cliente.nu_worker? this.cliente.nu_worker : '1');
        this.formulario.value = this.cliente;
    }

    voltar(){
        this.router.navigate(['cliente'])
    }

    async onSubmit(){
        this.spinner.show();
        console.log(this.formulario);
        if( this.formulario.status == 'VALID' ){
            let retorno = [];
            let msg = 'Cliente cadastrado com sucesso!';
            if( this.codigo ){
                this.formulario.value.id = this.codigo;
                //console.log(this.formulario.value);
                retorno = await this.clienteService.editar(this.formulario.value);
                msg = 'Cliente atualizado com sucesso!';
            } else {
                retorno = await this.clienteService.gravar(this.formulario.value);
            }
            //console.log('retorno ', retorno);
            if( retorno.id ){
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

    onChangeToggle(event: any){
        this.formulario.value.bo_status = event.checked;
    }

}
