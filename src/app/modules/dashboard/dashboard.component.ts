import { Component, OnInit } from '@angular/core';
import {TarefaService} from "../../resources/services/tarefa.service";
import {LoginService} from "../../resources/services/login.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    userData: any;
    dashExecucao: any;
    tempoTotal: any;
    dadosAutomacao: any;
    mostraChart: Boolean = false;

    constructor(private tarefaServices: TarefaService,
                private loginService: LoginService) { }

    async ngOnInit(){
        this.userData = this.loginService.getUserData();
        this.mostraChart = false;
        await this.pegaDadosAutomacao();
        this.mostraChart = true;
    }

    async pegaDadosAutomacao(dados:any=''){
        //console.log('dados', dados);
        this.dashExecucao = await this.tarefaServices.getDadosAutomacaoDashboard(this.userData.cliente_id, dados.automacao_id, dados.periodo, false);
        //console.log('dashExecucao', this.dashExecucao);
        this.dadosAutomacao = this.dashExecucao[0];
        this.tempoTotal = this.dashExecucao[1];
    }
}
