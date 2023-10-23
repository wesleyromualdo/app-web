import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import {NgxSpinnerService} from "ngx-spinner";
import {TarefaService} from "../../../resources/services/tarefa.service";
import {LoginService} from "../../../resources/services/login.service";
import {Util} from "../../../resources/util/utils";
import * as moment from 'moment';
import {UsuarioService} from "../../../resources/services/usuario.service";

interface ComboDataSource {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-widget-chart-area',
    templateUrl: './chart-area.component.html',
    styleUrls: ['./chart-area.component.scss']
})
export class ChartAreaComponent implements OnInit {

    @Output() outputDados = new EventEmitter<any>();
    @Input() tempoTotal?: any;
    loading = false;
    Highcharts: typeof Highcharts = Highcharts;
    chartOptions: Highcharts.Options = {};
    updateFlag = false;
    userData: any;
    dias:any=0;
    hora:any;
    min: any;

    public formulario: any;

    comboAutomacao: ComboDataSource[] = [];
    comboDias: ComboDataSource[] = [];
    valueDias = '10';
    valueAutomacao = '';

    constructor(private spinner: NgxSpinnerService,
                private tarefaServices: TarefaService,
                private loginService: LoginService,
                private usuarioService: UsuarioService,) { }

    async ngOnInit() {
        this.userData = this.loginService.getUserData();
        //console.log('this.tempo_total', this.tempoTotal);

        await this.carregaComboAutomacao(this.valueDias);

        await this.carregaGraficoBigCharts();

        this.comboDias = [
            {
                value: '10',
                viewValue: 'Últimos 10 dias'
            },
            {
                value: '20',
                viewValue: 'Últimos 20 dias'
            },
            {
                value: '30',
                viewValue: 'Últimos 30 dias'
            },
            {
                value: '45',
                viewValue: 'Últimos 45 dias'
            },
            {
                value: '60',
                viewValue: 'Últimos 60 dias'
            }
        ]
    }

    async carregaGraficoBigCharts(automacao_id: any ='', periodo:any=10){

        this.spinner.show();
        this.chartOptions = {};

        const dashTarefa = await this.tarefaServices.getDadosTarefaDashboard(this.userData.setor_id, automacao_id, periodo, this.userData.nu_cpf);
        //console.log('dashTarefa', dashTarefa);

        let categoria: any = [];
        let seriesDados: any = [];

        if( dashTarefa && dashTarefa.length > 0 ){
            let dadosMinutos: any = [];
            dashTarefa.forEach( (item: any) => {
                //console.log(item.data);
                if( item.data ) {
                    categoria.push(item.data);
                }
                let registros = item.registros;

                if( seriesDados.length == 0 ){
                    registros.forEach( (i: any) => {
                        seriesDados.push({name:i.tarefa, data:[]});
                    });
                }

                seriesDados.forEach( (tarefa: any) => {
                    dadosMinutos = registros.filter((element: any,i: any, item: any) =>{
                        //console.log(element, i, item);
                        if( element.tarefa.includes(tarefa.name) ){
                            if(element.tem_historico == 'N'){
                                element.minutos = '';
                            }
                            if( element.minutos ) {
                                seriesDados[i].data.push(element.minutos);
                            }
                        }
                    });
                });
            });
        }
        //console.log('categoria', categoria);
        //console.log('seriesDados', seriesDados);

        //type: 'areaspline'
        this.chartOptions = {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Consumo médio de tarefas por data'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 59,
                y: 42,
                floating: true,
                borderWidth: 1
            },
            xAxis: {
                categories: categoria, //['Segunda', 'Terça', 'Quarta','Quinta','Sexta','Sábado','Domingo'],
                /*plotBands: [{ // visualize the weekend
                    from: 4.5,
                    to: 6.5,
                    color: 'rgba(68, 170, 213, .2)'
                }],*/
                title: {
                    text: 'Data da Execução'
                }
            },
            yAxis: {
                title: {
                    text: 'Tempo de Execução (Minutos)'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' Minutos'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: seriesDados /*[{
                name: 'John',
                data: [3, 4, 3, 5, 4, 10, 12]
            }, {
                name: 'Jane',
                data: [1, 3, 4, 3, 3, 5, 4]
            }]*/
        }
        HC_exporting(Highcharts);
        //this.handleUpdate();

        setTimeout(() => {
            window.dispatchEvent( new Event('resize'));
        }, 300);
        this.spinner.hide();

        this.loading = true;
    }

    handleUpdate() {
        Highcharts.charts.reverse()

        this.updateFlag = true;
    }

    async carregaComboAutomacao(periodo:any){
        let automacao = await this.usuarioService.getAutomacaoByCPFDashBoard( this.userData.nu_cpf, this.userData.setor_id, periodo);

        this.comboAutomacao = [];
        if( automacao.length > 0 ){
            this.comboAutomacao.push({value: '', viewValue: 'Todas automações'})
            automacao.forEach( (item: any) => {
                this.comboAutomacao.push({value: item.id, viewValue: item.tx_nome})
            });
        };
    }

    async onAutomacaoChange(event: any){
        this.valueAutomacao = event.value;
        this.outputDados.emit({automacao_id: this.valueAutomacao, periodo: this.valueDias});
        await this.carregaGraficoBigCharts(this.valueAutomacao, this.valueDias);
    }

    async onDiasChange(event: any){
        this.valueDias = event.value;
        this.outputDados.emit({automacao_id: this.valueAutomacao, periodo: this.valueDias});
        await this.carregaGraficoBigCharts(this.valueAutomacao, this.valueDias);
        await this.carregaComboAutomacao(this.valueDias);
    }
}
