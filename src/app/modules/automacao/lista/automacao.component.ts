import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ModalExcluirComponent} from "../../../shared/components/modal-excluir/modal-excluir.component";
import {msgSemRegistro, PAGINADOR} from "../../../resources/util/constants";
import {AutomacaoService} from "../../../resources/services/automacao.service";
import {LoginService} from "../../../resources/services/login.service";
import {ModalDetalhamentoComponent} from "../../../shared/components/modal-detalhamento/modal-detalhamento.component";
import * as moment from 'moment';
import {Util} from "../../../resources/util/utils";
import {TarefaService} from "../../../resources/services/tarefa.service";
import { webSocket } from 'rxjs/webSocket';

@Component({
    selector: 'app-automacao',
    templateUrl: './automacao.component.html',
    styleUrls: ['./automacao.component.scss']
})
export class AutomacaoComponent implements OnInit {

    userData: any;
    msgSemRegistro = msgSemRegistro;
    dataList: any = [];
    loading: boolean = false;
    bo_status: boolean = true;
    tx_ativo: string = 'Ativo';
    boAdicionar: any = true;

    configTable = {
        table:{
            id:'table-automacao',
            class:''
        },
        btnnovo: 'Adicionar executor',
        placeholder: 'Busque pelo nº de ID ou nome do executor',
        columns:[
            {label:'Ação', field:'acao', class:'',botao:[
                    {label:'Detalhamento', icon:'remove_red_eye', callback:'detalhe'},
                    {label:'Editar', icon:'edit', callback:'editar'},
                    {label:'Inativar', icon:'delete', callback:'excluir'},
                    {label:'Download', icon:'cloud_download', callback:'download'},
                ]
            },
            {label:'ID', field:'id', class:'', link:true, callback:'detalhe'},
            {label:'Nome', field:'tx_nome', class:'', link:true, callback:'detalhe'},
            {label:'Nº download', field:'nu_qtd_download', class:''},
            {label:'Nº Tarefas', field:'nu_qtd_tarefa', class:''},
            {label:'Nº Tarefas vinculadas', field:'tarefas_vinculadas', class:''},
            {label:'Qtd. de execuções', field:'qtd_tarefa_executada', class:''},
            {label:'Tempo em execução', field:'tempo_execucao', class:''},
            {label:'Status', field:'bo_status', class:''},
        ]
    };

    constructor(private http: AutomacaoService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private router: Router,
                private dialog: MatDialog,
                private loginService: LoginService) { }

    async ngOnInit(){
        this.userData = this.loginService.getUserData();
        await this.pesquisar();

        if( !this.boAdicionar ){
            this.configTable.btnnovo = '';
        }

        this.configTable.columns.forEach((item: any) => {

            if( item.botao ) {
                item.botao.forEach((btn:any, index: any) => {
                    if( (btn.icon == 'edit' || btn.icon == 'delete') && !this.userData.superuser ){
                        delete item.botao[index]
                    }
                });
            }
        });
        /*if( this.dataList.length >= this.userData.nu_executor && !this.userData.superuser  ){
            this.configTable.btnnovo = '';
        }*/
    }

    async pesquisar(){
        this.loading = false;
        this.spinner.show();
        this.dataList = await this.http.pesquisar(this.userData.setor_id,'',this.bo_status, this.userData.nu_cpf,0,0);

        if( this.dataList.status == 0 ) {
            this.dataList = [];
        } else {
            let registro = [];
            this.dataList.forEach((item: any) => {
                if (item.bo_status) item.bo_status = 'Ativo';
                else item.bo_status = 'Inativo';

                item.qtd_tarefa_executada = item.qtd_execucao;
                if(item.tempo_execucao) {
                    item.tempo_execucao = item.tempo_execucao.split('.')[0].replace('day', 'dia')
                } else {
                    item.tempo_execucao = '00:00:00'
                }
                registro.push(item);
            });
        }

        console.log(this.userData.nu_executor, this.dataList.length);

        if( this.userData.nu_executor <= this.dataList.length ){
            this.boAdicionar = false;
        }
        this.spinner.hide();
        this.loading = true;
    }

    executaRetorno(dados: any) {
        if( dados.callback == 'novo' ){
            this.novo();
        }
        if( dados.callback == 'detalhe' ){
            this.detalhamento(dados.element);
        }
        if( dados.callback == 'editar' ){
            this.editar(dados.element.id);
        }
        if( dados.callback == 'excluir' ){
            this.excluir(dados.element.id);
        }
        if( dados.callback == 'download' ){
            this.download(dados.element);
        }
        if( dados.callback == 'stop' ){
            console.log(dados.element);
            //this.stop(dados.element);
        }
        if( dados.callback == 'status' ){
            this.bo_status = dados.element;
            this.tx_ativo = (this.bo_status ? 'Ativo' : 'Inativo');
            this.pesquisar();
        }
    }
    async download(element: any){
        let retorno = await this.http.download(element.id, element.tx_nome, this.snackBar, this.spinner);

        /*const subject = webSocket('ws://127.0.0.1:8000/ws/1');
        subject.subscribe({
            next: msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
            error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
            complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
        });*/
    }

    novo(){
        this.router.navigate(['cadastro-executor']);
    }

