import { createAction, props } from '@ngrx/store';
import User from '../shared/interface/user.interface';

export const setUser = createAction(
  '[Auth] Set User',
  props<{user: User}>()
);

export const unSetUser = createAction(
  '[Auth] Un Set User',
);
