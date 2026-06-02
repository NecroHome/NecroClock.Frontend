import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { ToolbarModule } from "primeng/toolbar";
import { CommonModule } from "@angular/common";
import { DialogCadastrarDemanda } from "../../ui/dialog/dialog.cadastrar.demanda";
import { DemandaModel } from "../../../models/demanda.model";
import { MessageService } from "primeng/api";
import { Toast, ToastModule } from "primeng/toast";

@Component({
    selector: 'app-top-bar-component',
    templateUrl: './app.top.bar.component.html',
    styleUrls: ['./app.top.bar.component.scss'],
    imports: [
        FormsModule, CommonModule,
        ButtonModule, DatePickerModule, ToolbarModule,
        DialogCadastrarDemanda,
        ToastModule
    ],
    providers: [
        MessageService
    ]
})
export class AppTopBarComponent implements OnInit, OnChanges {

    @Input('demandas') demandas: DemandaModel[];

    @Output('onNovaData') onNovaData: EventEmitter<Date[]> = new EventEmitter<Date[]>();
    @Output('onLogout') onLogout: EventEmitter<void> = new EventEmitter<void>();
    @Output('onCadastrarDemanda') onCadastrarDemanda: EventEmitter<DemandaModel> = new EventEmitter<DemandaModel>();
    @Output('onFiltrarDemandas') onFiltrarDemandas: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('dialogCadastrarDemanda') dialogCadastrarDemanda: DialogCadastrarDemanda;

    rangeDates: Date[] = [];

    mesAtual: string = '';
    mesAnterior: string = '';
    proximoMes: string = '';

    textoBusca: string = '';

    constructor(
        private messageService: MessageService
    ) {

    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    ngOnInit(): void {
        this.setRangeDates();
    }

    setRangeDates(modifier: number = 0): void {
        let start: Date;

        if (this.rangeDates && this.rangeDates.length === 2 && modifier !== 0) {
            const currentStart = this.rangeDates[0];

            start = new Date(
                currentStart.getFullYear(),
                currentStart.getMonth() + modifier,
                1
            );
        } else {
            const today = new Date();

            start = new Date(
                today.getFullYear(),
                today.getMonth() + modifier,
                1
            );
        }

        const end = new Date(
            start.getFullYear(),
            start.getMonth() + 1,
            0
        );

        this.rangeDates = [start, end];
        this.atuaizaMesBase();
        this.onNovaData.emit(this.rangeDates);
    }

    prevMonth(): void {
        this.setRangeDates(-1);
    }

    nextMonth(): void {
        this.setRangeDates(1);
    }

    buscarDados(): void {
        this.setRangeDates();
    }

    isSameDay(d1: Date, d2: Date): boolean {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    atuaizaMesBase(): void {
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril",
            "Maio", "Junho", "Julho", "Agosto",
            "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const mesIndex = this.rangeDates[0].getMonth();

        const prox = mesIndex === 11 ? 0 : mesIndex + 1;
        const ant = mesIndex === 0 ? 11 : mesIndex - 1;

        this.proximoMes = meses[prox];
        this.mesAnterior = meses[ant];
        this.mesAtual = meses[mesIndex];
    }

    novaDemanda(): void {
        this.dialogCadastrarDemanda.abrirParaCadastrar();
    }

    cadastrarDemanda(demanda: DemandaModel): void {
        this.onCadastrarDemanda.emit(demanda);
    }

    gerarHorasConsolidadas(): void {

        const demandasAgrupadas = new Map<string, number>();

        this.demandas.forEach(d => {
            const horasAtuais = demandasAgrupadas.get(d.numeroDemanda) ?? 0;
            demandasAgrupadas.set(d.numeroDemanda, horasAtuais + d.horas);
        });

        const consolidado = Array.from(demandasAgrupadas.entries())
            .map(([numeroDemanda, horas]) => `${numeroDemanda} - ${horas}h`)
            .join('\n');

        if (navigator.clipboard) {

            navigator.clipboard.writeText(consolidado).then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Horas consolidadas copiadas.'
                });
            });

        } else {

            const textarea = document.createElement('textarea');
            textarea.value = consolidado;

            document.body.appendChild(textarea);
            textarea.select();

            document.execCommand('copy');

            document.body.removeChild(textarea);

            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Horas consolidadas copiadas.'
            });
        }
    }

    buscar(): void {
        if (this.textoBusca == '') {
            this.buscarDados();
            return;
        }

        this.onFiltrarDemandas.emit(this.textoBusca);
    }

    logout(): void {
        this.onLogout.emit();
    }
}