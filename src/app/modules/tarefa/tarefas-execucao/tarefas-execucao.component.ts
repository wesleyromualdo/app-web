import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {Util} from "../../../resources/util/utils";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {TarefaService} from "../../../resources/services/tarefa.service";
import * as moment from 'moment';
import {msgSemRegistro} from "../../../resources/util/constants";
import {UsuarioService} from "../../../resources/services/usuario.service";
import {LoginService} from "../../../resources/services/login.service";
import {MatDialog} from "@angular/material/dialog";
import {StopTarefa} from "../../../resources/models/TarefaModel";
import {ModalExcluirComponent} from "../../../shared/components/modal-excluir/modal-excluir.component";
import { PAGINADOR } from 'src/app/resources/util/constants';
import {LogService} from "../../../resources/services/log.service";

export interface PeriodicElement {
    id: string;
    botao: string;
    acao: string;
    tarefa: string;
    automacao: string;
    dt_inclusao: string;
    tempo : string;
    bo_execucao : string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

interface ComboDataSource {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-tarefas-execucao',
    templateUrl: './tarefas-execucao.component.html',
    styleUrls: ['./tarefas-execucao.component.scss']
})
export class TarefasExecucaoComponent implements OnInit, OnDestroy {

    @Input() habilitaFiltros: boolean = true;
    @Input() visualizacao: boolean = true;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    checked = false;
    valueAutomacao = '';
    comboAutomacao: ComboDataSource[] = [];
    msgSemRegistro = msgSemRegistro;
    cpfLogado: any;
    userData: any;
    paginador = PAGINADOR;
    tentativas: number = 0;

    interval: any;
    tempo: any;
    timeLeft: number = 20;

