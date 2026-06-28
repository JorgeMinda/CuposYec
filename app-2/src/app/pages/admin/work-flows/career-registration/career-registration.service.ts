import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {HttpResponseInterface} from "@utils/interfaces";
import {map} from "rxjs/operators";

@Injectable(
    {providedIn: 'root'}
)
export class CareerRegistrationService {
    private readonly httpClient = inject(HttpClient);

    register(payload:any){
        const url = '';

        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
