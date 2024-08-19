import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/resources/services/login.service';
import { TarefaService } from 'src/app/resources/services/tarefa.service';

@Component({
  selector: 'app-default-dash',
  templateUrl: './default-dash.component.html',
  styleUrls: ['./default-dash.component.scss']
})
export class DefaultDashComponent implements OnInit {

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