    displayedColumns: string[] = ['botao', 'acao', 'id', 'tarefa', 'automacao', 'tx_situacao', 'dt_inclusao', 'tempo'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    constructor(private router: Router,
                private snackBar: MatSnackBar,
                private http: TarefaService,
                private spinner: NgxSpinnerService,
                private usuarioService: UsuarioService,
                private loginService: LoginService,
                private dialog: MatDialog,
                private logServices: LogService) { }

    async ngOnInit(){
        this.userData = this.loginService.getUserData();
        this.cpfLogado = this.userData.nu_cpf;

        if( !this.habilitaFiltros ){
            this.displayedColumns.splice(0, 2);
        }

        await this.pesquisar();

        let automacao = await this.usuarioService.getAutomacaoByCPF( this.cpfLogado, this.userData.cliente_id );

        if( automacao.length > 0 ){
            this.comboAutomacao.push({value: '', viewValue: 'Todas automações'})
            automacao.forEach( (item: any) => {
                this.comboAutomacao.push({value: item.id, viewValue: item.tx_nome})
            });
        };

        if( this.visualizacao == true ) {
            this.startTimer();
            this.interval = setInterval(() => {
                this.timeLeft = 20;
                if( this.visualizacao == true ) {
                    this.pesquisar();
                } else {
                    this.ngOnDestroy();
                }
            }, 20000);
        }
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    startTimer() {
        this.tempo = setInterval(() => {
            if(this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.timeLeft = 20;
            }
        },1000)
    }

    async pesquisar(automacao_id: any = ''){
        this.spinner.show();

        let retorno = await this.http.pesquisar(true, this.cpfLogado, '',true, automacao_id, this.userData.cliente_id);

        //let historicoUsuario = await this.http.getHistoricoTarefaByUsuario(this.cpfLogado, false);
        //console.log('historicoUsuario', historicoUsuario);

        if( retorno.status == 0 ) {
            retorno = [];
        } else {
            retorno.forEach(async (item: any) => {
                if (item.bo_status) item.bo_status = 'Ativo';
                else item.bo_status = 'Inativo';

                /*let historico = historicoUsuario.filter((element: any,i: any, itens: any) => {
                    if (element.tarefa_id == item.id) {
                        return element;
                    }
                });*/
                let historico = await this.http.getHistoricoTarefaById(item.id, false);
                item.historico = historico[0];
                //console.log('historico', historico[0]);

                item.iniciada_formatada = '';
                if( historico[0] ) {
                    //const logs = await this.logServices.pesquisar(item.historico.id, '', '', 0, 0);
                    /*if( logs.status == 0 ){
                        const tempoSemLogs = Util.diferencaEntreDatas(historico[0].dt_inicio, moment());
                        //console.log('historico[0].dt_inicio', historico[0].dt_inicio);
                        //console.log('tempoSemLogs', tempoSemLogs, parseInt(tempoSemLogs.split(':')[1]));
                        if( parseInt(tempoSemLogs.split(':')[1]) > 2 ){
                            this.stopTarefa(item, 'Execução finalizada automaticamente. Não opteve resposta do worker.')
                        }
                    } else {
                        //console.log(moment().format(), logs[0].dt_inclusao);
                        const tempoSemLogs = Util.diferencaEntreDatas(logs[0].dt_inclusao, moment());

                        //console.log('tempoSemLogs', parseInt(tempoSemLogs.split(':')[1]));
                        if( parseInt(tempoSemLogs.split(':')[1]) > 2 ){
                            this.stopTarefa(item, 'Execução finalizada automaticamente. Não opteve resposta do worker.')
                        }
                    }*/
                    //console.log('logs', logs);
                    if( !item.historico.dt_fim ){
                        item.historico.dt_fim = moment();
                    }
                    item.tempo = Util.diferencaEntreDatas(item.historico.dt_inicio, item.historico.dt_fim);
                    item.iniciada_formatada = moment(item.historico.dt_inicio).format('DD/MM/YYYY [às] HH:mm:ss');
                }

                item.nu_cpf_formatado = Util.formatarCpf(item.nu_cpf);
                item.dt_inclusao = moment(item.dt_inclusao).format('DD/MM/YYYY [às] HH:mm:ss');
            });
        }

        const ELEMENT_DATA: PeriodicElement[] = retorno;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;

        this.spinner.hide();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    novo(){
        this.router.navigate(['cadastro-tarefa']);
    }

    onAutomacaoChange(event: any){
        this.pesquisar(event.value);
    }

    abreDetalhe(element: any){
        /*this.dialog.open(HistoricoExecucaoComponent, {
            width: '80%',
            data: element
        });*/
        //this.router.navigate(['historico-tarefa'], { queryParams: { tarefa_id: element.id } });
        this.router.navigate(['historico-execucao'], { queryParams: { historico_id: element.historico.id, tarefa_id: element.id, visualizacao: true } });
    }

    async stopTarefa( tarefa: any, tx_resumo:any='Execução finalizada pelo usuário' ){
        //console.log('tarefa', tarefa);
        this.spinner.show();

        tarefa.tarefa_id = tarefa.id;
        tarefa.historico.dt_fim = moment();
        tarefa.nu_cpf = this.cpfLogado;
        tarefa.historico.tx_resumo = tx_resumo;
        tarefa.historico.bo_status_code = 400;
        const dados = new StopTarefa(tarefa.historico);
        //console.log('stopTarefa',dados);
        const retorno = await this.http.stopTarefa(dados);
        if( retorno.message ) {
            this.snackBar.open(retorno.message, '', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
            });
        }
        this.spinner.hide();
        if( retorno.status != 0 ) {
            //window.location.reload();
            //this.router.navigate(['tarefa'], { queryParams: { aba: 0 } });
            //bo_agendada
            if( tarefa.bo_agendada ) {
                this.router.navigate(['tarefa'], { queryParams: { aba: 2 } });
                //window.location.reload();
            } else {
                this.router.navigate(['tarefa'], { queryParams: { aba: 1 } });
                //window.location.reload();
            }
        }
    }

    excluirTarefa(id: any){
        const dialogRef = this.dialog.open(ModalExcluirComponent, {
            width: '500px',
            data: {texto: 'tarefa'}
        });

        dialogRef.afterClosed().subscribe(async result => {
            if( result == 'true' ) {
                let retorno = await this.http.excluir(id);
                await this.pesquisar();
            }
        });

    }

}
