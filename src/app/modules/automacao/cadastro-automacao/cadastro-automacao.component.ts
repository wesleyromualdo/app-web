import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {Automacao} from "../../../resources/models/AutomacaoModel";
import {AutomacaoService} from "../../../resources/services/automacao.service";
import {UtilService} from "../../../resources/services/util.service";
import {LoginService} from "../../../resources/services/login.service";
import {Util} from "../../../resources/util/utils";
import * as ace from "ace-builds";

@Component({
    selector: 'app-cadastro-automacao',
    templateUrl: './cadastro-automacao.component.html',
    styleUrls: ['./cadastro-automacao.component.scss']
})
export class CadastroAutomacaoComponent implements OnInit, AfterViewInit {
    @ViewChild("editor") private editor: ElementRef<HTMLElement> | undefined;

    isChecked: boolean = true;
    tx_ativo: string = 'Ativo';
    codigo: any = '';
    menuTexto = 'Novo executor';
    usuarioSetorId: any;
    userData: any;
    validaJson:any = true;
    aceEditor: any;

    public formulario: any = new FormGroup({
        id: new FormControl('', []),
        setor_id: new FormControl('', []),
        tx_descricao: new FormControl('', []),
        tx_nome: new FormControl({value:'', disabled: true}, [Validators.required]),
        tx_json: new FormControl('', []),
        bo_status: new FormControl(this.isChecked, []),
        nu_qtd_tarefa: new FormControl('', []),
        nu_qtd_download: new FormControl('', []),
        nu_cpf: new FormControl('', [])
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
        this.route.queryParams.subscribe(params => {
            this.codigo = params['id'];
        });

        this.userData = this.loginService.getUserData();
        this.usuarioSetorId = this.userData.setor_id;

        //const dados_pc = await this.utilService.getHostName();

        if( this.codigo ){
            this.menuTexto = 'Editar executor';
            this.getAutomacaoById();
        } /*else {
            const arDados = {tx_os: dados_pc.os,
                tx_desktop: dados_pc.hostname,
                bo_status: this.isChecked,
                dt_inclusao: '',
                setor_id: '',
                tx_descricao: '',
                tx_json: '',
                tx_nome: ''
            };
            this.model = new Automacao(arDados);
        }*/

    }

    ngAfterViewInit(): void {
        ace.config.set("fontSize", "14px");
        ace.config.set("basePath", "https://unpkg.com/ace-builds@1.4.12/src-noconflict");
        ace.config.set("basePath", "https://url.to.a/folder/that/contains-ace-modes");
        // @ts-ignore
        this.aceEditor = ace.edit(this.editor.nativeElement);

        this.aceEditor.setTheme("ace/theme/twilight");
        this.aceEditor.session.setMode("ace/mode/json");
        this.aceEditor.session.setTabSize(4);

        /*this.aceEditor.on("change", () => {
            //console.log(aceEditor.getValue());
            this.formulario.value.tx_json = this.aceEditor.getValue();
        });*/
    }

    numberOnly(event: any): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    get tx_nome(){
        return this.formulario.get('tx_nome')!;
    }

    async getAutomacaoById(){
        this.spinner.show();
        let retorno = await this.automacaoService.getById(this.codigo);

        this.model = retorno;
        if( !this.model.bo_status ){
            this.isChecked = false;
            this.tx_ativo = 'Inativo';
        }

        this.formulario.value = this.model;
        //this.prettyPrint();
        this.aceEditor.session.setValue(this.formulario.value.tx_json.replaceAll("'", '"'));
        this.spinner.hide();
    }

    voltar(){
        this.router.navigate(['automacao'])
    }

    async onSubmit(){
        this.formulario.value.tx_json = this.aceEditor.getValue();
        this.formulario.value.setor_id = this.usuarioSetorId;
        this.formulario.value.nu_cpf = this.userData.nu_cpf;
        this.formulario.value.id = this.codigo;

        console.log(this.formulario.value);

        const valida = Util.ValidatorJson(this.formulario.value.tx_json);
        if( valida.status == 0 && this.formulario.value.tx_json != '' ){
            this.validaJson = false;
            this.snackBar.open(valida.error, '', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
            });
        } else {
            this.validaJson = true;
            this.spinner.show();
            if( this.formulario.status == 'VALID' ){
                let retorno = [];
                let msg = 'Executor cadastrado com sucesso!';
                if( this.codigo ){
                    this.formulario.value.id = this.codigo;
                    retorno = await this.automacaoService.editar(this.formulario.value);
                    msg = 'Executor atualizado com sucesso!';
                } else {
                    retorno = await this.automacaoService.gravar(this.formulario.value);
                }
                //console.log('retorno ', retorno);
                if( retorno.id ){
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
