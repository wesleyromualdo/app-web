import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../../resources/services/login.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {Tarefa} from "../../../resources/models/TarefaModel";
import * as ace from "ace-builds";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Util} from "../../../resources/util/utils";
import {msgSemRegistro} from "../../../resources/util/constants";
import { ConfiguracaoService } from 'src/app/resources/services/configuracao.service';
import { ModalExcluirComponent } from 'src/app/shared/components/modal-excluir/modal-excluir.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TarefaService } from 'src/app/resources/services/tarefa.service';

@Component({
    selector: 'app-dados-json',
    templateUrl: './dados-json.component.html',
    styleUrls: ['./dados-json.component.scss']
})
export class DadosJsonComponent implements OnInit, AfterViewInit {
    //@ViewChild("editor") private editorElementRef: ElementRef<HTMLElement> | undefined;
    @ViewChild("editor") private editorElementRef!: ElementRef<HTMLElement>;
    @ViewChild('tabGroup') tabGroup: any;

    msgSemRegistro = msgSemRegistro;

    displayedColumns: string[] = ['acao', 'tx_chave', 'tx_valor', 'num_ordem'];
    dataList: any;
    configTable = {
        table:{
            id:'table-configuracao',
            class:''
        },
        btnnovo: '',
        height: '30vh',
        placeholder: 'Busque pelo chave ou valor da configuração',
        columns:[
            {label:'Ação', field:'acao', class:'',botao:[
                    {label:'Editar', icon:'edit', callback:'editar'},
                    {label:'Excluir', icon:'delete', callback:'excluir'}
                ]
            },
            {label:'Chave', field:'tx_chave', class:'', link:true, callback:'detalhe'},
            {label:'Valor', field:'tx_valor', class:''},
            {label:'Ordem', field:'num_ordem', class:''}
        ]
    };

    id: any = '';
    cpfLogado: any;
    userData: any;
    
    validaJson:any = true;
    aceEditor: any;
    abaIndex:any = 1;

    formulario: any;
    loading: boolean = false;
    bo_status: boolean = true;

