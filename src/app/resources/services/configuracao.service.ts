import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";
import {Configuracao} from "../models/ConfiguracaoModel";

@Injectable({
    providedIn: 'root'
})
export class ConfiguracaoService {

    constructor(private http: RequestService) { }

    async pesquisar(tx_nome:any='', tarefa_id:any='',bo_status:any='', pagina: number = 0, tamanho_pagina: number = 0){

        let url = `${URL}/configuracao?tx_nome=${tx_nome}&tarefa_id=${tarefa_id}&bo_status=${bo_status}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async gravar(model: Configuracao){
        let url = `${URL}/configuracao/`;

        return this.http.post(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async editar(model: Configuracao){
        let url = `${URL}/configuracao/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getById(id: number){
        let url = `${URL}/configuracao/${id}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async excluir(id: number){
        let url = `${URL}/configuracao/${id}`;

        return this.http.delete(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

}
