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

@Component({
    selector: 'app-dados-json',
    templateUrl: './dados-json.component.html',
    styleUrls: ['./dados-json.component.scss']
})
export class DadosJsonComponent implements OnInit, AfterViewInit {
    @ViewChild("editor") private editor: ElementRef<HTMLElement> | undefined;

    msgSemRegistro = msgSemRegistro;

    displayedColumns: string[] = ['acao', 'tx_chave', 'tx_valor'];
    dataList: any;
    configTable = {
        table:{
            id:'table-configuracao',
            class:''
        },
        btnnovo: '',
        placeholder: 'Busque pelo chave ou valor da configuração',
        columns:[
            {label:'Ação', field:'acao', class:'',botao:[
                    {label:'Editar', icon:'edit', callback:'editar'},
                    {label:'Excluir', icon:'delete', callback:'excluir'}
                ]
            },
            {label:'Chave', field:'tx_chave', class:'', link:true, callback:'detalhe'},
            {label:'Valor', field:'tx_valor', class:''}
        ]
    };

    id: any = '';
    cpfLogado: any;
    userData: any;
    validaJson:any = true;
    aceEditor: any;
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
            tx_chave: new FormControl('', [Validators.required])
        });

        if( this.id ){
            await this.pesquisar();
        }
    }

    async pesquisar(){
        this.loading = false;
        //await this.getTarefaById();
        this.dataList = await this.http_config.pesquisar('','',this.id,true,0,0);
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
            tx_chave: new FormControl(retorno.tx_chave, [Validators.required])
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

    ngAfterViewInit(): void {
    }

    async onSubmit(){
        this.spinner.show();

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

}
