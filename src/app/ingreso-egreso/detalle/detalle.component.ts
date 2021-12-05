import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import IngresoEgreso from '../../shared/models/ingreso-egreso.model';
import Swal from 'sweetalert2';
import { AppStateWithIngresoEgreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresoEgreso: IngresoEgreso[] = [];
  ingresoSubs!: Subscription;

  constructor(
    private store: Store<AppStateWithIngresoEgreso>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }
  
  ngOnDestroy(): void {
    this.ingresoSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.ingresoSubs = this.store.select('ingresoEgreso').subscribe(({items}) => this.ingresoEgreso = items);
  }

  onDelete(uid: string | undefined) {
    console.log('uid', uid);

    this.ingresoEgresoService.deleteIngresoEgreso(uid as string)
      .then(() => Swal.fire('Borrado','Item Borrado', 'success'))
      .catch(err => Swal.fire('Error', err.message, 'error'))

  }

}
