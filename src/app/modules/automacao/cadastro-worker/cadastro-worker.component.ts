import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Automacao} from "../../../resources/models/AutomacaoModel";
import {ActivatedRoute, Router} from "@angular/router";
import {AutomacaoService} from "../../../resources/services/automacao.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {UtilService} from "../../../resources/services/util.service";
import {LoginService} from "../../../resources/services/login.service";
import * as ace from "ace-builds";
import {Util} from "../../../resources/util/utils";
import { URL } from 'src/app/resources/util/constants';

@Component({
  selector: 'app-cadastro-worker',
  templateUrl: './cadastro-worker.component.html',
  styleUrls: ['./cadastro-worker.component.scss']
})
export class CadastroWorkerComponent implements OnInit {
    @ViewChild("editor") private editor: ElementRef<HTMLElement> | undefined;

    isChecked: boolean = true;
    tx_ativo: string = 'Ativo';
    codigo: any = '';
    menuTexto = 'Novo worker';
    usuarioClienteId: any;
    userData: any;

    jsonDados = {
        url_console: URL,
        tx_email: ''
    };

    public formulario: any = new FormGroup({
        cliente_id: new FormControl('', []),
        tx_nome: new FormControl('', [Validators.required, Validators.pattern(/^\S*$/)]),
        tx_descricao: new FormControl('', []),
        tx_json: new FormControl('', []),
        bo_status: new FormControl(this.isChecked, []),
        nu_qtd_tarefa: new FormControl('1', []),
        nu_qtd_download: new FormControl('1', [])
    });

    public model: Automacao = new Automacao();

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private automacaoService: AutomacaoService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private route: ActivatedRoute,
                private utilService: UtilService,
                private loginService: LoginService) { }

    async ngOnInit() {
        this.userData = this.loginService.getUserData();
        this.usuarioClienteId = this.userData.cliente_id;
        this.jsonDados.tx_email = this.userData.tx_email;
    }

    get tx_nome(){
        return this.formulario.get('tx_nome')!;
    }
    get tx_descricao(){
        return this.formulario.get('tx_descricao')!;
    }

    voltar(){
        this.router.navigate(['automacao'])
    }

    async onSubmit(){
        this.formulario.value.tx_json = JSON.stringify(this.jsonDados);
        this.formulario.value.cliente_id = this.usuarioClienteId;
        this.formulario.value.nu_cpf = this.userData.nu_cpf;
        this.formulario.value.nu_qtd_tarefa = 1
        this.formulario.value.nu_qtd_download = 1

        if( this.formulario.value.tx_nome.substring(0,1) != '@' ){
            this.formulario.value.tx_nome = '@'+this.formulario.value.tx_nome;
        }
        console.log(this.formulario.value);

        this.spinner.show();
        if( this.formulario.status == 'VALID' ){
            let retorno = [];
            let msg = 'Worker cadastrado com sucesso!';
            retorno = await this.automacaoService.gravarWorker(this.formulario.value);
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

    prettyPrint() {
        let obj = JSON.parse(this.formulario.value.tx_json);
        let pretty = JSON.stringify(obj, undefined, 4);
        this.formulario.value.tx_json = pretty;
        this.model.tx_json = pretty;
    }
}
