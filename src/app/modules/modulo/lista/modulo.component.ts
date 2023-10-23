import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ModalExcluirComponent} from "../../../shared/components/modal-excluir/modal-excluir.component";
import {msgSemRegistro} from "../../../resources/util/constants";
import {ModuloService} from "../../../resources/services/modulo.service";
import {ModalDetalhamentoComponent} from "../../../shared/components/modal-detalhamento/modal-detalhamento.component";

export interface IModulo {
    acao: string;
    id: string;
    nu_codigo: string;
    tx_nome: string;
    tx_link: string;
    tx_icon: string;
    nu_ordem: string;
    bo_status : string;
}

@Component({
    selector: 'app-modulo',
    templateUrl: './modulo.component.html',
    styleUrls: ['./modulo.component.scss']
})
export class ModuloComponent implements OnInit {
    msgSemRegistro = msgSemRegistro;

    interface: IModulo[] = [];
    dataList: any = [];
    loading: boolean = false;
    bo_status: boolean = true;
    tx_ativo: string = 'Ativo';

    configTable = {
        table:{
            id:'table-automacao',
            class:''
        },
        btnnovo: 'Adicionar Módulo',
        placeholder: 'Busque pelo nº do código ou nome do módulo',
        columns:[
            {label:'Ação', field:'acao', class:'',botao:[
                    {label:'Detalhamento', icon:'remove_red_eye', callback:'detalhe'},
                    {label:'Editar', icon:'edit', callback:'editar'},
                    {label:'Excluir', icon:'delete', callback:'excluir'}
                ]
            },
            {label:'ID', field:'id', class:''},
            {label:'Código', field:'nu_codigo', class:'', link:true, callback:'detalhe'},
            {label:'Nome', field:'tx_nome', class:'td-nome'},
            {label:'Link', field:'tx_link', class:''},
            {label:'Ícone', field:'tx_icon', class:''},
            {label:'Ordem', field:'nu_ordem', class:''},
            {label:'Status', field:'bo_status', class:''},
        ]
    };

    constructor(private http: ModuloService,
                private snackBar: MatSnackBar,
                private spinner: NgxSpinnerService,
                private router: Router,
                private dialog: MatDialog) { }

    async ngOnInit(){
        await this.pesquisar();
    }

    async pesquisar(){
        this.loading = false;
        this.spinner.show();
        this.dataList = await this.http.pesquisar('','',this.bo_status,0,0);

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

    executaRetorno(dados: any) {
        if( dados.callback == 'novo' ){
            this.novo();
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

    novo(){
        this.router.navigate(['cadastro-modulo']);
    }

    detalhamento(element: any){
        /*this.dialog.open(DetalhamentoModuloComponent, {
            width: '800px',
            data: element
        });*/

        const classStatus = (element.bo_status=='Ativo' ? 'td-status-ativo' : 'td-status-inativo');

        //element.dt_inclusao = moment(element.dt_inclusao).format('DD/MM/YYYY, [às] HH:mm:ss');
        const configuracao = {
            informacao: {label: 'Dados do módulo', value:element.tx_nome},
            conteudo:[
                {label:'Código', value: element.nu_codigo},
                {label:'Ordem', value: element.nu_ordem},
                {label:'Icone', value: element.tx_icon},
                {label:'Link', value: element.tx_link},
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
        this.router.navigate(['cadastro-modulo'], { queryParams: { id: id } });
    }

    async excluir(id: any){

        const dialogRef = this.dialog.open(ModalExcluirComponent, {
            width: '500px',
            data: {texto: 'modulo'}
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
