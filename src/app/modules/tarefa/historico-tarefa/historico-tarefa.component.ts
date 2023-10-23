import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {msgSemRegistro} from "../../../resources/util/constants";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {TarefaService} from "../../../resources/services/tarefa.service";
import { Util } from "../../../resources/util/utils";
import {ActivatedRoute, Router} from "@angular/router";
import { PAGINADOR } from 'src/app/resources/util/constants';
import {ModalDetalhamentoComponent} from "../../../shared/components/modal-detalhamento/modal-detalhamento.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-detalhamento-tarefas',
    templateUrl: './historico-tarefa.component.html',
    styleUrls: ['./historico-tarefa.component.scss']
})
export class HistoricoTarefaComponent implements OnInit {

    isChecked: boolean = true;
    tx_ativo: string = 'Ativo';
    tempoExecucaoTotal: any;

    msgSemRegistro = msgSemRegistro;

    tarefa: any;
    tarefa_id: any;

    dataList: any;
    loading: boolean = false;
    configTable = {
        table:{
            id:'table-hist-tarefa',
            class:''
        },
        btnnovo: '',
        placeholder: '',
        columns:[
            {label:'Ação', field:'acao', class:'',botao:[
                    {label:'Detalhamento', icon:'remove_red_eye', callback:'detalhe'},
                    {label:'Logs', icon:'history', callback:'logs'},
                    {label:'Dados negociais', icon:'business_center', callback:'dadosNegociais'}
                ]
            },
            {label:'CPF', field:'nu_cpf_formatado', class:'', link:true, callback:'logs'},
            {label:'Iniciada', field:'dt_inicio_formatada', class:''},
            {label:'Finalizada', field:'dt_fim_formatada', class:''},
            {label:'Executor', field:'executor', class:''},
            {label:'IP MAC', field:'tx_ip_execucao', class:''},
            {label:'Tempo de execução', field:'tempo', class:''},
            {label:'Status', field:'statusdesc', class:'', link:true, callback:'detalhe'}
        ]
    };

    constructor(
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService,
        private tarefaService: TarefaService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog
    ) {}

    async ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.tarefa_id = params['tarefa_id'];
        });

        this.tarefa = await this.tarefaService.getById(this.tarefa_id);

        if (this.tarefa.bo_status) this.tarefa.bo_status_formatado = 'Ativo';
        else this.tarefa.bo_status_formatado = 'Inativo';

        this.tarefa.nu_cpf_formatado = Util.formatarCpf(this.tarefa.nu_cpf);
        this.tarefa.dt_inclusao = moment(this.tarefa.dt_inclusao).format('DD/MM/YYYY [às] HH:mm:ss');
        //console.log('tarefa', this.tarefa);

        await this.getHistoricoTarefa();
    }

    async getHistoricoTarefa(){
        this.spinner.show();
        this.dataList = await this.tarefaService.getHistoricoTarefaById(this.tarefa_id, false);
        //console.log('this.dataList', this.dataList);
        let duracaoTotal = moment.duration(0);
        if( this.dataList.status == 0 ) {
            this.dataList = [];
        } else {
            this.dataList.forEach((item: any) => {
                if (item.bo_status) item.bo_status = 'Ativo';
                else item.bo_status = 'Inativo';

                if( moment(item.dt_inicio) > moment(item.dt_fim) ){
                    item.tempo = '00:00:00';
                } else {
                    item.tempo = Util.diferencaEntreDatas(item.dt_inicio, item.dt_fim);
                }

                duracaoTotal.add(moment.duration(item.tempo));

                if( item.bo_status_code >= 200 && item.bo_status_code <= 299){
                    item.statusdesc = '<span class="td-status-ativo">Sucesso</span>';
                } else {
                    item.statusdesc = '<span class="td-status-erro">Erro</span>';
                }

                item.nu_cpf_formatado = Util.formatarCpf(item.nu_cpf);
                if( item.dt_fim ) {
                    item.dt_fim_formatada = moment(item.dt_fim).format('DD/MM/YYYY [às] HH:mm:ss');
                }
                item.dt_inicio_formatada = moment(item.dt_inicio).format('DD/MM/YYYY [às] HH:mm:ss');
                item.tarefa = {tx_nome: this.tarefa.tx_nome, automacao: this.tarefa.automacao.tx_nome}
            });
        }
        this.tempoExecucaoTotal = duracaoTotal.hours().toString().padStart(2, '0') + ':' +
            duracaoTotal.minutes().toString().padStart(2, '0') + ':' +
            duracaoTotal.seconds().toString().padStart(2, '0');
        this.spinner.hide();
        this.loading = true;
    }

    executaRetorno(dados: any) {
        if( dados.callback == 'logs' ){
            this.abreLogs(dados.element);
        }
        if( dados.callback == 'detalhe' ){
            this.detalhamento(dados.element);
        }
        if( dados.callback == 'dadosNegociais' ){
            this.abreDadosNegociais(dados.element);
        }
    }

    detalhamento(element: any){
        console.log(element);
        const classStatus = (element.bo_status=='Ativo' ? 'td-status-ativo' : 'td-status-inativo');

        const validaJson = Util.ValidatorJson(element.tx_json);
        const tx_json = ( validaJson.status == 0 ? '': JSON.parse(element.tx_json));
        const tipos = ( validaJson.status == 0 ? '': 'json');
        const configuracao = {
            informacao: {label: 'Dados da tarefa', value:element.tarefa.tx_nome},
            conteudo:[
                {label:'CPF', value: element.nu_cpf_formatado},
                {label:'Iniciada', value: element.dt_inicio_formatada},
                {label:'Finalizada', value: element.dt_fim_formatada},
                {label:'Tempo de execução', value: element.tempo},
                {label:'Resumo', value: element.tx_resumo, width:'100%'},
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

    abreLogs(evento: any){
        this.router.navigate(['historico-execucao'], { queryParams: { historico_id: evento.id, tarefa_id: this.tarefa_id, visualizacao: false } });
    }

    abreDadosNegociais(evento: any){
        this.router.navigate(['dado-negocial'], { queryParams: { historico_id: evento.id, tarefa_id: this.tarefa_id } });
    }

    voltar(){
        this.router.navigate(['tarefa'])
    }
}
