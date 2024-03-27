import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StartTarefa, Tarefa} from "../../../resources/models/TarefaModel";
import {TarefaService} from "../../../resources/services/tarefa.service";
import {SelectionModel} from "@angular/cdk/collections";
import {LoginService} from "../../../resources/services/login.service";
import {UsuarioService} from "../../../resources/services/usuario.service";
import {MatRadioChange} from "@angular/material/radio";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MatSelectChange} from "@angular/material/select";
import {ModalParametroJsonComponent} from "../../../shared/components/modal-parametro-json/modal-parametro-json.component";

@Component({
    selector: 'app-cadastro-tarefa',
    templateUrl: './cadastro-tarefa.component.html',
    styleUrls: ['./cadastro-tarefa.component.scss']
})
export class CadastroTarefaComponent implements OnInit {

    localUrl: any;
    file?: any;

    isChecked: boolean = true;
    tx_ativo: string = 'Ativo';
    id: any = '';
    menuTexto = 'Nova Tarefa';
    automacoes: any;
    nenhumRegistro: any;
    cpfLogado: any;
    userData: any;
    habiltaCampos: boolean = true;

    boEnviaEmail: boolean = false;
    boAgendado: boolean = false;
    nome_script: string = '';
    automacaoAnterior: any = '';
    anexo_script_id: any = '';

    options: any = [
        {id:true,nome:'Sim'},
        {id:false,nome:'Não'},
    ]

    public formulario: any;
    public model: Tarefa = new Tarefa();

    constructor(private router: Router,
                private tarefaService: TarefaService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private route: ActivatedRoute,
                private usuarioService: UsuarioService,
                private loginService: LoginService) { }

    async ngOnInit() {
        this.spinner.show();
        this.route.queryParams.subscribe(params => {
            this.id = parseInt(params['id']);
        });

        this.userData = this.loginService.getUserData();
        this.cpfLogado = this.userData.nu_cpf;

        this.formulario = new FormGroup({
            id: new FormControl('', []),
            automacao_id: new FormControl('', [Validators.required]),
            nu_cpf: new FormControl(this.cpfLogado, []),
            tx_nome: new FormControl('', [Validators.required]),
            tx_constante_virtual: new FormControl('', []),
            bo_execucao: new FormControl(false, []),
            bo_agendada: new FormControl(false, []),
            json_agendamento: new FormControl('', []),
            horario: new FormControl('', []),
            dataMensal: new FormControl('', []),
            diaDaSemana: new FormControl('', []),
            bo_status: new FormControl(this.isChecked, []),
            bo_email: new FormControl(false, []),
            tx_nome_script: new FormControl('', []),
            anexo_script_id: new FormControl('', []),
            nu_prioridade: new FormControl('1', [])
        });

        this.automacoes = await this.usuarioService.getAutomacaoByCPF(this.userData.nu_cpf, this.userData.cliente_id);
        if( this.automacoes.status == 0 ){
            this.nenhumRegistro = 'Não foi encontrado nenhum worker vinculado ao usuário!';
        }
        this.spinner.hide();
        this.model.bo_agendada = false;
        this.model.bo_email = false;
        this.model.nu_prioridade = 1;

        if( this.id ){
            this.menuTexto = 'Editar Tarefa'
            await this.getTarefaById();
            this.habiltaCampos = false;
        }
    }

    async getTarefaById(){
        this.spinner.show();

        let retorno = await this.tarefaService.getById(this.id);
        //console.log(retorno);

        this.boEnviaEmail = retorno.bo_email;
        this.boAgendado = retorno.bo_agendada;
        this.anexo_script_id = retorno.anexo_script_id;
        this.nome_script = (retorno.tx_nome_script ? retorno.tx_nome_script : '');

        this.model = retorno;
        this.model.nu_prioridade = ( this.model.nu_prioridade == null ) ? '1' : this.model.nu_prioridade;

        if( !this.model.bo_status ){
            this.isChecked = false;
            this.tx_ativo = 'Inativo';
        }
        this.automacaoAnterior = retorno.automacao_id;
        this.formulario.value = this.model;

        this.spinner.hide();
        //console.log(this.formulario.value);

        //console.log(this.jsonCronograma);
    }

