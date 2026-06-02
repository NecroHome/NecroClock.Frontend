import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DemandaModel } from "../models/demanda.model";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable()
export class DemandasService {
    constructor (
        private http: HttpClient
    ) {

    }

    addDemanda(demanda: DemandaModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.demandaContext}AddDemanda`, demanda);
    }

    buscarDemandas(inicio: Date, fim: Date): Observable<DemandaModel[]> {
        return this.http.get<DemandaModel[]>(`${environment.demandaContext}GetDemandas?inicio=${this.formatDateOnly(inicio)}&fim=${this.formatDateOnly(fim)}`);
    }

    updateDemanda(demanda: DemandaModel): Observable<boolean> {
        return this.http.put<boolean>(`${environment.demandaContext}UpdateDemanda`, demanda);
    }

    filtrarDemandas(busca: string): Observable<DemandaModel[]> {
        return this.http.get<DemandaModel[]>(`${environment.demandaContext}FiltrarDemandas?busca=${busca}`);
    }

    deleteDemanda(demanda: DemandaModel): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.demandaContext}DeleteDemanda?demandaID=${demanda.id}`);
    }

    private formatDateOnly(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}