import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { concatMap, defer, forkJoin } from "rxjs";
import { ToastModule } from "primeng/toast";

@Component({
    selector: 'app-main-view-component',
    templateUrl: './app.main.view.component.html',
    styleUrls: ['./app.main.view.component.scss'],
    imports: [
        ToastModule
    ],
    providers: [
        MessageService
    ]
})
export class AppMainViewComponent {
    isMobile = window.matchMedia("(max-width: 768px)").matches;

    range: Date[] = [];

    constructor(
        private messageService: MessageService,
        private router: Router
    ) {

    }

    onNovaData(range: Date[]): void {
        this.range = range;
        this.buscarDados();
    }

    buscarDados(): void {

        
    }

    onLogOut(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
