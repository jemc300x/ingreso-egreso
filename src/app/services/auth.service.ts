import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { addDoc, doc, getFirestore, setDoc } from '@firebase/firestore';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  db: Firestore = getFirestore();

  constructor(public auth: Auth) { }

  initAuthListener() {
    authState(this.auth).subscribe(
      user => {
        console.log(user);
      }
    )
  }

  crearUsuario(nombre: string, email: string, password: string) {
    // console.log(nombre, email, password);
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(({ user }) => {
        
        return setDoc(doc(this.db, `${user.uid}/user`), {email, nombre, uid: user.uid})

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
