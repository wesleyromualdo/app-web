export class Log {

    historico_tarefa_id: any;
    tx_descricao: any;
    tx_acao_auxiliar: any;
    dt_inclusao: any;
    tx_status: any;
    tx_json: any;

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.historico_tarefa_id =  data.historico_tarefa_id;
            this.tx_descricao = data.tx_descricao;
            this.tx_acao_auxiliar = data.tx_acao_auxiliar;
            this.dt_inclusao = data.dt_inclusao;
            this.tx_status = data.tx_status;
            this.tx_json = data.tx_json;
        }
    }
}
