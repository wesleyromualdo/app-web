import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {TarefaService} from "../../../resources/services/tarefa.service";
import {Util} from "../../../resources/util/utils";
import * as moment from 'moment';
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {msgSemRegistro, PAGINADOR} from "../../../resources/util/constants";
import {UsuarioService} from "../../../resources/services/usuario.service";
import {LoginService} from "../../../resources/services/login.service";
import {MatDialog} from "@angular/material/dialog";
import {StartTarefa} from "../../../resources/models/TarefaModel";
import {ModalExcluirComponent} from "../../../shared/components/modal-excluir/modal-excluir.component";
import {ModalParametroJsonComponent} from "../../../shared/components/modal-parametro-json/modal-parametro-json.component";
import {AutomacaoService} from "../../../resources/services/automacao.service";
import {Automacao} from "../../../resources/models/AutomacaoModel";
import {SelectionModel} from "@angular/cdk/collections";

export interface PeriodicElement {
    botao: string;
    acao: string;
    id: string;
    tarefa: string;
    automacao: string;
    dt_inclusao_lista: string;
    tempo : string;
    bo_status : string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

interface ComboDataSource {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-tarefas-finalizadas',
    templateUrl: './tarefas-finalizadas.component.html',
    styleUrls: ['./tarefas-finalizadas.component.scss']
})
export class TarefasFinalizadasComponent implements OnInit {

    @Input() habilitaFiltros: boolean = true;
    @Input() visualizacao: boolean = true;
    @Input() bo_agendada: boolean = false;
    @Input() abaActive: any = '';
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    checked = false;
    valueAutomacao = '';
    comboAutomacao: ComboDataSource[] = [];
    msgSemRegistro = msgSemRegistro;
    cpfLogado: any;
    tempoExecucao: any = '00:00:00';
    userData: any;
    filterValue: any = '';
    tx_ativo: string = 'Ativo';
    bo_status: boolean = true;
    paginador = PAGINADOR;
    retornoTarefa: any = [];

    interval: any;
    tempo: any;
    timeLeft: number = 20;
    checkLote: any = [];

