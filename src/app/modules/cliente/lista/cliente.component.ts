import {Component, OnInit} from '@angular/core';
import {ClienteService} from "../../../resources/services/cliente.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {msgSemRegistro} from "../../../resources/util/constants";
import {ModalExcluirComponent} from "../../../shared/components/modal-excluir/modal-excluir.component";
import {ModalDetalhamentoComponent} from "../../../shared/components/modal-detalhamento/modal-detalhamento.component";

export interface ICliente {
    acao: string;
    id: string;
    tx_sigla: string;
    tx_nome: string;
    bo_status : string;
}

@Component({
    selector: 'app-cliente',
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

    msgSemRegistro = msgSemRegistro;
    dataList: any;
    interface: ICliente[] = [];
    loading: boolean = false;
    bo_status: boolean = true;
    tx_ativo: string = 'Ativo';
    configTable = {
        table:{
            id:'table-cliente',
            class:''
        },
        btnnovo: 'Adicionar Cliente',
        placeholder: 'Busque pelo nº do código ou nome do cliente    ',
        columns:[
            {label:'Ação', field:'acao', class:'',botao:[
                    {label:'Detalhamento', icon:'remove_red_eye', callback:'detalhe'},
                    {label:'Editar', icon:'edit', callback:'editar'},
                    {label:'Excluir', icon:'delete', callback:'excluir'},
                ]
            },
            {label:'ID', field:'id', class:''},
            {label:'Sigla', field:'tx_sigla', class:'', link:true, callback:'detalhe'},
            {label:'Nome', field:'tx_nome', class:''},
            {label:'Nº de Worker', field:'nu_worker', class:''},
            {label:'Status', field:'bo_status', class:''},
        ]
    };

    constructor(private clienteService: ClienteService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private router: Router,
                private dialog: MatDialog) { }

    async ngOnInit(){
        await this.pesquisar();
    }

    async pesquisar(){
        this.spinner.show();
        this.loading = false;
        this.dataList = await this.clienteService.pesquisar('','',this.bo_status);

        if( this.dataList.status == 0 ) {
            this.dataList = [];
        } else {
            let registro = [];
            this.dataList.forEach((item: any) => {
                if (item.bo_status) item.bo_status = 'Ativo';
                else item.bo_status = 'Inativo';
                registro.push(item);
            });
        }
        this.spinner.hide();
        this.loading = true;
    }

    novoCliente(){
        this.router.navigate(['cadastro-cliente']);
    }

    executaRetorno(dados: any) {
        if( dados.callback == 'novo' ){
            this.novoCliente();
        }
        if( dados.callback == 'detalhe' ){
            this.detalhamento(dados.element);
        }
        if( dados.callback == 'editar' ){
            this.editar(dados.element.id);
        }
        if( dados.callback == 'excluir' ){
            this.excluir(dados.element.id);
        }
        if( dados.callback == 'status' ){
            this.bo_status = dados.element;
            this.tx_ativo = (this.bo_status ? 'Ativo' : 'Inativo');
            this.pesquisar();
        }
    }

    detalhamento(element: any){
        const classStatus = (element.bo_status=='Ativo' ? 'td-status-ativo' : 'td-status-inativo');

        const configuracao = {
            informacao: {label: 'Dados do cliente', value:element.tx_nome},
            conteudo:[
                {label:'ID', value: element.id},
                {label:'Sigla', value: element.tx_sigla},
                {label:'Status', value: element.bo_status, class: classStatus}
            ],
            datatable: [],
            columnsTable:[]
        };
        this.dialog.open(ModalDetalhamentoComponent, {
            width: '60%',
            data: configuracao
        });
    }

    editar(id: any){
        this.router.navigate(['cadastro-cliente'], { queryParams: { id: id } });
    }

    async excluir(id: any){

        const dialogRef = this.dialog.open(ModalExcluirComponent, {
            width: '500px',
            data: {texto: 'cliente'}
        });

        dialogRef.afterClosed().subscribe(async result => {
            if( result == 'true' ) {
                let retorno = await this.clienteService.excluir(id);

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
