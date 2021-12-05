import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import IngresoEgreso from '../../shared/models/ingreso-egreso.model';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { AppStateWithIngresoEgreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.scss']
})
export class EstadisticaComponent implements OnInit {

  ingresos = 0;
  egresos  = 0;

  totalEgresos  = 0;
  totalIngresos = 0;

  public doughnutChartLabels: Label[] = ['Ingresos', 'Engresos'];
  public doughnutChartData: MultiDataSet = [[]];
  public doughnutChartType: ChartType = 'doughnut';


  constructor(private store: Store<AppStateWithIngresoEgreso>) { }

  ngOnInit(): void {
    this.store.select('ingresoEgreso').subscribe(
      ({items}) => this.generarEstadistica(items)
    )
  }

  generarEstadistica(items: IngresoEgreso[]) {
    console.log(items)
    this.totalEgresos = 0
    this.totalIngresos = 0
    this.egresos = 0
    this.ingresos = 0

    for (const item of items) {
      if(item.type === 'ingreso') {
        this.totalIngresos += item.amount;
        this.ingresos++;
      } else {
        this.totalEgresos += item.amount;
        this.egresos++;
      }
    }

    this.doughnutChartData = [[this.totalIngresos, this.totalEgresos]]
  }
}
