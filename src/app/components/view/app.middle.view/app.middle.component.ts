import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmationService } from "primeng/api";
import { CardModule } from "primeng/card";
import { DemandaModel } from "../../../models/demanda.model";

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

    @Output('onAdicionarHora') onAdicionarHora: EventEmitter<DemandaModel> = new EventEmitter<DemandaModel>();
    @Output('onRemoverHora') onRemoverHora: EventEmitter<DemandaModel> = new EventEmitter<DemandaModel>();
    @Output('onDeletarDemanda') onDeletarDemanda: EventEmitter<DemandaModel> = new EventEmitter<DemandaModel>();

    constructor(
        private confirmationService: ConfirmationService
    ) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["demandas"]) {
            this.gerarSemanas();
            this.gerarConsolidado();
        }
    }

    gerarSemanas(): void {

        const dataInicioMes = new Date(this.mes[0]);
        const dataFimMes = new Date(this.mes[1]);

        dataInicioMes.setHours(0, 0, 0, 0);
        dataFimMes.setHours(0, 0, 0, 0);

        const semanas: any[] = [];

        let inicioSemana = new Date(dataInicioMes);
        let numeroSemana = 1;

        while (inicioSemana <= dataFimMes) {

            const fimSemana = new Date(inicioSemana);

            while (
                fimSemana.getDay() !== 6 && // Sábado
                fimSemana < dataFimMes
            ) {
                fimSemana.setDate(fimSemana.getDate() + 1);
            }

            const demandasSemana = this.demandas.filter(d => {

                const data = this.parseDateOnly(d.data);

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
            inicioSemana.setDate(inicioSemana.getDate() + 1);
        }

        this.semanas = semanas;
    }

    gerarConsolidado(): void {

        const mapa = new Map<string, any>();

        for (const demanda of this.demandas) {

            let item = mapa.get(demanda.numeroDemanda);

            if (!item) {

                item = {
                    numeroDemanda: demanda.numeroDemanda,
                    descricao: demanda.descricao,
                    horas: 0
                };

                mapa.set(demanda.numeroDemanda, item);
            }

            item.horas += demanda.horas;
        }

        this.consolidado = Array
            .from(mapa.values())
            .sort((a, b) =>
                a.numeroDemanda.localeCompare(b.numeroDemanda));
    }

    private parseDateOnly(value: string): Date {
        const [ano, mes, dia] = value.split('-').map(Number);
        return new Date(ano, mes - 1, dia);
    }

    adicionarHoras(item: DemandaModel): void {
        this.onAdicionarHora.emit(item);
    }

    removerHoras(item: DemandaModel): void {
        this.onRemoverHora.emit(item);
    }

    deletarDemanda(item: DemandaModel): void {
        this.onDeletarDemanda.emit(item);
    }
}
