import { createReducer, on } from '@ngrx/store';
import IngresoEgreso from '../shared/models/ingreso-egreso.model';
import * as ingresoEgreso from './ingreso-egreso.actions';

export interface State {
  items: IngresoEgreso[]
};

const initialState: State = {
  items: []
};

const _ingresoEgresoReducer = createReducer(
  initialState,
  on(ingresoEgreso.setItems, (state, {items}) => ({...state, items: [...items]})),
  on(ingresoEgreso.unSetItems, state => ({...state, items: []})),
);

export function ingresoEgresoReducer(state: any, action: any) {
  return _ingresoEgresoReducer(state, action);
}