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
import { ModalDetalhamentoComponent } from 'src/app/shared/components/modal-detalhamento/modal-detalhamento.component';
import { DomSanitizer } from '@angular/platform-browser';

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
        height: '50vh',
        btnnovo: '',
        placeholder: 'Busque pelo log de execução',
        page:{
            length: 100,
            pageIndex: 0,
            pageSize:10,
            previousPageIndex:0
        },
        columns:[
            {label:'ID', field:'id', class:''},
            {label:'Data', field:'data_formatada', class:''},
            {label:'Log', field:'tx_descricao', class:''},
            {label:'Status', field:'statusdesc', class:'', link:true, callback:'detalhe'}
        ]
    };

    constructor(private router: Router,
                private snackBar: MatSnackBar,
                private http: LogService,
                private spinner: NgxSpinnerService,
                private loginService: LoginService,
                private tarefaService: TarefaService,
                private dialog: MatDialog,
                private sanitizer: DomSanitizer,
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

    async pesquisar(pagina=0, tamanho_pagina:any=20, filter=''){
        this.loading = false;
        //this.spinner.show();
        //console.log(pagina, tamanho_pagina);
        const retorno = await this.http.pesquisar(this.historico_id, filter, pagina, tamanho_pagina);
        this.dataList = retorno.dados;
        this.configTable.page.length = retorno.total;

        if( this.dataList.status == 0 ) {
            this.dataList = [];
        } else {
            this.dataList.forEach(async (item: any) => {
                item.data_formatada = moment(item.dt_inclusao).format('DD/MM/YYYY [às] HH:mm:ss');
                if( item.tx_status == 'success' || item.tx_status == 'info'){
                    item.statusdesc = '<span class="td-status-ativo">'+item.tx_status+'</span>';
                } else {
                    item.statusdesc = '<span class="td-status-erro">'+item.tx_status+'</span>';
                }
            });
        }
        await this.calculaTempoHistorico();
        //this.spinner.hide();
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
        console.log(dados);
        if( dados.callback == 'paginator' ){
            this.pageIndex = dados.element.pageIndex;

            this.configTable.page.length = dados.element.length;
            this.configTable.page.pageSize = dados.element.pageSize;
            this.configTable.page.pageIndex = dados.element.pageIndex;
            this.configTable.page.previousPageIndex = dados.element.previousPageIndex;

            this.pesquisar(this.pageIndex)
        }
        if( dados.callback == 'detalhe' ){
            this.detalhamento(dados.element);
        }

        if( dados.callback == 'pesquisa' ){
            this.pesquisar(0, 20, dados.element);
        }
    }

    async detalhamento(element: any){
        //console.log(element);
        const classStatus = ( (element.tx_status=='success' || element.tx_status=='info')  ? 'td-status-ativo' : 'td-status-erro');

        const validaJson = Util.ValidatorJson(element.tx_json);
        const tx_json = ( validaJson.status == 0 ? '': JSON.parse(element.tx_json));
        const tipos = ( validaJson.status == 0 ? '': 'json');

        let imageUrl_path: any = '';
        if (element.tx_imagem != ''){
            await this.http.downloadImage(element.id).then(imageUrl => {
                const safeUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl as string);
                imageUrl_path = safeUrl; // Aqui você tem o URL da imagem
            }).catch(error => {
                console.error(error); // Trata o erro, se houver
            });
        }

        const configuracao = {
            informacao: {label: 'Dados da tarefa', value:this.tarefa.tx_nome},
            conteudo:[
                {label:'ID', value: element.id},
                {label:'Data', value: element.data_formatada},
                {label:'Status', value: element.tx_status.toUpperCase(), class: classStatus},
                {label:'Resumo', value: element.tx_descricao, width:'100%'},
                {label:'Imagem', value: imageUrl_path, type: 'image', width:'100%'},
                {label:'Parâmetros (json)', value: tx_json, type: tipos, width:'100%', class:'json-dados'},
            ],
            datatable: [],
            columnsTable:[]
        };
        this.dialog.open(ModalDetalhamentoComponent, {
            width: '60%',
            data: configuracao
        });
    }

}
