import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DefaultComponent} from "./default.component";
import {DashboardComponent} from "../../modules/dashboard/dashboard.component";
import {TarefaComponent} from "../../modules/tarefa/lista/tarefa.component";
import {ClienteComponent} from "../../modules/cliente/lista/cliente.component";
import {ModuloComponent} from "../../modules/modulo/lista/modulo.component";
import {PerfilComponent} from "../../modules/perfil/lista/perfil.component";
import {UsuarioComponent} from "../../modules/usuario/lista/usuario.component";
import {AutomacaoComponent} from "../../modules/automacao/lista/automacao.component";
import {AuthGuard} from "../../modules/auth/auth.guard";
import {CadastroClienteComponent} from "../../modules/cliente/cadastro-cliente/cadastro-cliente.component";
import {CadastroPerfilComponent} from "../../modules/perfil/cadastro/cadastro-perfil.component";
import {CadastroModuloComponent} from "../../modules/modulo/cadastro/cadastro-modulo.component";
import {CadastroUsuarioComponent} from "../../modules/usuario/cadastro/informacoes/cadastro-usuario.component";
import {DadosAcessoComponent} from "../../modules/usuario/cadastro/dados-acesso/dados-acesso.component";
import {SenhaAcessoComponent} from "../../modules/usuario/cadastro/senha-acesso/senha-acesso.component";
import {CadastroAutomacaoComponent} from "../../modules/automacao/cadastro-automacao/cadastro-automacao.component";
import {CadastroTarefaComponent} from "../../modules/tarefa/cadastro-tarefa/cadastro-tarefa.component";
import {MeuPerfilComponent} from "../../modules/meu-perfil/cadastro/meu-perfil.component";
import {EditarSenhaComponent} from "../../modules/meu-perfil/editar-senha/editar-senha.component";
import {HistoricoExecucaoComponent} from "../../modules/tarefa/historico-execucao/historico-execucao.component";
import {HistoricoTarefaComponent} from "../../modules/tarefa/historico-tarefa/historico-tarefa.component";
import {DadoNegocialComponent} from "../../modules/tarefa/dado-negocial/dado-negocial.component";
import {ConfigEmailTarefaComponent} from "../../modules/tarefa/config-email-tarefa/config-email-tarefa.component";
import {AgendamentoComponent} from "../../modules/tarefa/agendamento/agendamento.component";
import {DadosJsonComponent} from "../../modules/tarefa/dados-json/dados-json.component";
import {CadastroWorkerComponent} from "../../modules/automacao/cadastro-worker/cadastro-worker.component";

const routes: Routes = [
    {path: '', component: DefaultComponent,
        children: [
            {path: 'dashboard', component: DashboardComponent},
            {path: 'tarefa', component: TarefaComponent},
            {path: 'cadastro-tarefa', component: CadastroTarefaComponent},
            {path: 'automacao', component: AutomacaoComponent},
            {path: 'cadastro-automacao', component: CadastroAutomacaoComponent},
            {path: 'cliente', component: ClienteComponent},
            {path: 'cadastro-cliente', component: CadastroClienteComponent},
            {path: 'modulo', component: ModuloComponent},
            {path: 'cadastro-modulo', component: CadastroModuloComponent},
            {path: 'perfil', component: PerfilComponent},
            {path: 'cadastro-perfil', component: CadastroPerfilComponent},
            {path: 'usuario', component: UsuarioComponent},
            {path: 'cadastro-usuario', component: CadastroUsuarioComponent},
            {path: 'dados-acesso', component: DadosAcessoComponent},
            {path: 'senha-acesso', component: SenhaAcessoComponent},
            {path: 'meuperfil', component: MeuPerfilComponent},
            {path: 'editar-senha', component: EditarSenhaComponent},
            {path: 'historico-tarefa', component: HistoricoTarefaComponent},
            {path: 'historico-execucao', component: HistoricoExecucaoComponent},
            {path: 'dado-negocial', component: DadoNegocialComponent},
            {path: 'config-email-tarefa', component: ConfigEmailTarefaComponent},
            {path: 'agendamento-tarefa', component: AgendamentoComponent},
            {path: 'cadastro-json-tarefa', component: DadosJsonComponent},
            {path: 'cadastro-worker', component: CadastroWorkerComponent},
        ],
        canActivate: [AuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class DefaultRoutingModule { }
