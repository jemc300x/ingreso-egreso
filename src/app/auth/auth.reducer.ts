import { createReducer, on } from '@ngrx/store';
import User from '../shared/interface/user.interface';
import * as auth from './auth.actions';

export interface AuthState {
  user: User | null
};

const initialState: AuthState = {
    user: null
};

const _authReducer = createReducer(
  initialState,
  on(auth.setUser,(state, {user}) => ({...state, user: {...user}})),
  on(auth.unSetUser, state => ({...state, user: null})),
);

export function authReducer(state: any, action: any) {
  return _authReducer(state, action);
}