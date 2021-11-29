import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import IngresoEgreso from '../shared/models/ingreso-egreso.model';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.scss']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm!: FormGroup;
  type = 'ingreso';
  loading = false;
  loadignSubscription!: Subscription;
  
  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) { }

  ngOnDestroy(): void {
    this.loadignSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required]
    })
    this.loadignSubscription = this.store.select('ui').subscribe(
      ui => this.loading = ui.isLoading
    )
  }

  onSave() {
    console.log(this.ingresoForm.value);
    this.store.dispatch(ui.isLoading());
    const { description, amount } = this.ingresoForm.value;
    const newIngresoEgreso = new IngresoEgreso(description, amount, this.type)
    this.ingresoEgresoService.crearIngresoEngreso(newIngresoEgreso)
      .then(docRef => {
        this.ingresoForm.reset();
        Swal.fire('Registro Creado', description, 'success');
        this.store.dispatch(ui.stopLoading());
      })
      .catch(err => Swal.fire('Registro Creado', description, 'error'));
  }

}
