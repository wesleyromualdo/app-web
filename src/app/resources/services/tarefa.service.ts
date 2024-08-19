import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";
import {StartTarefa, StopTarefa, Tarefa} from "../models/TarefaModel";

@Injectable({
    providedIn: 'root'
})
export class TarefaService {

    constructor(private http: RequestService) { }

    async pesquisar(bo_execucao: boolean = false, nu_cpf:string, tx_nome: string = '', bo_status:any='', automacao_id: any='', cliente_id: any = '', bo_agendada: any = '',pagina: number = 0, tamanho_pagina: number = 0){

        let url = `${URL}/tarefa?bo_execucao=${bo_execucao}&nu_cpf=${nu_cpf}&tx_nome=${tx_nome}&bo_status=${bo_status}&automacao_id=${automacao_id}&cliente_id=${cliente_id}&bo_agendada=${bo_agendada}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async gravar(model: Tarefa, file: File){
        let url = `${URL}/tarefa/`;

        let retornoTarefa = await this.http.post(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });

        let retornoScript = []
        if( file != undefined ) {
            retornoScript = await this.uploadScript(file, retornoTarefa.id, retornoTarefa.nu_cpf);
            if(retornoScript.detail && retornoScript.detail.includes('Erro')){
                return retornoScript;
            }
        }
        return retornoTarefa;
    }

    async editar(model: Tarefa, file: File){
        let url = `${URL}/tarefa/`;

        let retornoScript = []
        let temErroScript = false;
        if( file != undefined ) {
            retornoScript = await this.uploadScript(file, model.id, model.nu_cpf);
            //console.log(retornoScript);

            if(retornoScript.detail && retornoScript.detail.includes('Erro')){
                temErroScript = true;
                return retornoScript;
            }
        }
        if( !temErroScript ) {
            return this.http.put(url, model).then(result => {
                return result;
            }).catch((error) => {
                return error;
            });
        }
    }

    async agendamento(model: Tarefa){
        let url = `${URL}/tarefa/agendamento/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async grava_json_tarefa(model: Tarefa){
        let url = `${URL}/tarefa/json_tarefa/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async uploadScript(file: File, tarefa_id: any = '', nu_cpf: string = ''){
        let url = `${URL}/uploadScripts/${tarefa_id}/${nu_cpf}`;

        const formData = new FormData();
        formData.append('file', file, file.name);

        return this.http.postFile(url, formData).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async configuracaoEmail(model: Tarefa){
        let url = `${URL}/tarefa/email/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getById(id: number){
        let url = `${URL}/tarefa/${id}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getTarefaCliente(cliente_id: number){
        let url = `${URL}/tarefa/cliente/${cliente_id}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getHistoricoTarefaById(id: number, historico_id:string, dt_inicio:string, pagina?:any, tamanho_pagina?:any, exibeErro: boolean = true){
        let url = `${URL}/tarefa-historico?tarefa_id=${id}&historico_id=${historico_id}&dt_inicio=${dt_inicio}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, exibeErro).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getHistoricoTarefaByAutomacaoId(automaca_id: number, exibeErro: boolean = true){
        let url = `${URL}/tarefa/historico/automacao/${automaca_id}`;

        return this.http.get(url, exibeErro).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getHistoricoTarefaByUsuario(nu_cpf: string, bo_agendada:boolean, exibeErro: boolean = true){
        let url = `${URL}/tarefa/historico_by_usuario/${nu_cpf}/${bo_agendada}`;

        return this.http.get(url, exibeErro).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getDadosTarefaDashboard(cliente_id: number, automacao_id:number, periodo: number = 10, nu_cpf: string, exibeErro: boolean = false){
        let url = `${URL}/tarefa/dashboard?cliente_id=${cliente_id}&automacao_id=${automacao_id}&periodo=${periodo}&nu_cpf=${nu_cpf}`;

        return this.http.get(url, exibeErro).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getDadosAutomacaoDashboard(cliente_id: number, automacao_id:any='', periodo: any = 10, exibeErro: boolean = false){
        let url = `${URL}/tarefa/dashboard/dados-automacao?cliente_id=${cliente_id}&automacao_id=${automacao_id}&periodo=${periodo}`;

        return this.http.get(url, exibeErro).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getHistoricoTarefaByHistoricoId(id: number, exibeErro: boolean = true){
        let url = `${URL}/tarefa/historico-tarefa/${id}`;

        return this.http.get(url, exibeErro).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async startTarefa(model: StartTarefa){
        let url = `${URL}/tarefa/start/`;

        return this.http.post(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async stopTarefa(model: StopTarefa){
        let url = `${URL}/tarefa/stop/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    /*async getAutomacaoCliente(id: number){
        let url = `${URL}/automacao/cliente/${id}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }*/

    async excluir(id: number){
        let url = `${URL}/tarefa/${id}`;

        return this.http.delete(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

}
