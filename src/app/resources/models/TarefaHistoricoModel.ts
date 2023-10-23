export class TarefaHistorico {
    id: any;
    tarefa_id: any;
    nu_cpf: any;
    dt_inicio: any;
    dt_fim: any;
    bo_status_code: any;
    tx_resumo: any;
    tx_json: any;

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.id =  data.id;
            this.tarefa_id =  data.tarefa_id;
            this.nu_cpf = data.nu_cpf;
            this.dt_inicio = data.dt_inicio;
            this.dt_fim = data.dt_fim;
            this.bo_status_code = data.bo_status_code;
            this.tx_resumo = data.tx_resumo;
            this.tx_json = data.tx_json;
        }
    }
}
