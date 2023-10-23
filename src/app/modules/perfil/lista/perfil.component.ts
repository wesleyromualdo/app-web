import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {msgSemRegistro} from "../../../resources/util/constants";
import {PerfilService} from "../../../resources/services/perfil.service";
import {ModalExcluirComponent} from "../../../shared/components/modal-excluir/modal-excluir.component";
import {ModalDetalhamentoComponent} from "../../../shared/components/modal-detalhamento/modal-detalhamento.component";

export interface IPerfil {
    acao: string;
    id: string;
    tx_finalidade: string;
    tx_nome: string;
    bo_superuser: string;
    bo_status : string;
}

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

    msgSemRegistro = msgSemRegistro;

    displayedColumns: string[] = ['acao', 'id', 'tx_nome', 'bo_superuser', 'tx_finalidade', 'bo_status'];
    dataList: any;
    interface: IPerfil[] = [];
    loading: boolean = false;
    bo_status: boolean = true;
    tx_ativo: string = 'Ativo';
    configTable = {
        table:{
            id:'table-setor',
            class:''
        },
        btnnovo: 'Adicionar Perfil',
        placeholder: 'Busque pelo nº do código ou nome do perfil',
        columns:[
            {label:'Ação', field:'acao', class:'',botao:[
                    {label:'Detalhamento', icon:'remove_red_eye', callback:'detalhe'},
                    {label:'Editar', icon:'edit', callback:'editar'},
                    {label:'Excluir', icon:'delete', callback:'excluir'}
                ]
            },
            {label:'ID', field:'id', class:''},
            {label:'Nome', field:'tx_nome', class:'', link:true, callback:'detalhe'},
            {label:'Super Usuário', field:'bo_superuser', class:''},
            {label:'Finalidade', field:'tx_finalidade', class:''},
            {label:'Status', field:'bo_status', class:''},
        ]
    };

    constructor(private http: PerfilService,
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
        this.dataList = await this.http.pesquisar('',this.bo_status,0,0);

        if( this.dataList.status == 0 ) {
            this.dataList = [];
        } else {
            let registro = [];
            this.dataList.forEach((item: any) => {
                if (item.bo_status) item.bo_status = 'Ativo';
                else item.bo_status = 'Inativo';

                if (item.bo_superuser) item.bo_superuser = 'Sim';
                else item.bo_superuser = 'Não';

                registro.push(item);
            });
        }
        this.spinner.hide();
        this.loading = true;
    }

    novo(){
        this.router.navigate(['cadastro-perfil']);
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

    detalhamento(element: any){
        const classStatus = (element.bo_status=='Ativo' ? 'td-status-ativo' : 'td-status-inativo');

        const configuracao = {
            informacao: {label: 'Dados do perfil', value:element.tx_nome},
            conteudo:[
                {label:'ID', value: element.id},
                {label:'Superuser', value: element.bo_superuser},
                {label:'Status', value: element.bo_status, class: classStatus},
                {label:'Finalidade', value: element.tx_finalidade, width: '100%'},
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
        this.router.navigate(['cadastro-perfil'], { queryParams: { id: id } });
    }

    async excluir(id: any){

        const dialogRef = this.dialog.open(ModalExcluirComponent, {
            width: '500px',
            data: {texto: 'perfil'}
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
