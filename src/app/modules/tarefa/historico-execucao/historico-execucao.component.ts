import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {UsuarioService} from "../../../resources/services/usuario.service";
import {LoginService} from "../../../resources/services/login.service";
import {MatDialog} from "@angular/material/dialog";
import {Util} from "../../../resources/util/utils";
import * as moment from 'moment';
import {msgSemRegistro} from "../../../resources/util/constants";
import {LogService} from "../../../resources/services/log.service";
import {TarefaService} from "../../../resources/services/tarefa.service";

@Component({
    selector: 'app-historico-execucao',
    templateUrl: './historico-execucao.component.html',
    styleUrls: ['./historico-execucao.component.scss']
})
export class HistoricoExecucaoComponent implements OnInit {

    msgSemRegistro = msgSemRegistro;
    cpfLogado: any;
    interval: any;
    tempo: any;
    timeLeft: number = 5;
    pageIndex:any = 0;
    historico_id: any;
    visualizacao: any;
    tarefa_historico: any;
    tarefa_id: any;
    tarefa: any;
    dt_fim_formatada: any;

    dataList: any;
    loading: boolean = false;
    configTable = {
        table:{
            id:'table-hist-logs',
            class:''
        },
        btnnovo: '',
        placeholder: 'Busque pelo ID ou log de execução ',
        page:{
            length: 0,
            pageIndex: this.pageIndex,
            pageSize:0,
            previousPageIndex:0
        },
        columns:[
            {label:'ID', field:'id', class:''},
            {label:'Data', field:'data_formatada', class:''},
            {label:'Log', field:'tx_descricao', class:''},
            {label:'Status', field:'statusdesc', class:''}
        ]
    };

    constructor(private router: Router,
                private snackBar: MatSnackBar,
                private http: LogService,
                private spinner: NgxSpinnerService,
                private usuarioService: UsuarioService,
                private loginService: LoginService,
                private tarefaService: TarefaService,
                private dialog: MatDialog,
                private route: ActivatedRoute) { }

    async ngOnInit(){

        this.route.queryParams.subscribe(params => {
            this.historico_id = params['historico_id'];
            this.visualizacao = params['visualizacao'];
            this.tarefa_id = params['tarefa_id'];
        });

        /*console.log('visualizacao', this.visualizacao);
        console.log('tarefa_id', this.tarefa_id);
        console.log('historico_id', this.historico_id);*/

        this.tarefa = await this.tarefaService.getById(this.tarefa_id);
        //console.log('tarefa', this.tarefa);
        this.tarefa_historico = await this.tarefaService.getHistoricoTarefaByHistoricoId(this.historico_id);

        //console.log('tarefa_historico', this.tarefa_historico);

        this.calculaTempoHistorico();

        await this.pesquisar();
        this.loading = true;

        if( this.visualizacao === 'true' ) {
            this.startTimer();
            this.interval = setInterval(() => {
                this.timeLeft = 5;
                this.pesquisar();
            }, 5000);
        }

        const userData = this.loginService.getUserData();
        this.cpfLogado = userData.nu_cpf;
    }

    startTimer() {
        this.tempo = setInterval(() => {
            if(this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.timeLeft = 5;
            }
        },1000)
    }

    onChangeToggle(event: any){
        if( event.checked ){
            this.visualizacao = 'true';
            this.startTimer();
            this.interval = setInterval(() => {
                this.timeLeft = 5;
                this.pesquisar();
            }, 5000);
        } else {
            this.timeLeft = 0
            this.visualizacao = 'false';
            clearInterval(this.interval);
            clearInterval(this.tempo);
        }
        //console.log(this.tempo, this.timeLeft, this.visualizacao);
    }

    async calculaTempoHistorico(){

        if( !this.tarefa_historico.dt_fim ){
            this.tarefa_historico.dt_fim = moment();
        }

        this.tarefa_historico.tempo = Util.diferencaEntreDatas(this.tarefa_historico.dt_inicio, this.tarefa_historico.dt_fim);
        this.tarefa_historico.nu_cpf_formatado = Util.formatarCpf(this.tarefa_historico.nu_cpf);
        this.dt_fim_formatada = moment(this.tarefa_historico.dt_fim).format('DD/MM/YYYY [às] HH:mm:ss');
        this.tarefa_historico.dt_inicio_formatada = moment(this.tarefa_historico.dt_inicio).format('DD/MM/YYYY [às] HH:mm:ss');
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    async pesquisar(pagina:any=0, tamanho_pagina:any=100){
        this.loading = false;
        this.spinner.show();
        console.log(pagina, tamanho_pagina);
        this.dataList = await this.http.pesquisar(this.historico_id, '', '', pagina, tamanho_pagina);

        if( this.dataList.status == 0 ) {
            this.dataList = [];
        } else {
            this.dataList.forEach(async (item: any) => {
                if( item.tx_acao_auxiliar ) {
                    item.tx_descricao = item.tx_descricao + ' - ' + item.tx_acao_auxiliar
                }
                item.data_formatada = moment(item.dt_inclusao).format('DD/MM/YYYY [às] HH:mm:ss');
                if( item.tx_status == 'success' || item.tx_status == 'info'){
                    item.statusdesc = '<span class="td-status-ativo">'+item.tx_status+'</span>';
                } else {
                    item.statusdesc = '<span class="td-status-erro">'+item.tx_status+'</span>';
                }
            });
        }
        await this.calculaTempoHistorico();
        this.spinner.hide();
        this.loading = true;
    }

    voltar(){
        if( this.visualizacao === 'true' ) {
            this.router.navigate(['tarefa']);
        } else {
            this.router.navigate(['historico-tarefa'], {queryParams: {tarefa_id: this.tarefa_id}});
        }
    }

    executaRetorno(dados: any) {
        if( dados.callback == 'paginator' ){
            this.pageIndex = (this.pageIndex + dados.element.pageIndex);
            const pageSize = (dados.element.length+dados.element.pageSize)
            this.configTable.page = {
                length: pageSize,
                pageIndex: this.pageIndex,
                pageSize: dados.element.pageSize,
                previousPageIndex: dados.element.previousPageIndex
            }
            //console.log((dados.element.pageIndex * dados.element.pageSize), dados.element.length);
            this.pesquisar(this.pageIndex, pageSize)
        }
    }

}
