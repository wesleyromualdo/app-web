import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {Modulo} from "../../../resources/models/ModuloModel";
import {ModuloService} from "../../../resources/services/modulo.service";

@Component({
    selector: 'app-cadastro-modulo',
    templateUrl: './cadastro-modulo.component.html',
    styleUrls: ['./cadastro-modulo.component.scss']
})
export class CadastroModuloComponent implements OnInit {

    isChecked: boolean = true;
    tx_ativo: string = 'Ativo';
    id: any = '';
    menuTexto = 'Novo Módulo';

    public formulario: any;

    public model: Modulo = new Modulo();

    constructor(private router: Router,
                private moduloService: ModuloService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.id = params['id'];
        });

        if( this.id ){
            this.menuTexto = 'Editar Módulo'
            this.getClienteById();
        }

        this.formulario = new FormGroup({
            id: new FormControl('', []),
            nu_codigo: new FormControl('', [Validators.required]),
            tx_nome: new FormControl('', [Validators.required]),
            tx_link: new FormControl('', [Validators.required]),
            tx_icon: new FormControl('', []),
            nu_ordem: new FormControl('', [Validators.required]),
            bo_status: new FormControl(this.isChecked, [])
        });
    }

    async getClienteById(){
        let retorno = await this.moduloService.getById(this.id);

        this.model = retorno;
        if( !this.model.bo_status ){
            this.isChecked = false;
            this.tx_ativo = 'Inativo';
        }
        this.formulario.value = this.model;
    }

    get nu_codigo(){
        return this.formulario.get('nu_codigo')!;
    }

    get tx_nome(){
        return this.formulario.get('tx_nome')!;
    }

    get tx_link(){
        return this.formulario.get('tx_link')!;
    }

    get tx_icon(){
        return this.formulario.get('tx_icon')!;
    }

    get nu_ordem(){
        return this.formulario.get('nu_ordem')!;
    }

    voltar(){
        this.router.navigate(['modulo'])
    }

    async onSubmit(){
        //console.log(this.formulario.value);
        this.spinner.show();
        if( this.formulario.status == 'VALID' ){
            let retorno = [];
            let msg = 'Módulo cadastrado com sucesso!';
            if( this.id ){
                this.formulario.value.id = this.id;
                //console.log(this.formulario.value);
                retorno = await this.moduloService.editar(this.formulario.value);
                msg = 'Módulo atualizado com sucesso!';
            } else {
                retorno = await this.moduloService.gravar(this.formulario.value);
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
