import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { concatMap, defer, forkJoin } from "rxjs";
import { ToastModule } from "primeng/toast";
import { AppTopBarComponent } from "../app.top.bar/app.top.bar.component";
import { AppMiddleComponent } from "../app.middle.view/app.middle.component";
import { DemandaModel } from "../../../models/demanda.model";
import { DemandasService } from "../../../services/demandas.service";
import { ConfirmDialog } from "primeng/confirmdialog";

@Component({
    selector: 'app-main-view-component',
    templateUrl: './app.main.view.component.html',
    styleUrls: ['./app.main.view.component.scss'],
    imports: [
        ToastModule,
        AppTopBarComponent,
        AppMiddleComponent,
        ConfirmDialog
    ],
    providers: [
        MessageService, DemandasService, ConfirmationService
    ]
})
export class AppMainViewComponent {
    isMobile = window.matchMedia("(max-width: 768px)").matches;

    range: Date[] = [];
    demandas: DemandaModel[] = [];

    constructor(
        private messageService: MessageService,
        private router: Router,
        private demandaService: DemandasService,
        private confirmationService: ConfirmationService
    ) {

    }

    onNovaData(range: Date[]): void {
        this.range = range;
        this.demandas = [];
        this.buscarDados();
    }

    cadastrarDemanda(demanda: DemandaModel): void {
        this.demandaService.addDemanda(demanda).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Demanda cadastrada com sucesso!' });
                this.buscarDados();
            }
        })
    }

    buscarDados(): void {
        this.demandaService.buscarDemandas(this.range[0], this.range[1]).subscribe({
            next: (demandas: DemandaModel[]) => {
                this.demandas = demandas;
            }
        })
    }

    adicionarHora(demanda: DemandaModel): void {
        demanda.horas = demanda.horas + 1;
        this.demandaService.updateDemanda(demanda).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Demanda atualizada com sucesso! '});
                this.buscarDados();
            }
        });
    }

    removerHora(demanda: DemandaModel): void {
        if (demanda.horas == 0) {
            this.messageService.add({ severity: 'warn', summary: 'Falha', detail: 'Não é possivel ter uma demanda com horas negativas. '});
            return;
        }

        demanda.horas = demanda.horas - 1;
        this.demandaService.updateDemanda(demanda).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Demanda atualizada com sucesso! '});
                this.buscarDados();
            }
        });
    }

    deletarDemanda(demanda: DemandaModel): void {
        this.confirmationService.confirm({
            header: 'Remover Demanda',
            message: `Confirmar remoção da demanda [${demanda.numeroDemanda}]?`,
            acceptButtonStyleClass: 'p-button-danger',
            acceptIcon: 'pi pi-trash',
            acceptLabel: 'Remover Demanda',
            accept: () => {
                this.demandaService.deleteDemanda(demanda).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucess!', detail: 'Demanda removida com sucesso!' });
                        this.buscarDados();
                    }
                });
            },
            rejectButtonStyleClass: 'p-button-secondary',
            rejectLabel: 'Cancelar',
            reject: () => {

            }
        });
    }

    onLogOut(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
