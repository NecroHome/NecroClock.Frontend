import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmationService, MessageService } from "primeng/api";
import { CardModule } from "primeng/card";
import { DemandaModel } from "../../../models/demanda.model";
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
import { DialogCadastrarDemanda } from "../../ui/dialog/dialog.cadastrar.demanda";

@Component({
    selector: 'app-middle-component',
    templateUrl: './app.middle.component.html',
    styleUrls: ['./app.middle.component.scss'],
    imports: [
        CommonModule, FormsModule,
        CardModule, TableModule, ButtonModule,
        ToastModule, DialogCadastrarDemanda
    ],
    providers: [
        ConfirmationService, MessageService
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
    @Output('onEditarDemanda') onEditarDemanda: EventEmitter<DemandaModel> = new EventEmitter<DemandaModel>();

    @ViewChild('dialogCadastrarDemanda') dialogCadastrarDemanda: DialogCadastrarDemanda;

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["demandas"]) {
            this.gerarSemanas();
            this.gerarConsolidado();
        }
    }

    gerarSemanas(): void {

        if (!this.demandas.length) {
            this.semanas = [];
            return;
        }

        const semanasMap = new Map<string, any>();

        this.demandas.forEach(demanda => {

            const data = this.parseDateOnly(demanda.data);

            // Domingo da semana
            const inicioSemana = new Date(data);
            inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
            inicioSemana.setHours(0, 0, 0, 0);

            // Sábado da semana
            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(fimSemana.getDate() + 6);

            const chaveSemana = inicioSemana.toISOString().split('T')[0];

            if (!semanasMap.has(chaveSemana)) {
                semanasMap.set(chaveSemana, {
                    inicio: new Date(inicioSemana),
                    fim: new Date(fimSemana),
                    demandas: []
                });
            }

            semanasMap.get(chaveSemana).demandas.push(demanda);
        });

        this.semanas = Array.from(semanasMap.values())
            .sort((a, b) => a.inicio.getTime() - b.inicio.getTime())
            .map((semana, index) => ({
                numeroSemana: index + 1,
                ...semana
            }));
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

    copiarNumeroDemandaEDescricao(item: DemandaModel): void {
        const resultado: string = `${item.numeroDemanda} - ${item.descricao}`;
        if (navigator.clipboard) {

            navigator.clipboard.writeText(resultado).then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Horas consolidadas copiadas.'
                });
            });

        } else {

            const textarea = document.createElement('textarea');
            textarea.value = resultado;

            document.body.appendChild(textarea);
            textarea.select();

            document.execCommand('copy');

            document.body.removeChild(textarea);

            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Dados da demanda copiado com sucesso.'
            });
        }
    }

    editarDemanda(item: DemandaModel): void {
        this.dialogCadastrarDemanda.abrirParaEditar(item);
    }

    cadastrarDemanda(item: DemandaModel): void {
        this.onEditarDemanda.emit(item);
    }
}
