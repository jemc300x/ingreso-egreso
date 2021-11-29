import { Component, OnDestroy, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as IngresoEgreso from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubscription!: Subscription;
  ingresoSubscription!: Subscription;

  constructor(
    private readonly store: Store<AppState>,
    private readonly ingresoEgresoService: IngresoEgresoService
  ) { }
  
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.ingresoSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('user')
    .pipe(
      filter(auth => auth.user !== null)
    )
    .subscribe(({user}) => {
        console.log(user)
        this.ingresoSubscription = this.ingresoEgresoService.initIngresosEgresosListening(user?.uid as string)
          .subscribe(ingresoEgreso => {
            // console.log(ingresoEgreso);
            this.store.dispatch(IngresoEgreso.setItems({items: ingresoEgreso}));
          });
      },
      err => console.error(err)
    );
  }

}
