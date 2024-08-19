import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalExcluirComponent} from "../modal-excluir/modal-excluir.component";

@Component({
    selector: 'app-modal-detalhamento',
    templateUrl: './modal-detalhamento.component.html',
    styleUrls: ['./modal-detalhamento.component.scss']
})
export class ModalDetalhamentoComponent implements OnInit {

    loading: boolean = false;

    dataList: any;
    configTable: any;

    constructor(public dialogRef: MatDialogRef<ModalDetalhamentoComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,) {}

    ngOnInit(){
        this.loading = false;
        console.log('this.data', this.data);
        this.dataList = this.data.datatable;

        this.configTable = {
            table:{
                id:'table-modal-detalhe',
                class:''
            },
            btnnovo: '',
            placeholder: '',
            columns: this.data.columnsTable
        };
        this.loading = true;

        if( this.dataList.length > 0 ) {
            setTimeout(() => {
                let objDiv = document.getElementById("div-scroll");
                // @ts-ignore
                objDiv.scrollTop = 0;
            }, 1000);
        }
    }

    executaRetorno(dados: any) {
        if( dados.callback == 'stop' ){
            console.log(dados.element);
            this.stop(dados.element);
        }
    }

    async stop(element: any){
        this.dialogRef.close({stop: element.id});
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
