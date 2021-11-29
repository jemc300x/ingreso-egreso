import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore } from '@angular/fire/firestore';
import { signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { addDoc, collection, doc, getFirestore, onSnapshot, setDoc, Unsubscribe } from '@firebase/firestore';
import { Store } from '@ngrx/store';
import { Subscription, UnsubscriptionError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import User from '../shared/interface/user.interface';
import { Usuario } from '../shared/models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // db: Firestore = getFirestore();
  unSubscribe!: Subscription;
  private _user!: Usuario | null;

  get user() {
    return this._user;
  }

  constructor(
    public auth: AngularFireAuth,
    private store: Store<AppState>,
    private firestore: AngularFirestore
  ) { }

  initAuthListener() {
    this.auth.authState.subscribe(
      user => {
        console.log(user);
        if (user) {
          this.unSubscribe = this.firestore.doc(`${user.uid}/user`).valueChanges()
            .subscribe((firestoreUser: any) => {
              console.log('Current user', firestoreUser)
              const user = Usuario.fromFirebase(firestoreUser);
              this._user = user;
              this.store.dispatch(authActions.setUser({ user }))
          });
        } else {
          console.log('Llamar unsetuser', this.unSubscribe)
          this._user = null;
          this.store.dispatch(authActions.unSetUser());
          this.store.dispatch(ingresoEgresoActions.unSetItems());
          if (this.unSubscribe) {
            this.unSubscribe.unsubscribe();
          }
        }
      }
    )
  }

  crearUsuario(nombre: string, email: string, password: string) {
    // console.log(nombre, email, password);
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then( fuser => {
        console.log('Usuario creado', fuser);
        const newUser = new Usuario(
          fuser.user?.uid as string,
          nombre,
          email
        )
        
        return this.firestore.doc(`${fuser.user?.uid}/user`)
          .set({...newUser});

      })
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState
      .pipe(
        map(user => user != null)
      );
  }

}
