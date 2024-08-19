export class ControleExecucao {
    id: any;
    tarefa_id: any;
    tx_descricao: any;
    dt_cadastro: any;
    bo_status: any;
    tx_json: any;
    bo_status_code: any;
    tx_chave: any;
    tx_situacao: any;
    tx_resumo: any;
    tx_tempo: any;
    dt_inicio: any;
    dt_fim: any;
    tx_imgbase64: any;

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.id =  data.id;
            this.tarefa_id = data.tarefa_id;
            this.bo_status = data.bo_status;
            this.tx_descricao = data.tx_descricao;
            this.dt_cadastro = data.dt_cadastro;
            this.tx_json = data.tx_json;
            this.bo_status_code = data.bo_status_code;
            this.tx_chave = data.tx_chave;
            this.tx_situacao = data.tx_situacao;
            this.tx_resumo = data.tx_resumo;
            this.tx_tempo = data.tx_tempo;
            this.dt_inicio = data.dt_inicio;
            this.dt_fim = data.dt_fim;
            this.tx_imgbase64 = data.tx_imgbase64;
        }
    }
}

