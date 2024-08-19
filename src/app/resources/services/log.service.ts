import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";
import {Log} from "../models/LogModel";

@Injectable({
    providedIn: 'root'
})
export class LogService {

    constructor(private http: RequestService) { }

    async pesquisar(historico_tarefa_id: any = '', tx_descricao: any='', pagina: number = 0, tamanho_pagina: number = 0){

        let url = `${URL}/logs?historico_id=${historico_tarefa_id}&tx_descricao=${tx_descricao}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async pegar_relatorio_mensal_historico_tarefa(cliente_id:any='', tarefa_id:any='', dt_inicio:any='', dt_fim:any=''){
        let url = `${URL}/logs/historico-tarefa-mensal?cliente_id=${cliente_id}&tarefa_id=${tarefa_id}&dt_inicio=${dt_inicio}&dt_fim=${dt_fim}`;
        
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

    downloadImage(log_id: any = '') {
        let url = `${URL}/logs/download-image/${log_id}`;
    
        return new Promise((resolve, reject) => {
            this.http.downloadFile(url).subscribe(data => {
                const blob = new Blob([data], { type: 'image/png' });
                const imageUrl = window.URL.createObjectURL(blob);
                resolve(imageUrl); // Resolve a Promise com o URL da imagem
            }, error => {
                reject(error); // Rejeita a Promise se ocorrer um erro
            });
        });
    }

}
