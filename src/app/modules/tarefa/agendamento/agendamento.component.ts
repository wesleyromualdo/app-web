import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../../resources/services/login.service";
import {MatDatepickerInputEvent, MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {TarefaService} from "../../../resources/services/tarefa.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Tarefa} from "../../../resources/models/TarefaModel";
import {SelectionModel} from "@angular/cdk/collections";
import * as moment from 'moment';
import {MatSelectChange} from "@angular/material/select";
import {MatRadioChange} from "@angular/material/radio";
import {MatCheckboxChange} from "@angular/material/checkbox";

interface ComboValues {
    id: string;
    value: string;
}

@Component({
    selector: 'app-agendamento',
    templateUrl: './agendamento.component.html',
    styleUrls: ['./agendamento.component.scss']
})
export class AgendamentoComponent implements OnInit {

    dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
        // Only highligh dates inside the month view.
        if (view === 'month') {
            const date = cellDate.getDate();

            // Highlight the 1st and 20th day of each month.
            return date === 1 || date === 20 ? 'example-custom-date-class' : '';
        }

        return '';
    };

    id: any = '';
    cpfLogado: any;
    userData: any;
    formulario: any;

    horario: any;
    horarioValid: any = {
        existe: false,
        invalido: false,
        isnull: false
    };

    diaDaSemana:any='SEG';
    // @ts-ignore
    comboDiaSemana: ComboValues[] = [
        {id:'SEG', value:'Segunda'},
        {id:'TER', value:'Terça'},
        {id:'QUA', value:'Quarta'},
        {id:'QUI', value:'Quinta'},
        {id:'SEX', value:'Sexta'},
        {id:'SAB', value:'Sábado'},
        {id:'DOM', value:'Domingo'}
    ];

    comboMes: ComboValues[] = [];

    dataMensal:any='';
    dataMensalValid: any = {
        existe: false,
        invalido: false
    };

    jsonCronograma: any = {};
    selectionHorario = new SelectionModel<any>(true, []);
    selectionHoraemhora: boolean = false;
    selectionRepetir: boolean = false;
    horarios: any = [];

    public model: Tarefa = new Tarefa();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private loginService: LoginService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private tarefaService: TarefaService) { }

    async ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.id = parseInt(params['id']);
        });

        this.userData = this.loginService.getUserData();
        this.cpfLogado = this.userData.nu_cpf;

        this.formulario = new FormGroup({
            id: new FormControl('', []),
            json_agendamento: new FormControl('', []),
            horario: new FormControl('', []),
            dataMensal: new FormControl('', []),
            diaDaSemana: new FormControl('', [])
        });

        if( this.id ){
            await this.getTarefaById();
        }
    }

    async getTarefaById(){
        this.spinner.show();
        let retorno = await this.tarefaService.getById(this.id);

        this.selectionHorario = new SelectionModel<any>(true, []);

        if( retorno.json_agendamento != '' && retorno.json_agendamento != undefined){
            retorno.json_agendamento = JSON.parse(retorno.json_agendamento);
            this.jsonCronograma = retorno.json_agendamento;
            this.selectionRepetir = this.jsonCronograma.repetir;
            this.selectionHoraemhora = this.jsonCronograma.repetirhora;

            this.jsonCronograma.dataini = moment().format('YYYY-MM-DD');
            this.jsonCronograma.datafim = moment().format('YYYY-MM-DD');

            if( this.jsonCronograma.cronograma == 'diario' ) {
                this.horarios = this.jsonCronograma.agenda;
                this.horarios.sort();
                this.horarios.forEach((hora:any)=>{
                    this.selectionHorario.toggle(hora);
                });
            } else if( this.jsonCronograma.cronograma == 'semanal' ) {
                this.jsonCronograma.agenda.forEach((dados:any)=>{
                    if( this.diaDaSemana == '' ) this.diaDaSemana = dados.semana;
                    dados.hora.forEach((hora:any)=> {
                        this.selectionHorario.toggle(dados.semana+''+hora);
                    });
                });

                let agenda = this.jsonCronograma.agenda.find( (i:any) => i.semana === this.diaDaSemana);
                //console.log('agenda', agenda);
                this.horarios = [];
                if( agenda != undefined ) {
                    this.horarios = agenda.hora;
                }
            } else {
                this.jsonCronograma.agenda.forEach((dados:any)=>{
                    dados.mensal = moment(dados.mensal).format('DD/MM/YYYY');
                    if( this.dataMensal == '' ) this.dataMensal = dados.mensal;
                    //console.log(dados.mensal);
                    dados.hora.forEach((hora:any)=> {
                        this.selectionHorario.toggle(dados.mensal+''+hora);
                    });
                });

                let agenda = this.jsonCronograma.agenda.find( (i:any) => i.mensal === this.dataMensal);
                //console.log('agenda', agenda);
                this.horarios = [];
                if( agenda != undefined ) {
                    this.horarios = agenda.hora;
                }
            }
        }

        this.model = new Tarefa(retorno);
        this.spinner.hide();
    }

    linkCadastro(url: any){
        this.router.navigate([url], { queryParams: { id: this.id } });
    }

    addEventDate(type: string, event: MatDatepickerInputEvent<Date>) {
        //console.log('type: ', type);
        //console.log('event: ', event.value, moment(event.value).format('YYYY-MM-DD'));
        this.dataMensal = '';
        //console.log('addEventDate', moment(event.value).isValid());
        if( moment(event.value).isValid() ) {
            this.dataMensal = moment(event.value).format('DD/MM/YYYY');
            this.dataMensalValid.invalido = false;
        } else {
            this.dataMensalValid.invalido = true;
        }

        let agenda = this.jsonCronograma.agenda.find( (i:any) => i.mensal === this.dataMensal);
        //console.log('agenda', agenda);
        this.horarios = [];
        if( agenda != undefined ) {
            this.horarios = agenda.hora;
        }
    }

    async onSubmit(){

        this.formulario.value.id = this.id;

        this.horarioValid.isnull = false;
        let temError: any = false;

        if( this.jsonCronograma.cronograma == 'mensal' && this.formulario.status == 'VALID' ) {
            this.jsonCronograma.agenda.forEach((dados: any) => {
                let datas = dados.mensal.split('/');
                dados.mensal = datas[2]+'-'+datas[1]+'-'+datas[0];
            });
        }
        if( this.horarios.length == 0 && this.jsonCronograma.repetirhora == false){
            this.horarioValid.isnull = true;
            temError = true;
        }
        this.formulario.value.json_agendamento = JSON.stringify(this.jsonCronograma);

        this.spinner.show();

        if( !temError ) {
            let retorno = [];

            let msg = 'Agendamento realizado com sucesso!';
            this.formulario.value.bo_alterou_automacao = false;

            //console.log(this.formulario.value);
            // @ts-ignore
            retorno = await this.tarefaService.agendamento(this.formulario.value);

            //console.log('retorno ', retorno);
            if (retorno.id) {
                this.snackBar.open(msg, '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });

                this.router.navigate(['agendamento-tarefa'], {queryParams: {id: retorno.id}});
                //window.location.reload();
            } else {
                let msgRetorno = 'Gerou erro ao salvar dados de agendamento';
                if (retorno && retorno.detail) {
                    msgRetorno = retorno.detail;
                }
                this.snackBar.open(msgRetorno, '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
            }
            this.getTarefaById();
        }
        this.spinner.hide();
    }

    onDiaSemanaChange(event: MatSelectChange){
        //console.log(event);
        this.diaDaSemana = event.value;
        let agenda = this.jsonCronograma.agenda.find( (i:any) => i.semana === this.diaDaSemana);
        //console.log('agenda', agenda);
        this.horarios = [];
        if( agenda != undefined ) {
            this.horarios = agenda.hora;
        }
    }

    radioChange(event: MatRadioChange) {
        if( event.value != this.jsonCronograma.cronograma ) {
            this.jsonCronograma.cronograma = event.value;
            this.selectionRepetir = false;
            this.horarios = [];
            this.selectionHorario = new SelectionModel<any>(true, []);

            if( event.value == 'diario' ) {
                this.jsonCronograma = {
                    cronograma: 'diario',
                    repetir: false,
                    repetirhora: false,
                    dataini: moment().format('YYYY-MM-DD'),
                    datafim: moment().format('YYYY-MM-DD'),
                    agenda: []
                };
            } else if( event.value == 'semanal' ) {
                this.jsonCronograma = {
                    cronograma: 'semanal',
                    repetir: false,
                    repetirhora: false,
                    dataini: moment().format('YYYY-MM-DD'),
                    datafim: moment().format('YYYY-MM-DD'),
                    agenda: []
                };
            } else {
                this.jsonCronograma = {
                    cronograma: 'mensal',
                    repetir: false,
                    repetirhora: false,
                    dataini: moment().format('YYYY-MM-DD'),
                    datafim: moment().format('YYYY-MM-DD'),
                    agenda: []
                };
                this.horario = "01:00";
            }
        }
        console.log(this.jsonCronograma);
        //console.log(event.source.name, event.value);
    }

    checkedEventHorariosSemana(dia:any, horaSelect:any){
        let arHora: any = [];
        this.selectionHorario = new SelectionModel<any>(true, []);
        this.jsonCronograma.agenda.forEach((dados:any)=>{
            dados.hora.forEach((hora:any)=> {
                if (hora != horaSelect && dados.semana == dia) {
                    arHora.push(hora);
                }
            });
        });
        arHora.sort();

        let arAgenda: any = [];
        this.jsonCronograma.agenda.forEach((dados:any)=>{
            if( dados.semana == dia ){
                dados.hora = arHora;
                if(arHora.length != 0) {
                    arAgenda.push(dados);
                }
            } else {
                arAgenda.push(dados);
            }
            dados.hora.forEach((hora:any)=> {
                if( hora != '' ) {
                    this.selectionHorario.toggle(dados.semana + '' + hora);
                }
            });
        });
        this.jsonCronograma.agenda = arAgenda;
        /*console.log(arAgenda);
        console.log(this.jsonCronograma);
        console.log(this.selectionHorario);*/
    }

    checkedEventHorariosMensal(dia:any, horaSelect:any){
        let arHora: any = [];
        this.selectionHorario = new SelectionModel<any>(true, []);
        this.jsonCronograma.agenda.forEach((dados:any)=>{
            dados.hora.forEach((hora:any)=> {
                if (hora != horaSelect && dados.mensal == dia) {
                    arHora.push(hora);
                }
            });
        });
        arHora.sort();

        let arAgenda: any = [];
        this.jsonCronograma.agenda.forEach((dados:any)=>{
            if( dados.semana == dia ){
                dados.hora = arHora;
                if(arHora.length != 0) {
                    arAgenda.push(dados);
                }
            } else {
                arAgenda.push(dados);
            }
            dados.hora.forEach((hora:any)=> {
                if( hora != '' ) {
                    this.selectionHorario.toggle(dados.mensal + '' + hora);
                }
            });
        });
        this.jsonCronograma.agenda = arAgenda;
        //console.log(this.jsonCronograma);
        //console.log(this.selectionHorario);
    }

    checkedEventHora(event: MatCheckboxChange){
        this.selectionHoraemhora = event.checked;
        this.jsonCronograma.repetirhora = event.checked;
        this.jsonCronograma.repetir = this.selectionRepetir;
        this.jsonCronograma.agenda = [];
        this.selectionHorario = new SelectionModel<any>(true, []);
        this.horarios = [];
        this.horario = '';

        //console.log(this.jsonCronograma);
        //console.log(this.horario);
    }

    checkedEventRepetir(event: MatCheckboxChange){
        this.selectionRepetir = event.checked;
        this.jsonCronograma.repetir = event.checked;
        //console.log(this.jsonCronograma);
        //console.log(this.horario);
    }

    adicionarHorario(){
        this.horarioValid.isnull = false;

        if( this.horario == '' || this.horario == undefined  ){
            this.horarioValid.invalido = true;
            return;
        }

        if( this.horario.length < 5 || this.horario.split(':')[0] < 0 || this.horario.split(':')[0] > 23 || this.horario.split(':')[1] < 0 || this.horario.split(':')[1] > 59 ){
            this.horarioValid.invalido = true;
            return;
        }

        //console.log(this.horario, this.horarios);

        this.horarioValid.invalido = false;
        this.horarioValid.existe = false;
        if( this.horarios.includes(this.horario) ){
            this.horarioValid.existe = true;
        } else {
            //console.log('this.horario', this.horario, this.horarios);
            this.horarios.push(this.horario);
            this.horarios.sort();

            if( this.jsonCronograma.cronograma == 'diario' ) {
                if (this.jsonCronograma.agenda == undefined) {
                    this.jsonCronograma.agenda = [];
                }
                this.horarioValid.existe = false;
                this.selectionHorario.toggle(this.horario);

                this.jsonCronograma.agenda = this.horarios;
            } else if(this.jsonCronograma.cronograma == 'semanal'){
                const semanas:any = [];
                this.selectionHorario.toggle(this.diaDaSemana+''+this.horario);
                //{dia:this.diaDaSemana,codigo:'', hora:this.horarios}
                if( this.jsonCronograma.agenda.length > 0 ){
                    let ehIgual = false;
                    for( let i=0;i<this.jsonCronograma.agenda.length;i++){
                        if( this.jsonCronograma.agenda[i].semana == this.diaDaSemana ) {
                            this.jsonCronograma.agenda[i].hora = this.horarios;
                            ehIgual = true;
                        }
                    }
                    if( !ehIgual ) {
                        this.jsonCronograma.agenda.push({semana: this.diaDaSemana, hora: this.horarios});
                    }
                } else {
                    this.jsonCronograma.agenda.push({semana:this.diaDaSemana, hora:this.horarios});
                }
            } else if(this.jsonCronograma.cronograma == 'mensal'){
                //console.log('this.dataMensal', this.dataMensal);

                this.selectionHorario.toggle(this.dataMensal+''+this.horario);

                //console.log(this.selectionHorario);

                if( this.dataMensal ) {
                    //console.log(this.jsonCronograma.agenda.length);
                    if( this.jsonCronograma.agenda.length > 0 ){
                        let ehIgual = false;
                        for( let i=0;i<this.jsonCronograma.agenda.length;i++){
                            //console.log(this.jsonCronograma.agenda[i].mensal, '==', this.dataMensal);
                            if( this.jsonCronograma.agenda[i].mensal == this.dataMensal ) {
                                this.jsonCronograma.agenda[i].hora = this.horarios;
                                ehIgual = true;
                                //this.dataMensalValid.existe = true;
                            }
                        }
                        if( !ehIgual ) {
                            this.dataMensalValid.existe = false;
                            this.jsonCronograma.agenda.push({mensal: this.dataMensal, hora: this.horarios});
                        }
                    } else {
                        this.dataMensalValid.existe = false;
                        this.jsonCronograma.agenda.push({mensal:this.dataMensal, hora:this.horarios});
                    }
                }
            }
        }
        //console.log(this.jsonCronograma, this.dataMensalValid);
        //console.log('selectionHorario', this.selectionHorario);
    }

    checkedEventHorarios(horaSelect:any){
        let arHora: any = [];
        this.selectionHorario = new SelectionModel<any>(true, []);
        this.horarios.forEach((hora:any)=>{
            if( hora != horaSelect ){
                this.selectionHorario.toggle(hora);
                arHora.push(hora);
            }
        });
        arHora.sort();
        this.horarios = arHora;
        this.jsonCronograma.agenda = arHora;
        //console.log(this.jsonCronograma);
    }

    proximo(){
        this.router.navigate(['config-email-tarefa'], { queryParams: { id: this.id } });
    }

}
