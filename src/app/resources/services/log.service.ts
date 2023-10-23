import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";
import {Log} from "../models/LogModel";

@Injectable({
    providedIn: 'root'
})
export class LogService {

    constructor(private http: RequestService) { }

    async pesquisar(historico_tarefa_id: any = '', tx_acao_auxiliar: any='', tx_descricao: any='', pagina: number = 0, tamanho_pagina: number = 0){

        let url = `${URL}/logs?historico_id=${historico_tarefa_id}&tx_acao_auxiliar=${tx_acao_auxiliar}&tx_descricao=${tx_descricao}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async gravar(model: Log){
        let url = `${URL}/logs/`;

        return this.http.post(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async editar(model: Log){
        let url = `${URL}/logs/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getById(id: number){
        let url = `${URL}/logs/${id}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async excluir(id: number){
        let url = `${URL}/logs/${id}`;

        return this.http.delete(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

}
