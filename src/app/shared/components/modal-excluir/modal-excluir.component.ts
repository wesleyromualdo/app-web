import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-modal-excluir',
    templateUrl: './modal-excluir.component.html',
    styleUrls: ['./modal-excluir.component.scss']
})
export class ModalExcluirComponent implements OnInit {

    @Input() texto?: any;
    titulo?:any;
    button?:any;

    constructor(public dialogRef: MatDialogRef<ModalExcluirComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(): void {
        this.titulo = this.data.titulo;
        this.texto = this.data.texto;
        if( this.titulo ){
            this.titulo = 'Monitoramento do ' + this.texto
            this.texto = 'Você tem certeza que deseja parar o monitoramento do '+this.texto
            this.button = 'Stop';
        } else {
            this.titulo = 'Inativar ' + this.texto
            this.texto = 'Você tem certeza que deseja inativar esse '+this.texto
            this.button = 'Inativar';
        }
    }

}
