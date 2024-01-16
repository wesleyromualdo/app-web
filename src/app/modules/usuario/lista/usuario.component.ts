import {Component, OnInit} from '@angular/core';
import {msgSemRegistro} from "../../../resources/util/constants";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ModalExcluirComponent} from "../../../shared/components/modal-excluir/modal-excluir.component";
import {UsuarioService} from "../../../resources/services/usuario.service";
import { Util } from "../../../resources/util/utils";
import * as moment from 'moment';
import {LoginService} from "../../../resources/services/login.service";
import {ModalDetalhamentoComponent} from "../../../shared/components/modal-detalhamento/modal-detalhamento.component";

export interface IUsuario {
    acao: string;
    nu_cpf: string;
    tx_nome: string;
    tx_email: string;
    dt_inclusao: string;
    bo_status : string;
}

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
    msgSemRegistro = msgSemRegistro;
    userData: any;

    bo_status: boolean = true;
    tx_ativo: string = 'Ativo';

    interface: IUsuario[] = [];
    dataList: any = [];
    loading: boolean = false;
    configTable = {
        table:{
            id:'table-usuario',
            class:''
        },
        btnnovo: 'Adicionar usuário',
        placeholder: 'Busque pelo nome ou email',
        columns:[
            {label:'Ação', field:'acao', class:'',botao:[
                    {label:'Detalhamento', icon:'remove_red_eye', callback:'detalhe'},
                    {label:'Editar', icon:'edit', callback:'editar'},
                    {label:'Excluir', icon:'delete', callback:'excluir'}
                ]
            },
            {label:'CPF', field:'nu_cpf_formatado', class:'', link:true, callback:'detalhe'},
            {label:'Nome', field:'tx_nome', class:'td-nome'},
            {label:'E-mail', field:'tx_email', class:''},
            {label:'Data Inclusão', field:'dt_inclusao', class:''},
            {label:'Status', field:'bo_status', class:''},
        ]
    };

    constructor(private http: UsuarioService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private router: Router,
                private dialog: MatDialog,
                private loginService: LoginService) { }

    async ngOnInit() {
        this.userData = this.loginService.getUserData();
        await this.pesquisar();
    }

    async pesquisar(){
        this.spinner.show();
        this.loading = false;
        this.dataList = await this.http.pesquisar('','',this.userData.cliente_id,this.bo_status, 0, 0);

        let registro:any = [];
        if( this.dataList.status == 0 ) {
            this.dataList = [];
        } else {
            this.dataList.forEach((item: any, index:any) => {
                item.status = item.bo_status;
                if (item.bo_status) item.bo_status = 'Ativo';
                else item.bo_status = 'Inativo';
                let bo_add = true
                item.perfil.forEach((superuser: any) =>{
                    if( !this.userData.superuser && superuser ){
                        bo_add = false
                    }
                });
                item.nu_cpf_formatado = Util.formatarCpf(item.nu_cpf);
                //moment(data).tz('America/Sao_Paulo').format('DD/MM/YYYY');
                item.dt_inclusao = moment(item.dt_inclusao).format('DD/MM/YYYY HH:mm:ss');
                /*if (item.bo_superuser) item.bo_superuser = 'Sim';
                else item.bo_superuser = 'Não';*/

                if( bo_add ) registro.push(item);
            });
        }
        this.dataList = registro;

        this.spinner.hide();
        this.loading = true;
    }

    executaRetorno(dados: any) {
        if( dados.callback == 'novo' ){
            this.novo();
        }
        if( dados.callback == 'detalhe' ){
            this.detalhamento(dados.element);
        }
        if( dados.callback == 'editar' ){
            this.editar(dados.element.nu_cpf);
        }
        if( dados.callback == 'excluir' ){
            this.excluir(dados.element.nu_cpf);
        }
        if( dados.callback == 'status' ){
            this.bo_status = dados.element;
            this.tx_ativo = (this.bo_status ? 'Ativo' : 'Inativo');
            this.pesquisar();
        }
    }

    novo(){
        this.router.navigate(['cadastro-usuario']);
    }

    detalhamento(element: any){

        let clientees:any = [];
        if( element.cliente.length > 0 ) {
            element.cliente.forEach((item: any) => {
                clientees.push(item);
            });
        }

        const classStatus = (element.bo_status=='Ativo' ? 'td-status-ativo' : 'td-status-inativo');

        //element.dt_inclusao = moment(element.dt_inclusao).format('DD/MM/YYYY, [às] HH:mm:ss');
        const configuracao = {
            informacao: {label: 'Dados do usúario', value:element.tx_nome},
            conteudo:[
                {label:'CPF', value: element.nu_cpf_formatado},
                {label:'E-mail', value: element.tx_email},
                {label:'Criado em', value: element.dt_inclusao},
                {label:'Cliente', value: clientees.join(', ')},
                {label:'Status', value: element.bo_status, class: classStatus}
            ],
            datatable: [],
            columnsTable:[]
        };
        this.dialog.open(ModalDetalhamentoComponent, {
            width: '80%',
            data: configuracao
        });
    }

    editar(id: any){
        this.router.navigate(['cadastro-usuario'], { queryParams: { nu_cpf: id } });
    }

    async excluir(id: any){

        const dialogRef = this.dialog.open(ModalExcluirComponent, {
            width: '500px',
            data: {texto: 'usuário'}
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

}
