import { Injectable } from '@angular/core';
import { URL } from 'src/app/resources/util/constants';
import {RequestService} from "./request.service";

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor(private http: RequestService) { }

    async getHostName(){
        let url = `${URL}/ip_local`;

        return this.http.get(url).then(result => {
            return result;
        }).catch((error) => {
            return error;
        });
    }

}
