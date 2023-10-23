import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";
import {Automacao} from "../models/AutomacaoModel";

@Injectable({
    providedIn: 'root'
})
export class AutomacaoService {

    constructor(private http: RequestService) { }

    async pesquisar(setor_id:any='', tx_nome:any='', bo_status:any='', nu_cpf:any='', pagina: number = 0, tamanho_pagina: number = 0){

        let url = `${URL}/automacao?setor_id=${setor_id}&tx_nome=${tx_nome}&bo_status=${bo_status}&nu_cpf=${nu_cpf}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async gravar(model: Automacao){
        let url = `${URL}/automacao/`;

        return this.http.post(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async pesquisarExecutor(automacao_id:any='', setor_id:any='', pagina: number = 0, tamanho_pagina: number = 0){

        let url = `${URL}/executor?automacao_id=${automacao_id}&setor_id=${setor_id}&pagina=${pagina}&tamanho_pagina=${tamanho_pagina}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    download(automacao_id: any = '', filename='', snackBar:any, spinner: any){
        let url = `${URL}/download/executor/${automacao_id}`;

        // @ts-ignore
        spinner.show();
        return this.http.downloadFile(url).subscribe(data => {
            const blob = new Blob([data], {
                type: 'application/zip'
            });
            if( blob.size < 1000){
                snackBar.open(`Não foi possível realizar o download do ${filename}.zip! Verifique se a quantidade de download foi atingida.`, '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000
                });
                spinner.hide();
            } else {
                var a = document.createElement("a");
                document.body.appendChild(a);
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = filename+'.zip';
                a.click();
                console.log(url);
                //window.open(url);
                window.URL.revokeObjectURL(url);
                a.remove();
                spinner.hide();
            }
        });
    }

    async gravarExecutor(model: Automacao){
        let url = `${URL}/automacao/executor/`;

        return this.http.post(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async editar(model: Automacao){
        let url = `${URL}/automacao/`;

        return this.http.put(url, model).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getById(id: number){
        let url = `${URL}/automacao/${id}`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async getAutomacaoBySetor(id: number){
        let url = `${URL}/automacao/setor/${id}`;

        return this.http.get(url, false).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async excluir(id: number){
        let url = `${URL}/automacao/${id}`;

        return this.http.delete(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

    async stop_executor(id: number){
        let url = `${URL}/executor/stop/${id}`;

        return this.http.put(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

}
