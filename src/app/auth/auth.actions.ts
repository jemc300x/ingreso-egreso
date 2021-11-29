import { createAction, props } from '@ngrx/store';
import User from '../shared/interface/user.interface';
import { Usuario } from '../shared/models/usuario.model';

export const setUser = createAction(
  '[Auth] Set User',
  props<{user: Usuario}>()
);

export const unSetUser = createAction(
  '[Auth] Un Set User',
);
