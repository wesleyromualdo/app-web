import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatSidenavModule} from "@angular/material/sidenav";
import { MatDividerModule } from '@angular/material/divider';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {DefaultRoutingModule} from "./default-routing.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTabsModule} from "@angular/material/tabs";
import {MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {SetorComponent} from "../../modules/setor/lista/setor.component";
import {LoginComponent} from "../../modules/auth/login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {TarefaComponent} from "../../modules/tarefa/lista/tarefa.component";
import {MatNativeDateModule} from "@angular/material/core";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {PerfilComponent} from "../../modules/perfil/lista/perfil.component";
import {AutomacaoComponent} from "../../modules/automacao/lista/automacao.component";
import {UsuarioComponent} from "../../modules/usuario/lista/usuario.component";
import {ModuloComponent} from "../../modules/modulo/lista/modulo.component";
import {MatStepperModule} from "@angular/material/stepper";
import {CadastroSetorComponent} from "../../modules/setor/cadastro-setor/cadastro-setor.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {getPtbrPaginatorIntl} from "./ptb-paginator-init";
import {MatDialogModule} from "@angular/material/dialog";
import {CadastroPerfilComponent} from "../../modules/perfil/cadastro/cadastro-perfil.component";
import {MatRadioModule} from "@angular/material/radio";
import {CadastroModuloComponent} from "../../modules/modulo/cadastro/cadastro-modulo.component";
import {CadastroUsuarioComponent} from "../../modules/usuario/cadastro/informacoes/cadastro-usuario.component";
import {NgxMaskModule} from "ngx-mask";
import {DadosAcessoComponent} from "../../modules/usuario/cadastro/dados-acesso/dados-acesso.component";
import {SenhaAcessoComponent} from "../../modules/usuario/cadastro/senha-acesso/senha-acesso.component";
import {CadastroAutomacaoComponent} from "../../modules/automacao/cadastro-automacao/cadastro-automacao.component";
import {CadastroTarefaComponent} from "../../modules/tarefa/cadastro-tarefa/cadastro-tarefa.component";
import {MeuPerfilComponent} from "../../modules/meu-perfil/cadastro/meu-perfil.component";
import {EditarSenhaComponent} from "../../modules/meu-perfil/editar-senha/editar-senha.component";
import {TarefasExecucaoComponent} from "../../modules/tarefa/tarefas-execucao/tarefas-execucao.component";
import {TarefasFinalizadasComponent} from "../../modules/tarefa/tarefas-finalizadas/tarefas-finalizadas.component";
import {HistoricoTarefaComponent} from "../../modules/tarefa/historico-tarefa/historico-tarefa.component";
import {HistoricoExecucaoComponent} from "../../modules/tarefa/historico-execucao/historico-execucao.component";
import {ImageCropperModule} from "ngx-image-cropper";
import {AlterarSenhaComponent} from "../../modules/auth/alterar-senha/alterar-senha.component";
import {DadoNegocialComponent} from "../../modules/tarefa/dado-negocial/dado-negocial.component";
import {EditarImagemComponent} from "../../modules/meu-perfil/editar-imagem/editar-imagem.component";
import {ConfigEmailTarefaComponent} from "../../modules/tarefa/config-email-tarefa/config-email-tarefa.component";
import {NgxEditorModule} from "ngx-editor";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {AgendamentoComponent} from "../../modules/tarefa/agendamento/agendamento.component";
import {DadosJsonComponent} from "../../modules/tarefa/dados-json/dados-json.component";
import {RedefinirSenhaComponent} from "../../modules/auth/redefinir-senha/redefinir-senha.component";
import {CadastroExecutorComponent} from "../../modules/automacao/cadastro-executor/cadastro-executor.component";
import {CofreSenhaComponent} from "../../modules/auth/cofre-senha/cofre-senha.component";



@NgModule({
    declarations: [
        DefaultComponent,
        DashboardComponent,
        LoginComponent,
        RedefinirSenhaComponent,
        SetorComponent,
        TarefaComponent,
        PerfilComponent,
        AutomacaoComponent,
        UsuarioComponent,
        ModuloComponent,
        CadastroSetorComponent,
        CadastroPerfilComponent,
        CadastroModuloComponent,
        CadastroUsuarioComponent,
        DadosAcessoComponent,
        SenhaAcessoComponent,
        CadastroAutomacaoComponent,
        CadastroTarefaComponent,
        TarefasExecucaoComponent,
        TarefasFinalizadasComponent,
        HistoricoExecucaoComponent,
        HistoricoTarefaComponent,
        MeuPerfilComponent,
        EditarSenhaComponent,
        AlterarSenhaComponent,
        DadoNegocialComponent,
        EditarImagemComponent,
        ConfigEmailTarefaComponent,
        AgendamentoComponent,
        DadosJsonComponent,
        CadastroExecutorComponent,
        CofreSenhaComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        MatSidenavModule,
        MatDividerModule,
        MatInputModule,
        HttpClientModule,
        DefaultRoutingModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatTabsModule,
        MatPaginatorModule,
        MatTableModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        MatNativeDateModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatListModule,
        MatSelectModule,
        MatCardModule,
        MatFormFieldModule,
        MatStepperModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatRadioModule,
        NgxMaskModule.forRoot(),
        ImageCropperModule,
        NgxEditorModule,
        MatDatepickerModule
    ],
    exports: [],
    providers: [{ provide: MatPaginatorIntl, useValue: getPtbrPaginatorIntl() }],
    bootstrap: [CadastroTarefaComponent]
})
export class DefaultModule { }
