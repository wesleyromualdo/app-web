import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import { RouterModule } from '@angular/router';
import {MatDividerModule} from "@angular/material/divider";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatListModule} from "@angular/material/list";
import { ChartAreaComponent } from './widgets/chart-area/chart-area.component';
import { HighchartsChartModule } from 'highcharts-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from "@angular/material/select";
import { ListaTarefasComponent } from './widgets/lista-tarefas/lista-tarefas.component';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTabsModule} from "@angular/material/tabs";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { ModalExcluirComponent } from './components/modal-excluir/modal-excluir.component';
import {MatDialogModule} from "@angular/material/dialog";
import { DatatableComponent } from './components/datatable/datatable.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {ModalDetalhamentoComponent} from "./components/modal-detalhamento/modal-detalhamento.component";
import {ModalParametroJsonComponent} from "./components/modal-parametro-json/modal-parametro-json.component";
import {NgxJsonViewerModule} from "ngx-json-viewer";

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        ChartAreaComponent,
        ListaTarefasComponent,
        ModalExcluirComponent,
        DatatableComponent,
        ModalDetalhamentoComponent,
        ModalParametroJsonComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatNativeDateModule,
        MatDividerModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatListModule,
        MatSelectModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        HighchartsChartModule,
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        MatTabsModule,
        MatPaginatorModule,
        MatTableModule,
        MatCheckboxModule,
        MatDialogModule,
        MatSlideToggleModule,
        NgxJsonViewerModule
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        ChartAreaComponent,
        ListaTarefasComponent,
        ModalExcluirComponent,
        DatatableComponent,
        ModalDetalhamentoComponent,
        ModalParametroJsonComponent
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }]
})
export class SharedModule { }
