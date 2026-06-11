import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './components/interceptors/loader.component';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    imports: [
        LoaderComponent,
        RouterOutlet,
        ToastModule
    ]
})
export class App {
    protected readonly title = signal('NecroClock.Frontend');
}
