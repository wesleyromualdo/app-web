export class PerfilMenu {
    id?: number
}

export class Perfil {
    tx_nome: any;
    tx_finalidade: any;
    bo_superuser: any;
    bo_delegar: any;
    constante_virtual: any;
    bo_status: any;
    menu?: [PerfilMenu]

    // @ts-ignore
    constructor(data?): any{
        if(data){
            this.tx_finalidade =  data.tx_finalidade;
            this.tx_nome = data.tx_nome;
            this.bo_superuser = data.bo_superuser;
            this.bo_delegar = data.bo_delegar;
            this.bo_status = data.bo_status;
            this.constante_virtual = data.constante_virtual;
            this.menu = data.menu;
        }
    }
}
