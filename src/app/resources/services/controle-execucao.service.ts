import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";
import {Cliente, ClienteUsuarios} from "../models/ClienteModel";
import { ControleExecucao } from '../models/ControleExecucaoModel';

@Injectable({
    providedIn: 'root'
})
export class ControleExecucaoService {

    constructor(private http: RequestService) { }

    async pesquisar(tarefa_id:any='', tx_chave:any='', tx_descricao:any='', bo_status:any='', pagina: number = 0, tamanho_pagina: number = 0){
        let url = `${URL}/controleexecucao?tarefa_id=${tarefa_id}&tx_chave=${tx_chave}&tx_descricao=${tx_descricao}&bo_status=${bo_status}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async pesquisar_dash(tarefa_id:any='', cliente_id:any='', tx_chave:any='', dt_inicio:any='', dt_fim:any='', tx_descricao:any='', tx_situacao:any='',pagina: number = 0, tamanho_pagina: number = 0){
        let url = `${URL}/controleexecucao/dash?tarefa_id=${tarefa_id}&cliente_id=${cliente_id}&tx_chave=${tx_chave}&dt_inicio=${dt_inicio}&dt_fim=${dt_fim}&tx_descricao=${tx_descricao}&tx_situacao=${tx_situacao}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;
        
        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async gravar(controle: ControleExecucao){
        let url = `${URL}/controleexecucao/`;

        return this.http.post(url, controle).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async editar(controle: ControleExecucao){
        let url = `${URL}/controleexecucao/`;

        return this.http.put(url, controle).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getByIdTarefa(tarefa_id: number){
        let url = `${URL}/controleexecucao/${tarefa_id}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getByIdTarefaChave(tarefa_id: number, tx_chave:any){
        let url = `${URL}/controleexecucao/chave/${tarefa_id}/${tx_chave}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async excluir(id: number){
        let url = `${URL}/controleexecucao/${id}`;

        return this.http.delete(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    downloadImage(controle_id: any = '') {
        let url = `${URL}/controleexecucao/download-image/${controle_id}`;
    
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
