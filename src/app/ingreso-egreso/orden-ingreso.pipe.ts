import { Pipe, PipeTransform } from '@angular/core';
import IngresoEgreso from '../shared/models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {

    // if (items.length === 0) return [];

    let newItems = [...items];

    return newItems.sort((a, b) => {
      if(a.type === 'ingreso') {
        return -1
      } else {
        return 1
      }
    });
  }

}
