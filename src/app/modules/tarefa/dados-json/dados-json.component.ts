import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../../resources/services/login.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {TarefaService} from "../../../resources/services/tarefa.service";
import {Tarefa} from "../../../resources/models/TarefaModel";
import * as ace from "ace-builds";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Util} from "../../../resources/util/utils";

@Component({
    selector: 'app-dados-json',
    templateUrl: './dados-json.component.html',
    styleUrls: ['./dados-json.component.scss']
})
export class DadosJsonComponent implements OnInit, AfterViewInit {
    @ViewChild("editor") private editor: ElementRef<HTMLElement> | undefined;

    id: any = '';
    cpfLogado: any;
    userData: any;
    validaJson:any = true;
    aceEditor: any;
    formulario: any;

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
            id: new FormControl(this.id, []),
            tx_json: new FormControl('', [Validators.required])
        });

        if( this.id ){
            await this.getTarefaById();
        }
    }

    ngAfterViewInit(): void {
        ace.config.set("fontSize", "14px");
        ace.config.set("basePath", "https://unpkg.com/ace-builds@1.4.12/src-noconflict");
        ace.config.set("basePath", "https://url.to.a/folder/that/contains-ace-modes");
        // @ts-ignore
        this.aceEditor = ace.edit(this.editor.nativeElement);

        this.aceEditor.setTheme("ace/theme/twilight");
        this.aceEditor.session.setMode("ace/mode/json");
        this.aceEditor.session.setTabSize(4);
    }

    async getTarefaById(){
        this.spinner.show();
        let retorno = await this.tarefaService.getById(this.id);

        this.model = new Tarefa(retorno);
        this.aceEditor.session.setValue(retorno.tx_json);
        this.spinner.hide();
    }

    async onSubmit(){
        this.spinner.show();
        this.formulario.value.tx_json = this.aceEditor.getValue();

        console.log(this.formulario.value);
        console.log(this.model);

        if( this.formulario.value.tx_json == '' ){
            this.validaJson = false;
        } else {
            const valida = Util.ValidatorJson(this.formulario.value.tx_json);
            if ( valida.status == 0 ) {
                this.validaJson = false;
                this.snackBar.open('O formatado do JSON é inválido', '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
            } else {
                this.validaJson = true;

                this.model.tx_json = this.formulario.value.tx_json;

                // @ts-ignore
                let retornoTarefa = await this.tarefaService.grava_json_tarefa(this.model);

                if( retornoTarefa && retornoTarefa.id) {
                    this.snackBar.open('JSON de configuração vinculado com sucesso', '', {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 5000
                    });
                }
            }
        }
        this.spinner.hide();
    }

    prettyPrint() {
        let obj = JSON.parse(this.formulario.value.tx_json);
        let pretty = JSON.stringify(obj, undefined, 4);
        this.formulario.value.tx_json = pretty;
        this.model.tx_json = pretty;
    }

    linkCadastro(url: any){
        this.router.navigate([url], { queryParams: { id: this.id } });
    }

    voltar(){
        this.router.navigate(['automacao'])
    }

    proximo(){
        if( this.model.bo_agendada ){
            this.router.navigate(['agendamento-tarefa'], { queryParams: { id: this.id } });
        } else {
            this.router.navigate(['config-email-tarefa'], { queryParams: { id: this.id } });
        }

    }

}
