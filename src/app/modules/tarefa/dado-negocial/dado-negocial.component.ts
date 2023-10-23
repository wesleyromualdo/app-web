import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {UsuarioService} from "../../../resources/services/usuario.service";
import {LoginService} from "../../../resources/services/login.service";
import {TarefaService} from "../../../resources/services/tarefa.service";
import {MatDialog} from "@angular/material/dialog";
import {Util} from "../../../resources/util/utils";
import * as moment from 'moment';
import {msgSemRegistro} from "../../../resources/util/constants";
import {DadoNegocialService} from "../../../resources/services/dadoNegocial.service";

@Component({
  selector: 'app-dado-negocial',
  templateUrl: './dado-negocial.component.html',
  styleUrls: ['./dado-negocial.component.scss']
})
export class DadoNegocialComponent implements OnInit {

    msgSemRegistro = msgSemRegistro;
    cpfLogado: any;
    tempo: any;
    historico_id: any;
    tarefa_historico: any;
    tarefa_id: any;
    tarefa: any;
    dt_fim_formatada: any;

    dataList: any;
    loading: boolean = false;
    configTable = {
        table:{
            id:'table-dado-negocial',
            class:''
        },
        btnnovo: '',
        placeholder: 'Busque pelo ID ou descrição ',
        columns:[
            {label:'ID', field:'id', class:''},
            {label:'Descrição', field:'tx_descricao', class:''},
            {label:'Data Inicio', field:'data_formatada_inicio', class:''},
            {label:'Data Fim', field:'data_formatada_fim', class:''},
            {label:'Status', field:'tx_status', class:''},
            {label:'Parâmetros', field:'tx_json', class:''},
        ]
    };

    constructor(private router: Router,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private usuarioService: UsuarioService,
                private loginService: LoginService,
                private tarefaService: TarefaService,
                private dadoNegocialService: DadoNegocialService,
                private dialog: MatDialog,
                private route: ActivatedRoute) { }

    async ngOnInit(){

        this.route.queryParams.subscribe(params => {
            this.historico_id = params['historico_id'];
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

        this.spinner.show();
        await this.pesquisar();
        this.spinner.hide();
        this.loading = true;

        const userData = this.loginService.getUserData();
        this.cpfLogado = userData.nu_cpf;
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

    async pesquisar(){
        this.loading = false;
        this.spinner.show();
        this.dataList = await this.dadoNegocialService.pesquisar(this.historico_id, '', '', 0, 0);

        if( this.dataList.status == 0 ) {
            this.dataList = [];
        } else {
            this.dataList.forEach(async (item: any) => {
                item.data_formatada_inicio = moment(item.dt_inicio).format('DD/MM/YYYY [às] HH:mm:ss');
                item.data_formatada_fim = moment(item.dt_fim).format('DD/MM/YYYY [às] HH:mm:ss');
            });
        }

        await this.calculaTempoHistorico();
        this.spinner.hide();
        this.loading = true;
    }

    voltar(){
        this.router.navigate(['historico-tarefa'], {queryParams: {tarefa_id: this.tarefa_id}});
    }

}