    get automacao_id(){
        return this.formulario.get('automacao_id')!;
    }

    get tx_nome(){
        return this.formulario.get('tx_nome')!;
    }

    get tx_constante_virtual(){
        return this.formulario.get('tx_constante_virtual')!;
    }

    get tx_nome_script(){
        return this.formulario.get('tx_nome_script')!;
    }

    get bo_status(){
        return this.formulario.get('bo_status')!;
    }

    get nu_prioridade(){
        return this.formulario.get('nu_prioridade')!;
    }

    voltar(){
        this.router.navigate(['tarefa'])
    }

    proximo(){
        this.router.navigate(['cadastro-json-tarefa'], { queryParams: { id: this.id } });
    }

    async onSubmit(){

        this.formulario.value.id = this.id;
        this.formulario.value.cliente_id = parseInt(this.userData.cliente_id);
        this.formulario.value.tx_nome_script = this.nome_script;

        //this.formulario.value.json_agendamento = '';

        if( this.formulario.value.bo_agendada == 'false' || this.formulario.value.bo_agendada == false ) {
            this.formulario.value.json_agendamento = '';
        }

        //console.log(this.jsonCronograma);
        //console.log('formulario',this.formulario);

        this.spinner.show();
        //if( this.formulario.status == 'VALID' && this.nome_script != '' ){
        if( this.formulario.status == 'VALID'){
           let retorno = [];
            this.boEnviaEmail = this.formulario.value.bo_email;
            this.boAgendado = this.formulario.value.bo_agendada;
            let msg = 'Tarefa cadastrada com sucesso!';
            this.formulario.value.bo_alterou_automacao = false;
            if( this.id ){
                if( this.formulario.value.automacao_id != this.automacaoAnterior ){
                    this.formulario.value.bo_alterou_automacao = true;
                }
                //this.formulario.value.id = this.id;
                this.formulario.value.anexo_script_id = this.anexo_script_id;
                //console.log('edit:', this.formulario.value);
                retorno = await this.tarefaService.editar(this.formulario.value, this.file);
                msg = 'Tarefa atualizada com sucesso!';
            } else {
                retorno = await this.tarefaService.gravar(this.formulario.value, this.file);
            }
            //console.log('retorno ', retorno);
            if( retorno.id ){
                this.id = retorno.id
                this.formulario.value.id = retorno.id
                this.router.navigate(['cadastro-tarefa'], {queryParams: {id: retorno.id}});

                this.snackBar.open(msg, '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
                //window.location.reload();
            } else {
                let msgRetorno = 'Gerou erro ao salvar dados da tarefa';
                if(retorno && retorno.detail){
                    msgRetorno = retorno.detail;
                }
                this.snackBar.open(msgRetorno, '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
            }
        }
        this.spinner.hide();
    }

    onChangeToggle(event: any){
        this.formulario.value.bo_status = event.checked;
    }

    radioButtonGroupChange(event:any){
        if( !eval(event.value) )
            this.boEnviaEmail = eval(event.value);
    }

    radioChangeAgendada(event: MatRadioChange) {
        if( !eval(event.value) )
            this.boAgendado = eval(event.value);

        this.model.bo_agendada = eval(event.value);
        //console.log(this.model.bo_agendada, event);
    }

    radioChangePrioridade(event: MatRadioChange) {
        this.model.nu_prioridade = event.value;
    }

    radioChangeAutomacao(event: MatRadioChange) {
        //console.log(event);
        //this.model.nu_prioridade = event.value;
    }

    linkCadastro(url: any){
        this.router.navigate([url], { queryParams: { id: this.id } });
    }



    selectFile(event: any) {
        //console.log(event);
        this.file = <FileList>event.srcElement.files[0];

        this.nome_script = this.file.name

        /*if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.localUrl = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }*/
    }

    async startTarefa(){

        const tarefa: any = this.model;

        tarefa.tarefa_id = tarefa.id;
        tarefa.nu_cpf = this.cpfLogado;

        this.spinner.show();
        const dados = new StartTarefa(tarefa);
        //console.log(dados);
        const retorno = await this.tarefaService.startTarefa(dados);
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
}
