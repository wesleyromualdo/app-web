import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";
import {StartTarefa, StopTarefa, Tarefa} from "../models/TarefaModel";
import {TarefaHistorico} from "../models/TarefaHistoricoModel";

@Injectable({
    providedIn: 'root'
})
export class DadoNegocialService {

    constructor(private http: RequestService) { }

    async pesquisar(historico_id: any, tx_descricao:string, tx_status:any='', pagina: number = 0, tamanho_pagina: number = 0){

        let url = `${URL}/dadosnegocial?historico_id=${historico_id}&tx_descricao=${tx_descricao}&tx_status=${tx_status}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    /*async gravar(model: Tarefa){
        let url = `${URL}/tarefa/`;

        return this.http.post(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async editar(model: Tarefa){
        let url = `${URL}/tarefa/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }*/

    async getById(id: number){
        let url = `${URL}/dadosnegocial/${id}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

}
