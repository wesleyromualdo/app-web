export class Tarefa {
    id: any;
    automacao_id: any;
    nu_cpf: any;
    tx_nome: any;
    bo_execucao: any;
    dt_inclusao: any;
    bo_agendada: any;
    tx_situacao: any;
    json_agendamento: any;
    bo_status: any;
    tx_assunto_inicia: any;
    tx_corpo_email_inicia: any;
    tx_assunto_finaliza: any;
    tx_corpo_email_finaliza: any;
    tx_nome_script?: any;
    tipo:any;
    bo_email:any;
    anexo_script_id:any;
    tx_json:any;
    nu_prioridade:any;

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.id =  data.id;
            this.automacao_id =  data.automacao_id;
            this.nu_cpf = data.nu_cpf;
            this.tx_nome = data.tx_nome;
            this.bo_execucao = data.bo_execucao;
            this.dt_inclusao = data.dt_inclusao;
            this.bo_agendada = data.bo_agendada;
            this.tx_situacao = data.tx_situacao;
            this.json_agendamento = data.json_agendamento;
            this.bo_status = data.bo_status;
            this.tx_assunto_inicia = data.tx_assunto_inicia;
            this.tx_corpo_email_inicia = data.tx_corpo_email_inicia;
            this.tx_assunto_finaliza = data.tx_assunto_finaliza;
            this.tx_corpo_email_finaliza = data.tx_corpo_email_finaliza;
            this.tx_nome_script = data.tx_nome_script;
            this.bo_email = data.bo_email;
            this.anexo_script_id = data.anexo_script_id;
            this.tx_json = data.tx_json;
            this.nu_prioridade = data.nu_prioridade;
        }
    }
}

export class StartTarefa {
    tarefa_id: any;
    cliente_id: any;
    automacao_id: any;
    nu_cpf: any;
    tx_json: any;

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.tarefa_id =  data.tarefa_id;
            this.cliente_id =  data.cliente_id;
            this.automacao_id =  data.automacao_id;
            this.nu_cpf = data.nu_cpf;
            this.tx_json = data.tx_json;
        }
    }
}

export class StopTarefa{
    tarefa_id: any;
    dt_fim: any;
    bo_status_code: any;
    tx_resumo: any;

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.tarefa_id =  data.tarefa_id;
            this.dt_fim = data.dt_fim;
            this.bo_status_code = data.bo_status_code;
            this.tx_resumo = data.tx_resumo;
        }
    }
}
