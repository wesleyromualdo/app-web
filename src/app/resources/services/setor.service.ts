import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";
import {Setor, SetorUsuarios} from "../models/SetorModel";

@Injectable({
    providedIn: 'root'
})
export class SetorService {

    constructor(private http: RequestService) { }

    async pesquisar(tx_sigla:any='', tx_nome:any='', bo_status:any='', pagina: number = 0, tamanho_pagina: number = 0){
        let url = `${URL}/setor?tx_sigla=${tx_sigla}&tx_nome=${tx_nome}&bo_status=${bo_status}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, false).then(result => {
            //let ret = [];
            //console.log('result', result);
            /*if (result && result.length > 0) {
                ret = result.map(() => new Setor(result));
            }*/
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async gravar(setor: Setor){
        let url = `${URL}/setor/`;

        return this.http.post(url, setor).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async editar(setor: Setor){
        let url = `${URL}/setor/`;

        return this.http.put(url, setor).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async editarUltimoAcesso(setor: SetorUsuarios){
        let url = `${URL}/setor/ultimo_acesso`;

        return this.http.put(url, setor).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getById(id: number){
        let url = `${URL}/setor/${id}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async excluir(id: number){
        let url = `${URL}/setor/${id}`;

        return this.http.delete(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

}
