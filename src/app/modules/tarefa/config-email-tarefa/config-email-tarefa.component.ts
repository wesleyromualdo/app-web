import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Tarefa} from "../../../resources/models/TarefaModel";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../../resources/services/login.service";
import {TarefaService} from "../../../resources/services/tarefa.service";
import { Editor,Toolbar } from 'ngx-editor';

@Component({
    selector: 'app-config-email-tarefa',
    templateUrl: './config-email-tarefa.component.html',
    styleUrls: ['./config-email-tarefa.component.scss']
})
export class ConfigEmailTarefaComponent implements OnInit, OnDestroy {

    menuTexto = 'Configuração de e-mail';
    id: any = '';
    cpfLogado: any;
    userData: any;
    editorInicia: any = Editor;
    editorFinaliza: any = Editor;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    public formularioInicia: any;
    public formularioFinaliza: any;
    public model: Tarefa = new Tarefa();
    isChecked: boolean = false;
    tabIndex: any = 0;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private loginService: LoginService,
                private tarefaService: TarefaService) { }

    async ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.id = parseInt(params['id']);
        });
        this.editorInicia = new Editor();
        this.editorFinaliza = new Editor();

        this.userData = this.loginService.getUserData();
        this.cpfLogado = this.userData.nu_cpf;

        this.formularioInicia = new FormGroup({
            id: new FormControl(this.id, []),
            tipo: new FormControl('I', []),
            tx_assunto_inicia: new FormControl('', [Validators.required]),
            tx_corpo_email_inicia: new FormControl(
                { value: '', disabled: false }, Validators.required
            ),
            bo_email: new FormControl(this.isChecked, [])
        });

        this.formularioFinaliza = new FormGroup({
            id: new FormControl(this.id, []),
            tipo: new FormControl('F', []),
            tx_assunto_finaliza: new FormControl('', [Validators.required]),
            tx_corpo_email_finaliza: new FormControl(
                { value: '', disabled: false }, Validators.required
            )
        });

        if( this.id ){
            await this.getTarefaById();
        }
    }

    ngOnDestroy(): void {
        this.editorInicia.destroy();
        this.editorFinaliza.destroy();
    }

    async getTarefaById(){
        this.spinner.show();
        let retorno = await this.tarefaService.getById(this.id);

        this.model = retorno;
        this.formularioInicia.value = this.model;
        this.formularioFinaliza.value = this.model;
        this.spinner.hide();
    }

    get tx_assunto_inicia(){
        return this.formularioInicia.get('tx_assunto_inicia')!;
    }

    get tx_corpo_email_inicia(){
        return this.formularioInicia.get('tx_corpo_email_inicia')!;
    }

    get tx_assunto_finaliza(){
        return this.formularioFinaliza.get('tx_assunto_finaliza')!;
    }

    get tx_corpo_email_finaliza(){
        return this.formularioFinaliza.get('tx_corpo_email_finaliza')!;
    }

    voltar(){
        this.router.navigate(['tarefa'])
    }

    async onSubmit(){
        if(this.tabIndex == 0){
            this.onSubmitInicia();
        } else {
            this.onSubmitFinaliza();
        }
    }

    async onSubmitInicia(){
        this.spinner.show();

        if( this.formularioInicia.status == 'VALID' ) {
            console.log('inicia-1', this.formularioInicia.value);

            let retorno = await this.tarefaService.configuracaoEmail(this.formularioInicia.value);
            if( retorno && retorno.id) {
                this.snackBar.open('Dados de e-mail vinculado com sucesso', '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
            }
            //this.voltar();
        }
        this.spinner.hide();
    }

    async onSubmitFinaliza(){
        this.spinner.show();
        if( this.formularioFinaliza.status == 'VALID' ) {
            console.log('finaliza', this.formularioFinaliza.value);
            let retorno = await this.tarefaService.configuracaoEmail(this.formularioFinaliza.value);
            //console.log('retorno', retorno);
            if( retorno && retorno.id) {
                this.snackBar.open('Dados de e-mail vinculado com sucesso', '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
            }
            //this.voltar();
        }
        this.spinner.hide();
    }

    linkCadastro(url: any){
        this.router.navigate([url], { queryParams: { id: this.id } });
    }

    onChangeToggle(event: any){
        this.isChecked = event.checked;
        this.formularioInicia.value.bo_status = event.checked;
    }

    tabChanged(tabChangeEvent: any): void {
        //console.log('tabChangeEvent => ', tabChangeEvent);
        //console.log('index => ', tabChangeEvent.index);
        this.tabIndex = tabChangeEvent.index;
    }
}
