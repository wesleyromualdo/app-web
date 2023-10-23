import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Util} from "../../../resources/util/utils";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as ace from "ace-builds";

@Component({
    selector: 'app-modal-parametro-json',
    templateUrl: './modal-parametro-json.component.html',
    styleUrls: ['./modal-parametro-json.component.scss']
})
export class ModalParametroJsonComponent implements OnInit, AfterViewInit {
    @ViewChild("editor") private editor: ElementRef<HTMLElement> | undefined;

    loading: boolean = false;
    validaJson:any = true;

    constructor(public dialogRef: MatDialogRef<ModalParametroJsonComponent>,
                private snackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public data: any,) {}

    ngOnInit(){
        this.loading = false;
        //this.data.tx_json = JSON.stringify(Util.ValidatorJson(this.data.tx_json));
        //console.log('this.data', this.data);
        this.loading = true;
    }

    ngAfterViewInit(): void {
        ace.config.set("fontSize", "14px");
        ace.config.set("basePath", "https://unpkg.com/ace-builds@1.4.12/src-noconflict");
        ace.config.set("basePath", "https://url.to.a/folder/that/contains-ace-modes");
        // @ts-ignore
        const aceEditor = ace.edit(this.editor.nativeElement);
        aceEditor.session.setValue(this.data.tx_json);

        aceEditor.setTheme("ace/theme/twilight");
        aceEditor.session.setMode("ace/mode/json");
        aceEditor.session.setTabSize(4);

        aceEditor.on("change", () => {
            //console.log(aceEditor.getValue());
            this.data.tx_json = aceEditor.getValue();
        });
    }

    prettyPrint() {
        let obj = JSON.parse(this.data.tx_json);
        let pretty = JSON.stringify(obj, undefined, 4);
        this.data.tx_json = pretty;
    }

    iniciarTarefa(){
        const valida = Util.ValidatorJson(this.data.tx_json);
        if( valida.status == 0 ){
            this.validaJson = false;
            this.snackBar.open(valida.error, '', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 5000
            });
        } else {
            this.dialogRef.close({tx_json: this.data.tx_json});
        }
    }

    onNoClick(): void {
        //this.dialogRef.close();
    }
}
