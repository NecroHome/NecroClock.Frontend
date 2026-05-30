import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmationService } from "primeng/api";
import { CardModule } from "primeng/card";

@Component({
    selector: 'app-middle-component',
    templateUrl: './app.middle.component.html',
    styleUrls: ['./app.middle.component.scss'],
    imports: [
        CommonModule, FormsModule,
        CardModule, TableModule, ButtonModule
    ],
    providers: [
        ConfirmationService
    ]
})
export class AppMiddleComponent implements OnChanges {

    semanas: any[] = [];
    consolidado: any[] = [];

    @Input('demandas') demandas: any[] = [];
    @Input('mes') mes: Date[];

    constructor(
        private confirmationService: ConfirmationService
    ) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["mes"]) {
            this.gerarSemanas();
            this.gerarConsolidado();
        }
    }

    gerarSemanas(): any[] {
        const dataInicioMes: Date = this.mes[0];
        const dataFimMes: Date = this.mes[1];

        const semanas: any[] = [];

        let inicioSemana = new Date(dataInicioMes);
        let numeroSemana = 1;

        while (inicioSemana <= dataFimMes) {

            let fimSemana = new Date(inicioSemana);

            while (
                fimSemana.getDay() !== 5 &&
                fimSemana < dataFimMes
            ) {
                fimSemana.setDate(fimSemana.getDate() + 1);
            }

            const demandasSemana = this.demandas.filter(d => {

                const data = new Date(d.data);

                return data >= inicioSemana &&
                    data <= fimSemana;
            });

            semanas.push({
                numeroSemana,
                inicio: new Date(inicioSemana),
                fim: new Date(fimSemana),
                demandas: demandasSemana
            });

            numeroSemana++;

            inicioSemana = new Date(fimSemana);
            inicioSemana.setDate(inicioSemana.getDate() + 3);
        }

        return semanas;
    }

    gerarConsolidado(): any[] {

        const mapa = new Map<string, any>();

        for (const demanda of this.demandas) {

            if (!mapa.has(demanda.numeroDemanda)) {

                mapa.set(demanda.numeroDemanda, {
                    numeroDemanda: demanda.numeroDemanda,
                    descricao: demanda.descricao,
                    horas: 0
                });
            }

            mapa.get(demanda.numeroDemanda).horas += demanda.horas;
        }

        return [...mapa.values()]
            .sort((a, b) =>
                a.numeroDemanda.localeCompare(b.numeroDemanda));
    }
}