    public model: Tarefa = new Tarefa();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private loginService: LoginService,
                private http_config: ConfiguracaoService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private tarefaService: TarefaService,
                private dialog: MatDialog) { }

    async ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.id = parseInt(params['id']);
        });

        this.userData = this.loginService.getUserData();
        this.cpfLogado = this.userData.nu_cpf;

        this.formulario = new FormGroup({
            tarefa_id: new FormControl(this.id, []),
            tx_valor: new FormControl('', [Validators.required]),
            tx_chave: new FormControl('', [Validators.required]),
            num_ordem: new FormControl('', []),
            tx_json: new FormControl('', [])
        });

        if( this.id ){
            await this.pesquisar();
        }
    }

    ngAfterViewInit(): void {
        
        console.log(this.editorElementRef);
        ace.config.set("fontSize", "14px");
        ace.config.set("basePath", "https://unpkg.com/ace-builds@1.4.12/src-noconflict");
        ace.config.set("basePath", "https://url.to.a/folder/that/contains-ace-modes");
        
        this.aceEditor = ace.edit(this.editorElementRef.nativeElement);
        this.aceEditor.session.setMode("ace/mode/json");
        this.aceEditor.setTheme("ace/theme/monokai");
        this.aceEditor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        //this.aceEditor.setTheme("ace/theme/twilight");
        //this.aceEditor.session.setMode("ace/mode/json");
        this.aceEditor.session.setTabSize(4);

        this.getTarefaById();

        // Exemplo de como definir um valor inicial formatado
        //const initialValue = JSON.stringify({ example: "data" }, null, 2);
        //this.aceEditor.setValue(initialValue, 1);
    }

    async pesquisar(){
        this.loading = false;
        this.dataList = await this.http_config.pesquisar('', this.id, true, 0, 0);
        if( this.dataList.status == 0 ) {
            this.dataList = [];
        } else {
            let registro = [];
            this.dataList.forEach((item: any) => {
                if (item.bo_status) item.bo_status = 'Ativo';
                else item.bo_status = 'Inativo';

                if (item.bo_superuser) item.bo_superuser = 'Sim';
                else item.bo_superuser = 'Não';

                registro.push(item);
            });
        }
        this.loading = true;
    }

    executaRetorno(dados: any) {
        if( dados.callback == 'editar' || dados.callback == 'detalhe' ){
            this.editar(dados.element.id);
        }
        if( dados.callback == 'excluir' ){
            this.excluir(dados.element.id);
        }
    }

    async editar(id: any){
        this.spinner.show();
        let retorno = await this.http_config.getById(id);
        this.formulario = new FormGroup({
            id: new FormControl(retorno.id, []),
            tarefa_id: new FormControl(this.id, []),
            tx_valor: new FormControl(retorno.tx_valor, [Validators.required]),
            tx_chave: new FormControl(retorno.tx_chave, [Validators.required]),
            num_ordem: new FormControl(retorno.num_ordem, [])
        });
        this.spinner.hide();
    }

    async excluir(id: any){

        const dialogRef = this.dialog.open(ModalExcluirComponent, {
            width: '500px',
            data: {texto: 'configuração'}
        });

        dialogRef.afterClosed().subscribe(async result => {
            if( result == 'true' ) {
                this.spinner.show();
                let retorno = await this.http_config.excluir(id);

                if( retorno.status == 1 ){
                    await this.pesquisar();
                    this.snackBar.open(retorno.message, '', {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 5000
                    });
                }
                this.spinner.hide();
            }
        });

    }

    get tx_valor(){
        return this.formulario.get('tx_valor')!;
    }
    get tx_chave(){
        return this.formulario.get('tx_chave')!;
    }

    async onSubmit(){
        this.spinner.show();

        if( this.abaIndex == 0 ){
            //console.log(this.formulario.value);
            //console.log(this.formulario.status);
            this.formulario.value.tarefa_id = this.id;

            if( this.formulario.status == 'VALID' ){
                let retorno = null;
                if (this.formulario.value.id) {
                    retorno = await this.http_config.editar(this.formulario.value);
                } else {
                    retorno = await this.http_config.gravar(this.formulario.value);
                }
                if( retorno && retorno.id) {
                    this.snackBar.open('Configuração vinculado com sucesso', '', {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 5000
                    });
                    await this.pesquisar();
                }
                this.formulario.disable();
                this.formulario.reset({
                    tarefa_id: this.id,
                    tx_json: '',
                    tx_valor: '',
                    tx_chave: ''
                });
                this.formulario.enable();
            }
        } else {
            this.formulario.value.tx_json = this.aceEditor.getValue();
            if( this.formulario.value.tx_json == '' ){
                this.validaJson = false;
            } else {
                const valida = Util.ValidatorJson(this.formulario.value.tx_json);
                if ( valida.status == 0 ) {
                    this.validaJson = false;
                    this.snackBar.open('O formatado do JSON é inválido', '', {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 5000
                    });
                } else {
                    this.validaJson = true;
    
                    this.model.tx_json = this.formulario.value.tx_json;
    
                    // @ts-ignore
                    let retornoTarefa = await this.tarefaService.grava_json_tarefa(this.model);
    
                    if( retornoTarefa && retornoTarefa.id) {
                        this.snackBar.open('JSON de configuração vinculado com sucesso', '', {
                            horizontalPosition: 'center',
                            verticalPosition: 'bottom',
                            duration: 5000
                        });
                    }
                }
            }
        }
        this.spinner.hide();
    }

    linkCadastro(url: any){
        this.router.navigate([url], { queryParams: { id: this.id } });
    }

    voltar(){
        this.router.navigate(['automacao'])
    }

    proximo(){
        if( this.model.bo_agendada ){
            this.router.navigate(['agendamento-tarefa'], { queryParams: { id: this.id } });
        } else {
            this.router.navigate(['config-email-tarefa'], { queryParams: { id: this.id } });
        }

    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        this.abaIndex = tabChangeEvent.index;
        //console.log('abaTarefa: ', this.abaIndex);
        if( this.abaIndex == 1 ){
            this.getTarefaById();
        }
    }

    async getTarefaById(){
        if( !this.model.tx_json ){
            this.spinner.show();
            let retorno = await this.tarefaService.getById(this.id);

            this.model = new Tarefa(retorno);
            if (this.aceEditor) {
                this.aceEditor.session.setValue(retorno.tx_json);
            }
            this.spinner.hide();
        }
    }

}
