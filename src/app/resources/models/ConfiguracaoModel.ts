export class Configuracao {
    tx_chave: any;
    tx_valor: any;
    id_tarefa: any;
    bo_status: any;
    num_ordem: any;

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.tx_chave =  data.tx_chave;
            this.tx_valor = data.tx_valor;
            this.id_tarefa = data.id_tarefa;
            this.bo_status = data.bo_status;
            this.num_ordem = data.num_ordem;
        }
    }
}
