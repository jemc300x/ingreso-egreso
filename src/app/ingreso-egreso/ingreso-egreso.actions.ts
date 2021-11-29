import { createAction, props } from '@ngrx/store';
import IngresoEgreso from '../shared/models/ingreso-egreso.model';

export const setItems   = createAction('[Items] Set Items', props<{items: IngresoEgreso[]}>());
export const unSetItems = createAction('[Items] Unset Items');

