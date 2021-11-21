import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { addDoc, collection, doc, getFirestore, onSnapshot, setDoc, Unsubscribe } from '@firebase/firestore';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import User from '../shared/interface/user.interface';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  db: Firestore = getFirestore();
  unSubscribe!: Unsubscribe;

  constructor(
    public auth: Auth,
    private store: Store<AppState>
  ) { }

  initAuthListener() {
    authState(this.auth).subscribe(
      user => {
        console.log(user);
        if (user) {
          this.unSubscribe = onSnapshot(doc(this.db, `${user.uid}/user`), (doc) => {
            console.log('Current user', doc.data())
            this.store.dispatch(authActions.setUser({user: {...(doc.data() as User)}}))
          });
        } else {
          console.log('Llamar unsetuser')
          this.store.dispatch(authActions.unSetUser());
          this.unSubscribe();
        }
      }
    )
  }

  crearUsuario(nombre: string, email: string, password: string) {
    // console.log(nombre, email, password);
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(({ user }) => {
        
        const newUser: User = {
          uid: user.uid,
          name: nombre,
          email
        }
        
        return setDoc(doc(this.db, `${user.uid}/user`), newUser)

      })
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isAuth() {
    return authState(this.auth)
      .pipe(
        map(user => user != null)
      );
  }

}
