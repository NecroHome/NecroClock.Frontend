import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { DemandaModel } from "../../../models/demanda.model";
import { DatePickerModule } from "primeng/datepicker";

@Component({
    selector: 'dialog-cadastrar-demanda',
    templateUrl: './dialog.cadastrar.demanda.html',
    styleUrls: ['./dialog.cadastrar.demanda.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        DialogModule, ButtonModule, InputNumberModule, DatePickerModule
    ]
})
export class DialogCadastrarDemanda implements OnInit {
    display: boolean = false;
    titulo: string = 'Cadastrar Demanda';
    modoEditar: boolean = false;
    demanda: DemandaModel;

    formDemanda: FormGroup;

    @Output() onCadastrarDemanda: EventEmitter<DemandaModel> = new EventEmitter<DemandaModel>();

    constructor(
        private fb: FormBuilder
    ) {

    }

    ngOnInit(): void {
        this.formDemanda = this.fb.group({
            id: [0],
            data: [new Date()],
            numeroDemanda: ['', Validators.required],
            descricao: [''],
            horas: [0],
            userID: [0]
        });
    }

    abrirParaCadastrar(): void {
        this.titulo = 'Cadastrar Demanda';
        this.formDemanda.reset({
            id: 0,
            data: new Date(),
            numeroDemanda: '',
            descricao: '',
            horas: 0,
            userID: 0
        });

        this.modoEditar = false;
        this.display = true;
    }

    abrirParaEditar(demanda: DemandaModel): void {
        this.titulo = 'Editar Demanda';
        this.formDemanda.patchValue(demanda);

        const [ano, mes, dia] = demanda.data.split('-').map(Number);
        this.formDemanda.patchValue({ data: new Date(ano, mes - 1, dia) });
        
        this.modoEditar = true;
        this.demanda = demanda;
        this.display = true;
    }

    salvar(): void {
        if (this.formDemanda.invalid) return;

        const demanda: DemandaModel = {
            ...this.demanda,
            ...this.formDemanda.value,
            data: this.formatDateOnly(this.formDemanda.value.data as Date)
        };

        this.onCadastrarDemanda.emit(demanda);
        this.display = false;
    }

    cancelar(): void {
        this.display = false;
    }

    private formatDateOnly(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}