    displayedColumns: string[] = ['check', 'botao', 'acao', 'id', 'tarefa', 'automacao', 'tx_situacao', 'dt_inclusao_lista', 'tempo', 'bo_status'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    constructor(private router: Router,
                private http: TarefaService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private usuarioService: UsuarioService,
                private loginService: LoginService,
                private dialog: MatDialog,
                private automacaoService: AutomacaoService) { }

    async ngOnInit(){
        if(this.bo_agendada == true) {
            this.displayedColumns = ['check','botao', 'acao', 'id', 'tarefa', 'automacao', 'tx_situacao', 'dt_inclusao_lista', 'tempo', 'agendamento', 'bo_status'];
        }
        this.userData = await this.loginService.getUserData();
        this.cpfLogado = this.userData.nu_cpf;

        if( !this.habilitaFiltros ){
            this.displayedColumns.splice(0, 2);
        }

        await this.pesquisar();

        let automacao = await this.usuarioService.getAutomacaoByCPF( this.cpfLogado, this.userData.setor_id );

        if( automacao.length > 0 ){
            this.comboAutomacao.push({value: '', viewValue: 'Todas automações'})
            automacao.forEach( (item: any) => {
                this.comboAutomacao.push({value: item.id, viewValue: item.tx_nome})
            });
        };

        /*if( this.visualizacao == true ) {
            this.startTimer();
            this.interval = setInterval(() => {
                this.timeLeft = 20;
                if( this.visualizacao == true ) {
                    this.pesquisar();
                } else {
                    this.ngOnDestroy();
                }
            }, 20000);
            //console.log('inicio', this.interval);
        }*/
    }

    ngOnDestroy() {
        //console.log('this.interval', this.interval);
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

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    async pesquisar(automacao_id: any = ''){
        this.spinner.show();

        this.retornoTarefa = await this.http.pesquisar(false, this.cpfLogado, '', this.bo_status, automacao_id, this.userData.setor_id, this.bo_agendada);
        //let historicoUsuario = await this.http.getHistoricoTarefaByUsuario(this.cpfLogado, this.bo_agendada);
        //console.log(historicoUsuario);

        let historicosDados: any = [];
        if( this.retornoTarefa.status == 0 ) {
            this.retornoTarefa = [];
        } else {
            //historicosDados = historicoUsuario;
            this.retornoTarefa.forEach(async (item: any) => {
                if (item.bo_status) item.bo_status_formatado = 'Ativo';
                else item.bo_status_formatado = 'Inativo';

                let historico:any = [];
                //console.log(historicoUsuario.length);
                /*if( historicosDados.length > 0 ) {
                    historico = historicosDados.filter((element: any, i: any, itens: any) => {
                        if (element.tarefa_id == item.id) {
                            return element;
                        }
                    });
                }*/

                //console.log('historico', historico);
                //const historico = await this.http.getHistoricoTarefaById(item.id, false);
                historico = {id:item.historico_id, dt_inicio: item.dt_inicio, dt_fim:item.dt_fim};
                item.historico = historico;

                item.tempo = '00:00:00';
                item.iniciada_formatada = ''
                if( historico.dt_inicio ) {
                    item.tempo = Util.diferencaEntreDatas(item.historico.dt_inicio, item.historico.dt_fim);
                    item.iniciada_formatada = moment(item.historico.dt_inicio).format('DD/MM/YYYY [às] HH:mm:ss');
                }

                item.nu_cpf_formatado = Util.formatarCpf(item.nu_cpf);
                item.dt_inclusao = moment(item.dt_inclusao).format('DD/MM/YYYY [às] HH:mm:ss');
            });
        }
        const ELEMENT_DATA: PeriodicElement[] = this.retornoTarefa;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;

        this.spinner.hide();
    }

    applyFilter(event: Event) {
        this.filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = this.filterValue.trim().toLowerCase();

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
        this.router.navigate(['historico-tarefa'], { queryParams: { tarefa_id: element.id } });
    }

    async startTarefa( tarefa: any, action:any='B' ){

        tarefa.tarefa_id = tarefa.id;
        tarefa.nu_cpf = this.cpfLogado;

        if( tarefa.tx_json && action == 'B' ) {
            const dialogRef = this.dialog.open(ModalParametroJsonComponent, {
                width: '40%',
                data: tarefa
            });
            dialogRef.afterClosed().subscribe(async result => {
                //console.log(result);
                this.spinner.show();
                if( result != undefined ) {
                    tarefa.tx_json = result.tx_json;

                    const dados = new StartTarefa(tarefa);
                    const retorno = await this.http.startTarefa(dados);

                    this.snackBar.open(retorno.message, '', {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 5000
                    });

                    if( retorno.status != 0 ) {
                        this.router.navigate(['tarefa'], { queryParams: { aba: 0 } });
                        //window.location.reload();
                    }
                }
                this.spinner.hide();
            });
        } else {
            this.spinner.show();
            const dados = new StartTarefa(tarefa);
            //console.log(dados);
            const retorno = await this.http.startTarefa(dados);
            //console.log('retorno', retorno);
            this.snackBar.open(retorno.message, '', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
            });
            if( retorno.status != 0 ) {
                this.router.navigate(['tarefa'], { queryParams: { aba: 0 } });
                //window.location.reload();
            }
            this.spinner.hide();
        }
        await this.pesquisar();
    }

    editar(id: any){
        if( this.visualizacao == true ) {
            clearInterval(this.interval);
        }
        this.router.navigate(['cadastro-tarefa'], { queryParams: { id: id } });
    }

    excluirTarefa(id: any){
        const dialogRef = this.dialog.open(ModalExcluirComponent, {
            width: '500px',
            data: {texto: 'tarefa'}
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
    onChangeToggle(event: any){
        this.bo_status = event.checked;
        this.tx_ativo = (this.bo_status ? 'Ativo' : 'Inativo');
        this.pesquisar();
    }

    changeAbasActive(index:any){
        console.log('aba1 =>', index);
    }

    showOptions(event: any, tarefa:any){
        //console.log(tarefa);
        if( event.checked ){
            this.checkLote.push(tarefa);
        } else {
            let dadosId:any= [];
            this.checkLote.forEach((item:any)=>{
                if( item.id != tarefa.id ){
                    dadosId.push(item);
                }
            });
            this.checkLote = [];
            this.checkLote = dadosId;
        }
    }
    async startTarefaLote(){
        this.checkLote.forEach((item:any)=> {
            this.startTarefa(item, 'L');
        });
    }
    onChangeEventTodos(event: any){
        this.checkLote = [];
        this.retornoTarefa.forEach((item: any) => {
            item.checked = event.checked;
            //console.log(item.tx_nome.toLowerCase().indexOf(this.filterValue.trim()), item.tx_nome.trim().toLowerCase(), this.filterValue.trim().toLowerCase());
            if( event.checked && item.anexo_script_id && item.tx_nome.toLowerCase().indexOf(this.filterValue.trim()) != -1 ) {
                this.checkLote.push(item);
            }
        });
        //console.log(this.checkLote);
    }
}