    async detalhamento(element: any){
        //console.log(element);
        /*this.dialog.open(DetalhamentoAutomacaoComponent, {
            width: '70%',
            data: element
        });*/
        //console.log(element);
        this.spinner.show();
        const classStatus = (element.bo_status=='Ativo' ? 'td-status-ativo' : 'td-status-inativo');

        const validaJson = Util.ValidatorJson(element.tx_json);
        const tx_json = ( validaJson.status == 0 ? '': JSON.parse(element.tx_json));
        const tipos = ( validaJson.status == 0 ? '': 'json');

        element.dt_inclusao_formatada = moment(element.dt_inclusao).format('DD/MM/YYYY, [às] HH:mm:ss');
        const dadosLista = await this.getDownloadExecutor(element.id);

        //const dt_inicio = moment(element.dt_inicio);
        //const dt_fim = moment(element.dt_fim);
        // @ts-ignore
        //const tempoLogs:any = moment.duration( dt_fim.diff( dt_inicio ))
        //console.log('dt_inicio', dt_inicio);
        //console.log('dt_fim', dt_fim);
        //console.log('tempoLogs', tempoLogs._milliseconds);

        let tempo:any = 0;
        if( dadosLista.length > 0 ) {
            dadosLista.forEach((item: any) => {
                //console.log(item);
                if (item.bo_status) item.bo_status = 'Ativo';
                else item.bo_status = 'Inativo';

                item.dt_alive = moment(item.dt_alive).format('DD/MM/YYYY [às] HH:mm:ss');

                item.tx_diretorio = item.tx_diretorio.split(':/')[0]+':/'

                /*const duration:any = moment.duration( moment().diff( moment(item.dt_alive) ));
                console.log('duration', duration);
                const milliseconds = duration._milliseconds;*/
                /*if (milliseconds > 120000){
                    this.http.stop_executor(item.id);
                    item.bo_ativo = false;
                }*/
                //tempo = Util.diferencaEntreDatas(item.dt_alive, moment());
                //console.log('tempo', tempo);

                if (item.bo_ativo) item.bo_ativo = 'Ativo';
                else item.bo_ativo = 'Inativo';
            });
        }
        const configuracao = {
            informacao: {label: 'Dados do executor', value:element.tx_nome},
            conteudo:[
                {label:'Criado em', value: element.dt_inclusao_formatada},
                {label:'Tempo em execução', value: element.tempo_execucao},
                {label:'Status', value: element.bo_status, class: classStatus},
                {label:'Nº download', value: element.nu_qtd_download},
                {label:'Nº Tarefas', value: element.nu_qtd_tarefa},
                {label:'Nº Tarefas vinculadas', value: element.tarefas_vinculadas},
                {label:'Qtd. de execuções', value: element.qtd_tarefa_executada}
            ],
            datatable: dadosLista,
            columnsTable:[
                {label:'Ação', field:'acao', class:'',botao:[
                        {label:'Stop', icon:'voice_over_off', callback:'stop', regra:''}
                    ]
                },
                {label:'Host', field:'tx_hostname', class:''},
                {label:'IP', field:'tx_ip', class:''},
                {label:'MAC', field:'tx_ip_mac', class:''},
                {label:'Core', field:'nu_cpu', class:''},
                {label:'Memória', field:'tx_memoria', class:''},
                {label:'OS', field:'tx_os', class:''},
                {label:'HD', field:'tx_hd', class:''},
                {label:'HD Livre', field:'tx_hd_livre', class:''},
                {label:'Diretório', field:'tx_diretorio', class:''},
                {label:'Status', field:'bo_status', class:''},
                {label:'alive', field:'dt_alive', class:''}
            ]
        };
        const dialogRef = this.dialog.open(ModalDetalhamentoComponent, {
            width: '80%',
            data: configuracao
        });
        dialogRef.afterClosed().subscribe(async result => {
            if( result ){
                let retorno = await this.http.stop_executor(result.stop);

                if( retorno.status == 1 ){
                    this.snackBar.open(retorno.message, '', {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 5000
                    });
                }
            }
        });
        this.spinner.hide();
    }

    async getDownloadExecutor(automacao_id: any){
        let dataList = await this.http.pesquisarExecutor(automacao_id, this.userData.setor_id);
        return dataList;
    }

    /*async getHistoricoTarefa(automacao_id: any){
        let dataList = await this.tarefaService.getHistoricoTarefaByAutomacaoId(automacao_id, false);

        let duracaoTotal = moment.duration(0);
        if( dataList.status == 0 ) {
            dataList = [];
        } else {
            dataList.forEach((item: any) => {
                if (item.bo_status) item.bo_status = 'Ativo';
                else item.bo_status = 'Inativo';

                item.tempo = Util.diferencaEntreDatas(item.dt_inicio, item.dt_fim);

                duracaoTotal.add(moment.duration(item.tempo));

                item.nu_cpf_formatado = Util.formatarCpf(item.nu_cpf);
                item.dt_fim_formatada = moment(item.dt_fim).format('DD/MM/YYYY [às] HH:mm:ss');
                item.dt_inicio_formatada = moment(item.dt_inicio).format('DD/MM/YYYY [às] HH:mm:ss');
            });
        }
        return dataList;
    }*/

    editar(id: any){
        this.router.navigate(['cadastro-automacao'], { queryParams: { id: id } });
    }

    async excluir(id: any){

        const dialogRef = this.dialog.open(ModalExcluirComponent, {
            width: '500px',
            data: {texto: 'executor'}
        });

        dialogRef.afterClosed().subscribe(async result => {
            if( result == 'true' ) {
                let retorno = await this.http.excluir(id);

                if( retorno.status == 1 ){
                    await this.pesquisar();
                    this.snackBar.open(retorno.message, '', {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 5000
                    });
                }
            }
        });

    }

}
