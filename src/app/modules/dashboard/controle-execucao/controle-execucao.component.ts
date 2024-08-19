import { Tarefa } from './../../../resources/models/TarefaModel';
import { UsuarioService } from './../../../resources/services/usuario.service';
import { ControleExecucao } from './../../../resources/models/ControleExecucaoModel';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import {msgSemRegistro, PAGINADOR} from "../../../resources/util/constants";
import { ControleExecucaoService } from 'src/app/resources/services/controle-execucao.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Util } from "../../../resources/util/utils";
import { ModalDetalhamentoComponent } from 'src/app/shared/components/modal-detalhamento/modal-detalhamento.component';
import * as moment from 'moment';
import { LogService } from 'src/app/resources/services/log.service';
import { LoginService } from 'src/app/resources/services/login.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { TarefaService } from 'src/app/resources/services/tarefa.service';

export interface ICliente {
    acao: string;
    id: string;
    tx_sigla: string;
    tx_nome: string;
    bo_status : string;
}

export interface PeriodicElement {
    tx_nome: string;
    tx_chave: string;
    tx_situacao: string;
    dt_cadastro_formata: string;
    tempo_formatado: string;
    tx_resumo: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-controle-execucao',
  templateUrl: './controle-execucao.component.html',
  styleUrls: ['./controle-execucao.component.scss']
})
export class ControleExecucaoComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    displayedColumns: string[] = ['acao','tx_nome','tx_chave', 'tx_situacao', 'dt_cadastro_formata', 'tempo_formatado', 'tx_resumo'];
    columnsToDisplayWithExpand = [...this.displayedColumns];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    
    expandedElement: any;
    msgSemRegistro = msgSemRegistro;
    paginador = PAGINADOR
    outputDados = new EventEmitter<any>();

    startDate: Date = new Date();
    endDate: Date = new Date();

    mostraChart: Boolean = true;
    total_finalizadas:any = [];
    total_pendencias:any = [];
    total_erros:any = [];
    comboTarefas: any = [{codigo: '', descricao: 'Todos'}];
    comboSituacoes: any = [{codigo: '', descricao: 'Todos'}];

    tarefaAtual: any = '';
    situacaoAtual: any = '';

    total_registros:any = 0;
    dadosUsuario: any;
    historicoLogs: any;
    datainicio: any = new Date();
    datafim: any = new Date();
    boPesquisa: boolean = false;

    interface: ICliente[] = [];
    loading: boolean = false;
    bo_status: boolean = true;
    tx_ativo: string = 'Ativo';

    constructor(
        private controleService: ControleExecucaoService,
        private spinner: NgxSpinnerService,
        private logService: LogService,
        private dialog: MatDialog,
        private loginService: LoginService,
        private tarefaService: TarefaService,
        private cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        private _liveAnnouncer: LiveAnnouncer
    ) { }

    async ngOnInit(){
        this.spinner.show();
        this.dadosUsuario = this.loginService.getUserData();
        const today = new Date();
        //this.datainicio = new Date(today.getFullYear(), today.getMonth(), 1);
        //this.datafim = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const pad = (num:any) => num < 10 ? '0' + num : num;
        this.datainicio = this.datainicio ? 
            `${this.datainicio.getFullYear()}-${pad(this.datainicio.getMonth() + 1)}-${pad(this.datainicio.getDate())}` 
            : null;

        this.datafim = this.datafim ? 
            `${this.datafim.getFullYear()}-${pad(this.datafim.getMonth() + 1)}-${pad(this.datafim.getDate())}` 
            : null;

        //this.datainicio = this.datainicio ? this.datainicio.toISOString().split('T')[0] : null; // Verifica se startDate não é null
        //this.datafim = this.datafim ? this.datafim.toISOString().split('T')[0] : null;
        await this.pegar_relatorio_mensal_historico_tarefa({callback: 'filtros', element: '', startDate: this.datainicio, endDate: this.datafim});
        //await this.pesquisar();
        this.carregaComboTarefas();
        this.spinner.hide();
    }

    async pesquisar(){
        this.total_finalizadas = [];
        this.total_pendencias = [];
        this.total_erros = [];
        this.loading = false;

        let retorno = await this.controleService.pesquisar_dash(this.tarefaAtual,this.dadosUsuario.cliente_id,'',this.datainicio, this.datafim,'', this.situacaoAtual,0,0);
        
        let registro:any = [];
        if( retorno.data.length == 0 ) {
            const ELEMENT_DATA: PeriodicElement[] = [];
            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        } else {
            retorno.data.forEach((item: any) => {
                const situacao = item.tx_situacao;
                if (item.tx_situacao == 'WARNING' || item.tx_situacao == 'PENDENTE' || item.tx_situacao == 'PROCESSANDO'){
                    this.total_pendencias.push(item.id);
                    item.tx_situacao = '<span style="color: #1A1A33">'+item.tx_situacao+'</span>';
                }else if (item.tx_situacao == 'ERROR'){ 
                    this.total_erros.push(item.id);
                    item.tx_situacao = '<span style="color: #FF3E6C">'+item.tx_situacao+'</span>';
                } else {
                    this.total_finalizadas.push(item.id);
                    item.tx_situacao = '<span style="color: #00D27E">'+item.tx_situacao+'</span>';
                }

                if( item.dt_fim ) {
                    item.dt_fim_formatada = moment(item.dt_fim).format('DD/MM/YYYY [às] HH:mm:ss');
                }
                item.dt_inicio_formatada = moment(item.dt_inicio).format('DD/MM/YYYY [às] HH:mm:ss');

                registro.push(item);
                
                /*const tarefaExistente = this.comboTarefas.find((tarefa: { codigo: any }) => tarefa.codigo === item.tarefa_id);
                if (!tarefaExistente) {
                    this.comboTarefas.push({codigo: item.tarefa_id, descricao: item.tx_nome});
                }*/

                const situacoesExistente = this.comboSituacoes.find((situacoes: { codigo: any }) => situacoes.codigo === situacao);
                if (!situacoesExistente) {
                    this.comboSituacoes.push({codigo: situacao, descricao: situacao});
                }
            });
        }
        this.total_registros = registro.length;
        const ELEMENT_DATA: PeriodicElement[] = registro;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;

        this.loading = true;
    }

    async carregaComboTarefas(){
        this.comboTarefas = [{codigo: '', descricao: 'Todos'}];
        let retorno = await this.tarefaService.getTarefaCliente(this.dadosUsuario.cliente_id);
        
        if( retorno.length > 0 ) {
            retorno.forEach((item: any) => {
                item = item.Tarefa;
                this.comboTarefas.push({codigo: item.id, descricao: item.tx_nome});
            });
        }
    }

    async atualizarDados(dados:any){
        this.spinner.show();

        this.datainicio = dados.startDate;
        this.datafim = dados.endDate;

        await this.pegar_relatorio_mensal_historico_tarefa({callback: 'filtros', element: '', startDate: this.datainicio, endDate: this.datafim});
        //await this.pesquisar();
        this.spinner.hide()
    }

    async pegar_relatorio_mensal_historico_tarefa(dados: any){
        this.spinner.show();
        this.datainicio = dados.startDate;
        this.datafim = dados.endDate;
        
        let historicos = await this.logService.pegar_relatorio_mensal_historico_tarefa(this.dadosUsuario.cliente_id, this.tarefaAtual, dados.startDate,dados.endDate);
        if (historicos) {
            historicos = historicos[0];
            historicos.percentual_sucesso = (historicos.percentual_sucesso ?? 0);
            historicos.percentual_erro = (historicos.percentual_erro ?? 0);
            historicos.minutos = (historicos.minutos ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            historicos.minutos_sucesso = (historicos.minutos_sucesso ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            historicos.minutos_erro = (historicos.minutos_erro ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            historicos.preco_total = (historicos.preco_total ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            this.historicoLogs = historicos;
            this.cdr.detectChanges();
            this.boPesquisa = true;
        }
        await this.pesquisar();
        this.spinner.hide();
    }

    async visualizarHistorico(element: any){

        console.log(element);
        const dadosLista = await this.controleService.getByIdTarefaChave(element.tarefa_id, element.tx_chave);

        if( dadosLista.length > 0 ) {
            dadosLista.forEach((item: any) => {
                item.dt_inicio = moment(item.dt_inicio).format('DD/MM/YYYY [às] HH:mm:ss');
            });
        }

        const configuracao = {
            informacao: {label: 'Dados da execução', value:element.tx_nome},
            conteudo:[
                {label:'Chave', value: element.tx_chave},
                {label:'Tarefa', value: element.tx_nome}
            ],
            datatable: dadosLista,
            columnsTable:[
                {label:'ID', field:'id', class:''},
                {label:'Situação', field:'tx_situacao', class:''},
                {label:'Data Execução', field:'dt_inicio', class:''},
                {label:'Tempo', field:'tx_tempo', class:''},
                {label:'Histórico', field:'tx_resumo', class:''}
            ]
        };
        //console.log(configuracao);
        this.dialog.open(ModalDetalhamentoComponent, {
            width: '80%',
            data: configuracao
        });
    }

    async abreSituacao(element: any){
        const classStatus = (element.bo_status=='Ativo' ? 'td-status-ativo' : 'td-status-inativo');

        const validaJson = Util.ValidatorJson(element.tx_json);
        const tx_json = ( validaJson.status == 0 ? '': JSON.parse(element.tx_json));
        const tipos = ( validaJson.status == 0 ? '': 'json');
        let imageUrl_path: any = '';
        if (element.tx_imgbase64 != ''){
            await this.controleService.downloadImage(element.id).then(imageUrl => {
                const safeUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl as string);
                imageUrl_path = safeUrl; // Aqui você tem o URL da imagem
            }).catch(error => {
                console.error(error); // Trata o erro, se houver
            });
        }
        const configuracao = {
            informacao: {label: 'Dados da execução', value:element.tx_nome},
            conteudo:[
                {label:'Chave', value: element.tx_chave},
                {label:'Iniciada', value: element.dt_cadastro_formata},
                {label:'Finalizada', value: element.dt_fim_formatada},
                {label:'Tempo de execução', value: element.tempo_formatado},
                {label:'Resumo', value: element.tx_resumo, width:'100%'},
                {label:'Imagem', value: imageUrl_path, type: 'image', width:'100%'},
                {label:'Parâmetros (json)', value: tx_json, type: tipos, width:'100%', class:'json-dados'},
            ],
            datatable: [],
            columnsTable:[]
        };
        //console.log(configuracao);
        this.dialog.open(ModalDetalhamentoComponent, {
            width: '60%',
            data: configuracao
        });
    }

    addOutput(callback: any, element: any) {
        this.outputDados.emit({ callback: callback, element: element });
    }

    handlePageEvent(e: PageEvent) {
        this.addOutput('paginator', e);
        /*this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;*/
    }

    editar(element: any) {
        console.log(element);
    }
    excluir(element: any) {
        console.log(element);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    //sortData(sortState: Sort) {
    sortData(sortState: any) {
        //this.matSort.sort({ id: 'columnName', start: 'asc', disableClear: false });

        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    onChangeToggle(event: any){
        this.bo_status = event.checked;
        this.addOutput('status', this.bo_status);
    }

    onDateChange(callback:any) {
        const pad = (num:any) => num < 10 ? '0' + num : num;

        const startDateFormatted = this.startDate ? 
            `${this.startDate.getFullYear()}-${pad(this.startDate.getMonth() + 1)}-${pad(this.startDate.getDate())}` 
            : null;

        const endDateFormatted = this.endDate ? 
            `${this.endDate.getFullYear()}-${pad(this.endDate.getMonth() + 1)}-${pad(this.endDate.getDate())}` 
            : null;
        
        if (startDateFormatted && endDateFormatted) {
            this.atualizarDados({callback: callback, element: '', startDate: startDateFormatted, endDate: endDateFormatted});
        }
    }

    onChangeFiltroTarefa(event:any) {
        if (event) {
            this.tarefaAtual = event.value;
            //this.pesquisar();
        }
    }

    onChangeFiltroSituacao(event:any) {
        if (event) {
            this.situacaoAtual = event.value;
            //this.pesquisar();
        }
    }
}
